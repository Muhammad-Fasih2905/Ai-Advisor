import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { AppColors } from '../utils/color';

export const CloudMessaging_RequestPermission = async () => {
  if (Platform.OS === 'android') {
    const req = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  } else {
    const permissionStatus = await messaging().requestPermission();
    const enabled =
      permissionStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      permissionStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', permissionStatus);
    } else {
      console.log(
        'Push Notifications Disabled',
        'Enable push notifications in Settings.',
      );
    }
  }
};

export const CloudMessaging_GetToken = async () => {
  const token = await messaging().getToken();
  return token;
};

export const CloudMessaging_OnMessage = () =>
  messaging().onMessage(remoteMessage => {
    inAppNotification(remoteMessage);
  });

const inAppNotification = async (remoteMessage: any) => {
  await notifee.requestPermission();

  try {
    const channelId = await notifee.createChannel({
      id: 'main',
      name: 'Main',
      sound: 'default',
      vibration: false,
      badge: true,
      importance: AndroidImportance.HIGH,
    });
    await notifee.displayNotification({
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
      data: remoteMessage,
      android: {
        smallIcon: 'ic_launcher',
        color: AppColors.primary,
        largeIcon: 'test',
        sound: 'default',
        channelId,
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        sound: 'default',
      },
    });
  } catch (error) {
    console.log(error, 'error notit');
  }
};

export const notificationActions = (navigation: any) => {
  messaging().onNotificationOpenedApp((remoteMessage: any) => {
    const notificate = JSON.parse(remoteMessage?.data?.news);
    navigation.navigate('ShowArticles', { item: notificate });
  });
  messaging()
    .getInitialNotification()
    .then((remoteMessage: any) => {
      if (remoteMessage) {
        const notificate = JSON.parse(remoteMessage?.data?.news);
        navigation.navigate('ShowArticles', { item: notificate });
      }
    });
  notifee.onForegroundEvent(({ type, detail }: any) => {
    const data = JSON.parse(detail?.notification?.data?.data?.news)
    if (type === EventType.PRESS) {
      navigation.navigate('ShowArticles', { item: data });
    }
  });
  notifee.onBackgroundEvent(async ({ type, detail }: any) => {
    const data = JSON.parse(detail?.notification?.data?.data?.news)
    if (type === EventType.PRESS) {
      console.log('Notification was pressed in the background');
      navigation.navigate('ShowArticles', { item: data });
    }
  });
};
