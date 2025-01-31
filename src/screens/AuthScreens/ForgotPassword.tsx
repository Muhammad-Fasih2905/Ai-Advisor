import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import React from 'react';
import AppHeader from '../../components/AppHeader';
import {AppColors} from '../../utils/color';
import AppFonts from '../../utils/appFonts';
import {hp} from '../../utils/constant';
import AppInput from '../../components/AppInput';
import GlobalIcon from '../../components/GlobalIcon';
import AppButton from '../../components/AppButton';
import {useNavigation} from '@react-navigation/native';
import {Controller, useForm} from 'react-hook-form';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {forgotPassword} from '../../store/user/userActions';

const ForgotPassword = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.commonSlice.isLoading);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: {email: string}) => {
    try {
      const res = await dispatch(forgotPassword(data)).unwrap();
      if (res.success == true) {
        navigation.navigate('resetlink');
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" />

        <AppHeader title="Forgot Password?" headerStyle={{height: hp(11), paddingTop: hp(2)}} />

        <Text style={styles.description}>
          Please enter the email you use to sign in and we will send you a reset
          link.
        </Text>

        <View style={styles.emailInput}>
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
                placeholder="Your Email"
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
          <AppButton
            disabled={isLoading}
            loading={isLoading}
            title="Submit"
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: AppColors.body,
    paddingTop: Platform.OS == 'ios' ? hp(2) : 0,
  },
  description: {
    fontSize: 17,
    color: AppColors.silverText,
    fontFamily: AppFonts.InterRegular,
    padding: hp(2),
    paddingTop: 0
  },
  emailInput: {
    width: '90%',
  },
});
