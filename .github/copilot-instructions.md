# Copilot Instructions — BALM E-commerce Frontend

## Visão Geral do Projeto

Este é o frontend de um e-commerce de **velas artesanais e aromas** da marca **BALM**. O projeto é construído com **Next.js 14 (App Router)**, **React 18**, **TypeScript**, **Tailwind CSS 4** e **shadcn/ui (estilo new-york)**. O backend é uma API Django REST Framework separada, acessada via Axios com autenticação JWT baseada em cookies httpOnly.

Toda a interface é em **português brasileiro (pt-BR)** — textos, mensagens de erro, labels, placeholders e comentários no código devem seguir esse idioma.

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript (strict mode) |
| UI Components | shadcn/ui (estilo `new-york`, com Radix UI) |
| Estilização | Tailwind CSS 4 + CSS variables para design tokens |
| HTTP Client | Axios (via `@/lib/api`) com interceptor de refresh JWT |
| Autenticação | JWT em cookies httpOnly (access + refresh tokens) |
| Pagamento | MercadoPago SDK (`@mercadopago/sdk-react`) |
| Ícones | Lucide React (imports individuais, tree-shaking) |
| Fontes | Inter (sans-serif) + Playfair Display (serif) |
| Validação | Manual (sem React Hook Form / Zod nas páginas) |
| Package Manager | pnpm |
| Analytics | Vercel Analytics |

---

## Estrutura de Diretórios

```
app/                    → Rotas (App Router do Next.js)
  layout.tsx            → Layout raiz com providers (AuthProvider > CartProvider)
  page.tsx              → Página inicial (Home)
  produto/[slug]/       → Página de produto (único Server Component com ISR)
  produtos/             → Listagem com filtros
  carrinho/             → Carrinho de compras
  checkout/             → Finalização (+ sucesso/, falha/, pendente/)
  perfil/               → Dados do usuário, pedidos, endereços
  login/                → Login
  cadastro/             → Registro
  busca/                → Resultados de busca
  essencias/            → Catálogo de essências
  verificacao-enviada/  → Tela pós-registro
  verificar-email/[token]/ → Verificação de email
  sobre/, contato/, faq/, termos/ → Páginas institucionais

components/             → Componentes reutilizáveis
  ui/                   → Primitivos shadcn/ui (não editar manualmente)
  navbar.tsx, footer.tsx, product-card.tsx, etc.

context/                → Context Providers (AuthContext, CartContext)
hooks/                  → Custom hooks (use-mobile, use-toast)
lib/                    → Utilitários e configurações
  api.js                → Instância Axios configurada
  types.ts              → Tipos/interfaces compartilhados
  utils.ts              → Função cn() (clsx + tailwind-merge)
public/                 → Assets estáticos
styles/                 → CSS global adicional
```

---

## Convenções de Código

### Nomenclatura de Arquivos

- **Componentes**: `kebab-case.tsx` → `product-card.tsx`, `best-sellers-section.tsx`
- **Páginas**: `page.tsx` dentro da pasta da rota
- **Hooks**: `use-kebab-case.ts` → `use-mobile.ts`
- **Contexts**: `PascalCase.tsx` → `AuthContext.tsx`, `CartContext.tsx`
- **Loading states**: `loading.tsx` nas pastas de rota

### Nomenclatura no Código

| Item | Convenção | Exemplo |
|------|-----------|---------|
| Componentes reutilizáveis | `export function PascalCase()` (named export) | `export function ProductCard()` |
| Páginas | `export default function PascalCasePage()` (default export) | `export default function PerfilPage()` |
| Interfaces de props | `PascalCase + Props` | `ProductCardProps`, `CheckoutFormProps` |
| Hooks | `use` + camelCase | `useAuth()`, `useCart()`, `useIsMobile()` |
| Handlers | `handle` + Ação | `handleSubmit`, `handleCepBlur`, `handleInputChange` |
| Funções de fetch | `fetch` + Recurso | `fetchCategories`, `fetchOrders`, `fetchCart` |
| Estado booleano | `is` + Adjetivo | `isLoading`, `isEditing`, `isAuthenticated` |
| Variáveis de estado | camelCase | `selectedEssenceId`, `formData`, `cartItems` |

### Exports

- **Componentes reutilizáveis**: sempre **named export** (`export function ComponentName`)
- **Páginas**: sempre **default export** (`export default function PageName`)
- **Nunca** usar arrow functions para componentes de nível superior
- Tipos/interfaces auxiliares de um componente podem ser exportados do mesmo arquivo

---

## Padrões de Componentes

### Estrutura Básica de um Componente

```tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import api from "@/lib/api"
import { Product } from "@/lib/types"

interface MeuComponenteProps {
  product: Product
  onAction?: () => void
}

export function MeuComponente({ product, onAction }: MeuComponenteProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<Product[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/product/products/")
        setData(response.data.results || response.data)
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return <p className="text-center text-muted-foreground">Carregando...</p>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* conteúdo */}
      </CardContent>
    </Card>
  )
}
```

### Regras de Componentes

