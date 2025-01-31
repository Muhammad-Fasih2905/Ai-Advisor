import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {size} from '../utils/responsiveFonts';
import GlobalIcon from './GlobalIcon';
import AppFonts from '../utils/appFonts';
import {AppColors} from '../utils/color';
import {hp} from '../utils/constant';

interface AppInputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  togglePasswordVisibility?: boolean;
  iconRight?: boolean;
  onValidation?: (isValid: boolean) => void;
  validationPattern?: RegExp;
  iconRightName?: any;
  libraryName?: any;
  iconColor?: any;
  leftInnerIcon?: React.ReactElement;
  container?: StyleProp<ViewStyle>;
  rightInnerIcon?: React.ReactElement;
  error?: string;
  inputRef?: any
}

const AppInput: React.FC<AppInputProps> = ({
  containerStyle,
  inputStyle,
  iconStyle,
  label,
  labelStyle,
  secureTextEntry,
  togglePasswordVisibility,
  iconRightName,
  iconColor,
  libraryName,
  iconRight,
  onValidation,
  validationPattern,
  multiline,
  leftInnerIcon,
  container,
  rightInnerIcon,
  error,
  inputRef,
  ...props
}) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [value, setValue] = useState('');

  const handleToggleSecureEntry = () => {
    setIsSecure(!isSecure);
  };

  const handleTextChange = (text: string) => {
    setValue(text);
    if (onValidation && validationPattern) {
      const isValid = validationPattern.test(text);
      onValidation(isValid);
    }
    if (props.onChangeText) {
      props.onChangeText(text);
    }
  };

  return (
    <View style={[styles.outerContainer, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View style={[styles.container, container]}>
        {leftInnerIcon}
        <TextInput
        ref={inputRef}
          style={[styles.input, multiline && styles.multilineInput, inputStyle]}
          secureTextEntry={isSecure}
          onChangeText={handleTextChange}
          multiline={multiline}
          value={value}
          placeholderTextColor={AppColors.placeholderText}
          selectionColor={AppColors.primary}
          {...props}
        />
        {rightInnerIcon}
        {togglePasswordVisibility && (
          <TouchableOpacity
            onPress={handleToggleSecureEntry}
            style={[styles.iconStyle, iconStyle]}>
            <GlobalIcon
              name={!isSecure ? 'eye' : 'eye-off'}
              library="Feather"
              color={AppColors.placeholderText}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default AppInput;

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 0,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: AppColors.white,
    borderColor: AppColors.border,
    height: hp(7),
  },
  multilineInput: {
    height: 'auto',
    textAlignVertical: 'top',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: AppColors.black,
    fontFamily: AppFonts.InterRegular,
    paddingHorizontal: 10,
    height: '90%'
  },
  label: {
    marginBottom: 5,
    color: AppColors.white,
    fontSize: size.md,
    alignSelf: 'flex-start',
    fontFamily: AppFonts.InterMedium,
  },
  iconStyle: {
    padding: 5,
  },
  error: {
    fontSize: size.sl,
    color: AppColors.red,
    fontFamily: AppFonts.InterMedium,
    paddingLeft: hp(0.2),
    paddingTop: hp(0.5),
  },
});
