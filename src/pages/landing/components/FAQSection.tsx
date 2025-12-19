import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "O cofrin.io é realmente grátis para usar?",
    answer:
      "Sim! Nosso plano gratuito inclui até 50 transações por mês, análises básicas e 3 categorias. É perfeito para começar com rastreamento de finanças pessoais. Você pode fazer upgrade para Premium para transações ilimitadas e recursos avançados.",
  },
  {
    question: "Quão seguro são meus dados financeiros?",
    answer:
      "Levamos a segurança muito a sério. Todos os dados são criptografados tanto em trânsito quanto em repouso usando criptografia padrão da indústria. Nunca armazenamos suas senhas ou credenciais de conta bancária. Seus dados são seus e nunca os vendemos para terceiros.",
  },
  {
    question: "Posso rastrear múltiplos cartões de crédito?",
    answer:
      "Sim! Com o plano Premium, você pode registrar e rastrear múltiplos cartões de crédito, monitorar seus limites, uso e datas de vencimento, tudo em um só lugar. A visualização visual do cartão facilita ver todos os seus cartões rapidamente.",
  },
  {
    question: "O cofrin.io conecta à minha conta bancária?",
    answer:
      "Atualmente, o cofrin.io requer entrada manual de transações para dar a você controle completo sobre seus dados. Estamos trabalhando em integrações bancárias para lançamentos futuros, mas por enquanto, você adiciona transações você mesmo, o que leva apenas segundos.",
  },
  {
    question: "Posso exportar meus dados financeiros?",
    answer:
      "Sim! Todos os planos permitem que você exporte seu histórico de transações. O plano Família inclui opções de exportação personalizadas com filtragem e formatação avançadas para atender suas necessidades específicas.",
  },
  {
    question:
      "O que torna o cofrin.io diferente de outros aplicativos de finanças?",
    answer:
      "O cofrin.io foca em simplicidade e design bonito. Não sobrecarregamos você com recursos complexos - apenas o essencial apresentado em uma interface limpa e intuitiva. Além disso, somos construídos especificamente para o mercado brasileiro com suporte a moeda local.",
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="w-full py-20 md:py-32">
      <div className="container px-4 md:px-6">
        <SectionHeader />
        <FAQAccordion />
      </div>
    </section>
  );
};

const SectionHeader = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="mb-12 flex flex-col items-center justify-center space-y-4 text-center"
  >
    <Badge
      className="rounded-full px-4 py-1.5 text-sm font-medium"
      variant="secondary"
    >
      FAQ
    </Badge>
    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
      Perguntas Frequentes
    </h2>
    <p className="max-w-[800px] text-muted-foreground md:text-lg">
      Encontre respostas para perguntas comuns sobre cofrin.io.
    </p>
  </motion.div>
);

const FAQAccordion = () => (
  <div className="mx-auto max-w-3xl">
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, i) => (
        <FAQItem key={i} faq={faq} index={i} />
      ))}
    </Accordion>
  </div>
);

type FAQItemProps = {
  faq: {
    question: string;
    answer: string;
  };
  index: number;
};

const FAQItem = ({ faq, index }: FAQItemProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
  >
    <AccordionItem
      value={`item-${index}`}
      className="border-b border-border/40 py-2"
    >
      <AccordionTrigger className="text-left font-medium hover:no-underline">
        {faq.question}
      </AccordionTrigger>
      <AccordionContent className="text-pretty text-muted-foreground">
        {faq.answer}
      </AccordionContent>
    </AccordionItem>
  </motion.div>
);

