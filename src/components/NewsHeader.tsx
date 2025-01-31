import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppColors } from '../utils/color';
import GlobalIcon from './GlobalIcon';
import { useNavigation } from '@react-navigation/native';
import { hp } from '../utils/constant';
import AppFonts from '../utils/appFonts';

interface HeaderProps {
  title: string;
  
}
const NewsHeader: React.FC<HeaderProps> = ({ title }) => {
  const navigation = useNavigation()

  const handleBack = () => {
    navigation.goBack();
  }
  return (
    <View style={[styles.headerContainer]}>
      <View style={styles.conditionHeader}>
        <TouchableOpacity onPress={handleBack} style={{ alignItems: 'flex-start', alignSelf: 'flex-start', }}>
          <GlobalIcon
            library="CustomIcon"
            name="chevron_left"
            size={24}
            color={AppColors.black}
          />
        </TouchableOpacity>
        <Text style={styles.conditionTitle}>{title}</Text>
      </View>
    </View>
  )
}
export default NewsHeader

const styles = StyleSheet.create({
  headerContainer: {
    width:'100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    height:hp(6)
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
