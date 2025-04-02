import { CreateAccountDrawer } from "@/components/create-acc-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { AccountCard } from "./_components/account-card";
import { getUserAccounts } from "@/actions/dashboard";
import { getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import { BudgetProgress } from "./_components/BudgetProgress";
// import {generateFinancialInsights } from "@/actions/financialInsights"; // Import your insights function
// import { defaultCategories } from "../../data/categories";
import { DashboardOverview } from "./_components/DashboardOverview";

async function Dashboardpage() {
  const [accounts, transactions] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
  ]);
  const defaultAccount = accounts?.find((account) => account.isDefault);

  // Get budget for default account
  let budgetData = null;
  // let financialInsights = [];

  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);

    // Generate insights based on budget data
    // financialInsights = await generateFinancialInsights(
    //   {
    //     totalIncome: budgetData?.budget?.amount || 0,
    //     totalExpenses: budgetData?.currentExpenses || 0,
    //     byCategory: defaultCategories // Add category-wise expense data if available
    //   },
    //   new Date().toLocaleString("default", { month: "long" }) // Get current month
    // );
  }

  return (
    <div className="space-y-8">
      {/* Budget Progress */}
      {defaultAccount && (
        <BudgetProgress
          initialBudget={budgetData?.budget}
          currentExpenses={budgetData?.currentExpenses || 0}
        />
      )}

      <DashboardOverview
        accounts={accounts}
        transactions={transactions || []}
      />
      {/* Financial Insights Section
      {financialInsights.length > 0 && (
        <div className="p-4 bg-gray-100 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Financial Insights</h2>
          <ul className="list-disc pl-5 space-y-1">
            {financialInsights.map((insight, index) => (
              <li key={index} className="text-sm text-gray-700">{insight}</li>
            ))}
          </ul>
        </div>
      )} */}

      {/* Account Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CreateAccountDrawer>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
              <Plus className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>
        {accounts.length > 0 &&
          accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
      </div>
    </div>
  );
}

export default Dashboardpage;
