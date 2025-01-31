import {createAsyncThunk} from '@reduxjs/toolkit';
import {RootState} from '../Store';
import {setLoading, showMessage} from '../common/commonSlice';
import apiCall from '../../services';
import {
  setAllInvestments,
  setRecommendedStockDetails,
  setRecommendedStocks,
  setSearchAssets,
} from './invesmentSlices';

export const createInvesment = createAsyncThunk(
  'invesment',
  async (
    data: {
      amount: string;
      category: string;
      symbol: string;
      asset: string;
      quantity: string;
      price: string;
    },
    {dispatch, getState},
  ) => {
    const state = getState() as RootState;
    const token = state.userSlices.token;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'invesment',
        method: 'POST',
        token: token,
        body: data,
      });
      dispatch(setLoading(false));
      if (res.success === true) {
        if (res.message == 'Symbol is required') {
          dispatch(showMessage('Please enter a correct investment name.'));
        } else {
          dispatch(showMessage(res.message));
        }
        dispatch(setLoading(false));
        return res;
      } else {
        dispatch(showMessage(res.message));
        dispatch(setLoading(false));
        return res;
      }
    } catch (error) {
      dispatch(setLoading(false));
    }
  },
);

export const getAllInvestments = createAsyncThunk(
  'invesment',
  async (_, {dispatch, getState}) => {
    const state = getState() as RootState;
    const token = state.userSlices.token;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'invesments',
        method: 'GET',
        token: token,
      });
      dispatch(setLoading(false));
      if (res.success === true) {
        dispatch(setAllInvestments(res?.data));
        dispatch(setLoading(false));
        return res;
      } else {
        dispatch(showMessage(res.message));
        dispatch(setLoading(false));
        return res;
      }
    } catch (error) {
      dispatch(setLoading(false));
    }
  },
);

export const deleteInvestment = createAsyncThunk(
  'invesment',
  async (id: string, {dispatch, getState}) => {
    const state = getState() as RootState;
    const token = state.userSlices.token;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: `invesment/${id}`,
        method: 'DELETE',
        token: token,
      });
      dispatch(setLoading(false));
      if (res.success === true) {
        dispatch(setLoading(false));
        return res;
      } else {
        dispatch(showMessage(res.message));
        dispatch(setLoading(false));
        return res;
      }
    } catch (error) {
      dispatch(setLoading(false));
    }
  },
);

export const getSearchAssets = createAsyncThunk(
  'search-assets',
  async (query: string, {dispatch, getState}) => {
    const state = getState() as RootState;
    const token = state.userSlices.token;
    try {
      console.log("443534");
      
      const res = await apiCall({
        path: `search/asset?query=${query}`,
        method: 'GET',
        token: token,
      });
      console.log(res, "sfsdfds");
      
      if (res.success === true) {
        dispatch(setSearchAssets(res.data));
        return res;
      } else {
        dispatch(showMessage(res.message));
        return res;
      }
    } catch (error) {
      console.log(error, 'error');
    }
  },
);

export const getRecommendedStocks = createAsyncThunk(
  'recommended-stocks',
  async (id: string, {dispatch, getState}) => {
    const state = getState() as RootState;
    const token = state.userSlices.token;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: `recommended/stocks?category=${id}`,
        method: 'GET',
        token: token,
      });
      dispatch(setLoading(false));
      if (res.success === true) {
        dispatch(setRecommendedStocks(res.data));
        dispatch(setLoading(false));
        return res;
      } else {
        dispatch(showMessage(res.message));
        dispatch(setLoading(false));
        return res;
      }
    } catch (error) {
      dispatch(setLoading(false));
    }
  },
);

export const getRecommendedStockDetails = createAsyncThunk(
  'symbol-insights',
  async (symbol: string, {dispatch, getState}) => {
    const state = getState() as RootState;
    const token = state.userSlices.token;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: `symbol/insights?symbol=${symbol}`,
        method: 'GET',
        token: token,
      });
      dispatch(setLoading(false));
      if (res.success === true) {
        dispatch(setRecommendedStockDetails(res.data));
        dispatch(setLoading(false));
        return res;
      } else {
        dispatch(showMessage(res.message));
        dispatch(setLoading(false));
        return res;
      }
    } catch (error) {
      dispatch(setLoading(false));
    }
  },
);
