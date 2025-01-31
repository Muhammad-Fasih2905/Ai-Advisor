import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Animated,
  Image,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AppButton from '../../components/AppButton';
import AppInput from '../../components/AppInput';
import AuthTitle from '../../components/AuthTitle';
import GlobalIcon from '../../components/GlobalIcon';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login } from '../../store/user/userActions';
import { setSignupToken, setToken, setUser } from '../../store/user/userSlices';
import AppFonts from '../../utils/appFonts';
import { AppColors } from '../../utils/color';
import { setLoading } from '../../store/common/commonSlice';

const Signin = ({ onTransition }: any) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const fadeAnimation = useRef(new Animated.Value(3)).current;
  const moveAnimation = useRef(new Animated.Value(hp(40))).current;
  const isLoading = useAppSelector(state => state.commonSlice.isLoading);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: hp(3),
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(moveAnimation, {
        toValue: hp(1),
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onTransition) onTransition();
    });
  }, [fadeAnimation, moveAnimation, onTransition]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: any) => {
    const res = await dispatch(login(data)).unwrap();
    if (res.success == true) {
      if (res?.data?.user?.verified == true) {
        dispatch(setToken(res?.token))
        dispatch(setUser(res.data.user))
      }
      else {
        dispatch(setSignupToken(res?.token))
        dispatch(setUser(res?.data?.user))
        navigation.navigate("verifycode")
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      bounces={false}
      style={styles.container}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
      keyboardShouldPersistTaps="handled">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <StatusBar
            translucent
            barStyle="dark-content"
            backgroundColor="transparent"
          />

          <Animated.View
            style={{
              opacity: fadeAnimation,
              transform: [{ translateY: moveAnimation }],
              zIndex: 1,
            }}>
            <Image
              style={styles.logo}
              source={require('../../assets/images/logo.png')}
            />
          </Animated.View>

          <AuthTitle title="Sign In" titleColor={AppColors.black} titleStyle={{marginBottom: 20}} />

          <View style={styles.inputView}>
            <Controller
              name="email"
              control={control}
              rules={{
                required: { value: true, message: 'Email is required' },
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              }}
              render={({ field: { onChange, value } }) => (
                <AppInput
                  placeholder="Email"
                  value={value}
                  onChangeText={onChange}
                  leftInnerIcon={
                    <GlobalIcon
                      library="FontAwesome"
                      name="envelope-o"
                      size={24}
                      color={AppColors.iconColor}
                    />
                  }
                  error={errors.email?.message}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{
                required: { value: true, message: 'Password is required' },
              }}
              render={({ field: { onChange, value } }) => (
                <AppInput
                  placeholder="Password"
                  value={value}
                  onChangeText={onChange}
                  leftInnerIcon={
                    <GlobalIcon
                      library="AntDesign"
                      name="unlock"
                      size={24}
                      color={AppColors.iconColor}
                    />
                  }
                  secureTextEntry={true}
                  togglePasswordVisibility={true}
                  error={errors.password?.message}
                />
              )}
            />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('forgotpassword');
              }}>
              <Text style={styles.forgatePassword}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <AppButton loading={isLoading} disabled={isLoading} title="Sign In" onPress={handleSubmit(onSubmit)} />

          <View style={styles.loginContainer}>
            <Text style={styles.signinText}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('signup');
              }}>
              <Text style={styles.loginText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

export default Signin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.body,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: wp(5),
    justifyContent: 'center', // Adjust if needed
  },
  logo: {
    height: hp(30),
    width: wp(30),
    resizeMode: 'contain',
    marginBottom: hp(2),
  },
  inputView: {
    width: wp('90%'),
    marginBottom: hp(2),
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(3),
  },
  loginText: {
    color: AppColors.primary,
    fontFamily: AppFonts.InterBold,
  },
  forgatePassword: {
    textAlign: 'right',
    fontSize: 16,
    color: AppColors.black,
    fontFamily: AppFonts.InterRegular,
    marginTop: hp(1),
  },
  signinText: {
    color: AppColors.black,
    fontFamily: AppFonts.InterRegular,
    fontSize: 16,
  },
});
