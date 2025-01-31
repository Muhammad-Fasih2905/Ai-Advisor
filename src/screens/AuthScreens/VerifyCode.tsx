import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import OtpTextInput from 'react-native-otp-textinput';
import {AppColors} from '../../utils/color';
import AuthTitle from '../../components/AuthTitle';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AppFonts from '../../utils/appFonts';
import AppButton from '../../components/AppButton';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {setToken} from '../../store/user/userSlices';
import {getUser, sendOTP, verifyOTP} from '../../store/user/userActions';
import {showMessage} from '../../store/common/commonSlice';

type HandleChange = (otp: string) => void;

const VerifyCode = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const otpInputRef = useRef<any>(null);
  const token = useAppSelector(state => state.userSlices.token);
  const signupToken = useAppSelector(state => state.userSlices.signupToken);
  const user = useAppSelector(state => state.userSlices.user) as any;
  const isLoading = useAppSelector(state => state.commonSlice.isLoading);
  const [otp, setOtp] = useState<string>('');

  useEffect(() => {
    dispatch(sendOTP({email: user?.email, type: 'verify'}));
  }, []);

  const handleVerifyOtp = async () => {
    if (otp == '') {
      dispatch(showMessage('OTP is Required'));
      return;
    }
    const res = await dispatch(
      verifyOTP({email: user.email, otp: otp, type: 'verify'}),
    ).unwrap();
    if (res.success == true) {
      if (token) {
        dispatch(getUser(user?._id));
        navigation.navigate('home');
      } else {
        dispatch(setToken(signupToken));
        dispatch(getUser(user?._id));
      }
    }
    otpInputRef.current.clear();
  };

  const handleResendCode = () => {
    otpInputRef.current.clear();
    dispatch(sendOTP({email: user?.email, type: 'verify'})).unwrap();
  };

  const handleChange: HandleChange = (otp: string) => {
    setOtp(otp);
  };

  return (
    <KeyboardAwareScrollView bounces={false} contentContainerStyle={{flex: 1}}>
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/otp.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <AuthTitle
          title="Verification"
          titleColor={AppColors.black}
          titleSize={24}
          titleWeight="700"
        />
        <Text style={styles.instruction}>
          Please enter the code we emailed you at {user?.email}
        </Text>
        <OtpTextInput
          ref={otpInputRef}
          defaultValue={otp}
          handleTextChange={handleChange}
          inputCount={4}
          textInputStyle={styles.otpInput}
          tintColor={AppColors.cyan}
          offTintColor={AppColors.cyan}
        />
        <View style={styles.alreadyContainer}>
          <Text style={styles.alreadyText}>Didn’t receive code? </Text>
          <TouchableOpacity onPress={handleResendCode}>
            <Text style={styles.loginText}>Resend code</Text>
          </TouchableOpacity>
        </View>
        <AppButton
          disabled={isLoading}
          loading={isLoading}
          title="Submit"
          onPress={handleVerifyOtp}
          style={styles.otpBtn}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.body,
  },
  instruction: {
    fontSize: 17,
    marginBottom: hp(2),
    textAlign: 'center',
    color: AppColors.silverText,
    fontFamily: AppFonts.RobotoRegular,
    lineHeight: 28,
  },
  otpInput: {
    width: 50,
    height: 50,
    textAlign: 'center',
    borderBottomWidth: 3,
    color: AppColors.cyan,
  },
  logo: {
    width: wp(30),
    height: hp(17),
  },
  otpBtn: {
    width: '90%',
    marginTop: hp(5),
  },
  alreadyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(3),
  },
  alreadyText: {
    color: '#505050',
    fontFamily: AppFonts.RobotoRegular,
    fontSize: 16,
  },
  loginText: {
    color: AppColors.cyan,
    fontFamily: AppFonts.RobotoBold,
    fontSize: 16,
  },
});

export default VerifyCode;
