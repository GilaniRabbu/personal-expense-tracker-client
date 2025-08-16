/* eslint-disable */

import { baseApi } from "./baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Create user
    createUser: build.mutation({
      query: (data: any) => ({
        url: "/users/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useCreateUserMutation } = userApi;

export default userApi;
