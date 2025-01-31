import React, {useEffect} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import AppHeader from '../../components/AppHeader';
import AppLoader from '../../components/AppLoader';
import GlobalIcon from '../../components/GlobalIcon';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {getRecommendedStockDetails} from '../../store/invesment/invesmentActions';
import AppFonts from '../../utils/appFonts';
import {AppColors} from '../../utils/color';
import {hp} from '../../utils/constant';
import {checkNumberValue} from '../../utils/functions';

const RecommendationDetail = ({route}: any) => {
  const symbol = route?.params?.symbol;
  const image = route?.params?.image;
  const stockType = route?.params?.stockType;
  const dispatch = useAppDispatch();
  const recommendedStockDetails = useAppSelector(
    state => state.invesmentSlice.recommendedStockDetails,
  );
  const isLoading = useAppSelector(state => state.commonSlice.isLoading);

  useEffect(() => {
    dispatch(getRecommendedStockDetails(symbol));
  }, [symbol]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.TopHeaderStyle}>
        <AppHeader title="Recommendation" />
      </View>

      {isLoading ? (
        <View style={styles.loader}>
          <AppLoader />
        </View>
      ) : (
        <>
          <Image
            source={
              image?.type == 'uri'
                ? {uri: image?.img}
                : require('../../assets/images/app_image.png')
            }
            style={styles.recImageStyle}
          />
          <View style={styles.HeadingView}>
            <Text style={styles.TitleStyle}>
              {stockType || 'Crypto'} Recommendation:{' '}
              {recommendedStockDetails?.shortName}{' '}
              {recommendedStockDetails?.symbol &&
                `(${recommendedStockDetails.symbol})`}
            </Text>
          </View>

          <View style={styles.DescriptionView}>
            <Text style={styles.subTitleStyle}>
              <GlobalIcon
                library="Entypo"
                name="dot-single"
                size={25}
                color={AppColors.black}
              />
              Market cap: $
              {checkNumberValue(recommendedStockDetails?.MarketCap)}
            </Text>
            <Text style={styles.subTitleStyle}>
              <GlobalIcon
                library="Entypo"
                name="dot-single"
                size={25}
                color={AppColors.black}
              />
              Year-over-year return:{' '}
              {recommendedStockDetails?.YoY == 'NaN'
                ? '0'
                : recommendedStockDetails?.YoY || 0}
              %
            </Text>
            <Text style={styles.TextStyle}>
              {recommendedStockDetails?.insights}
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default RecommendationDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.body2,
  },
  TopHeaderStyle: {
    marginTop: hp(1),
  },
  recImageStyle: {
    alignSelf: 'center',
    width: '90%',
    height: hp(22),
    borderRadius: 7,
    resizeMode: 'cover',
  },
  HeadingView: {
    paddingHorizontal: 18,
    marginTop: hp(3),
  },
  TitleStyle: {
    color: AppColors.black,
    fontSize: 16,
    fontFamily: AppFonts.InterBold,
  },
  subTitleStyle: {
    color: AppColors.black,
    fontSize: 16,
    fontFamily: AppFonts.InterSemiBold,
    marginTop: hp(1),
  },
  DescriptionView: {
    paddingHorizontal: 20,
    marginTop: hp(2),
  },
  TextStyle: {
    color: AppColors.black,
    fontSize: 16,
    fontFamily: AppFonts.InterRegular,
    lineHeight: 26,
    marginTop: hp(3),
    marginBottom: hp(10),
  },
  loader: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
