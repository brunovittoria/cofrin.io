import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Categoria } from "@/hooks/useCategories";

const fieldWrapper =
  "group rounded-2xl border border-[#E4E8F4] bg-[rgba(249,250,255,0.9)] p-4 transition-all duration-200 hover:border-[#C6D4FF] hover:bg-white focus-within:border-[#0A84FF] focus-within:bg-white shadow-[0_24px_48px_-30px_rgba(10,132,255,0.25)]";
const labelClass = "text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7280]";
const controlClass =
  "mt-3 h-11 rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] placeholder:text-[#9CA3AF] focus-visible:ring-[#0A84FF]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white";
const selectContentClass =
  "border border-[#E2E8F0] bg-white text-[#0F172A] shadow-[0_28px_48px_-28px_rgba(10,132,255,0.28)] rounded-2xl";
const selectItemClass = "text-sm text-[#0F172A] focus:bg-[#EEF2FF] focus:text-[#0F172A]";

interface CategoryFieldProps {
  value: string;
  onChange: (value: string) => void;
  categorias: Categoria[];
}

export const CategoryField = ({ value, onChange, categorias }: CategoryFieldProps) => {
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
          {categorias.map((categoria) => (
            <SelectItem
              key={categoria.id}
              value={categoria.id.toString()}
              className={selectItemClass}
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3.5 w-3.5 rounded-full"
                  style={{ backgroundColor: categoria.cor_hex || "#16A34A" }}
                />
                {categoria.nome}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

