import { Download, Eye, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BillingRecord {
  id: string;
  plan: string;
  amount: string;
  purchaseDate: string;
  endDate: string;
  status: "active" | "paid" | "pending" | "failed";
}

const MOCK_HISTORY: BillingRecord[] = [
  {
    id: "1",
    plan: "Plano Básico",
    amount: "R$ 29,00",
    purchaseDate: "01/12/2024",
    endDate: "31/12/2024",
    status: "active",
  },
  {
    id: "2",
    plan: "Plano Básico",
    amount: "R$ 29,00",
    purchaseDate: "01/11/2024",
    endDate: "30/11/2024",
    status: "paid",
  },
  {
    id: "3",
    plan: "Plano Básico",
    amount: "R$ 29,00",
    purchaseDate: "01/10/2024",
    endDate: "31/10/2024",
    status: "paid",
  },
  {
    id: "4",
    plan: "Plano Básico",
    amount: "R$ 29,00",
    purchaseDate: "01/09/2024",
    endDate: "30/09/2024",
    status: "paid",
  },
];

const getStatusBadge = (status: BillingRecord["status"]) => {
  switch (status) {
    case "active":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-700">
          Ativo
        </Badge>
      );
    case "paid":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-700">
          Pago
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
          Pendente
        </Badge>
      );
    case "failed":
      return <Badge variant="destructive">Falhou</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const BillingHistory = () => {
  const handleDownload = (id: string) => {
    // Mock: Would download invoice
    console.log("Download invoice:", id);
  };

  const handleView = (id: string) => {
    // Mock: Would open invoice details
    console.log("View invoice:", id);
  };

  const handleExport = () => {
    // Mock: Would export all invoices
    console.log("Export all invoices");
  };

  const handleFilter = () => {
    // Mock: Would open filter modal
    console.log("Open filter");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <CardTitle className="text-lg font-bold">
          Histórico de Pagamentos
        </CardTitle>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar..." className="pl-9" />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={handleFilter}
            aria-label="Filtrar"
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="shrink-0 gap-2"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plano</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data de Compra</TableHead>
                <TableHead>Data de Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_HISTORY.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.plan}</TableCell>
                  <TableCell>{record.amount}</TableCell>
                  <TableCell>{record.purchaseDate}</TableCell>
                  <TableCell>{record.endDate}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDownload(record.id)}
                        className="p-1 text-muted-foreground transition-colors hover:text-foreground"
                        aria-label="Baixar fatura"
                        tabIndex={0}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleDownload(record.id)
                        }
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleView(record.id)}
                        className="p-1 text-muted-foreground transition-colors hover:text-foreground"
                        aria-label="Visualizar fatura"
                        tabIndex={0}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleView(record.id)
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
