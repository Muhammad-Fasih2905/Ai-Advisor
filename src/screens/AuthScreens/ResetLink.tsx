import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import React from 'react';
import AuthTitle from '../../components/AuthTitle';
import {AppColors} from '../../utils/color';
import AppFonts from '../../utils/appFonts';
import AppButton from '../../components/AppButton';
import {hp, wp} from '../../utils/constant';
import {useNavigation} from '@react-navigation/native';

const ResetLink = () => {
  const navigation = useNavigation();

  const openGmail = () => {
    try {
      const gmailUrl =
        Platform.OS === 'android'
          ? 'mailto:?to='
          : 'googlegmail:///co';

      Linking.openURL(gmailUrl).catch(err => {
        console.error('An error occurred', err);
        Alert.alert(
          'Error',
          'Could not open Gmail app. Please make sure it is installed.',
        );
      });
    } catch (error) {
      console.log(error, 'error');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <Image
        source={require('../../assets/images/reset.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <AuthTitle
        title="Check your Email"
        titleColor={AppColors.black}
        titleSize={20}
        titleWeight="700"
      />

      <Text style={styles.instruction}>
        We have sent password reset instructions to your email
      </Text>

      <AppButton title="Open Email" onPress={openGmail} style={styles.otpBtn} />
      <TouchableOpacity onPress={() => navigation.navigate('signin')}>
        <Text style={styles.alreadyText}> Skip I’ll confirm later </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetLink;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.body,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  instruction: {
    fontSize: 15,
    textAlign: 'center',
    color: AppColors.silverText,
    fontFamily: AppFonts.RobotoRegular,
    lineHeight: 20,
    width: '60%',
  },

  otpInput: {
    width: 50,
    height: 50,
    textAlign: 'center',
    borderBottomWidth: 3,
    color: AppColors.cyan,
  },
  logo: {
    width: wp(80),
    height: hp(40),
  },
  otpBtn: {
    width: '90%',
    marginTop: hp(2),
  },
  alreadyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(3),
  },
  alreadyText: {
    color: AppColors.silverText,
    fontFamily: AppFonts.RobotoRegular,
    fontSize: 15,
    marginTop: hp(2),
  },
});
