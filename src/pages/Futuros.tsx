import { useState } from "react";
import {
  RefreshCw,
  Plus,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Check,
  X,
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "@/lib/formatters";
import { MonthPicker } from "@/components/pieces/MonthPicker";
import { DateRange } from "react-day-picker";

// Dados mockados - substituir por hooks quando disponível
const mockTransactions = [
  {
    id: "1",
    date: "2025-05-10",
    description: "IPTU Terreno (1/7)",
    category: "IPTU",
    status: "Pendente",
    type: "Saída",
    value: -69.59,
  },
  {
    id: "2",
    date: "2025-05-12",
    description: "Salário mensal",
    category: "Salário",
    status: "Pendente",
    type: "Entrada",
    value: 12000.0,
  },
  {
    id: "3",
    date: "2025-05-15",
    description: "Financiamento do carro parcela 1 de 4",
    category: "Financiamento Carro",
    status: "Pendente",
    type: "Saída",
    value: -1000.0,
  },
];

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

  // Calcular resumos (mockado)
  const aReceber = 12000.0;
  const aPagar = 1069.59;
  const saldoPrevisto = aReceber - aPagar;
  const efetivado = 0.0;

  const filteredTransactions = mockTransactions.filter(
    (transaction) =>
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
        <Button className="h-12 rounded-2xl bg-[#0A84FF] px-6 text-sm font-semibold text-white shadow-[0px_20px_32px_-18px_rgba(10,132,255,0.6)] transition-transform hover:-translate-y-0.5 hover:bg-[#006FDB]">
          <Plus className="h-4 w-4 mr-2" />
          Novo Lançamento
        </Button>
      </div>
    </header>
  );

  const summaryCards = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <SummaryCard
        title="A Receber"
        value={formatCurrency(aReceber)}
        icon={TrendingUp}
        color="text-[#16A34A]"
        badgeClass="bg-[#ECFDF3] text-[#16A34A]"
      />
      <SummaryCard
        title="A Pagar"
        value={formatCurrency(aPagar)}
        icon={TrendingDown}
        color="text-[#DC2626]"
        badgeClass="bg-[#FEF2F2] text-[#DC2626]"
      />
      <SummaryCard
        title="Saldo Previsto"
        value={formatCurrency(saldoPrevisto)}
        icon={DollarSign}
        color="text-[#16A34A]"
        badgeClass="bg-[#ECFDF3] text-[#16A34A]"
      />
      <SummaryCard
        title="Efetivado"
        value={formatCurrency(efetivado)}
        icon={Clock}
        color="text-[#16A34A]"
        badgeClass="bg-[#ECFDF3] text-[#16A34A]"
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
                {filteredTransactions.length === 0 ? (
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
                  filteredTransactions.map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC]"
                    >
                      <TableCell className="whitespace-nowrap text-sm font-semibold text-[#0F172A]">
                        {new Date(transaction.date).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="max-w-[280px] text-sm text-[#4B5563]">
                        {transaction.description}
                      </TableCell>
                      <TableCell className="text-sm text-[#4B5563]">
                        {transaction.category}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7] border-0">
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            transaction.type === "Entrada"
                              ? "text-[#16A34A] font-medium"
                              : "text-[#DC2626] font-medium"
                          }
                        >
                          {transaction.type}
                        </span>
                      </TableCell>
                      <TableCell
                        className={`text-right font-semibold ${
                          transaction.value >= 0
                            ? "text-[#16A34A]"
                            : "text-[#DC2626]"
                        }`}
                      >
                        {transaction.value >= 0 ? "+ " : "- "}
                        {formatCurrency(Math.abs(transaction.value))}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#16A34A] hover:text-[#15803D] hover:bg-[#ECFDF3]"
                            aria-label="Efetivar lançamento"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#DC2626] hover:text-[#B91C1C] hover:bg-[#FEF2F2]"
                            aria-label="Cancelar lançamento"
                          >
                            <X className="h-4 w-4" />
                          </Button>
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
          <div className="mt-4 bg-[#F9FAFB] p-4 rounded-2xl text-center">
            <p className="text-sm font-medium text-[#16A34A]">
              Nenhum Lançamento Efetivado Este Mês
            </p>
          </div>
        </div>
      </div>
    </section>
  );

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
    </div>
  );
}
