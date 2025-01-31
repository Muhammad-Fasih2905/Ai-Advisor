import {createSlice} from '@reduxjs/toolkit';

const userSlices = createSlice({
  name: 'users',
  initialState: {
    token: null,
    signupToken: null,
    user: {} as any,
    staticContent: [] as any,
    notifications: [],
    notificationCount: 0,
    pagination: {
      skip: 0,
      limit: 10
    }
  },
  reducers: {
    setToken: (state, {payload}) => {
      state.token = payload;
    },
    setSignupToken: (state, {payload}) => {
      state.signupToken = payload;
    },
    setUser: (state, {payload}) => {
      state.user = payload;
    },
    setStaticContent: (state, {payload}) => {
      state.staticContent = payload;
    },
    setNotifications: (state, {payload}) => {
      state.notifications = payload;
    },
    setNotificationCount: (state, {payload}) => {
      state.notificationCount = payload;
    },
    setPagination: (state, {payload}) => {
      state.pagination = payload;
    },
  },
});

export const {setToken, setSignupToken, setUser, setStaticContent, setNotifications, setNotificationCount, setPagination} = userSlices.actions;

export default userSlices.reducer;
