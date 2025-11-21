import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toLocalDateString } from "@/lib/formatters";
import { useCategories } from "@/hooks/useCategories";
import {
  useCreateLancamentoFuturo,
  useUpdateLancamentoFuturo,
  type LancamentoFuturo,
} from "@/hooks/useLancamentosFuturos";
import {
  lancamentoFuturoInputSchema,
  type LancamentoFuturoFormData,
} from "@/lib/validations";

interface LancamentoFuturoModalProps {
  trigger?: React.ReactNode;
  mode?: "create" | "edit";
  lancamento?: LancamentoFuturo & {
    categorias?: { nome: string; cor_hex?: string };
  };
}

export function LancamentoFuturoModal({
  trigger,
  mode = "create",
  lancamento,
}: LancamentoFuturoModalProps) {
  const [open, setOpen] = useState(false);
  const { data: categoriasEntrada = [] } = useCategories("entrada");
  const { data: categoriasSaida = [] } = useCategories("saida");
  const createLancamento = useCreateLancamentoFuturo();
  const updateLancamento = useUpdateLancamentoFuturo();

  const form = useForm<LancamentoFuturoFormData>({
    resolver: zodResolver(lancamentoFuturoInputSchema),
    mode: "onChange",
    defaultValues: {
      data: lancamento ? new Date(lancamento.data) : undefined,
      tipo: lancamento?.tipo,
      descricao: lancamento?.descricao || "",
      categoria_id: lancamento?.categoria_id?.toString() || "",
      valor: lancamento?.valor.toString() || "",
    },
  });

  const tipo = form.watch("tipo");
  const categorias =
    tipo === "entrada"
      ? categoriasEntrada
      : tipo === "saida"
      ? categoriasSaida
      : [];

  // Reset form when lancamento changes (for edit mode)
  useEffect(() => {
    if (open && mode === "edit" && lancamento) {
      form.reset({
        data: new Date(lancamento.data + "T00:00:00"),
        tipo: lancamento.tipo,
        descricao: lancamento.descricao || "",
        categoria_id: lancamento.categoria_id?.toString() || "",
        valor: lancamento.valor.toString(),
      });
    }
  }, [open, mode, lancamento, form]);

  const fieldWrapper =
    "group rounded-2xl border border-[#E4E8F4] bg-[rgba(249,250,255,0.9)] p-4 transition-all duration-200 hover:border-[#C6D4FF] hover:bg-white focus-within:border-[#0A84FF] focus-within:bg-white shadow-[0_24px_48px_-30px_rgba(10,132,255,0.25)]";
  const labelClass =
    "text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7280]";
  const controlClass =
    "mt-3 h-11 rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] placeholder:text-[#9CA3AF] focus-visible:ring-[#0A84FF]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white";
  const selectContentClass =
    "border border-[#E2E8F0] bg-white text-[#0F172A] shadow-[0_28px_48px_-28px_rgba(10,132,255,0.28)] rounded-2xl";
  const selectItemClass =
    "text-sm text-[#0F172A] focus:bg-[#EEF2FF] focus:text-[#0F172A]";
  const popoverClass =
    "w-auto rounded-2xl border border-[#E2E8F0] bg-white p-3 text-[#0F172A] shadow-[0_32px_54px_-30px_rgba(10,132,255,0.28)]";

  const handleSubmit = (data: LancamentoFuturoFormData) => {
    const payload = {
      data: toLocalDateString(data.data),
      tipo: data.tipo,
      descricao: data.descricao,
      categoria_id: parseInt(data.categoria_id, 10),
      valor: parseFloat(data.valor.replace(",", ".")),
    };

    if (mode === "edit" && lancamento) {
      updateLancamento.mutate(
        { id: lancamento.id, ...payload },
        {
          onSuccess: () => {
            setOpen(false);
            form.reset();
          },
        }
      );
    } else {
      createLancamento.mutate(payload, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      });
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      form.reset();
    }
    setOpen(next);
  };

  const defaultTrigger = (
    <Button className="h-12 rounded-2xl bg-[#0A84FF] px-6 text-sm font-semibold text-white shadow-[0px_20px_32px_-18px_rgba(10,132,255,0.6)] transition-transform hover:-translate-y-0.5 hover:bg-[#006FDB]">
      <Plus className="h-4 w-4 mr-2" />
      Novo Lançamento
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-semibold tracking-tight text-[#0F172A]">
            {mode === "edit"
              ? "Editar Lançamento Futuro"
              : "Novo Lançamento Futuro"}
          </DialogTitle>
          <DialogDescription className="text-sm text-[#6B7280]">
            Registre um lançamento previsto para o futuro com data, tipo,
            categoria e valor.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="data"
              render={({ field }) => (
                <FormItem className={fieldWrapper}>
                  <FormLabel className={labelClass}>Data Prevista</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="ghost"
                          className={cn(
                            controlClass,
                            "flex items-center justify-between bg-white text-left font-medium w-full",
                            !field.value && "text-[#9CA3AF]"
                          )}
                        >
                          <span className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-[#0A84FF]" />
                            {field.value
                              ? format(field.value, "dd/MM/yyyy")
                              : "Selecione a data prevista"}
                          </span>
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className={popoverClass}
                      align="start"
                      sideOffset={10}
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="pointer-events-auto rounded-2xl border border-[#E5E7EB] bg-white text-[#0F172A]"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem className={fieldWrapper}>
                  <FormLabel className={labelClass}>Tipo</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("categoria_id", "");
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className={controlClass}>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className={selectContentClass}>
                      <SelectItem value="entrada" className={selectItemClass}>
                        Entrada
                      </SelectItem>
                      <SelectItem value="saida" className={selectItemClass}>
                        Saída
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem className={fieldWrapper}>
                  <FormLabel className={labelClass}>Descrição</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Salário Janeiro, IPTU Terreno (1/7)"
                      className={controlClass}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {tipo && (
              <FormField
                control={form.control}
                name="categoria_id"
                render={({ field }) => (
                  <FormItem className={fieldWrapper}>
                    <FormLabel className={labelClass}>Categoria</FormLabel>
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className={controlClass}>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                      </FormControl>
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
                                style={{
                                  backgroundColor:
                                    categoria.cor_hex ||
                                    (tipo === "entrada"
                                      ? "#16A34A"
                                      : "#DC2626"),
                                }}
                              />
                              {categoria.nome}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="valor"
              render={({ field }) => (
                <FormItem className={fieldWrapper}>
                  <FormLabel className={labelClass}>Valor (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      className={controlClass}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                disabled={
                  form.formState.isSubmitting ||
                  createLancamento.isPending ||
                  updateLancamento.isPending
                }
              >
                {form.formState.isSubmitting ||
                createLancamento.isPending ||
                updateLancamento.isPending
                  ? "Salvando..."
                  : mode === "edit"
                  ? "Salvar Alterações"
                  : "Criar Lançamento"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
