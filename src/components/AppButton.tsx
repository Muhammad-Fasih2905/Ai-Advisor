import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { AppColors } from '../utils/color';
import { size } from '../utils/responsiveFonts';
import AppFonts from '../utils/appFonts';
import { hp, wp } from '../utils/constant';
import AppStyles from '../styles/AppStyles';
import LinearGradient from 'react-native-linear-gradient';

interface AppButtonProps {
  title: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  backgroundColor?: string;
  loadingTitle?: string;
  LoginBtn?: StyleProp<ViewStyle>
}

const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  style,
  titleStyle,
  leftIcon,
  rightIcon,
  disabled,
  loading,
  backgroundColor,
  loadingTitle = 'Loading',
  LoginBtn
}) => {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[styles.container, style]}>

      <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} colors={[AppColors.primary, AppColors.secondary]} style={[styles.LoginBtn, LoginBtn]}>

        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        {loading ? (

          <View style={AppStyles.rowCenter}>
            <ActivityIndicator size="small" color={AppColors.primary} />
            <Text style={[styles.title, { color: AppColors.primary, marginLeft: hp(1) }]}>{loadingTitle}</Text>
          </View>
        ) : (
          <Text style={[styles.title, titleStyle]}>{title}</Text>
        )}
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </LinearGradient>
    </Pressable>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(6),
    marginVertical: hp(0.5),
    width: '100%',
    borderRadius: 10,
  },
  title: {
    color: AppColors.white,
    fontFamily: AppFonts.InterSemiBold,
    fontSize: 16,
  },
  leftIcon: { marginRight: hp(1) },
  rightIcon: { marginLeft: hp(1) },

  LoginBtn: {
    width: '100%',
    height: hp(7),
    borderRadius: 8,
    marginTop: hp(2),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
