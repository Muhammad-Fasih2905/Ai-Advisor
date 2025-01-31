import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import LocationArrow from '../../assets/svgs/location-arrow.svg';
import AppInput from '../../components/AppInput';
import {getFinancialAdvice} from '../../store/financialAdvice/financialAdviceActions';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import AppFonts from '../../utils/appFonts';
import {AppColors} from '../../utils/color';
import {hp} from '../../utils/constant';
import Markdown from 'react-native-markdown-display';
import AppStyles, {MarkDownStyles} from '../../styles/AppStyles';
import {useKeyboard} from '../../utils/keyboard';
import GlobalIcon from '../../components/GlobalIcon';
import Chatbot from '../../assets/svgs/chatbot.svg';

const BestInvestment = () => {
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);
  const keyboardHeight = useKeyboard();
  const previousQAns = useAppSelector(
    state => state.financialAdviceSlice.previousQAns,
  );
  const user = useAppSelector(state => state.userSlices.user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (previousQAns.length > 0) {
      flatListRef.current?.scrollToEnd({animated: true});
    }
  }, [previousQAns, isFocused]);

  const handleLayout = () => {
    if (previousQAns.length > 0) {
      flatListRef.current?.scrollToEnd({animated: true});
    }
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: {
      prompt: '',
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    const res = await dispatch(getFinancialAdvice(data.prompt)).unwrap();
    if (res.success == true) {
      setLoading(false);
      setValue('prompt', '');
    } else {
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={[styles.HeaderView, AppStyles.widthFullPercent]}>
        <View style={[AppStyles.row, {justifyContent: 'space-between'}]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerIcon}>
            <GlobalIcon
              library="CustomIcon"
              name="chevron_left"
              size={24}
              color={AppColors.black}
            />
          </TouchableOpacity>
          <View
            style={[
              AppStyles.row,
              AppStyles.alignJustifyCenter,
              AppStyles.flex,
              {
                gap: 10,
              },
            ]}>
            <Chatbot />
            <Text style={styles.title}>AI Investment Partner</Text>
          </View>
          <TouchableOpacity style={styles.headerIcon}>
            <GlobalIcon
              library="CustomIcon"
              name="chevron_left"
              size={24}
              color={AppColors.white}
            />
          </TouchableOpacity>
        </View>
      </View>
      <KeyboardAwareScrollView
        bounces={false}
        scrollEnabled={false}
        nestedScrollEnabled={true}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        <FlatList
          nestedScrollEnabled={true}
          ref={flatListRef}
          showsVerticalScrollIndicator={false}
          data={previousQAns}
          renderItem={({item}) => (
            <View style={styles.answersView}>
              <View style={{flexDirection: 'row', gap: 10}}>
                <Image
                  source={{uri: user?.avatar}}
                  style={styles.ProfileImage}
                />
                <LinearGradient
                  start={{x: 0, y: 1}}
                  end={{x: 1, y: 0}}
                  colors={[AppColors.primary, AppColors.secondary]}
                  style={styles.gradientTextContainer}>
                  <Text style={styles.HeadingStyle}>{item?.question}</Text>
                </LinearGradient>
              </View>
              <View style={{flexDirection: 'row', gap: 10}}>
                <Image
                  source={require('../../assets/images/logo.png')}
                  style={[styles.ProfileImage, {top: 10}]}
                />
                <View style={{width: '85%'}}>
                  <Markdown style={MarkDownStyles}>{item?.answer}</Markdown>
                </View>
              </View>
            </View>
          )}
          onContentSizeChange={handleLayout}
          onLayout={handleLayout}
        />

        <View
          style={[
            styles.chatInputView,
            Platform.OS == 'ios' && {
              marginBottom: keyboardHeight > 0 ? hp(10) : hp(2),
            },
          ]}>
          <Controller
            name="prompt"
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Enter your question',
              },
            }}
            render={({field: {onChange, value}}) => (
              <AppInput
                placeholder="Ask your question"
                value={value}
                onChangeText={(text: string) => onChange(text)}
                containerStyle={styles.InputViewStyle}
                editable={!loading}
                inputStyle={{
                  width: '100%',
                  fontSize: Platform.OS == 'ios' ? 16 : 12,
                }}
                multiline={true}
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
      </KeyboardAwareScrollView>
    </View>
  );
};

export default BestInvestment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.body,
    padding: 12,
    paddingVertical: hp(1),
    justifyContent: 'space-between',
  },
  HeaderView: {
    paddingHorizontal: 12,
    marginTop: hp(6),
    justifyContent: 'space-between',
    alignItems: 'center',
    height: hp(6),
  },
  headerIcon: {alignItems: 'flex-start', alignSelf: 'flex-start'},
  title: {
    color: AppColors.black,
    fontSize: 18,
    fontFamily: AppFonts.InterBold,
  },
  mainContainer: {flex: 1, backgroundColor: AppColors.body},
  DescriptionView: {
    paddingHorizontal: 16,
  },
  descriptionStyle: {
    color: AppColors.secondryText,
    fontSize: 14,
    fontFamily: AppFonts.InterRegular,
    lineHeight: 22,
    width: '90%',
  },
  answersView: {gap: 10, marginBottom: hp(2)},
  HeadingStyle: {
    color: AppColors.white,
    fontSize: 14,
    fontFamily: AppFonts.InterSemiBold,
    minWidth: 200,
  },
  chatInputView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
  },
  InputViewStyle: {
    width: '77%',
    fontSize: 15,
  },
  gradientIconContainer: {
    padding: hp(1.8),
    borderRadius: 30,
    marginBottom: 10,
  },
  gradientTextContainer: {
    padding: hp(0.8),
    marginBottom: 10,
    borderRadius: 5,
    width: '85%',
  },
  ProfileImage: {
    width: 35,
    height: 35,
    borderRadius: 50,
    resizeMode: 'cover',
  },
});
