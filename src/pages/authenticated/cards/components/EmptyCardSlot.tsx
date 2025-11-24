export const EmptyCardSlot = () => {
  return (
    <article className="flex h-full flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-[#C7D2FE] bg-white p-6 text-center text-sm text-[#6B7280] shadow-[0px_20px_36px_-30px_rgba(10,100,245,0.35)]">
      <div className="flex aspect-[16/10] w-full items-center justify-center rounded-[28px] border border-dashed border-[#C7D2FE]/70 bg-[#EEF2FF]/40 text-xs font-semibold uppercase tracking-[0.3em] text-[#6B7280]">
        Espaco reservado
      </div>
      <p>Adicione um novo cartao para ocupar este espaco.</p>
    </article>
  );
};

