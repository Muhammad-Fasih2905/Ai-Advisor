import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Progress from 'react-native-progress';
import Svg, {Circle, Path} from 'react-native-svg';
import BellIcon from '../../assets/svgs/bell.svg';
import BellGreyIcon from '../../assets/svgs/bellGrey.svg';
import EditIcon from '../../assets/svgs/editIcon.svg';
import AppButton from '../../components/AppButton';
import AppLoader from '../../components/AppLoader';
import AuthTitle from '../../components/AuthTitle';
import GlobalIcon from '../../components/GlobalIcon';
import InvestmentCard from '../../components/InvestmentCard';
import NoRecord from '../../components/NoRecord';
import {socket} from '../../services/socket';
import {getAllCategories} from '../../store/finance/financeActions';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {getAllInvestments} from '../../store/invesment/invesmentActions';
import {setUpdateAllInvestments} from '../../store/invesment/invesmentSlices';
import {
  getNotificationCounts,
  getUser,
  updateFCMToken,
} from '../../store/user/userActions';
import AppStyles from '../../styles/AppStyles';
import {PortfolioItem} from '../../types/types';
import AppFonts from '../../utils/appFonts';
import {AppColors} from '../../utils/color';
import {
  convertIntoUpdatedSvgData,
  hp,
  portfolioData,
  wp,
} from '../../utils/constant';
import TradingViewChart from '../../components/TradView';

