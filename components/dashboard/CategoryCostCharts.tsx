/* eslint-disable */
"use client";

import { useGetExpensesQuery } from "@/redux/api/expenseApi";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: { _id: string; name: string };
  date: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const CategoryCostCharts = () => {
  const {
    data: expensesResponse,
    isLoading: expensesLoading,
    isError: expensesError,
    error: expensesErrorObj,
  } = useGetExpensesQuery();
  const {
    data: categoriesResponse,
    isLoading: categoriesLoading,
    isError: categoriesError,
    error: categoriesErrorObj,
  } = useGetCategoriesQuery();

  const expenseList = (expensesResponse as ApiResponse<Expense[]>)?.data || [];
  const categoryList =
    (categoriesResponse as ApiResponse<Category[]>)?.data || [];

  const chartData = categoryList.map((cat) => {
    const totalAmount = expenseList
      .filter((exp) => exp.category._id === cat.id && !exp.isDeleted)
      .reduce((sum, exp) => sum + (exp.amount || 0), 0);
    return {
      name: cat.name,
      totalCost: totalAmount,
    };
  });

  if (expensesLoading || categoriesLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (expensesError || categoriesError) {
    return (
      <div className="text-center text-red-500">
        Error:{" "}
        {(expensesErrorObj as any)?.message ||
          (categoriesErrorObj as any)?.message ||
          "Unknown error"}
      </div>
    );
  }

  return (
    <div className="container">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Total Cost by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ||
          chartData.every((data) => data.totalCost === 0) ? (
            <div className="text-center text-slate-500">
              No expense data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                />
                <Bar dataKey="totalCost" fill="#8884D8" name="Total Cost" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryCostCharts;
