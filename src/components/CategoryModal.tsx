import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useCreateCategoria, useUpdateCategoria, type Categoria } from "@/hooks/useCategories";

const colorOptions = [
  { name: "Verde", value: "#10b981" },
  { name: "Vermelho", value: "#ef4444" },
  { name: "Amarelo", value: "#f59e0b" },
  { name: "Azul", value: "#3b82f6" },
  { name: "Roxo", value: "#8b5cf6" },
  { name: "Rosa", value: "#ec4899" },
];

interface CategoryModalProps {
  trigger?: React.ReactNode;
  defaultTipo?: string;
  mode?: "create" | "edit";
  categoria?: Categoria;
}

export function CategoryModal({ trigger, defaultTipo, mode = "create", categoria }: CategoryModalProps) {
  const [open, setOpen] = useState(false);
  const createCategoria = useCreateCategoria();
  const updateCategoria = useUpdateCategoria();

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    tipo: defaultTipo || "",
    cor_hex: "",
  });

  const fieldWrapper =
    "group rounded-2xl border border-[#E4E8F4] bg-[rgba(249,250,255,0.9)] p-4 transition-all duration-200 hover:border-[#C6D4FF] hover:bg-white focus-within:border-[#0A84FF] focus-within:bg-white shadow-[0_24px_48px_-30px_rgba(10,132,255,0.22)]";
  const labelClass = "text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7280]";
  const controlClass =
    "mt-3 h-11 rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] placeholder:text-[#9CA3AF] focus-visible:ring-[#0A84FF]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white";
  const textareaClass =
    "mt-3 min-h-[120px] rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#9CA3AF] focus-visible:ring-[#0A84FF]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white";
  const selectContentClass =
    "border border-[#E2E8F0] bg-white text-[#0F172A] shadow-[0_28px_48px_-28px_rgba(10,132,255,0.24)] rounded-2xl";
  const selectItemClass = "text-sm text-[#0F172A] focus:bg-[#EEF2FF] focus:text-[#0F172A]";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "edit" && categoria?.id) {
      updateCategoria.mutate(
        {
          id: categoria.id,
          nome: formData.nome,
          descricao: formData.descricao || undefined,
          tipo: formData.tipo,
          cor_hex: formData.cor_hex,
        },
        {
          onSuccess: () => {
            setOpen(false);
          },
        },
      );
      return;
    }

    createCategoria.mutate(
      {
        nome: formData.nome,
        descricao: formData.descricao || undefined,
        tipo: formData.tipo,
        cor_hex: formData.cor_hex,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setFormData({ nome: "", descricao: "", tipo: defaultTipo || "", cor_hex: "" });
        },
      },
    );
  };

  const defaultTrigger = (
    <Button className="h-11 rounded-2xl border border-[#CBD5F5] bg-white px-5 text-sm font-semibold text-[#0F172A] shadow-[0_18px_32px_-24px_rgba(15,23,42,0.18)] transition-transform hover:-translate-y-0.5 hover:bg-[#EEF2FF]">
      <Plus className="h-4 w-4" />
      Nova Categoria
    </Button>
  );

  const handleOpenChange = (next: boolean) => {
    if (next && mode === "edit" && categoria) {
      setFormData({
        nome: categoria.nome || "",
        descricao: categoria.descricao || "",
        tipo: categoria.tipo || defaultTipo || "",
        cor_hex: categoria.cor_hex || "",
      });
    } else if (next && mode === "create") {
      setFormData((prev) => ({ ...prev, tipo: defaultTipo || prev.tipo }));
    }
    setOpen(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-semibold tracking-tight text-[#0F172A]">
            {mode === "edit" ? "Editar Categoria" : "Nova Categoria"}
          </DialogTitle>
          <DialogDescription className="text-sm text-[#6B7280]">
            Defina nome, tipo e cor das categorias mantendo o visual leve e sofisticado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className={fieldWrapper}>
            <Label htmlFor="nome" className={labelClass}>
              Nome da Categoria
            </Label>
            <Input
              id="nome"
              placeholder="Ex: Alimentação"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
              className={controlClass}
            />
          </div>

          <div className={fieldWrapper}>
            <Label htmlFor="descricao" className={labelClass}>
              Descrição
            </Label>
            <Textarea
              id="descricao"
              placeholder="Descrição opcional da categoria"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows={3}
              className={textareaClass}
            />
          </div>

          <div className={fieldWrapper}>
            <Label htmlFor="tipo" className={labelClass}>
              Tipo
            </Label>
            <Select
              value={formData.tipo}
              onValueChange={(value) => setFormData({ ...formData, tipo: value })}
              required
            >
              <SelectTrigger className={controlClass}>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className={selectContentClass}>
                <SelectItem value="entrada" className={selectItemClass}>
                  Entrada
                </SelectItem>
                <SelectItem value="saida" className={selectItemClass}>
                  Saída
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={fieldWrapper}>
            <Label htmlFor="cor" className={labelClass}>
              Cor
            </Label>
            <Select
              value={formData.cor_hex}
              onValueChange={(value) => setFormData({ ...formData, cor_hex: value })}
              required
            >
              <SelectTrigger className={controlClass}>
                <SelectValue placeholder="Selecione a cor" />
              </SelectTrigger>
              <SelectContent className={selectContentClass}>
                {colorOptions.map((color) => (
                  <SelectItem key={color.value} value={color.value} className={selectItemClass}>
                    <div className="flex items-center gap-2">
                      <div className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: color.value }} />
                      {color.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              className="h-11 rounded-xl border border-[#E5E7EB] bg-white px-5 text-sm font-semibold text-[#0F172A] hover:bg-[#F3F4F6]"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="ghost"
              className="brand-cta-luxe h-11 rounded-xl px-6 text-sm font-semibold tracking-wide hover:scale-[1.01]"
              disabled={mode === "edit" ? updateCategoria.isPending : createCategoria.isPending}
            >
              {mode === "edit"
                ? updateCategoria.isPending
                  ? "Salvando..."
                  : "Salvar Alterações"
                : createCategoria.isPending
                  ? "Criando..."
                  : "Criar Categoria"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

