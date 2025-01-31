import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React from 'react';
import {AppColors} from '../../utils/color';
import AppHeader from '../../components/AppHeader';
import {hp, password_regex} from '../../utils/constant';
import AppInput from '../../components/AppInput';
import GlobalIcon from '../../components/GlobalIcon';
import AppButton from '../../components/AppButton';
import {useNavigation} from '@react-navigation/native';
import {Controller, useForm} from 'react-hook-form';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {updatePassword} from '../../store/user/userActions';

const ChangePassword = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.commonSlice.isLoading);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      password: '',
      new_password: '',
      confirm_new_password: '',
    },
  });

  const onSubmit = async (data: any) => {
    if (data.new_password != data.confirm_new_password) {
      control.setError('new_password', {
        type: 'manual',
        message: 'The passwords does not match.',
      });
      return;
    }
    const updated_password = {
      currentPassword: data.password,
      newPassword: data.new_password,
    };
    const res = await dispatch(updatePassword(updated_password)).unwrap();
    if (res?.success == true) {
      navigation.navigate('profile');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.EditProfileHeaderView}>
          <AppHeader title="Change Password" />
        </View>

        <View style={styles.EditProfileInput}>
          <Controller
            name="password"
            control={control}
            rules={{
              required: {value: true, message: 'Current password is required'},
            }}
            render={({field: {onChange, value}}) => (
              <AppInput
                placeholder="Current Password"
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
            name="new_password"
            control={control}
            rules={{
              required: {value: true, message: 'New password is required'},
              minLength: {
                value: 8,
                message: 'New password should be at least 8 characters',
              },
              pattern: {
                value: password_regex,
                message:
                  'The new password must contain at least one number, one uppercase letter, and one special character',
              },
            }}
            render={({field: {onChange, value}}) => (
              <AppInput
                placeholder="New Password"
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
                error={errors.new_password?.message}
              />
            )}
          />

          <Controller
            name="confirm_new_password"
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Confirm new password is required',
              },
              minLength: {
                value: 8,
                message: 'Confirm new password should be at least 8 characters',
              },
              pattern: {
                value: password_regex,
                message:
                  'The confirm new password must contain at least one number, one uppercase letter, and one special character',
              },
            }}
            render={({field: {onChange, value}}) => (
              <AppInput
                placeholder="Re-type New Password"
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
                error={errors.confirm_new_password?.message}
              />
            )}
          />
        </View>

        <View style={styles.EditProfileButton}>
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

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.body,
  },
  EditProfileHeaderView: {
    marginTop: hp(1),
  },
  EditProfileImage: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(3),
  },
  EditProfileInput: {
    width: '90%',
    alignSelf: 'center',
    // marginTop: hp(5),
  },
  EditProfileButton: {
    width: '90%',
    alignSelf: 'center',
    marginTop: hp(1),
  },
});
