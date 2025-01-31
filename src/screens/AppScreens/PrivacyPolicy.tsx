import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import AppHeader from '../../components/AppHeader';
import {AppColors} from '../../utils/color';
import {hp} from '../../utils/constant';
import AppFonts from '../../utils/appFonts';
import {useAppSelector} from '../../store/hooks';

const PrivacyPolicy = () => {
  const staticContent = useAppSelector(state => state.userSlices.staticContent);
  
  return (
    <View style={styles.container}>
      <View style={styles.PrivicyHeaderView}>
        <AppHeader title="Privacy Policy" />
      </View>
      <View style={styles.descriptionView}>
        <Text style={styles.descriptionText}>
          {staticContent[0]?.privacyPolicy || ""}
        </Text>
      </View>
    </View>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.body,
  },
  PrivicyHeaderView: {
    marginTop: hp(1),
  },
  descriptionView: {
    paddingHorizontal: 16,
    marginTop: hp(-2)
  },
  descriptionText: {
    color: AppColors.black,
    fontSize: 14,
    fontFamily: AppFonts.InterRegular,
    lineHeight: 24,
  },
});
