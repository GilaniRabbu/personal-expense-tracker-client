/* eslint-disable */
"use client";

import { useGetExpensesQuery } from "@/redux/api/expenseApi";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";

interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: { _id: string; name: string };
  date: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const ExpenseTable = () => {
  const {
    data: expensesResponse,
    isLoading,
    isError,
    error,
  } = useGetExpensesQuery();
  const expenseList = (expensesResponse as ApiResponse<Expense[]>)?.data || [];

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Error: {(error as any)?.message || "Unknown error"}
      </div>
    );
  }

  return (
    <div className="container">
      <Card>
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {expenseList.length === 0 ? (
            <div className="text-center text-slate-600">No expenses found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseList.map((exp: Expense) => (
                  <TableRow key={exp._id}>
                    <TableCell>{exp.title || "N/A"}</TableCell>
                    <TableCell>${(exp.amount || 0).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className="shadow-none rounded-full bg-emerald-100 text-emerald-800">
                        {exp.category?.name || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {exp.date ? format(new Date(exp.date), "PPP") : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseTable;
