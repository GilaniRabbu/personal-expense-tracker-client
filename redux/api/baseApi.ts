/* eslint-disable */

import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { destroyCookie } from "nookies";
import { removeUser } from "../slice/authSlice";
import Cookies from "js-cookie";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASEURL,
  prepareHeaders: (headers: Headers) => {
    const accessToken =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    headers.set("accept", "application/json");
    if (accessToken) {
      headers.set("authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
  credentials: "include", // ensures cookies are sent with requests
});

const baseQueryWithRefreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    // Try to refresh token
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASEURL}/auth/refresh-token`, // Fixed template literal
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // No Authorization header, refresh token sent via cookie
          },
          credentials: "include", // send cookies with refresh request
        }
      );

      const data = await res.json();

      if (data?.success && data?.data?.accessToken) {
        // Save new access token
        localStorage.setItem("accessToken", data.data.accessToken);

        // Retry original query with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        console.error("Token refresh failed:", data);
        cleanupAuthState(api);
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      cleanupAuthState(api);
    }
  }

  return result;
};

function redirectToLogin() {
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

function cleanupAuthState(api: any) {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  destroyCookie(null, "accessToken");
  destroyCookie(null, "refreshToken");

  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");

  api.dispatch(removeUser());
  redirectToLogin();
}

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ["Auth", "User", "Expense", "Category"],
  endpoints: () => ({}),
});
