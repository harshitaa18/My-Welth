"use client";

import { useEffect, useState } from "react";
import { CreateAccountDrawer } from "@/components/create-acc-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { AccountCard } from "./_components/account-card";
import { getUserAccounts, getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget, generateFinancialInsights } from "@/actions/budget";
import { BudgetProgress } from "./_components/BudgetProgress";
import { DashboardOverview } from "./_components/DashboardOverview";

function Dashboardpage() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const [financialInsights, setFinancialInsights] = useState([]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [fetchedAccounts, fetchedTransactions] = await Promise.all([
          getUserAccounts(),
          getDashboardData(),
        ]);

        setAccounts(fetchedAccounts);
        setTransactions(fetchedTransactions || []);

        const defaultAcc = fetchedAccounts?.find((acc) => acc.isDefault);
        setDefaultAccount(defaultAcc);

        if (defaultAcc) {
          const budget = await getCurrentBudget(defaultAcc.id);

          setBudgetData(budget);

          if (budget?.budget) {
            // Log the values of totalIncome and totalExpenses
            const totalIncome = budget.budget?.amount || 0;
            const totalExpenses = budget.currentExpenses || 0;

            setLoadingInsights(true);

            const insights = await generateFinancialInsights({
              totalIncome: totalIncome,
              totalExpenses: totalExpenses,
            });

            console.log("Financial Insights:", insights); // Log insights response
            setFinancialInsights(insights);
            setLoadingInsights(false);
          }
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Budget Progress */}
      {defaultAccount && (
        <BudgetProgress
          initialBudget={budgetData?.budget}
          currentExpenses={budgetData?.currentExpenses || 0}
        />
      )}

      {/* Overview */}
      <DashboardOverview accounts={accounts} transactions={transactions} />

      {/* Financial Insights */}
      <div className="p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          💡 Financial Insights
        </h2>

        {loadingInsights ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-gray-300 rounded-md w-5/6" />
            <div className="h-4 bg-gray-300 rounded-md w-4/6" />
            <div className="h-4 bg-gray-300 rounded-md w-3/6" />
          </div>
        ) : (
          <ul className="list-disc pl-6 space-y-3">
            {financialInsights.length > 0 ? (
              financialInsights.map((insight, index) => (
                <li
                  key={index}
                  className="text-base text-gray-600 leading-relaxed"
                >
                  {insight}
                </li>
              ))
            ) : (
              <li className="text-base text-gray-400 italic">
                No insights available yet.
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Accounts */}
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
