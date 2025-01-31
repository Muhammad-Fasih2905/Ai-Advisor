import {createAsyncThunk} from '@reduxjs/toolkit';
import apiCall from '../../services';
import {showMessage} from '../common/commonSlice';
import {RootState} from '../Store';
import {setPreviousQAns} from './financialAdviceSlices';

export const getFinancialAdvice = createAsyncThunk(
  'get-Financial-Advice',
  async (prompt: string, {dispatch, getState}) => {
    const state = getState() as RootState;
    const token = state.userSlices.token;
    try {
      const res = await apiCall({
        path: `finAdvice?prompt=${prompt}`,
        method: 'GET',
        token: token,
      });
      if (res.success === true) {
        dispatch(setPreviousQAns({question: prompt, answer: res.message}));
        return res;
      } else {
        dispatch(showMessage(res.message));
        return res;
      }
    } catch (error) {
      console.log(error, 'get-Financial-Advice-error');
    }
  },
);
