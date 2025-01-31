import {Keyboard, Platform, StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AppColors} from '../utils/color';
import GlobalIcon from '../components/GlobalIcon';
import InvestmentPartner from '../screens/AppScreens/InvestmentPartner';
import BottomLogo from '../assets/svgs/bottomLogo.svg';
import {hp} from '../utils/constant';
import {
  HomeStack,
  InvestmentPartnerStack,
  InvestmentStack,
  RecomandationStacks,
  SettingsStacks,
} from './Stacks';
import LinearGradient from 'react-native-linear-gradient';
import DOCUMENTSVG from '../assets/svgs/document.svg';
import BORDERHOMESVG from '../assets/svgs/borderHome.svg';
import {
  getFocusedRouteNameFromRoute,
  useNavigation,
} from '@react-navigation/native';
import {
  CloudMessaging_OnMessage,
  CloudMessaging_RequestPermission,
  notificationActions,
} from '../firebase';
import {socket} from '../services/socket';
import {useAppSelector} from '../store/hooks';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const navigation = useNavigation();
  const user = useAppSelector(state => state.userSlices.user);

  useEffect(() => {
    CloudMessaging_RequestPermission();
    CloudMessaging_OnMessage();
    notificationActions(navigation);

    return () => {
      CloudMessaging_OnMessage();
      notificationActions(navigation);
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({focused}) => {
          let iconColor = focused ? AppColors.white : AppColors.body2;
          let iconSize = 24;
          let iconName;

          if (route.name === 'tabhome') {
            iconName = focused ? 'home' : 'border-home';
          } else if (route.name === 'tabinvestmentarticles') {
            iconName = focused ? 'Layer-17' : 'Group-11712751801';
          } else if (route.name === 'InvestmentPartner') {
            return Platform.OS == 'android' ? (
              Keyboard?.isVisible() == false ? (
                <BottomLogo width={100} style={{marginBottom: hp(6)}} />
              ) : null
            ) : (
              <BottomLogo width={100} style={{marginBottom: hp(6)}} />
            );
          } else if (route.name === 'tabrecommendation') {
            iconName = focused ? 'user2' : 'Group-2';
          } else if (route.name === 'tabprofile') {
            iconName = focused ? 'settings' : 'setting';
          }

          return (
            <>
              {iconName == 'Layer-17' ? (
                <DOCUMENTSVG />
              ) : iconName == 'border-home' ? (
                <BORDERHOMESVG />
              ) : (
                <GlobalIcon
                  library="CustomIcon"
                  name={iconName}
                  size={iconSize}
                  color={iconColor}
                />
              )}
            </>
          );
        },
        tabBarLabel: () => null,
        tabBarStyle: {
          elevation: 0,
          borderTopWidth: 0,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          height: Platform.OS == 'ios' ? hp(9) : hp(8),
          backgroundColor: 'transparent',
          zIndex: 2,
          width: '100%',
          display: ['ShowArticles', 'verifycode', 'questionnaire'].includes(
            getFocusedRouteNameFromRoute(route) as any,
          )
            ? 'none'
            : 'flex',
        },
        tabBarBackground: () => (
          <LinearGradient
            start={{x: 0, y: 1}}
            end={{x: 1, y: 1}}
            colors={[AppColors.primary, AppColors.secondary]}
            style={{
              flex: 1,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}
          />
        ),
      })}>
      <Tab.Screen
        name="tabhome"
        component={HomeStack}
        options={{headerShown: false}}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            e.preventDefault();
            console.log('Tab pressed: leave-investment-screen');
            socket.emit('leave-trending-screen');
            socket.emit('join-investment-screen', user?._id);
            socket.emit('leave-recommended-screen', user?._id);
            navigation.navigate(route.name);
          },
        })}
      />
      <Tab.Screen
        name="tabinvestmentarticles"
        component={InvestmentStack}
        options={{headerShown: false}}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            e.preventDefault();
            socket.emit('leave-investment-screen', user?._id);
            socket.emit('join-trending-screen');
            socket.emit('leave-recommended-screen', user?._id);
            navigation.navigate(route.name);
          },
        })}
      />
      <Tab.Screen
        name="InvestmentPartner"
        component={InvestmentPartner}
        options={{headerShown: false}}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            e.preventDefault();
            socket.emit('leave-trending-screen');
            socket.emit('leave-investment-screen', user?._id);
            socket.emit('leave-recommended-screen', user?._id);
            navigation.navigate(route.name);
          },
        })}
      />
      <Tab.Screen
        name="tabrecommendation"
        component={RecomandationStacks}
        options={{headerShown: false}}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            e.preventDefault();
            socket.emit('leave-trending-screen');
            socket.emit('leave-investment-screen', user?._id);
            socket.emit('join-recommended-screen', user?._id);
            navigation.navigate(route.name);
          },
        })}
      />
      <Tab.Screen
        name="tabprofile"
        component={SettingsStacks}
        options={{headerShown: false}}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            e.preventDefault();
            console.log('Tab pressed: leave-investment-screen');
            socket.emit('leave-trending-screen');
            socket.emit('leave-investment-screen', user?._id);
            socket.emit('leave-recommended-screen', user?._id);
            navigation.navigate(route.name);
          },
        })}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
