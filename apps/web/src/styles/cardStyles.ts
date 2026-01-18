export const brandStyles = {
  Visa: {
    badge: "bg-[#0A84FF]/10 text-[#0A84FF]",
  },
  Mastercard: {
    badge: "bg-[#F97316]/10 text-[#EA580C]",
  },
  Elo: {
    badge: "bg-[#6366F1]/10 text-[#4F46E5]",
  },
  "American Express": {
    badge: "bg-[#2DD4BF]/10 text-[#0D9488]",
  },
  Hipercard: {
    badge: "bg-[#FCA5A5]/10 text-[#DC2626]",
  },
} as const;

export const getStatusStyles = (percentual: number) => {
  if (percentual >= 95) {
    return {
      label: "Proximo do limite",
      className: "bg-[#FEF2F2] text-[#DC2626]",
    };
  }
  if (percentual >= 70) {
    return {
      label: "Uso intenso",
      className: "bg-[#FFF7ED] text-[#EA580C]",
    };
  }
  return {
    label: "Ativo",
    className: "bg-[#F5F3FF] text-[#7C3AED]",
  };
};

