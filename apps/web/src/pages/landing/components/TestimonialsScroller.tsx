import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const SCROLL_SPEED = 30; // seconds to complete one loop

const testimonials = [
  {
    quote:
      "O cofrin.io transformou como gerencio minhas finanças pessoais. Os recursos de visualização me ajudaram a economizar R$500 por mês.",
    author: "Ana Silva",
    role: "Professora, São Paulo",
    rating: 5,
  },
  {
    quote:
      "O painel de análises fornece insights que nunca tive acesso antes. Me ajudou a tomar decisões financeiras baseadas em dados.",
    author: "Carlos Santos",
    role: "Empreendedor, Rio de Janeiro",
    rating: 5,
  },
  {
    quote:
      "O suporte ao cliente é excepcional. Sempre que tive algum problema, a equipe foi rápida para responder e resolver. Não poderia pedir melhor serviço.",
    author: "Fernanda Oliveira",
    role: "Gerente de Projetos, Brasília",
    rating: 5,
  },
  {
    quote:
      "Experimentamos várias soluções similares, mas nenhuma se compara à facilidade de uso e recursos abrangentes do cofrin.io. Mudou o jogo para mim.",
    author: "Rafael Costa",
    role: "Designer, Belo Horizonte",
    rating: 5,
  },
  {
    quote:
      "A gestão de cartões de crédito facilitou muito rastrear meus limites e gastos. Agora eu nunca estouro meu orçamento.",
    author: "Juliana Ferreira",
    role: "Advogada, Curitiba",
    rating: 5,
  },
  {
    quote:
      "A implementação foi perfeita e o retorno foi quase imediato. Reduzi meus custos operacionais em 30% desde que comecei a usar o cofrin.io.",
    author: "Pedro Almeida",
    role: "Contador, Porto Alegre",
    rating: 5,
  },
  {
    quote:
      "As categorias personalizadas e gráficos de pizza me ajudam a ver exatamente para onde meu dinheiro está indo. Economizei muito mais desde que comecei.",
    author: "Marina Ribeiro",
    role: "Médica, Recife",
    rating: 5,
  },
  {
    quote:
      "Melhor investimento que fiz este ano. A plataforma se paga com o tempo e recursos que me economiza todos os dias.",
    author: "Lucas Martins",
    role: "Engenheiro, Fortaleza",
    rating: 5,
  },
];

type TestimonialCardProps = {
  author: string;
  role: string;
  quote: string;
  rating: number;
};

const TestimonialCard = ({
  author,
  role,
  quote,
  rating,
}: TestimonialCardProps) => {
  return (
    <Card className="h-full border-border/40 bg-accent/20 transition-all duration-300 hover:scale-105 hover:shadow-lg">
      <CardContent className="pt-6">
        <div className="mb-4 flex items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating
                  ? "fill-yellow-500 text-yellow-500"
                  : "text-muted-foreground"
              }`}
            />
          ))}
        </div>
        <p className="mb-4 text-sm text-muted-foreground">{quote}</p>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://i.pravatar.cc/32?u=${author}`} />
            <AvatarFallback>{author.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium">{author}</div>
            <div className="text-xs text-muted-foreground">{role}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const TestimonialsScroller = () => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setScrollHeight(containerRef.current.scrollHeight / 2);
    }
  }, []);

  return (
    <div
      className="relative h-[400px] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={containerRef}
        className="testimonial-scroll"
        style={{
          animationPlayState: isHovered ? "paused" : "running",
          animationDuration: `${SCROLL_SPEED}s`,
          transform: `translateY(-${scrollHeight}px)`,
        }}
      >
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, i) => (
            <TestimonialCard key={i} {...testimonial} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, i) => (
            <TestimonialCard key={i + testimonials.length} {...testimonial} />
          ))}
        </div>
      </div>
    </div>
  );
};

