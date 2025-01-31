import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Pressable,
  Platform,
} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {AppColors} from '../../utils/color';
import AppFonts from '../../utils/appFonts';
import AuthTitle from '../../components/AuthTitle';
import GlobalIcon from '../../components/GlobalIcon';
import {hp} from '../../utils/constant';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {
  getQuestionaire,
  submitAnswer,
} from '../../store/questionaire/questionaireActions';
import {showMessage} from '../../store/common/commonSlice';
import AppButton from '../../components/AppButton';
import AppLoader from '../../components/AppLoader';
import {getUser} from '../../store/user/userActions';
import AppInput from '../../components/AppInput';
import AppDropdown from '../../components/AppDropDown';
import { useKeyboard } from '../../utils/keyboard';

const Questionnaire = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const keyboardHeight = useKeyboard();
  const signupToken = useAppSelector(state => state.userSlices.signupToken);
  const token = useAppSelector(state => state.userSlices.token);
  const questionaire = useAppSelector(state => state.questionaire.questionaire);
  const isLoading = useAppSelector(state => state.commonSlice.isLoading);
  const user = useAppSelector(state => state.userSlices.user) as any;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState(questionaire?.questions);
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      setCurrentQuestion(0);
      setLoading(true);
      await dispatch(getQuestionaire(signupToken || token || '')).unwrap();
      setLoading(false);
    })();
  }, [isFocused]);

  useEffect(() => {
    setQuestions(questionaire?.questions);
  }, [questionaire?.questions]);

  const handleSkip = async () => {
    if (currentQuestion < questionaire?.questions?.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      let answerdArray: any = [];
      questions.forEach((element: any) => {
        element.choices.forEach((item: any) => {
          if (item?.isSelected == true) {
            answerdArray.push({
              choiceSelected: item?.sequence,
              question: element?._id,
            });
          }
        });
      });
      const res = await dispatch(
        submitAnswer({
          answers: answerdArray,
          signupToken: signupToken || token,
        }),
      ).unwrap();
      if (res.success == true) {
        dispatch(getUser(user?._id));
        if (token) {
          setQuestions([]);
          setCurrentQuestion(0);
          navigation.goBack();
        } else {
          setQuestions([]);
          setCurrentQuestion(0);
          navigation.navigate('verifycode');
        }
      }
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleSelectAnswer = (selectedOption: any) => {
    setQuestions((prevQuestions: any) =>
      prevQuestions.map((question: any) => {
        if (question._id === questionaire.questions[currentQuestion]._id) {
          return {
            ...question,
            choices: question.choices.map((option: any) => {
              if (option._id === selectedOption._id) {
                return {...option, isSelected: true};
              } else {
                return {...option, isSelected: false};
              }
            }),
          };
        }
        return question;
      }),
    );
  };
  const handleAmountChange = (text: string) => {
    setQuestions((prevQuestions: any) =>
      prevQuestions.map((question: any, index: number) =>
        index === currentQuestion
          ? {
              ...question,
              answer: {
                ...question.answer,
                answer: text,
              },
            }
          : question,
      ),
    );
  };

  const handleAnswer = async () => {
    if (questions[currentQuestion]?.type == 'radio') {
      const check = questions[currentQuestion]?.choices?.some(
        (item: any) => item?.isSelected == true,
      );
      if (!check) {
        dispatch(showMessage('Please select an option to Save & Continue.'));
        return;
      }
    }
    if (
      (questions[currentQuestion]?.type == 'amount' &&
        !questions[currentQuestion]?.answer) ||
      questions[currentQuestion]?.answer?.answer == ''
    ) {
      dispatch(
        showMessage(
          'Please enter text in the field before clicking the Save & Continue button.',
        ),
      );
      return;
    }
    if (
      questions[currentQuestion]?.type == 'dropdown' &&
      !questions[currentQuestion]?.answer
    ) {
      dispatch(showMessage('Please select an option to Save & Continue.'));
      return;
    }
    if (currentQuestion < questions?.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      let answerdArray: any = [];
      questions.forEach((question: any) => {
        question.choices.forEach((choice: any) => {
          if (choice?.isSelected === true) {
            answerdArray.push({
              choiceSelected: choice?.sequence,
              question: question?._id,
            });
          }
        });
        if (question?.type === 'amount' && question?.answer?.answer) {
          answerdArray.push({
            answer: question.answer.answer,
            question: question._id,
          });
        }
        if (question?.type === 'dropdown' && question?.answer?.answer) {
          answerdArray.push({
            choiceSelected: question?.answer?.answer?.sequence,
            question: question?._id,
          });
        }
      });
      const res = await dispatch(
        submitAnswer({
          answers: answerdArray,
          signupToken: signupToken || token,
        }),
      ).unwrap();
      if (res.success == true) {
        await dispatch(getUser(user?._id));
        if (token) {
          setQuestions([]);
          setCurrentQuestion(0);
          navigation.goBack();
        } else {
          setQuestions([]);
          setCurrentQuestion(0);
          navigation.navigate('verifycode');
        }
      }
    }
  };

  return (
    <>
      {loading ? (
        <View style={styles.loader}>
          <AppLoader />
        </View>
      ) : (
        <View style={styles.container}>
          <StatusBar translucent backgroundColor="transparent" />
          <View style={styles.header}>
            <Pressable onPress={() => handleBack()} style={styles.backButton}>
              <GlobalIcon
                library="Feather"
                name="arrow-left"
                size={24}
                color={AppColors.black}
              />
            </Pressable>
            <View style={styles.progressContainer}>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${
                        ((currentQuestion + 1) /
                          questionaire?.questions?.length) *
                        100
                      }%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                <Text style={styles.changedNum}>{currentQuestion + 1}</Text>/
                {questionaire?.questions?.length}
              </Text>
            </View>
          </View>

          <AuthTitle
            title={questionaire?.title}
            titleColor="#1F1F1F"
            titleSize={18}
            titleWeight="700"
          />

        {currentQuestion == 0 && <AuthTitle
            subTitle={questionaire?.description}
            subtitleStyle={styles.subTitle}
          />}

         {questionaire?.questions?.length > 0 && questionaire?.questions[currentQuestion]?.title && <AuthTitle
            title={questionaire?.questions[currentQuestion]?.title || ''}
            titleColor={AppColors.processbar}
            titleSize={20}
            titleWeight="700"
            index={questionaire?.questions[currentQuestion]?.sequence || 0}
            titleStyle={currentQuestion != 0 ? {marginTop: 10} : {}}
          />}

          <ScrollView
            contentContainerStyle={styles.scrollView}
            showsVerticalScrollIndicator={false}>
            {questionaire?.questions?.length > 0 &&
              questionaire?.questions[currentQuestion]?.description && (
                <Text style={styles.questionText}>
                  {questionaire?.questions[currentQuestion]?.description}
                </Text>
              )}
            {questionaire?.questions?.length > 0 &&
              questionaire?.questions[currentQuestion]?.question && (
                <Text style={[styles.questionSubText, {marginTop: 10}]}>
                  {questionaire?.questions[currentQuestion]?.question}
                </Text>
              )}
            {questions?.length > 0 && (
              <View>
                {questions[currentQuestion]?.type === 'amount' ? (
                  <View style={styles.inputContainer}>
                    <AppInput
                      placeholder="$0.00"
                      keyboardType="numeric"
                      value={questions[currentQuestion]?.answer?.answer || ''}
                      onChangeText={text => handleAmountChange(text)}
                    />
                  </View>
                ) : questions[currentQuestion]?.type === 'dropdown' ? (
                  <View style={[styles.inputContainer, {marginTop: hp(-2)}]}>
                    <AppDropdown
                      placeholder="Select an option"
                      data={
                        questions[currentQuestion]?.choices.map(
                          (choice: any) => ({
                            label: choice.title,
                            value: choice._id,
                            ...choice,
                          }),
                        ) || []
                      }
                      value={
                        questions[currentQuestion]?.choices.find(
                          (item: any) =>
                            item?.sequence ==
                            questions[currentQuestion]?.answer?.choiceSelected,
                        )?.title || questions[currentQuestion]?.answer?.answer || ''
                      }
                      labelType={true}
                      onChangeText={text => handleAmountChange(text)}
                      onConfirmSelectItem={(item: any) =>
                        handleSelectAnswer(item)
                      }
                      error={questions[currentQuestion]?.error || ''}
                    />
                  </View>
                ) : (
                  questions[currentQuestion]?.choices?.map(
                    (option: any, index: number) => (
                      <View
                        key={index}
                        style={[
                          styles.optionContainer,
                          index === 0 && {marginTop: 15},
                        ]}>
                        <Pressable
                          onPress={() => handleSelectAnswer(option)}
                          style={[styles.circle]}>
                          {option?.isSelected && (
                            <View style={styles.innerCircle} />
                          )}
                        </Pressable>

                        <View style={styles.optionTextContainer}>
                          <Text style={styles.optionText}>{option?.title}</Text>
                          <Text style={styles.optionDescription}>
                            {option?.description}
                          </Text>
                        </View>
                      </View>
                    ),
                  )
                )}
              </View>
            )}
            {/* {questions?.length > 0 &&
              questions[currentQuestion]?.choices?.map(
                (option: any, index: number) => {
                  return (
                    <View
                      key={index}
                      style={[
                        styles.optionContainer,
                        index == 0 && {marginTop: 0},
                      ]}>
                      <Pressable
                        onPress={() => handleSelectAnswer(option)}
                        style={[styles.circle]}>
                        {option?.isSelected && (
                          <View style={styles.innerCircle} />
                        )}
                      </Pressable>

                      <View style={styles.optionTextContainer}>
                        <Text style={styles.optionText}>{option?.title}</Text>
                        <Text style={styles.optionDescription}>
                          {option?.description}
                        </Text>
                      </View>
                    </View>
                  );
                },
              )} */}
          </ScrollView>
          {/* <TouchableOpacity style={styles.continueButton} onPress={handleAnswer}>
        <LinearGradient
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}
          colors={[AppColors.primary, AppColors.secondary]}
          style={styles.LoginBtn}>
          <Text style={styles.continueText}>
            {currentQuestion < questionaire?.questions?.length - 1
              ? 'Save & Continue'
              : 'Submit'}
          </Text>
        </LinearGradient>
      </TouchableOpacity> */}
        <View style={Platform.OS == "ios" ? {paddingBottom: keyboardHeight - hp(2)} : {}}>
        <AppButton
            disabled={isLoading}
            loading={isLoading}
            onPress={handleAnswer}
            title={
              currentQuestion < questionaire?.questions?.length - 1
                ? 'Save & Continue'
                : 'Submit'
            }
            style={{marginBottom: hp(3)}}
          />

          <TouchableOpacity
            disabled={isLoading}
            style={styles.skip}
            onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loader: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  container: {
    flex: 1,
    backgroundColor: AppColors.body,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: hp(5),
  },
  backButton: {
    marginRight: 5,
    padding: 2,
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 16,
    fontFamily: AppFonts.InterMedium,
  },
  changedNum: {
    fontFamily: AppFonts.InterBold,
    color: AppColors.processbar,
    marginLeft: 5,
  },
  inputContainer: {
    marginVertical: 10,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#D9D9D9',
    borderRadius: 5,
    overflow: 'hidden',
    width: '85%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: AppColors.processbar,
    borderRadius: 5,
  },
  scrollView: {
    // flexGrow: 0.5,
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 15,
    marginVertical: 10,
    color: AppColors.black,
    fontFamily: AppFonts.InterMedium,
  },
  questionSubText: {
    fontSize: 13,
    marginBottom: 10,
    color: AppColors.black,
    fontFamily: AppFonts.InterMedium,
  },
  optionContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'flex-start',
  },
  optionTextContainer: {
    marginLeft: 5,
  },
  optionText: {
    fontSize: 14,
    color: AppColors.black,
    fontFamily: AppFonts.InterSemiBold,
  },
  optionDescription: {
    fontSize: 14,
    color: AppColors.questionText,
    fontFamily: AppFonts.InterRegular,
    width: 330,
    // lineHeight: 22,
  },
  continueButton: {
    padding: 8,
    borderRadius: 5,
  },
  continueText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 18,
  },
  radioButton: {
    // height: hp(3),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: AppColors.black,
  },
  LoginBtn: {
    width: '100%',
    height: hp(7),
    borderRadius: 8,
    marginTop: hp(2),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skip: {
    justifyContent: 'center',
    flexDirection: 'row',
    paddingBottom: Platform.OS == 'ios' ? hp(3) : 0,
  },
  skipText: {
    textAlign: 'center',
    color: AppColors.processbar,
    fontFamily: AppFonts.InterRegular,
    fontSize: 14,
  },
  circle: {
    height: hp(2.7),
    width: hp(2.7),
    borderRadius: hp(2.7),
    borderColor: AppColors.placeholderText,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingBottom: hp(1)
  },
  innerCircle: {
    height: hp(1.5),
    width: hp(1.5),
    borderRadius: hp(1.5),
    backgroundColor: AppColors.processbar,
  },
  subTitle: {
    fontSize: 14,
    fontFamily: AppFonts.InterRegular,
    color: AppColors.black,
    marginTop: 10,
    marginBottom: 20,
  },
});

export default Questionnaire;
