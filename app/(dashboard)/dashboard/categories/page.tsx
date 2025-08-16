import CategoryCostCharts from "@/components/dashboard/CategoryCostCharts";

const page = () => {
  return (
    <div className="space-y-6 p-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          All Categories Overview
        </h1>
        <p className="w-full md:w-3xl text-slate-500">
          Get a complete snapshot of your expenses across all categories.
          Monitor spending patterns, optimize your budget, and gain valuable
          insights to stay financially organized.
        </p>
      </div>
      <CategoryCostCharts />
    </div>
  );
};

export default page;
