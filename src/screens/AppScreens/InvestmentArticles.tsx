import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FireSvg from '../../assets/svgs/fire.svg';
import AppInput from '../../components/AppInput';
import AppLoader from '../../components/AppLoader';
import AuthTitle from '../../components/AuthTitle';
import Chart from '../../components/Chart';
import GlobalIcon from '../../components/GlobalIcon';
import NoRecord from '../../components/NoRecord';
import {
  getAllCategories,
  getCategorieNews,
  getLatestNews,
  getSearchArticles,
  getTrendingStocks,
} from '../../store/finance/financeActions';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import AppStyles from '../../styles/AppStyles';
import AppFonts from '../../utils/appFonts';
import {AppColors} from '../../utils/color';
import {hp, screenHeight, screenWidth, wp} from '../../utils/constant';
import {handleValues} from '../../utils/functions';
import RecentSearchCard from '../../components/RecentSearchCard';
import {
  setRecentArticles,
  setSearchArticles,
  setUpdateTrendingStock,
} from '../../store/finance/financeSlices';
import {showMessage} from '../../store/common/commonSlice';
import {socket} from '../../services/socket';

const InvestmentArticles = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const inputRef = useRef(null);
  const categories = useAppSelector(state => state.financeSlice.categories);
  const latestNews = useAppSelector(state => state.financeSlice.latestNews);
  const isLoading = useAppSelector(state => state.commonSlice.isLoading);
  const financialNews = useAppSelector(
    state => state.financeSlice.financialNews,
  );
  const trendingStock = useAppSelector(
    state => state.financeSlice.trendingStock,
  );
  const searchArticles = useAppSelector(
    state => state.financeSlice.searchArticles,
  );
  const recentArticles = useAppSelector(
    state => state.financeSlice.recentArticles,
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeId, setActiveId] = useState<any>(categories[0]);
  const [loading, setLoading] = useState(false);
  const [refreshLoader, setRefreshLoader] = useState(false);
  const [isRecentSearch, setIsRecentSearch] = useState(false);
  const [isSearchData, setIsSearchData] = useState(false);

  useEffect(() => {
    dispatch(getTrendingStocks());
    dispatch(getLatestNews());
  }, []);

  useEffect(() => {
    socket.emit('join-trending-screen');

    socket.on('price-update', data => {
      dispatch(setUpdateTrendingStock(data));
    });

    return () => {
      socket.emit('leave-trending-screen');
      socket.off('price-update');
    };
  }, []);

  useEffect(() => {
    dispatch(getCategorieNews('trending news'));
  }, []);

  const handleSearch = async () => {
    try {
      if (searchQuery == '') {
        dispatch(showMessage('Search is required'));
        return;
      }
      setLoading(true);
      const res = await dispatch(getSearchArticles(searchQuery)).unwrap();
      if (res.success == true) {
        setIsRecentSearch(false);
        setLoading(false);
        setIsSearchData(true);
      }
    } catch (error) {
      setLoading(false);
      console.log(error, 'error');
    }
  };

  const handlePress = async (item: any) => {
    setActiveId(item);
    setLoading(true);
    const topic = item?.title == 'All' ? 'trending news' : item?.title;
    const res = await dispatch(getCategorieNews(topic)).unwrap();
    if (res.success == true) {
      setLoading(false);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshLoader(true);
    dispatch(getTrendingStocks());
    dispatch(getLatestNews());
    dispatch(getAllCategories());
    setSearchQuery('');
    setIsRecentSearch(false);
    dispatch(setSearchArticles([]));
    setIsSearchData(false);
    setTimeout(() => {
      setRefreshLoader(false);
    }, 1000);
  };

  const renderCategories = ({item}: any) => (
    <Pressable
      style={[
        styles.categoryItem,
        activeId?._id == item?._id && styles.activeCategoryItem,
      ]}
      onPress={() => handlePress(item)}>
      <Text
        style={[
          styles.categoryText,
          activeId?._id == item?._id && styles.activeCategoryText,
        ]}>
        {item?.title}
      </Text>
    </Pressable>
  );

  const renderStockItem = ({item}: any) => {
    return (
      <View style={styles.manNflx}>
        <AuthTitle
          title={item?.symbol || ''}
          subTitle={item?.summary?.shortName || ''}
          titleColor={AppColors.black}
          titleSize={14}
          subTitleColor="#818898"
          subtitleSize={12}
          numberOfLines={1}
        />
        <View>
          <View style={{marginLeft: hp(2), marginRight: hp(2)}}>
            {item?.summary?.quotes?.length > 0 && (
              <Chart
                quotes={item?.summary?.quotes || []}
                color={item?.summary?.changePercent > 0 ? '#16A34A' : '#E20029'}
              />
            )}
          </View>
        </View>
        <AuthTitle
          title={item?.summary?.price || 0}
          subTitle={handleValues(item?.summary?.changePercent)}
          titleColor={AppColors.black}
          titleSize={14}
          subTitleColor={
            item?.summary?.changePercent > 0 ? '#16A34A' : '#E20029'
          }
          subtitleSize={12}
        />
      </View>
    );
  };

  const renderPostItem = ({item}: {item: any}) => {
    return (
      <Pressable
        style={styles.postContainer}
        onPress={() => navigation.navigate('ShowArticles', {item: item})}>
        <Image
          style={styles.articalImage}
          source={
            item?.thumbnail?.resolutions[0]?.url
              ? {uri: item?.thumbnail?.resolutions[0]?.url}
              : require('../../assets/images/app_image.png')
          }
        />

        <View style={{paddingHorizontal: 2}}>
          <AuthTitle
            title={item?.title}
            titleColor={AppColors.black}
            titleSize={12}
            titleStyle={{marginTop: hp(1)}}
            numberOfLines={2}
          />
          <View style={styles.authorContainer}>
            <Text style={styles.authorText}>{item?.publisher}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  useEffect(() => {
    if (isRecentSearch) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isRecentSearch]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        isRecentSearch ? undefined : (
          <RefreshControl refreshing={refreshLoader} onRefresh={onRefresh} />
        )
      }
      showsVerticalScrollIndicator={false}>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />
      <View style={styles.header}>
        <Pressable
          style={styles.icon}
          onPress={() => {
            setIsRecentSearch(false);
          }}>
          {isRecentSearch && (
            <GlobalIcon
              library="CustomIcon"
              name="chevron_left"
              size={24}
              color={AppColors.black}
            />
          )}
        </Pressable>
        {!isRecentSearch && (
          <Text style={styles.headingText}>Investment Articles/News</Text>
        )}
        <View style={styles.icon}>
          <GlobalIcon
            library="Entypo"
            name="cross"
            size={24}
            color={AppColors.white}
          />
        </View>
      </View>
      <View style={[styles.Searchbar, {position: 'relative'}]}>
        <Pressable
          style={{width: '100%', zIndex: 1}}
          onPress={() => setIsRecentSearch(true)}>
          <AppInput
            inputRef={inputRef}
            editable={Platform.OS == 'android' ? isRecentSearch : true}
            placeholder="Search for news"
            value={searchQuery}
            onFocus={() => setIsRecentSearch(true)}
            onChangeText={(text: string) => {
              setSearchQuery(text);
            }}
            rightInnerIcon={
              <>
                {isSearchData && (
                  <Pressable
                    style={styles.crossIcon}
                    onPress={() => {
                      setSearchQuery('');
                      setIsRecentSearch(false);
                      dispatch(setSearchArticles([]));
                      setIsSearchData(false);
                    }}>
                    <GlobalIcon
                      library="Entypo"
                      name="cross"
                      size={24}
                      color={AppColors.white}
                    />
                  </Pressable>
                )}
                <Pressable disabled={isLoading} onPress={() => handleSearch()}>
                  <LinearGradient
                    start={{x: 0, y: 1}}
                    end={{x: 1, y: 0}}
                    colors={[AppColors.primary, AppColors.secondary]}
                    style={styles.gradientIconContainer}>
                    {loading ? (
                      <ActivityIndicator size={24} color={AppColors.white} />
                    ) : (
                      <GlobalIcon
                        library="CustomIcon"
                        name="search"
                        size={24}
                        color={AppColors.white}
                      />
                    )}
                  </LinearGradient>
                </Pressable>
              </>
            }
          />
        </Pressable>
        {isRecentSearch && (
          <View style={[styles.recentSearchCont, {zIndex: 0}]}>
            <View style={{height: screenHeight / 1.5}}>
              <Text style={[AppStyles.title, styles.recentHeader]}>
                Recent Searches
              </Text>
              <FlatList
                data={recentArticles}
                nestedScrollEnabled={true}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => <RecentSearchCard item={item} />}
                keyExtractor={(item: any) => item?._id}
              />
            </View>
          </View>
        )}
      </View>

      <View style={{zIndex: -1}}>
        <View style={styles.TrendingStocks}>
          <FireSvg />
          <AuthTitle
            title="Trending Stocks"
            titleColor={AppColors.black}
            titleSize={16}
            titleWeight="700"
            titleStyle={{marginBottom: hp(2)}}
          />
        </View>

        {isLoading ? (
          <View style={[{height: hp(10)}, AppStyles.alignJustifyCenter]}>
            <AppLoader />
          </View>
        ) : trendingStock?.length > 0 ? (
          <FlatList
            data={trendingStock}
            renderItem={renderStockItem}
            keyExtractor={(item: any) => item?._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{marginBottom: hp(3)}}
            style={{marginRight: 20}}
          />
        ) : (
          <View style={[AppStyles.alignJustifyCenter, {height: hp(12)}]}>
            <NoRecord />
          </View>
        )}

        {!isRecentSearch &&
          (!isSearchData ? (
            <>
              <View style={styles.latestNewsMain}>
                <AuthTitle
                  title="Latest Articles/News"
                  titleColor={AppColors.black}
                  titleSize={16}
                  titleWeight="700"
                  titleStyle={{marginBottom: hp(2)}}
                />
                {isLoading ? (
                  <View
                    style={[{height: hp(30)}, AppStyles.alignJustifyCenter]}>
                    <AppLoader />
                  </View>
                ) : latestNews?.length > 0 ? (
                  <FlatList
                    data={latestNews}
                    renderItem={renderPostItem}
                    keyExtractor={item => item?._id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom: hp(4)}}
                  />
                ) : (
                  <View
                    style={[AppStyles.alignJustifyCenter, {height: hp(12)}]}>
                    <NoRecord />
                  </View>
                )}
              </View>

              <View style={styles.CategoriesContainer}>
                <AuthTitle
                  title="Categories"
                  titleColor={AppColors.black}
                  titleSize={16}
                  titleWeight="700"
                  titleStyle={{marginBottom: hp(2)}}
                />
                <FlatList
                  data={categories}
                  renderItem={renderCategories}
                  keyExtractor={(item: any) => item?._id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />

                {loading ? (
                  <View
                    style={[{height: hp(30)}, AppStyles.alignJustifyCenter]}>
                    <AppLoader />
                  </View>
                ) : financialNews?.length > 0 ? (
                  <FlatList
                    nestedScrollEnabled={false}
                    scrollEnabled={false}
                    data={financialNews}
                    renderItem={({item}) => (
                      <Pressable
                        onPress={() =>
                          navigation.navigate('ShowArticles', {item: item})
                        }
                        style={styles.detailContainer}>
                        <Image
                          style={styles.img}
                          source={
                            item?.thumbnail?.resolutions[0]?.url
                              ? {uri: item?.thumbnail?.resolutions[0]?.url}
                              : require('../../assets/images/app_image.png')
                          }
                        />
                        <Text numberOfLines={2} style={styles.title}>
                          {item?.title}
                        </Text>
                        <View
                          style={[
                            styles.authorContainer,
                            {paddingHorizontal: 3},
                          ]}>
                          <Text style={styles.authorText}>
                            {item?.publisher}
                          </Text>
                        </View>
                      </Pressable>
                    )}
                    keyExtractor={item => item?._id}
                    showsVerticalScrollIndicator={false}
                    style={{paddingBottom: hp(5)}}
                  />
                ) : (
                  <View
                    style={[AppStyles.alignJustifyCenter, {height: hp(12)}]}>
                    <NoRecord />
                  </View>
                )}
              </View>
            </>
          ) : (
            <FlatList
              nestedScrollEnabled={false}
              scrollEnabled={false}
              data={searchArticles}
              ListHeaderComponent={
                <AuthTitle
                  title="Search Results"
                  titleColor={AppColors.black}
                  titleSize={16}
                  titleWeight="700"
                />
              }
              renderItem={({item}) => (
                <Pressable
                  onPress={() => {
                    dispatch(setRecentArticles(item));
                    navigation.navigate('ShowArticles', {item: item});
                  }}
                  style={styles.detailContainer}>
                  <Image
                    style={styles.img}
                    source={
                      item?.thumbnail?.resolutions[0]?.url
                        ? {uri: item?.thumbnail?.resolutions[0]?.url}
                        : require('../../assets/images/app_image.png')
                    }
                  />
                  <Text numberOfLines={2} style={styles.title}>
                    {item?.title}
                  </Text>
                  <View
                    style={[styles.authorContainer, {paddingHorizontal: 3}]}>
                    <Text style={styles.authorText}>{item?.publisher}</Text>
                  </View>
                </Pressable>
              )}
              ListEmptyComponent={<NoRecord />}
              keyExtractor={item => item?._id}
              showsVerticalScrollIndicator={false}
              style={{paddingBottom: hp(5), paddingHorizontal: 16}}
            />
          ))}
      </View>
    </ScrollView>
  );
};