const Home = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const user = useAppSelector(state => state.userSlices.user);
  const isLoading = useAppSelector(state => state.commonSlice.isLoading);
  const categories = useAppSelector(state => state.financeSlice.categories);
  const token = useAppSelector(state => state.userSlices.token);
  const all_invesment = useAppSelector(
    state => state.invesmentSlice.all_invesment,
  );
  const notificationsCount = useAppSelector(
    state => state.userSlices.notificationCount,
  );
  const [progressData, setProgessData] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const chartSize = wp(40);
  const chartRadius = chartSize / 2;
  let startAngle = 0;

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to socket server home');
    });

    socket.emit('join', token);
    socket.emit('join-investment-screen', user?._id);

    const investmentUpdateHandler = (data: any) => {
      // console.log(data, 'investment-update socket data');
      if (data) {
        dispatch(setUpdateAllInvestments(data));
      }
    };
    socket.on('investment-update', investmentUpdateHandler);

    return () => {
      socket.off('leave-investment-screen', user?._id);
    };
  }, [token, user]);

  useEffect(() => {
    dispatch(getNotificationCounts());
  }, []);

  useEffect(() => {
    (async () => {
      await dispatch(updateFCMToken());
      dispatch(getAllCategories());
      dispatch(getAllInvestments());
      if (user?._id) {
        dispatch(getUser(user?._id));
      }
    })();
  }, []);

  const polarToCartesian = (
    cx: number,
    cy: number,
    r: number,
    angleInDegrees: number,
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInRadians),
    };
  };

  const createPieSlice = (item: PortfolioItem, index: number) => {
    const totalValues = portfolioData.reduce(
      (sum: any, item: PortfolioItem) => sum + item?.value,
      0,
    );
    const angle =
      ((item.value == 100 ? 99.99 : item.value) / totalValues) * 360;
    const largeArcFlag = angle > 180 ? 1 : 0;
    const endAngle = startAngle + angle;
    const start = polarToCartesian(
      chartRadius,
      chartRadius,
      chartRadius,
      startAngle,
    );
    const end = polarToCartesian(
      chartRadius,
      chartRadius,
      chartRadius,
      endAngle,
    );
    // console.log(isNaN(end.y) ? 1 : end.y, 'eeeee');

    const d = `
          M ${chartRadius} ${chartRadius}
          L ${isNaN(start.x) ? 1 : start.x} ${isNaN(start.y) ? 1 : start.y}
          A ${chartRadius} ${chartRadius} 0 ${largeArcFlag} 1 ${
      isNaN(end.x) ? 1 : end.x
    } ${isNaN(end.y) ? 1 : end.y}
          Z
        `;

    startAngle += angle;
    return <Path key={index} d={d} fill={item.color} />;
  };

  useEffect(() => {
    const groupedData = all_invesment.reduce((acc: any, item: any) => {
      const category = item.category;
      const value = parseFloat(item.amount);
      if (!acc[category]) {
        acc[category] = {category, items: [], total: 0};
      }
      acc[category].items.push(item);
      acc[category].total += isNaN(value) ? Number(value) : value;
      return acc;
    }, {});

    const overallTotal: any = Object.values(groupedData).reduce(
      (sum, category: any) => sum + category.total,
      0,
    );

    const result = Object.values(groupedData).map((category: any) => {
      const percentage = ((category.total / overallTotal) * 100).toFixed(2);
      return {
        ...category,
        percentage: Number(percentage),
      };
    });

    const totalSum = result.reduce((sum, category) => sum + category.total, 0);
    setTotalValue(totalSum);
    const quantityInvestmentRatios = convertIntoUpdatedSvgData(
      result,
      categories,
    );
    setProgessData(quantityInvestmentRatios);
  }, [all_invesment]);

  return (
    <TradingViewChart/>
    // <ScrollView
    //   bounces={false}
    //   contentContainerStyle={styles.mainContainer}
    //   showsVerticalScrollIndicator={false}>
    //   <StatusBar translucent backgroundColor="transparent" />
    //   <LinearGradient
    //     start={{x: 0, y: 1}}
    //     end={{x: 1, y: 0}}
    //     colors={[AppColors.primary, AppColors.secondary]}
    //     style={styles.gradient}>
    //     <View style={styles.parent}>
    //       <View style={styles.imageTextContainer}>
    //         {user?.avatar && (
    //           <Pressable
    //             onPress={() =>
    //               navigation.navigate('home', {screen: 'tabprofile'})
    //             }>
    //             <Image
    //               style={styles.avatar}
    //               source={
    //                 user?.avatar
    //                   ? {uri: user?.avatar}
    //                   : require('../../assets/images/default_avatar.png')
    //               }
    //             />
    //           </Pressable>
    //         )}
    //         <View>
    //           <AuthTitle
    //             title={`👋 Welcome ${user?.name}!`}
    //             subTitle="Manage Your Investment"
    //             titleColor={AppColors.white}
    //             subTitleColor={AppColors.white}
    //             titleSize={16}
    //             subtitleSize={16}
    //             titleWeight="400"
    //             titleStyle={{
    //               fontFamily: AppFonts.InterRegular,
    //             }}
    //             subtitleStyle={{
    //               fontFamily: AppFonts.InterBold,
    //             }}
    //           />
    //         </View>
    //       </View>
    //       <Pressable
    //         onPress={() => navigation.navigate('notificationScreen')}
    //         style={styles.topIconContainer}>
    //         {notificationsCount > 0 ? <BellIcon /> : <BellGreyIcon />}
    //       </Pressable>
    //     </View>
    //   </LinearGradient>
    //   <View style={styles.summaryContainer}>
    //     <View style={styles.summary}>
    //       {user && (
    //         <TouchableOpacity
    //           style={styles.header}
    //           onPress={() => navigation.navigate('Questionnaire')}>
    //           <View style={{position: 'relative'}}>
    //             <Progress.Circle
    //               progress={
    //                 user?.profileComplete > 0 ? user?.profileComplete / 100 : 0
    //               }
    //               thickness={2}
    //               borderWidth={1}
    //               borderColor="#d1f9fd"
    //               size={30}
    //               color={'#089bab'}
    //             />
    //             <View style={styles.editIcon}>
    //               <EditIcon />
    //             </View>
    //           </View>

    //           <Text style={styles.headerText}>
    //             Complete profile ({user?.profileComplete}% Complete)
    //           </Text>
    //         </TouchableOpacity>
    //       )}

    //       <View style={styles.chartAndTextDiv}>
    //         <Text style={[styles.ExpensesText, {marginBottom: -10}]}>
    //           Current Market Value
    //         </Text>
    //         <View style={styles.chartContainer}>
    //           <Svg width={chartSize} height={chartSize}>
    //             {progressData &&
    //               progressData?.map((item: PortfolioItem, index: number) =>
    //                 createPieSlice(item, index),
    //               )}
    //           </Svg>

    //           <Svg
    //             width={chartSize}
    //             height={chartSize}
    //             style={styles.innerCircle}>
    //             <Circle
    //               cx={chartRadius}
    //               cy={chartRadius}
    //               r={chartRadius * 0.6}
    //               fill="white"
    //             />
    //           </Svg>

    //           <View style={styles.portfolioValue}>
    //             <Text style={styles.portfolioValueText}>Total Portfolio</Text>
    //             <Text style={styles.portfolioValueAmount}>
    //               ${totalValue ? totalValue?.toFixed(2) : 0}
    //             </Text>
    //           </View>
    //         </View>
    //       </View>

    //       <FlatList
    //         horizontal
    //         data={categories?.filter((item: any) => item?.title !== 'All')}
    //         showsHorizontalScrollIndicator={false}
    //         contentContainerStyle={{gap: wp(6)}}
    //         renderItem={({item, index}: {item: any; index: number}) => {
    //           return (
    //             <View key={index} style={styles.legendItem}>
    //               <View
    //                 style={[styles.legendColor, {backgroundColor: item?.color}]}
    //               />
    //               <Text style={styles.legendText}>{item?.title}</Text>
    //             </View>
    //           );
    //         }}
    //       />
    //     </View>
    //   </View>

    //   <View style={styles.Expenses}>
    //     <Text style={styles.ExpensesText}>Recent Investments</Text>

    //     <View>
    //       <AppButton
    //         title="Add Investment"
    //         onPress={() => {
    //           navigation.navigate('addinvestment');
    //         }}
    //         leftIcon={
    //           <GlobalIcon
    //             library="AntDesign"
    //             name="pluscircle"
    //             size={24}
    //             color={AppColors.white}
    //           />
    //         }
    //         LoginBtn={{
    //           width: '57%',
    //           height: hp(5.6),
    //           borderRadius: 30,
    //           marginBottom: hp(2),
    //           marginRight: hp(15),
    //         }}
    //       />
    //     </View>
    //   </View>

    //   {isLoading ? (
    //     <View style={[AppStyles.flex, AppStyles.alignJustifyCenter]}>
    //       <AppLoader />
    //     </View>
    //   ) : all_invesment?.length > 0 ? (
    //     <FlatList
    //       scrollEnabled={false}
    //       nestedScrollEnabled={false}
    //       data={all_invesment}
    //       renderItem={({item}) => <InvestmentCard item={item} />}
    //       style={{paddingBottom: hp(2)}}
    //     />
    //   ) : (
    //     <NoRecord />
    //   )}
    // </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: AppColors.body,
    // marginBottom:hp(10)
  },
  avatar: {
    height: hp(6),
    width: hp(6),
    borderRadius: 50,
    resizeMode: 'cover',
  },
  gradient: {
    paddingHorizontal: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'space-between',
    height: hp(35),
  },
  parent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 140,
  },
  mainContainer: {
    flexGrow: 1,
    backgroundColor: AppColors.white,
  },
  imageTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  topIconContainer: {
    backgroundColor: AppColors.white,
    width: wp(10),
    height: hp(5),
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  iconContainer: {
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(1),
    borderWidth: 1,
    alignSelf: 'center',
    borderColor: AppColors.blue,
    padding: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
    alignSelf: 'flex-start',
    paddingHorizontal: wp(4),
  },
  editIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -7.5}, {translateY: -7.5}],
  },
  headerText: {
    fontSize: 13,
    marginLeft: wp(2),
    color: AppColors.blue,
    fontFamily: AppFonts.InterMedium,
    textDecorationLine: 'underline',
    textDecorationColor: AppColors.blue,
  },
  summaryContainer: {
    marginTop: hp(-20),
    marginHorizontal: hp(2),
    marginBottom: hp(2),
  },
  summary: {
    backgroundColor: AppColors.white,
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: hp(1.9),
    alignItems: 'center',
    borderRadius: 15,
    position: 'relative',
    // top: hp(-10),
    // marginHorizontal: hp(2)
    // marginBottom: hp(2)
  },
  chartAndTextDiv: {
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 25,
    // width: '100%'
  },
  summaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    height: 90,
  },
  summaryCard: {
    flex: 1,
    padding: hp(1),
  },
  Expenses: {
    flexDirection: 'row',
    // marginTop: hp(8),
    // marginBottom: hp(1),
    justifyContent: 'space-around',
    paddingHorizontal: hp(2),
    alignItems: 'center',
  },
  ViewAll: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    width: '50%',
  },
  ExpensesText: {
    fontSize: 16,
    color: AppColors.black,
    fontFamily: AppFonts.InterBold,
    lineHeight: 20,
  },
  ViewAllText: {
    fontSize: 14,
    color: AppColors.secondryText,
    fontFamily: AppFonts.InterRegular,
    lineHeight: 22,
  },
  ImgStyle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImgNetflix: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImgMedicalCheckup: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImgTravel: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    position: 'relative',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(2),
    paddingHorizontal: wp(0.1),
    // width: '50%',
    // paddingLeft: hp(3),
  },
  pieChart: {
    overflow: 'hidden',
  },
  pieSlice: {
    position: 'absolute',
    overflow: 'hidden',
  },
  pieSliceInner: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    backgroundColor: 'white',
  },
  portfolioValue: {
    width: wp(20),
    // textAlign: 'center',
    justifyContent: 'flex-start',
    position: 'absolute',
    alignItems: 'center',
    // left: 65,
  },
  portfolioValueText: {
    fontSize: 12,
    color: AppColors.silverText,
    fontFamily: AppFonts.InterRegular,
    textAlign: 'center',
  },
  portfolioValueAmount: {
    fontSize: 17,
    fontFamily: AppFonts.InterBold,
    color: AppColors.black,
    width: hp(10),
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'column',
    width: '50%',
    alignItems: 'center',
    height: hp(20),
    // paddingLeft: hp(2)
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    // width: '100%',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    // width: '90%',
  },
});
