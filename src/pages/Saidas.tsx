import { useState, type CSSProperties } from "react";
import { type LucideIcon, Plus, Search, Filter, Edit, Trash2, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SaidaModal } from "@/components/SaidaModal";
import { Toaster } from "@/components/ui/toaster";
import { useSaidas, useSaidasSummary, useDeleteSaida } from "@/hooks/useSaidas";
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
import { cn } from "@/lib/utils";

const DEFAULT_CATEGORY_COLOR = "#ef4444";

const sanitizeHexColor = (hex: string | null | undefined, fallback: string): string => {
  if (!hex) return fallback;
  const normalized = hex.trim();
  return /^#([0-9a-f]{3}){1,2}$/i.test(normalized) ? normalized : fallback;
};

const buildCategoryBadgeTokens = (hex: string | null | undefined, fallback: string) => {
  const color = sanitizeHexColor(hex, fallback);
  const style: CSSProperties = {
    background: color + "12",
    borderColor: color + "33",
    boxShadow: "0 6px 18px " + color + "1f",
  };
  return { accent: color, style };
};

const formatCurrency = (value: number) =>
  "R$ " + value.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

const SummaryCard = ({
  title,
  value,
  icon: Icon,
  badgeClass = "bg-[#FEF2F2] text-[#DC2626]",
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
      <span className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", badgeClass)}>
        <Icon className="h-6 w-6" />
      </span>
    </div>
  </article>
);

export default function Saidas() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: saidas = [], isLoading } = useSaidas();
  const { data: summary } = useSaidasSummary();
  const deleteSaida = useDeleteSaida();

  const filteredSaidas = saidas.filter((saida) =>
    saida.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    saida.categorias?.nome?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const header = (
    <header className="flex flex-col gap-6 border-b border-[#E5E7EB] pb-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#94A3B8]">Saídas</p>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-[#0F172A]">Saídas</h1>
          <p className="text-sm text-[#4B5563]">Controle total dos gastos e despesas da sua operação</p>
        </div>
      </div>
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <SaidaModal
          trigger={
            <Button className="h-12 rounded-2xl bg-[#DC2626] px-6 text-sm font-semibold text-white shadow-[0px_20px_32px_-18px_rgba(220,38,38,0.45)] transition-transform hover:-translate-y-0.5 hover:bg-[#B91C1C]">
              <Plus className="h-4 w-4" /> Nova Saída
            </Button>
          }
        />
        <Button
          variant="outline"
          className="h-12 rounded-2xl border-[#CBD5F5] bg-white px-6 text-sm font-semibold text-[#0F172A] shadow-[0px_20px_32px_-24px_rgba(15,23,42,0.16)] transition-transform hover:-translate-y-0.5 hover:bg-[#FEE2E2]"
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
            className="h-12 rounded-2xl border-[#E5E7EB] bg-white pl-11 text-sm text-[#0F172A] placeholder:text-[#9CA3AF] focus-visible:ring-[#DC2626]/40"
          />
        </div>
      </div>
    </section>
  );

  const tableSection = (
    <section className="surface-card p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-[#0F172A]">Registros de Saídas</h2>
          <p className="text-sm text-[#6B7280]">Revise despesas e monitore os gastos recorrentes</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#E5E7EB]">
                <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">Data</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">Descrição</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">Categoria</TableHead>
                <TableHead className="text-right text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">Valor</TableHead>
                <TableHead className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSaidas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-sm text-[#6B7280]">
                    {searchTerm ? "Nenhuma saída corresponde à busca." : "Nenhuma saída cadastrada ainda."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredSaidas.map((saida) => {
                  const { accent: accentColor, style: badgeStyle } = buildCategoryBadgeTokens(
                    saida.categorias?.cor_hex,
                    DEFAULT_CATEGORY_COLOR,
                  );
                  const categoryName = saida.categorias?.nome || "Sem categoria";
                  return (
                    <TableRow key={saida.id} className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#FEF2F2]">
                      <TableCell className="whitespace-nowrap text-sm font-semibold text-[#0F172A]">
                        {new Date(saida.data).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="max-w-[280px] text-sm text-[#4B5563]">
                        {saida.descricao}
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
                              style={{ backgroundColor: accentColor, boxShadow: "0 0 0 4px " + accentColor + "22" }}
                            />
                            <span className="whitespace-nowrap">{categoryName}</span>
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-right text-sm font-semibold text-[#DC2626]">
                        {formatCurrency(saida.valor)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <SaidaModal
                            mode="edit"
                            saida={saida}
                            trigger={
                              <Button
                                variant="ghost"
                                size="sm"
                                aria-label={`Editar ${saida.descricao || "saída"}`}
                                className="h-9 w-9 rounded-xl border border-[#FB923C] bg-[#FFF7ED] p-0 text-[#EA580C] transition-colors hover:bg-[#FFEAD5]"
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
                                aria-label={`Excluir ${saida.descricao || "saída"}`}
                                className="h-9 w-9 rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-0 text-[#DC2626] transition-colors hover:bg-[#FEE2E2]"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza de que deseja excluir esta saída? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-[#DC2626] text-white hover:bg-[#B91C1C]"
                                  onClick={() => deleteSaida.mutate(saida.id)}
                                >
                                  {deleteSaida.isPending ? "Excluindo..." : "Excluir"}
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
            <SummaryCard title="Total de Saídas" value={formatCurrency(summary?.total || 0)} icon={TrendingDown} />
            <SummaryCard
              title="Quantidade"
              value={summary?.count || 0}
              icon={TrendingDown}
              badgeClass="bg-[#FFF7ED] text-[#EA580C]"
            />
            <SummaryCard
              title="Média por Saída"
              value={formatCurrency(summary?.average || 0)}
              icon={TrendingDown}
              badgeClass="bg-[#FEE2E2] text-[#DC2626]"
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
