import {Platform, StyleSheet} from 'react-native';
import {size} from '../utils/responsiveFonts';
import {AppColors} from '../utils/color';
import AppFonts from '../utils/appFonts';
import {hp, screenWidth} from '../utils/constant';

const AppStyles = StyleSheet.create({
  body: {
    paddingHorizontal: hp(2),
    backgroundColor: AppColors.body,
  },
  container: {
    flex: 1,
    paddingHorizontal: hp(2),
    backgroundColor: AppColors.body,
  },
  flex: {
    flex: 1,
  },
  halfFlex: {flex: 0.5},
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  justifyBottom: {
    justifyContent: 'flex-end',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexBetween: {
    flex: 1,
    justifyContent: 'space-between',
  },
  center: {
    alignItems: 'center',
  },
  alignJustifyCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  widthFullPercent: {
    width: '100%',
  },
  screenWidthHeight: {
    width: screenWidth,
    height: '100%',
  },
  headTitle: {
    fontFamily: AppFonts.InterBold,
    fontSize: size.xxxvlg,
    color: AppColors.white,
    fontWeight: Platform.OS == 'ios' ? 'bold' : undefined
  },
  subTitle: {
    fontFamily: AppFonts.InterMedium,
    fontSize: size.md,
    color: AppColors.white,
    fontWeight: Platform.OS == 'ios' ? '500' : undefined
  },
  AuthTitle: {
    fontFamily: AppFonts.InterBold,
    fontSize: size.xxlg,
    color: AppColors.white,
  },
  AuthSubTitle: {
    fontFamily: AppFonts.InterLight,
    fontSize: size.lg,
    color: AppColors.white,
  },
  iconsBackground: {
    backgroundColor: 'rgba(3, 179, 186, 0.2)',
    padding: hp(2),
    borderRadius: hp(5),
    marginHorizontal: hp(1),
  },
  inputLabelStyle: {
    color: AppColors.black,
    fontFamily: AppFonts.InterBold,
    fontSize: 14,
    marginTop:hp(3)
  },
  activeTab: {
    borderTopColor: AppColors.primary,
    borderTopWidth: 2.5,
    paddingHorizontal: hp(2),
    paddingTop: hp(1) - 2.5
  },
  heading: {
    fontFamily: AppFonts.InterBold,
    color: AppColors.black,
    fontSize: size.xxxlg,
  },
  greyTitle: {
    fontFamily: AppFonts.InterLight,
    fontSize: size.s,
    color: AppColors.black,
  },
  title: {
    fontFamily: AppFonts.InterBold,
    fontSize: size.md,
    color: AppColors.black,
  },
  h2: {
    fontFamily: AppFonts.InterBold,
    fontSize: size.slg,
    color: AppColors.black,
  },
  h3: {
    fontFamily: AppFonts.InterBold,
    fontSize: size.lg,
    color: AppColors.black,
  },
  h6: {
    fontFamily: AppFonts.InterMedium,
    fontSize: size.s,
    color: AppColors.black,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  fullWidth: {
    width: '100%',
  },
  fullHeight: {
    height: '100%',
  },
  inputContainer: {
    backgroundColor: AppColors.white,
    borderColor: '#d2d2d2',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: hp(1.5),
    paddingVertical: hp(1),
    marginBottom: hp(2),
  },
  
  accountsTab: {
    borderWidth: 1.5,
    borderColor: AppColors.secondryText,
    borderRadius: hp(2),
    padding: hp(1.5),
    marginVertical: hp(1),
  },
  accountTabTitle: {
    marginLeft: hp(1),
    fontFamily: AppFonts.InterMedium,
    color: AppColors.black,
    fontSize: size.md,
  },
});

export default AppStyles;

export const MarkDownStyles = StyleSheet.create({
  text: {
    fontSize: 14,
    lineHeight: 25,
    fontFamily: AppFonts.InterRegular,
    color: AppColors.black,
  },
});