import type { Expense } from "./types";

export interface CategoryPoint {
  name: string;
  value: number;
}

export interface DailyPoint {
  date: string;
  amount: number;
}

export function buildCategoryData(expenses: Expense[]): CategoryPoint[] {
  return expenses.reduce<CategoryPoint[]>((acc, exp) => {
    const existing = acc.find((d) => d.name === exp.category);
    if (existing) {
      existing.value += exp.price;
    } else {
      acc.push({ name: exp.category, value: exp.price });
    }
    return acc;
  }, []);
}

export function buildDailyData(expenses: Expense[]): DailyPoint[] {
  return expenses
    .reduce<DailyPoint[]>((acc, exp) => {
      const existing = acc.find((d) => d.date === exp.date);
      if (existing) {
        existing.amount += exp.price;
      } else {
        acc.push({ date: exp.date, amount: exp.price });
      }
      return acc;
    }, [])
    .sort((a, b) => a.date.localeCompare(b.date));
}

