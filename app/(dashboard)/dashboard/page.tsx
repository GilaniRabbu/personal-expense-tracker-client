import OverviewCharts from "@/components/dashboard/OverviewCharts";
import ExpenseTable from "@/components/dashboard/ExpenseTable";

const page = () => {
  return (
    <div className="space-y-6 p-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Personal Expense Dashboard
        </h1>
        <p className="w-full md:w-2xl text-slate-500">
          Track your spending, manage your budget, and stay in control of your
          finances with a clear overview of your expense activity.
        </p>
      </div>
      <OverviewCharts />
      <ExpenseTable />
    </div>
  );
};

export default page;
