import {useIsFocused, useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import NewsHeader from '../../components/NewsHeader';
import NoRecord from '../../components/NoRecord';
import {setLoading} from '../../store/common/commonSlice';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {
  getNotificationCounts,
  getNotifications,
} from '../../store/user/userActions';
import {setNotifications, setPagination} from '../../store/user/userSlices';
import {NotificationNews} from '../../types/types';
import AppFonts from '../../utils/appFonts';
import {AppColors} from '../../utils/color';
import {hp, screenHeight, wp} from '../../utils/constant';
import {showNotificationImage} from '../../utils/functions';

const NewsItem: React.FC<{item: NotificationNews}> = ({item}) => {
  const navigation = useNavigation();
  return (
    <Pressable
      disabled={item?.type == 'price'}
      onPress={() => {
        if (item?.type == 'news') {
          navigation.navigate('ShowArticles', {item: item});
        } else {
          navigation.goBack();
        }
      }}
      style={styles.newsItem}>
      <Image source={showNotificationImage(item)} style={styles.newsImage} />
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle}>{item?.description}</Text>
        <Text style={styles.dateText}>
          {moment(item?.createdAt).format('DD MMM')}
        </Text>
      </View>
    </Pressable>
  );
};
const NotificationScreen = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(state => state.userSlices.notifications);
  const pagination = useAppSelector(state => state.userSlices.pagination);
  const isLoading = useAppSelector(state => state.commonSlice.isLoading);
  const [paginationLoading, setPaginationLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (notifications?.length == 0) {
        dispatch(setLoading(true));
        const res: any = await dispatch(getNotifications(pagination)).unwrap();
        if (res.success == true) {
          dispatch(
            setPagination({
              skip: notifications?.length,
              limit: 10,
            }),
          );
          dispatch(setLoading(false));
          dispatch(getNotificationCounts());
        } else {
          dispatch(setLoading(false));
        }
      }
    })();
  }, []);

  const getData = async () => {
    if (!paginationLoading) {
      setPaginationLoading(true);
      const res: any = await dispatch(getNotifications(pagination)).unwrap();
      if (res.success == true) {
        dispatch(
          setPagination({
            skip: notifications?.length,
            limit: 5,
          }),
        );
        dispatch(getNotificationCounts());
        setPaginationLoading(false);
      }
    }
  };

  const renderFooter = () => {
    if (!paginationLoading) return null;
    return (
      <View style={{padding: 10}}>
        <ActivityIndicator size="large" color={AppColors.primary} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.HeaderView}>
        <NewsHeader title="Notifications" />
      </View>
      {isLoading ? (
        <View style={{height: screenHeight / 2.2}}>
          <ActivityIndicator size={'large'} color={AppColors.primary} />
        </View>
      ) : notifications?.length > 0 ? (
        <FlatList
          bounces={false}
          data={notifications}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => <NewsItem item={item} />}
          keyExtractor={(item: NotificationNews) => item?._id + Math.random()}
          style={styles.list}
          onEndReached={() => (notifications?.length >= 10 ? getData() : {})}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            notifications?.length >= 10 ? renderFooter : <></>
          }
        />
      ) : (
        <View style={{height: screenHeight / 2.2}}>
          <NoRecord />
        </View>
      )}
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  list: {
    padding: wp(4),
    paddingBottom: 0,
  },
  HeaderView: {
    paddingHorizontal: 12,
    marginTop: hp(6),
  },
  newsItem: {
    flexDirection: 'row',
    backgroundColor: AppColors.white,
    borderRadius: wp(2),
    marginBottom: hp(2),
    padding: wp(3),
    borderBottomWidth: 1,
    borderBottomColor: '#EBE9EC',
  },
  newsImage: {
    width: wp(22),
    height: hp(10),
    borderRadius: 8,
    marginRight: wp(3),
    resizeMode: 'contain',
  },
  newsContent: {
    flex: 1,
    justifyContent: 'center',
  },
  newsTitle: {
    fontSize: wp(3.5),
    marginBottom: hp(0.5),
    color: AppColors.black,
    fontFamily: AppFonts.InterMedium,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(2.5),
    marginRight: wp(2),
  },
  authorName: {
    fontSize: 14,
    color: AppColors.secondryText,
    fontFamily: AppFonts.InterLight,
  },
  dateText: {
    fontSize: wp(3),
    color: AppColors.silverText,
    fontFamily: AppFonts.InterLight,
  },
});

{
  /* <View style={styles.newsItem}>
<Image source={item.image} style={styles.newsImage} />
<View style={styles.newsContent}>
  <Text style={styles.newsTitle}>{item?.description}</Text>
  {item.type === 'article' && item.author && (
    <View style={styles.authorContainer}>
      <Image
        source={require('../../assets/images/profile.png')}
        style={styles.authorAvatar}
      />
      <Text style={styles.authorName}>{item.author}</Text>
    </View>
  )}
  {item.type === 'price' && item.date && (
    <Text style={styles.dateText}>{item.date}</Text>
  )}
</View>
</View> */
}
