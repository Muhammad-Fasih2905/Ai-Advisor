import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React, { useEffect } from 'react';
import { AppColors } from '../../utils/color';
import LinearGradient from 'react-native-linear-gradient';
import AuthTitle from '../../components/AuthTitle';
import { hp } from '../../utils/constant';
import AppFonts from '../../utils/appFonts';
import GlobalIcon from '../../components/GlobalIcon';
import Password from '../../assets/svgs/password.svg';
import Questionnaire from '../../assets/svgs/Questionnaire.svg';
import Privacy from '../../assets/svgs/privacypolicy.svg';
import FAQ from '../../assets/svgs/faq.svg';
import TermCondition from '../../assets/svgs/term.svg';
import AppButton from '../../components/AppButton';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setToken } from '../../store/user/userSlices';
import { getStaticContent, logout, removeFCMToken } from '../../store/user/userActions';
import { persister, store } from '../../store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from '../../store/common/commonSlice';

const Profile = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const user = useAppSelector(state => state.userSlices.user);
  const isLoading = useAppSelector(state => state.commonSlice.isLoading)

  useEffect(() => {
    dispatch(getStaticContent());
  }, []);

  const handleLogout = async () => {
    await dispatch(removeFCMToken());
    const res = await dispatch(logout()).unwrap();
    if (res.success == true) {
      dispatch(setToken(null));
      store.dispatch({ type: 'LOGOUT' });
      persister.purge();
      AsyncStorage.clear();
      dispatch(showMessage('Logged out successfully'));
    }
  }

  return (
    <KeyboardAwareScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
      style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <LinearGradient
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        colors={[AppColors.primary, AppColors.secondary]}
        style={styles.gradient}>
        <View style={styles.TitleStyle}>
          <AuthTitle
            title="Profile"
            titleColor={AppColors.white}
            titleSize={20}
            titleWeight="700"
          />
        </View>

        <View style={styles.ProfileContainer}>
          <Image source={{ uri: user?.avatar }} style={styles.ProfileImage} />
          <Text style={styles.ProfileName}>{user?.name}</Text>
          <Text style={styles.ProfileEmail}>{user?.email}</Text>
        </View>
      </LinearGradient>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('editprofile');
        }}>
        <View style={styles.ProfileBottomContainer}>
          <GlobalIcon
            library="CustomIcon"
            name="user"
            size={24}
            color={AppColors.black}
          />
          <Text style={styles.EditProfileStyle}>Edit Profile</Text>
          <View style={styles.ProfileRightIcon}>
            <GlobalIcon
              library="MaterialIcons"
              name="arrow-forward-ios"
              size={18}
              color={AppColors.black}
            />
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('changepassword');
        }}>
        <View style={styles.ProfileBottomContainer}>
          <Password />
          <Text style={styles.EditProfileStyle}>Change Password</Text>
          <View style={styles.ProfileRightIcon}>
            <GlobalIcon
              library="MaterialIcons"
              name="arrow-forward-ios"
              size={18}
              color={AppColors.black}
            />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Questionnaire');
        }}>
        <View style={styles.ProfileBottomContainer}>
          <Questionnaire />
          <Text style={styles.EditProfileStyle}>Investment Questionnaire</Text>
          <View style={styles.ProfileRightIcon}>
            <GlobalIcon
              library="MaterialIcons"
              name="arrow-forward-ios"
              size={18}
              color={AppColors.black}
            />
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('privacypolicy');
        }}>
        <View style={styles.ProfileBottomContainer}>
          <Privacy />
          <Text style={styles.EditProfileStyle}>Privacy Policy</Text>
          <View style={styles.ProfileRightIcon}>
            <GlobalIcon
              library="MaterialIcons"
              name="arrow-forward-ios"
              size={18}
              color={AppColors.black}
            />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('faq');
        }}>
        <View style={styles.ProfileBottomContainer}>
          <FAQ />
          <Text style={styles.EditProfileStyle}>FAQs</Text>
          <View style={styles.ProfileRightIcon}>
            <GlobalIcon
              library="MaterialIcons"
              name="arrow-forward-ios"
              size={18}
              color={AppColors.black}
            />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('termsconditions');
        }}>
        <View style={styles.ProfileBottomContainer}>
          <TermCondition />
          <Text style={styles.EditProfileStyle}>Terms & Conditions</Text>
          <View style={styles.ProfileRightIcon}>
            <GlobalIcon
              library="MaterialIcons"
              name="arrow-forward-ios"
              size={18}
              color={AppColors.black}
            />
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.LogoutButton}>
        <AppButton
          loading={isLoading}
          disabled={isLoading}
          title="Log Out"
          onPress={() => handleLogout()}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.body,
  },
  gradient: {
    paddingHorizontal: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'space-between',
  },
  TitleStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(8),
  },
  ProfileContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: hp(2),
  },
  ProfileName: {
    color: AppColors.white,
    fontSize: 18,
    fontFamily: AppFonts.InterBold,
    marginTop: hp(2),
  },
  ProfileEmail: {
    color: AppColors.white,
    fontSize: 14,
    fontFamily: AppFonts.InterRegular,
    marginTop: hp(1),
    marginBottom: hp(4),
    lineHeight: 20,
  },
  ProfileBottomContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: hp(3),
    alignItems: 'center',
  },
  ProfileRightIcon: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  EditProfileStyle: {
    color: AppColors.black,
    fontSize: 14,
    fontFamily: AppFonts.InterMedium,
    marginLeft: 10,
  },
  LogoutButton: {
    width: '90%',
    alignSelf: 'center',
    marginTop: hp(12),
    marginBottom: hp(7),
  },
});
