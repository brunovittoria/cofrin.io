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

// Settings - Personal Info validation schema
export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(1, "O nome é obrigatório.")
    .min(2, "O nome deve ter pelo menos 2 caracteres.")
    .max(50, "O nome deve ter no máximo 50 caracteres."),
  lastName: z
    .string()
    .min(1, "O sobrenome é obrigatório.")
    .min(2, "O sobrenome deve ter pelo menos 2 caracteres.")
    .max(50, "O sobrenome deve ter no máximo 50 caracteres."),
  birthDate: z.string().optional(),
  phone: z
    .string()
    .max(20, "O telefone deve ter no máximo 20 caracteres.")
    .optional(),
});

// Settings - Address validation schema
export const addressSchema = z.object({
  country: z
    .string()
    .min(1, "O país é obrigatório.")
    .max(50, "O país deve ter no máximo 50 caracteres."),
  city: z
    .string()
    .min(1, "A cidade é obrigatória.")
    .max(100, "A cidade deve ter no máximo 100 caracteres."),
  postalCode: z
    .string()
    .min(1, "O CEP é obrigatório.")
    .max(20, "O CEP deve ter no máximo 20 caracteres."),
});

// Settings - Change Password validation schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "A senha atual é obrigatória."),
    newPassword: z
      .string()
      .min(1, "A nova senha é obrigatória.")
      .min(8, "A senha deve ter pelo menos 8 caracteres.")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula.")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula.")
      .regex(/\d/, "A senha deve conter pelo menos um número.")
      .regex(/[^A-Za-z0-9]/, "A senha deve conter pelo menos um caractere especial."),
    confirmPassword: z.string().min(1, "Por favor, confirme sua nova senha."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

// Forgot Password validation schema
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

// Reset Password validation schema
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Category validation schema
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "O nome é obrigatório.")
    .max(100, "O nome deve ter no máximo 100 caracteres."),
  description: z
    .string()
    .max(500, "A descrição deve ter no máximo 500 caracteres.")
    .optional(),
  type: z.enum(["entrada", "saida"], {
    required_error: "Por favor, selecione um tipo.",
  }),
  hex_color: z
    .string()
    .min(1, "A cor é obrigatória.")
    .regex(/^#[0-9A-Fa-f]{6}$/, "A cor deve ser um código hexadecimal válido (ex: #FF5733)."),
});

// Card validation schema
export const cardSchema = z.object({
  display_name: z
    .string()
    .min(1, "O nome de exibição é obrigatório.")
    .max(100, "O nome de exibição deve ter no máximo 100 caracteres."),
  nickname: z
    .string()
    .max(50, "O apelido deve ter no máximo 50 caracteres.")
    .optional(),
  flag: z
    .string()
    .max(50, "A bandeira deve ter no máximo 50 caracteres.")
    .optional(),
  issuer: z
    .string()
    .max(50, "O emissor deve ter no máximo 50 caracteres.")
    .optional(),
  card_last_four: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === "") return true;
      return /^\d{4}$/.test(val);
    }, {
      message: "Os últimos 4 dígitos devem ser números.",
    }),
  total_limit: z
    .string()
    .min(1, "O limite total é obrigatório.")
    .refine((val) => {
      const num = parseFloat(val.replace(",", "."));
      return !isNaN(num) && num > 0;
    }, {
      message: "O limite total deve ser um número positivo.",
    }),
  used_amount: z
    .string()
    .min(1, "O valor utilizado é obrigatório.")
    .refine((val) => {
      const num = parseFloat(val.replace(",", "."));
      return !isNaN(num) && num >= 0;
    }, {
      message: "O valor utilizado deve ser um número não negativo.",
    }),
});

// Expense validation schema
export const expenseSchema = z.object({
  date: z.date({
    required_error: "Por favor, selecione uma data.",
  }),
  descricao: z
    .string()
    .min(1, "A descrição é obrigatória.")
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
  tipo: z.string().optional(),
});

// Income validation schema
export const incomeSchema = z.object({
  date: z.date({
    required_error: "Por favor, selecione uma data.",
  }),
  descricao: z
    .string()
    .min(1, "A descrição é obrigatória.")
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
  tipo: z.string().optional(),
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
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type CardFormData = z.infer<typeof cardSchema>;
export type ExpenseFormData = z.infer<typeof expenseSchema>;
export type IncomeFormData = z.infer<typeof incomeSchema>;