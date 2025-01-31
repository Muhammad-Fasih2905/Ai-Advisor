import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { AppColors } from '../utils/color';
import GlobalIcon from './GlobalIcon';
import { useNavigation } from '@react-navigation/native';
import { hp } from '../utils/constant';
import AppFonts from '../utils/appFonts';

interface HeaderProps {
  title: string;
  headerStyle?: ViewStyle
}
const Header: React.FC<HeaderProps> = ({ title, headerStyle }) => {
  const navigation = useNavigation()

  const handleBack = () => {

    // navigation.goBack();
  }
  return (
    <View style={[styles.headerContainer, headerStyle]}>
      <View style={styles.conditionHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ alignItems: 'flex-start', alignSelf: 'flex-start', }}>
          <GlobalIcon
            library="Ionicons"
            name="arrow-back"
            size={24}
          color={AppColors.black}
          />
        </TouchableOpacity>
        <Text style={styles.conditionTitle}>{title}</Text>
      </View>
    </View>
  )
}
export default Header

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: hp(2),
    height:hp(13)
  },
  conditionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  conditionTitle: {
    fontSize: 18,
    fontFamily: AppFonts.InterBold,
    color: AppColors.black,
    textAlign: 'center',
    flex: 1,

  },
})
