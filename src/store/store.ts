import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userSlices from './user/userSlices';
import commonSlice from './common/commonSlice';
import questionaire from './questionaire/questionaireSlices';
import financeSlice from './finance/financeSlices';
import invesmentSlice from './invesment/invesmentSlices';
import financialAdviceSlice from './financialAdvice/financialAdviceSlices';

const reducers = combineReducers({
  commonSlice,
  userSlices,
  questionaire,
  financeSlice,
  invesmentSlice,
  financialAdviceSlice,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whiteList: ['userSlice'],
};

const rootReducer = (state: any, action: any) => {
  if (action.type === 'LOGOUT') {
    state = undefined;
  }
  return reducers(state, action);
};


const persistedReducers = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducers,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    }),
});

export const persister = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
