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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  personalInfoSchema,
  type PersonalInfoFormData,
} from "@/lib/validations";

interface PersonalInfoFormProps {
  defaultValues: PersonalInfoFormData & { email: string };
}

export const PersonalInfoForm = ({ defaultValues }: PersonalInfoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    mode: "onChange",
    defaultValues: {
      firstName: defaultValues.firstName,
      lastName: defaultValues.lastName,
      birthDate: defaultValues.birthDate,
      phone: defaultValues.phone,
    },
  });

  const handleToggleEdit = () => {
    if (isEditing) {
      form.handleSubmit(handleSubmit)();
    } else {
      setIsEditing(true);
    }
  };

  const handleSubmit = (data: PersonalInfoFormData) => {
    // Mock: Would send to API
    console.log("Personal info submitted:", data);
    toast.success("Informações pessoais atualizadas com sucesso!");
    setIsEditing(false);
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-bold">
          Informações Pessoais
        </CardTitle>
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
            className="gap-2 text-primary hover:bg-primary/10 hover:text-primary"
          >
            <Edit2 className="h-3 w-3" />
            {isEditing ? "Salvar" : "Editar"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium uppercase text-muted-foreground">
                    Nome
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
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium uppercase text-muted-foreground">
                    Sobrenome
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
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium uppercase text-muted-foreground">
                    Data de Nascimento
                  </FormLabel>
                  <FormControl>
                    {isEditing ? (
                      <Input type="date" {...field} />
                    ) : (
                      <p className="rounded-lg border border-transparent bg-muted/50 p-2 text-sm font-medium">
                        {field.value
                          ? new Date(field.value).toLocaleDateString("pt-BR")
                          : "-"}
                      </p>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase text-muted-foreground">
                Email
              </label>
              <p className="cursor-not-allowed rounded-lg border border-border bg-muted p-2 text-sm font-medium text-muted-foreground">
                {defaultValues.email}
              </p>
              <FormDescription className="text-xs italic">
                O email não pode ser alterado por questões de segurança. Entre em contato com o suporte se precisar modificá-lo.
              </FormDescription>
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium uppercase text-muted-foreground">
                    Telefone
                  </FormLabel>
                  <FormControl>
                    {isEditing ? (
                      <Input {...field} placeholder="(11) 98765-4321" />
                    ) : (
                      <p className="rounded-lg border border-transparent bg-muted/50 p-2 text-sm font-medium">
                        {field.value || "-"}
                      </p>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase text-muted-foreground">
                Tipo de Usuário
              </label>
              <div className="p-2">
                <Badge className="bg-primary/10 text-primary">
                  Usuário Premium
                </Badge>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
