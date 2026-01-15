import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/lib/validations";

const getPasswordStrength = (password: string) => {
  if (password.length === 0) {
    return { strength: 0, label: "", color: "" };
  }
  if (password.length < 6) {
    return { strength: 25, label: "Fraca", color: "text-destructive" };
  }
  if (password.length < 10) {
    return { strength: 50, label: "Média", color: "text-yellow-600" };
  }
  if (password.length < 14) {
    return { strength: 75, label: "Boa", color: "text-primary" };
  }
  return { strength: 100, label: "Forte", color: "text-green-600" };
};

export const PasswordForm = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const watchedNewPassword = form.watch("newPassword");
  const watchedConfirmPassword = form.watch("confirmPassword");
  const passwordStrength = getPasswordStrength(watchedNewPassword);
  const passwordsMatch =
    watchedNewPassword === watchedConfirmPassword && watchedNewPassword.length > 0;

  const handleSubmit = (data: ChangePasswordFormData) => {
    // Mock: Would send to API
    console.log("Password change submitted:", data);
    toast.success("Senha alterada com sucesso!");
    form.reset();
  };

  const PasswordToggleButton = ({
    show,
    onToggle,
  }: {
    show: boolean;
    onToggle: () => void;
  }) => (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
      tabIndex={0}
      aria-label={show ? "Ocultar senha" : "Mostrar senha"}
    >
      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">Alterar Senha</CardTitle>
            <CardDescription>
              Mantenha sua conta segura com uma senha forte
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="max-w-md space-y-4"
          >
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium uppercase text-muted-foreground">
                    Senha Atual
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Digite sua senha atual"
                        {...field}
                      />
                      <PasswordToggleButton
                        show={showCurrentPassword}
                        onToggle={() => setShowCurrentPassword(!showCurrentPassword)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium uppercase text-muted-foreground">
                    Nova Senha
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Digite sua nova senha"
                        {...field}
                      />
                      <PasswordToggleButton
                        show={showNewPassword}
                        onToggle={() => setShowNewPassword(!showNewPassword)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                  {watchedNewPassword.length > 0 && (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Força da senha:
                        </span>
                        <span className={`font-medium ${passwordStrength.color}`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <Progress value={passwordStrength.strength} className="h-1.5" />
                    </div>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium uppercase text-muted-foreground">
                    Confirmar Nova Senha
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirme sua nova senha"
                        className={
                          watchedConfirmPassword.length > 0
                            ? passwordsMatch
                              ? "border-green-500 focus-visible:ring-green-500"
                              : "border-destructive focus-visible:ring-destructive"
                            : ""
                        }
                        {...field}
                      />
                      <PasswordToggleButton
                        show={showConfirmPassword}
                        onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                      />
                    </div>
                  </FormControl>
                  {watchedConfirmPassword.length > 0 && (
                    <p
                      className={`mt-1 text-xs ${
                        passwordsMatch ? "text-green-600" : "text-destructive"
                      }`}
                    >
                      {passwordsMatch
                        ? "✓ As senhas coincidem"
                        : "✗ As senhas não coincidem"}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <Alert className="border-primary/20 bg-primary/5">
              <AlertTitle className="text-sm font-medium">
                Requisitos da senha:
              </AlertTitle>
              <AlertDescription>
                <ul className="ml-4 mt-1 list-disc space-y-0.5 text-xs text-muted-foreground">
                  <li>Mínimo de 8 caracteres</li>
                  <li>Pelo menos uma letra maiúscula</li>
                  <li>Pelo menos uma letra minúscula</li>
                  <li>Pelo menos um número</li>
                  <li>Pelo menos um caractere especial</li>
                </ul>
              </AlertDescription>
            </Alert>

            <Button
              type="submit"
              className="w-full"
              disabled={
                !form.formState.isValid || passwordStrength.strength < 50
              }
            >
              Alterar Senha
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
