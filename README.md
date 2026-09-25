# Delosi E-commerce — Evaluación Técnica Frontend Senior

Catálogo y detalle de producto construido sobre Next.js 16 (App Router), consumiendo la API pública [Fake Store API](https://fakestoreapi.com), con una arquitectura **modular por features (Vertical Slice)**: hooks para la lógica de cliente, componentes presentacionales que solo reciben props y `page.tsx` como capa delgada de composición.

## Stack

- **Next.js 16** (App Router, React 19, Turbopack)
- **TypeScript** estricto
- **Zustand** — estado global del carrito
- **`fetch` de Next.js** — cliente HTTP con Data Cache (`revalidate`)
- **Tailwind CSS 4**
- **Jest + React Testing Library** — testing unitario/integración

## Cómo correr el proyecto

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # build de producción
npm run start     # sirve el build de producción
npm test          # corre la suite de tests
npm run test:watch
npm run test:coverage
npm run lint      # ESLint (eslint-config-next + eslint-config-prettier)
npm run format    # Prettier — formatea todo el repo
npm run format:check
```

No requiere variables de entorno. La URL base de la API (`https://fakestoreapi.com`) está en `src/modules/products/api.ts`. Opcional: `SITE_URL` (p. ej. `https://tienda.delosi.com`) fija el dominio usado en canonicals, Open Graph, JSON-LD, sitemap y robots. Si no se define, se usa `VERCEL_PROJECT_PRODUCTION_URL` / `VERCEL_URL` (Vercel las inyecta solas) y, en local, `http://localhost:3000`.

## Arquitectura

```
src/
├── app/                          # Rutas y shell (App Router) — composición, sin lógica de negocio
│   ├── layout.tsx                # compone Header + CartButton, Footer, WebVitals y el drawer
│   ├── Header.tsx / Footer.tsx   # chrome de la app; el carrito entra al header por children
│   ├── WebVitals.tsx             # medición RUM, montada una sola vez
│   ├── globals.css
│   ├── page.tsx                  # PLP: generateMetadata (canonical por categoría) + Suspense/Skeleton
│   ├── robots.ts / sitemap.ts    # robots.txt y sitemap.xml (home, categorías y las PDP)
│   ├── api/vitals/route.ts       # recibe los Web Vitals del navegador y los registra
│   ├── products/[id]/page.tsx    # PDP: generateStaticParams + generateMetadata (SEO/OG) + notFound()
│   └── error.tsx / not-found.tsx
│
├── shared/                       # Kernel compartido (técnico, no de dominio)
│   ├── lib/                      # siteUrl (URL base para SEO), webVitals (medición y validación)
│   ├── ui/                       # primitivas visuales (Skeleton)
│   └── hooks/                    # hooks genéricos (useMounted)
│
└── modules/                      # Un módulo = una feature
    ├── products/
    │   ├── types.ts              # Product, ProductFilters, SortOption
    │   ├── api.ts                # getProducts / getProductById / getCategories (fetch + caché)
    │   ├── lib/                  # funciones puras: filterAndSortProducts, parseProductFilters
    │   ├── hooks/                # useProductFilters (la URL es la fuente de verdad)
    │   ├── components/           # ProductCard, SearchBar, CategoryFilters, SortSelect, ProductJsonLd, skeleton — solo props
    │   └── views/                # CatalogData (servidor), ProductCatalogView, ProductDetailView — componen hooks + componentes
    │
    └── cart/
        ├── types.ts              # CartItem
        ├── lib/                  # addItemToCart, removeItemFromCart, updateCartItemQuantity (funciones puras)
        ├── hooks/                # useCartStore (Zustand + persist), useCartDrawerStore
        └── components/           # CartButton, CartDrawer, AddToCartButton
```

Reglas del proyecto:

- **Screaming architecture**: las carpetas hablan del negocio (`products`, `cart`), no de capas técnicas.
- **Server first**: el fetch inicial ocurre en Server Components (`page.tsx` → `api.ts`). Los hooks quedan solo para estado de cliente (filtros, carrito, drawer).
- **Componentes presentacionales**: reciben datos y callbacks por props (p. ej. `ProductCard` recibe `onAddToCart`). La lógica de negocio vive en funciones puras (`lib/`) testeables sin React.
- **Dirección de dependencias**: `shared` no importa módulos. `products` usa el carrito (botón "agregar") y `cart` solo importa los tipos de `products`. El layout es el punto de composición: mete `CartButton` dentro de `Header`.

### Filtros, SEO y URL

Categoría, búsqueda y orden viven en la URL (`/?category=jewelery&search=bag&sortBy=price-asc`). `page.tsx` lee `searchParams` en el servidor, valida los valores (`parseProductFilters`) y filtra con `filterAndSortProducts` antes de renderizar, por lo que **cada URL filtrada llega con su HTML completo**: es compartible e indexable. En el cliente, `useProductFilters` solo reescribe la query con `router.replace` dentro de una transición (el grid se atenúa mientras el servidor responde).

### SEO

- **Metadata dinámica** en la PDP (título, descripción y Open Graph desde el producto, incluida `og:image`); Next genera además la Twitter Card. La PLP y sus categorías también comparten una imagen de vista previa de 1200×630. Un producto inexistente devuelve 404 real con `noindex`.
- **Canonical y `og:url`** en todas las páginas, resueltos con `metadataBase` (ver `SITE_URL` arriba). Cada **categoría** es una página indexable con título, descripción y canonical propios (`/?category=jewelery`); las variantes de búsqueda y orden canonicalizan a la categoría (o a `/`) para no competir como contenido duplicado. Una categoría desconocida cae a la home.
- **JSON-LD `Product`** (schema.org) en la PDP, con precio, disponibilidad y `aggregateRating`, para rich results. El `<` se escapa para que el texto del producto no pueda cerrar el `<script>`.
- **`robots.txt` y `sitemap.xml`** generados con `robots.ts` / `sitemap.ts`: el sitemap lista la home, las 4 categorías y las 20 PDP, y se regenera cada hora. Si la API cae, devuelve solo la home en vez de fallar.
- `<html lang="es">`, un único `<h1>` por página y `alt` en las imágenes.

### Performance y Web Vitals

- **Medición real de usuarios (RUM):** el componente `WebVitals` (montado en el layout) usa `useReportWebVitals` de Next y envía cada métrica con `navigator.sendBeacon` (con `fetch keepalive` de respaldo) a `POST /api/vitals`, que la valida y escribe **una línea de log estructurada** por métrica (en Vercel: Runtime Logs, buscando `[web-vitals]`). En desarrollo solo se imprime en consola.
- **Orientado a e-commerce:** cada métrica viaja etiquetada con el tipo de página (`plp` listado, `pdp` detalle u `other`) y su `rating` (`good` / `needs-improvement` / `poor`), así se compara cómo rinde el catálogo frente al detalle de producto en lugar de mezclar todo.
- **Métricas y umbrales** (Google, percentil 75): LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1, FCP ≤ 1.8 s, TTFB ≤ 0.8 s. El endpoint rechaza (400) cualquier payload que no sea una de esas cinco con valores válidos.
- **Cómo se cuida cada una:** LCP con `priority` en la imagen principal de la PLP y la PDP y `next/image` con `sizes`; CLS con dimensiones/aspect-ratio reservados en imágenes, `next/font` y skeletons con una estructura equivalente al contenido final y un Header de altura fija; INP con el debounce de 450 ms en la búsqueda y las transiciones de React (`useTransition`) al filtrar; TTFB con Data Cache, ISR en la PDP y streaming en la PLP.
- Alternativa sin código propio si el despliegue es en Vercel: `@vercel/speed-insights`.

### Caché y resiliencia

- `fetch` con `next: { revalidate: 3600 }`: la respuesta de FakeStoreAPI se guarda en el Data Cache y se revalida cada hora, incluso con la PLP renderizada dinámicamente. `React.cache()` deduplica llamadas dentro del mismo render (p. ej. `generateMetadata` + página).
- La PDP usa `generateStaticParams` + `revalidate = 3600`: los 20 productos se prerenderizan y se refrescan por ISR. Ids inexistentes o inválidos devuelven un **404 real** (`notFound()`).
- **Fallos de la API**: si FakeStoreAPI responde con error, hace timeout o devuelve una respuesta vacía, `api.ts` lanza el error y `error.tsx` muestra un estado de error con botón de reintento. No se sirven datos de respaldo: un precio inventado o desactualizado es peor que un error visible. Si la API ya respondió bien antes, el Data Cache sigue sirviendo el último dato válido mientras se revalida.
- `generateStaticParams` tolera una API caída durante el build (devuelve `[]` y las PDP se renderizan bajo demanda), y `not-found.tsx` cubre rutas inexistentes.

## Justificación: gestión de estado del carrito

Se eligió **Zustand con persistencia en localStorage** (estado de cliente puro) en lugar de estado de servidor o Context API:

- **Predictibilidad**: el store expone acciones explícitas (`addItem`, `removeItem`, `updateQuantity`, `clearCart`) que delegan en funciones puras con actualizaciones inmutables — el estado del carrito es trazable y testeable sin mocks de red.
- **Impacto en memoria**: Zustand no re-renderiza el árbol completo en cada cambio (a diferencia de Context), y el store completo pesa unos pocos KB.
- **No se eligió estado de servidor** porque el carrito no requiere persistencia multi-dispositivo para el alcance de este reto — el requisito mínimo (botón "Agregar al carrito" reflejando el conteo en el Header) no exige un backend de carrito.

## Alcance: qué pide el reto vs. qué se implementó de más

El documento de evaluación pide en la PDP únicamente: _"botón funcional de Agregar al carrito que interactúe con un estado global, reflejando el incremento de ítems en el Header"_. Eso está cubierto por `useCartStore` + `AddToCartButton` + `CartButton`.

Como iniciativa adicional (sección "Factor Proactividad" del reto) se implementó además:

- Un `CartDrawer` completo: gestión de cantidades, eliminar ítems, vaciar carrito y un botón de checkout simulado.
- Streaming con Suspense + Skeleton en la PLP: el shell y el skeleton salen en el primer byte y el contenido real llega por streaming.
- Resiliencia ante fallos de la API (`error.tsx` con reintento, estados vacíos) y control de caché/revalidación (ver arriba).
- Optimización de imágenes externas con `next/image` (`remotePatterns` para `fakestoreapi.com`).
- Metadata propia (título, descripción, Open Graph) también en la PLP, no solo en la PDP.

## Testing

Suite con Jest + React Testing Library, tests nombrados en estilo BDD (`describe`/`it` como especificación de comportamiento), cubriendo los flujos críticos de negocio:

- `filterAndSortProducts.test.ts` / `parseProductFilters.test.ts` — reglas de filtrado/búsqueda/orden y validación de la URL como funciones puras.
- `api.test.ts` — el consumo de la API: caché (`revalidate`), error ante status/red/respuesta vacía, e id inexistente → `null`.
- `useProductFilters.test.ts` — los filtros se escriben en la URL conservando los demás parámetros.
- `ProductCatalogView.test.tsx` — integración: renderiza lo que entrega el servidor, estado vacío, delega filtros/orden al hook y agrega al carrito sin abrir el drawer.
- `ProductCard.test.tsx` — el componente presentacional llama a `onAddToCart` y enlaza a la PDP.
- `CatalogData.test.tsx` — el Server Component aplica en el servidor los filtros de la URL (categoría, búsqueda, orden), el estado vacío y deja pasar los errores de la API al `error.tsx`.
- `app/page.test.tsx` — SEO de la PLP: canonical por categoría, normalización de mayúsculas y caracteres especiales, y variantes de búsqueda/orden canonicalizadas.
- `webVitals.test.ts` / `WebVitals.test.tsx` / `api/vitals/route.test.ts` — clasificación PLP/PDP, validación del payload (rechaza métricas y valores inválidos), envío con `sendBeacon` o `fetch`, solo-log en desarrollo y el endpoint (204/400).
- `ProductJsonLd.test.tsx` / `siteUrl.test.ts` / `robots.test.ts` / `sitemap.test.ts` — datos estructurados (incluido el escape anti-XSS), resolución del dominio (`SITE_URL` → Vercel → localhost) y el sitemap, también con la API caída.
- `addItemToCart.test.ts` / `updateCartItemQuantity.test.ts` — reglas de negocio del carrito (merge de duplicados, clamp de cantidad ≥ 1).
- `useCartStore.test.ts` — el store orquesta esas reglas y persiste el resultado.
- `AddToCartButton.test.tsx` / `CartButton.test.tsx` / `CartDrawer.test.tsx` — agregar desde la PDP abre el drawer, el contador del Header refleja el total, cantidades, vaciar, cerrar (botón, fondo, Escape) y completar la compra vacía el carrito. Los `*.ssr.test.tsx` verifican que antes de la hidratación no se filtre el carrito persistido en `localStorage` al HTML.
- `SearchBar.test.tsx` — debounce de la búsqueda, botón Buscar, limpiar y sincronía con la URL.
- `ProductDetailView.test.tsx` — la PDP muestra los datos del producto, el rating y el botón de compra.
- `app/products/[id]/page.test.tsx` — `generateMetadata` (título, descripción y Open Graph desde el producto), `generateStaticParams` tolerante a una API caída, y **404 real** para ids inexistentes o inválidos.
- `error.test.tsx` / `not-found.test.tsx` — el error boundary registra el error y permite reintentar; la 404 enlaza al catálogo.

```bash
npm test
npm run test:coverage
```

`collectCoverageFrom` cubre `src/modules/**`, `src/shared/**`, el shell de `app` (`Header`, `Footer`, `WebVitals`), `error.tsx`, `not-found.tsx` y la página de la PDP (tipos y fixtures de test excluidos). `jest.config.ts` define un **umbral global de 80%** (statements, branches, functions y lines): `npm run test:coverage` falla si baja de ahí. Solo queda fuera de la métrica `layout.tsx`, que es composición pura del shell (fuentes, Header, Footer, carrito).

## Pendientes / siguientes pasos

- Tests E2E (Playwright) del flujo completo catálogo → filtro → detalle → carrito.
- Persistir los Web Vitals en un destino de análisis (hoy solo se registran en logs) y definir alertas sobre los umbrales.
