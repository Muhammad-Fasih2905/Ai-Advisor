import React from 'react';
import {StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import AppFonts from '../utils/appFonts';
import {AppColors} from '../utils/color';
import {hp, responsiveSize} from '../utils/constant';
import {fontSize, size} from '../utils/responsiveFonts';

interface AppDropdownProps {
  label?: string;
  optional?: boolean;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  style?: StyleProp<ViewStyle>;
  data?: any;
  onConfirmSelectItem?: any;
  error?: any;
  labelContainer?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: any;
  labelType?: boolean
}

const AppDropdown: React.FC<AppDropdownProps> = ({
  label,
  optional = false,
  placeholder,
  value,
  onChangeText,
  style = {},
  data,
  onConfirmSelectItem,
  error,
  labelContainer,
  labelStyle,
  inputStyle,
  labelType = false
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <View style={[styles.labelContainer, labelContainer]}>
        <Text style={[styles.label, labelStyle]}>
          {label}
          {optional && <Text style={{color: 'red'}}>*</Text>}
        </Text>
      </View>}
      <Dropdown
        // renderRightIcon={() => (
        //   <View style={{paddingRight: hp(1)}}>
        //     <GlobalIcon
        //       color={AppColors.greyText}
        //       name="caretdown"
        //       size={hp(1.2)}
        //       library="AntDesign"
        //     />
        //   </View>
        // )}
        iconStyle={{marginRight: hp(1)}}
        placeholderStyle={{
          fontFamily: AppFonts.InterLight,
        }}
        style={[styles.input, inputStyle]}
        data={data}
        maxHeight={300}
        labelField={data ? 'label' : 'label'}
        valueField={labelType ? "label" : "value"}
        placeholder={placeholder}
        onConfirmSelectItem={onConfirmSelectItem}
        value={value}
        selectedTextStyle={{color: AppColors.black}}
        showsVerticalScrollIndicator={false}
        onChange={onChangeText}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default AppDropdown;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: hp(2),
  },
  labelContainer: {
    // position: 'absolute',
    marginTop:hp(1)
  },
  label: {
    // marginBottom: 5,
    color: AppColors.black,
    fontSize: size.md,
    alignSelf: 'flex-start',
    fontFamily: AppFonts.InterBold,
  },
  labelFocused: {
    color: 'blue',
  },
  input: {
    width: '100%',
    height: responsiveSize(42),
    color: AppColors.black,
    borderColor: '#ECECEC',
    borderWidth: 1,
    backgroundColor: '#f8f8f8',
    fontSize: fontSize(12),
    fontFamily: AppFonts.InterRegular,
    borderRadius: 7,
    paddingLeft: 12,
    marginTop: hp(1.7),
  },
  error: {
    fontSize: size.sl,
    color: AppColors.red,
    fontFamily: AppFonts.InterMedium,
    paddingLeft: hp(0.2),
    paddingTop: hp(0.5),
  },
});
