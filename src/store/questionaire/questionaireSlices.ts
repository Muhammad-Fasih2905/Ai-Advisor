import {createSlice} from '@reduxjs/toolkit';

const questionaire = createSlice({
  name: 'questionaire',
  initialState: {
    questionaire: [] as any,
    popularQuestions: [] as any,
  },
  reducers: {
    setQuestionaire: (state, {payload}) => {
      state.questionaire = payload;
    },
    setPopularQuestions: (state, {payload}) => {
      state.popularQuestions = payload;
    },
  },
});

export const {setQuestionaire, setPopularQuestions} = questionaire.actions;

export default questionaire.reducer;
