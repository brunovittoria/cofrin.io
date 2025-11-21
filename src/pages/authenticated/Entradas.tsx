import { useState, type CSSProperties } from "react";
import {
  type LucideIcon,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EntradaModal } from "@/components/dialogs/entry-modal";
import { Toaster } from "@/components/ui/toaster";
import {
  useEntradas,
  useEntradasSummary,
  useDeleteEntrada,
} from "@/hooks/api/useEntradas";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { MonthPicker } from "@/components/MonthPicker";
import { DateRange } from "react-day-picker";
import { formatCurrency, formatLocalDate } from "@/lib/formatters";

const DEFAULT_CATEGORY_COLOR = "#10b981";

const sanitizeHexColor = (
  hex: string | null | undefined,
  fallback: string
): string => {
  if (!hex) return fallback;
  const normalized = hex.trim();
  return /^#([0-9a-f]{3}){1,2}$/i.test(normalized) ? normalized : fallback;
};

const buildCategoryBadgeTokens = (
  hex: string | null | undefined,
  fallback: string
) => {
  const color = sanitizeHexColor(hex, fallback);
  const style: CSSProperties = {
    background: color + "12",
    borderColor: color + "33",
    boxShadow: "0 6px 18px " + color + "1f",
  };
  return { accent: color, style };
};

const SummaryCard = ({
  title,
  value,
  icon: Icon,
  badgeClass = "bg-[#ECFDF3] text-[#16A34A]",
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  badgeClass?: string;
}) => (
  <article className="surface-card p-6">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-[#6B7280]">{title}</p>
        <p className="mt-2 text-2xl font-semibold text-[#0F172A]">{value}</p>
      </div>
      <span
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-2xl",
          badgeClass
        )}
      >
        <Icon className="h-6 w-6" />
      </span>
    </div>
  </article>
);

export default function Entradas() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: entradas = [], isLoading } = useEntradas(dateRange);
  const { data: summary } = useEntradasSummary(dateRange);
  const deleteEntrada = useDeleteEntrada();

  const filteredEntradas = entradas.filter(
    (entrada) =>
      entrada.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entrada.categorias?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const header = (
    <header className="flex flex-col gap-6 border-b border-[#E5E7EB] pb-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#94A3B8]">
          Entradas
        </p>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-[#0F172A]">Entradas</h1>
          <p className="text-sm text-[#4B5563]">
            Gerencie todas as suas receitas e ganhos com uma visão clara
          </p>
        </div>
      </div>
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <MonthPicker dateRange={dateRange} onSelect={setDateRange} />
        <EntradaModal
          trigger={
            <Button className="h-12 rounded-2xl bg-[#16A34A] px-6 text-sm font-semibold text-white shadow-[0px_20px_32px_-18px_rgba(22,163,74,0.5)] transition-transform hover:-translate-y-0.5 hover:bg-[#15803D]">
              <Plus className="h-4 w-4" /> Nova Entrada
            </Button>
          }
        />
        <Button
          variant="outline"
          className="h-12 rounded-2xl border-[#CBD5F5] bg-white px-6 text-sm font-semibold text-[#0F172A] shadow-[0px_20px_32px_-24px_rgba(15,23,42,0.16)] transition-transform hover:-translate-y-0.5 hover:bg-[#EEF2FF]"
        >
          <Filter className="h-4 w-4" /> Filtros
        </Button>
      </div>
    </header>
  );

  const filterBar = (
    <section className="surface-card p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <Input
            placeholder="Buscar por descrição ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 rounded-2xl border-[#E5E7EB] bg-white pl-11 text-sm text-[#0F172A] placeholder:text-[#9CA3AF] focus-visible:ring-[#0A84FF]/60"
          />
        </div>
      </div>
    </section>
  );

  const tableSection = (
    <section className="surface-card p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-[#0F172A]">
            Registros de Entradas
          </h2>
          <p className="text-sm text-[#6B7280]">
            Acompanhe suas entradas e ações recentes
          </p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#E5E7EB]">
                <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                  Data
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                  Descrição
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                  Categoria
                </TableHead>
                <TableHead className="text-right text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                  Valor
                </TableHead>
                <TableHead className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntradas.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-sm text-[#6B7280]"
                  >
                    {searchTerm
                      ? "Nenhuma entrada corresponde à busca."
                      : "Nenhuma entrada cadastrada ainda."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredEntradas.map((entrada) => {
                  const { accent: accentColor, style: badgeStyle } =
                    buildCategoryBadgeTokens(
                      entrada.categorias?.cor_hex,
                      DEFAULT_CATEGORY_COLOR
                    );
                  const categoryName =
                    entrada.categorias?.nome || "Sem categoria";
                  return (
                    <TableRow
                      key={entrada.id}
                      className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]"
                    >
                      <TableCell className="whitespace-nowrap text-sm font-semibold text-[#0F172A]">
                        {formatLocalDate(entrada.data)}
                      </TableCell>
                      <TableCell className="max-w-[280px] text-sm text-[#4B5563]">
                        {entrada.descricao}
                      </TableCell>
                      <TableCell className="w-[220px]">
                        <Badge
                          variant="outline"
                          className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0F172A]"
                          style={badgeStyle}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{
                                backgroundColor: accentColor,
                                boxShadow: "0 0 0 4px " + accentColor + "22",
                              }}
                            />
                            <span className="whitespace-nowrap">
                              {categoryName}
                            </span>
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-right text-sm font-semibold text-[#16A34A]">
                        {formatCurrency(entrada.valor)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <EntradaModal
                            mode="edit"
                            entrada={entrada}
                            trigger={
                              <Button
                                variant="ghost"
                                size="sm"
                                aria-label={`Editar ${
                                  entrada.descricao || "entrada"
                                }`}
                                className="h-9 w-9 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] p-0 text-[#2563EB] transition-colors hover:bg-[#DBEAFE]"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                aria-label={`Excluir ${
                                  entrada.descricao || "entrada"
                                }`}
                                className="h-9 w-9 rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-0 text-[#DC2626] transition-colors hover:bg-[#FEE2E2]"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Confirmar exclusão
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza de que deseja excluir esta
                                  entrada? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-[#DC2626] text-white hover:bg-[#B91C1C]"
                                  onClick={() =>
                                    deleteEntrada.mutate(entrada.id)
                                  }
                                >
                                  {deleteEntrada.isPending
                                    ? "Excluindo..."
                                    : "Excluir"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-8">
          <section className="muted-card p-6 sm:p-8">
            {header}
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} className="h-32 rounded-3xl bg-white" />
              ))}
            </div>
            <div className="mt-6 space-y-6">
              <Skeleton className="h-16 rounded-3xl bg-white" />
              <Skeleton className="h-[360px] rounded-3xl bg-white" />
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8">
        <section className="muted-card p-6 sm:p-8">
          {header}

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <SummaryCard
              title="Total de Entradas"
              value={formatCurrency(summary?.total || 0)}
              icon={TrendingUp}
            />
            <SummaryCard
              title="Quantidade"
              value={summary?.count || 0}
              icon={TrendingUp}
              badgeClass="bg-[#EEF2FF] text-[#0A84FF]"
            />
            <SummaryCard
              title="Média por Entrada"
              value={formatCurrency(summary?.average || 0)}
              icon={TrendingUp}
              badgeClass="bg-[#F5F3FF] text-[#7C3AED]"
            />
          </div>

          <div className="mt-8 space-y-6">
            {filterBar}
            {tableSection}
          </div>
        </section>
      </div>
      <Toaster />
    </div>
  );
}
