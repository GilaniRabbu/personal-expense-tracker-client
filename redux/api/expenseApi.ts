/* eslint-disable */

import { baseApi } from "./baseApi";

export const expenseApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // POST /expenses → Create expense
    createExpense: build.mutation({
      query: (data) => ({
        url: "/expenses",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Expense"],
    }),

    // GET /expenses → Fetch all
    getExpenses: build.query<any, void>({
      query: () => ({
        url: "/expenses",
        method: "GET",
      }),
      providesTags: ["Expense"],
    }),

    // GET /expenses/category/:categoryId → Filter by category
    getExpensesByCategory: build.query<any, string>({
      query: (categoryId) => ({
        url: `/expenses/category/${categoryId}`,
        method: "GET",
      }),
      providesTags: ["Expense"],
    }),

    // PATCH /expenses/:id → Update
    updateExpense: build.mutation<any, { id: string; [key: string]: any }>({
      query: ({ id, ...data }) => ({
        url: `/expenses/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Expense"],
    }),

    // DELETE /expenses/:id → Delete
    deleteExpense: build.mutation<any, string>({
      query: (id) => ({
        url: `/expenses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Expense"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useCreateExpenseMutation,
  useGetExpensesQuery,
  useGetExpensesByCategoryQuery,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} = expenseApi;
