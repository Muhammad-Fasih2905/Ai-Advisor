import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import Splash from '../screens/AuthScreens/Splash';
import {useAppSelector} from '../store/hooks';
import {AppStack, AuthStack} from './Stacks';

const Navigation: React.FC = () => {
  const token = useAppSelector(state => state.userSlices.token);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <NavigationContainer>
        {loading ? <Splash /> : token ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </>
  );
};

export default Navigation;

const styles = StyleSheet.create({});
