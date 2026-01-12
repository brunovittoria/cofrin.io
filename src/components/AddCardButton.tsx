import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

export function AddCardButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Button
      type="button"
      className="relative z-10 h-11 rounded-2xl bg-[#0A64F5] px-5 text-sm font-semibold text-white shadow-[0px_20px_36px_-18px_rgba(10,100,245,0.55)] transition-transform hover:-translate-y-0.5 hover:bg-[#094ED1] w-full max-w-[220px]"
      {...props}
    >
      <PlusCircle className="mr-2 h-4 w-4" />
      Adicionar cartao
    </Button>
  );
}
