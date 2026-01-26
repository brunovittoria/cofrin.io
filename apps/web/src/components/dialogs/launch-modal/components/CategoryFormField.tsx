import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CategoryModal } from "@/components/dialogs/category-modal";
import type { Control } from "react-hook-form";
import type { FutureLaunchFormData } from "@/lib/validations";
import type { Category } from "@/hooks/api/useCategories";

const fieldWrapper =
  "group rounded-2xl border border-[#E4E8F4] bg-[rgba(249,250,255,0.9)] p-4 transition-all duration-200 hover:border-[#C6D4FF] hover:bg-white focus-within:border-[#0A84FF] focus-within:bg-white shadow-[0_24px_48px_-30px_rgba(10,132,255,0.25)]";
const labelClass = "text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7280]";
const controlClass =
  "mt-3 h-11 rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] placeholder:text-[#9CA3AF] focus-visible:ring-[#0A84FF]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white";
const selectContentClass =
  "border border-[#E2E8F0] bg-white text-[#0F172A] shadow-[0_28px_48px_-28px_rgba(10,132,255,0.28)] rounded-2xl";
const selectItemClass = "text-sm text-[#0F172A] focus:bg-[#EEF2FF] focus:text-[#0F172A]";

interface CategoryFormFieldProps {
  control: Control<FutureLaunchFormData>;
  categories: Category[];
  tipo?: string;
}

export const CategoryFormField = ({ control, categories, tipo }: CategoryFormFieldProps) => {
  if (!tipo) return null;

  if (categories.length === 0) {
    return (
      <div className={fieldWrapper}>
        <FormLabel className={labelClass}>Categoria</FormLabel>
        <div className="mt-3 flex flex-col items-center gap-3 py-4 text-center">
          <p className="text-sm text-[#6B7280]">
            Nenhuma categoria disponível para este tipo.
          </p>
          <CategoryModal
            defaultType={tipo}
            trigger={
              <Button type="button" variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Criar Categoria
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <FormField
      control={control}
      name="categoria_id"
      render={({ field }) => (
        <FormItem className={fieldWrapper}>
          <FormLabel className={labelClass}>Categoria</FormLabel>
          <Select value={field.value || ""} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger className={controlClass}>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
            </FormControl>
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
                      style={{
                        backgroundColor:
                          category.hex_color || (tipo === "entrada" ? "#16A34A" : "#DC2626"),
                      }}
                    />
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
