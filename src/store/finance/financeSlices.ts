import {createSlice} from '@reduxjs/toolkit';
import {TrendingStockTypes} from '../../types/types';

const financeSlice = createSlice({
  name: 'finance',
  initialState: {
    financialNews: [] as any,
    categories: [],
    latestNews: [],
    trendingStock: [] as TrendingStockTypes[],
    searchArticles: [] as any,
    recentArticles: [] as any,
  },
  reducers: {
    setFinancialNews: (state, {payload}) => {
      state.financialNews = payload;
    },
    setCategories: (state, {payload}) => {
      state.categories = payload;
    },
    setLatestNews: (state, {payload}) => {
      state.latestNews = payload;
    },
    setTrendingStock: (state, {payload}) => {
      state.trendingStock = payload;
    },
    setSearchArticles: (state, {payload}) => {
      state.searchArticles = payload;
    },
    setRecentArticles: (state, {payload}) => {
      let updatedState =
        state?.recentArticles?.length > 0 ? [...state?.recentArticles] : [];
      let findItem = updatedState?.findIndex(
        (item: any) => item?.uuid == payload?.uuid,
      );
      if (findItem != undefined && findItem != -1) {
        return;
      }
      if (updatedState?.length > 2) {
        let filterArray = updatedState?.slice(0, 2);
        state.recentArticles = [payload, ...filterArray];
      } else if (updatedState?.length == 0) {
        state.recentArticles = [payload];
      } else {
        state.recentArticles = [payload, ...updatedState];
      }
    },
    setRemoveSingleRecentArticle: (state, {payload}) => {
      let updatedState =
        state?.recentArticles?.length > 0 ? [...state?.recentArticles] : [];
      let filterState = updatedState?.filter(
        (item: any) => item?.uuid != payload?.uuid,
      );
      state.recentArticles = filterState;
    },
    setUpdateTrendingStock: (state, {payload}) => {
      const updatedTrendingStock = state?.trendingStock.map((item: any) => {
        if (item?.symbol == payload?.symbol) {
          return {
            ...item,
            summary: {
              ...item.summary,
              change: payload?.change || 0,
              changePercent: payload?.changePercent || 0,
              price: payload?.price || '',
              symbol: payload?.symbol || '',
            },
          };
        }
        return {
          ...item,
        };
      });
      state.trendingStock = [...updatedTrendingStock];
    },
  },
});

export const {
  setFinancialNews,
  setCategories,
  setLatestNews,
  setTrendingStock,
  setSearchArticles,
  setRecentArticles,
  setRemoveSingleRecentArticle,
  setUpdateTrendingStock,
} = financeSlice.actions;

export default financeSlice.reducer;
