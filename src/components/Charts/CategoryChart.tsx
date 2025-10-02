import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useCategoryData } from "@/hooks/useChartData";
import { Skeleton } from "@/components/ui/skeleton";

type TooltipPayload = {
  payload: {
    name: string;
    value: number;
    fill: string;
    total: number;
  };
};

type TooltipProps = {
  active?: boolean;
  payload?: TooltipPayload[];
};

const renderHeader = () => (
  <header className="flex flex-col gap-2 border-b border-[#E5E7EB] pb-5 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">Distribuição</p>
      <h3 className="text-lg font-semibold text-[#0F172A]">Gastos por Categoria</h3>
    </div>
    <div className="inline-flex items-center gap-2 rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-medium text-[#4B5563]">
      Este mês
    </div>
  </header>
);

const buildTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const entry = payload[0].payload;
    const percentage = entry.total ? ((entry.value / entry.total) * 100).toFixed(1) : "0";
    return (
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-[0px_24px_40px_-20px_rgba(15,23,42,0.12)]">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.fill }} />
          <span className="text-sm font-semibold text-[#0F172A]">{entry.name}</span>
        </div>
        <p className="mt-2 text-lg font-semibold text-[#0F172A]">
          R$ {entry.value.toLocaleString("pt-BR")}
        </p>
        <p className="text-xs text-[#6B7280]">{percentage}% do total</p>
      </div>
    );
  }

  return null;
};

export function CategoryChart() {
  const { data, isLoading, error } = useCategoryData();

  if (isLoading) {
    return (
      <section className="surface-card p-6 sm:p-7">
        {renderHeader()}
        <Skeleton className="mt-6 h-[300px] w-full bg-[#F1F5F9]" />
      </section>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <section className="surface-card p-6 sm:p-7">
        {renderHeader()}
        <div className="flex h-[300px] items-center justify-center text-sm font-medium text-[#9CA3AF]">
          {error ? "Erro ao carregar dados" : "Nenhum dado disponível"}
        </div>
      </section>
    );
  }

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithTotal = data.map((item) => ({ ...item, total: totalValue }));

  return (
    <section className="surface-card p-6 sm:p-7">
      {renderHeader()}
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_minmax(0,0.95fr)]">
        <div className="h-[300px] sm:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataWithTotal}
                cx="50%"
                cy="50%"
                innerRadius={68}
                outerRadius={108}
                paddingAngle={4}
                dataKey="value"
              >
                {dataWithTotal.map((entry, index) => (
                  <Cell
                    key={entry.name + index}
                    fill={entry.fill}
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={buildTooltip} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          {dataWithTotal.map((entry) => (
            <div
              key={entry.name}
              className="flex items-center justify-between gap-4 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.fill }} />
                <span className="text-sm font-semibold text-[#0F172A]">{entry.name}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-[#0F172A]">
                  R$ {entry.value.toLocaleString("pt-BR")}
                </p>
                <p className="text-xs text-[#6B7280]">
                  {((entry.value / totalValue) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
