import { z } from "zod";

// Login form validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

// Registration form validation schema
export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be less than 50 characters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be less than 50 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number"),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Lançamento Futuro form validation schema (input - mantém strings)
export const lancamentoFuturoInputSchema = z.object({
  data: z.date({
    required_error: "Por favor, selecione uma data prevista.",
  }),
  tipo: z.enum(["entrada", "saida"], {
    required_error: "Por favor, selecione o tipo de lançamento.",
  }),
  descricao: z
    .string()
    .min(1, "A descrição é obrigatória.")
    .min(3, "A descrição deve ter pelo menos 3 caracteres.")
    .max(200, "A descrição deve ter no máximo 200 caracteres."),
  categoria_id: z
    .string()
    .min(1, "Por favor, selecione uma categoria.")
    .refine((val) => !isNaN(parseInt(val, 10)), {
      message: "Categoria inválida.",
    }),
  valor: z
    .string()
    .min(1, "O valor é obrigatório.")
    .refine((val) => {
      const num = parseFloat(val.replace(",", "."));
      return !isNaN(num) && num > 0;
    }, {
      message: "O valor deve ser um número positivo.",
    }),
});

// Schema transformado para output (com números)
export const lancamentoFuturoSchema = lancamentoFuturoInputSchema.transform((data) => ({
  ...data,
  categoria_id: parseInt(data.categoria_id, 10),
  valor: parseFloat(data.valor.replace(",", ".")),
}));

// Type inference for TypeScript
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LancamentoFuturoFormData = z.infer<typeof lancamentoFuturoInputSchema>;
export type LancamentoFuturoOutputData = z.infer<typeof lancamentoFuturoSchema>;
