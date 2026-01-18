import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { TestimonialsScroller } from "./TestimonialsScroller";

export const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="w-full overflow-hidden py-20 md:py-32">
      <div className="container px-4 md:px-6">
        <SectionHeader />
        <TestimonialsScroller />
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
      Depoimentos
    </Badge>
    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
      Amado por Pessoas no Mundo Todo
    </h2>
    <p className="max-w-[800px] text-muted-foreground md:text-lg">
      Não acredite apenas em nossa palavra. Veja o que nossos clientes têm a
      dizer sobre sua experiência.
    </p>
  </motion.div>
);

