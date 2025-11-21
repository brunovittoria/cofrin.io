import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const labelClass = "text-xs font-medium text-[#475569]";
const inputClass =
  "h-10 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] placeholder:text-[#9CA3AF] focus-visible:ring-[#0A84FF]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

interface CardNumberLimitFieldsProps {
  finalCartao: string;
  limiteTotal: string;
  onFinalCartaoChange: (value: string) => void;
  onLimiteTotalChange: (value: string) => void;
}

export const CardNumberLimitFields = ({
  finalCartao,
  limiteTotal,
  onFinalCartaoChange,
  onLimiteTotalChange,
}: CardNumberLimitFieldsProps) => {
  const handleFinalCartaoChange = (value: string) => {
    const onlyDigits = value.replace(/[^0-9]/g, "").slice(0, 4);
    onFinalCartaoChange(onlyDigits);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="final_cartao" className={labelClass}>
          Final do cartao
        </Label>
        <Input
          id="final_cartao"
          placeholder="6782"
          value={finalCartao}
          maxLength={4}
          onChange={(event) => handleFinalCartaoChange(event.target.value)}
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="limite_total" className={labelClass}>
          Limite total
        </Label>
        <Input
          id="limite_total"
          type="number"
          min="0"
          step="0.01"
          placeholder="0,00"
          value={limiteTotal}
          onChange={(event) => onLimiteTotalChange(event.target.value)}
          required
          className={inputClass}
        />
      </div>
    </div>
  );
};

