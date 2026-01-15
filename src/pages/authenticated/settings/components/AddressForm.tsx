import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addressSchema, type AddressFormData } from "@/lib/validations";

interface AddressFormProps {
  defaultValues: AddressFormData;
}

export const AddressForm = ({ defaultValues }: AddressFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    mode: "onChange",
    defaultValues,
  });

  const handleToggleEdit = () => {
    if (isEditing) {
      form.handleSubmit(handleSubmit)();
    } else {
      setIsEditing(true);
    }
  };

  const handleSubmit = (data: AddressFormData) => {
    // Mock: Would send to API
    console.log("Address submitted:", data);
    toast.success("Endereço atualizado com sucesso!");
    setIsEditing(false);
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-bold">Endereço</CardTitle>
        <div className="flex gap-2">
          {isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleEdit}
            className="gap-2"
          >
            <Edit2 className="h-3 w-3" />
            {isEditing ? "Salvar" : "Editar"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium uppercase text-muted-foreground">
                    País
                  </FormLabel>
                  <FormControl>
                    {isEditing ? (
                      <Input {...field} />
                    ) : (
                      <p className="rounded-lg border border-transparent bg-muted/50 p-2 text-sm font-medium">
                        {field.value}
                      </p>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium uppercase text-muted-foreground">
                    Cidade
                  </FormLabel>
                  <FormControl>
                    {isEditing ? (
                      <Input {...field} />
                    ) : (
                      <p className="rounded-lg border border-transparent bg-muted/50 p-2 text-sm font-medium">
                        {field.value}
                      </p>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium uppercase text-muted-foreground">
                    CEP
                  </FormLabel>
                  <FormControl>
                    {isEditing ? (
                      <Input {...field} placeholder="01310-100" />
                    ) : (
                      <p className="rounded-lg border border-transparent bg-muted/50 p-2 text-sm font-medium">
                        {field.value}
                      </p>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
