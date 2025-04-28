"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

export async function getCurrentBudget(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const budget = await db.budget.findFirst({
      where: {
        userId: user.id,
      },
    });

    // Get current month's expenses
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const expenses = await db.transaction.aggregate({
      where: {
        userId: user.id,
        type: "EXPENSE",
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        accountId,
      },
      _sum: {
        amount: true,
      },
    });

    return {
      budget: budget ? { ...budget, amount: budget.amount.toNumber() } : null,
      currentExpenses: expenses._sum.amount
        ? expenses._sum.amount.toNumber()
        : 0,
    };

  } catch (error) {
    console.error("Error fetching budget:", error);
    throw error;
  }
}

export async function updateBudget(amount) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Update or create budget
    const budget = await db.budget.upsert({
      where: {
        userId: user.id,
      },
      update: {
        amount,
      },
      create: {
        userId: user.id,
        amount,
      },
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      data: { ...budget, amount: budget.amount.toNumber() },
    };
  } catch (error) {
    console.error("Error updating budget:", error);
    return { success: false, error: error.message };
  }
}

export async function generateFinancialInsights({ totalIncome, totalExpenses }) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Make sure the correct model is used
    
    const prompt = `
    You're a personal finance coach, and I need you to analyze the following user data and give exactly 3-4 specific, friendly, and actionable insights. You should:

- Use a motivational, friendly, and encouraging tone, like you're talking to a close friend.
- Be positive and helpful, even if the user has room for improvement.
- Offer practical tips on saving more, reducing expenses, and making smarter financial decisions.
- Provide concrete examples or small changes that could make a big difference.

User Data:
- Total Income: ${totalIncome}
- Total Expenses: ${totalExpenses}

Your insights should clearly cover:
1. Whether the user is spending in a healthy way.
2. How they can increase savings, cut unnecessary expenses, or balance their budget.
3. Positive reinforcement about their financial progress and encouragement for their journey.
4. At least one small but impactful step they can take to improve their finances today.

Please format your response as 1., 2., 3., and 4. numbered points, each being clear and concise.

    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const insights = text.split("\n")
    .filter((line) => line.trim() !== "")
    .map(line => 
      line
        .replace(/^\d+\.\s*/, "")      // Remove "1. ", "2. ", etc.
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **bold** and keep the inside text
        .replace(/\\\$/g, '$')          // Replace \$ with $
        .trim()
    );
  

    // Return top 4 refined insights
    return insights.slice(0, 4);
  } catch (error) {
    console.error("Error generating financial insights:", error);
    return [];
  }
}