export default InvestmentArticles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.body,
    paddingBottom: hp(12),
  },
  header: {
    marginTop: hp(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  icon: {width: '10%'},
  headingText: {
    fontSize: 16,
    color: AppColors.black,
    fontFamily: AppFonts.InterBold,
    textAlign: 'center',
  },
  crossIcon: {
    marginRight: hp(2),
    backgroundColor: AppColors.secondryText,
    borderRadius: 50,
  },
  Searchbar: {
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: hp(3),
  },
  gradientIconContainer: {
    padding: hp(1.2),
    borderRadius: 6,
  },
  recentSearchCont: {
    backgroundColor: AppColors.body,
    width: '100%',
    height: screenHeight,
    position: 'absolute',
    zIndex: 1,
    top: hp(9),
  },
  recentHeader: {
    marginTop: hp(1),
    marginBottom: hp(2),
  },
  TrendingStocks: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginTop: hp(2),
    gap: 10,
  },
  manNflx: {
    // paddingVertical: 10,
    height: hp(10),
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
    // elevation: 5,
    marginLeft: hp(1),
    marginTop: hp(0.3),
    borderRadius: 5,
  },
  latestNewsMain: {
    flexDirection: 'column',
    paddingHorizontal: 16,
  },
  postContainer: {
    marginVertical: 2,
    padding: 8,
    flexDirection: 'column',
    width: 250,
    marginRight: 5,
    backgroundColor: 'white',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
    // elevation: 5,
    borderRadius: 10,
    paddingBottom: hp(2),
    marginLeft: hp(1),
    borderWidth: 1,
    borderColor: AppColors.white,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorText: {
    color: AppColors.steelblue,
    fontSize: 14,
    fontFamily: AppFonts.InterRegular,
  },
  CategoriesContainer: {
    paddingHorizontal: 14,
  },
  categoryItem: {
    backgroundColor: AppColors.palecyan,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 30,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeCategoryItem: {
    backgroundColor: AppColors.blue,
  },
  activeCategoryText: {
    color: AppColors.white,
  },
  categoryText: {
    color: AppColors.blue,
  },
  detailContainer: {
    marginTop: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
    // elevation: 5,
    padding: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 10,
    color: AppColors.black,
    fontFamily: AppFonts.InterBold,
    paddingHorizontal: 5,
  },
  authorImage: {
    width: 35,
    height: 35,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  categoryImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  articalImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  tradingImage: {
    marginHorizontal: 20,
    width: wp(20),
    resizeMode: 'contain',
  },
  img: {
    width: screenWidth - hp(5),
    height: screenHeight / 4,
    borderRadius: 10,
  },
});
