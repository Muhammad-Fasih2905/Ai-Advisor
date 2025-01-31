import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import Chatbot from '../../assets/svgs/chatbot.svg';
import LocationArrow from '../../assets/svgs/location-arrow.svg';
import Search from '../../assets/svgs/search.svg';
import AppInput from '../../components/AppInput';
import {getAllCategories} from '../../store/finance/financeActions';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {getPopularQuestions} from '../../store/questionaire/questionaireActions';
import AppFonts from '../../utils/appFonts';
import {AppColors} from '../../utils/color';
import {hp, screenHeight, wp} from '../../utils/constant';
import {Controller, useForm} from 'react-hook-form';
import NoRecord from '../../components/NoRecord';
import {getFinancialAdvice} from '../../store/financialAdvice/financialAdviceActions';
import {setSinglePreviousQAns} from '../../store/financialAdvice/financialAdviceSlices';
import AppLoader from '../../components/AppLoader';
import AppStyles from '../../styles/AppStyles';

const InvestmentPartner = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const categories = useAppSelector(state => state.financeSlice.categories);
  const isLoading = useAppSelector(state => state.commonSlice.isLoading);
  const popularQuestions = useAppSelector(
    state => state.questionaire.popularQuestions,
  );
  const [activeId, setActiveId] = useState<any>(categories[0]);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
    setError,
  } = useForm({
    defaultValues: {
      prompt: '',
    },
  });

  useEffect(() => {
    dispatch(getAllCategories());
    dispatch(getPopularQuestions(categories[0]?._id));
  }, []);

  useEffect(() => {
    return () => {
      setError('prompt', {
        type: 'manual',
        message: '',
      });
    };
  }, [isFocused]);

  const handlePress = async (item: any) => {
    setActiveId(item);
    dispatch(getPopularQuestions(item?._id)).unwrap();
  };

  const onSubmit = async (data: any) => {
    dispatch(setSinglePreviousQAns([]));
    setLoading(true);
    const res = await dispatch(getFinancialAdvice(data.prompt)).unwrap();
    if (res.success == true) {
      setLoading(false);
      navigation.navigate('BestInvestment');
      setValue('prompt', '');
    } else {
      setLoading(false);
    }
    setLoading(false);
  };

  const renderCategories = ({item}: any) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        activeId?._id == item?._id && styles.activeCategoryItem,
      ]}
      onPress={() => handlePress(item)}>
      <Text
        style={[
          styles.categoryText,
          activeId?._id == item?._id && styles.activeCategoryText,
        ]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAwareScrollView
      bounces={false}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.investmentPartnerView}>
          <Chatbot />
          <Text style={styles.aiText}>AI Investment Partner</Text>
        </View>

        <View style={styles.investingQuestionsView}>
          <Search />
          <Text style={styles.investingQuestionsText}>
            Popular Investing Questions
          </Text>
        </View>

        <View style={styles.categoriesContainer}>
          <FlatList
            data={categories}
            renderItem={renderCategories}
            keyExtractor={(item: any) => item?._id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View
          style={{height: screenHeight / 1.7, justifyContent: 'space-between'}}>
          <View style={[styles.chatMessage, {height: screenHeight / 2.2}]}>
            {isLoading ? (
              <View style={[AppStyles.halfFlex, AppStyles.alignJustifyCenter]}>
                <AppLoader />
              </View>
            ) : (
              <FlatList
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
                data={popularQuestions?.questions}
                ListEmptyComponent={
                  <View style={{height: screenHeight / 2.2}}>
                    <NoRecord />
                  </View>
                }
                renderItem={({item}) => (
                  <Pressable
                    onPress={() => setValue('prompt', item)}
                    style={styles.textContainer}>
                    <Text style={styles.chatText}>{item}</Text>
                  </Pressable>
                )}
              />
            )}
          </View>

          <View style={styles.chatInputView}>
            <Controller
              name="prompt"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Enter your investment question',
                },
              }}
              render={({field: {onChange, value}}) => (
                <AppInput
                  placeholder="Ask your investment question"
                  value={value}
                  editable={!loading}
                  onChangeText={onChange}
                  multiline={true}
                  style={[styles.inputViewStyle, {padding: 10}]}
                  placeholderTextColor={AppColors.secondryText}
                  container={{borderRadius: 50, height: hp(7)}}
                  error={errors.prompt?.message}
                />
              )}
            />
            <TouchableOpacity
              disabled={loading}
              style={errors.prompt?.message && {marginBottom: hp(3)}}
              onPress={handleSubmit(onSubmit)}>
              <LinearGradient
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                colors={[AppColors.primary, AppColors.secondary]}
                style={styles.gradientIconContainer}>
                {loading ? (
                  <ActivityIndicator size={'small'} color={AppColors.white} />
                ) : (
                  <LocationArrow height={20} />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default InvestmentPartner;

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.body,
    padding: 12,
    paddingTop: hp(4),
    flexGrow: 1,
    // paddingBottom: hp(10),
  },
  investmentPartnerView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  investingQuestionsView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: hp(6),
  },
  categoriesContainer: {
    marginTop: hp(3),
  },
  categoryItem: {
    backgroundColor: AppColors.palecyan,
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeCategoryItem: {
    backgroundColor: AppColors.blue,
  },
  categoryText: {
    color: AppColors.blue,
  },
  activeCategoryText: {
    color: AppColors.white,
  },
  aiText: {
    color: AppColors.black,
    fontSize: 18,
    fontFamily: AppFonts.InterBold,
  },
  investingQuestionsText: {
    color: AppColors.black,
    fontSize: 16,
    fontFamily: AppFonts.InterBold,
  },
  chatMessage: {
    marginTop: hp(2),
  },
  textContainer: {
    // borderWidth: 1,
    borderRadius: 50,
    borderColor: AppColors.body2,
    backgroundColor: AppColors.white,
    marginBottom: hp(1),
    alignItems: 'flex-start',
    paddingHorizontal: wp(3),
  },
  chatText: {
    color: AppColors.black,
    fontSize: 14,
    fontFamily: AppFonts.InterSemiBold,
    lineHeight: 20,
    margin: 5,
    width: wp(74),
    // borderWidth: 1,
    // borderRadius:30,
    padding: 10,
    // borderColor:AppColors.body2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatInputView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: hp(3),
  },
  inputViewStyle: {
    width: '90%',
    fontSize: 15,
    borderRadius: 30
  },
  gradientIconContainer: {
    padding: hp(1.8),
    borderRadius: 30,
    marginBottom: hp(1),
  },
});
