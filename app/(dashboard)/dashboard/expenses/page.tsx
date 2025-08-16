import ExpenseManager from "@/components/dashboard/ExpenseManager";

const page = () => {
  return (
    <div className="space-y-6 p-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Expense Overview</h1>
        <p className="w-full md:w-2xl text-slate-500">
          Stay on top of your finances with smart expense tracking. Monitor your
          spending, manage budgets effortlessly, and gain insights for better
          financial decisions.
        </p>
      </div>
      <ExpenseManager />
    </div>
  );
};

export default page;
