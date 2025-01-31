import {StatusBar, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppColors} from '../../utils/color';
import {hp, injectedJavaScript} from '../../utils/constant';
import AppHeader from '../../components/AppHeader';
import WebView from 'react-native-webview';
import AppStyles from '../../styles/AppStyles';
import AppLoader from '../../components/AppLoader';
import {useAppDispatch} from '../../store/hooks';
import {updateNotificationRead} from '../../store/user/userActions';

const ShowArticles = ({route}: any) => {
  const item = route?.params?.item;
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(updateNotificationRead({id: item?._id}));
  }, []);

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />
      <View style={styles.EditProfileHeaderView}>
        <AppHeader
          title="Investment Articles/News"
          headerStyle={{height: hp(11), paddingTop: hp(2)}}
        />
      </View>
      {loading && (
        <View style={[AppStyles.flex, AppStyles.alignJustifyCenter]}>
          <AppLoader />
        </View>
      )}
      <View style={styles.webviewContainer}>
        <WebView
          onLoad={() => setLoading(false)}
          // onLoadProgress={() => setLoading(true)}
          style={[AppStyles.flex, {opacity: loading ? 0 : 1}]}
          contentMode="mobile"
          originWhitelist={['*']}
          source={{
            uri: item?.link,
          }}
          injectedJavaScript={injectedJavaScript}
          javaScriptEnabled={true}
        />
      </View>
    </View>
  );
};

export default ShowArticles;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: AppColors.body,
  },
  EditProfileHeaderView: {
    marginTop: hp(1),
  },
  webviewContainer: {
    flex: 1,
    justifyContent: 'center',
    // backgroundColor: '#001e5a',
    // paddingBottom: hp(3),
  },
});
