import {createAsyncThunk} from '@reduxjs/toolkit';
import {setLoading, showMessage} from '../common/commonSlice';
import apiCall from '../../services';
import {RootState} from '../Store';
import {
  setCategories,
  setFinancialNews,
  setLatestNews,
  setTrendingStock,
  setSearchArticles,
} from './financeSlices';

export const getLatestNews = createAsyncThunk(
  'latest-news',
  async (_, {dispatch, getState}) => {
    const state = getState() as RootState;
    const token = state.userSlices.token;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'news',
        method: 'GET',
        token: token,
      });
      dispatch(setLoading(false));
      if (res.success === true) {
        dispatch(setLatestNews(res.data));
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

export const getAllCategories = createAsyncThunk(
  'All-Categories',
  async (_, {dispatch, getState}) => {
    const state = getState() as RootState;
    const token = state.userSlices.token;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'categories',
        method: 'GET',
        token: token,
      });
      dispatch(setLoading(false));
      if (res.success === true) {
        let updatedData = res.data.reverse() || res.data;
        const sortedData = updatedData?.sort((a, b) =>
          a.title === 'All' ? -1 : b.title === 'All' ? 1 : 0,
        );
        dispatch(setCategories(sortedData));
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

export const getCategorieNews = createAsyncThunk(
  'categorie-news',
  async (topic: string, {dispatch, getState}) => {
    const state = getState() as RootState;
    const token = state.userSlices.token;
    try {
      const res = await apiCall({
        path: `news?topic=${topic}`,
        method: 'GET',
        token: token,
      });
      if (res.success === true) {
        dispatch(setFinancialNews(res.data));
        return res;
      } else {
        dispatch(showMessage(res.message));
        return res;
      }
    } catch (error) {
      console.log(error, '===> error');
    }
  },
);

export const getTrendingStocks = createAsyncThunk(
  'trending/stocks',
  async (_, {dispatch, getState}) => {
    const state = getState() as RootState;
    const token = state.userSlices.token;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'trending/stocks',
        method: 'GET',
        token: token,
      });
      dispatch(setLoading(false));
      if (res.success === true) {
        dispatch(setTrendingStock(res.data));
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

export const getSearchArticles = createAsyncThunk(
  'search-articles',
  async (topic: string, {dispatch, getState}) => {
    const state = getState() as RootState;
    const token = state.userSlices.token;
    try {
      const res = await apiCall({
        path: `news?topic=${topic}`,
        method: 'GET',
        token: token,
      });
      if (res.success === true) {
        dispatch(setSearchArticles(res.data));
        return res;
      } else {
        dispatch(showMessage(res.message));
        return res;
      }
    } catch (error) {
      console.log(error, '===> error');
    }
  },
);
