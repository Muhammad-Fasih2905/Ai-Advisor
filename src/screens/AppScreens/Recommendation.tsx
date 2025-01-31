import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppLoader from '../../components/AppLoader';
import AuthTitle from '../../components/AuthTitle';
import NoRecord from '../../components/NoRecord';
import {getAllCategories} from '../../store/finance/financeActions';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {getRecommendedStocks} from '../../store/invesment/invesmentActions';
import AppStyles from '../../styles/AppStyles';
import AppFonts from '../../utils/appFonts';
import {AppColors} from '../../utils/color';
import {hp, screenHeight} from '../../utils/constant';
import {socket} from '../../services/socket';
import {setUpdateRecommendedStock} from '../../store/invesment/invesmentSlices';

interface Category {
  id: string;
  name: string;
  _id: string;
}

const Recommendation = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const recommendedStocks = useAppSelector(
    state => state.invesmentSlice.recommendedStocks,
  );
  const isLoading = useAppSelector(state => state.commonSlice.isLoading);
  const categories = useAppSelector(state => state.financeSlice.categories);
  const user = useAppSelector(state => state.userSlices.user);
  const [activeId, setActiveId] = useState<any>(categories[0]);

  useEffect(() => {
    socket.emit('join-recommended-screen', user?._id);
    socket.on('price-update', data => {
      dispatch(setUpdateRecommendedStock(data));
    });

    return () => {
      socket.emit('leave-recommended-screen', user?._id);
      socket.off('price-update');
    };
  }, []);

  useEffect(() => {
    dispatch(getAllCategories());
    dispatch(getRecommendedStocks('all'));
  }, []);

  const handlePress = (item: Category) => {
    dispatch(getRecommendedStocks(item?._id));
    setActiveId(item);
  };

  const renderCategories = ({item}: any) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        activeId?._id === item?._id && styles.activeCategoryItem,
      ]}
      onPress={() => handlePress(item)}>
      <Text
        style={[
          styles.categoryText,
          activeId?._id === item?._id && styles.activeCategoryText,
        ]}>
        {item?.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.HeadingStyle}>
        <AuthTitle
          title="Recommendation"
          titleColor={AppColors.black}
          titleSize={18}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategories}
          keyExtractor={(item: any) => item?._id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.TitleView}>
        <AuthTitle
          title={`${activeId?.title} Recommended for you`}
          titleColor={AppColors.black}
          titleSize={16}
          titleWeight="600"
        />
      </View>

      {isLoading ? (
        <View style={[{height: hp(30)}, AppStyles.alignJustifyCenter]}>
          <AppLoader />
        </View>
      ) : recommendedStocks[0]?.recommendedSymbols?.length > 0 ? (
        <FlatList
          data={recommendedStocks[0]?.recommendedSymbols}
          renderItem={({item}) => {
            if (!item?.changePercent || !item?.price) {
              return null;
            }
            return (
              <Pressable
                onPress={() => {
                  navigation.navigate('recommendationdetail', {
                    symbol: item?.symbol,
                    stockType: activeId?.title,
                    image: {
                      type: item?.logo ? 'uri' : 'empty',
                      img: item?.logo,
                    },
                  });
                }}>
                <View style={styles.mainView}>
                  <View style={styles.ExpensesCardStyle}>
                    <View style={styles.ImgStyle}>
                      <Image
                        style={{height: hp(5), width: hp(5), borderRadius: 50}}
                        source={
                          item?.logo
                            ? {uri: item?.logo}
                            : require('../../assets/images/logo.png')
                        }
                      />
                    </View>
                    <View style={styles.textStyle}>
                      <Text style={styles.walmartHeading}>{item?.symbol}</Text>
                      <Text numberOfLines={1} style={styles.description}>
                        {item?.shortName || item?.longName}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.ExpensesDelete}>
                    <Text style={styles.ExpensesAmount}>${item?.price}</Text>
                    <Text
                      style={
                        item?.changePercent > 0
                          ? styles.ExpensesPer
                          : styles.ExpensesPer2
                      }>
                      {item?.changePercent > 0
                        ? `+${item?.changePercent}`
                        : item?.changePercent}
                      %
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          }}
        />
      ) : (
        <View
          style={[
            AppStyles.alignJustifyCenter,
            {
              height: screenHeight / 2,
            },
          ]}>
          <NoRecord
            message={
              'No recommendations for this investment type based on your financial profile, investment experience and/or risk tolerance.'
            }
          />
        </View>
      )}
    </View>
  );
};

