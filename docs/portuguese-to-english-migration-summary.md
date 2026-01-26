# Portuguese to English Migration - Summary of All Fixes

## Overview

This document summarizes all the fixes applied to migrate from Portuguese property/table names to English names to match the database schema migration (`008_rename_tables_columns_to_english.sql`).

---

## Files Fixed

### 1. Category Components ✅

**Files:**
- `apps/web/src/pages/authenticated/categories/components/CategoryRow.tsx`
- `apps/web/src/components/dialogs/entry-modal/components/CategoryField.tsx`
- `apps/web/src/components/dialogs/expenses-modal/components/CategoryField.tsx`
- `apps/web/src/components/dialogs/launch-modal/components/CategoryFormField.tsx`
- `apps/web/src/components/dialogs/category-modal/index.tsx`
- `apps/web/src/hooks/useCategoryForm.ts`

**Changes:**
- `category.nome` → `category.name`
- `category.descricao` → `category.description`
- `category.cor_hex` → `category.hex_color`
- `category.tipo` → `category.type`
- `categorias` → `categories` (in related objects)

---

### 2. Income/Expense Components ✅

**Files:**
- `apps/web/src/pages/authenticated/incomes/components/EntryRow.tsx`
- `apps/web/src/pages/authenticated/expenses/components/ExpenseRow.tsx`
- `apps/web/src/pages/authenticated/transactions/components/TransactionRow.tsx`
- `apps/web/src/components/dialogs/entry-modal/index.tsx`
- `apps/web/src/components/dialogs/expenses-modal/index.tsx`
- `apps/web/src/hooks/useIncomeForm.ts`
- `apps/web/src/hooks/useExpensesPage.ts`
- `apps/web/src/hooks/useIncomesPage.ts`
- `apps/web/src/hooks/useTransactionsPage.ts`

**Changes:**
- `entry.data` → `entry.date`
- `entry.descricao` → `entry.description`
- `entry.valor` → `entry.amount`
- `entry.categorias` → `entry.categories`
- `expense.data` → `expense.date`
- `expense.descricao` → `expense.description`
- `expense.valor` → `expense.amount`
- `expense.categorias` → `expense.categories`
- `transaction.data` → `transaction.date`
- `transaction.descricao` → `transaction.description`
- `transaction.valor` → `transaction.amount`
- `transaction.categorias` → `transaction.categories`

**Payload fixes:**
- `data` → `date`
- `descricao` → `description`
- `valor` → `amount`
- `categoria_id` → `category_id`

---

### 3. Goal Components ✅

**Files:**
- `apps/web/src/pages/authenticated/goals/components/GoalCard.tsx`
- `apps/web/src/pages/authenticated/goals/components/GoalForm.tsx`
- `apps/web/src/pages/authenticated/goals/components/GoalHistory.tsx`
- `apps/web/src/pages/authenticated/goals/components/GoalsGrid.tsx`
- `apps/web/src/pages/authenticated/goals/[id]/index.tsx`
- `apps/web/src/components/dialogs/checkin-modal/index.tsx`
- `apps/web/src/hooks/useGoalForm.ts`

**Changes:**
- `goal.tipo` → `goal.type`
- `goal.titulo` → `goal.title`
- `goal.descricao` → `goal.description`
- `goal.valor_alvo` → `goal.target_amount`
- `goal.valor_atual` → `goal.current_amount`
- `goal.prazo` → `goal.deadline`
- `goal.categoria_id` → `goal.category_id`
- `goal.cartao_id` → `goal.card_id`
- `goal.reflexao_porque` → `goal.reflection_why`
- `goal.reflexao_mudanca` → `goal.reflection_change`
- `goal.reflexao_sentimento` → `goal.reflection_feeling`
- `goal.categorias` → `goal.categories`
- `goal.cartoes` → `goal.cards`
- `checkIn.meta_id` → `checkIn.goal_id`
- `checkIn.data` → `checkIn.date`
- `checkIn.humor` → `checkIn.mood`
- `checkIn.obstaculos` → `checkIn.obstacles`
- `checkIn.valor_adicionado` → `checkIn.added_value`
- `checkIn.nota` → `checkIn.note`

**Payload fixes:**
- `titulo` → `title`
- `tipo` → `type`
- `descricao` → `description`
- `valor_alvo` → `target_amount`
- `valor_atual` → `current_amount`
- `prazo` → `deadline`
- `categoria_id` → `category_id`
- `cartao_id` → `card_id`
- `reflexao_porque` → `reflection_why`
- `reflexao_mudanca` → `reflection_change`
- `reflexao_sentimento` → `reflection_feeling`
- `meta_id` → `goal_id`

---

### 4. Card Components ✅

**Files:**
- `apps/web/src/components/MyCardsSection.tsx`
- `apps/web/src/pages/authenticated/cards/components/CardItem.tsx`
- `apps/web/src/components/dialogs/card-modal/index.tsx`
- `apps/web/src/hooks/useCardForm.ts`

**Changes:**
- `card.is_principal` → `card.is_primary`
- `card.nome_exibicao` → `card.display_name`
- `card.apelido` → `card.nickname`
- `card.bandeira` → `card.flag`
- `card.final_cartao` → `card.card_last_four`
- `card.limite_total` → `card.total_limit`
- `card.valor_utilizado` → `card.used_amount`
- `card.valor_disponivel` → `card.available_amount`
- `card.uso_percentual` → `card.usage_percentage`
- `card.emissor` → `card.issuer`
- `card.criado_em` → `card.created_at`

