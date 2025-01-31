import {createSlice} from '@reduxjs/toolkit';

const financialAdviceSlice = createSlice({
  name: 'financialAdvice',
  initialState: {
    previousQAns: [] as any,
  },
  reducers: {
    setPreviousQAns: (state, {payload}) => {
      state.previousQAns = [...state.previousQAns, payload];
    },
    setSinglePreviousQAns: (state, {payload}) => {
      state.previousQAns = payload;
    },
  },
});

export const {setPreviousQAns, setSinglePreviousQAns} =
  financialAdviceSlice.actions;

export default financialAdviceSlice.reducer;
