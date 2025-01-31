import React from 'react';
import {Platform, Pressable, Text} from 'react-native';
import AppStyles from '../styles/AppStyles';
import {AlreadyTitleProps} from '../types/types';
import AppFonts from '../utils/appFonts';
import {hp} from '../utils/constant';
import {AppColors} from '../utils/color';

const AlreadyTitle: React.FC<AlreadyTitleProps> = ({
  title,
  subTitle,
  onPress,
  titleColor = AppColors.white,
}) => {
  return (
    <Text
      style={[
        AppStyles.subTitle,
        {
          fontFamily: AppFonts.RebondGrotesqueMedium,
          marginVertical: hp(1.5),
          color: titleColor,
        },
      ]}>
      {title}{' '}
      <Pressable onPress={onPress}>
      <Text
        // onPress={onPress}
        style={[
          AppStyles.subTitle,
          {
            fontFamily: AppFonts.RebondGrotesqueSemiBold,
            textDecorationLine: 'underline',
            color: titleColor,
            fontWeight: Platform.OS == 'ios' ? 'bold' : undefined,
            // backgroundColor: 
          },
        ]}>
        {subTitle}
      </Text>
      </Pressable>
    </Text>
  );
};

export default AlreadyTitle;