1. Usar `"use client"` no topo de qualquer componente que use hooks, estado ou interatividade
2. Páginas estáticas/institucionais (sobre, termos, faq) **não** precisam de `"use client"`
3. O único Server Component com data fetching é `app/produto/[slug]/page.tsx` (usa `fetch()` nativo com `revalidate: 3600`)
4. Todas as props devem ser tipadas com `interface` (não `type`)
5. Usar imports com alias `@/` para todos os caminhos internos

---

## Estilização

### Design System

O projeto usa **CSS variables** para tokens de design, definidas em `app/globals.css`:

- **Cores principais**: `--primary` (laranja #f2921d), `--foreground` (azul profundo #021f59), `--secondary` (marrom terra #403a20), `--background` (off-white #f2f0eb)
- **Suporte a dark mode** via classe `.dark` no HTML

### Regras de Estilização

1. **Sempre usar tokens semânticos** do Tailwind, nunca cores brutas:
   - ✅ `text-foreground`, `bg-primary`, `text-muted-foreground`, `bg-card`, `border-border`
   - ❌ `text-gray-500`, `bg-orange-500`, `text-blue-900`

2. **Tipografia**:
   - Headings (`h1`-`h6`): `font-serif` (Playfair Display) — aplicado globalmente via CSS
   - Corpo de texto: `font-sans` (Inter) — padrão
   - Negrito em títulos: `font-bold` ou `font-semibold`

3. **Layout de container padrão**:
   ```tsx
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
   ```

4. **Responsive design** — mobile-first com breakpoints:
   ```tsx
   className="text-2xl sm:text-3xl md:text-4xl"
   className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
   className="px-4 sm:px-6 lg:px-8"
   className="hidden md:flex"    // apenas desktop
   className="md:hidden"         // apenas mobile
   ```

5. **Spacing**: usar `space-y-{n}` para stacking vertical, `gap-{n}` em grids/flex

6. **Função `cn()`** disponível em `@/lib/utils` para merge condicional de classes Tailwind

7. **Imagens**: usar `object-cover` para imagens. Fallback: `product.image || "/placeholder.svg"`

---

## shadcn/ui

### Configuração

- Estilo: `new-york`
- RSC: habilitado
- Ícones: Lucide
- CSS Variables: habilitado
- Base color: `neutral`

### Componentes Mais Usados

`Button`, `Input`, `Label`, `Card` (CardHeader, CardTitle, CardContent, CardFooter), `Select`, `Dialog`, `DropdownMenu`, `Separator`, `Badge`, `Checkbox`, `RadioGroup`, `Slider`, `Accordion`, `AlertDialog`, `Tooltip`, `Textarea`

### Para adicionar novos componentes shadcn/ui:

```bash
pnpm dlx shadcn@latest add <component-name>
```

**Nunca editar componentes dentro de `components/ui/`** — eles são gerados pelo shadcn/ui.

---

## Comunicação com a API (Backend)

### Cliente HTTP

O arquivo `lib/api.js` exporta uma instância Axios pré-configurada:
- `baseURL`: variável de ambiente `NEXT_PUBLIC_API_BASE_URL`
- `withCredentials: true` — envia/recebe cookies automaticamente
- Interceptor automático: em caso de 401, tenta refresh do token JWT e retenta a request original

### Padrão de Chamadas

**Em Client Components (maioria)** — usar `api` do Axios:
```tsx
import api from "@/lib/api"

const response = await api.get("/product/products/")
const data = response.data
```

**Em Server Components (apenas produto/[slug])** — usar `fetch()` nativo:
```tsx
const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/products/${slug}/`, {
  next: { revalidate: 3600 },
})
const data = await response.json()
```

### Endpoints da API

| Domínio | Endpoints |
|---------|-----------|
| **Produtos** | `GET /product/categories/`, `GET /product/essences/`, `GET /product/products/`, `GET /product/products/:slug/`, `GET /product/bestsellers/` |
| **Auth** | `POST /client/auth/jwt/create/`, `POST /auth/jwt/refresh/`, `GET /auth/users/me/`, `POST /client/auth/logout/` |
| **Cliente** | `POST /client/register/`, `POST /client/verify-email/`, `POST /client/resend-verification/`, `GET /client/profile/`, `PATCH /client/profile/`, `GET /client/addresses/`, `POST /client/addresses/`, `PATCH /client/addresses/:id/`, `DELETE /client/addresses/:id/`, `GET /client/utils/states/` |
| **Carrinho** | `GET /cart/my-cart/`, `POST /cart/items/add/`, `DELETE /cart/items/delete/:id/`, `PATCH /cart/items/:id/`, `POST /cart/calculate-shipping/` |
| **Checkout** | `POST /checkout/coupons/validate/`, `POST /checkout/create/` |
| **Pedidos** | `GET /order/order-list/`, `PATCH /order/order-cancel/:id/` |
| **Config** | `GET /site-config/hero/` |
| **Externo** | `GET https://viacep.com.br/ws/:cep/json/` (busca CEP) |

---

## Gerenciamento de Estado

### Contexts

