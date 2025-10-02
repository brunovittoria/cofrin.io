# Configuração de Variáveis de Ambiente

## Configuração do Supabase

Para configurar o projeto com suas credenciais do Supabase, siga estes passos:

### 1. Copie o arquivo de exemplo
```bash
cp .env.example .env
```

### 2. Edite o arquivo .env
Substitua os valores placeholder pelas suas credenciais reais do Supabase:

```env
# Supabase Configuration
VITE_SUPABASE_PROJECT_ID=seu_project_id_aqui
VITE_SUPABASE_URL=https://seu_project_id.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

### 3. Onde encontrar suas credenciais

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings** > **API**
4. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Project ID** → `VITE_SUPABASE_PROJECT_ID`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

### 4. Configuração no config.toml

O arquivo `supabase/config.toml` já está configurado para usar a variável de ambiente:

```toml
project_id = process.env.VITE_SUPABASE_PROJECT_ID
```

### 5. Segurança

- ✅ O arquivo `.env` está no `.gitignore` e não será commitado
- ✅ Use o arquivo `.env.example` como template para outros desenvolvedores
- ✅ Nunca commite credenciais reais no repositório

### 6. Reinicie o servidor

Após configurar as variáveis, reinicie o servidor de desenvolvimento:

```bash
npm run dev
# ou
pnpm dev
```
