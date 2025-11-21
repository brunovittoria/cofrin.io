import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardPreview } from "./CardPreview";
import { CardMetrics } from "./CardMetrics";

const labelClass = "text-xs font-medium text-[#475569]";
const inputClass =
  "h-10 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] placeholder:text-[#9CA3AF] focus-visible:ring-[#0A84FF]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

interface CardUsageFieldsProps {
  valorUtilizado: string;
  onValorUtilizadoChange: (value: string) => void;
  providerImageUrl?: string;
  providerName?: string;
  valorDisponivel: number;
  usoPercentual: number;
}

export const CardUsageFields = ({
  valorUtilizado,
  onValorUtilizadoChange,
  providerImageUrl,
  providerName,
  valorDisponivel,
  usoPercentual,
}: CardUsageFieldsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="valor_utilizado" className={labelClass}>
          Valor utilizado
        </Label>
        <Input
          id="valor_utilizado"
          type="number"
          min="0"
          step="0.01"
          placeholder="0,00"
          value={valorUtilizado}
          onChange={(event) => onValorUtilizadoChange(event.target.value)}
          className={inputClass}
        />
      </div>
      <CardPreview imageUrl={providerImageUrl} providerName={providerName} />
      <CardMetrics
        valorDisponivel={valorDisponivel}
        usoPercentual={usoPercentual}
      />
    </div>
  );
};
