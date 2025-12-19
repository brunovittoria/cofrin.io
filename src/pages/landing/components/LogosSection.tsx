export const LogosSection = () => {
  return (
    <section className="w-full border-y bg-muted/30 py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Confiado por milhares assumindo o controle de suas finanças
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex h-8 w-24 items-center justify-center rounded-md bg-muted/50 text-xs font-medium text-muted-foreground opacity-70 transition-all hover:opacity-100"
              >
                Logo {i}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

