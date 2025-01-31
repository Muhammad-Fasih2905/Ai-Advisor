import {StyleSheet, Text, View, ViewStyle, ActivityIndicator} from 'react-native';
import React from 'react';
import {AppColors} from '../utils/color';
import { hp } from '../utils/constant';

interface AppLoaderProps {
  color?: string;
  styles?: ViewStyle;
}

const AppLoader: React.FC<AppLoaderProps> = ({
  color = AppColors.primary,
  styles = {height: hp(6), width: hp(6)},
}) => {
  return <ActivityIndicator style={styles} color={color} size="large" />;
};

export default AppLoader;

const styles = StyleSheet.create({});
