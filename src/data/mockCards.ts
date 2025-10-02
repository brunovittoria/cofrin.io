export type MockCard = {
  id: string;
  brand: "Visa" | "Mastercard";
  label: string;
  nickname?: string;
  maskedNumber: string;
  status: "Active" | "Blocked";
  used: number;
  limit: number;
};

export const mockCards: MockCard[] = [
  {
    id: "card-1",
    brand: "Visa",
    label: "Visa Platinum",
    nickname: "Cartao Principal",
    maskedNumber: "**** 6782",
    status: "Active",
    used: 3884,
    limit: 20638,
  },
  {
    id: "card-2",
    brand: "Mastercard",
    label: "Mastercard Black",
    nickname: "Equipe",
    maskedNumber: "**** 2245",
    status: "Active",
    used: 12980,
    limit: 30500,
  },
  {
    id: "card-3",
    brand: "Visa",
    label: "Visa Corporate",
    nickname: "Marketing",
    maskedNumber: "**** 9123",
    status: "Active",
    used: 4620,
    limit: 18000,
  },
];
