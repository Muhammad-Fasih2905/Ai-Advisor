import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import {AppColors} from '../../utils/color';
import {useNavigation} from '@react-navigation/native';
import AppFonts from '../../utils/appFonts';
import AuthTitle from '../../components/AuthTitle';
import GlobalIcon from '../../components/GlobalIcon';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Controller, useForm} from 'react-hook-form';
import {password_regex} from '../../utils/constant';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {registerUser} from '../../store/user/userActions';

const Signup = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.commonSlice.isLoading);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  });

  const onSubmit = async (data: any) => {
    if (data.password != data.confirm_password) {
      control.setError('password', {
        type: 'manual',
        message: 'The passwords does not match.',
      });
      return;
    }
    const store_data = {
      name: data.full_name,
      email: data.email,
      password: data.password,
    };
    const res = await dispatch(registerUser(store_data)).unwrap();
    if (res?.success == true) {
      navigation.navigate('questionnaire');
    }
  };

  return (
    <KeyboardAwareScrollView bounces={false} contentContainerStyle={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <StatusBar translucent backgroundColor="transparent" />
          <ScrollView
            bounces={false}
            contentContainerStyle={styles.scrollViewContent}>
            <Image
              style={styles.logo}
              source={require('../../assets/images/logo.png')}
            />

            <AuthTitle title="Create an Account" titleColor={AppColors.black} titleStyle={{marginBottom: 20}} />

            <View style={styles.inputView}>
              <Controller
                name="full_name"
                control={control}
                rules={{
                  required: {value: true, message: 'Full name is required'},
                }}
                render={({field: {onChange, value}}) => (
                  <AppInput
                    placeholder="Full Name"
                    value={value}
                    onChangeText={onChange}
                    leftInnerIcon={
                      <GlobalIcon
                        library="AntDesign"
                        name="user"
                        size={24}
                        color={AppColors.iconColor}
                      />
                    }
                    error={errors.full_name?.message}
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                rules={{
                  required: {value: true, message: 'Email is required'},
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                }}
                render={({field: {onChange, value}}) => (
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
                  required: {value: true, message: 'Password is required'},
                  minLength: {
                    value: 8,
                    message: 'Password should be at least 8 characters',
                  },
                  pattern: {
                    value: password_regex,
                    message:
                      'The password must contain at least one number, one uppercase letter, and one special character',
                  },
                }}
                render={({field: {onChange, value}}) => (
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

              <Controller
                name="confirm_password"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: 'Confirm password is required',
                  },
                  minLength: {
                    value: 8,
                    message: 'Confirm password should be at least 8 characters',
                  },
                  pattern: {
                    value: password_regex,
                    message:
                      'The confirm password must contain at least one number, one uppercase letter, and one special character',
                  },
                }}
                render={({field: {onChange, value}}) => (
                  <AppInput
                    placeholder="Confirm Password"
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
                    error={errors.confirm_password?.message}
                  />
                )}
              />
            </View>

            <AppButton
              loading={isLoading}
              disabled={isLoading}
              title="Continue"
              onPress={handleSubmit(onSubmit)}
            />
             {/* <AppButton
              title="Continue"
              onPress={() => navigation.navigate('questionnaire')}
            /> */}

            <View style={styles.loginContainer}>
              <Text style={styles.signinText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('signin')}>
                <Text style={styles.loginText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.body,
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingBottom: hp(2),
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
  signinText: {
    color: AppColors.black,
    fontFamily: AppFonts.InterRegular,
  },
});
