/* eslint-disable */
"use client";

import { useState, useMemo } from "react";
import {
  useCreateExpenseMutation,
  useGetExpensesQuery,
  useGetExpensesByCategoryQuery,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} from "@/redux/api/expenseApi";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
import { format } from "date-fns";
import { CalendarIcon, Edit, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  id: string;
  name: string;
}

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

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const ExpenseManager = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const {
    data: categoriesResponse,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategoriesQuery();
  const categoriesData =
    (categoriesResponse as ApiResponse<Category[]>)?.data || [];
  const categories =
    categoriesData.map((cat) => ({ value: cat.id, label: cat.name })) || [];
  const categoryMap = useMemo(() => {
    return categoriesData.reduce(
      (acc: Record<string, string>, cat: Category) => {
        acc[cat.id] = cat.name;
        return acc;
      },
      {}
    );
  }, [categoriesData]);

  const {
    data: expensesResponse,
    isLoading,
    isError,
    error,
  } = filterCategory
    ? useGetExpensesByCategoryQuery(filterCategory)
    : useGetExpensesQuery();
  const expenseList = (expensesResponse as ApiResponse<Expense[]>)?.data || [];
  const totalExpense =
    expenseList.reduce(
      (sum: number, exp: Expense) => sum + (exp.amount || 0),
      0
    ) || 0;

  const [createExpense] = useCreateExpenseMutation();
  const [updateExpense] = useUpdateExpenseMutation();
  const [deleteExpense] = useDeleteExpenseMutation();

  if (categoriesLoading || isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (categoriesError || isError) {
    return (
      <div className="text-center text-red-500">
        Error:{" "}
        {categoriesError
          ? (categoriesError as any)?.message
          : (error as any)?.message || "Unknown error"}
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const expenseData = {
      title,
      amount: parseFloat(amount),
      category, // Sending category ID as string
      date: date?.toISOString(),
    };

    try {
      if (editingId) {
        await updateExpense({ id: editingId, ...expenseData }).unwrap();
        setEditingId(null);
      } else {
        await createExpense(expenseData).unwrap();
      }
      resetForm();
    } catch (err) {
      console.error("Failed to save expense:", err);
    }
  };

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setCategory("");
    setDate(new Date());
  };

  const handleEdit = (exp: Expense) => {
    setTitle(exp.title || "");
    setAmount(exp.amount?.toString() || "");
    setCategory(exp.category?._id || "");
    setDate(exp.date ? new Date(exp.date) : new Date());
    setEditingId(exp._id);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExpense(id).unwrap();
    } catch (err) {
      console.error("Failed to delete expense:", err);
    }
  };

  /* ---------- Render ---------- */
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Expenses Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Total Expenses: ${totalExpense.toFixed(2)}
            </h2>
          </div>

          <div className="mb-8">
            <Label htmlFor="filterCategory">Filter by Category</Label>
            <Select
              onValueChange={(val) =>
                setFilterCategory(val === "all" ? null : val)
              }
              value={filterCategory || "all"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <form onSubmit={handleSubmit} className="mb-8 space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={setCategory} value={category}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button type="submit">
              {editingId ? "Update" : "Add"} Expense
            </Button>
          </form>

          {expenseList.length === 0 ? (
            <div className="text-center text-gray-500">
              No expenses found. Add some to get started!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseList.map((exp: Expense) => (
                  <TableRow key={exp._id}>
                    <TableCell>{exp.title || "N/A"}</TableCell>
                    <TableCell>${(exp.amount || 0).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {exp.category?.name ||
                          categoryMap[exp.category?._id] ||
                          "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {exp.date ? format(new Date(exp.date), "PPP") : "N/A"}
                    </TableCell>
                    <TableCell className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(exp)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(exp._id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
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

export default ExpenseManager;
