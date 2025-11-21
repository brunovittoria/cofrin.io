import { useState } from "react";
import {
  RefreshCw,
  Plus,
  Check,
  X,
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatLocalDate } from "@/lib/formatters";
import { MonthPicker } from "@/components/MonthPicker";
import { DateRange } from "react-day-picker";
import { LancamentoFuturoModal } from "@/components/dialogs/launch-modal";
import { Toaster } from "@/components/ui/toaster";
import {
  useLancamentosFuturos,
  useLancamentosFuturosSummary,
  useEfetivarLancamentoFuturo,
  useDeleteLancamentoFuturo,
} from "@/hooks/api/useLancamentosFuturos";
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

const SummaryCard = ({
  title,
  value,
  icon: Icon,
  color = "text-[#16A34A]",
  badgeClass = "bg-[#ECFDF3] text-[#16A34A]",
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  color?: string;
  badgeClass?: string;
}) => (
  <Card className="h-full">
    <CardContent className="p-6 flex flex-col justify-between h-full">
      <h3 className="text-sm font-medium text-[#6B7280] mb-3">{title}</h3>
      <div className="flex items-center justify-between">
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${badgeClass}`}
        >
          <Icon className="h-6 w-6" />
        </span>
      </div>
    </CardContent>
  </Card>
);

export default function Futuros() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const { data: lancamentosPendentes = [], isLoading: loadingPendentes } =
    useLancamentosFuturos(dateRange, "pendente");
  const { data: lancamentosEfetivados = [], isLoading: loadingEfetivados } =
    useLancamentosFuturos(dateRange, "efetivado");
  const { data: summary } = useLancamentosFuturosSummary(dateRange);
  const efetivarLancamento = useEfetivarLancamentoFuturo();
  const deleteLancamento = useDeleteLancamentoFuturo();

  const filteredPendentes = lancamentosPendentes.filter(
    (lancamento) =>
      lancamento.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lancamento.categorias?.nome
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleRefresh = () => {
    window.location.reload();
  };

  const header = (
    <header className="flex flex-col gap-6 border-b border-[#E5E7EB] pb-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#94A3B8]">
          Lançamentos Futuros
        </p>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-[#0F172A]">
            Lançamentos Futuros
          </h1>
          <p className="text-sm text-[#4B5563]">
            Gerencie todos os lançamentos previstos com uma visão clara
          </p>
        </div>
      </div>
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <Button
          variant="outline"
          className="h-12 rounded-2xl border-[#CBD5F5] bg-white px-6 text-sm font-semibold text-[#0F172A] shadow-[0px_20px_32px_-24px_rgba(15,23,42,0.16)] transition-transform hover:-translate-y-0.5 hover:bg-[#EEF2FF]"
          onClick={handleRefresh}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
        <LancamentoFuturoModal
          trigger={
            <Button className="h-12 rounded-2xl bg-[#0A84FF] px-6 text-sm font-semibold text-white shadow-[0px_20px_32px_-18px_rgba(10,132,255,0.6)] transition-transform hover:-translate-y-0.5 hover:bg-[#006FDB]">
              <Plus className="h-4 w-4 mr-2" />
              Novo Lançamento
            </Button>
          }
        />
      </div>
    </header>
  );

  const summaryCards = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <SummaryCard
        title="A Receber"
        value={formatCurrency(summary?.aReceber || 0)}
        icon={TrendingUp}
        color="text-[#16A34A]"
        badgeClass="bg-[#ECFDF3] text-[#16A34A]"
      />
      <SummaryCard
        title="A Pagar"
        value={formatCurrency(summary?.aPagar || 0)}
        icon={TrendingDown}
        color="text-[#DC2626]"
        badgeClass="bg-[#FEF2F2] text-[#DC2626]"
      />
      <SummaryCard
        title="Saldo Previsto"
        value={formatCurrency(summary?.saldoPrevisto || 0)}
        icon={DollarSign}
        color={
          (summary?.saldoPrevisto || 0) >= 0
            ? "text-[#16A34A]"
            : "text-[#DC2626]"
        }
        badgeClass={
          (summary?.saldoPrevisto || 0) >= 0
            ? "bg-[#ECFDF3] text-[#16A34A]"
            : "bg-[#FEF2F2] text-[#DC2626]"
        }
      />
      <SummaryCard
        title="Efetivado"
        value={formatCurrency(summary?.efetivado || 0)}
        icon={Clock}
        color={
          (summary?.efetivado || 0) >= 0 ? "text-[#16A34A]" : "text-[#DC2626]"
        }
        badgeClass={
          (summary?.efetivado || 0) >= 0
            ? "bg-[#ECFDF3] text-[#16A34A]"
            : "bg-[#FEF2F2] text-[#DC2626]"
        }
      />
    </div>
  );

  const tableSection = (
    <section className="surface-card p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#0F172A]">
              Lista de Lançamentos Futuros
            </h2>
            <p className="text-sm text-[#6B7280]">
              Gerenciamento de todos os lançamentos previstos
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-md font-semibold text-[#0F172A] mb-3">
            Lançamentos Pendentes
          </h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#E5E7EB]">
                  <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                    Data Prevista
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                    Descrição
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                    Categoria
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                    Tipo
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
                {filteredPendentes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-10 text-center text-sm text-[#6B7280]"
                    >
                      {searchTerm
                        ? "Nenhum lançamento corresponde à busca."
                        : "Nenhum lançamento pendente cadastrado ainda."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPendentes.map((lancamento) => (
                    <TableRow
                      key={lancamento.id}
                      className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]"
                    >
                      <TableCell className="whitespace-nowrap text-sm font-semibold text-[#0F172A]">
                        {formatLocalDate(lancamento.data)}
                      </TableCell>
                      <TableCell className="max-w-[280px] text-sm text-[#4B5563]">
                        {lancamento.descricao}
                      </TableCell>
                      <TableCell className="text-sm text-[#4B5563]">
                        {lancamento.categorias?.nome || "Sem categoria"}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7] border-0">
                          Pendente
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            lancamento.tipo === "entrada"
                              ? "text-[#16A34A] font-medium"
                              : "text-[#DC2626] font-medium"
                          }
                        >
                          {lancamento.tipo === "entrada" ? "Entrada" : "Saída"}
                        </span>
                      </TableCell>
                      <TableCell
                        className={`text-right font-semibold ${
                          lancamento.tipo === "entrada"
                            ? "text-[#16A34A]"
                            : "text-[#DC2626]"
                        }`}
                      >
                        {lancamento.tipo === "entrada" ? "+ " : "- "}
                        {formatCurrency(lancamento.valor)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <LancamentoFuturoModal
                            mode="edit"
                            lancamento={lancamento}
                            trigger={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-[#0A84FF] hover:text-[#006FDB] hover:bg-[#EEF2FF]"
                                aria-label="Editar lançamento"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#16A34A] hover:text-[#15803D] hover:bg-[#ECFDF3]"
                            aria-label="Efetivar lançamento"
                            onClick={() =>
                              efetivarLancamento.mutate(lancamento.id)
                            }
                            disabled={efetivarLancamento.isPending}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-[#DC2626] hover:text-[#B91C1C] hover:bg-[#FEF2F2]"
                                aria-label="Excluir lançamento"
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
                                  Tem certeza de que deseja excluir este
                                  lançamento? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-[#DC2626] text-white hover:bg-[#B91C1C]"
                                  onClick={() =>
                                    deleteLancamento.mutate(lancamento.id)
                                  }
                                >
                                  {deleteLancamento.isPending
                                    ? "Excluindo..."
                                    : "Excluir"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-md font-semibold text-[#0F172A] mb-3">
            Lançamentos Efetivados
          </h3>
          {lancamentosEfetivados.length === 0 ? (
            <div className="mt-4 bg-[#F9FAFB] p-4 rounded-2xl text-center">
              <p className="text-sm font-medium text-[#16A34A]">
                Nenhum Lançamento Efetivado Este Mês
              </p>
            </div>
          ) : (
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
                    <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                      Tipo
                    </TableHead>
                    <TableHead className="text-right text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                      Valor
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lancamentosEfetivados.map((lancamento) => (
                    <TableRow
                      key={lancamento.id}
                      className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]"
                    >
                      <TableCell className="whitespace-nowrap text-sm font-semibold text-[#0F172A]">
                        {formatLocalDate(lancamento.data)}
                      </TableCell>
                      <TableCell className="max-w-[280px] text-sm text-[#4B5563]">
                        {lancamento.descricao}
                      </TableCell>
                      <TableCell className="text-sm text-[#4B5563]">
                        {lancamento.categorias?.nome || "Sem categoria"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            lancamento.tipo === "entrada"
                              ? "text-[#16A34A] font-medium"
                              : "text-[#DC2626] font-medium"
                          }
                        >
                          {lancamento.tipo === "entrada" ? "Entrada" : "Saída"}
                        </span>
                      </TableCell>
                      <TableCell
                        className={`text-right font-semibold ${
                          lancamento.tipo === "entrada"
                            ? "text-[#16A34A]"
                            : "text-[#DC2626]"
                        }`}
                      >
                        {lancamento.tipo === "entrada" ? "+ " : "- "}
                        {formatCurrency(lancamento.valor)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </section>
  );

  if (loadingPendentes || loadingEfetivados) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-8">
          <section className="muted-card p-6 sm:p-8">
            {header}
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
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
          <MonthPicker
            dateRange={dateRange}
            onSelect={setDateRange}
            className="mt-2"
          />
          <div className="mt-8 space-y-6">
            {summaryCards}
            {tableSection}
          </div>
        </section>
      </div>
      <Toaster />
    </div>
  );
}
