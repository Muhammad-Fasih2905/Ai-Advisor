import {createSlice} from '@reduxjs/toolkit';

interface RecommendedStockDetailsProps {
  MarketCap: number;
  YoY: string;
  insights: string;
  regularMarketVolume: number;
  shortName: string;
  symbol: string;
}

const invesmentSlice = createSlice({
  name: 'investment',
  initialState: {
    all_invesment: [] as any,
    searchAssets: [],
    recommendedStocks: [] as any,
    recommendedStockDetails: {} as RecommendedStockDetailsProps,
  },
  reducers: {
    setAllInvestments: (state, {payload}) => {
      state.all_invesment = payload;
    },
    setSearchAssets: (state, {payload}) => {
      state.searchAssets = payload;
    },
    setRecommendedStocks: (state, {payload}) => {
      state.recommendedStocks = payload;
    },
    setRecommendedStockDetails: (state, {payload}) => {
      state.recommendedStockDetails = payload;
    },
    setUpdateRecommendedStock: (state, {payload}) => {
      state.recommendedStocks = [
        {
          symbol: state.recommendedStocks.symbol,
          recommendedSymbols:
            state?.recommendedStocks[0]?.recommendedSymbols.map((item: any) => {
              if (item?.symbol == payload?.symbol) {
                return {
                  ...item,
                  change: payload?.change || 0,
                  changePercent: payload?.changePercent || 0,
                  price: payload?.price || '',
                  symbol: payload?.symbol || '',
                };
              }
              return {
                ...item,
              };
            }),
        },
      ];
    },
    setUpdateAllInvestments: (state, {payload}) => {
      state.all_invesment = (state?.all_invesment || []).map((item: any) => {
        if (item?._id == payload?._id) {
          return {
            ...item,
            ...payload,
          };
        } else {
          return {
            ...item,
          };
        }
      });
    },
  },
});

export const {
  setAllInvestments,
  setSearchAssets,
  setRecommendedStocks,
  setRecommendedStockDetails,
  setUpdateRecommendedStock,
  setUpdateAllInvestments,
} = invesmentSlice.actions;

export default invesmentSlice.reducer;
