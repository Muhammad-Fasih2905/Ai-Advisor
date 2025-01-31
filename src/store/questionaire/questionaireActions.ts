import {createAsyncThunk} from '@reduxjs/toolkit';
import {setLoading, showMessage} from '../common/commonSlice';
import apiCall from '../../services';
import {setPopularQuestions, setQuestionaire} from './questionaireSlices';
import {RootState} from '../Store';

export const getQuestionaire = createAsyncThunk(
  'get-questionaire',
  async (signupToken: string, {dispatch}) => {
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'questionaire',
        method: 'GET',
        token: signupToken,
      });
      dispatch(setLoading(false));
      if (res.success === true) {
        dispatch(setLoading(false));
        let {questions, ...obj} = res.data;

        const updatedQuestions = questions.map((question: any) => {
          return {
            ...question,
            choices: question.choices.map((choice: any) => {
              if (question?.answer?.choiceSelected == choice?.sequence) {
                return {...choice, isSelected: true};
              } else {
                return {...choice, isSelected: false};
              }
            }),
          };
        });

        dispatch(setQuestionaire({...obj, questions: updatedQuestions}));
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

export const createAnswer = createAsyncThunk(
  'answer',
  async (data: {signupToken: any; values: object}, {dispatch}) => {
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'answer',
        method: 'POST',
        token: data?.signupToken,
        body: data?.values,
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

export const updateAnswer = createAsyncThunk(
  'update-answer',
  async (
    data: {token: any; values: {id: string; choiceSelected: number}},
    {dispatch},
  ) => {
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: `answer/${data.values.id}`,
        method: 'PUT',
        token: data?.token,
        body: {choiceSelected: data.values.choiceSelected},
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

export const getPopularQuestions = createAsyncThunk(
  'get-popularQuestions',
  async (categoryId: string, {dispatch, getState}) => {
    const state = getState() as RootState;
    const token = state.userSlices.token;

    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: `popularQuestions?category=${categoryId}`,
        method: 'GET',
        token: token,
      });
      dispatch(setLoading(false));
      if (res.success === true) {
        dispatch(setPopularQuestions(res.data));
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

export const submitAnswer = createAsyncThunk(
  'submit-answer',
  async (data: any, {dispatch, getState}) => {
    const state = getState() as RootState;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'submit/answer',
        method: 'POST',
        token: data.signupToken,
        body: {answers: data.answers},
      });
      dispatch(setLoading(false));
      if (res.success === true) {
        dispatch(setPopularQuestions(res.data));
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
