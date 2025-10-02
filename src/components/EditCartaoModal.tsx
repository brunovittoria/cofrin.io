
import { type ReactNode, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cardProviders, cardProvidersMap } from "@/data/cardProviders";

const bandeiras = ["Visa", "Mastercard", "Elo", "American Express", "Hipercard"] as const;

const labelClass = "text-xs font-medium text-[#475569]";
const inputClass =
  "h-10 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] placeholder:text-[#9CA3AF] focus-visible:ring-[#0A84FF]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white";
const metricBoxClass =
  "rounded-lg border border-dashed border-[#CBD5F5] bg-[#F8FAFF] px-3 py-2 text-sm text-[#475569]";

export function EditCartaoModal({ open, setOpen, cartao, onSave, isSaving }: {
  open: boolean;
  setOpen: (open: boolean) => void;
  cartao: any;
  onSave: (data: any) => void;
  isSaving?: boolean;
}) {
  const [formData, setFormData] = useState({ ...cartao });

  const limiteNumber = useMemo(() => Number(formData.limite_total) || 0, [formData.limite_total]);
  const utilizadoNumber = useMemo(() => Number(formData.valor_utilizado) || 0, [formData.valor_utilizado]);
  const selectedProvider = formData.emissor ? cardProvidersMap[formData.emissor] : undefined;

  const valorDisponivel = Math.max(limiteNumber - utilizadoNumber, 0);
  const usoPercentual = limiteNumber > 0 ? Math.min((utilizadoNumber / limiteNumber) * 100, 999) : 0;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave({
      ...formData,
      id: formData.id,
      nome_exibicao: formData.nome_exibicao,
      apelido: formData.apelido || null,
      bandeira: formData.bandeira || null,
      final_cartao: formData.final_cartao || null,
      limite_total: limiteNumber,
      valor_utilizado: utilizadoNumber,
      valor_disponivel: Math.max(limiteNumber - utilizadoNumber, 0),
      uso_percentual: limiteNumber > 0 ? (utilizadoNumber / limiteNumber) * 100 : 0,
      emissor: formData.emissor || null,
      imagem_url: formData.imagem_url || null,
      criado_em: formData.criado_em || null,
      is_principal: formData.is_principal || false,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-2xl rounded-2xl px-6 py-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg font-semibold text-[#0F172A]">
            Editar cartao
          </DialogTitle>
          <DialogDescription className="text-sm text-[#6B7280]">
            Altere os dados do cartão e salve para atualizar no sistema.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="mt-5 flex flex-col gap-5"
        >
          <div className="flex-1 min-w-0 grid gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="nome_exibicao" className={labelClass}>
                  Nome de exibicao
                </Label>
                <Input
                  id="nome_exibicao"
                  placeholder="Visa Platinum"
                  value={formData.nome_exibicao}
                  onChange={(event) => setFormData((prev) => ({ ...prev, nome_exibicao: event.target.value }))}
                  required
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="apelido" className={labelClass}>
                  Apelido (opcional)
                </Label>
                <Input
                  id="apelido"
                  placeholder="Cartao principal"
                  value={formData.apelido}
                  onChange={(event) => setFormData((prev) => ({ ...prev, apelido: event.target.value }))}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label className={labelClass}>Banco / emissor</Label>
                <Select value={formData.emissor} onValueChange={(value) => setFormData((prev) => ({ ...prev, emissor: value }))}>
                  <SelectTrigger className={inputClass}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] shadow-[0_14px_32px_-24px_rgba(10,132,255,0.24)]">
                    {cardProviders.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id} className="text-sm text-[#0F172A] focus:bg-[#EEF2FF]">
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className={labelClass}>Bandeira</Label>
                <Select value={formData.bandeira} onValueChange={(value) => setFormData((prev) => ({ ...prev, bandeira: value }))}>
                  <SelectTrigger className={inputClass}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] shadow-[0_14px_32px_-24px_rgba(10,132,255,0.24)]">
                    {bandeiras.map((option) => (
                      <SelectItem key={option} value={option} className="text-sm text-[#0F172A] focus:bg-[#EEF2FF]">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="final_cartao" className={labelClass}>
                  Final do cartao
                </Label>
                <Input
                  id="final_cartao"
                  placeholder="6782"
                  value={formData.final_cartao}
                  maxLength={4}
                  onChange={(event) => {
                    const onlyDigits = event.target.value.replace(/[^0-9]/g, "").slice(0, 4);
                    setFormData((prev) => ({ ...prev, final_cartao: onlyDigits }));
                  }}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="limite_total" className={labelClass}>
                  Limite total
                </Label>
                <Input
                  id="limite_total"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0,00"
                  value={formData.limite_total}
                  onChange={(event) => setFormData((prev) => ({ ...prev, limite_total: event.target.value }))}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="valor_utilizado" className={labelClass}>
                  Valor utilizado
                </Label>
                <Input
                  id="valor_utilizado"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0,00"
                  value={formData.valor_utilizado}
                  onChange={(event) => setFormData((prev) => ({ ...prev, valor_utilizado: event.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex justify-start md:justify-end md:pt-1">
                <div className="w-[132px] overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
                  {selectedProvider?.imageUrl ? (
                    <img
                      src={selectedProvider.imageUrl}
                      alt={selectedProvider.name}
                      className="aspect-[5/3] w-full object-contain p-2"
                    />
                  ) : (
                    <div className="aspect-[5/3] w-full bg-[#EEF2FF]" />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:col-span-2">
                <div className={metricBoxClass}>
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#6B7280]">Disponivel</p>
                  <p className="text-lg font-semibold text-[#0F172A]">
                    R$ {valorDisponivel.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className={metricBoxClass}>
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#6B7280]">Uso</p>
                  <p className="text-lg font-semibold text-[#0F172A]">{usoPercentual.toFixed(2)}%</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                className="h-9 rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm font-medium text-[#0F172A] hover:bg-[#F3F4F6]"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="brand-cta-luxe h-9 rounded-lg px-5 text-sm font-semibold"
                disabled={isSaving}
              >
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
