export const formatCurrency = (value: number) =>
  "R$ " + value.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
