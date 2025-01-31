import {
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {AppColors} from '../../utils/color';
import AppHeader from '../../components/AppHeader';
import {hp} from '../../utils/constant';
import AppInput from '../../components/AppInput';
import GlobalIcon from '../../components/GlobalIcon';
import AppButton from '../../components/AppButton';
import {useNavigation} from '@react-navigation/native';
import EditSvg from '../../assets/svgs/Edit.svg';
import LinearGradient from 'react-native-linear-gradient';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Controller, useForm} from 'react-hook-form';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {
  updateProfilePic,
  updateUserProfile,
} from '../../store/user/userActions';
import AppBottomSheet from '../../components/AppBottomSheet';
import AppStyles from '../../styles/AppStyles';
import {size} from '../../utils/responsiveFonts';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

const EditProfile = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const user = useAppSelector(state => state.userSlices.user);
  const isLoading = useAppSelector(state => state.commonSlice.isLoading);
  const [loading, setLoading] = useState(false);
  const snapPoints = useMemo(() => ['18%', '20%'], []);
  const openSheet = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const closeSheet = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  useEffect(() => {
    setValue('name', user?.name);
    setValue('email', user?.email);
  }, []);

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const onSubmit = async (data: {name: string; email: string}) => {
    const res = await dispatch(updateUserProfile({name: data.name})).unwrap();
    if (res.success == true) {
      navigation.navigate('profile');
    }
  };

  const handleUpdateImage = async (type: string) => {
    setLoading(true)
    closeSheet();
    const res = await dispatch(updateProfilePic(type)).unwrap();
    if (res.success == true) {
      setLoading(false)
    }
    setLoading(false)
  };

  return (
    <KeyboardAwareScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{flex: 1}}>
      <TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.EditProfileHeaderView}>
            <AppHeader title="Edit Profile" />
          </View>
          <View style={styles.EditProfileImage}>
            <TouchableOpacity
              style={[styles.EditStyle, styles.editIconCont]}
              onPress={() => openSheet()}>
              <LinearGradient
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                colors={[AppColors.primary, AppColors.secondary]}
                style={styles.EditStyle}>
               {loading ? <ActivityIndicator size="small" color={AppColors.white} /> : <EditSvg />}
              </LinearGradient>
            </TouchableOpacity>

            <Image
              style={styles.img}
              source={user?.avatar ? {uri: user?.avatar} : require('../../assets/images/default_avatar.png')}
            />
          </View>

          <View style={styles.EditProfileInput}>
            <Controller
              name="name"
              control={control}
              rules={{
                required: {value: true, message: 'Name is required'},
              }}
              render={({field: {onChange, value}}) => (
                <AppInput
                  placeholder="Daniel Jake"
                  value={value}
                  onChangeText={onChange}
                  leftInnerIcon={
                    <GlobalIcon
                      library="CustomIcon"
                      name="user"
                      size={24}
                      color={AppColors.iconColor}
                    />
                  }
                  error={errors.name?.message}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              rules={{
                required: {value: true, message: 'Email is required'},
              }}
              render={({field: {onChange, value}}) => (
                <AppInput
                  placeholder="dwaynefarrell12"
                  value={value}
                  onChangeText={onChange}
                  editable={false}
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

      <AppBottomSheet
        bottomSheetModalRef={bottomSheetModalRef}
        snapPoints={snapPoints}
        backdropComponent={({style}) => (
          <Pressable
            onPress={() => closeSheet()}
            style={[style, {backgroundColor: 'rgba(0, 0, 0, 0.7)'}]}
          />
        )}>
        <View style={{height: 300}}>
          <Pressable
            onPress={() => {
              handleUpdateImage('camera');
            }}
            style={[AppStyles.rowBetween, styles.bottomSheetTab]}>
            <Text style={[AppStyles.title, {fontSize: size.lg}]}>Camera</Text>
            <GlobalIcon
              library="AntDesign"
              name="camera"
              color={AppColors.black}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              handleUpdateImage('gallery');
            }}
            style={[
              AppStyles.rowBetween,
              styles.bottomSheetTab,
              {marginTop: hp(1)},
            ]}>
            <Text style={[AppStyles.title, {fontSize: size.lg}]}>Gallery</Text>
            <GlobalIcon
              library="MaterialCommunityIcons"
              name="camera-burst"
              color={AppColors.black}
            />
          </Pressable>
        </View>
      </AppBottomSheet>
    </KeyboardAwareScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.body,
  },
  EditProfileHeaderView: {
    marginTop: hp(1),
  },
  EditProfileImage: {
    marginTop: hp(3),
    height: hp(17),
    width: hp(17),
    alignSelf: 'center',
  },
  EditProfileInput: {
    width: '90%',
    alignSelf: 'center',
    marginTop: hp(5),
    position: 'relative',
  },
  EditStyle: {
    padding: 12,
    borderRadius: 30,
  },
  editIconCont: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    right: -10,
    padding: 0,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'white',
  },
  EditProfileButton: {
    width: '90%',
    alignSelf: 'center',
    marginTop: hp(1),
  },
  img: {
    height: '100%',
    width: '100%',
    borderRadius: 100,
  },
  bottomSheetTab: {
    width: '100%',
    paddingHorizontal: hp(2),
    paddingVertical: hp(1),
  },
});
