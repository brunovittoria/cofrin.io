import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fieldWrapper =
  "group rounded-2xl border border-[#E4E8F4] bg-[rgba(249,250,255,0.9)] p-4 transition-all duration-200 hover:border-[#C6D4FF] hover:bg-white focus-within:border-[#0A84FF] focus-within:bg-white shadow-[0_24px_48px_-30px_rgba(10,132,255,0.22)]";
const labelClass =
  "text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7280]";
const controlClass =
  "mt-3 h-11 rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] placeholder:text-[#9CA3AF] focus-visible:ring-[#0A84FF]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white";
const selectContentClass =
  "border border-[#E2E8F0] bg-white text-[#0F172A] shadow-[0_28px_48px_-28px_rgba(10,132,255,0.24)] rounded-2xl";
const selectItemClass =
  "text-sm text-[#0F172A] focus:bg-[#EEF2FF] focus:text-[#0F172A]";

export const colorOptions = [
  { name: "Verde", value: "#10b981" },
  { name: "Vermelho", value: "#ef4444" },
  { name: "Amarelo", value: "#f59e0b" },
  { name: "Azul", value: "#3b82f6" },
  { name: "Roxo", value: "#8b5cf6" },
  { name: "Rosa", value: "#ec4899" },
];

interface CategoryColorFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const CategoryColorField = ({
  value,
  onChange,
}: CategoryColorFieldProps) => {
  return (
    <div className={fieldWrapper}>
      <Label htmlFor="cor" className={labelClass}>
        Cor
      </Label>
      <Select value={value} onValueChange={onChange} required>
        <SelectTrigger className={controlClass}>
          <SelectValue placeholder="Selecione a cor" />
        </SelectTrigger>
        <SelectContent className={selectContentClass}>
          {colorOptions.map((color) => (
            <SelectItem
              key={color.value}
              value={color.value}
              className={selectItemClass}
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3.5 w-3.5 rounded-full"
                  style={{ backgroundColor: color.value }}
                />
                {color.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
