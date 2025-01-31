import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import AppStyles from '../styles/AppStyles';

const NoRecord = ({message}: any) => {
  return (
    <View style={[{flex: 0.7}, AppStyles.alignJustifyCenter]}>
      <Text style={[AppStyles.h2, {textAlign: 'center'}]}>
        {message || 'No Record Found'}
      </Text>
    </View>
  );
};

export default NoRecord;

const styles = StyleSheet.create({});
