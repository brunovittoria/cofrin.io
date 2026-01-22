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

### 5. Autenticação

Este projeto usa **Supabase Auth** para autenticação. Certifique-se de que:

- O Supabase Auth está habilitado no seu projeto
- O provedor OAuth (Google) está configurado se você planeja usar login com Google
- As URLs de redirecionamento estão configuradas corretamente no Supabase Dashboard

#### 5.1. Habilitar Google OAuth no Supabase

Para usar login com Google, você precisa habilitar o provedor no Supabase:

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Authentication** > **Providers** (ou **Settings** > **Auth** > **Providers**)
4. Encontre **Google** na lista de provedores
5. Clique em **Enable** ou **Configure**
6. Você precisará:
   - **Client ID (for OAuth)**: Obtenha no [Google Cloud Console](https://console.cloud.google.com/)
   - **Client Secret (for OAuth)**: Obtenha no [Google Cloud Console](https://console.cloud.google.com/)

#### 5.2. Configurar Google OAuth no Google Cloud Console

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá em **APIs & Services** > **Credentials**
4. Clique em **Create Credentials** > **OAuth client ID**
5. Configure:
   - **Application type**: Web application
   - **Name**: Cofrinio (ou o nome que preferir)
   - **Authorized JavaScript origins**: 
     - `https://your-project-id.supabase.co`
   - **Authorized redirect URIs**:
     - `https://your-project-id.supabase.co/auth/v1/callback`
6. Copie o **Client ID** e **Client Secret**
7. Cole no Supabase Dashboard em **Authentication** > **Providers** > **Google**

#### 5.3. Configurar URLs de Redirecionamento

No Supabase Dashboard, em **Authentication** > **URL Configuration**:

1. Adicione suas URLs de redirecionamento:
   - **Site URL**: `http://localhost:5173` (desenvolvimento) ou sua URL de produção
   - **Redirect URLs**: Adicione:
     - `http://localhost:5173/auth/callback` (desenvolvimento)
     - `https://yourdomain.com/auth/callback` (produção)

**Importante**: As URLs devem corresponder exatamente às URLs usadas no código (`/auth/callback`)

### 6. Segurança

- ✅ O arquivo `.env` está no `.gitignore` e não será commitado
- ✅ Use o arquivo `.env.example` como template para outros desenvolvedores
- ✅ Nunca commite credenciais reais no repositório
- ✅ Row Level Security (RLS) está habilitado em todas as tabelas

### 7. Reinicie o servidor

Após configurar as variáveis, reinicie o servidor de desenvolvimento:

```bash
npm run dev
# ou
pnpm dev
```
