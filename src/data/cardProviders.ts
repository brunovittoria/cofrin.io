export type CardProvider = {
  id: string;
  name: string;
  imageUrl: string;
  accentColor?: string;
};

export const cardProviders: CardProvider[] = [
  { id: "nubank", name: "Nubank", imageUrl: "https://rmqxnhrzxtawteelkllh.supabase.co/storage/v1/object/public/imagens/1.png" },
  { id: "itau", name: "Itau", imageUrl: "" },
  { id: "bradesco", name: "Bradesco", imageUrl: "https://ghxhpnjldkcjaeywkskd.supabase.co/storage/v1/object/public/cartoes/3.png" },
  { id: "santander", name: "Santander", imageUrl: "https://ghxhpnjldkcjaeywkskd.supabase.co/storage/v1/object/public/cartoes/5.png" },
  { id: "banco-do-brasil", name: "Banco do Brasil", imageUrl: "https://ghxhpnjldkcjaeywkskd.supabase.co/storage/v1/object/public/cartoes/4.png" },
  { id: "caixa", name: "Caixa Economica", imageUrl: "https://ghxhpnjldkcjaeywkskd.supabase.co/storage/v1/object/public/cartoes/ChatGPT%20Image%2029_09_2025,%2022_39_24.png" },
  { id: "inter", name: "Inter", imageUrl: "https://ghxhpnjldkcjaeywkskd.supabase.co/storage/v1/object/public/cartoes/2.png" },
  { id: "original", name: "Original", imageUrl: "" },
  { id: "next", name: "Next", imageUrl: "" },
  { id: "c6", name: "C6", imageUrl: "https://ghxhpnjldkcjaeywkskd.supabase.co/storage/v1/object/public/cartoes/7.png" },
];

export const defaultCardImagePlaceholder = "";

export const cardProvidersMap = cardProviders.reduce<Record<string, CardProvider>>((acc, provider) => {
  acc[provider.id] = provider;
  return acc;
}, {});