**Payload fixes:**
- `nome_exibicao` → `display_name`
- `apelido` → `nickname`
- `bandeira` → `flag`
- `final_cartao` → `card_last_four`
- `limite_total` → `total_limit`
- `valor_utilizado` → `used_amount`
- `valor_disponivel` → `available_amount`
- `uso_percentual` → `usage_percentage`
- `emissor` → `issuer`
- `is_principal` → `is_primary`
- `criado_em` → `created_at`

---

### 5. Future Launch Components ✅

**Files:**
- `apps/web/src/pages/authenticated/future-launches/components/CompletedLaunchesTable.tsx`
- `apps/web/src/pages/authenticated/future-launches/components/PendingLaunchRow.tsx`
- `apps/web/src/components/dialogs/launch-modal/index.tsx`
- `apps/web/src/hooks/useFutureLaunchForm.ts`
- `apps/web/src/hooks/useFutureLaunchesPage.ts`

**Changes:**
- `launch.data` → `launch.date`
- `launch.tipo` → `launch.type`
- `launch.descricao` → `launch.description`
- `launch.valor` → `launch.amount`
- `launch.categorias` → `launch.categories`

**Payload fixes:**
- `data` → `date`
- `tipo` → `type`
- `descricao` → `description`
- `valor` → `amount`
- `categoria_id` → `category_id`

---

### 6. Database Views Migration ✅

**File:**
- `supabase/migrations/007_fix_views_rls.sql`

**Changes:**
- `entradas` → `incomes`
- `saidas` → `expenses`
- `categorias` → `categories`
- `entradas.data` → `incomes.date`
- `entradas.valor` → `incomes.amount`
- `saidas.data` → `expenses.date`
- `saidas.valor` → `expenses.amount`
- `c.nome` → `c.name`
- `s.categoria_id` → `s.category_id`
- `whatsapp_conversas` → `whatsapp_conversations`
- `usuarios` → `users`

---

### 7. Utility Functions ✅

**Files:**
- `apps/web/src/lib/formatters.ts`

**Changes:**
- Added null safety check to `formatLocalDate()` function

---

## Property Name Mapping Reference

### Tables
| Portuguese | English |
|------------|---------|
| `usuarios` | `users` |
| `categorias` | `categories` |
| `saidas` | `expenses` |
| `entradas` | `incomes` |
| `cartoes` | `cards` |
| `metas` | `goals` |
| `meta_checkins` | `goal_checkins` |
| `lancamentos_futuros` | `future_transactions` |
| `whatsapp_conversas` | `whatsapp_conversations` |

### Common Columns
| Portuguese | English |
|------------|---------|
| `nome` | `name` |
| `descricao` | `description` |
| `cor_hex` | `hex_color` |
| `tipo` | `type` |
| `data` | `date` |
| `valor` | `amount` |
| `categoria_id` | `category_id` |
| `cartao_id` | `card_id` |
| `meta_id` | `goal_id` |

### Goal-Specific Columns
| Portuguese | English |
|------------|---------|
| `titulo` | `title` |
| `valor_alvo` | `target_amount` |
| `valor_atual` | `current_amount` |
| `prazo` | `deadline` |
| `reflexao_porque` | `reflection_why` |
| `reflexao_mudanca` | `reflection_change` |
| `reflexao_sentimento` | `reflection_feeling` |

### Card-Specific Columns
| Portuguese | English |
|------------|---------|
| `nome_exibicao` | `display_name` |
| `apelido` | `nickname` |
| `bandeira` | `flag` |
| `final_cartao` | `card_last_four` |
| `limite_total` | `total_limit` |
| `valor_utilizado` | `used_amount` |
| `valor_disponivel` | `available_amount` |
| `uso_percentual` | `usage_percentage` |
| `emissor` | `issuer` |
| `is_principal` | `is_primary` |
| `criado_em` | `created_at` |

### Check-in Columns
| Portuguese | English |
|------------|---------|
| `data` | `date` |
| `humor` | `mood` |
| `obstaculos` | `obstacles` |
| `valor_adicionado` | `added_value` |
| `nota` | `note` |

---

## Notes

1. **Form Validation Schemas**: The validation schemas in `lib/validations.ts` still use Portuguese property names internally. This is **intentional** - they're for form validation only. The transformation to English names happens in the form hooks (`getSubmitData()` functions) before sending to the API.

2. **Migration Files**: Migration file `007_fix_views_rls.sql` has been updated to use English table/column names, assuming migration `008_rename_tables_columns_to_english.sql` has been run first.

3. **Documentation Files**: Some documentation files (`.md` files) may still reference Portuguese names for historical context. These don't affect functionality.

4. **Cursor Rules**: The `.cursor/rules/` files contain example code that may reference Portuguese names. These are guidelines and don't affect the running application.

---

## Verification Checklist

After these fixes, verify:

- [ ] Categories display correctly with names, descriptions, and colors
- [ ] Income/expense creation works correctly
- [ ] Goal creation and editing works correctly
- [ ] Card creation and editing works correctly
- [ ] Future launch creation works correctly
- [ ] Check-ins can be created for goals
- [ ] All modals show category dropdowns correctly
- [ ] Dashboard charts load correctly
- [ ] All tables display data correctly

---

## Status: ✅ Complete

All application code has been updated to use English property names matching the database schema.
