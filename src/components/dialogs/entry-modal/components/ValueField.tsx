import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const fieldWrapper =
  "group rounded-2xl border border-[#E4E8F4] bg-[rgba(249,250,255,0.9)] p-4 transition-all duration-200 hover:border-[#C6D4FF] hover:bg-white focus-within:border-[#0A84FF] focus-within:bg-white shadow-[0_24px_48px_-30px_rgba(10,132,255,0.25)]";
const labelClass = "text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7280]";
const controlClass =
  "mt-3 h-11 rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] placeholder:text-[#9CA3AF] focus-visible:ring-[#0A84FF]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

interface ValueFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const ValueField = ({ value, onChange }: ValueFieldProps) => {
  return (
    <div className={fieldWrapper}>
      <Label htmlFor="valor" className={labelClass}>
        Valor (R$)
      </Label>
      <Input
        id="valor"
        type="number"
        step="0.01"
        placeholder="0,00"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className={controlClass}
      />
    </div>
  );
};

