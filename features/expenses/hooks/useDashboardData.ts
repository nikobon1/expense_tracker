"use client";

import { useCallback, useState } from "react";
import type { Expense } from "@/features/expenses/types";
import { getExpenses } from "@/lib/api";

function getInitialDateRange() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  return {
    start: firstDay.toISOString().split("T")[0],
    end: today.toISOString().split("T")[0],
  };
}

export function useDashboardData() {
  const [startDate, setStartDate] = useState(() => getInitialDateRange().start);
  const [endDate, setEndDate] = useState(() => getInitialDateRange().end);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [prevMonthTotal, setPrevMonthTotal] = useState(0);

  const loadExpenses = useCallback(async () => {
    if (!startDate || !endDate) return;

    try {
      const data = await getExpenses(startDate, endDate);
      setExpenses(data.expenses);
      setPrevMonthTotal(data.prevMonthTotal);
    } catch (error) {
      console.error("Error loading expenses:", error);
    }
  }, [startDate, endDate]);

  return {
    startDate,
    endDate,
    expenses,
    prevMonthTotal,
    setStartDate,
    setEndDate,
    loadExpenses,
  };
}
