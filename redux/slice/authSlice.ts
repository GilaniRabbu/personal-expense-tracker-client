/* eslint-disable */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TAuthState = {
  user: {
    _id?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: {
      url: string;
      altText: string;
    };
    [key: string]: any;
  } | null;
};

const initialState: TAuthState = {
  user: {
    _id: "",
    phone: "",
    firstName: "",
    lastName: "",
    isPhoneVerified: false,
    isOpenJoinUs: false,
    isOpenSelectArea: false,
    isOpenSelectServices: false,
    role: "",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        user: {
          _id?: string;
          phone?: string;
          firstName?: string;
          lastName?: string;
          isPhoneVerified?: boolean;
          isRegistered?: boolean;
          profilePicture?: {
            url: string;
            altText: string;
          };
          role?: string;
          isOpenJoinUs?: boolean;
          isOpenSelectArea?: boolean;
          isOpenSelectServices?: boolean;
          [key: string]: any;
        };
      }>
    ) => {
      const { user } = action.payload;
      state.user = user;
    },
    logout: (state) => {
      state.user = null;
    },
    removeUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, logout, removeUser } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: { auth: TAuthState }) =>
  state.auth.user;

// Selector to get role
export const selectUserRole = (state: { auth: TAuthState }) =>
  state.auth.user?.role || null;
