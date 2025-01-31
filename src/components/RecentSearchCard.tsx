import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AppStyles from '../styles/AppStyles';
import {AppColors} from '../utils/color';
import {hp} from '../utils/constant';
import AppFonts from '../utils/appFonts';
import {size} from '../utils/responsiveFonts';
import {RecentSearchCardProps} from '../types/types';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch} from '../store/hooks';
import {setRemoveSingleRecentArticle} from '../store/finance/financeSlices';

const RecentSearchCard: React.FC<RecentSearchCardProps> = ({item}) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  return (
    <Pressable
      onPress={() => {
        navigation.navigate('ShowArticles', {item: item});
      }}
      style={[AppStyles.rowBetween, AppStyles.fullWidth, styles.container]}>
      <Image
        style={styles.cardImg}
        source={
          item?.thumbnail?.resolutions[0]?.url
            ? {uri: item?.thumbnail?.resolutions[0]?.url}
            : require('../assets/images/app_image.png')
        }
      />
      <View style={styles.centerCont}>
        <Text numberOfLines={2} style={styles.title}>
          {item?.title}
        </Text>
        <View style={[AppStyles.row, {gap: 5}]}>
          {/* <Image
            style={styles.img}
            source={require('../assets/images/detail.png')}
          /> */}
          <Text numberOfLines={2} style={styles.artist}>
            {item?.publisher}
          </Text>
        </View>
      </View>
      <View style={AppStyles.fullHeight}>
        <Pressable onPress={() => dispatch(setRemoveSingleRecentArticle(item))}>
          <AntDesign
            name="plus"
            size={25}
            color={AppColors.secondryText}
            style={{transform: [{rotate: '45deg'}]}}
          />
        </Pressable>
      </View>
    </Pressable>
  );
};

export default RecentSearchCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.white,
    padding: hp(1.5),
    borderRadius: 10,
    marginBottom: hp(1.5),
    zIndex: 1,
  },
  cardImg: {
    width: '25%',
    height: hp(9),
    borderRadius: 10,
  },
  centerCont: {
    width: '60%',
    justifyContent: 'space-between',
    height: hp(9),
    paddingVertical: 2,
  },
  img: {width: hp(3.5), height: hp(3.5), borderRadius: 50},
  title: {
    fontFamily: AppFonts.InterSemiBold,
    fontSize: size.sl,
    color: AppColors.black,
  },
  artist: {
    fontFamily: AppFonts.InterMedium,
    fontSize: size.sl,
    color: '#64748B',
  },
});
