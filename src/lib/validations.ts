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

// Future Launch form validation schema (input - keeps strings)
export const futureLaunchInputSchema = z.object({
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

// Transformed schema for output (with numbers)
export const futureLaunchSchema = futureLaunchInputSchema.transform((data) => ({
  ...data,
  categoria_id: parseInt(data.categoria_id, 10),
  valor: parseFloat(data.valor.replace(",", ".")),
}));

// Goal reflection step validation schema
export const goalReflectionSchema = z.object({
  porque: z
    .string()
    .min(1, "Por favor, responda por que essa meta é importante.")
    .min(10, "Sua reflexão deve ter pelo menos 10 caracteres."),
  mudanca: z
    .string()
    .min(1, "Por favor, responda o que está disposto a ajustar.")
    .min(10, "Sua reflexão deve ter pelo menos 10 caracteres."),
  sentimento: z.string().optional(),
});

// Goal type validation
export const goalTypeSchema = z.object({
  tipo: z.enum(["economizar", "reduzir", "quitar", "personalizada"], {
    required_error: "Por favor, selecione um tipo de meta.",
  }),
});

// Goal details validation schema
export const goalDetailsSchema = z.object({
  titulo: z
    .string()
    .min(1, "O título é obrigatório.")
    .min(3, "O título deve ter pelo menos 3 caracteres.")
    .max(100, "O título deve ter no máximo 100 caracteres."),
  descricao: z
    .string()
    .max(500, "A descrição deve ter no máximo 500 caracteres.")
    .optional(),
  valor_alvo: z
    .string()
    .min(1, "O valor da meta é obrigatório.")
    .refine((val) => {
      const num = parseFloat(val.replace(",", "."));
      return !isNaN(num) && num > 0;
    }, {
      message: "O valor deve ser um número positivo.",
    }),
  valor_atual: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === "") return true;
      const num = parseFloat(val.replace(",", "."));
      return !isNaN(num) && num >= 0;
    }, {
      message: "O valor atual deve ser um número válido.",
    }),
  prazo: z
    .string()
    .min(1, "O prazo é obrigatório.")
    .refine((val) => {
      const date = new Date(val);
      return date > new Date();
    }, {
      message: "O prazo deve ser uma data futura.",
    }),
  categoria_id: z.string().optional(),
  cartao_id: z.string().optional(),
});

// Combined goal form schema (for the full wizard)
export const goalFormSchema = goalReflectionSchema
  .merge(goalTypeSchema)
  .merge(goalDetailsSchema);

// Check-in validation schema
export const checkInSchema = z.object({
  humor: z.enum(["positivo", "neutro", "negativo"]).optional(),
  valor_adicionado: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === "") return true;
      const num = parseFloat(val.replace(",", "."));
      return !isNaN(num) && num >= 0;
    }, {
      message: "O valor deve ser um número válido.",
    }),
  obstaculos: z
    .string()
    .max(500, "Os obstáculos devem ter no máximo 500 caracteres.")
    .optional(),
  nota: z
    .string()
    .max(200, "A nota deve ter no máximo 200 caracteres.")
    .optional(),
});

// Type inference for TypeScript
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type FutureLaunchFormData = z.infer<typeof futureLaunchInputSchema>;
export type FutureLaunchOutputData = z.infer<typeof futureLaunchSchema>;
export type GoalReflectionFormData = z.infer<typeof goalReflectionSchema>;
export type GoalTypeFormData = z.infer<typeof goalTypeSchema>;
export type GoalDetailsFormData = z.infer<typeof goalDetailsSchema>;
export type GoalFormData = z.infer<typeof goalFormSchema>;
export type CheckInFormData = z.infer<typeof checkInSchema>;
