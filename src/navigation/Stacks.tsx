import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AddInvestment from '../screens/AppScreens/AddInvestment';
import BestInvestment from '../screens/AppScreens/BestInvestment';
import ChangePassword from '../screens/AppScreens/ChangePassword';
import EditProfile from '../screens/AppScreens/EditProfile';
import Faq from '../screens/AppScreens/Faq';
import Home from '../screens/AppScreens/Home';
import InvestmentArticles from '../screens/AppScreens/InvestmentArticles';
import InvestmentPartner from '../screens/AppScreens/InvestmentPartner';
import NotificationScreen from '../screens/AppScreens/NotificationScreen';
import PrivacyPolicy from '../screens/AppScreens/PrivacyPolicy';
import Profile from '../screens/AppScreens/Profile';
import Recommendation from '../screens/AppScreens/Recommendation';
import RecommendationDetail from '../screens/AppScreens/RecommendationDetail';
import ShowArticles from '../screens/AppScreens/ShowArticles';
import TermsConditions from '../screens/AppScreens/TermsConditions';
import ForgotPassword from '../screens/AuthScreens/ForgotPassword';
import Questionnaire from '../screens/AuthScreens/Questionnaire';
import ResetLink from '../screens/AuthScreens/ResetLink';
import Signin from '../screens/AuthScreens/Signin';
import Signup from '../screens/AuthScreens/Signup';
import VerifyCode from '../screens/AuthScreens/VerifyCode';
import BottomTabs from './BottomTabs';

const Stack = createNativeStackNavigator();
export const HomeStack = () => {
    return (
        <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="addinvestment" component={AddInvestment} />
            <Stack.Screen name="verifycode" component={VerifyCode} />
            <Stack.Screen name="notificationScreen" component={NotificationScreen} />
        </Stack.Navigator>
    )
}

export const InvestmentStack = () => {
    return (
        <Stack.Navigator initialRouteName='investmentarticles' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="investmentarticles" component={InvestmentArticles} />
        </Stack.Navigator>
    )
}

export const InvestmentPartnerStack = () => {
    return (
        <Stack.Navigator initialRouteName='InvestmentPartner' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="InvestmentPartner" component={InvestmentPartner} />
            <Stack.Screen name="BestInvestment" component={BestInvestment} />
        </Stack.Navigator>
    )
}

export const RecomandationStacks = () => {
    return (
        <Stack.Navigator initialRouteName='recommendation' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="recommendation" component={Recommendation} />
            <Stack.Screen name="recommendationdetail" component={RecommendationDetail} />
        </Stack.Navigator>
    )
}

export const SettingsStacks = () => {
    return (
        <Stack.Navigator initialRouteName='profile' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="profile" component={Profile} />
            <Stack.Screen name="editprofile" component={EditProfile} />
            <Stack.Screen name="changepassword" component={ChangePassword} />
            <Stack.Screen name="verifycode" component={VerifyCode} />
            <Stack.Screen name="privacypolicy" component={PrivacyPolicy} />
            <Stack.Screen name="termsconditions" component={TermsConditions} />
            <Stack.Screen name="faq" component={Faq} />
        </Stack.Navigator>
    )
}


export const AuthStack = () => {
    return (
        <Stack.Navigator initialRouteName='signin' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="signin" component={Signin} />
            <Stack.Screen name="signup" component={Signup} />
            <Stack.Screen name="forgotpassword" component={ForgotPassword} />
            <Stack.Screen name="resetlink" component={ResetLink} />
            <Stack.Screen name="questionnaire" component={Questionnaire} />
            <Stack.Screen name="verifycode" component={VerifyCode} />
        </Stack.Navigator>
    )
}

export const AppStack = () => {
    return (
        <Stack.Navigator initialRouteName='home' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="home" component={BottomTabs} />
            <Stack.Screen name="Questionnaire" component={Questionnaire} />
            <Stack.Screen name="ShowArticles" component={ShowArticles} />
            <Stack.Screen name="BestInvestment" component={BestInvestment} />
        </Stack.Navigator>
    )
}