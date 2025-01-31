import moment from 'moment';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useAppDispatch} from '../store/hooks';
import {
  deleteInvestment,
  getAllInvestments,
} from '../store/invesment/invesmentActions';
import AppStyles from '../styles/AppStyles';
import {InvestmentCardProps} from '../types/types';
import AppFonts from '../utils/appFonts';
import {AppColors} from '../utils/color';
import {hp} from '../utils/constant';
import {addCommasValue, calculateChange} from '../utils/functions';
import CustomAppModal from './CustomModal';
import GlobalIcon from './GlobalIcon';

const InvestmentCard: React.FC<InvestmentCardProps> = ({item}) => {
  const dispatch = useAppDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteCard = async () => {
    setLoading(true);
    const res = await dispatch(deleteInvestment(item?._id)).unwrap();
    if (res.success == true) {
      dispatch(getAllInvestments());
      setModalVisible(false);
    }
    setLoading(false);
  };

  const change = calculateChange(item?.amount, item?.investedAmount);

  return (
    <>
      <View style={styles.mainView}>
        <View style={styles.ExpensesCardStyle}>
          <View style={styles.ImgStyle}>
            {item?.logo ? (
              <Image style={styles.logo} source={{uri: item?.logo}} />
            ) : (
              <Image
                style={styles.logo}
                source={require('../assets/images/logo.png')}
              />
            )}
          </View>
          <View style={styles.textStyle}>
            <Text numberOfLines={1} style={styles.walmartHeading}>
              {item?.asset}
            </Text>
            <Text style={styles.description}>
              {moment(item?.createdAt).format('DD MMM')}
            </Text>
          </View>
        </View>
        <View style={styles.ExpensesDelete}>
          <View style={{width: hp(10), alignItems: 'flex-end'}}>
            <View style={styles.values}>
              <Text style={styles.ExpensesAmount}>CMV:</Text>
              <Text style={styles.ExpensesAmount}>
                ${addCommasValue(item?.amount)}
              </Text>
            </View>
            <View style={styles.values}>
              <Text style={[styles.ExpensesAmount, {fontSize: 12}]}>
                Today's PNL:
              </Text>
              <Text
                style={[
                  styles.changeAmount,
                  {
                    color:
                      change?.status == 'increase'
                        ? AppColors.primaryGreen
                        : AppColors.primaryRed,
                  },
                ]}>
                {isNaN(Number(change?.percentageChange))
                  ? '0%'
                  : change?.percentageChange + '%'}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => setModalVisible(true)}
            style={styles.ExpensesIconBg}>
            <GlobalIcon
              library="AntDesign"
              name="delete"
              size={16}
              color={AppColors.white}
            />
          </Pressable>
        </View>
      </View>

      <CustomAppModal
        style={AppStyles.fullHeight}
        visible={modalVisible}
        setVisible={setModalVisible}>
        <Pressable
          onPress={() => setModalVisible(!modalVisible)}
          style={[
            AppStyles.widthFullPercent,
            AppStyles.fullHeight,
            AppStyles.alignJustifyCenter,
            {position: 'absolute'},
          ]}>
          <View style={styles.modalInnerContainer}>
            <Text style={AppStyles.h3}>
              Are you sure you want to delete this investment?
            </Text>
            <View style={AppStyles.rowBetween}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[
                  styles.modalBtn,
                  {
                    backgroundColor: AppColors.transparent,
                    borderColor: AppColors.primary,
                  },
                ]}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteCard()}
                style={styles.modalBtn}>
                {loading ? (
                  <ActivityIndicator size="small" color={AppColors.white} />
                ) : (
                  <Text style={[styles.btnText, {color: AppColors.white}]}>
                    Yes
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </CustomAppModal>
    </>
  );
};

export default InvestmentCard;

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: AppColors.white,
    borderRadius: 10,
    paddingHorizontal: hp(2),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    marginTop: hp(2),
    padding: hp(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '92%',
    alignSelf: 'center',
  },
  ExpensesCardStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '50%',
  },
  ExpensesDelete: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    width: '50%',
  },
  walmartHeading: {
    fontSize: 14,
    color: AppColors.black,
    fontFamily: AppFonts.InterBold,
    width: hp(14),
  },
  ImgStyle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    gap: 3,
  },
  description: {
    fontSize: 12,
    color: AppColors.secondryText,
    fontFamily: AppFonts.InterRegular,
  },
  ExpensesAmount: {
    fontSize: 16,
    color: AppColors.black,
    fontFamily: AppFonts.InterBold,
  },
  changeAmount: {
    fontSize: 13,
    color: AppColors.black,
    fontFamily: AppFonts.InterSemiBold,
  },
  ExpensesIconBg: {
    backgroundColor: '#FF2C20',
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalInnerContainer: {
    width: '85%',
    backgroundColor: AppColors.white,
    opacity: 1,
    zIndex: 1,
    padding: hp(2),
    borderRadius: 10,
    gap: 35,
  },
  btn: {
    width: '48%',
  },
  modalBtn: {
    backgroundColor: AppColors.red,
    width: '48%',
    paddingVertical: hp(1.8),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.red,
  },
  btnText: {
    color: AppColors.black,
    fontFamily: AppFonts.InterSemiBold,
    fontSize: 16,
  },
  logo: {
    height: hp(6),
    width: hp(6),
    borderRadius: 50,
  },
  values: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});
