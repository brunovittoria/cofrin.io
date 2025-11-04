import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { DateRange } from "react-day-picker";
import { useIncomeExpenseData } from "@/hooks/useChartData";
import { Skeleton } from "@/components/ui/skeleton";

const renderHeader = () => (
  <header className="flex flex-col gap-2 border-b border-[#E5E7EB] pb-5 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">Fluxo Mensal</p>
      <h3 className="text-lg font-semibold text-[#0F172A]">Entradas vs Saidas</h3>
    </div>
    <div className="inline-flex items-center gap-2 rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-medium text-[#4B5563]">
      Ultimos 12 meses
    </div>
  </header>
);

type IncomeExpenseChartProps = {
  dateRange?: DateRange;
};

export function IncomeExpenseChart({ dateRange }: IncomeExpenseChartProps) {
  const { data, isLoading, error } = useIncomeExpenseData(dateRange);

  if (isLoading) {
    return (
      <section className="surface-card p-6 sm:p-7">
        {renderHeader()}
        <Skeleton className="mt-6 h-[340px] w-full bg-[#F1F5F9]" />
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="surface-card p-6 sm:p-7">
        {renderHeader()}
        <div className="flex h-[340px] items-center justify-center text-sm font-medium text-[#9CA3AF]">
          {error ? "Erro ao carregar dados" : "Nenhum dado disponivel"}
        </div>
      </section>
    );
  }

  return (
    <section className="surface-card p-6 sm:p-7">
      {renderHeader()}
      <div className="mt-6 h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="entradas-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22C55E" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#22C55E" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="saidas-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F97316" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#F97316" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="mes"
              stroke="#94A3B8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94A3B8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => "R$ " + (value / 1000).toFixed(0) + "k"}
            />
            <Tooltip
              cursor={{ fill: "rgba(148, 163, 184, 0.12)" }}
              formatter={(value: number, name: string) => [
                "R$ " + value.toLocaleString("pt-BR"),
                name === "entradas" ? "Entradas" : "Saidas"
              ]}
              labelStyle={{ color: "#1F2937", fontWeight: 600 }}
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                boxShadow: "0 20px 35px rgba(15, 23, 42, 0.08)",
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: 24 }}
            />
            <Bar dataKey="entradas" fill="url(#entradas-gradient)" radius={[8, 8, 0, 0]} name="Entradas" />
            <Bar dataKey="saidas" fill="url(#saidas-gradient)" radius={[8, 8, 0, 0]} name="Saidas" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