export default Recommendation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.body2,
  },
  HeadingStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(6),
    marginBottom: hp(3),
  },
  categoryItem: {
    backgroundColor: AppColors.palecyan,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 35,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeCategoryItem: {
    backgroundColor: AppColors.blue,
  },
  categoryText: {
    color: AppColors.blue,
  },
  activeCategoryText: {
    color: AppColors.white,
  },
  categoriesContainer: {
    paddingHorizontal: 10,
  },
  TitleView: {
    paddingHorizontal: 16,
    marginTop: hp(4),
  },
  mainView: {
    backgroundColor: AppColors.white,
    borderRadius: 10,
    paddingHorizontal: hp(2),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    padding: hp(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '93%',
    alignSelf: 'center',
    marginTop: hp(2),
  },
  ExpensesCardStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  walmartHeading: {
    fontSize: 14,
    color: AppColors.black,
    fontFamily: AppFonts.InterBold,
    paddingHorizontal: 3,
  },
  description: {
    fontSize: 12,
    color: AppColors.secondryText,
    fontFamily: AppFonts.InterRegular,
    width: hp(20),
  },
  ExpensesDelete: {
    alignItems: 'center',
  },
  ExpensesAmount: {
    fontSize: 16,
    color: AppColors.black,
    fontFamily: AppFonts.InterBold,
  },
  ExpensesPer: {
    color: '#16A34A',
    fontSize: 12,
    fontFamily: AppFonts.InterBold,
  },
  ExpensesPer2: {
    color: '#E20029',
    fontSize: 12,
    fontFamily: AppFonts.InterBold,
  },
});

{
  /* <Pressable
        onPress={() => {
          navigation.navigate('becommendationdetail');
        }}>
        <View style={styles.mainView}>
          <View style={styles.ExpensesCardStyle}>
            <View style={styles.ImgStyle}>
              <DOGESVG />
            </View>
            <View style={styles.textStyle}>
              <Text style={styles.walmartHeading}>DOGE</Text>
              <Text style={styles.description}> Dogecoin </Text>
            </View>
          </View>
          <View style={styles.ExpensesDelete}>
            <Text style={styles.ExpensesAmount}>$0.1089</Text>
            <Text style={styles.ExpensesPer2}>-1.29%</Text>
          </View>
        </View>
      </Pressable>

      <Pressable
        onPress={() => {
          navigation.navigate('becommendationdetail');
        }}>
        <View style={styles.mainView}>
          <View style={styles.ExpensesCardStyle}>
            <View style={styles.ImgStyle}>
              <TONSVG />
            </View>
            <View style={styles.textStyle}>
              <Text style={styles.walmartHeading}>TON</Text>
              <Text style={styles.description}> Toncoin </Text>
            </View>
          </View>
          <View style={styles.ExpensesDelete}>
            <Text style={styles.ExpensesAmount}>$5.69</Text>
            <Text style={styles.ExpensesPer}>+0.32%</Text>
          </View>
        </View>
      </Pressable>

      <Pressable
        onPress={() => {
          navigation.navigate('becommendationdetail');
        }}>
        <View style={styles.mainView}>
          <View style={styles.ExpensesCardStyle}>
            <View style={styles.ImgStyle}>
              <ADASVG />
            </View>
            <View style={styles.textStyle}>
              <Text style={styles.walmartHeading}>ADA</Text>
              <Text style={styles.description}> Cardano </Text>
            </View>
          </View>
          <View style={styles.ExpensesDelete}>
            <Text style={styles.ExpensesAmount}>$0.389</Text>
            <Text style={styles.ExpensesPer}>+0.27%</Text>
          </View>
        </View>
      </Pressable> */
}
