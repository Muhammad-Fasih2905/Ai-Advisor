import {createSlice} from '@reduxjs/toolkit';
import {Alert, Platform, ToastAndroid} from 'react-native';

const commonSlice = createSlice({
  name: 'common',
  initialState: {
    isLoading: false as boolean,
  },
  reducers: {
    setLoading: (state, {payload}) => {
      state.isLoading = payload;
    },
    showMessage: (_, {payload}) => {
      if (Platform.OS === 'android') {
        ToastAndroid.show(payload, ToastAndroid.SHORT);
      } else {
        Alert.alert('', payload);
      }
    },
  },
});

export const {setLoading, showMessage} = commonSlice.actions;

export default commonSlice.reducer;
