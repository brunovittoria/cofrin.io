import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useCategories } from "@/hooks/useCategories";
import { useCreateEntrada, useUpdateEntrada, type Entrada } from "@/hooks/useEntradas";
import { parseLocalDate, toLocalDateString } from "@/lib/formatters";

interface EntradaModalProps {
  trigger?: React.ReactNode;
  mode?: "create" | "edit";
  entrada?: (Entrada & { categorias?: { nome: string; cor_hex?: string } });
}

export function EntradaModal({ trigger, mode = "create", entrada }: EntradaModalProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const { toast } = useToast();
  const { data: categorias = [] } = useCategories("entrada");
  const createEntrada = useCreateEntrada();
  const updateEntrada = useUpdateEntrada();

  const [formData, setFormData] = useState({
    descricao: "",
    categoria_id: "",
    valor: "",
    tipo: "",
  });

  const fieldWrapper =
    "group rounded-2xl border border-[#E4E8F4] bg-[rgba(249,250,255,0.9)] p-4 transition-all duration-200 hover:border-[#C6D4FF] hover:bg-white focus-within:border-[#0A84FF] focus-within:bg-white shadow-[0_24px_48px_-30px_rgba(10,132,255,0.25)]";
  const labelClass = "text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7280]";
  const controlClass =
    "mt-3 h-11 rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] placeholder:text-[#9CA3AF] focus-visible:ring-[#0A84FF]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white";
  const selectContentClass =
    "border border-[#E2E8F0] bg-white text-[#0F172A] shadow-[0_28px_48px_-28px_rgba(10,132,255,0.28)] rounded-2xl";
  const selectItemClass = "text-sm text-[#0F172A] focus:bg-[#EEF2FF] focus:text-[#0F172A]";
  const popoverClass =
    "w-auto rounded-2xl border border-[#E2E8F0] bg-white p-3 text-[#0F172A] shadow-[0_32px_54px_-30px_rgba(10,132,255,0.28)]";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma data.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.categoria_id) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma categoria.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      data: toLocalDateString(date),
      descricao: formData.descricao || undefined,
      valor: parseFloat(formData.valor),
      categoria_id: parseInt(formData.categoria_id),
    };

    if (mode === "edit" && entrada?.id) {
      updateEntrada.mutate(
        { id: entrada.id, ...payload },
        {
          onSuccess: () => {
            setOpen(false);
          },
        },
      );
    } else {
      createEntrada.mutate(payload, {
        onSuccess: () => {
          setOpen(false);
          setFormData({ descricao: "", categoria_id: "", valor: "", tipo: "" });
          setDate(undefined);
        },
      });
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (next && mode === "edit" && entrada) {
      try {
        setDate(entrada.data ? parseLocalDate(entrada.data) : undefined);
      } catch {}
      setFormData({
        descricao: entrada.descricao || "",
        categoria_id: entrada.categoria_id ? String(entrada.categoria_id) : "",
        valor: entrada.valor != null ? String(entrada.valor) : "",
        tipo: "",
      });
    }
    setOpen(next);
  };

  const defaultTrigger = (
    <Button className="h-11 rounded-2xl bg-[#16A34A] px-6 text-sm font-semibold text-white shadow-[0_20px_36px_-20px_rgba(22,163,74,0.5)] transition-transform hover:-translate-y-0.5 hover:bg-[#15803D]">
      <Plus className="h-4 w-4" />
      Nova Entrada
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-semibold tracking-tight text-[#0F172A]">
            {mode === "edit" ? "Editar Entrada" : "Nova Entrada"}
          </DialogTitle>
          <DialogDescription className="text-sm text-[#6B7280]">
            Registre o movimento com data, categoria e valor mantendo a linguagem visual premium light.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className={fieldWrapper}>
            <Label htmlFor="data" className={labelClass}>
              Data
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    controlClass,
                    "flex items-center justify-between bg-white text-left font-medium",
                    !date && "text-[#9CA3AF]",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-[#0A84FF]" />
                    {date ? format(date, "dd/MM/yyyy") : "Selecione a data"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className={popoverClass} align="start" sideOffset={10}>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="pointer-events-auto rounded-2xl border border-[#E5E7EB] bg-white text-[#0F172A]"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className={fieldWrapper}>
            <Label htmlFor="descricao" className={labelClass}>
              Descrição
            </Label>
            <Input
              id="descricao"
              placeholder="Ex: Salário Janeiro"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              required
              className={controlClass}
            />
          </div>

          <div className={fieldWrapper}>
            <Label htmlFor="categoria" className={labelClass}>
              Categoria
            </Label>
            <Select
              value={formData.categoria_id}
              onValueChange={(value) => setFormData({ ...formData, categoria_id: value })}
              required
            >
              <SelectTrigger className={controlClass}>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent className={selectContentClass}>
                {categorias.map((categoria) => (
                  <SelectItem key={categoria.id} value={categoria.id.toString()} className={selectItemClass}>
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

          <div className={fieldWrapper}>
            <Label htmlFor="valor" className={labelClass}>
              Valor (R$)
            </Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              placeholder="0,00"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              required
              className={controlClass}
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
                <SelectItem value="fixo" className={selectItemClass}>
                  Fixo
                </SelectItem>
                <SelectItem value="variavel" className={selectItemClass}>
                  Variável
                </SelectItem>
                <SelectItem value="passivo" className={selectItemClass}>
                  Passivo
                </SelectItem>
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
              disabled={mode === "edit" ? updateEntrada.isPending : createEntrada.isPending}
            >
              {mode === "edit"
                ? updateEntrada.isPending
                  ? "Salvando..."
                  : "Salvar Alterações"
                : createEntrada.isPending
                  ? "Criando..."
                  : "Criar Entrada"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

