import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import apiCall from '../../services';
import {setLoading, showMessage} from '../common/commonSlice';
import {RootState} from '../Store';
import {
  setNotificationCount,
  setNotifications,
  setSignupToken,
  setStaticContent,
  setUser,
} from './userSlices';
import {CloudMessaging_GetToken} from '../../firebase';

export const registerUser = createAsyncThunk(
  'user/signup',
  async (data: object, {dispatch}) => {
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'user/signup',
        method: 'post',
        body: data,
      });
      dispatch(setLoading(false));
      if (res.success === true) {
        dispatch(setUser(res?.data?.user));
        dispatch(setSignupToken(res?.token));
        dispatch(setLoading(false));
        // dispatch(showMessage(res.message));
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

export const login = createAsyncThunk(
  'user/login',
  async (data: object, {dispatch}) => {
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'user/login',
        method: 'post',
        body: data,
      });
      dispatch(setLoading(false));
      if (res.success === true) {
        dispatch(setLoading(false));
        dispatch(showMessage(res.message));
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

export const forgotPassword = createAsyncThunk(
  '/user/forgotpassword',
  async (data: object, {dispatch}) => {
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'user/forgotpassword',
        method: 'post',
        body: data,
      });
      dispatch(setLoading(false));
      if (res.success === true) {
        dispatch(setLoading(false));
        dispatch(showMessage(res.message));
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

export const sendOTP = createAsyncThunk(
  'send-otp',
  async (data: object, {dispatch}) => {
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'user/sendotp',
        method: 'POST',
        body: data,
      });
      dispatch(setLoading(false));
      if (res.success === true) {
        dispatch(setLoading(false));
        dispatch(showMessage(res.message));
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

export const verifyOTP = createAsyncThunk(
  'verify-otp',
  async (data: object, {dispatch}) => {
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'user/verifyotp',
        method: 'POST',
        body: data,
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

export const getUser = createAsyncThunk(
  'get-user',
  async (id: string, {dispatch, getState}) => {
    const state = getState() as RootState;
    const token = state.userSlices.token;
    const signupToken = state.userSlices.signupToken;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: `user/${id}`,
        method: 'GET',
        token: token || signupToken,
      });
      dispatch(setLoading(false));
      if (res.success === true) {
        dispatch(setUser(res.data));
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

export const updateUserProfile = createAsyncThunk(
  'update-user-profile',
  async (data: {name: string}, {dispatch, getState}) => {
    const state = getState() as RootState;
    const token = state.userSlices.token;
    const id = state.userSlices.user._id;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: `user/${id}`,
        method: 'PUT',
        token: token,
        body: data,
      });
      dispatch(setLoading(false));
      if (res.success === true) {
        dispatch(setUser(res.data));
        dispatch(setLoading(false));
        dispatch(showMessage(res.message));
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

export const getStaticContent = createAsyncThunk(
  'static-content',
  async (_, {dispatch, getState}) => {
    const state = getState() as RootState;
    const token = state.userSlices.token;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'static',
        method: 'GET',
        token: token,
      });
      dispatch(setLoading(false));
      if (res.success == true) {
        dispatch(setStaticContent(res.data));
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

export const updatePassword = createAsyncThunk(
  'update-password',
  async (
    data: {currentPassword: string; newPassword: string},
    {dispatch, getState},
  ) => {
    const state = getState() as RootState;
    const token = state.userSlices.token;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'user/updatepassword',
        method: 'POST',
        token: token,
        body: data,
      });
      dispatch(setLoading(false));
      if (res.success == true) {
        dispatch(showMessage(res.message));
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

export const updateProfilePic = createAsyncThunk(
  'update/profile/picture',
  async (type: string, {dispatch, getState}) => {
    const state = getState() as RootState;
    const token = state.userSlices.token;
    const id = state.userSlices.user._id;

    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 1,
    };
    try {
      let req: ImagePickerResponse;
      if (type === 'camera') {
        req = await launchCamera(options);
      } else {
        req = await launchImageLibrary(options);
      }
      if (req && !req.didCancel) {
        const files = req.assets;
        const formData = new FormData();

        if (files && files.length > 0) {
          const file = files[0];
          formData.append('avatar', {
            uri: file.uri,
            type: file.type,
            name: file.fileName,
          });
          const res = await apiCall({
            path: `user/${id}`,
            method: 'PUT',
            token: token,
            body: formData,
            isForm: true,
          });
          if (res.success === true) {
            dispatch(setUser(res.data));
            dispatch(showMessage(res.message));
            return res;
          } else {
            dispatch(showMessage(res.message));
            return res;
          }
        }
      }
    } catch (error) {
      console.error('Error updating image:', error);
    }
  },
);

export const updateFCMToken = createAsyncThunk(
  'update-fcm-token',
  async (_, {dispatch, getState}) => {
    const state = getState() as RootState;
    const token = state.userSlices.token;
    const user = state.userSlices.user;
    try {
      const addFCMToken = await CloudMessaging_GetToken();
      const res = await apiCall({
        path: `user/${user?._id}`,
        method: 'PUT',
        token: token,
        body: {addFCMToken},
      });
      if (res.success === true) {
        return res;
      } else {
        return res;
      }
    } catch (error) {
      console.log('error: ', error);
    }
  },
);

export const removeFCMToken = createAsyncThunk(
  'remove-fcm-token',
  async (_, {dispatch, getState}) => {
    const state = getState() as RootState;
    const token = state.userSlices.token;
    const user = state.userSlices.user;
    try {
      const removeFCMToken = await CloudMessaging_GetToken();
      const res = await apiCall({
        path: `user/${user?._id}`,
        method: 'PUT',
        token: token,
        body: {removeFCMToken},
      });
      if (res.success === true) {
        return res;
      } else {
        return res;
      }
    } catch (error) {
      console.log('error: ', error);
    }
  },
);

export const logout = createAsyncThunk(
  'logout',
  async (_, {dispatch, getState}) => {
    const state = getState() as RootState;
    const token = state.userSlices.token;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: 'user/logout',
        method: 'POST',
        token: token,
      });
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

export const getNotificationCounts = createAsyncThunk(
  'notifications',
  async (_, {dispatch, getState}) => {
    const state = getState() as RootState;
    const token = state.userSlices.token;
    try {
      const res = await apiCall({
        path: 'notifications?unReadCount=true',
        method: 'GET',
        token: token,
      });
      if (res.success === true) {
        dispatch(setNotificationCount(res.data.count));
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

export const getNotifications = createAsyncThunk(
  'notifications',
  async (data: {skip: number; limit: number}, {dispatch, getState}) => {
    const state = getState() as RootState;
    const token = state.userSlices.token;
    const notifications = state.userSlices.notifications;
    try {
      const res = await apiCall({
        path: `notifications?skip=${data?.skip}&limit=${data?.limit}`,
        method: 'GET',
        token: token,
      });
      if (res.success === true) {
        dispatch(setNotifications([...notifications, ...res.data]));
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

export const updateNotificationRead = createAsyncThunk(
  'notification-read-unread',
  async (data: {id: string}, {dispatch, getState}) => {
    const state = getState() as RootState;
    const token = state.userSlices.token;
    try {
      dispatch(setLoading(true));
      const res = await apiCall({
        path: `notification/${data.id}`,
        method: 'PUT',
        token: token,
        body: {read: 'true'},
      });
      if (res.success === true) {
        dispatch(setLoading(false));
        dispatch(getNotifications({count: true}));
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
