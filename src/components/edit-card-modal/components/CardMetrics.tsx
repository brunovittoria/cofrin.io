const metricBoxClass =
  "rounded-lg border border-dashed border-[#CBD5F5] bg-[#F8FAFF] px-3 py-2 text-sm text-[#475569]";

interface CardMetricsProps {
  valorDisponivel: number;
  usoPercentual: number;
}

export const CardMetrics = ({ valorDisponivel, usoPercentual }: CardMetricsProps) => {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:col-span-2">
      <div className={metricBoxClass}>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#6B7280]">Disponivel</p>
        <p className="text-lg font-semibold text-[#0F172A]">
          R$ {valorDisponivel.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </p>
      </div>
      <div className={metricBoxClass}>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#6B7280]">Uso</p>
        <p className="text-lg font-semibold text-[#0F172A]">{usoPercentual.toFixed(2)}%</p>
      </div>
    </div>
  );
};

