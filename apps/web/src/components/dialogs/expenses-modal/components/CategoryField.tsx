import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/hooks/api/useCategories";

const fieldWrapper =
  "group rounded-2xl border border-[#F2D7D9] bg-[rgba(252,244,244,0.92)] p-4 transition-all duration-200 hover:border-[#FECACA] hover:bg-white focus-within:border-[#DC2626] focus-within:bg-white shadow-[0_24px_48px_-30px_rgba(220,38,38,0.2)]";
const labelClass =
  "text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7280]";
const controlClass =
  "mt-3 h-11 rounded-xl border border-[#F1D4D6] bg-white px-4 text-sm text-[#0F172A] placeholder:text-[#9CA3AF] focus-visible:ring-[#DC2626]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-white";
const selectContentClass =
  "border border-[#F2D7D9] bg-white text-[#0F172A] shadow-[0_28px_48px_-28px_rgba(220,38,38,0.24)] rounded-2xl";
const selectItemClass =
  "text-sm text-[#0F172A] focus:bg-[#FEE2E2] focus:text-[#0F172A]";

interface CategoryFieldProps {
  value: string;
  onChange: (value: string) => void;
  categories: Category[];
}

export const CategoryField = ({
  value,
  onChange,
  categories,
}: CategoryFieldProps) => {
  return (
    <div className={fieldWrapper}>
      <Label htmlFor="categoria" className={labelClass}>
        Categoria
      </Label>
      <Select value={value} onValueChange={onChange} required>
        <SelectTrigger className={controlClass}>
          <SelectValue placeholder="Selecione a categoria" />
        </SelectTrigger>
        <SelectContent className={selectContentClass}>
          {categories.map((category) => (
            <SelectItem
              key={category.id}
              value={category.id.toString()}
              className={selectItemClass}
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3.5 w-3.5 rounded-full"
                  style={{ backgroundColor: category.hex_color || "#DC2626" }}
                />
                {category.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
