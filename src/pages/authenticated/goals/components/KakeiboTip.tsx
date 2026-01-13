import { Card, CardContent } from "@/components/ui/card";

const tips = [
  {
    title: "Dica Kakeibo da Semana",
    content:
      '"Se você não pode comprar à vista, talvez não deva comprar agora." Tente adiar compras não essenciais por 30 dias. Se o desejo persistir, planeje a compra.',
  },
  {
    title: "Reflexão Kakeibo",
    content:
      "Antes de gastar, pergunte-se: Eu realmente preciso disso? Posso viver sem? Vou usar com frequência? Tenho espaço para isso?",
  },
  {
    title: "Sabedoria Kakeibo",
    content:
      "Pequenas economias diárias criam grandes reservas. O café de R$10 por dia são R$300 por mês e R$3.600 por ano.",
  },
  {
    title: "Mentalidade Kakeibo",
    content:
      "O objetivo não é se privar, mas fazer escolhas conscientes. Gaste com o que realmente importa para você.",
  },
];

export const KakeiboTip = () => {
  // Get a random tip based on the day of the week
  const today = new Date();
  const tipIndex = today.getDay() % tips.length;
  const tip = tips[tipIndex];

  return (
    <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
      <CardContent className="p-6">
        <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
          {tip.title}
        </h3>
        <p className="text-sm text-blue-800 dark:text-blue-200">{tip.content}</p>
      </CardContent>
    </Card>
  );
};
