/* eslint-disable */
"use client";

import { useState } from "react";
import {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
} from "@/redux/api/categoryApi";
import { useGetExpensesByCategoryQuery } from "@/redux/api/expenseApi";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

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
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const CategoryManager = () => {
  const [categoryName, setCategoryName] = useState("");
  const {
    data: categoriesResponse,
    isLoading: categoriesLoading,
    isError: categoriesError,
    error: categoriesErrorObj,
  } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();

  const categories =
    (categoriesResponse as ApiResponse<Category[]>)?.data || [];

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    if (categoryName.length > 50) {
      toast.error("Category name cannot exceed 50 characters");
      return;
    }
    try {
      await createCategory({ name: categoryName }).unwrap();
      setCategoryName("");
      toast.success(`Category "${categoryName}" created successfully`);
    } catch (err) {
      console.error("Failed to create category:", err);
      toast.error("Failed to create category. Please try again.");
    }
  };

  if (categoriesLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (categoriesError) {
    return (
      <div className="text-center text-red-500">
        Error: {(categoriesErrorObj as any)?.message || "Unknown error"}
      </div>
    );
  }

  return (
    <div className="container">
      <Card>
        <CardHeader>
          <CardTitle>Category Manager</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Create Category Form */}
          <form onSubmit={handleCreateCategory} className="mb-8 space-y-4">
            <div>
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="mt-1"
                placeholder="Enter category name"
                required
              />
            </div>
            <Button type="submit" className="cursor-pointer">
              Create Category
            </Button>
          </form>

          {/* Categories Tabs */}
          {categories.length === 0 ? (
            <div className="text-center text-slate-500">
              No categories found. Create one to get started!
            </div>
          ) : (
            <Tabs defaultValue={categories[0]?.id || ""} className="w-full">
              <TabsList className="flex flex-wrap">
                {categories.map((cat) => (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id}
                    className="flex-1 text-center cursor-pointer"
                  >
                    {cat.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {categories.map((cat) => (
                <TabsContent key={cat.id} value={cat.id}>
                  <CategoryExpenses
                    categoryId={cat.id}
                    categoryName={cat.name}
                  />
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const CategoryExpenses = ({
  categoryId,
  categoryName,
}: {
  categoryId: string;
  categoryName: string;
}) => {
  const {
    data: expensesResponse,
    isLoading,
    isError,
    error,
  } = useGetExpensesByCategoryQuery(categoryId);
  const expenseList = (expensesResponse as ApiResponse<Expense[]>)?.data || [];
  const totalCost = expenseList.reduce(
    (sum, exp) => sum + (exp.amount || 0),
    0
  );

  if (isLoading) {
    return <div className="text-center">Loading expenses...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Error: {(error as any)?.message || "Unknown error"}
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Total Cost for {categoryName}: ${totalCost.toFixed(2)}
      </h3>
      {expenseList.length === 0 ? (
        <div className="text-center text-slate-500">
          No expenses found for this category.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenseList.map((exp) => (
              <TableRow key={exp._id}>
                <TableCell>{exp.title || "N/A"}</TableCell>
                <TableCell>${(exp.amount || 0).toFixed(2)}</TableCell>
                <TableCell>
                  {exp.date ? format(new Date(exp.date), "PPP") : "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default CategoryManager;
