import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from "recharts";
import { DateRange } from "react-day-picker";
import { useBalanceData } from "@/hooks/useChartData";
import { Skeleton } from "@/components/ui/skeleton";

const renderHeader = () => (
  <header className="flex flex-col gap-2 border-b border-[#E5E7EB] pb-5 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">Evolucao</p>
      <h3 className="text-lg font-semibold text-[#0F172A]">Evolucao do Saldo</h3>
    </div>
    <div className="inline-flex items-center gap-2 rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-medium text-[#4B5563]">
      Ano atual
    </div>
  </header>
);

type BalanceChartProps = {
  dateRange?: DateRange;
};

export function BalanceChart({ dateRange }: BalanceChartProps) {
  const { data, isLoading, error } = useBalanceData(dateRange);

  if (isLoading) {
    return (
      <section className="surface-card p-6 sm:p-7">
        {renderHeader()}
        <Skeleton className="mt-6 h-[320px] w-full bg-[#F1F5F9]" />
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="surface-card p-6 sm:p-7">
        {renderHeader()}
        <div className="flex h-[320px] items-center justify-center text-sm font-medium text-[#9CA3AF]">
          {error ? "Erro ao carregar dados" : "Nenhum dado disponivel"}
        </div>
      </section>
    );
  }

  return (
    <section className="surface-card p-6 sm:p-7">
      {renderHeader()}
      <div className="mt-6 h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="saldo-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0A84FF" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#0A84FF" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4" stroke="#E5E7EB" />
            <XAxis
              dataKey="dia"
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
              tickFormatter={(value) => "R$ " + value.toLocaleString("pt-BR")}
            />
            <Tooltip
              cursor={{ stroke: "#0A84FF", strokeWidth: 1, strokeDasharray: "4 4" }}
              formatter={(value: number) => "R$ " + value.toLocaleString("pt-BR")}
              labelStyle={{ color: "#1F2937", fontWeight: 600 }}
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                boxShadow: "0 20px 35px rgba(15, 23, 42, 0.08)",
              }}
            />
            <Area type="monotone" dataKey="saldo" fill="url(#saldo-area)" stroke="none" />
            <Line
              type="monotone"
              dataKey="saldo"
              stroke="#0A84FF"
              strokeWidth={3}
              dot={{ r: 4, fill: "#0A84FF", stroke: "#FFFFFF", strokeWidth: 2 }}
              activeDot={{ r: 6, stroke: "#0A84FF", strokeWidth: 2, fill: "#FFFFFF" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
