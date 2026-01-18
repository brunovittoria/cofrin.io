import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const labelClass = "text-xs font-medium text-[#475569]";
const inputClass =
  "h-10 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] placeholder:text-[#9CA3AF] focus-visible:ring-[#0A84FF]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

interface CardBasicFieldsProps {
  nomeExibicao: string;
  apelido: string;
  onNomeExibicaoChange: (value: string) => void;
  onApelidoChange: (value: string) => void;
}

export const CardBasicFields = ({
  nomeExibicao,
  apelido,
  onNomeExibicaoChange,
  onApelidoChange,
}: CardBasicFieldsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="nome_exibicao" className={labelClass}>
          Nome de exibicao
        </Label>
        <Input
          id="nome_exibicao"
          placeholder="Visa Platinum"
          value={nomeExibicao}
          onChange={(event) => onNomeExibicaoChange(event.target.value)}
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
          value={apelido}
          onChange={(event) => onApelidoChange(event.target.value)}
          className={inputClass}
        />
      </div>
    </div>
  );
};

