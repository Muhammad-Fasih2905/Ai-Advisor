import React from 'react';
import {Text, View} from 'react-native';
import AppStyles from '../styles/AppStyles';
import {AuthTitleProps} from '../types/types';
import {AppColors} from '../utils/color';
import AppFonts from '../utils/appFonts';

const AuthTitle: React.FC<AuthTitleProps> = ({
  title,
  subTitle,
  titleColor,
  subTitleColor,
  titleSize,
  subtitleSize,
  titleWeight,
  titleStyle,
  subtitleStyle,
  index,
  numberOfLines,
}) => {
  return (
    <View>
   {title && <Text
        style={[
          AppStyles.AuthTitle,
          {
            color: titleColor || '#000000',
            fontFamily: AppFonts.InterBold || '#000',
            fontSize: titleSize || 24,
          },
          titleStyle,
        ]}
        numberOfLines={numberOfLines}>
        {index && index + '.  '}
        {title}
      </Text>}

     {subTitle && <Text
        style={[
          AppStyles.AuthSubTitle,
          {
            color: subTitleColor || '#95989a',
            fontFamily: AppFonts.InterBold,
            fontSize: titleSize || subtitleSize || 16,
          },
          subtitleStyle,
        ]}>
        {subTitle}
      </Text>}
    </View>
  );
};

export default AuthTitle;
