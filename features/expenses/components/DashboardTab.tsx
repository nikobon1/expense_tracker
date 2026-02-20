"use client";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CHART_COLORS } from "@/features/expenses/constants";
import { buildCategoryData, buildDailyData } from "@/features/expenses/utils";
import type { Expense } from "@/features/expenses/types";

interface DashboardTabProps {
  startDate: string;
  endDate: string;
  expenses: Expense[];
  prevMonthTotal: number;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

export default function DashboardTab({
  startDate,
  endDate,
  expenses,
  prevMonthTotal,
  onStartDateChange,
  onEndDateChange,
}: DashboardTabProps) {
  const expensesTotal = expenses.reduce((sum, exp) => sum + exp.price, 0);
  const percentChange =
    prevMonthTotal > 0 ? ((expensesTotal - prevMonthTotal) / prevMonthTotal) * 100 : 0;
  const categoryData = buildCategoryData(expenses);
  const dailyData = buildDailyData(expenses);

  return (
    <div>
      <div className="date-filter">
        <div>
          <label>рџ“… РќР°С‡Р°Р»Рѕ РїРµСЂРёРѕРґР°</label>
          <input type="date" value={startDate} onChange={(e) => onStartDateChange(e.target.value)} />
        </div>
        <div>
          <label>рџ“… РљРѕРЅРµС† РїРµСЂРёРѕРґР°</label>
          <input type="date" value={endDate} onChange={(e) => onEndDateChange(e.target.value)} />
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-label">рџ’° РћР±С‰РёРµ СЂР°СЃС…РѕРґС‹</div>
          <div className="metric-value">{expensesTotal.toFixed(2)} в‚¬</div>
          {prevMonthTotal > 0 && (
            <div className={`metric-delta ${percentChange >= 0 ? "negative" : "positive"}`}>
              {percentChange >= 0 ? "в†‘" : "в†“"} {Math.abs(percentChange).toFixed(1)}% vs РїСЂРµРґ. РјРµСЃСЏС†
            </div>
          )}
        </div>
        <div className="metric-card">
          <div className="metric-label">рџ§ѕ РљРѕР»РёС‡РµСЃС‚РІРѕ С‚РѕРІР°СЂРѕРІ</div>
          <div className="metric-value">{expenses.length}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">рџ“… РџСЂРµРґ. РјРµСЃСЏС†</div>
          <div className="metric-value">{prevMonthTotal.toFixed(2)} в‚¬</div>
        </div>
      </div>

      {expenses.length > 0 ? (
        <>
          <div className="charts-grid">
            <div className="chart-card">
              <h4>рџҐ§ Р Р°СЃС…РѕРґС‹ РїРѕ РєР°С‚РµРіРѕСЂРёСЏРј</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }: { name?: string; percent?: number }) =>
                      `${name || ""} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${Number(value).toFixed(2)} в‚¬`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h4>рџ“Љ Р Р°СЃС…РѕРґС‹ РїРѕ РґРЅСЏРј</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyData}>
                  <XAxis dataKey="date" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) => [`${Number(value).toFixed(2)} в‚¬`, "РЎСѓРјРјР°"]}
                    contentStyle={{ background: "#1a1a24", border: "1px solid #27272a", borderRadius: "8px" }}
                  />
                  <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h3>рџ“‹ Р”РµС‚Р°Р»РёР·Р°С†РёСЏ СЂР°СЃС…РѕРґРѕРІ</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Р”Р°С‚Р°</th>
                    <th>РњР°РіР°Р·РёРЅ</th>
                    <th>РўРѕРІР°СЂ</th>
                    <th>РљР°С‚РµРіРѕСЂРёСЏ</th>
                    <th style={{ textAlign: "right" }}>Р¦РµРЅР°</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((exp) => (
                    <tr key={exp.id}>
                      <td>{exp.date}</td>
                      <td>{exp.store}</td>
                      <td>{exp.item}</td>
                      <td>{exp.category}</td>
                      <td style={{ textAlign: "right" }}>{exp.price.toFixed(2)} в‚¬</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="card">
          <div className="empty-state">
            <div className="icon">рџ“­</div>
            <p>РќРµС‚ РґР°РЅРЅС‹С… Р·Р° РІС‹Р±СЂР°РЅРЅС‹Р№ РїРµСЂРёРѕРґ</p>
            <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
              Р—Р°РіСЂСѓР·РёС‚Рµ С‡РµРєРё РІРѕ РІРєР»Р°РґРєРµ &quot;РЎРєР°РЅРёСЂРѕРІР°РЅРёРµ&quot;
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

