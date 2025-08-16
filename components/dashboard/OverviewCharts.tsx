/* eslint-disable */
"use client";

import { useGetExpensesQuery } from "@/redux/api/expenseApi";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
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

// Define colors for the Pie Chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const OverviewCharts = () => {
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

  // Prepare data for Pie Chart (expenses by title)
  const pieChartData = expenseList.map((exp) => ({
    name: exp.title,
    value: exp.amount,
  }));

  // Prepare data for Bar Chart (total cost by category)
  const barChartData = categoryList.map((cat) => {
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Title (Pie Chart)</CardTitle>
          </CardHeader>
          <CardContent>
            {pieChartData.length === 0 ? (
              <div className="text-center text-slate-600">
                No expense data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884D8"
                    label
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `$${value.toFixed(2)}`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart (Total Cost by Category) */}
        <Card>
          <CardHeader>
            <CardTitle>Total Cost by Category (Bar Chart)</CardTitle>
          </CardHeader>
          <CardContent>
            {barChartData.length === 0 ||
            barChartData.every((data) => data.totalCost === 0) ? (
              <div className="text-center text-slate-600">
                No expense data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => `$${value.toFixed(2)}`}
                  />
                  <Legend />
                  <Bar dataKey="totalCost" fill="#8884D8" name="Total Cost" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewCharts;