**AuthContext** (`context/AuthContext.tsx`):
- Provê: `isAuthenticated`, `user`, `login()`, `register()`, `logout()`, `loading`
- Inicializa automaticamente verificando `/auth/users/me/`
- Só renderiza children após concluir check de auth
- Hook: `useAuth()`

**CartContext** (`context/CartContext.tsx`):
- Provê: `cartItems`, `addToCart()`, `removeFromCart()`, `updateQuantity()`, `total`, `cartItemCount`, `loading`
- Depende do `AuthContext` — carrinho é server-side
- Toda mutação faz API call seguida de `fetchCart()` para re-sincronizar
- Hook: `useCart()`

**Hierarquia de Providers** (em `layout.tsx`):
```
AuthProvider > CartProvider > Navbar + main + Footer
```

### Estado Local

- Formulários: `useState` com objeto `formData` + `handleChange` genérico
- Validação: função `validateForm()` retornando `Record<string, string>` de erros
- Loading: `useState<boolean>` com padrão `try/catch/finally`
- Dados efêmeros (shipping, coupon): `sessionStorage`

---

## Tipos Compartilhados

Todos definidos em `lib/types.ts`:

```typescript
Product, Category, Size, Essence, AvailableOptions, User, ProductCustomization
```

Tipos locais de componentes (como `ShippingOption`, `CouponData`, `SavedAddress`) são definidos no próprio arquivo do componente.

---

## Padrões de Formulários

O projeto usa **gerenciamento manual de formulários** (sem React Hook Form / Zod):

```tsx
const [formData, setFormData] = useState({ campo1: "", campo2: "" })
const [errors, setErrors] = useState<Record<string, string>>({})

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target
  setFormData(prev => ({ ...prev, [name]: value }))
}

const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {}
  if (!formData.campo1) newErrors.campo1 = "Campo obrigatório"
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!validateForm()) return
  // chamada API
}
```

**Exibição de erro nos inputs:**
```tsx
<Input className={errors.campo ? "border-destructive" : ""} />
{errors.campo && <p className="text-destructive text-xs mt-1">{errors.campo}</p>}
```

---

## Ícones (Lucide)

Sempre importar ícones individualmente:
```tsx
import { ShoppingCart, User, Search, Menu, X, ChevronLeft, ChevronRight } from "lucide-react"
```

**Nunca** usar `import * from "lucide-react"`.

---

## Imagens

- Usar `<img>` tag para a maioria dos componentes com `className="object-cover"`
- Usar `<Image>` do Next.js apenas para imagens críticas acima do fold (hero)
- Fallback: `src={product.image || "/placeholder.svg"}`
- `next.config.mjs` tem `images: { unoptimized: true }`

---

## Formatação de Moeda

Usar o padrão `Intl.NumberFormat` para formatação de valores monetários:

```tsx
new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor)
```

---

## Padrões de Loading

### Em páginas (App Router)
Criar arquivo `loading.tsx` na pasta da rota:
```tsx
export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12">
      <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
      <p className="mt-4 text-muted-foreground text-sm font-medium">Carregando...</p>
    </div>
  )
}
```

### Em componentes
```tsx
if (isLoading) {
  return <p className="text-center text-muted-foreground">Carregando...</p>
}
```

### Em botões
```tsx
<Button disabled={isLoading}>
  {isLoading ? "Processando..." : "Confirmar"}
</Button>
```

---

## Integração de Pagamento

O projeto usa **MercadoPago** para pagamentos:
- SDK: `@mercadopago/sdk-react`
- Componente `Wallet` com `preferenceId` gerado via `POST /checkout/create/`
- Public key via `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`
- Páginas de callback: `/checkout/sucesso`, `/checkout/falha`, `/checkout/pendente`

---

## Variáveis de Ambiente

```env
NEXT_PUBLIC_API_BASE_URL=<url_do_backend>
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=<chave_publica_mercadopago>
```

---

## Comandos do Projeto

```bash
pnpm dev          # Servidor de desenvolvimento
pnpm build        # Build de produção
pnpm start        # Servir build de produção
pnpm lint         # Lint com ESLint
```

---

## Boas Práticas para Contribuição

1. **Idioma**: Todo texto visível ao usuário deve ser em português brasileiro
2. **Componentes UI**: Usar primitivos do shadcn/ui em vez de criar do zero
3. **Estilo**: Usar tokens semânticos do Tailwind (nunca cores hardcoded)
4. **Tipos**: Definir interfaces para props. Tipos compartilhados vão em `lib/types.ts`
5. **API**: Usar `api` de `@/lib/api` para client components. `fetch()` apenas em Server Components
6. **Estado**: Usar contexts existentes (`useAuth`, `useCart`). Estado local para formulários
7. **Erros**: Tratar erros de API com `try/catch` e exibir feedback ao usuário
8. **Responsividade**: Sempre construir mobile-first com breakpoints `sm:`, `md:`, `lg:`
9. **Acessibilidade**: Usar labels em formulários, alt em imagens, roles semânticos
10. **Performance**: Usar `Suspense` com `loading.tsx` para code-splitting de rotas
