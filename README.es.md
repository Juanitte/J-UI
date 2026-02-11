# J-UI

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> **🇬🇧 [Read in English](./README.md)**

Una libreria de componentes React moderna y ligera con soporte integrado de temas.

## Tabla de Contenidos

- [Caracteristicas](#caracteristicas)
- [Instalacion](#instalacion)
- [Inicio Rapido](#inicio-rapido)
- [Sistema de Temas](#sistema-de-temas)
  - [ThemeProvider](#themeprovider)
  - [Hook useTheme](#hook-usetheme)
  - [Sistema de Colores](#sistema-de-colores)
  - [Theme Tokens](#theme-tokens)
- [Componentes](#componentes)
  - [AutoComplete](#autocomplete)
  - [Anchor](#anchor)
  - [Badge](#badge)
  - [Breadcrumb](#breadcrumb)
  - [Bubble](#bubble)
  - [Button](#button)
  - [Checkbox](#checkbox)
  - [ColorPicker](#colorpicker)
  - [DatePicker](#datepicker)
  - [Divider](#divider)
  - [Dropdown](#dropdown)
  - [Form](#form)
  - [Flex](#flex)
  - [Grid](#grid)
  - [Layout](#layout)
  - [Menu](#menu)
  - [NestedSelect](#nestedselect)
  - [Pagination](#pagination)
  - [Space](#space)
  - [Splitter](#splitter)
  - [Steps](#steps)
  - [Tabs](#tabs)
  - [Text](#text)
  - [Waterfall](#waterfall)
  - [Tooltip](#tooltip)

## Caracteristicas

- Completamente tipado con TypeScript
- Soporte integrado de modo claro/oscuro
- Generacion automatica de paletas de colores
- Variables CSS para facil personalizacion
- Tree-shakeable y ligero
- Compatible con React 18 y 19

## Instalacion

```bash
# npm
npm install j-ui

# yarn
yarn add j-ui

# pnpm
pnpm add j-ui
```

## Inicio Rapido

Envuelve tu aplicacion con `ThemeProvider` y comienza a usar los componentes:

```tsx
import { ThemeProvider, Button, Tooltip } from 'j-ui'

function App() {
  return (
    <ThemeProvider>
      <Tooltip content="Haz clic!">
        <Button>Hola J-UI</Button>
      </Tooltip>
    </ThemeProvider>
  )
}
```

---

## Sistema de Temas

J-UI incluye un potente sistema de temas que genera automaticamente paletas de colores y maneja el cambio entre modo claro y oscuro.

### ThemeProvider

El componente `ThemeProvider` debe envolver tu aplicacion para habilitar la funcionalidad de temas.

#### Props

| Prop | Tipo | Por Defecto | Descripcion |
|------|------|-------------|-------------|
| `children` | `ReactNode` | — | Contenido de la aplicacion |
| `config` | `ThemeConfig` | `{}` | Objeto de configuracion del tema |

#### ThemeConfig

```typescript
interface ThemeConfig {
  colors?: ThemeColors      // Paleta de colores personalizada
  defaultMode?: ThemeMode   // 'light' | 'dark'
}

interface ThemeColors {
  primary?: string    // Por defecto: '#8c75d1'
  secondary?: string  // Por defecto: '#78808b'
  success?: string    // Por defecto: '#79bc58'
  warning?: string    // Por defecto: '#d5ac59'
  error?: string      // Por defecto: '#d7595b'
  info?: string       // Por defecto: '#6591c7'
}
```

#### Uso

```tsx
// Uso basico
<ThemeProvider>
  <App />
</ThemeProvider>

// Con configuracion personalizada
<ThemeProvider
  config={{
    defaultMode: 'dark',
    colors: {
      primary: '#FF6B6B',
      success: '#4ECDC4'
    }
  }}
>
  <App />
</ThemeProvider>
```

### Hook useTheme

Accede y controla el tema actual desde cualquier componente dentro del `ThemeProvider`.

```typescript
const { mode, setMode, toggleMode } = useTheme()
```

#### Retorna

| Propiedad | Tipo | Descripcion |
|-----------|------|-------------|
| `mode` | `'light' \| 'dark'` | Modo actual del tema |
| `setMode` | `(mode: ThemeMode) => void` | Establece el modo explicitamente |
| `toggleMode` | `() => void` | Alterna entre claro y oscuro |

#### Ejemplo

```tsx
import { useTheme, Button } from 'j-ui'

function CambiarTema() {
  const { mode, toggleMode } = useTheme()

  return (
    <Button onClick={toggleMode}>
      Actual: {mode}
    </Button>
  )
}
```

### Sistema de Colores

J-UI genera automaticamente 10 tonos (50-900) para cada color semantico. Estan disponibles como variables CSS:

```css
/* Color base */
var(--j-primary)

/* Variantes de color */
var(--j-primary-50)   /* Mas claro */
var(--j-primary-100)
var(--j-primary-200)
var(--j-primary-300)
var(--j-primary-400)
var(--j-primary-500)
var(--j-primary-600)
var(--j-primary-700)
var(--j-primary-800)
var(--j-primary-900)  /* Mas oscuro */

/* Alias semanticos */
var(--j-primary-light)     /* Variante clara */
var(--j-primary-dark)      /* Variante oscura */
var(--j-primary-hover)     /* Estado hover */
var(--j-primary-border)    /* Color de borde */
var(--j-primary-contrast)  /* Color de texto con contraste */
```

#### Colores Neutros

Estos se adaptan automaticamente segun el modo actual del tema:

| Variable | Descripcion |
|----------|-------------|
| `--j-bg` | Color de fondo |
| `--j-bgSubtle` | Fondo sutil |
| `--j-bgMuted` | Fondo atenuado |
| `--j-border` | Color de borde |
| `--j-borderHover` | Color de borde en hover |
| `--j-text` | Color de texto principal |
| `--j-textMuted` | Texto atenuado |
| `--j-textSubtle` | Texto sutil |
| `--j-shadowSm` | Sombra pequena |
| `--j-shadowMd` | Sombra mediana |
| `--j-shadowLg` | Sombra grande |

### Theme Tokens

J-UI proporciona un objeto `tokens` con referencias tipadas a todas las variables CSS. Esto habilita autocompletado en tu IDE y estilos type-safe en JavaScript/TypeScript.

#### Importar

```tsx
import { tokens } from 'j-ui'
```

#### Uso

```tsx
// En estilos inline
<div style={{
  backgroundColor: tokens.colorPrimaryBg,
  color: tokens.colorPrimary,
  boxShadow: tokens.shadowMd
}}>
  Estilizado con tokens
</div>

// En styled-components, emotion, etc.
const StyledCard = styled.div`
  background: ${tokens.colorBgSubtle};
  border: 1px solid ${tokens.colorBorder};
`
```

#### Tokens Disponibles

**Colores Semanticos** (para cada uno: primary, secondary, success, warning, error, info):

| Token | Variable CSS |
|-------|--------------|
| `tokens.colorPrimary` | `var(--j-primary)` |
| `tokens.colorPrimaryHover` | `var(--j-primary-hover)` |
| `tokens.colorPrimaryBg` | `var(--j-primary-dark)` |
| `tokens.colorPrimaryBorder` | `var(--j-primary-border)` |
| `tokens.colorPrimaryContrast` | `var(--j-primary-contrast)` |
| `tokens.colorPrimary50` - `tokens.colorPrimary900` | `var(--j-primary-50)` - `var(--j-primary-900)` |

**Colores Neutros**:

| Token | Variable CSS |
|-------|--------------|
| `tokens.colorBg` | `var(--j-bg)` |
| `tokens.colorBgSubtle` | `var(--j-bgSubtle)` |
| `tokens.colorBgMuted` | `var(--j-bgMuted)` |
| `tokens.colorBorder` | `var(--j-border)` |
| `tokens.colorBorderHover` | `var(--j-borderHover)` |
| `tokens.colorText` | `var(--j-text)` |
| `tokens.colorTextMuted` | `var(--j-textMuted)` |
| `tokens.colorTextSubtle` | `var(--j-textSubtle)` |

**Sombras**:

| Token | Variable CSS |
|-------|--------------|
| `tokens.shadowSm` | `var(--j-shadowSm)` |
| `tokens.shadowMd` | `var(--j-shadowMd)` |
| `tokens.shadowLg` | `var(--j-shadowLg)` |

---

## Estilos Semánticos del DOM

La mayoría de componentes de J-UI exponen las props `classNames` y `styles` que permiten estilizar sus partes internas (slots semánticos) sin necesidad de sobreescribir CSS o inspeccionar la estructura del DOM.

### Cómo funciona

Cada componente define **slots** con nombre que representan sus partes internas. Puedes aplicar estilos a estos slots usando:

- **`classNames`** — aplicar clases CSS a partes internas específicas
- **`styles`** — aplicar estilos inline a partes internas específicas

```tsx
// Aplicar una clase CSS al popup de un Tooltip
<Tooltip
  content="Hola"
  classNames={{ popup: 'mi-popup-personalizado' }}
>
  <Button>Pasa el cursor</Button>
</Tooltip>

// Aplicar estilos inline al icono y contenido de un Button
<Button
  icon={<SearchIcon />}
  styles={{
    icon: { color: 'red' },
    content: { fontWeight: 'bold' },
  }}
>
  Buscar
</Button>
```

### Orden de prioridad

Los estilos se fusionan con la siguiente prioridad (el mayor gana):

1. **Estilos base del componente** — valores internos por defecto
2. **`styles.slot`** — estilos semánticos para cada slot
3. **`style` prop** — prop de estilo directo (solo aplica a `root`)

Para `className`, el `className` del componente y `classNames.root` se fusionan juntos.

### Slots disponibles por componente

| Componente | Slots |
|------------|-------|
| AutoComplete | `root`, `input`, `dropdown`, `option` |
| Anchor | `root`, `track`, `indicator`, `link` |
| Badge | `root`, `icon`, `content` |
| Breadcrumb | `root`, `list`, `item`, `separator`, `link`, `overlay` |
| Bubble | `root`, `icon`, `badge`, `tooltip`, `tooltipArrow` |
| Bubble.Menu | `root`, `trigger`, `menu` |
| Button | `root`, `icon`, `spinner`, `content` |
| Checkbox | `root`, `checkbox`, `indicator`, `label` |
| Checkbox.Group | `root` |
| ColorPicker | `root`, `trigger`, `panel`, `presets` |
| DatePicker | `root`, `input`, `popup`, `header`, `body`, `cell`, `footer` |
| Divider | `root`, `line`, `text` |
| Dropdown | `root`, `overlay`, `item`, `arrow` |
| Form | `root` |
| Form.Item | `root`, `label`, `control`, `help`, `extra` |
| Layout.Sider | `root`, `content`, `trigger` |
| Menu | `root`, `item`, `submenu`, `group`, `groupTitle`, `divider` |
| NestedSelect | `root`, `selector`, `dropdown`, `menu`, `option` |
| Pagination | `root`, `item`, `options` |
| Space | `root`, `item`, `separator` |
| Splitter | `root`, `panel`, `bar`, `collapseButton` |
| Steps | `root`, `step`, `icon`, `content`, `tail` |
| Tabs | `root`, `tabBar`, `tab`, `content`, `inkBar` |
| Text | `root`, `content`, `copyButton`, `expandButton` |
| Tooltip | `root`, `popup`, `arrow` |
| Waterfall | `root`, `column`, `item` |

---

## Componentes

<details>
<summary><strong>AutoComplete</strong> - Input con sugerencias desplegables automáticas</summary>

### AutoComplete

Un componente de input con sugerencias de autocompletado. Soporta filtrado, opciones agrupadas, navegación por teclado, backfill, estado controlado/no controlado, múltiples variantes visuales, estado de validación, botón de limpieza y posicionamiento automático del desplegable.

#### Importar

```tsx
import { AutoComplete } from 'j-ui'
```

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `options` | `AutoCompleteOption[]` | `[]` | Opciones disponibles |
| `value` | `string` | — | Valor del input (controlado) |
| `defaultValue` | `string` | `''` | Valor inicial del input (no controlado) |
| `placeholder` | `string` | — | Texto placeholder del input |
| `open` | `boolean` | — | Visibilidad del desplegable (controlado) |
| `defaultOpen` | `boolean` | `false` | Visibilidad inicial del desplegable |
| `disabled` | `boolean` | `false` | Deshabilitar el componente |
| `allowClear` | `boolean` | `false` | Mostrar botón de limpieza |
| `autoFocus` | `boolean` | `false` | Enfocar el input al montar |
| `backfill` | `boolean` | `false` | Rellenar el input con la opción resaltada al navegar con teclado |
| `defaultActiveFirstOption` | `boolean` | `true` | Resaltar automáticamente la primera opción |
| `variant` | `'outlined' \| 'filled' \| 'borderless'` | `'outlined'` | Variante visual del input |
| `status` | `'error' \| 'warning'` | — | Estado de validación |
| `filterOption` | `boolean \| (inputValue, option) => boolean` | `true` | Función de filtrado. `true` = incluye insensible a mayúsculas, `false` = sin filtro |
| `notFoundContent` | `ReactNode` | `null` | Contenido cuando no hay coincidencias. `null` = ocultar desplegable |
| `popupMatchSelectWidth` | `boolean \| number` | `true` | `true` = igualar ancho del input, número = ancho fijo |
| `onChange` | `(value: string) => void` | — | Llamado cuando cambia el valor |
| `onSearch` | `(value: string) => void` | — | Llamado cuando el usuario escribe |
| `onSelect` | `(value, option) => void` | — | Llamado al seleccionar una opción |
| `onFocus` | `(e) => void` | — | Llamado al obtener foco |
| `onBlur` | `(e) => void` | — | Llamado al perder foco |
| `onDropdownVisibleChange` | `(open: boolean) => void` | — | Llamado cuando cambia la visibilidad del desplegable |
| `onClear` | `() => void` | — | Llamado al limpiar el input |
| `prefix` | `ReactNode` | — | Contenido prefix del input (ej. icono a la izquierda) |
| `suffix` | `ReactNode` | — | Contenido suffix del input (ej. icono a la derecha) |
| `className` | `string` | — | Clase CSS para el elemento raíz |
| `style` | `CSSProperties` | — | Estilos inline para el elemento raíz |
| `classNames` | `AutoCompleteClassNames` | — | Clases CSS para partes internas |
| `styles` | `AutoCompleteStyles` | — | Estilos inline para partes internas |

#### Tipos

```tsx
type AutoCompleteVariant = 'outlined' | 'filled' | 'borderless'

type AutoCompleteStatus = 'error' | 'warning'

interface AutoCompleteOption {
  value: string
  label?: ReactNode
  disabled?: boolean
  options?: AutoCompleteOption[]  // para opciones agrupadas
}
```

#### DOM Semántico

| Slot | Descripción |
|------|-------------|
| `root` | Contenedor exterior |
| `input` | Elemento input |
| `dropdown` | Contenedor de sugerencias desplegable |
| `option` | Elemento individual de opción |

#### Ejemplos

**Uso básico**

```tsx
<AutoComplete
  options={[
    { value: 'React' },
    { value: 'Vue' },
    { value: 'Angular' },
  ]}
  placeholder="Buscar framework..."
/>
```

**Valor controlado**

```tsx
const [value, setValue] = useState('')

<AutoComplete
  value={value}
  onChange={setValue}
  options={[
    { value: 'React' },
    { value: 'Vue' },
    { value: 'Angular' },
  ]}
/>
```

**Labels personalizados**

```tsx
<AutoComplete
  options={[
    { value: 'react', label: <span><strong>React</strong> - Una librería JavaScript</span> },
    { value: 'vue', label: <span><strong>Vue</strong> - El Framework Progresivo</span> },
  ]}
/>
```

**Opciones agrupadas**

```tsx
<AutoComplete
  options={[
    {
      value: 'frameworks',
      label: 'Frameworks',
      options: [
        { value: 'React' },
        { value: 'Vue' },
      ],
    },
    {
      value: 'lenguajes',
      label: 'Lenguajes',
      options: [
        { value: 'TypeScript' },
        { value: 'JavaScript' },
      ],
    },
  ]}
/>
```

**Filtro personalizado**

```tsx
<AutoComplete
  filterOption={(inputValue, option) =>
    option.value.toUpperCase().startsWith(inputValue.toUpperCase())
  }
  options={[
    { value: 'React' },
    { value: 'Redux' },
    { value: 'Vue' },
  ]}
/>
```

**Sin filtrado (búsqueda asíncrona)**

```tsx
const [options, setOptions] = useState([])

<AutoComplete
  filterOption={false}
  options={options}
  onSearch={async (text) => {
    const results = await fetchSuggestions(text)
    setOptions(results.map((r) => ({ value: r })))
  }}
/>
```

**Modo backfill**

```tsx
<AutoComplete
  backfill
  options={[
    { value: 'manzana' },
    { value: 'banana' },
    { value: 'cereza' },
  ]}
/>
```

**Prefix y Suffix**

```tsx
// Solo prefix
<AutoComplete
  prefix={<MailIcon />}
  options={[{ value: 'Opción 1' }, { value: 'Opción 2' }]}
  placeholder="Con prefix"
/>

// Solo suffix
<AutoComplete
  suffix={<SearchIcon />}
  options={[{ value: 'Opción 1' }, { value: 'Opción 2' }]}
  placeholder="Con suffix"
/>

// Prefix + Suffix + Limpiar
<AutoComplete
  prefix={<GlobeIcon />}
  suffix={<SearchIcon />}
  allowClear
  options={[{ value: 'Opción 1' }, { value: 'Opción 2' }]}
  placeholder="Con ambos"
/>
```

**Variantes**

```tsx
<AutoComplete variant="outlined" options={[...]} placeholder="Outlined" />
<AutoComplete variant="filled" options={[...]} placeholder="Filled" />
<AutoComplete variant="borderless" options={[...]} placeholder="Borderless" />
```

**Estado de validación**

```tsx
<AutoComplete status="error" options={[...]} placeholder="Error" />
<AutoComplete status="warning" options={[...]} placeholder="Warning" />
```

**Contenido sin resultados**

```tsx
<AutoComplete
  options={[]}
  notFoundContent="No se encontraron resultados"
  placeholder="Buscar..."
/>
```

**Deshabilitado**

```tsx
<AutoComplete disabled options={[{ value: 'React' }]} value="React" />
```

</details>

---

<details>
<summary><strong>Anchor</strong> - Enlaces de navegación que rastrean la posición del scroll</summary>

### Anchor

Un componente de navegación que renderiza una lista de enlaces ancla y resalta el activo según la posición del scroll. Soporta layout vertical y horizontal con enlaces anidados.

#### Importar

```tsx
import { Anchor } from 'j-ui'
```

#### Props

| Prop | Tipo | Por Defecto | Descripción |
|------|------|-------------|-------------|
| `items` | `AnchorLinkItemProps[]` | `[]` | Lista declarativa de enlaces ancla |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | Dirección de la navegación |
| `offsetTop` | `number` | `0` | Offset en px desde el top al calcular la posición del scroll |
| `targetOffset` | `number` | `offsetTop` | Offset del destino al hacer scroll al hacer clic |
| `bounds` | `number` | `5` | Distancia de tolerancia en px para detectar la sección activa |
| `getContainer` | `() => HTMLElement \| Window` | `() => window` | Contenedor scrollable |
| `getCurrentAnchor` | `(activeLink: string) => string` | — | Función personalizada para determinar el enlace activo |
| `onChange` | `(currentActiveLink: string) => void` | — | Callback cuando cambia el enlace activo |
| `onClick` | `(e: MouseEvent, link: { title: ReactNode; href: string }) => void` | — | Callback al hacer clic en un enlace |
| `replace` | `boolean` | `false` | Usar `replaceState` en vez de `pushState` para la URL |
| `className` | `string` | — | Clase CSS adicional |
| `style` | `CSSProperties` | — | Estilos inline adicionales |

#### AnchorLinkItemProps

```typescript
interface AnchorLinkItemProps {
  key: string            // Clave única del enlace
  href: string           // Destino del enlace (debe empezar con #)
  title: ReactNode       // Contenido del enlace
  children?: AnchorLinkItemProps[]  // Enlaces hijos (solo en vertical)
}
```

#### DOM Semántico

| Slot | Descripción |
|------|-------------|
| `root` | Elemento contenedor exterior |
| `track` | Línea de fondo (modo vertical) |
| `indicator` | Indicador del enlace activo |
| `link` | Enlace ancla individual |

#### Ejemplos

```tsx
// Anchor vertical básico
<Anchor
  items={[
    { key: 'seccion1', href: '#seccion1', title: 'Sección 1' },
    { key: 'seccion2', href: '#seccion2', title: 'Sección 2' },
    { key: 'seccion3', href: '#seccion3', title: 'Sección 3' },
  ]}
/>

// Anchor horizontal
<Anchor
  direction="horizontal"
  items={[
    { key: 'resumen', href: '#resumen', title: 'Resumen' },
    { key: 'caracteristicas', href: '#caracteristicas', title: 'Características' },
    { key: 'api', href: '#api', title: 'API' },
  ]}
/>

// Enlaces anidados (solo vertical)
<Anchor
  items={[
    {
      key: 'componentes',
      href: '#componentes',
      title: 'Componentes',
      children: [
        { key: 'button', href: '#button', title: 'Button' },
        { key: 'input', href: '#input', title: 'Input' },
      ],
    },
    { key: 'hooks', href: '#hooks', title: 'Hooks' },
  ]}
/>

// Con offset (ej. para header fijo)
<Anchor
  offsetTop={64}
  items={[
    { key: 'intro', href: '#intro', title: 'Introducción' },
    { key: 'guia', href: '#guia', title: 'Guía' },
  ]}
/>

// Contenedor de scroll personalizado
<Anchor
  getContainer={() => document.getElementById('mi-contenedor')!}
  items={[
    { key: 'parte1', href: '#parte1', title: 'Parte 1' },
    { key: 'parte2', href: '#parte2', title: 'Parte 2' },
  ]}
/>

// Con callback onChange
<Anchor
  onChange={(activeLink) => console.log('Activo:', activeLink)}
  items={[
    { key: 'a', href: '#a', title: 'Sección A' },
    { key: 'b', href: '#b', title: 'Sección B' },
  ]}
/>

// Reemplazar URL en vez de push
<Anchor
  replace
  items={[
    { key: 'tab1', href: '#tab1', title: 'Tab 1' },
    { key: 'tab2', href: '#tab2', title: 'Tab 2' },
  ]}
/>
```

</details>

---

<details>
<summary><strong>Badge</strong> - Etiqueta compacta para estados y metadatos</summary>

### Badge

Un componente de etiqueta compacto para mostrar estados, categorias o metadatos.

#### Importar

```tsx
import { Badge } from 'j-ui'
// Opcionalmente importa tokens para colores type-safe
import { Badge, tokens } from 'j-ui'
```

#### Props

| Prop | Tipo | Por Defecto | Descripcion |
|------|------|-------------|-------------|
| `children` | `ReactNode` | — | Contenido del badge |
| `bgColor` | `string` | `'var(--j-primary-light)'` | Color de fondo (color CSS, variable CSS, o token) |
| `color` | `string` | `'var(--j-primary)'` | Color del texto y borde (color CSS, variable CSS, o token) |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | Radio del borde |
| `icon` | `ReactNode` | — | Icono opcional a la izquierda |
| `bordered` | `boolean` | `true` | Mostrar borde |

#### Opciones de Radio

| Radio | Valor |
|-------|-------|
| `none` | 0 |
| `sm` | 4px |
| `md` | 6px |
| `lg` | 12px |
| `full` | 9999px (forma de pastilla) |

#### DOM Semántico

| Slot | Descripción |
|------|-------------|
| `root` | Elemento contenedor exterior |
| `icon` | Elemento del icono |
| `content` | Elemento del contenido de texto |

#### Ejemplos

```tsx
// Basico
<Badge>Nuevo</Badge>

// Usando tokens (recomendado - type-safe con autocompletado)
<Badge bgColor={tokens.colorSuccess100} color={tokens.colorSuccess}>
  Activo
</Badge>

<Badge bgColor={tokens.colorError100} color={tokens.colorError}>
  Expirado
</Badge>

<Badge bgColor={tokens.colorWarning100} color={tokens.colorWarning}>
  Pendiente
</Badge>

// Usando variables CSS directamente
<Badge bgColor="var(--j-info-light)" color="var(--j-info)">
  Info
</Badge>

// Diferentes radios
<Badge radius="none">Cuadrado</Badge>
<Badge radius="full">Pastilla</Badge>

// Con icono
<Badge icon={<CheckIcon />}>Verificado</Badge>

// Sin borde
<Badge bordered={false}>Sutil</Badge>

// Colores personalizados (cualquier color CSS)
<Badge bgColor="#ffe4e6" color="#be123c">
  Rosa Personalizado
</Badge>
```

</details>

---

<details>
<summary><strong>Breadcrumb</strong> - Ruta de navegación tipo migas de pan</summary>

### Breadcrumb

Un componente de navegación que muestra la ubicación actual dentro de una estructura jerárquica. Soporta separadores personalizados, iconos, menús desplegables, renderizado personalizado de items y parámetros de ruta.

#### Importar

```tsx
import { Breadcrumb } from 'j-ui'
```

#### Props

| Prop | Tipo | Por Defecto | Descripción |
|------|------|-------------|-------------|
| `items` | `BreadcrumbItemType[]` | `[]` | Items del breadcrumb |
| `separator` | `ReactNode` | `'/'` | Separador entre items |
| `itemRender` | `(item, params, items, paths) => ReactNode` | — | Función de renderizado personalizado para cada item |
| `params` | `Record<string, string>` | — | Parámetros de ruta |
| `className` | `string` | — | Clase CSS adicional |
| `style` | `CSSProperties` | — | Estilos inline adicionales |
| `classNames` | `BreadcrumbClassNames` | — | Clases CSS para partes internas |
| `styles` | `BreadcrumbStyles` | — | Estilos para partes internas |

#### BreadcrumbItemType

```typescript
interface BreadcrumbItemType {
  title?: ReactNode       // Texto/contenido del item
  href?: string           // URL (renderiza como <a>)
  path?: string           // Segmento de path (se acumulan para itemRender)
  icon?: ReactNode        // Icono antes del título
  onClick?: (e: MouseEvent) => void  // Handler de clic
  className?: string      // Clase CSS individual
  style?: CSSProperties   // Estilos inline individuales
  menu?: { items: BreadcrumbMenuItemType[] }  // Menú desplegable
}
```

#### BreadcrumbMenuItemType

```typescript
interface BreadcrumbMenuItemType {
  key: string             // Clave única
  title: ReactNode        // Texto del item
  href?: string           // URL del item
  icon?: ReactNode        // Icono del item
  onClick?: (e: MouseEvent) => void  // Handler de clic
}
```

#### DOM Semántico

| Slot | Descripción |
|------|-------------|
| `root` | Elemento `<nav>` exterior |
| `list` | Contenedor de lista `<ol>` |
| `item` | Elemento `<li>` individual del breadcrumb |
| `separator` | Elemento `<li>` separador entre items |
| `link` | Elemento de enlace o texto dentro de cada item |
| `overlay` | Contenedor del menú desplegable |

#### Ejemplos

```tsx
// Breadcrumb básico
<Breadcrumb
  items={[
    { title: 'Inicio', href: '/' },
    { title: 'Productos', href: '/productos' },
    { title: 'Detalle' },
  ]}
/>

// Con iconos
<Breadcrumb
  items={[
    { title: 'Inicio', href: '/', icon: <HomeIcon /> },
    { title: 'Ajustes', href: '/ajustes', icon: <SettingsIcon /> },
    { title: 'Perfil' },
  ]}
/>

// Separador personalizado
<Breadcrumb
  separator=">"
  items={[
    { title: 'Inicio', href: '/' },
    { title: 'Categoría', href: '/categoria' },
    { title: 'Artículo' },
  ]}
/>

// Separador como ReactNode
<Breadcrumb
  separator={<span style={{ color: 'red' }}>→</span>}
  items={[
    { title: 'Paso 1', href: '#' },
    { title: 'Paso 2', href: '#' },
    { title: 'Paso 3' },
  ]}
/>

// Con menú desplegable
<Breadcrumb
  items={[
    { title: 'Inicio', href: '/' },
    {
      title: 'Categoría',
      href: '/categoria',
      menu: {
        items: [
          { key: 'electronica', title: 'Electrónica', href: '/electronica' },
          { key: 'ropa', title: 'Ropa', href: '/ropa' },
          { key: 'libros', title: 'Libros', href: '/libros' },
        ],
      },
    },
    { title: 'Producto' },
  ]}
/>

// Con handlers de clic
<Breadcrumb
  items={[
    { title: 'Inicio', onClick: () => navigate('/') },
    { title: 'Usuarios', onClick: () => navigate('/usuarios') },
    { title: 'Juan García' },
  ]}
/>

// Renderizado personalizado con paths
<Breadcrumb
  items={[
    { title: 'Inicio', path: '' },
    { title: 'Usuarios', path: 'usuarios' },
    { title: ':id', path: ':id' },
  ]}
  params={{ id: '42' }}
  itemRender={(item, params, items, paths) => {
    const last = items.indexOf(item) === items.length - 1
    let path = paths[items.indexOf(item)]
    // Reemplazar parámetros
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        path = path.replace(`:${key}`, value)
      })
    }
    return last ? (
      <span>{item.title}</span>
    ) : (
      <a href={`/${path}`}>{item.title}</a>
    )
  }}
/>

// Con estilos semánticos del DOM
<Breadcrumb
  items={[
    { title: 'Inicio', href: '/' },
    { title: 'Productos', href: '/productos' },
    { title: 'Detalle' },
  ]}
  classNames={{ link: 'enlace-personalizado' }}
  styles={{
    separator: { color: '#999', margin: '0 12px' },
    overlay: { borderRadius: 8 },
  }}
/>
```

</details>

---

<details>
<summary><strong>Bubble</strong> - Boton de accion flotante con menus y grupos</summary>

### Bubble

Un componente de boton de accion flotante (FAB) para acciones rapidas, con soporte para badges, tooltips, grupos compactos y menus expandibles.

#### Importar

```tsx
import { Bubble, BackToTopIcon, ChatIcon, BellIcon, CloseIcon } from 'j-ui'
```

#### Props

| Prop | Tipo | Por Defecto | Descripcion |
|------|------|-------------|-------------|
| `icon` | `ReactNode` | — | Icono a mostrar |
| `description` | `string` | — | Texto a mostrar (solo si no hay icono) |
| `position` | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'bottom-right'` | Posicion fija en pantalla |
| `shape` | `'circle' \| 'square'` | `'circle'` | Forma del bubble |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamano del bubble |
| `color` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'primary'` | Color semantico |
| `badge` | `number \| boolean` | — | Mostrar badge con numero o punto |
| `badgeColor` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'error'` | Color del badge |
| `tooltip` | `string` | — | Texto del tooltip |
| `tooltipPosition` | `'left' \| 'right' \| 'top' \| 'bottom'` | auto | Posicion del tooltip |
| `offsetX` | `number` | `24` | Desplazamiento horizontal desde el borde (px) |
| `offsetY` | `number` | `24` | Desplazamiento vertical desde el borde (px) |
| `shadow` | `boolean \| 'sm' \| 'md' \| 'lg'` | `'lg'` | Aplicar sombra |
| `bordered` | `boolean` | `true` | Mostrar borde |
| `onBackToTop` | `() => void` | — | Callback al volver arriba |
| `visibleOnScroll` | `number` | — | Mostrar solo despues de hacer scroll (px) |
| `disabled` | `boolean` | `false` | Deshabilita el bubble |

Tambien acepta todos los atributos HTML estandar de `<button>`.

#### Tamanos

| Tamano | Dimensiones | Tamano de Icono |
|--------|-------------|-----------------|
| `sm` | 40px | 16px |
| `md` | 48px | 20px |
| `lg` | 56px | 24px |

#### Iconos Incluidos

J-UI proporciona iconos utilitarios para casos de uso comunes de FAB:

| Icono | Descripcion |
|-------|-------------|
| `BackToTopIcon` | Flecha apuntando arriba |
| `ChatIcon` | Burbuja de chat/mensaje |
| `BellIcon` | Campana de notificacion |
| `CloseIcon` | Icono X de cerrar |

#### DOM Semántico

| Slot | Descripción |
|------|-------------|
| `root` | Elemento contenedor exterior |
| `icon` | Elemento del icono |
| `badge` | Elemento del contador badge |
| `tooltip` | Elemento popup del tooltip |
| `tooltipArrow` | Elemento de la flecha del tooltip |

**Bubble.Menu:**

| Slot | Descripción |
|------|-------------|
| `root` | Elemento contenedor del menú |
| `trigger` | Elemento disparador del menú |
| `menu` | Elemento contenedor de opciones |

#### Ejemplos

```tsx
// Basico
<Bubble icon={<ChatIcon />} />

// Con tooltip
<Bubble icon={<ChatIcon />} tooltip="Abrir chat" />

// Diferentes posiciones
<Bubble icon={<BellIcon />} position="top-right" />
<Bubble icon={<ChatIcon />} position="bottom-left" />

// Con badge (numero)
<Bubble icon={<BellIcon />} badge={5} />

// Con badge (punto)
<Bubble icon={<ChatIcon />} badge={true} />

// Badge con color personalizado
<Bubble icon={<BellIcon />} badge={3} badgeColor="warning" />

// Diferentes colores
<Bubble icon={<ChatIcon />} color="success" />
<Bubble icon={<BellIcon />} color="info" />

// Diferentes tamanos
<Bubble icon={<ChatIcon />} size="sm" />
<Bubble icon={<ChatIcon />} size="lg" />

// Forma cuadrada
<Bubble icon={<ChatIcon />} shape="square" />

// Sin borde
<Bubble icon={<ChatIcon />} bordered={false} />

// Boton volver arriba (aparece despues de scroll de 200px)
<Bubble
  icon={<BackToTopIcon />}
  tooltip="Volver arriba"
  visibleOnScroll={200}
  onBackToTop={() => console.log('Scroll al inicio')}
/>

// Desplazamiento personalizado
<Bubble icon={<ChatIcon />} offsetX={40} offsetY={40} />

// Con texto en lugar de icono
<Bubble description="?" tooltip="Ayuda" />
```

---

### Bubble.Group

Una barra de botones compacta que une multiples Bubbles con estilos unificados. Los bubbles se renderizan como un grupo sin espacios, con sombra compartida y manejo automatico de border-radius.

#### Props

| Prop | Tipo | Por Defecto | Descripcion |
|------|------|-------------|-------------|
| `children` | `ReactNode` | — | Componentes Bubble hijos |
| `position` | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'bottom-right'` | Posicion fija en pantalla |
| `direction` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Direccion del layout |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamano para todos los hijos |
| `offsetX` | `number` | `24` | Desplazamiento horizontal desde el borde (px) |
| `offsetY` | `number` | `24` | Desplazamiento vertical desde el borde (px) |
| `shadow` | `boolean \| 'sm' \| 'md' \| 'lg'` | `'lg'` | Sombra del contenedor del grupo |

#### Direccion

| Direccion | Descripcion |
|-----------|-------------|
| `top` | Los bubbles se apilan hacia arriba desde la posicion |
| `bottom` | Los bubbles se apilan hacia abajo desde la posicion |
| `left` | Los bubbles se apilan hacia la izquierda desde la posicion |
| `right` | Los bubbles se apilan hacia la derecha desde la posicion |

#### Ejemplos

```tsx
// Grupo compacto vertical (apila hacia arriba)
<Bubble.Group>
  <Bubble icon={<ChatIcon />} color="info" />
  <Bubble icon={<BellIcon />} color="warning" />
  <Bubble icon={<BackToTopIcon />} color="success" />
</Bubble.Group>

// Grupo compacto horizontal
<Bubble.Group direction="left">
  <Bubble icon={<ChatIcon />} color="primary" />
  <Bubble icon={<BellIcon />} color="secondary" />
</Bubble.Group>

// Diferente posicion
<Bubble.Group position="top-right" direction="bottom">
  <Bubble icon={<ChatIcon />} />
  <Bubble icon={<BellIcon />} />
</Bubble.Group>

// Con badges (los badges se extienden fuera del grupo)
<Bubble.Group>
  <Bubble icon={<ChatIcon />} badge={3} />
  <Bubble icon={<BellIcon />} badge={true} badgeColor="warning" />
</Bubble.Group>

// Tamano personalizado
<Bubble.Group size="lg">
  <Bubble icon={<ChatIcon />} />
  <Bubble icon={<BellIcon />} />
</Bubble.Group>
```

---

### Bubble.Menu

Un menu flotante expandible que muestra/oculta Bubbles hijos con animacion. Soporta activacion por click o hover.

#### Props

| Prop | Tipo | Por Defecto | Descripcion |
|------|------|-------------|-------------|
| `children` | `ReactNode` | — | Componentes Bubble hijos |
| `position` | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'bottom-right'` | Posicion fija en pantalla |
| `direction` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Direccion de expansion |
| `trigger` | `'click' \| 'hover'` | `'click'` | Modo de activacion |
| `icon` | `ReactNode` | `+` | Icono del trigger cuando esta cerrado |
| `openIcon` | `ReactNode` | — | Icono del trigger cuando esta abierto (por defecto rota el icono 45deg) |
| `shape` | `'circle' \| 'square'` | `'circle'` | Forma para trigger e hijos |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamano para trigger e hijos |
| `color` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'primary'` | Color del trigger |
| `offsetX` | `number` | `24` | Desplazamiento horizontal desde el borde (px) |
| `offsetY` | `number` | `24` | Desplazamiento vertical desde el borde (px) |
| `shadow` | `boolean \| 'sm' \| 'md' \| 'lg'` | `'lg'` | Aplicar sombra |
| `tooltip` | `string` | — | Tooltip del trigger (mostrado cuando esta cerrado) |
| `defaultOpen` | `boolean` | `false` | Inicialmente abierto (no controlado) |
| `open` | `boolean` | — | Estado abierto controlado |
| `onOpenChange` | `(open: boolean) => void` | — | Callback cuando cambia el estado |
| `gap` | `number` | `12` | Espacio entre bubbles (px) |

#### Ejemplos

```tsx
// Menu expandible basico (click para abrir)
<Bubble.Menu>
  <Bubble icon={<ChatIcon />} tooltip="Chat" color="info" />
  <Bubble icon={<BellIcon />} tooltip="Notificaciones" color="warning" />
</Bubble.Menu>

// Hover para abrir
<Bubble.Menu trigger="hover">
  <Bubble icon={<ChatIcon />} tooltip="Chat" />
  <Bubble icon={<BellIcon />} tooltip="Alertas" />
</Bubble.Menu>

// Iconos de trigger personalizados
<Bubble.Menu
  icon={<ChatIcon />}
  openIcon={<CloseIcon />}
  color="success"
>
  <Bubble icon={<BellIcon />} tooltip="Notificaciones" />
  <Bubble icon={<BackToTopIcon />} tooltip="Volver arriba" />
</Bubble.Menu>

// Expansion horizontal
<Bubble.Menu direction="left">
  <Bubble icon={<ChatIcon />} />
  <Bubble icon={<BellIcon />} />
</Bubble.Menu>

// Estado controlado
function MiComponente() {
  const [open, setOpen] = useState(false)

  return (
    <Bubble.Menu
      open={open}
      onOpenChange={setOpen}
      tooltip="Acciones"
    >
      <Bubble icon={<ChatIcon />} onClick={() => abrirChat()} />
      <Bubble icon={<BellIcon />} onClick={() => abrirNotificaciones()} />
    </Bubble.Menu>
  )
}

// Diferente posicion
<Bubble.Menu position="top-left" direction="bottom">
  <Bubble icon={<ChatIcon />} />
  <Bubble icon={<BellIcon />} />
</Bubble.Menu>

// Modo inline (no fijo, fluye con el contenido)
<Bubble.Menu style={{ position: 'relative' }}>
  <Bubble icon={<ChatIcon />} />
  <Bubble icon={<BellIcon />} />
</Bubble.Menu>

// Espacio personalizado
<Bubble.Menu gap={20}>
  <Bubble icon={<ChatIcon />} />
  <Bubble icon={<BellIcon />} />
</Bubble.Menu>
```

</details>

---

<details>
<summary><strong>Button</strong> - Boton versatil con variantes y animaciones</summary>

### Button

Un componente de boton versatil con multiples variantes, tamanos y estados.

#### Importar

```tsx
import { Button } from 'j-ui'
```

#### Props

| Prop | Tipo | Por Defecto | Descripcion |
|------|------|-------------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'dashed' \| 'ghost' \| 'link'` | `'primary'` | Variante de estilo |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamano del boton |
| `color` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'primary'` | Color semantico |
| `icon` | `ReactNode` | — | Elemento de icono |
| `iconPlacement` | `'start' \| 'end'` | `'start'` | Posicion del icono respecto al texto |
| `loading` | `boolean` | `false` | Muestra spinner de carga |
| `shadow` | `boolean \| 'sm' \| 'md' \| 'lg'` | `false` | Aplica sombra |
| `clickAnimation` | `'pulse' \| 'ripple' \| 'shake' \| 'firecracker' \| 'confetti'` | — | Animacion al hacer clic |
| `hoverAnimation` | `'pulse' \| 'ripple' \| 'shake' \| 'firecracker' \| 'confetti'` | — | Animacion al hacer hover |
| `gradient` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info'` | — | Gradiente preconfigurado usando color del tema |
| `gradientAngle` | `number` | `135` | Angulo del gradiente preconfigurado (grados) |
| `gradientCss` | `string` | — | Gradiente CSS personalizado (sobreescribe `gradient`) |
| `block` | `boolean` | `false` | El boton ocupa el 100% del ancho del contenedor |
| `bordered` | `boolean` | `false` | Anade borde extra |
| `disabled` | `boolean` | `false` | Deshabilita el boton |
| `children` | `ReactNode` | — | Contenido del boton |

Tambien acepta todos los atributos HTML estandar de `<button>`.

#### Variantes

| Variante | Descripcion |
|----------|-------------|
| `primary` | Fondo solido con el color seleccionado |
| `secondary` | Fondo claro con texto mas oscuro |
| `outline` | Transparente con borde solido de color |
| `dashed` | Transparente con borde punteado de color |
| `ghost` | Transparente, el color aparece en hover |
| `link` | Solo texto, sin padding, aspecto de hiperenlace |

#### Tamanos

| Tamano | Padding | Tamano de Fuente |
|--------|---------|------------------|
| `sm` | `6px 12px` | 13px |
| `md` | `10px 18px` | 14px |
| `lg` | `14px 24px` | 16px |

#### Animaciones

| Animacion | Descripcion |
|-----------|-------------|
| `ripple` | Onda expandiendose desde el punto de clic |
| `pulse` | Doble onda de borde expandiendose hacia afuera |
| `shake` | El boton se agita horizontalmente |
| `firecracker` | Particulas explotan desde los bordes del boton |
| `confetti` | Particulas explotan desde el punto de clic |

#### DOM Semántico

| Slot | Descripción |
|------|-------------|
| `root` | Elemento botón exterior |
| `icon` | Contenedor del icono |
| `spinner` | Elemento del spinner de carga |
| `content` | Contenedor del texto |

#### Ejemplos

```tsx
// Basico
<Button>Haz clic</Button>

// Variantes
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="dashed">Dashed</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Colores
<Button color="success">Exito</Button>
<Button color="warning">Advertencia</Button>
<Button color="error">Error</Button>

// Tamanos
<Button size="sm">Pequeno</Button>
<Button size="md">Mediano</Button>
<Button size="lg">Grande</Button>

// Estados
<Button loading>Cargando...</Button>
<Button disabled>Deshabilitado</Button>

// Animaciones de clic
<Button clickAnimation="ripple">Ripple</Button>
<Button clickAnimation="pulse">Pulse</Button>
<Button clickAnimation="shake">Shake</Button>
<Button clickAnimation="firecracker">Firecracker</Button>
<Button clickAnimation="confetti">Confetti</Button>

// Animacion de hover
<Button hoverAnimation="pulse">Pasa el cursor</Button>

// Sombra
<Button shadow="lg">Con Sombra</Button>

// Ancho completo (block)
<Button block>Boton Ancho Completo</Button>

// Gradiente preconfigurado (usa tonos del color del tema)
<Button gradient="primary">Gradiente Primary</Button>
<Button gradient="success">Gradiente Success</Button>

// Angulo de gradiente personalizado
<Button gradient="info" gradientAngle={45}>Gradiente 45deg</Button>
<Button gradient="warning" gradientAngle={90}>Gradiente 90deg</Button>

// Gradiente CSS personalizado
<Button gradientCss="linear-gradient(90deg, #ff6b6b, #feca57)">
  Atardecer
</Button>
<Button gradientCss="linear-gradient(135deg, #667eea, #764ba2)">
  Purple Haze
</Button>

// Con icono (posicion inicio - por defecto)
<Button icon={<PlusIcon />}>Agregar</Button>

// Con icono al final
<Button icon={<ArrowRightIcon />} iconPlacement="end">
  Continuar
</Button>

// Icono con variante dashed
<Button variant="dashed" icon={<UploadIcon />}>
  Subir Archivo
</Button>

// Combinado
<Button
  variant="outline"
  color="success"
  size="lg"
  clickAnimation="confetti"
  shadow
>
  Completar Pedido
</Button>
```

</details>

---

<details>
<summary><strong>Checkbox</strong> - Control de seleccion con grupo y estado indeterminado</summary>

### Checkbox

Un componente de checkbox para alternar valores booleanos con soporte para estado indeterminado, grupos, modos controlado/no controlado y estilizado semantico. Incluye `Checkbox.Group` para gestionar selecciones multiples.

#### Importar

```tsx
import { Checkbox } from 'j-ui'
```

#### Props de Checkbox

| Prop | Tipo | Default | Descripcion |
|------|------|---------|-------------|
| `checked` | `boolean` | — | Si el checkbox esta marcado (controlado) |
| `defaultChecked` | `boolean` | `false` | Estado inicial marcado (no controlado) |
| `disabled` | `boolean` | `false` | Deshabilita el checkbox |
| `indeterminate` | `boolean` | `false` | Muestra estado indeterminado (parcial) — icono de menos |
| `autoFocus` | `boolean` | `false` | Enfoque automatico al montar |
| `onChange` | `(e: CheckboxChangeEvent) => void` | — | Callback cuando cambia el estado |
| `value` | `string \| number` | — | Valor identificador, usado dentro de `Checkbox.Group` |
| `children` | `ReactNode` | — | Contenido de la etiqueta junto al checkbox |
| `id` | `string` | — | Atributo HTML id |
| `name` | `string` | — | Atributo HTML name para el input |
| `tabIndex` | `number` | — | Indice de tabulacion para navegacion por teclado |
| `className` | `string` | — | Clase CSS para el elemento raiz |
| `style` | `CSSProperties` | — | Estilos inline para el elemento raiz |
| `classNames` | `CheckboxClassNames` | — | Clases CSS de slots semanticos |
| `styles` | `CheckboxStyles` | — | Estilos inline de slots semanticos |

#### Props de Checkbox.Group

| Prop | Tipo | Default | Descripcion |
|------|------|---------|-------------|
| `options` | `(string \| number \| CheckboxOptionType)[]` | — | Array de opciones para generar checkboxes |
| `value` | `(string \| number)[]` | — | Valores seleccionados actualmente (controlado) |
| `defaultValue` | `(string \| number)[]` | `[]` | Valores iniciales seleccionados (no controlado) |
| `disabled` | `boolean` | `false` | Deshabilita todos los checkboxes del grupo |
| `name` | `string` | — | Atributo name para todos los inputs |
| `onChange` | `(checkedValues: (string \| number)[]) => void` | — | Callback cuando cambia la seleccion |
| `children` | `ReactNode` | — | Hijos Checkbox (alternativa a `options`) |
| `className` | `string` | — | Clase CSS para el elemento raiz |
| `style` | `CSSProperties` | — | Estilos inline para el elemento raiz |
| `classNames` | `CheckboxGroupClassNames` | — | Clases CSS de slots semanticos |
| `styles` | `CheckboxGroupStyles` | — | Estilos inline de slots semanticos |

#### Tipos

```typescript
// Evento de cambio devuelto por onChange
interface CheckboxChangeEvent {
  target: {
    checked: boolean
    value?: string | number
  }
  nativeEvent: Event
}

// Objeto de opcion para Checkbox.Group
interface CheckboxOptionType {
  label: ReactNode
  value: string | number
  disabled?: boolean
  style?: CSSProperties
  className?: string
}

// Tipos de slots semanticos
type CheckboxSemanticSlot = 'root' | 'checkbox' | 'indicator' | 'label'
type CheckboxGroupSemanticSlot = 'root'
```

#### DOM Semantico

| Slot | Elemento | Descripcion |
|------|----------|-------------|
| `root` | `<label>` | Contenedor externo con checkbox y etiqueta |
| `checkbox` | `<span>` | Elemento de la caja del checkbox (borde + fondo) |
| `indicator` | `<span>` | Contenedor del icono check/menos dentro de la caja |
| `label` | `<span>` | Texto de la etiqueta junto al checkbox |

**Checkbox.Group:**

| Slot | Elemento | Descripcion |
|------|----------|-------------|
| `root` | `<div>` | `div` contenedor con `role="group"` que contiene todos los checkboxes |

#### Ejemplos

```tsx
// Checkbox basico
<Checkbox>Recuerdame</Checkbox>

// Checkbox controlado
const [checked, setChecked] = useState(false)
<Checkbox
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
>
  Acepto los terminos
</Checkbox>

// Deshabilitado
<Checkbox disabled>Deshabilitado</Checkbox>
<Checkbox disabled checked>Deshabilitado marcado</Checkbox>

// Estado indeterminado (para patrones "seleccionar todo")
const [checkedList, setCheckedList] = useState(['Manzana'])
const allOptions = ['Manzana', 'Banana', 'Naranja']
const allChecked = checkedList.length === allOptions.length
const indeterminate = checkedList.length > 0 && !allChecked
<Checkbox
  indeterminate={indeterminate}
  checked={allChecked}
  onChange={(e) => setCheckedList(e.target.checked ? allOptions : [])}
>
  Seleccionar todo
</Checkbox>

// Grupo con array de opciones
<Checkbox.Group
  options={['Manzana', 'Banana', 'Naranja']}
  defaultValue={['Manzana']}
  onChange={(values) => console.log(values)}
/>

// Grupo con opciones objeto
<Checkbox.Group
  options={[
    { label: 'Manzana', value: 'manzana' },
    { label: 'Banana', value: 'banana' },
    { label: 'Naranja', value: 'naranja', disabled: true },
  ]}
  defaultValue={['manzana']}
/>

// Grupo con hijos (layout manual)
<Checkbox.Group onChange={(values) => console.log(values)}>
  <Checkbox value="A">Opcion A</Checkbox>
  <Checkbox value="B">Opcion B</Checkbox>
  <Checkbox value="C">Opcion C</Checkbox>
</Checkbox.Group>

// Grupo controlado
const [selected, setSelected] = useState<(string | number)[]>(['B'])
<Checkbox.Group value={selected} onChange={setSelected}>
  <Checkbox value="A">A</Checkbox>
  <Checkbox value="B">B</Checkbox>
  <Checkbox value="C">C</Checkbox>
</Checkbox.Group>

// Estilizado semantico
<Checkbox
  styles={{
    checkbox: { borderRadius: 999, width: 20, height: 20 },
    label: { fontWeight: 600 },
  }}
>
  Estilo personalizado
</Checkbox>

// Estilizado semantico en grupo
<Checkbox.Group
  options={['Rojo', 'Verde', 'Azul']}
  styles={{ root: { gap: 16 } }}
/>
```

</details>

---

<details>
<summary><strong>ColorPicker</strong> - Selector de color con gradientes, presets y cambio de formato</summary>

### ColorPicker

Un selector de color completo con panel de saturacion-brillo, sliders de tono y alfa, cambio de formato (HEX/RGB/HSB), modo gradiente con stops editables, presets de colores, tres tamaños, triggers click/hover, posicionamiento con auto-flip y renderizado personalizado del panel.

#### Importar

```tsx
import { ColorPicker } from 'j-ui'
```

#### Props

| Prop | Tipo | Default | Descripcion |
|------|------|---------|-------------|
| `value` | `string \| ColorPickerColor \| ColorPickerGradientStop[]` | — | Valor de color actual (controlado) |
| `defaultValue` | `string \| ColorPickerColor \| ColorPickerGradientStop[]` | `'#1677ff'` | Color inicial (no controlado) |
| `mode` | `ColorPickerMode \| ColorPickerMode[]` | `'single'` | Modo(s) de color. `'gradient'` muestra pestañas Single/Gradient |
| `onModeChange` | `(mode: ColorPickerMode) => void` | — | Llamado cuando cambia el modo |
| `format` | `ColorPickerFormat` | — | Formato de visualizacion (controlado) |
| `defaultFormat` | `ColorPickerFormat` | `'hex'` | Formato de visualizacion inicial (no controlado) |
| `disabled` | `boolean` | `false` | Deshabilita el selector |
| `disabledAlpha` | `boolean` | `false` | Oculta el slider de alfa y el input de alfa |
| `allowClear` | `boolean` | `false` | Muestra un boton de limpiar en el panel |
| `showText` | `boolean \| ((color: ColorPickerColor) => ReactNode)` | — | Muestra texto del color junto al swatch. Funcion personalizada para texto custom |
| `trigger` | `'click' \| 'hover'` | `'click'` | Como se abre el panel |
| `placement` | `ColorPickerPlacement` | `'bottomLeft'` | Posicion del panel con auto-flip |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamaño del boton trigger |
| `open` | `boolean` | — | Si el panel esta abierto (controlado) |
| `presets` | `ColorPickerPreset[]` | — | Paletas de colores preestablecidas |
| `panelRender` | `(panel: ReactNode) => ReactNode` | — | Wrapper personalizado del panel |
| `onChange` | `(color: ColorPickerColor, hex: string) => void` | — | Llamado en cada cambio de color (modo single) |
| `onChangeComplete` | `(color: ColorPickerColor, hex: string) => void` | — | Llamado cuando termina el arrastre (modo single) |
| `onGradientChange` | `(stops: ColorPickerGradientStop[], css: string) => void` | — | Llamado en cambio de gradiente (modo gradient) |
| `onFormatChange` | `(format: ColorPickerFormat) => void` | — | Llamado cuando cambia el formato |
| `onOpenChange` | `(open: boolean) => void` | — | Llamado cuando se abre/cierra el panel |
| `onClear` | `() => void` | — | Llamado cuando se limpia el color |
| `children` | `ReactNode` | — | Elemento trigger personalizado (reemplaza el boton por defecto) |
| `className` | `string` | — | Clase CSS para el elemento raiz |
| `style` | `CSSProperties` | — | Estilos inline para el elemento raiz |
| `classNames` | `ColorPickerClassNames` | — | Clases CSS de slots semanticos |
| `styles` | `ColorPickerStyles` | — | Estilos inline de slots semanticos |

#### Tipos

```typescript
type ColorPickerFormat = 'hex' | 'rgb' | 'hsb'
type ColorPickerSize = 'sm' | 'md' | 'lg'
type ColorPickerTrigger = 'click' | 'hover'
type ColorPickerPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
type ColorPickerMode = 'single' | 'gradient'

interface ColorPickerGradientStop {
  color: string
  percent: number
}

interface ColorPickerPreset {
  label: ReactNode
  colors: string[]
}

// Objeto de color devuelto por onChange / onChangeComplete
interface ColorPickerColor {
  h: number; s: number; b: number; a: number
  toHexString: () => string
  toRgbString: () => string
  toHsbString: () => string
  toRgb: () => { r: number; g: number; b: number; a: number }
  toHsb: () => { h: number; s: number; b: number; a: number }
}

// Tipos de slots semanticos
type ColorPickerSemanticSlot = 'root' | 'trigger' | 'panel' | 'presets'
```

#### DOM Semantico

| Slot | Elemento | Descripcion |
|------|----------|-------------|
| `root` | `<div>` | Contenedor externo (position relative) |
| `trigger` | `<button>` | Boton trigger por defecto con swatch de color |
| `panel` | `<div>` | Panel flotante con todos los controles del selector |
| `presets` | — | Reservado para la seccion de paleta de presets |

#### Ejemplos

```tsx
// Selector de color basico
<ColorPicker defaultValue="#1677ff" />

// Controlado
const [color, setColor] = useState('#ff6b6b')
<ColorPicker
  value={color}
  onChange={(c, hex) => setColor(hex)}
/>

// Mostrar texto junto al swatch
<ColorPicker defaultValue="#52c41a" showText />

// Funcion de texto personalizada
<ColorPicker
  defaultValue="#1677ff"
  showText={(color) => color.toRgbString()}
/>

// Tamaños
<ColorPicker size="sm" defaultValue="#1677ff" />
<ColorPicker size="md" defaultValue="#52c41a" />
<ColorPicker size="lg" defaultValue="#ff4d4f" />

// Deshabilitado
<ColorPicker defaultValue="#1677ff" disabled />

// Deshabilitar canal alfa
<ColorPicker defaultValue="#1677ff" disabledAlpha />

// Permitir limpiar
<ColorPicker defaultValue="#1677ff" allowClear />

// Trigger hover
<ColorPicker defaultValue="#1677ff" trigger="hover" />

// Posicionamiento
<ColorPicker defaultValue="#1677ff" placement="topRight" />

// Control de formato
<ColorPicker defaultValue="#1677ff" format="rgb" />

// Presets
<ColorPicker
  defaultValue="#1677ff"
  presets={[
    {
      label: 'Recomendados',
      colors: ['#ff4d4f', '#ff7a45', '#ffa940', '#ffc53d', '#ffec3d', '#bae637', '#73d13d', '#36cfc9', '#40a9ff', '#597ef7', '#9254de', '#f759ab'],
    },
    {
      label: 'Recientes',
      colors: ['#1677ff', '#52c41a'],
    },
  ]}
/>

// Modo gradiente
<ColorPicker
  mode="gradient"
  onGradientChange={(stops, css) => console.log(css)}
/>

// Ambos modos (pestañas)
<ColorPicker
  mode={['single', 'gradient']}
  onChange={(c, hex) => console.log('single:', hex)}
  onGradientChange={(stops, css) => console.log('gradient:', css)}
/>

// Trigger personalizado
<ColorPicker defaultValue="#1677ff">
  <button>Elegir un color</button>
</ColorPicker>

// Renderizado personalizado del panel
<ColorPicker
  defaultValue="#1677ff"
  panelRender={(panel) => (
    <div style={{ padding: 8 }}>
      <h4>Elegir color</h4>
      {panel}
    </div>
  )}
/>

// Estilizado semantico
<ColorPicker
  defaultValue="#1677ff"
  styles={{
    trigger: { borderRadius: 999 },
    panel: { borderRadius: 16 },
  }}
/>
```

</details>

---

<details>
<summary><strong>DatePicker</strong> - Seleccion de fecha con panel calendario, rango y soporte de hora</summary>

### DatePicker

Un selector de fecha completo con panel de calendario, multiples modos de seleccion (fecha, semana, mes, trimestre, año), seleccion de hora, seleccion de rangos con paneles duales, input con mascara, seleccion multiple de fechas, presets, fechas/horas deshabilitadas, renderizado personalizado de celdas, sistema de adaptador de fechas enchufable y posicionamiento con auto-flip. Incluye `DatePicker.RangePicker` para seleccionar rangos de fechas.

#### Importar

```tsx
import { DatePicker } from 'j-ui'
```

#### Props de DatePicker

| Prop | Tipo | Default | Descripcion |
|------|------|---------|-------------|
| `value` | `TDate \| null` | — | Fecha seleccionada (controlado) |
| `defaultValue` | `TDate \| null` | — | Fecha inicial (no controlado) |
| `onChange` | `(date: TDate \| null, dateString: string) => void` | — | Llamado cuando cambia la fecha |
| `picker` | `'date' \| 'week' \| 'month' \| 'quarter' \| 'year'` | `'date'` | Tipo de panel selector |
| `format` | `string \| ((date: TDate) => string)` | Auto | Formato de visualizacion de fecha (ej. `'YYYY-MM-DD'`) |
| `placeholder` | `string` | Auto | Placeholder del input |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamaño del componente |
| `variant` | `'outlined' \| 'borderless' \| 'filled'` | `'outlined'` | Variante del input |
| `status` | `'error' \| 'warning'` | — | Estado de validacion |
| `placement` | `DatePickerPlacement` | `'bottomLeft'` | Posicion del popup con auto-flip |
| `disabled` | `boolean` | `false` | Deshabilita el selector |
| `inputReadOnly` | `boolean` | `false` | Hace el input de solo lectura |
| `allowClear` | `boolean` | `true` | Muestra boton de limpiar |
| `prefix` | `ReactNode` | — | Contenido prefix en el input |
| `suffix` | `ReactNode` | Icono calendario/reloj | Contenido suffix en el input |
| `needConfirm` | `boolean` | `true` con `showTime` | Requiere boton OK para confirmar seleccion |
| `multiple` | `boolean` | `false` | Permite seleccionar multiples fechas |
| `mask` | `boolean` | `false` | Habilita input con mascara y edicion por segmento |
| `disabledDate` | `(date: TDate) => boolean` | — | Funcion para deshabilitar fechas especificas |
| `minDate` | `TDate` | — | Fecha minima seleccionable |
| `maxDate` | `TDate` | — | Fecha maxima seleccionable |
| `showTime` | `boolean \| TimePickerConfig` | — | Habilita seleccion de hora junto con fecha |
| `showNow` | `boolean` | Auto | Muestra boton "Ahora" en el footer |
| `showToday` | `boolean` | `true` | Muestra boton "Hoy" en el footer |
| `presets` | `DatePickerPreset[]` | — | Fechas preestablecidas de seleccion rapida |
| `open` | `boolean` | — | Si el popup esta abierto (controlado) |
| `defaultOpen` | `boolean` | `false` | Estado inicial de apertura |
| `onOpenChange` | `(open: boolean) => void` | — | Llamado cuando se abre/cierra el popup |
| `panelRender` | `(panel: ReactNode) => ReactNode` | — | Wrapper personalizado del panel |
| `cellRender` | `(current: TDate, info: CellRenderInfo) => ReactNode` | — | Renderizado personalizado de celdas |
| `onPanelChange` | `(date: TDate, mode: DatePickerMode) => void` | — | Llamado al cambiar modo/vista del panel |
| `renderExtraFooter` | `() => ReactNode` | — | Contenido extra del footer |
| `disabledTime` | `(date: TDate) => DisabledTimes` | — | Deshabilita horas/minutos/segundos especificos |
| `adapter` | `DateAdapter<TDate>` | `NativeDateAdapter` | Adaptador de libreria de fechas enchufable |
| `className` | `string` | — | Clase CSS para el elemento raiz |
| `style` | `CSSProperties` | — | Estilos inline para el elemento raiz |
| `classNames` | `DatePickerClassNames` | — | Clases CSS de slots semanticos |
| `styles` | `DatePickerStyles` | — | Estilos inline de slots semanticos |

#### Props de DatePicker.RangePicker

| Prop | Tipo | Default | Descripcion |
|------|------|---------|-------------|
| `value` | `[TDate \| null, TDate \| null] \| null` | — | Rango seleccionado (controlado) |
| `defaultValue` | `[TDate \| null, TDate \| null] \| null` | — | Rango inicial (no controlado) |
| `onChange` | `(dates: [TDate, TDate] \| null, dateStrings: [string, string]) => void` | — | Llamado cuando cambia el rango |
| `onCalendarChange` | `(dates, dateStrings, info: { range: 'start' \| 'end' }) => void` | — | Llamado en cada seleccion del calendario |
| `picker` | `DatePickerMode` | `'date'` | Modo del selector |
| `format` | `string \| ((date: TDate) => string)` | Auto | Formato de fecha |
| `placeholder` | `[string, string]` | Auto | Placeholders para inicio/fin |
| `separator` | `ReactNode` | Icono flecha | Separador entre inputs |
| `allowEmpty` | `[boolean, boolean]` | — | Permitir inicio/fin vacio |
| `disabled` | `boolean \| [boolean, boolean]` | `false` | Deshabilitar inicio/fin independientemente |
| `size` | `DatePickerSize` | `'md'` | Tamaño del componente |
| `variant` | `DatePickerVariant` | `'outlined'` | Variante del input |
| `status` | `DatePickerStatus` | — | Estado de validacion |
| `placement` | `DatePickerPlacement` | `'bottomLeft'` | Posicion del popup |
| `inputReadOnly` | `boolean` | `false` | Inputs de solo lectura |
| `allowClear` | `boolean` | `true` | Mostrar boton de limpiar |
| `prefix` | `ReactNode` | — | Contenido prefix |
| `suffix` | `ReactNode` | Icono calendario | Contenido suffix |
| `disabledDate` | `(date: TDate, info?: { from?: TDate }) => boolean` | — | Deshabilitar fechas especificas |
| `minDate` | `TDate` | — | Fecha minima seleccionable |
| `maxDate` | `TDate` | — | Fecha maxima seleccionable |
| `showTime` | `boolean \| TimePickerConfig` | — | Habilitar seleccion de hora |
| `showNow` | `boolean` | — | Mostrar boton "Ahora" |
| `presets` | `RangePickerPreset[]` | — | Rangos preestablecidos |
| `open` | `boolean` | — | Estado abierto controlado |
| `defaultOpen` | `boolean` | `false` | Estado inicial de apertura |
| `onOpenChange` | `(open: boolean) => void` | — | Callback de cambio de apertura |
| `panelRender` | `(panel: ReactNode) => ReactNode` | — | Wrapper personalizado del panel |
| `cellRender` | `(current: TDate, info: CellRenderInfo) => ReactNode` | — | Renderizado personalizado de celdas |
| `onPanelChange` | `(dates, modes) => void` | — | Callback de cambio de panel |
| `renderExtraFooter` | `() => ReactNode` | — | Contenido extra del footer |
| `disabledTime` | `(date: TDate, type: 'start' \| 'end') => DisabledTimes` | — | Deshabilitar horas especificas |
| `linkedPanels` | `boolean` | `true` | Vincular navegacion de paneles izquierdo/derecho |
| `adapter` | `DateAdapter<TDate>` | `NativeDateAdapter` | Adaptador de fechas |
| `className` | `string` | — | Clase CSS |
| `style` | `CSSProperties` | — | Estilos inline |
| `classNames` | `DatePickerClassNames` | — | Clases CSS de slots semanticos |
| `styles` | `DatePickerStyles` | — | Estilos inline de slots semanticos |

#### Tipos

```typescript
type DatePickerSize = 'sm' | 'md' | 'lg'
type DatePickerVariant = 'outlined' | 'borderless' | 'filled'
type DatePickerStatus = 'error' | 'warning'
type DatePickerPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
type DatePickerMode = 'date' | 'week' | 'month' | 'quarter' | 'year'

interface DatePickerPreset<TDate> {
  label: ReactNode
  value: TDate | (() => TDate)
}

interface RangePickerPreset<TDate> {
  label: ReactNode
  value: [TDate, TDate] | (() => [TDate, TDate])
}

interface TimePickerConfig {
  format?: string          // ej. 'HH:mm:ss'
  hourStep?: number
  minuteStep?: number
  secondStep?: number
  showHour?: boolean
  showMinute?: boolean
  showSecond?: boolean
  use12Hours?: boolean
  defaultValue?: any
}

interface DisabledTimes {
  disabledHours?: () => number[]
  disabledMinutes?: (hour: number) => number[]
  disabledSeconds?: (hour: number, minute: number) => number[]
}

interface CellRenderInfo {
  type: 'date' | 'month' | 'quarter' | 'year'
  originNode: ReactNode
  today: boolean
  inView: boolean
  inRange?: boolean
  rangeStart?: boolean
  rangeEnd?: boolean
}

// Interfaz de adaptador de fechas enchufable
interface DateAdapter<TDate> {
  today(): TDate
  create(value?): TDate
  clone(date: TDate): TDate
  isValid(date): boolean
  getYear/getMonth/getDate/getHour/getMinute/getSecond
  setYear/setMonth/setDate/setHour/setMinute/setSecond
  addDays/addMonths/addYears
  isSameDay/isSameMonth/isSameYear/isBefore/isAfter
  startOfWeek/endOfWeek/startOfMonth/endOfMonth
  format(date, formatStr): string
  parse(value, formatStr): TDate | null
  getMonthNames/getDayNames/getQuarterLabel
}

// Tipos de slots semanticos
type DatePickerSemanticSlot = 'root' | 'input' | 'popup' | 'header' | 'body' | 'cell' | 'footer'
```

#### DOM Semantico

| Slot | Elemento | Descripcion |
|------|----------|-------------|
| `root` | `<div>` | Contenedor externo (position relative) |
| `input` | `<div>` | Wrapper del input con borde, anillo de foco, prefix/suffix |
| `popup` | `<div>` | Popup flotante del calendario |
| `header` | `<div>` | Cabecera del calendario con flechas de navegacion y titulo |
| `body` | `<div>` | Cuerpo del calendario con grilla de dia/mes/año/trimestre |
| `cell` | `<div>` / `<button>` | Celda individual del calendario (dia, mes, año, trimestre) |
| `footer` | `<div>` | Footer del panel con botones Hoy/Ahora/OK y presets |

#### Ejemplos

```tsx
// Selector de fecha basico
<DatePicker />

// Controlado
const [date, setDate] = useState<Date | null>(null)
<DatePicker
  value={date}
  onChange={(d, dateStr) => setDate(d)}
/>

// Tamaños
<DatePicker size="sm" />
<DatePicker size="md" />
<DatePicker size="lg" />

// Variantes
<DatePicker variant="outlined" />
<DatePicker variant="filled" />
<DatePicker variant="borderless" />

// Estado de validacion
<DatePicker status="error" />
<DatePicker status="warning" />

// Selector de mes
<DatePicker picker="month" />

// Selector de año
<DatePicker picker="year" />

// Selector de trimestre
<DatePicker picker="quarter" />

// Selector de semana
<DatePicker picker="week" />

// Fecha + Hora
<DatePicker showTime />

// Fecha + Hora con configuracion
<DatePicker
  showTime={{
    format: 'HH:mm',
    hourStep: 1,
    minuteStep: 15,
    showSecond: false,
  }}
/>

// Fechas deshabilitadas
<DatePicker
  disabledDate={(date) => date.getDay() === 0 || date.getDay() === 6}
/>

// Fecha minima y maxima
<DatePicker
  minDate={new Date(2024, 0, 1)}
  maxDate={new Date(2024, 11, 31)}
/>

// Presets
<DatePicker
  presets={[
    { label: 'Hoy', value: new Date() },
    { label: 'Ayer', value: () => { const d = new Date(); d.setDate(d.getDate() - 1); return d } },
  ]}
/>

// Multiples fechas
<DatePicker multiple />

// Input con mascara
<DatePicker mask />

// Renderizado personalizado de celdas
<DatePicker
  cellRender={(date, info) => {
    if (info.type === 'date' && date.getDate() === 25) {
      return <span style={{ color: 'red' }}>{info.originNode}</span>
    }
    return info.originNode
  }}
/>

// Formato personalizado
<DatePicker format="DD/MM/YYYY" />

// Selector de rango
<DatePicker.RangePicker />

// Selector de rango controlado
const [range, setRange] = useState<[Date, Date] | null>(null)
<DatePicker.RangePicker
  value={range}
  onChange={(dates, dateStrings) => setRange(dates)}
/>

// Selector de rango con presets
<DatePicker.RangePicker
  presets={[
    { label: 'Ultimos 7 dias', value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 7)
      return [start, end]
    }},
    { label: 'Este mes', value: () => {
      const now = new Date()
      return [new Date(now.getFullYear(), now.getMonth(), 1), now]
    }},
  ]}
/>

// Selector de rango con hora
<DatePicker.RangePicker showTime />

// Prefix y suffix
<DatePicker prefix={<CalendarIcon />} suffix={null} />

// Estilizado semantico
<DatePicker
  styles={{
    input: { borderRadius: 999 },
    popup: { borderRadius: 16 },
    cell: { borderRadius: '50%' },
  }}
/>

// Adaptador enchufable (ej., dayjs, date-fns)
import { DayjsAdapter } from 'j-ui/adapters/dayjs'
<DatePicker adapter={new DayjsAdapter()} />
```

</details>

---

<details>
<summary><strong>Divider</strong> - Linea separadora con texto opcional</summary>

### Divider

Un componente separador para dividir secciones de contenido, con texto opcional y multiples opciones de estilo.

#### Importar

```tsx
import { Divider } from 'j-ui'
```

#### Props

| Prop | Tipo | Por Defecto | Descripcion |
|------|------|-------------|-------------|
| `type` | `'horizontal' \| 'vertical'` | `'horizontal'` | Orientacion del divider |
| `dashed` | `boolean` | `false` | Usar linea discontinua en lugar de solida |
| `orientation` | `'left' \| 'center' \| 'right'` | `'center'` | Posicion del texto (solo horizontal) |
| `orientationMargin` | `number \| string` | — | Margen desde el borde hasta el texto (px o %) |
| `plain` | `boolean` | `false` | Estilo de texto plano (mas pequeno, sin negrita) |
| `color` | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` | Color de linea y texto |
| `thickness` | `'thin' \| 'normal' \| 'medium' \| 'thick' \| number` | `'normal'` | Grosor de la linea |
| `children` | `ReactNode` | — | Contenido de texto dentro del divider |

#### Valores de Grosor

| Grosor | Valor |
|--------|-------|
| `thin` | 1px |
| `normal` | 1px |
| `medium` | 2px |
| `thick` | 3px |
| `number` | Valor personalizado en px |

#### DOM Semántico

| Slot | Descripción |
|------|-------------|
| `root` | Elemento contenedor exterior |
| `line` | Elemento de la línea divisora |
| `text` | Elemento del texto (cuando se proporcionan children) |

#### Ejemplos

```tsx
// Divider horizontal basico
<Divider />

// Con texto
<Divider>Titulo de Seccion</Divider>

// Orientacion del texto
<Divider orientation="left">Texto Izquierda</Divider>
<Divider orientation="center">Texto Centro</Divider>
<Divider orientation="right">Texto Derecha</Divider>

// Margen personalizado desde el borde
<Divider orientation="left" orientationMargin={20}>
  20px desde la izquierda
</Divider>
<Divider orientation="left" orientationMargin="10%">
  10% desde la izquierda
</Divider>

// Linea discontinua
<Divider dashed>Divider Discontinuo</Divider>

// Texto plano (mas pequeno, sin negrita)
<Divider plain>Texto Plano</Divider>

// Colores
<Divider color="primary">Primary</Divider>
<Divider color="success">Success</Divider>
<Divider color="warning">Warning</Divider>
<Divider color="error">Error</Divider>
<Divider color="info">Info</Divider>

// Grosor de linea
<Divider thickness="thin" />
<Divider thickness="medium">Medium</Divider>
<Divider thickness="thick">Thick</Divider>
<Divider thickness={4}>Personalizado 4px</Divider>

// Divider vertical (separador inline)
<span>Item 1</span>
<Divider type="vertical" />
<span>Item 2</span>
<Divider type="vertical" />
<span>Item 3</span>

// Vertical con color
<span>Inicio</span>
<Divider type="vertical" color="primary" />
<span>Acerca de</span>

// Estilos combinados
<Divider dashed color="primary" thickness="medium" orientation="left">
  Seccion Importante
</Divider>
```

</details>

---

<details>
<summary><strong>Dropdown</strong> - Menús contextuales superpuestos</summary>

### Dropdown

Un componente de menú contextual que se activa al pasar el cursor, hacer clic o clic derecho. Soporta sub-menús anidados, grupos de items, divisores, items de peligro, renderizado personalizado del overlay, estado controlado, indicador de flecha y una variante compuesta `Dropdown.Button`.

#### Importar

```tsx
import { Dropdown } from 'j-ui'
```

#### Props

| Prop | Tipo | Por Defecto | Descripción |
|------|------|-------------|-------------|
| `children` | `ReactNode` | — | Elemento trigger |
| `menu` | `DropdownMenuConfig` | — | Configuración del menú |
| `trigger` | `DropdownTrigger[]` | `['hover']` | Tipo(s) de trigger: `'hover'`, `'click'`, `'contextMenu'` |
| `placement` | `DropdownPlacement` | `'bottomLeft'` | Posición del menú |
| `arrow` | `boolean` | `false` | Mostrar indicador de flecha |
| `open` | `boolean` | — | Estado controlado de apertura |
| `onOpenChange` | `(open: boolean) => void` | — | Callback al cambiar el estado |
| `disabled` | `boolean` | `false` | Desactivar el dropdown |
| `dropdownRender` | `(menu: ReactNode) => ReactNode` | — | Función de renderizado personalizado del overlay |
| `className` | `string` | — | Clase CSS adicional |
| `style` | `CSSProperties` | — | Estilos inline adicionales |
| `classNames` | `DropdownClassNames` | — | Clases CSS para partes internas |
| `styles` | `DropdownStyles` | — | Estilos para partes internas |

#### DropdownMenuConfig

```typescript
interface DropdownMenuConfig {
  items: DropdownMenuItemType[]   // Items del menú
  onClick?: (info: { key: string; domEvent: MouseEvent }) => void  // Handler global de clic
}
```

#### DropdownMenuItemType

```typescript
interface DropdownMenuItemType {
  key: string                    // Clave única
  label?: ReactNode              // Contenido del item
  icon?: ReactNode               // Icono a la izquierda
  disabled?: boolean             // Deshabilitar item
  danger?: boolean               // Estilo peligro (rojo)
  onClick?: (info: { key: string; domEvent: MouseEvent }) => void  // Handler individual
  children?: DropdownMenuItemType[]  // Items del sub-menú
  type?: 'divider' | 'group'    // Tipo especial
  title?: ReactNode              // Título del grupo (cuando type: 'group')
}
```

#### Posiciones

| Posición | Descripción |
|----------|-------------|
| `bottom` | Debajo, centrado |
| `bottomLeft` | Debajo, alineado a la izquierda |
| `bottomRight` | Debajo, alineado a la derecha |
| `top` | Arriba, centrado |
| `topLeft` | Arriba, alineado a la izquierda |
| `topRight` | Arriba, alineado a la derecha |

#### Dropdown.Button

Un botón dividido con una acción principal y un trigger de dropdown.

| Prop | Tipo | Por Defecto | Descripción |
|------|------|-------------|-------------|
| `children` | `ReactNode` | — | Contenido del botón principal |
| `menu` | `DropdownMenuConfig` | — | Configuración del menú |
| `placement` | `DropdownPlacement` | `'bottomRight'` | Posición del menú |
| `trigger` | `DropdownTrigger[]` | `['hover']` | Tipo(s) de trigger |
| `onClick` | `(e: MouseEvent) => void` | — | Handler de clic del botón principal |
| `icon` | `ReactNode` | `<ChevronDownIcon />` | Icono del botón dropdown |
| `disabled` | `boolean` | `false` | Desactivar ambos botones |
| `loading` | `boolean` | `false` | Estado de carga en botón principal |
| `variant` | `ButtonVariant` | `'primary'` | Variante del botón |
| `color` | `ButtonColor` | — | Color del botón |
| `size` | `ButtonSize` | `'md'` | Tamaño del botón |
| `className` | `string` | — | Clase CSS adicional |
| `style` | `CSSProperties` | — | Estilos inline adicionales |
| `classNames` | `DropdownClassNames` | — | Clases CSS para partes internas |
| `styles` | `DropdownStyles` | — | Estilos para partes internas |

#### DOM Semántico

| Slot | Descripción |
|------|-------------|
| `root` | Elemento contenedor exterior |
| `overlay` | Contenedor del menú superpuesto |
| `item` | Item individual del menú |
| `arrow` | Elemento indicador de flecha |

#### Ejemplos

```tsx
// Dropdown básico (hover)
<Dropdown
  menu={{
    items: [
      { key: 'editar', label: 'Editar' },
      { key: 'duplicar', label: 'Duplicar' },
      { key: 'eliminar', label: 'Eliminar', danger: true },
    ],
  }}
>
  <a>Pasa el cursor</a>
</Dropdown>

// Trigger por clic
<Dropdown
  trigger={['click']}
  menu={{
    items: [
      { key: 'perfil', label: 'Perfil' },
      { key: 'ajustes', label: 'Ajustes' },
      { key: 'salir', label: 'Cerrar sesión' },
    ],
  }}
>
  <Button>Haz clic</Button>
</Dropdown>

// Menú contextual (clic derecho)
<Dropdown
  trigger={['contextMenu']}
  menu={{
    items: [
      { key: 'copiar', label: 'Copiar' },
      { key: 'pegar', label: 'Pegar' },
      { key: 'cortar', label: 'Cortar' },
    ],
  }}
>
  <div style={{ padding: 40, border: '1px dashed #ccc' }}>
    Clic derecho aquí
  </div>
</Dropdown>

// Con iconos
<Dropdown
  menu={{
    items: [
      { key: 'editar', label: 'Editar', icon: <EditIcon /> },
      { key: 'copiar', label: 'Copiar', icon: <CopyIcon /> },
      { key: 'eliminar', label: 'Eliminar', icon: <TrashIcon />, danger: true },
    ],
  }}
>
  <Button>Acciones</Button>
</Dropdown>

// Con divisores y grupos
<Dropdown
  menu={{
    items: [
      { key: 'nuevo', label: 'Nuevo Archivo' },
      { key: 'abrir', label: 'Abrir Archivo' },
      { key: 'd1', type: 'divider' },
      {
        key: 'recientes',
        type: 'group',
        title: 'Archivos Recientes',
        children: [
          { key: 'archivo1', label: 'documento.tsx' },
          { key: 'archivo2', label: 'estilos.css' },
        ],
      },
    ],
  }}
>
  <Button>Archivo</Button>
</Dropdown>

// Sub-menús anidados
<Dropdown
  menu={{
    items: [
      { key: 'guardar', label: 'Guardar' },
      {
        key: 'exportar',
        label: 'Exportar como...',
        children: [
          { key: 'pdf', label: 'PDF' },
          { key: 'png', label: 'PNG' },
          { key: 'svg', label: 'SVG' },
        ],
      },
    ],
  }}
>
  <Button>Archivo</Button>
</Dropdown>

// Items deshabilitados
<Dropdown
  menu={{
    items: [
      { key: 'editar', label: 'Editar' },
      { key: 'eliminar', label: 'Eliminar', disabled: true },
    ],
  }}
>
  <Button>Acciones</Button>
</Dropdown>

// Con flecha
<Dropdown
  arrow
  placement="bottom"
  menu={{
    items: [
      { key: 'a', label: 'Opción A' },
      { key: 'b', label: 'Opción B' },
    ],
  }}
>
  <Button>Con Flecha</Button>
</Dropdown>

// Opciones de posición
<Dropdown
  placement="topRight"
  menu={{
    items: [
      { key: 'a', label: 'Opción A' },
      { key: 'b', label: 'Opción B' },
    ],
  }}
>
  <Button>Arriba Derecha</Button>
</Dropdown>

// Handler global onClick
<Dropdown
  menu={{
    items: [
      { key: 'opt1', label: 'Opción 1' },
      { key: 'opt2', label: 'Opción 2' },
    ],
    onClick: ({ key }) => console.log('Clic en:', key),
  }}
>
  <Button>Seleccionar</Button>
</Dropdown>

// Estado controlado
const [open, setOpen] = useState(false)

<Dropdown
  open={open}
  onOpenChange={setOpen}
  trigger={['click']}
  menu={{
    items: [
      { key: 'a', label: 'Opción A' },
      { key: 'b', label: 'Opción B' },
    ],
  }}
>
  <Button>Controlado</Button>
</Dropdown>

// Renderizado personalizado del overlay
<Dropdown
  trigger={['click']}
  menu={{
    items: [
      { key: 'a', label: 'Opción A' },
      { key: 'b', label: 'Opción B' },
    ],
  }}
  dropdownRender={(menu) => (
    <div>
      {menu}
      <div style={{ padding: 8, borderTop: '1px solid #eee' }}>
        <a href="/ajustes">Más ajustes...</a>
      </div>
    </div>
  )}
>
  <Button>Overlay Personalizado</Button>
</Dropdown>

// Dropdown.Button
<Dropdown.Button
  menu={{
    items: [
      { key: 'guardar-como', label: 'Guardar Como...' },
      { key: 'exportar', label: 'Exportar' },
    ],
  }}
  onClick={() => console.log('Clic en Guardar')}
>
  Guardar
</Dropdown.Button>

// Dropdown.Button con variantes
<Dropdown.Button
  variant="outlined"
  color="success"
  size="lg"
  menu={{
    items: [
      { key: 'borrador', label: 'Guardar como Borrador' },
      { key: 'plantilla', label: 'Guardar como Plantilla' },
    ],
  }}
  onClick={() => console.log('Publicar')}
>
  Publicar
</Dropdown.Button>
```

</details>

---

<details>
<summary><strong>Form</strong> - Recoleccion de datos con validacion, layouts y campos dinamicos</summary>

### Form

Un componente de formulario completo con validacion a nivel de campo (requerido, tipo, min/max, patron, validadores async personalizados), tres layouts (horizontal, vertical, inline), API `FormInstance` para control programatico, `Form.Item` para binding automatico de valores y visualizacion de errores, `Form.List` para arrays de campos dinamicos, `Form.ErrorList`, `Form.Provider` para comunicacion entre formularios, y hooks (`useForm`, `useWatch`, `useFormInstance`).

#### Importar

```tsx
import { Form } from 'j-ui'
```

#### Props de Form

| Prop | Tipo | Default | Descripcion |
|------|------|---------|-------------|
| `form` | `FormInstance` | — | Instancia de formulario creada con `Form.useForm()` |
| `name` | `string` | — | Nombre del formulario (usado con `Form.Provider`) |
| `layout` | `'horizontal' \| 'vertical' \| 'inline'` | `'horizontal'` | Layout del formulario |
| `variant` | `'outlined' \| 'filled' \| 'borderless' \| 'underlined'` | `'outlined'` | Variante de input propagada a los hijos |
| `size` | `'small' \| 'middle' \| 'large'` | `'middle'` | Tamaño propagado a los hijos |
| `initialValues` | `Record<string, any>` | — | Valores iniciales de campos |
| `onFinish` | `(values: Record<string, any>) => void` | — | Llamado al enviar exitosamente |
| `onFinishFailed` | `(errorInfo: { values; errorFields }) => void` | — | Llamado cuando falla la validacion al enviar |
| `onValuesChange` | `(changedValues, allValues) => void` | — | Llamado cuando cambia cualquier valor de campo |
| `onFieldsChange` | `(changedFields, allFields) => void` | — | Llamado cuando cambian datos de cualquier campo |
| `fields` | `FieldData[]` | — | Datos de campos controlados |
| `validateTrigger` | `string \| string[]` | `'onChange'` | Trigger de validacion por defecto |
| `colon` | `boolean` | `true` | Mostrar dos puntos despues del label |
| `labelAlign` | `'left' \| 'right'` | `'left'` | Alineacion del texto del label (requiere ancho fijo via `styles.label`) |
| `labelWrap` | `boolean` | `false` | Permitir ajuste de linea del label |
| `requiredMark` | `boolean \| 'optional' \| { position } \| function` | `true` | Configuracion de marca de requerido |
| `disabled` | `boolean` | `false` | Deshabilitar todos los campos |
| `scrollToFirstError` | `boolean \| ScrollIntoViewOptions` | `false` | Hacer scroll al primer error al enviar |
| `className` | `string` | — | Clase CSS |
| `style` | `CSSProperties` | — | Estilos inline |
| `classNames` | `FormClassNames` | — | Clases CSS de slots semanticos |
| `styles` | `FormStyles` | — | Estilos inline de slots semanticos |

#### Props de Form.Item

| Prop | Tipo | Default | Descripcion |
|------|------|---------|-------------|
| `name` | `NamePath` | — | Nombre del campo (se enlaza a valores del formulario) |
| `label` | `ReactNode` | — | Etiqueta del campo |
| `layout` | `FormLayout` | Heredado | Sobreescribir layout por item (layouts mixtos) |
| `rules` | `FormRule[]` | — | Reglas de validacion |
| `dependencies` | `NamePath[]` | — | Re-validar cuando estos campos cambien |
| `validateTrigger` | `string \| string[]` | Heredado | Sobreescritura del trigger de validacion |
| `validateFirst` | `boolean` | `false` | Parar en el primer error de regla |
| `validateDebounce` | `number` | — | Debounce de validacion (ms) |
| `valuePropName` | `string` | `'value'` | Prop del hijo para el valor (ej. `'checked'`) |
| `trigger` | `string` | `'onChange'` | Prop del hijo para evento de cambio |
| `getValueFromEvent` | `(...args) => any` | — | Extraccion personalizada del valor del evento |
| `getValueProps` | `(value) => Record<string, any>` | — | Mapeo personalizado de valor a props |
| `normalize` | `(value, prevValue, allValues) => any` | — | Normalizar valor antes de almacenar |
| `shouldUpdate` | `boolean \| ((prev, cur) => boolean)` | — | Forzar re-render en cualquier cambio de valor |
| `noStyle` | `boolean` | `false` | Renderizar sin wrapper (solo enlazar props) |
| `hidden` | `boolean` | `false` | Ocultar el campo |
| `required` | `boolean` | Auto | Sobreescribir indicador de requerido |
| `colon` | `boolean` | Heredado | Sobreescribir dos puntos por item |
| `labelAlign` | `'left' \| 'right'` | Heredado | Sobreescribir alineacion del label por item (requiere ancho fijo via `styles.label`) |
| `hasFeedback` | `boolean` | `false` | Mostrar icono de estado de validacion |
| `help` | `ReactNode` | Auto | Texto de ayuda (sobreescribe mensajes de validacion) |
| `extra` | `ReactNode` | — | Contenido extra debajo del campo |
| `validateStatus` | `FormValidateStatus` | Auto | Sobreescribir estado de validacion |
| `initialValue` | `any` | — | Valor inicial para este campo |
| `children` | `ReactNode \| (control, meta, form) => ReactNode` | — | Contenido del campo o render prop |
| `className` | `string` | — | Clase CSS |
| `style` | `CSSProperties` | — | Estilos inline |
| `classNames` | `FormItemClassNames` | — | Clases CSS de slots semanticos |
| `styles` | `FormItemStyles` | — | Estilos inline de slots semanticos |

#### Props de Form.List

| Prop | Tipo | Default | Descripcion |
|------|------|---------|-------------|
| `name` | `NamePath` | — | Nombre del campo array |
| `children` | `(fields, operations, meta) => ReactNode` | — | Funcion de renderizado |
| `initialValue` | `any[]` | — | Valores iniciales del array |

#### Props de Form.ErrorList

| Prop | Tipo | Default | Descripcion |
|------|------|---------|-------------|
| `errors` | `ReactNode[]` | — | Mensajes de error a mostrar |
| `className` | `string` | — | Clase CSS |
| `style` | `CSSProperties` | — | Estilos inline |

#### Props de Form.Provider

| Prop | Tipo | Default | Descripcion |
|------|------|---------|-------------|
| `onFormFinish` | `(name, info: { values, forms }) => void` | — | Llamado cuando cualquier formulario hijo finaliza |
| `onFormChange` | `(name, info: { changedFields, forms }) => void` | — | Llamado cuando cualquier formulario hijo cambia |

#### Hooks

| Hook | Firma | Descripcion |
|------|-------|-------------|
| `Form.useForm` | `(form?) => [FormInstance]` | Crea una instancia para control programatico |
| `useWatch` | `(name, form?) => value` | Se suscribe a un valor de campo reactivamente |
| `useFormInstance` | `() => FormInstance` | Accede a la instancia del formulario desde cualquier hijo |

#### Tipos

```typescript
type NamePath = string | number | (string | number)[]
type FormLayout = 'horizontal' | 'vertical' | 'inline'
type FormValidateStatus = 'success' | 'warning' | 'error' | 'validating' | ''
type FormVariant = 'outlined' | 'filled' | 'borderless' | 'underlined'
type FormSize = 'small' | 'middle' | 'large'
type FormRequiredMark =
  | boolean
  | 'optional'
  | { position: 'prefix' | 'suffix' }
  | ((label: ReactNode, info: { required: boolean }) => ReactNode)

interface FormRule {
  required?: boolean
  message?: string | ReactNode
  type?: 'string' | 'number' | 'boolean' | 'url' | 'email' | 'integer' | 'float'
  min?: number
  max?: number
  len?: number
  pattern?: RegExp
  whitespace?: boolean
  enum?: any[]
  validator?: (rule: FormRule, value: any) => Promise<void>
  transform?: (value: any) => any
  validateTrigger?: string | string[]
  warningOnly?: boolean
}

interface FormInstance {
  getFieldValue(name: NamePath): any
  getFieldsValue(nameList?: NamePath[] | true): Record<string, any>
  setFieldValue(name: NamePath, value: any): void
  setFieldsValue(values: Record<string, any>): void
  validateFields(nameList?, options?): Promise<Record<string, any>>
  resetFields(nameList?: NamePath[]): void
  isFieldTouched(name: NamePath): boolean
  isFieldsTouched(nameList?, allFieldsTouched?): boolean
  getFieldError(name: NamePath): string[]
  getFieldsError(nameList?): FieldError[]
  submit(): void
  scrollToField(name: NamePath, options?: ScrollIntoViewOptions): void
  isFieldValidating(name: NamePath): boolean
}

interface FieldError {
  name: (string | number)[]
  errors: string[]
  warnings: string[]
}

interface FormListField { name: number; key: number }
interface FormListOperations {
  add(defaultValue?, insertIndex?): void
  remove(index: number | number[]): void
  move(from: number, to: number): void
}

// Tipos de slots semanticos
type FormSemanticSlot = 'root'
type FormItemSemanticSlot = 'root' | 'label' | 'control' | 'help' | 'extra'
```

#### DOM Semantico

**Form:**

| Slot | Elemento | Descripcion |
|------|----------|-------------|
| `root` | `<form>` | Elemento raiz del formulario |

**Form.Item:**

| Slot | Elemento | Descripcion |
|------|----------|-------------|
| `root` | `<div>` | Wrapper del item con layout (horizontal/vertical) |
| `label` | `<label>` | Etiqueta con marca de requerido y dos puntos |
| `control` | `<div>` | Area de control que envuelve el campo |
| `help` | `<div>` | Mensajes de validacion o texto de ayuda personalizado |
| `extra` | `<div>` | Contenido extra debajo del campo |

#### Ejemplos

```tsx
// Formulario basico
const [form] = Form.useForm()

<Form form={form} onFinish={(values) => console.log(values)}>
  <Form.Item label="Usuario" name="username" rules={[{ required: true }]}>
    <input />
  </Form.Item>
  <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
    <input />
  </Form.Item>
  <button type="submit">Enviar</button>
</Form>

// Layout vertical
<Form layout="vertical">
  <Form.Item label="Nombre" name="name">
    <input />
  </Form.Item>
</Form>

// Layout inline
<Form layout="inline">
  <Form.Item name="search">
    <input placeholder="Buscar..." />
  </Form.Item>
  <button type="submit">Ir</button>
</Form>

// Layouts mixtos (sobreescritura por item)
<Form layout="horizontal">
  <Form.Item label="Nombre" name="name">
    <input />
  </Form.Item>
  <Form.Item layout="vertical" label="Bio" name="bio">
    <textarea />
  </Form.Item>
</Form>

// Reglas de validacion
<Form.Item
  label="Contraseña"
  name="password"
  rules={[
    { required: true, message: 'La contraseña es requerida' },
    { min: 8, message: 'Al menos 8 caracteres' },
    { pattern: /[A-Z]/, message: 'Debe contener mayuscula' },
  ]}
>
  <input type="password" />
</Form.Item>

// Validador async personalizado
<Form.Item
  label="Usuario"
  name="username"
  rules={[{
    validator: async (_, value) => {
      const exists = await checkUsername(value)
      if (exists) throw new Error('Usuario no disponible')
    },
  }]}
>
  <input />
</Form.Item>

// Dependencias (confirmar contraseña)
<Form.Item label="Contraseña" name="password" rules={[{ required: true }]}>
  <input type="password" />
</Form.Item>
<Form.Item
  label="Confirmar"
  name="confirm"
  dependencies={['password']}
  rules={[{
    validator: async (_, value) => {
      if (value !== form.getFieldValue('password')) {
        throw new Error('Las contraseñas no coinciden')
      }
    },
  }]}
>
  <input type="password" />
</Form.Item>

// hasFeedback (iconos de estado)
<Form.Item label="Email" name="email" hasFeedback rules={[{ type: 'email' }]}>
  <input />
</Form.Item>

// Checkbox con valuePropName
<Form.Item name="agree" valuePropName="checked">
  <Checkbox>Acepto los terminos</Checkbox>
</Form.Item>

// Form.List (campos dinamicos)
<Form.List name="users">
  {(fields, { add, remove }) => (
    <>
      {fields.map(({ key, name }) => (
        <div key={key} style={{ display: 'flex', gap: 8 }}>
          <Form.Item name={[name, 'name']} rules={[{ required: true }]}>
            <input placeholder="Nombre" />
          </Form.Item>
          <button type="button" onClick={() => remove(name)}>Eliminar</button>
        </div>
      ))}
      <button type="button" onClick={() => add()}>Agregar Usuario</button>
    </>
  )}
</Form.List>

// useWatch
function PrecioDisplay() {
  const precio = Form.useWatch('price')
  return <span>Actual: ${precio ?? 0}</span>
}

// Control programatico
form.setFieldsValue({ username: 'juan', email: 'juan@ejemplo.com' })
form.resetFields()
form.validateFields(['username'])
form.scrollToField('email')

// Formulario deshabilitado
<Form disabled>
  <Form.Item label="Nombre" name="name"><input /></Form.Item>
</Form>

// Variaciones de marca de requerido
<Form requiredMark="optional">...</Form>
<Form requiredMark={{ position: 'prefix' }}>...</Form>
<Form requiredMark={false}>...</Form>

// Form.Provider (comunicacion entre formularios)
// El formulario principal recoge un nombre de proyecto + una lista de contactos.
// Al hacer clic en "Agregar contacto" se abre un modal con su propio formulario.
// Cuando el formulario de contacto se envia, Form.Provider lo intercepta
// via onFormFinish, agrega el contacto, resetea el formulario y cierra el modal.
function ProjectForm() {
  const [mainForm] = Form.useForm()
  const [contactForm] = Form.useForm()
  const [showModal, setShowModal] = useState(false)
  const [contacts, setContacts] = useState([])

  return (
    <Form.Provider
      onFormFinish={(name, { values }) => {
        if (name === 'contactForm') {
          setContacts(prev => [...prev, values])
          contactForm.resetFields()
          setShowModal(false)
        }
      }}
    >
      <Form form={mainForm} name="mainForm" layout="vertical"
        onFinish={(v) => console.log({ ...v, contacts })}>
        <Form.Item name="project" label="Nombre del proyecto" rules={[{ required: true }]}>
          <input />
        </Form.Item>
        <Form.Item label="Contactos">
          {contacts.map((c, i) => <div key={i}>{c.name} — {c.phone}</div>)}
          <button type="button" onClick={() => setShowModal(true)}>+ Agregar contacto</button>
        </Form.Item>
        <Form.Item><button type="submit">Enviar todo</button></Form.Item>
      </Form>

      {/* Modal con su propio formulario */}
      {showModal && (
        <div className="modal-overlay">
          <Form form={contactForm} name="contactForm" layout="vertical">
            <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
              <input />
            </Form.Item>
            <Form.Item name="phone" label="Telefono" rules={[{ required: true }]}>
              <input />
            </Form.Item>
            <button type="button" onClick={() => contactForm.submit()}>Agregar</button>
          </Form>
        </div>
      )}
    </Form.Provider>
  )
}

// Estilizado semantico
<Form.Item
  label="Nombre"
  name="name"
  styles={{
    label: { fontWeight: 700 },
    control: { maxWidth: 300 },
    help: { fontStyle: 'italic' },
  }}
>
  <input />
</Form.Item>
```

</details>

---

<details>
<summary><strong>Flex</strong> - Contenedor flexbox para layout</summary>

### Flex

Un componente de layout con CSS Flexbox para organizar elementos.

#### Importar

```tsx
import { Flex } from 'j-ui'
```

#### Props

| Prop | Tipo | Por Defecto | Descripcion |
|------|------|-------------|-------------|
| `children` | `ReactNode` | — | Contenido del flex container |
| `vertical` | `boolean` | `false` | Direccion vertical (column) en lugar de horizontal (row) |
| `wrap` | `'nowrap' \| 'wrap' \| 'wrap-reverse' \| boolean` | `'nowrap'` | Comportamiento de wrap |
| `justify` | `FlexJustify` | `'normal'` | Alineacion horizontal (justify-content) |
| `align` | `FlexAlign` | `'normal'` | Alineacion vertical (align-items) |
| `gap` | `'small' \| 'middle' \| 'large' \| number \| [number, number]` | — | Espacio entre elementos |
| `flex` | `CSSProperties['flex']` | — | Propiedad flex del contenedor |
| `component` | `ElementType` | `'div'` | Elemento HTML a renderizar |

#### Valores de FlexJustify

`'flex-start'` | `'center'` | `'flex-end'` | `'space-between'` | `'space-around'` | `'space-evenly'` | `'start'` | `'end'` | `'normal'`

#### Valores de FlexAlign

`'flex-start'` | `'center'` | `'flex-end'` | `'stretch'` | `'baseline'` | `'start'` | `'end'` | `'normal'`

#### Valores de Gap

| Gap | Valor |
|-----|-------|
| `'small'` | 8px |
| `'middle'` | 16px |
| `'large'` | 24px |
| `number` | Valor personalizado en px |
| `[h, v]` | Gap [horizontal, vertical] |

#### Ejemplos

```tsx
// Flex horizontal basico
<Flex>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Flex>

// Flex vertical
<Flex vertical>
  <div>Arriba</div>
  <div>Medio</div>
  <div>Abajo</div>
</Flex>

// Con gap
<Flex gap="middle">
  <div>Item 1</div>
  <div>Item 2</div>
</Flex>

// Gap numerico personalizado
<Flex gap={20}>
  <div>Item 1</div>
  <div>Item 2</div>
</Flex>

// Gap horizontal y vertical diferente
<Flex wrap gap={[16, 8]}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Flex>

// Justify y align
<Flex justify="center" align="center" style={{ height: 200 }}>
  <div>Centrado</div>
</Flex>

// Space between
<Flex justify="space-between">
  <div>Izquierda</div>
  <div>Derecha</div>
</Flex>

// Con wrap
<Flex wrap gap="small">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</Flex>

// Elemento personalizado
<Flex component="nav" gap="middle">
  <a href="/">Inicio</a>
  <a href="/acerca">Acerca de</a>
</Flex>

// Combinado
<Flex vertical gap="large" align="stretch">
  <Flex justify="space-between">
    <span>Titulo</span>
    <button>Accion</button>
  </Flex>
  <div>Contenido</div>
</Flex>
```

</details>

---

<details>
<summary><strong>Grid</strong> - Sistema de grid responsivo de 24 columnas</summary>

### Grid

Un sistema de grid responsivo basado en 24 columnas con componentes Row y Col.

#### Importar

```tsx
import { Grid, Row, Col } from 'j-ui'
// o
import { Grid } from 'j-ui'
// Usar como Grid.Row y Grid.Col
```

#### Props de Row

| Prop | Tipo | Por Defecto | Descripcion |
|------|------|-------------|-------------|
| `children` | `ReactNode` | — | Componentes Col |
| `gutter` | `number \| ResponsiveGutter \| [horizontal, vertical]` | `0` | Espacio entre columnas (px) |
| `align` | `'top' \| 'middle' \| 'bottom' \| 'stretch'` | `'top'` | Alineacion vertical |
| `justify` | `'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between' \| 'space-evenly'` | `'start'` | Alineacion horizontal |
| `wrap` | `boolean` | `true` | Permitir wrap |

#### Props de Col

| Prop | Tipo | Por Defecto | Descripcion |
|------|------|-------------|-------------|
| `children` | `ReactNode` | — | Contenido de la columna |
| `span` | `number` | — | Numero de columnas (1-24) |
| `offset` | `number` | — | Columnas a desplazar desde la izquierda |
| `push` | `number` | — | Mover a la derecha con position |
| `pull` | `number` | — | Mover a la izquierda con position |
| `order` | `number` | — | Orden flex |
| `flex` | `CSSProperties['flex']` | — | Propiedad flex |
| `xs` | `number \| ColSpanProps` | — | <576px |
| `sm` | `number \| ColSpanProps` | — | ≥576px |
| `md` | `number \| ColSpanProps` | — | ≥768px |
| `lg` | `number \| ColSpanProps` | — | ≥992px |
| `xl` | `number \| ColSpanProps` | — | ≥1200px |
| `xxl` | `number \| ColSpanProps` | — | ≥1600px |

#### Breakpoints

| Breakpoint | Ancho Minimo |
|------------|--------------|
| `xs` | 0px |
| `sm` | 576px |
| `md` | 768px |
| `lg` | 992px |
| `xl` | 1200px |
| `xxl` | 1600px |

#### Ejemplos

```tsx
// Grid basico
<Row>
  <Col span={12}>50%</Col>
  <Col span={12}>50%</Col>
</Row>

// Tres columnas
<Row>
  <Col span={8}>33.33%</Col>
  <Col span={8}>33.33%</Col>
  <Col span={8}>33.33%</Col>
</Row>

// Con gutter
<Row gutter={16}>
  <Col span={6}>25%</Col>
  <Col span={6}>25%</Col>
  <Col span={6}>25%</Col>
  <Col span={6}>25%</Col>
</Row>

// Gutter horizontal y vertical
<Row gutter={[16, 24]}>
  <Col span={6}>Item</Col>
  <Col span={6}>Item</Col>
  <Col span={6}>Item</Col>
  <Col span={6}>Item</Col>
  <Col span={6}>Item</Col>
  <Col span={6}>Item</Col>
</Row>

// Con offset
<Row>
  <Col span={8}>col-8</Col>
  <Col span={8} offset={8}>col-8 offset-8</Col>
</Row>

// Responsivo
<Row gutter={16}>
  <Col xs={24} sm={12} md={8} lg={6}>
    Columna responsiva
  </Col>
  <Col xs={24} sm={12} md={8} lg={6}>
    Columna responsiva
  </Col>
  <Col xs={24} sm={12} md={8} lg={6}>
    Columna responsiva
  </Col>
  <Col xs={24} sm={12} md={8} lg={6}>
    Columna responsiva
  </Col>
</Row>

// Responsivo con props completas
<Row>
  <Col xs={{ span: 24 }} md={{ span: 12, offset: 6 }}>
    Responsivo complejo
  </Col>
</Row>

// Alineacion
<Row justify="center" align="middle" style={{ height: 100 }}>
  <Col span={4}>Centrado</Col>
</Row>

// Columnas flex
<Row>
  <Col flex="100px">Fijo 100px</Col>
  <Col flex="auto">Flexible</Col>
  <Col flex="100px">Fijo 100px</Col>
</Row>

// Usando namespace Grid
<Grid.Row gutter={16}>
  <Grid.Col span={12}>Izquierda</Grid.Col>
  <Grid.Col span={12}>Derecha</Grid.Col>
</Grid.Row>
```

</details>

---

<details>
<summary><strong>Layout</strong> - Layout de pagina con Header, Sider, Content, Footer</summary>

### Layout

Un sistema de layout completo con componentes Header, Footer, Sider y Content.

#### Importar

```tsx
import { Layout } from 'j-ui'
// Usar como Layout, Layout.Header, Layout.Sider, Layout.Content, Layout.Footer

// O importar individualmente
import { Layout, Header, Footer, Content, Sider } from 'j-ui'
```

#### Props de Layout

| Prop | Tipo | Por Defecto | Descripcion |
|------|------|-------------|-------------|
| `children` | `ReactNode` | — | Contenido del layout |
| `hasSider` | `boolean` | `false` | Tiene Sider como hijo directo |

#### Props de Header

| Prop | Tipo | Por Defecto | Descripcion |
|------|------|-------------|-------------|
| `children` | `ReactNode` | — | Contenido del header |

Altura por defecto: 64px, padding: 0 24px

#### Props de Footer

| Prop | Tipo | Por Defecto | Descripcion |
|------|------|-------------|-------------|
| `children` | `ReactNode` | — | Contenido del footer |

Padding por defecto: 24px 50px

#### Props de Content

| Prop | Tipo | Por Defecto | Descripcion |
|------|------|-------------|-------------|
| `children` | `ReactNode` | — | Contenido principal |

Padding por defecto: 24px

#### Props de Sider

| Prop | Tipo | Por Defecto | Descripcion |
|------|------|-------------|-------------|
| `children` | `ReactNode` | — | Contenido del sider |
| `width` | `number \| string` | `200` | Ancho del sider (px) |
| `collapsedWidth` | `number` | `80` | Ancho cuando esta colapsado |
| `collapsible` | `boolean` | `false` | Puede colapsarse |
| `collapsed` | `boolean` | — | Estado colapsado (controlado) |
| `defaultCollapsed` | `boolean` | `false` | Estado colapsado inicial |
| `reverseArrow` | `boolean` | `false` | Invertir direccion de la flecha del trigger |
| `breakpoint` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'` | — | Breakpoint para auto-colapsar |
| `theme` | `'light' \| 'dark'` | `'dark'` | Tema del sider |
| `trigger` | `ReactNode \| null` | — | Trigger personalizado, null para ocultar |
| `onCollapse` | `(collapsed: boolean, type: 'clickTrigger' \| 'responsive') => void` | — | Callback al colapsar |
| `onBreakpoint` | `(broken: boolean) => void` | — | Callback del breakpoint |

#### Breakpoints

| Breakpoint | Ancho |
|------------|-------|
| `xs` | 480px |
| `sm` | 576px |
| `md` | 768px |
| `lg` | 992px |
| `xl` | 1200px |
| `xxl` | 1600px |

#### DOM Semántico del Sider

| Slot | Descripción |
|------|-------------|
| `root` | Elemento `<aside>` exterior |
| `content` | Contenedor interno del contenido |
| `trigger` | Botón disparador de colapso |

#### Ejemplos

```tsx
// Layout basico
<Layout>
  <Layout.Header>Header</Layout.Header>
  <Layout.Content>Contenido</Layout.Content>
  <Layout.Footer>Footer</Layout.Footer>
</Layout>

// Con Sider
<Layout>
  <Layout.Header>Header</Layout.Header>
  <Layout hasSider>
    <Layout.Sider>Barra lateral</Layout.Sider>
    <Layout.Content>Contenido</Layout.Content>
  </Layout>
  <Layout.Footer>Footer</Layout.Footer>
</Layout>

// Sider a la derecha
<Layout hasSider>
  <Layout.Content>Contenido</Layout.Content>
  <Layout.Sider>Barra derecha</Layout.Sider>
</Layout>

// Sider colapsable
<Layout hasSider>
  <Layout.Sider collapsible>
    Navegacion
  </Layout.Sider>
  <Layout.Content>Contenido</Layout.Content>
</Layout>

// Colapso controlado
function MiLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Layout hasSider>
      <Layout.Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(c) => setCollapsed(c)}
      >
        Navegacion
      </Layout.Sider>
      <Layout.Content>Contenido</Layout.Content>
    </Layout>
  )
}

// Colapso responsivo
<Layout hasSider>
  <Layout.Sider
    collapsible
    breakpoint="lg"
    onBreakpoint={(broken) => console.log('Broken:', broken)}
  >
    Barra lateral responsiva
  </Layout.Sider>
  <Layout.Content>Contenido</Layout.Content>
</Layout>

// Ancho colapsado personalizado
<Layout hasSider>
  <Layout.Sider collapsible collapsedWidth={0}>
    Oculto cuando colapsado
  </Layout.Sider>
  <Layout.Content>Contenido</Layout.Content>
</Layout>

// Tema claro
<Layout hasSider>
  <Layout.Sider theme="light">
    Barra lateral clara
  </Layout.Sider>
  <Layout.Content>Contenido</Layout.Content>
</Layout>

// Trigger personalizado
<Layout hasSider>
  <Layout.Sider
    collapsible
    trigger={<span>Alternar</span>}
  >
    Trigger personalizado
  </Layout.Sider>
  <Layout.Content>Contenido</Layout.Content>
</Layout>

// Sin trigger (controlar externamente)
<Layout hasSider>
  <Layout.Sider collapsible trigger={null} collapsed={collapsed}>
    <button onClick={() => setCollapsed(!collapsed)}>Alternar</button>
  </Layout.Sider>
  <Layout.Content>Contenido</Layout.Content>
</Layout>

// Layout de pagina completa
<Layout style={{ minHeight: '100vh' }}>
  <Layout.Header>
    <div>Logo</div>
    <nav>Navegacion</nav>
  </Layout.Header>
  <Layout hasSider>
    <Layout.Sider collapsible breakpoint="md">
      <nav>Navegacion lateral</nav>
    </Layout.Sider>
    <Layout>
      <Layout.Content>
        <main>Contenido principal</main>
      </Layout.Content>
      <Layout.Footer>© 2024 Empresa</Layout.Footer>
    </Layout>
  </Layout>
</Layout>
```

#### Hook useSider

Acceder al contexto del sider desde componentes hijos:

```tsx
import { useSider } from 'j-ui'

function ComponenteMenu() {
  const { siderCollapsed } = useSider()

  return (
    <nav>
      {siderCollapsed ? <SoloIconos /> : <MenuCompleto />}
    </nav>
  )
}
```

</details>

---

<details>
<summary><strong>Menu</strong> - Menú de navegación con múltiples modos</summary>

### Menu

Un componente de menú de navegación versátil que soporta modos vertical, horizontal e inline. Incluye sub-menús, grupos de items, divisores, gestión de selección (simple/múltiple), colapso inline y estado controlado/no controlado.

#### Importar

```tsx
import { Menu } from 'j-ui'
```

#### Props

| Prop | Tipo | Por Defecto | Descripción |
|------|------|-------------|-------------|
| `items` | `MenuItemType[]` | `[]` | Items del menú (declarativo) |
| `mode` | `'vertical' \| 'horizontal' \| 'inline'` | `'vertical'` | Modo de visualización |
| `selectedKeys` | `string[]` | — | Keys de items seleccionados (controlado) |
| `defaultSelectedKeys` | `string[]` | `[]` | Keys seleccionados iniciales (no controlado) |
| `openKeys` | `string[]` | — | Keys de sub-menús abiertos (controlado) |
| `defaultOpenKeys` | `string[]` | `[]` | Keys de sub-menús abiertos iniciales (no controlado) |
| `multiple` | `boolean` | `false` | Permitir selección múltiple |
| `selectable` | `boolean` | `true` | Habilitar selección de items |
| `inlineCollapsed` | `boolean` | `false` | Colapsar menú inline a solo iconos |
| `inlineIndent` | `number` | `24` | Ancho de indentación (px) por nivel inline |
| `triggerSubMenuAction` | `'hover' \| 'click'` | `'hover'` | Cómo se activan los sub-menús |
| `onClick` | `(info: MenuClickInfo) => void` | — | Handler global de clic |
| `onSelect` | `(info: MenuSelectInfo) => void` | — | Callback al seleccionar un item |
| `onDeselect` | `(info: MenuSelectInfo) => void` | — | Callback al deseleccionar un item (modo múltiple) |
| `onOpenChange` | `(openKeys: string[]) => void` | — | Callback al cambiar sub-menús abiertos |
| `expandIcon` | `ReactNode` | — | Icono personalizado para expandir sub-menús |
| `className` | `string` | — | Clase CSS adicional |
| `style` | `CSSProperties` | — | Estilos inline adicionales |
| `classNames` | `MenuClassNames` | — | Clases CSS para partes internas |
| `styles` | `MenuStyles` | — | Estilos para partes internas |

#### MenuItemType

Una unión de los siguientes tipos:

**MenuItemOption** — Item de menú regular:

```typescript
interface MenuItemOption {
  key: string
  label?: ReactNode       // Contenido del item
  icon?: ReactNode        // Icono a la izquierda
  disabled?: boolean      // Deshabilitar item
  danger?: boolean        // Estilo peligro (rojo)
  title?: string          // Atributo HTML title
  onClick?: (info: MenuClickInfo) => void
}
```

**SubMenuOption** — Item con hijos anidados:

```typescript
interface SubMenuOption {
  key: string
  label?: ReactNode       // Texto del trigger del sub-menú
  icon?: ReactNode        // Icono a la izquierda
  disabled?: boolean
  children: MenuItemType[]  // Items anidados
}
```

**MenuItemGroupOption** — Grupo visual con título:

```typescript
interface MenuItemGroupOption {
  key?: string
  type: 'group'
  label?: ReactNode       // Título del grupo
  children: MenuItemType[]
}
```

**MenuDividerOption** — Línea separadora:

```typescript
interface MenuDividerOption {
  key?: string
  type: 'divider'
  dashed?: boolean        // Estilo de línea discontinua
}
```

#### Info de Callbacks

```typescript
interface MenuClickInfo {
  key: string             // Key del item clicado
  keyPath: string[]       // Ruta completa de keys del item a la raíz
  domEvent: MouseEvent
}

interface MenuSelectInfo extends MenuClickInfo {
  selectedKeys: string[]  // Todos los keys actualmente seleccionados
}
```

#### DOM Semántico

| Slot | Descripción |
|------|-------------|
| `root` | Elemento `<ul>` exterior |
| `item` | Item individual del menú o trigger de sub-menú |
| `submenu` | Contenedor `<ul>` del sub-menú (popup o inline) |
| `group` | Contenedor `<li>` del grupo |
| `groupTitle` | Elemento `<div>` del título del grupo |
| `divider` | Elemento `<li>` divisor |

#### Ejemplos

```tsx
// Menú vertical básico
<Menu
  items={[
    { key: 'inicio', label: 'Inicio', icon: <HomeIcon /> },
    { key: 'acerca', label: 'Acerca de' },
    { key: 'contacto', label: 'Contacto' },
  ]}
  onClick={({ key }) => console.log('Clic en:', key)}
/>

// Menú horizontal
<Menu
  mode="horizontal"
  items={[
    { key: 'inicio', label: 'Inicio' },
    { key: 'productos', label: 'Productos' },
    { key: 'acerca', label: 'Acerca de' },
  ]}
  defaultSelectedKeys={['inicio']}
/>

// Con sub-menús
<Menu
  items={[
    { key: 'bandeja', label: 'Bandeja', icon: <InboxIcon /> },
    {
      key: 'ajustes',
      label: 'Ajustes',
      icon: <SettingsIcon />,
      children: [
        { key: 'perfil', label: 'Perfil' },
        { key: 'cuenta', label: 'Cuenta' },
        { key: 'seguridad', label: 'Seguridad' },
      ],
    },
    { key: 'salir', label: 'Cerrar sesión', danger: true },
  ]}
/>

// Con grupos y divisores
<Menu
  items={[
    {
      key: 'grupo1',
      type: 'group',
      label: 'Navegación',
      children: [
        { key: 'inicio', label: 'Inicio' },
        { key: 'panel', label: 'Panel' },
      ],
    },
    { key: 'd1', type: 'divider' },
    {
      key: 'grupo2',
      type: 'group',
      label: 'Configuración',
      children: [
        { key: 'perfil', label: 'Perfil' },
        { key: 'preferencias', label: 'Preferencias' },
      ],
    },
  ]}
/>

// Divisor discontinuo
<Menu
  items={[
    { key: 'item1', label: 'Item 1' },
    { key: 'd1', type: 'divider', dashed: true },
    { key: 'item2', label: 'Item 2' },
  ]}
/>

// Modo inline (sidebar)
<Menu
  mode="inline"
  defaultOpenKeys={['sub1']}
  defaultSelectedKeys={['1']}
  items={[
    {
      key: 'sub1',
      label: 'Navegación Uno',
      icon: <HomeIcon />,
      children: [
        { key: '1', label: 'Opción 1' },
        { key: '2', label: 'Opción 2' },
      ],
    },
    {
      key: 'sub2',
      label: 'Navegación Dos',
      icon: <SettingsIcon />,
      children: [
        { key: '3', label: 'Opción 3' },
        { key: '4', label: 'Opción 4' },
      ],
    },
  ]}
  style={{ width: 256 }}
/>

// Inline colapsado (sidebar solo iconos)
<Menu
  mode="inline"
  inlineCollapsed={true}
  items={[
    { key: 'inicio', label: 'Inicio', icon: <HomeIcon /> },
    {
      key: 'ajustes',
      label: 'Ajustes',
      icon: <SettingsIcon />,
      children: [
        { key: 'perfil', label: 'Perfil' },
        { key: 'cuenta', label: 'Cuenta' },
      ],
    },
  ]}
/>

// Selección múltiple
<Menu
  multiple
  items={[
    { key: 'negrita', label: 'Negrita', icon: <BoldIcon /> },
    { key: 'cursiva', label: 'Cursiva', icon: <ItalicIcon /> },
    { key: 'subrayado', label: 'Subrayado', icon: <UnderlineIcon /> },
  ]}
  defaultSelectedKeys={['negrita']}
  onSelect={({ selectedKeys }) => console.log('Seleccionados:', selectedKeys)}
/>

// Trigger por clic para sub-menús
<Menu
  triggerSubMenuAction="click"
  items={[
    { key: 'inicio', label: 'Inicio' },
    {
      key: 'mas',
      label: 'Más',
      children: [
        { key: 'ayuda', label: 'Ayuda' },
        { key: 'acerca', label: 'Acerca de' },
      ],
    },
  ]}
/>

// Estado controlado
const [selectedKeys, setSelectedKeys] = useState(['inicio'])
const [openKeys, setOpenKeys] = useState<string[]>([])

<Menu
  selectedKeys={selectedKeys}
  openKeys={openKeys}
  onSelect={({ selectedKeys }) => setSelectedKeys(selectedKeys)}
  onOpenChange={(keys) => setOpenKeys(keys)}
  items={[
    { key: 'inicio', label: 'Inicio' },
    {
      key: 'nav',
      label: 'Navegación',
      children: [
        { key: 'pagina1', label: 'Página 1' },
        { key: 'pagina2', label: 'Página 2' },
      ],
    },
  ]}
/>

// Items deshabilitados
<Menu
  items={[
    { key: 'activo', label: 'Activo' },
    { key: 'deshabilitado', label: 'Deshabilitado', disabled: true },
    { key: 'peligro', label: 'Eliminar', danger: true },
  ]}
/>

// Icono de expansión personalizado
<Menu
  expandIcon={<span>+</span>}
  items={[
    {
      key: 'sub',
      label: 'Sub Menú',
      children: [
        { key: 'a', label: 'Item A' },
        { key: 'b', label: 'Item B' },
      ],
    },
  ]}
/>

// Menú no seleccionable (solo acciones)
<Menu
  selectable={false}
  items={[
    { key: 'copiar', label: 'Copiar', icon: <CopyIcon /> },
    { key: 'pegar', label: 'Pegar', icon: <PasteIcon /> },
  ]}
  onClick={({ key }) => handleAction(key)}
/>
```

</details>

---

<details>
<summary><strong>NestedSelect</strong> - Selección jerárquica en cascada con búsqueda y modo múltiple</summary>

### NestedSelect

Un componente de selección en cascada para datos jerárquicos (ej. provincia/ciudad/distrito). Soporta selección simple y múltiple con checkboxes, búsqueda con resaltado, carga lazy, nombres de campos personalizados, renderizado personalizado, gestión de tags, expansión al pasar el mouse, y una variante de panel inline (`NestedSelect.Panel`).

#### Importar

```tsx
import { NestedSelect } from 'j-ui'
```

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `options` | `NestedSelectOption[]` | `[]` | Opciones jerárquicas |
| `value` | `(string\|number)[] \| (string\|number)[][]` | — | Valor controlado. Simple: array de ruta. Múltiple: array de rutas |
| `defaultValue` | `(string\|number)[] \| (string\|number)[][]` | — | Valor por defecto (no controlado) |
| `placeholder` | `string` | `'Seleccionar'` | Texto placeholder |
| `open` | `boolean` | — | Visibilidad del desplegable (controlado) |
| `disabled` | `boolean` | `false` | Deshabilitar el componente |
| `allowClear` | `boolean` | `true` | Mostrar botón de limpieza |
| `expandTrigger` | `'click' \| 'hover'` | `'click'` | Cómo expandir sub-opciones |
| `changeOnSelect` | `boolean` | `false` | Permitir seleccionar niveles intermedios |
| `showSearch` | `boolean \| NestedSelectSearchConfig` | `false` | Habilitar búsqueda |
| `variant` | `'outlined' \| 'filled' \| 'borderless'` | `'outlined'` | Variante visual |
| `status` | `'error' \| 'warning'` | — | Estado de validación |
| `size` | `'large' \| 'middle' \| 'small'` | `'middle'` | Tamaño del componente |
| `suffixIcon` | `ReactNode` | chevron | Icono sufijo personalizado |
| `expandIcon` | `ReactNode` | chevron-right | Icono de expansión personalizado |
| `notFoundContent` | `ReactNode` | `'Sin resultados'` | Contenido cuando la búsqueda no tiene coincidencias |
| `displayRender` | `(labels, selectedOptions) => ReactNode` | — | Renderizado personalizado del valor (modo simple) |
| `fieldNames` | `NestedSelectFieldNames` | — | Mapeo de nombres de campos personalizados |
| `placement` | `NestedSelectPlacement` | `'bottomLeft'` | Posición del desplegable |
| `multiple` | `boolean` | `false` | Habilitar selección múltiple con checkboxes |
| `showCheckedStrategy` | `'SHOW_PARENT' \| 'SHOW_CHILD'` | `'SHOW_CHILD'` | Estrategia de visualización de tags en modo múltiple |
| `maxTagCount` | `number` | — | Máximo de tags visibles en modo múltiple |
| `maxTagPlaceholder` | `ReactNode \| ((omitted) => ReactNode)` | — | Placeholder para tags ocultos |
| `tagRender` | `(props: NestedSelectTagRenderProps) => ReactNode` | — | Renderizado personalizado de tags |
| `loadData` | `(selectedOptions) => void` | — | Callback para carga lazy |
| `prefix` | `ReactNode` | — | Contenido antes del valor en el selector |
| `popupRender` | `(menus: ReactNode) => ReactNode` | — | Wrapper personalizado del contenido del desplegable |
| `onChange` | `(value, selectedOptions) => void` | — | Llamado cuando cambia la selección |
| `onDropdownVisibleChange` | `(open: boolean) => void` | — | Llamado cuando cambia la visibilidad del desplegable |
| `className` | `string` | — | Clase CSS para el elemento raíz |
| `style` | `CSSProperties` | — | Estilos inline para el elemento raíz |
| `classNames` | `NestedSelectClassNames` | — | Clases CSS para partes internas |
| `styles` | `NestedSelectStyles` | — | Estilos inline para partes internas |

#### Props de NestedSelect.Panel

Una versión inline de los menús en cascada (sin desplegable/selector).

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `options` | `NestedSelectOption[]` | `[]` | Opciones jerárquicas |
| `value` | `(string\|number)[] \| (string\|number)[][]` | — | Valor controlado |
| `defaultValue` | `(string\|number)[] \| (string\|number)[][]` | — | Valor por defecto |
| `onChange` | `(value, selectedOptions) => void` | — | Llamado cuando cambia la selección |
| `multiple` | `boolean` | `false` | Habilitar selección múltiple |
| `expandTrigger` | `'click' \| 'hover'` | `'click'` | Cómo expandir sub-opciones |
| `changeOnSelect` | `boolean` | `false` | Permitir seleccionar niveles intermedios |
| `fieldNames` | `NestedSelectFieldNames` | — | Mapeo de nombres de campos |
| `expandIcon` | `ReactNode` | — | Icono de expansión personalizado |
| `disabled` | `boolean` | `false` | Deshabilitar el panel |

#### Tipos

```tsx
type NestedSelectExpandTrigger = 'click' | 'hover'
type NestedSelectPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
type NestedSelectSize = 'large' | 'middle' | 'small'
type NestedSelectVariant = 'outlined' | 'filled' | 'borderless'
type NestedSelectStatus = 'error' | 'warning'
type NestedSelectFieldNames = { label?: string; value?: string; children?: string }
type NestedSelectShowCheckedStrategy = 'SHOW_PARENT' | 'SHOW_CHILD'

interface NestedSelectOption {
  value: string | number
  label?: ReactNode
  children?: NestedSelectOption[]
  disabled?: boolean
  disableCheckbox?: boolean
  isLeaf?: boolean
  loading?: boolean
}

interface NestedSelectSearchConfig {
  filter?: (inputValue: string, path: NestedSelectOption[]) => boolean
  render?: (inputValue: string, path: NestedSelectOption[]) => ReactNode
  limit?: number | false
}

interface NestedSelectTagRenderProps {
  label: ReactNode
  value: (string | number)[]
  closable: boolean
  onClose: () => void
}
```

#### DOM Semántico

| Slot | Descripción |
|------|-------------|
| `root` | Contenedor exterior |
| `selector` | Elemento trigger/input |
| `dropdown` | Contenedor del popup desplegable |
| `menu` | Cada columna de menú en cascada |
| `option` | Elemento individual de opción |

#### Ejemplos

**Uso básico**

```tsx
<NestedSelect
  options={[
    {
      value: 'zhejiang',
      label: 'Zhejiang',
      children: [
        { value: 'hangzhou', label: 'Hangzhou' },
        { value: 'ningbo', label: 'Ningbo' },
      ],
    },
    {
      value: 'jiangsu',
      label: 'Jiangsu',
      children: [
        { value: 'nanjing', label: 'Nanjing' },
      ],
    },
  ]}
  placeholder="Seleccionar ubicación"
/>
```

**Valor controlado**

```tsx
const [value, setValue] = useState<(string | number)[]>([])

<NestedSelect
  value={value}
  onChange={(val) => setValue(val)}
  options={options}
/>
```

**Expandir al pasar el mouse**

```tsx
<NestedSelect
  expandTrigger="hover"
  options={options}
/>
```

**Permitir seleccionar niveles intermedios**

```tsx
<NestedSelect
  changeOnSelect
  options={options}
/>
```

**Con búsqueda**

```tsx
<NestedSelect
  showSearch
  options={options}
  placeholder="Buscar..."
/>
```

**Filtro y render de búsqueda personalizados**

```tsx
<NestedSelect
  showSearch={{
    filter: (inputValue, path) =>
      path.some((opt) => opt.label?.toString().includes(inputValue)),
    render: (inputValue, path) =>
      path.map((opt) => opt.label).join(' > '),
    limit: 20,
  }}
  options={options}
/>
```

**Selección múltiple**

```tsx
<NestedSelect
  multiple
  options={options}
  placeholder="Seleccionar múltiples..."
/>
```

**Estrategia SHOW_PARENT**

```tsx
<NestedSelect
  multiple
  showCheckedStrategy={NestedSelect.SHOW_PARENT}
  options={options}
/>
```

**Máximo de tags**

```tsx
<NestedSelect
  multiple
  maxTagCount={2}
  maxTagPlaceholder={(omitted) => `+${omitted.length} más`}
  options={options}
/>
```

**Renderizado personalizado del valor**

```tsx
<NestedSelect
  displayRender={(labels) => labels.join(' > ')}
  options={options}
/>
```

**Nombres de campos personalizados**

```tsx
<NestedSelect
  fieldNames={{ label: 'nombre', value: 'codigo', children: 'items' }}
  options={[
    { codigo: 'es', nombre: 'España', items: [{ codigo: 'mad', nombre: 'Madrid' }] },
  ]}
/>
```

**Carga lazy**

```tsx
const [options, setOptions] = useState(initialOptions)

<NestedSelect
  options={options}
  loadData={(selectedOptions) => {
    const target = selectedOptions[selectedOptions.length - 1]
    target.loading = true
    // Obtener hijos...
    setTimeout(() => {
      target.loading = false
      target.children = [{ value: 'hijo1', label: 'Hijo 1' }]
      setOptions([...options])
    }, 1000)
  }}
/>
```

**Variante Panel inline**

```tsx
<NestedSelect.Panel
  options={options}
  onChange={(value, selectedOptions) => console.log(value)}
/>
```

**Deshabilitado y estado de validación**

```tsx
<NestedSelect disabled options={options} value={['zhejiang', 'hangzhou']} />
<NestedSelect status="error" options={options} />
<NestedSelect status="warning" options={options} />
```

**Tamaños y variantes**

```tsx
<NestedSelect size="small" options={options} />
<NestedSelect size="middle" options={options} />
<NestedSelect size="large" options={options} />
<NestedSelect variant="filled" options={options} />
<NestedSelect variant="borderless" options={options} />
```

</details>

---

<details>
<summary><strong>Pagination</strong> - Navegación por páginas con selector de tamaño y salto rápido</summary>

### Pagination

Un componente de navegación para dividir el contenido en múltiples páginas. Soporta estado controlado/no controlado, selección de tamaño de página, salto rápido, modo simple, renderizado personalizado de items, y dos tamaños.

#### Importar

```tsx
import { Pagination } from 'j-ui'
```

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `total` | `number` | `0` | Número total de elementos |
| `current` | `number` | — | Página actual (controlado) |
| `defaultCurrent` | `number` | `1` | Página inicial por defecto (no controlado) |
| `pageSize` | `number` | — | Elementos por página (controlado) |
| `defaultPageSize` | `number` | `10` | Elementos por página por defecto (no controlado) |
| `pageSizeOptions` | `number[]` | `[10, 20, 50, 100]` | Opciones para el selector de tamaño de página |
| `showSizeChanger` | `boolean` | auto (`total > 50`) | Mostrar selector de tamaño de página |
| `showQuickJumper` | `boolean` | `false` | Mostrar input de salto rápido |
| `showTotal` | `(total, range) => ReactNode` | — | Función para mostrar información del total |
| `simple` | `boolean` | `false` | Modo simple (input + total de páginas) |
| `size` | `'default' \| 'small'` | `'default'` | Tamaño del paginador |
| `disabled` | `boolean` | `false` | Deshabilitar todas las interacciones |
| `hideOnSinglePage` | `boolean` | `false` | Ocultar cuando solo hay una página |
| `showLessItems` | `boolean` | `false` | Mostrar menos botones de página |
| `showTitle` | `boolean` | `true` | Mostrar tooltips en los botones |
| `itemRender` | `PaginationItemRender` | — | Función de renderizado personalizado para los items |
| `onChange` | `(page, pageSize) => void` | — | Llamado cuando cambia la página o el tamaño |
| `onShowSizeChange` | `(current, size) => void` | — | Llamado cuando cambia el tamaño de página |
| `className` | `string` | — | Clase CSS para el elemento raíz |
| `style` | `CSSProperties` | — | Estilos inline para el elemento raíz |
| `classNames` | `PaginationClassNames` | — | Clases CSS para partes internas |
| `styles` | `PaginationStyles` | — | Estilos inline para partes internas |

#### Tipos

```tsx
type PaginationSize = 'default' | 'small'

type PaginationItemType = 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next'

type PaginationItemRender = (
  page: number,
  type: PaginationItemType,
  originalElement: ReactNode,
) => ReactNode
```

#### DOM Semántico

| Slot | Descripción |
|------|-------------|
| `root` | Contenedor `<nav>` exterior |
| `item` | Cada botón de página/navegación |
| `options` | Contenedor del selector de tamaño y salto rápido |

#### Ejemplos

**Uso básico**

```tsx
<Pagination total={50} />
```

**Página actual controlada**

```tsx
const [page, setPage] = useState(1)

<Pagination
  current={page}
  total={100}
  onChange={(p) => setPage(p)}
/>
```

**Mostrar total y salto rápido**

```tsx
<Pagination
  total={500}
  showTotal={(total, range) => `${range[0]}-${range[1]} de ${total} elementos`}
  showQuickJumper
/>
```

**Selector de tamaño de página**

```tsx
<Pagination
  total={200}
  showSizeChanger
  pageSizeOptions={[10, 25, 50]}
  onShowSizeChange={(current, size) => console.log(current, size)}
/>
```

**Tamaño pequeño**

```tsx
<Pagination total={100} size="small" />
```

**Modo simple**

```tsx
<Pagination total={100} simple />
```

**Renderizado personalizado de items**

```tsx
<Pagination
  total={100}
  itemRender={(page, type, originalElement) => {
    if (type === 'prev') return <a href="#">Anterior</a>
    if (type === 'next') return <a href="#">Siguiente</a>
    return originalElement
  }}
/>
```

**Ocultar con una sola página**

```tsx
<Pagination total={5} pageSize={10} hideOnSinglePage />
```

**Estado deshabilitado**

```tsx
<Pagination total={100} disabled />
```

**Mostrar menos items**

```tsx
<Pagination total={500} showLessItems />
```

</details>

---

<details>
<summary><strong>Space</strong> - Espaciado y agrupación compacta para elementos inline</summary>

### Space

Un componente para establecer el espaciado entre elementos inline. Soporta dirección horizontal/vertical, tamaños personalizados, separadores, y un subcomponente `Space.Compact` para agrupar elementos sin espacios entre ellos.

#### Importar

```tsx
import { Space } from 'j-ui'
```

#### Props

| Prop | Tipo | Por Defecto | Descripción |
|------|------|-------------|-------------|
| `children` | `ReactNode` | — | Contenido |
| `size` | `SpaceSize \| [SpaceSize, SpaceSize]` | `'small'` | Espacio entre elementos. Puede ser un valor o `[horizontal, vertical]` |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Orientación |
| `align` | `'start' \| 'end' \| 'center' \| 'baseline'` | `'center'` (horizontal) | Alineación en el eje cruzado |
| `wrap` | `boolean` | `false` | Permitir wrap cuando se desborden los items |
| `split` | `ReactNode` | — | Elemento separador entre items |
| `className` | `string` | — | Clase CSS adicional |
| `style` | `CSSProperties` | — | Estilos inline adicionales |

#### SpaceSize

| Valor | Tamaño |
|-------|--------|
| `'small'` | 8px |
| `'middle'` | 16px |
| `'large'` | 24px |
| `number` | Valor personalizado en px |

#### Space.Compact

Agrupa elementos eliminando espacios y ajustando el border-radius para que aparezcan como una sola unidad.

| Prop | Tipo | Por Defecto | Descripción |
|------|------|-------------|-------------|
| `children` | `ReactNode` | — | Contenido |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Dirección del grupo compacto |
| `block` | `boolean` | `false` | Ocupa el 100% del ancho disponible |
| `className` | `string` | — | Clase CSS adicional |
| `style` | `CSSProperties` | — | Estilos inline adicionales |

#### Hook: useCompactItemContext

Devuelve información de contexto para items dentro de `Space.Compact`:

```typescript
interface CompactItemContextValue {
  isFirstItem: boolean
  isLastItem: boolean
  direction: 'horizontal' | 'vertical'
}
```

#### DOM Semántico

| Slot | Descripción |
|------|-------------|
| `root` | Elemento contenedor exterior |
| `item` | Contenedor individual de cada item |
| `separator` | Elemento separador (split) |

#### Ejemplos

```tsx
// Espaciado horizontal básico
<Space>
  <Button>Botón 1</Button>
  <Button>Botón 2</Button>
  <Button>Botón 3</Button>
</Space>

// Espaciado vertical
<Space direction="vertical">
  <Text>Línea 1</Text>
  <Text>Línea 2</Text>
  <Text>Línea 3</Text>
</Space>

// Tamaño personalizado
<Space size="large">
  <Badge>Tag 1</Badge>
  <Badge>Tag 2</Badge>
</Space>

// Tamaño numérico
<Space size={32}>
  <Button>A</Button>
  <Button>B</Button>
</Space>

// Tamaños horizontal y vertical diferentes
<Space size={['middle', 'large']} wrap>
  <Button>1</Button>
  <Button>2</Button>
  <Button>3</Button>
  <Button>4</Button>
</Space>

// Con separador
<Space split={<Divider type="vertical" />}>
  <a href="#">Enlace 1</a>
  <a href="#">Enlace 2</a>
  <a href="#">Enlace 3</a>
</Space>

// Modo wrap
<Space wrap size="middle">
  {tags.map((tag) => (
    <Badge key={tag}>{tag}</Badge>
  ))}
</Space>

// Alineación
<Space align="baseline">
  <Text style={{ fontSize: 24 }}>Grande</Text>
  <Text style={{ fontSize: 12 }}>Pequeño</Text>
</Space>

// Space.Compact - grupo horizontal
<Space.Compact>
  <Button>Izquierda</Button>
  <Button>Centro</Button>
  <Button>Derecha</Button>
</Space.Compact>

// Space.Compact - grupo vertical
<Space.Compact direction="vertical">
  <Button>Arriba</Button>
  <Button>Medio</Button>
  <Button>Abajo</Button>
</Space.Compact>

// Space.Compact - ancho completo
<Space.Compact block>
  <Input style={{ flex: 1 }} />
  <Button>Buscar</Button>
</Space.Compact>
```

</details>

---

<details>
<summary><strong>Splitter</strong> - Paneles redimensionables</summary>

### Splitter

Un componente para crear paneles redimensionables. Soporta orientación horizontal/vertical, paneles colapsables, restricciones min/max, tamaños controlados y modo lazy de redimensionamiento.

#### Importar

```tsx
import { Splitter } from 'j-ui'
```

#### Props

| Prop | Tipo | Por Defecto | Descripción |
|------|------|-------------|-------------|
| `children` | `ReactNode` | — | Solo acepta `Splitter.Panel` como hijos |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Dirección del split |
| `lazy` | `boolean` | `false` | Modo lazy: solo actualiza tamaños al soltar |
| `onResize` | `(sizes: number[]) => void` | — | Callback cuando cambian los tamaños |
| `onResizeStart` | `(sizes: number[]) => void` | — | Callback al empezar a arrastrar |
| `onResizeEnd` | `(sizes: number[]) => void` | — | Callback al terminar de arrastrar |
| `className` | `string` | — | Clase CSS adicional |
| `style` | `CSSProperties` | — | Estilos inline adicionales |

#### Splitter.Panel

| Prop | Tipo | Por Defecto | Descripción |
|------|------|-------------|-------------|
| `children` | `ReactNode` | — | Contenido del panel |
| `defaultSize` | `number \| string` | — | Tamaño inicial (px o porcentaje como `"50%"`) |
| `size` | `number \| string` | — | Tamaño controlado |
| `min` | `number \| string` | — | Tamaño mínimo (px o porcentaje) |
| `max` | `number \| string` | — | Tamaño máximo (px o porcentaje) |
| `resizable` | `boolean` | `true` | Permitir redimensionar este panel |
| `collapsible` | `boolean \| { start?: boolean; end?: boolean }` | `false` | Permitir colapsar. `true` = ambos lados, o especificar por lado |
| `className` | `string` | — | Clase CSS adicional |
| `style` | `CSSProperties` | — | Estilos inline adicionales |

#### DOM Semántico

| Slot | Descripción |
|------|-------------|
| `root` | Elemento contenedor exterior |
| `panel` | Contenedor individual de cada panel |
| `bar` | Barra de arrastre entre paneles |
| `collapseButton` | Botón de colapsar/expandir en la barra |

#### Ejemplos

```tsx
// Split básico de dos paneles
<Splitter style={{ height: 400 }}>
  <Splitter.Panel>
    <div>Panel Izquierdo</div>
  </Splitter.Panel>
  <Splitter.Panel>
    <div>Panel Derecho</div>
  </Splitter.Panel>
</Splitter>

// Split vertical
<Splitter orientation="vertical" style={{ height: 600 }}>
  <Splitter.Panel>
    <div>Panel Superior</div>
  </Splitter.Panel>
  <Splitter.Panel>
    <div>Panel Inferior</div>
  </Splitter.Panel>
</Splitter>

// Con tamaños por defecto
<Splitter style={{ height: 400 }}>
  <Splitter.Panel defaultSize="30%">
    <div>Sidebar (30%)</div>
  </Splitter.Panel>
  <Splitter.Panel defaultSize="70%">
    <div>Contenido (70%)</div>
  </Splitter.Panel>
</Splitter>

// Tres paneles
<Splitter style={{ height: 400 }}>
  <Splitter.Panel defaultSize="25%">
    <div>Izquierda</div>
  </Splitter.Panel>
  <Splitter.Panel defaultSize="50%">
    <div>Centro</div>
  </Splitter.Panel>
  <Splitter.Panel defaultSize="25%">
    <div>Derecha</div>
  </Splitter.Panel>
</Splitter>

// Con restricciones min y max
<Splitter style={{ height: 400 }}>
  <Splitter.Panel min="20%" max="60%">
    <div>Restringido (20%-60%)</div>
  </Splitter.Panel>
  <Splitter.Panel>
    <div>Flexible</div>
  </Splitter.Panel>
</Splitter>

// Min/max en píxeles
<Splitter style={{ height: 400 }}>
  <Splitter.Panel min={200} max={500}>
    <div>200px-500px</div>
  </Splitter.Panel>
  <Splitter.Panel>
    <div>Restante</div>
  </Splitter.Panel>
</Splitter>

// Paneles colapsables
<Splitter style={{ height: 400 }}>
  <Splitter.Panel collapsible>
    <div>Panel colapsable</div>
  </Splitter.Panel>
  <Splitter.Panel>
    <div>Contenido principal</div>
  </Splitter.Panel>
</Splitter>

// Colapsable en un lado específico
<Splitter style={{ height: 400 }}>
  <Splitter.Panel collapsible={{ end: true }}>
    <div>Colapsar hacia el final</div>
  </Splitter.Panel>
  <Splitter.Panel collapsible={{ start: true }}>
    <div>Colapsar hacia el inicio</div>
  </Splitter.Panel>
</Splitter>

// Panel no redimensionable
<Splitter style={{ height: 400 }}>
  <Splitter.Panel defaultSize={80} resizable={false}>
    <div>Sidebar fijo de 80px</div>
  </Splitter.Panel>
  <Splitter.Panel>
    <div>Contenido flexible</div>
  </Splitter.Panel>
</Splitter>

// Modo lazy (línea de preview al arrastrar)
<Splitter lazy style={{ height: 400 }}>
  <Splitter.Panel>
    <div>Izquierda</div>
  </Splitter.Panel>
  <Splitter.Panel>
    <div>Derecha</div>
  </Splitter.Panel>
</Splitter>

// Con callbacks de redimensionamiento
<Splitter
  style={{ height: 400 }}
  onResizeStart={(sizes) => console.log('Inicio:', sizes)}
  onResize={(sizes) => console.log('Redimensionando:', sizes)}
  onResizeEnd={(sizes) => console.log('Fin:', sizes)}
>
  <Splitter.Panel>
    <div>Izquierda</div>
  </Splitter.Panel>
  <Splitter.Panel>
    <div>Derecha</div>
  </Splitter.Panel>
</Splitter>

// Splitters anidados (layout tipo IDE)
<Splitter style={{ height: '100vh' }}>
  <Splitter.Panel defaultSize="20%" min="15%" collapsible>
    <div>Explorador de Archivos</div>
  </Splitter.Panel>
  <Splitter.Panel>
    <Splitter orientation="vertical">
      <Splitter.Panel defaultSize="70%">
        <div>Editor</div>
      </Splitter.Panel>
      <Splitter.Panel collapsible>
        <div>Terminal</div>
      </Splitter.Panel>
    </Splitter>
  </Splitter.Panel>
</Splitter>
```

</details>

---

<details>
<summary><strong>Steps</strong> - Barra de navegación paso a paso con múltiples modos de visualización</summary>

### Steps

Un componente de navegación que guía a los usuarios a través de un flujo de trabajo de varios pasos. Soporta dirección horizontal y vertical, tipo navegación, estilo de puntos, porcentaje de progreso, iconos personalizados, pasos clicables y dos tamaños.

#### Importar

```tsx
import { Steps } from 'j-ui'
```

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `items` | `StepItem[]` | `[]` | Definiciones de los pasos |
| `current` | `number` | `0` | Índice del paso actual |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Dirección del layout |
| `size` | `'default' \| 'small'` | `'default'` | Tamaño de los pasos |
| `status` | `StepStatus` | `'process'` | Estado del paso actual |
| `type` | `'default' \| 'navigation'` | `'default'` | Tipo de visualización |
| `labelPlacement` | `'horizontal' \| 'vertical'` | `'horizontal'` | Posición de la etiqueta respecto al icono |
| `progressDot` | `boolean \| ProgressDotRender` | `false` | Usar estilo de puntos o render personalizado |
| `percent` | `number` | — | Anillo de porcentaje de progreso en el icono del paso actual |
| `initial` | `number` | `0` | Número inicial para la numeración de pasos |
| `onChange` | `(current: number) => void` | — | Callback al hacer clic en un paso (habilita pasos clicables) |
| `className` | `string` | — | Clase CSS para el elemento raíz |
| `style` | `CSSProperties` | — | Estilos inline para el elemento raíz |
| `classNames` | `StepsClassNames` | — | Clases CSS para partes internas |
| `styles` | `StepsStyles` | — | Estilos inline para partes internas |

#### Tipos

```tsx
type StepStatus = 'wait' | 'process' | 'finish' | 'error'

type StepsSize = 'default' | 'small'

type StepsType = 'default' | 'navigation'

type StepsDirection = 'horizontal' | 'vertical'

type StepsLabelPlacement = 'horizontal' | 'vertical'

type ProgressDotRender = (
  dot: ReactNode,
  info: { index: number; status: StepStatus; title: ReactNode; description: ReactNode },
) => ReactNode

interface StepItem {
  title?: ReactNode
  description?: ReactNode
  subTitle?: ReactNode
  icon?: ReactNode
  status?: StepStatus
  disabled?: boolean
}
```

#### DOM Semántico

| Slot | Descripción |
|------|-------------|
| `root` | Contenedor exterior |
| `step` | Contenedor individual de cada paso |
| `icon` | Círculo del icono/número del paso |
| `content` | Contenedor del título y la descripción |
| `tail` | Línea conectora entre pasos |

#### Ejemplos

**Uso básico**

```tsx
<Steps
  current={1}
  items={[
    { title: 'Finalizado', description: 'Esta es una descripción' },
    { title: 'En Progreso', description: 'Esta es una descripción' },
    { title: 'En Espera', description: 'Esta es una descripción' },
  ]}
/>
```

**Tamaño pequeño**

```tsx
<Steps
  size="small"
  current={1}
  items={[
    { title: 'Finalizado' },
    { title: 'En Progreso' },
    { title: 'En Espera' },
  ]}
/>
```

**Dirección vertical**

```tsx
<Steps
  direction="vertical"
  current={1}
  items={[
    { title: 'Paso 1', description: 'Descripción del paso 1' },
    { title: 'Paso 2', description: 'Descripción del paso 2' },
    { title: 'Paso 3', description: 'Descripción del paso 3' },
  ]}
/>
```

**Con iconos personalizados**

```tsx
<Steps
  current={1}
  items={[
    { title: 'Iniciar sesión', icon: <UserIcon /> },
    { title: 'Verificación', icon: <IdIcon /> },
    { title: 'Listo', icon: <CheckIcon /> },
  ]}
/>
```

**Estado de error**

```tsx
<Steps
  current={1}
  status="error"
  items={[
    { title: 'Finalizado' },
    { title: 'Error', description: 'Algo salió mal' },
    { title: 'En Espera' },
  ]}
/>
```

**Estilo de puntos**

```tsx
<Steps
  progressDot
  current={1}
  items={[
    { title: 'Finalizado', description: 'Esta es una descripción' },
    { title: 'En Progreso', description: 'Esta es una descripción' },
    { title: 'En Espera', description: 'Esta es una descripción' },
  ]}
/>
```

**Tipo navegación**

```tsx
<Steps
  type="navigation"
  current={1}
  onChange={(step) => console.log(step)}
  items={[
    { title: 'Paso 1' },
    { title: 'Paso 2' },
    { title: 'Paso 3' },
  ]}
/>
```

**Pasos clicables**

```tsx
const [current, setCurrent] = useState(0)

<Steps
  current={current}
  onChange={setCurrent}
  items={[
    { title: 'Paso 1' },
    { title: 'Paso 2' },
    { title: 'Paso 3' },
  ]}
/>
```

**Con porcentaje de progreso**

```tsx
<Steps
  current={1}
  percent={60}
  items={[
    { title: 'Finalizado' },
    { title: 'En Progreso' },
    { title: 'En Espera' },
  ]}
/>
```

**Etiquetas verticales**

```tsx
<Steps
  current={1}
  labelPlacement="vertical"
  items={[
    { title: 'Finalizado' },
    { title: 'En Progreso' },
    { title: 'En Espera' },
  ]}
/>
```

**Estado por paso y deshabilitado**

```tsx
<Steps
  items={[
    { title: 'Finalizado', status: 'finish' },
    { title: 'Error', status: 'error' },
    { title: 'Deshabilitado', disabled: true },
  ]}
/>
```

**Render personalizado de puntos**

```tsx
<Steps
  current={1}
  progressDot={(dot, { index, status }) => (
    <Tooltip title={`Paso ${index + 1}: ${status}`}>
      {dot}
    </Tooltip>
  )}
  items={[
    { title: 'Finalizado', description: 'Listo' },
    { title: 'En Progreso', description: 'Trabajando' },
    { title: 'En Espera', description: 'Pendiente' },
  ]}
/>
```

</details>

---

<details>
<summary><strong>Tabs</strong> - Navegación por pestañas con modos línea, tarjeta y editable</summary>

### Tabs

Un componente de navegación por pestañas para alternar entre paneles de contenido. Soporta tipos línea, tarjeta y tarjeta editable, cuatro posiciones de pestañas (arriba/abajo/izquierda/derecha), scroll con flechas cuando se desbordan, indicador ink bar con tamaño y alineación personalizables, contenido extra en la barra de pestañas, y estado controlado/no controlado.

#### Importar

```tsx
import { Tabs } from 'j-ui'
```

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `items` | `TabItem[]` | `[]` | Definiciones de las pestañas |
| `activeKey` | `string` | — | Clave de la pestaña activa (controlado) |
| `defaultActiveKey` | `string` | clave del primer item | Clave de la pestaña activa por defecto (no controlado) |
| `type` | `'line' \| 'card' \| 'editable-card'` | `'line'` | Estilo de visualización |
| `size` | `'large' \| 'middle' \| 'small'` | `'middle'` | Tamaño de las pestañas |
| `tabPosition` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Posición de la barra de pestañas |
| `centered` | `boolean` | `false` | Centrar las pestañas en la barra |
| `animated` | `boolean \| { inkBar: boolean; tabPane: boolean }` | `{ inkBar: true, tabPane: false }` | Configuración de animaciones |
| `tabBarGutter` | `number` | — | Espacio entre pestañas en píxeles |
| `tabBarStyle` | `CSSProperties` | — | Estilos extra para la barra de pestañas |
| `tabBarExtraContent` | `ReactNode \| { left?: ReactNode; right?: ReactNode }` | — | Contenido extra en la barra de pestañas |
| `indicator` | `IndicatorConfig` | — | Tamaño y alineación del indicador ink bar |
| `addIcon` | `ReactNode` | `+` | Icono personalizado para añadir (editable-card) |
| `removeIcon` | `ReactNode` | `×` | Icono personalizado para eliminar (editable-card) |
| `hideAdd` | `boolean` | `false` | Ocultar botón de añadir (editable-card) |
| `destroyOnHidden` | `boolean` | `false` | Destruir paneles de pestañas inactivas |
| `onChange` | `(activeKey: string) => void` | — | Llamado cuando cambia la pestaña activa |
| `onEdit` | `(key, action) => void` | — | Llamado al añadir/eliminar (editable-card) |
| `onTabClick` | `(key, event) => void` | — | Llamado al hacer clic en una pestaña |
| `className` | `string` | — | Clase CSS para el elemento raíz |
| `style` | `CSSProperties` | — | Estilos inline para el elemento raíz |
| `classNames` | `TabsClassNames` | — | Clases CSS para partes internas |
| `styles` | `TabsStyles` | — | Estilos inline para partes internas |

#### Tipos

```tsx
type TabsType = 'line' | 'card' | 'editable-card'

type TabsSize = 'large' | 'middle' | 'small'

type TabsPosition = 'top' | 'bottom' | 'left' | 'right'

interface IndicatorConfig {
  size?: number | ((origin: number) => number)
  align?: 'start' | 'center' | 'end'
}

interface TabItem {
  key: string
  label?: ReactNode
  children?: ReactNode
  icon?: ReactNode
  disabled?: boolean
  closable?: boolean
  closeIcon?: ReactNode
  forceRender?: boolean
  destroyOnHidden?: boolean
}
```

#### DOM Semántico

| Slot | Descripción |
|------|-------------|
| `root` | Contenedor exterior |
| `tabBar` | Área de navegación de la barra de pestañas |
| `tab` | Botón individual de pestaña |
| `content` | Área de contenido del panel |
| `inkBar` | Línea indicadora de la pestaña activa |

#### Ejemplos

**Uso básico**

```tsx
<Tabs
  items={[
    { key: '1', label: 'Pestaña 1', children: 'Contenido de Pestaña 1' },
    { key: '2', label: 'Pestaña 2', children: 'Contenido de Pestaña 2' },
    { key: '3', label: 'Pestaña 3', children: 'Contenido de Pestaña 3' },
  ]}
/>
```

**Pestaña activa controlada**

```tsx
const [activeKey, setActiveKey] = useState('1')

<Tabs
  activeKey={activeKey}
  onChange={setActiveKey}
  items={[
    { key: '1', label: 'Pestaña 1', children: 'Contenido 1' },
    { key: '2', label: 'Pestaña 2', children: 'Contenido 2' },
  ]}
/>
```

**Tipo tarjeta**

```tsx
<Tabs
  type="card"
  items={[
    { key: '1', label: 'Tarjeta 1', children: 'Contenido 1' },
    { key: '2', label: 'Tarjeta 2', children: 'Contenido 2' },
    { key: '3', label: 'Tarjeta 3', children: 'Contenido 3' },
  ]}
/>
```

**Tarjeta editable (añadir/eliminar)**

```tsx
const [items, setItems] = useState([
  { key: '1', label: 'Pestaña 1', children: 'Contenido 1' },
  { key: '2', label: 'Pestaña 2', children: 'Contenido 2' },
])

<Tabs
  type="editable-card"
  items={items}
  onEdit={(key, action) => {
    if (action === 'add') {
      const newKey = String(Date.now())
      setItems([...items, { key: newKey, label: 'Nueva Pestaña', children: 'Nuevo contenido' }])
    } else {
      setItems(items.filter((item) => item.key !== key))
    }
  }}
/>
```

**Posiciones de pestañas**

```tsx
<Tabs
  tabPosition="left"
  items={[
    { key: '1', label: 'Pestaña 1', children: 'Contenido 1' },
    { key: '2', label: 'Pestaña 2', children: 'Contenido 2' },
  ]}
/>
```

**Tamaños**

```tsx
<Tabs size="small" items={[...]} />
<Tabs size="middle" items={[...]} />
<Tabs size="large" items={[...]} />
```

**Con iconos**

```tsx
<Tabs
  items={[
    { key: '1', label: 'Inicio', icon: <HomeIcon />, children: 'Contenido de inicio' },
    { key: '2', label: 'Ajustes', icon: <SettingsIcon />, children: 'Contenido de ajustes' },
  ]}
/>
```

**Pestañas centradas**

```tsx
<Tabs
  centered
  items={[
    { key: '1', label: 'Pestaña 1', children: 'Contenido 1' },
    { key: '2', label: 'Pestaña 2', children: 'Contenido 2' },
  ]}
/>
```

**Pestaña deshabilitada**

```tsx
<Tabs
  items={[
    { key: '1', label: 'Activa' },
    { key: '2', label: 'Deshabilitada', disabled: true },
    { key: '3', label: 'Normal' },
  ]}
/>
```

**Contenido extra en la barra**

```tsx
<Tabs
  tabBarExtraContent={<button>Acción Extra</button>}
  items={[
    { key: '1', label: 'Pestaña 1', children: 'Contenido 1' },
    { key: '2', label: 'Pestaña 2', children: 'Contenido 2' },
  ]}
/>

{/* Contenido extra izquierdo y derecho */}
<Tabs
  tabBarExtraContent={{ left: <span>Izquierda</span>, right: <span>Derecha</span> }}
  items={[...]}
/>
```

**Indicador personalizado**

```tsx
<Tabs
  indicator={{ size: 40, align: 'center' }}
  items={[
    { key: '1', label: 'Pestaña 1', children: 'Contenido 1' },
    { key: '2', label: 'Pestaña 2', children: 'Contenido 2' },
  ]}
/>
```

**Destruir paneles inactivos**

```tsx
<Tabs
  destroyOnHidden
  items={[
    { key: '1', label: 'Pestaña 1', children: <ComponentePesado /> },
    { key: '2', label: 'Pestaña 2', children: <OtroComponente /> },
  ]}
/>
```

</details>

---

<details>
<summary><strong>Text</strong> - Tipografia con formato y copiar al portapapeles</summary>

### Text

Un componente de tipografia para mostrar texto con varios estilos, opciones de formato y funciones utilitarias como copiar al portapapeles y truncado de texto.

#### Importar

```tsx
import { Text } from 'j-ui'
```

#### Props

| Prop | Tipo | Por Defecto | Descripcion |
|------|------|-------------|-------------|
| `children` | `ReactNode` | — | Contenido del texto |
| `type` | `'default' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` | Color/tipo del texto |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Tamano del texto |
| `weight` | `'thin' \| 'light' \| 'normal' \| 'medium' \| 'semibold' \| 'bold' \| 'extrabold' \| 'black'` | — | Grosor de la fuente |
| `lineHeight` | `'none' \| 'tight' \| 'snug' \| 'normal' \| 'relaxed' \| 'loose'` | — | Interlineado |
| `disabled` | `boolean` | `false` | Estilo deshabilitado (gris, sin interaccion) |
| `mark` | `boolean` | `false` | Resaltar con fondo amarillo |
| `code` | `boolean` | `false` | Estilo de codigo inline |
| `keyboard` | `boolean` | `false` | Estilo de tecla de teclado |
| `underline` | `boolean` | `false` | Texto subrayado |
| `delete` | `boolean` | `false` | Texto tachado |
| `italic` | `boolean` | `false` | Texto en cursiva |
| `copyable` | `boolean \| { text?: string; onCopy?: () => void }` | `false` | Mostrar boton de copiar |
| `ellipsis` | `boolean \| EllipsisConfig` | `false` | Truncar con puntos suspensivos |

#### EllipsisConfig

```typescript
interface EllipsisConfig {
  rows?: number           // Filas antes de truncar (default: 1)
  expandable?: boolean    // Mostrar boton expandir/colapsar
  onExpand?: (expanded: boolean) => void  // Callback al cambiar expansion
}
```

#### Tamanos

| Tamano | Tamano de Fuente |
|--------|------------------|
| `xs` | 10px |
| `sm` | 13px |
| `md` | 16px |
| `lg` | 24px |
| `xl` | 36px |

#### Grosores

| Grosor | Valor |
|--------|-------|
| `thin` | 100 |
| `light` | 300 |
| `normal` | 400 |
| `medium` | 500 |
| `semibold` | 600 |
| `bold` | 700 |
| `extrabold` | 800 |
| `black` | 900 |

#### Interlineados

| LineHeight | Valor |
|------------|-------|
| `none` | 1 |
| `tight` | 1.25 |
| `snug` | 1.375 |
| `normal` | 1.5 |
| `relaxed` | 1.625 |
| `loose` | 2 |

#### DOM Semántico

| Slot | Descripción |
|------|-------------|
| `root` | Elemento contenedor exterior |
| `content` | Elemento del contenido de texto |
| `copyButton` | Botón de copiar al portapapeles |
| `expandButton` | Botón de expandir/contraer |

#### Ejemplos

```tsx
// Basico
<Text>Hola mundo</Text>

// Tipos (colores)
<Text type="secondary">Texto secundario</Text>
<Text type="success">Mensaje de exito</Text>
<Text type="warning">Mensaje de advertencia</Text>
<Text type="error">Mensaje de error</Text>
<Text type="info">Mensaje informativo</Text>

// Tamanos
<Text size="xs">Extra pequeno</Text>
<Text size="sm">Pequeno</Text>
<Text size="md">Mediano</Text>
<Text size="lg">Grande</Text>
<Text size="xl">Extra grande</Text>

// Grosor de fuente
<Text weight="light">Texto ligero</Text>
<Text weight="bold">Texto negrita</Text>
<Text weight="black">Texto black</Text>

// Estilos de texto
<Text mark>Texto resaltado</Text>
<Text code>const x = 42</Text>
<Text keyboard>Ctrl</Text> + <Text keyboard>C</Text>
<Text underline>Subrayado</Text>
<Text delete>Eliminado</Text>
<Text italic>Cursiva</Text>

// Deshabilitado
<Text disabled>Texto deshabilitado</Text>

// Copiar al portapapeles
<Text copyable>Haz clic en el icono para copiar este texto</Text>

// Texto personalizado para copiar
<Text copyable={{ text: "Texto personalizado", onCopy: () => console.log('Copiado!') }}>
  Texto visible (copia "Texto personalizado")
</Text>

// Ellipsis de una linea
<Text ellipsis style={{ width: 200 }}>
  Este es un texto muy largo que se truncara con puntos suspensivos
</Text>

// Ellipsis multi-linea (3 filas)
<Text ellipsis={{ rows: 3 }} style={{ width: 200 }}>
  Este es un texto muy largo que ocupa varias lineas y se truncara
  despues de tres filas con puntos suspensivos al final.
</Text>

// Ellipsis expandible
<Text ellipsis={{ rows: 2, expandable: true }} style={{ width: 200 }}>
  Este texto puede expandirse o colapsarse haciendo clic en el boton.
  Muy util para contenido largo que quieres mostrar parcialmente.
</Text>

// Estilos combinados
<Text type="error" weight="bold" size="lg">
  Error Importante!
</Text>

<Text type="success" italic underline>
  Tarea completada exitosamente
</Text>
```

</details>

---

<details>
<summary><strong>Waterfall</strong> - Layout estilo masonry/Pinterest</summary>

### Waterfall

Un componente de layout estilo masonry que distribuye los items en columnas basándose en la altura disponible, creando un efecto de cascada tipo Pinterest.

#### Importar

```tsx
import { Waterfall } from 'j-ui'
```

#### Props

| Prop | Tipo | Por Defecto | Descripción |
|------|------|-------------|-------------|
| `items` | `WaterfallItem<T>[]` | `[]` | Array de items a renderizar |
| `columns` | `number \| Partial<Record<Breakpoint, number>>` | `3` | Número de columnas (fijo o responsive) |
| `gutter` | `number \| ResponsiveGutter \| [horizontal, vertical]` | `0` | Espacio entre items (px) |
| `itemRender` | `(info: WaterfallItemRenderInfo<T>) => ReactNode` | — | Función para renderizar cada item |
| `fresh` | `boolean` | `false` | Monitorear continuamente cambios de tamaño en items |
| `onLayoutChange` | `(layoutInfo: WaterfallLayoutInfo[]) => void` | — | Callback cuando cambia la asignación de columnas |

#### WaterfallItem

```typescript
interface WaterfallItem<T = unknown> {
  key: Key              // Identificador único
  children?: ReactNode  // Contenido (tiene prioridad sobre itemRender)
  height?: number       // Altura conocida en px (mejora el layout inicial)
  column?: number       // Forzar columna específica (0-indexed)
  data?: T              // Datos personalizados asociados al item
}
```

#### WaterfallItemRenderInfo

Se pasa a la función `itemRender`:

```typescript
interface WaterfallItemRenderInfo<T> extends WaterfallItem<T> {
  index: number         // Índice en el array original
  assignedColumn: number // Columna asignada por el algoritmo
}
```

#### Breakpoints

| Breakpoint | Ancho Mínimo |
|------------|--------------|
| `xs` | 0px |
| `sm` | 576px |
| `md` | 768px |
| `lg` | 992px |
| `xl` | 1200px |
| `xxl` | 1600px |

#### DOM Semántico

| Slot | Descripción |
|------|-------------|
| `root` | Elemento contenedor exterior |
| `column` | Contenedor individual de cada columna |
| `item` | Contenedor individual de cada item |

#### Ejemplos

```tsx
// Uso básico con children
<Waterfall
  items={[
    { key: 1, children: <Card>Item 1</Card> },
    { key: 2, children: <Card>Item 2 con más contenido</Card> },
    { key: 3, children: <Card>Item 3</Card> },
  ]}
/>

// Usando itemRender
<Waterfall
  items={images.map((img) => ({
    key: img.id,
    data: img,
  }))}
  itemRender={({ data, index }) => (
    <img src={data.url} alt={`Imagen ${index}`} />
  )}
/>

// Columnas personalizadas
<Waterfall items={items} columns={4} />

// Columnas responsive
<Waterfall
  items={items}
  columns={{
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
  }}
/>

// Con gutter
<Waterfall items={items} gutter={16} />

// Gutter horizontal y vertical diferentes
<Waterfall items={items} gutter={[16, 24]} />

// Gutter responsive
<Waterfall
  items={items}
  gutter={{ xs: 8, md: 16, lg: 24 }}
/>

// Con alturas conocidas (mejor layout inicial)
<Waterfall
  items={[
    { key: 1, height: 200, children: <Card /> },
    { key: 2, height: 150, children: <Card /> },
    { key: 3, height: 300, children: <Card /> },
  ]}
/>

// Forzar columnas específicas
<Waterfall
  items={[
    { key: 'destacado', column: 0, children: <FeaturedCard /> },
    { key: 'item1', children: <Card /> },
    { key: 'item2', children: <Card /> },
  ]}
  columns={3}
/>

// Monitorear cambios de tamaño (para contenido dinámico)
<Waterfall
  items={items}
  fresh
  onLayoutChange={(layout) => {
    console.log('Layout cambió:', layout)
  }}
/>

// Con ref
const waterfallRef = useRef<WaterfallRef>(null)

<Waterfall
  ref={waterfallRef}
  items={items}
/>

// Acceder al elemento nativo
waterfallRef.current?.nativeElement

// Ejemplo completo con imágenes
function GaleriaImagenes() {
  const imagenes = [
    { id: 1, url: '/img1.jpg', height: 200 },
    { id: 2, url: '/img2.jpg', height: 300 },
    { id: 3, url: '/img3.jpg', height: 150 },
    { id: 4, url: '/img4.jpg', height: 250 },
  ]

  return (
    <Waterfall
      columns={{ xs: 2, md: 3, lg: 4 }}
      gutter={[16, 16]}
      items={imagenes.map((img) => ({
        key: img.id,
        height: img.height,
        data: img,
      }))}
      itemRender={({ data }) => (
        <img
          src={data.url}
          style={{ width: '100%', borderRadius: 8 }}
        />
      )}
    />
  )
}
```

#### Algoritmo

El layout waterfall usa un algoritmo de "columna más corta primero":
1. Los items se colocan en la columna con menor altura actual
2. Si un item especifica la prop `column`, se colocará allí en su lugar
3. Las alturas conocidas (prop `height`) se usan para el layout inicial
4. Las alturas dinámicas se miden después del render y el layout se ajusta
5. Con `fresh=true`, los items se monitorean continuamente por cambios de tamaño

</details>

---

<details>
<summary><strong>Tooltip</strong> - Tooltips ligeros al pasar el cursor</summary>

### Tooltip

Un componente ligero de tooltip para mostrar informacion adicional al pasar el cursor.

#### Importar

```tsx
import { Tooltip } from 'j-ui'
```

#### Props

| Prop | Tipo | Por Defecto | Descripcion |
|------|------|-------------|-------------|
| `content` | `ReactNode` | — | Contenido del tooltip |
| `children` | `ReactNode` | — | Elemento disparador |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Posicion del tooltip |
| `delay` | `number` | `200` | Retraso antes de mostrar (ms) |
| `disabled` | `boolean` | `false` | Deshabilita el tooltip |

#### Posiciones

| Posicion | Descripcion |
|----------|-------------|
| `top` | Encima del elemento disparador |
| `bottom` | Debajo del elemento disparador |
| `left` | A la izquierda del elemento disparador |
| `right` | A la derecha del elemento disparador |

#### DOM Semántico

| Slot | Descripción |
|------|-------------|
| `root` | Contenedor alrededor del elemento trigger |
| `popup` | Contenedor popup del tooltip |
| `arrow` | Elemento de la flecha del tooltip |

#### Ejemplos

```tsx
// Basico
<Tooltip content="Hola!">
  <Button>Pasa el cursor</Button>
</Tooltip>

// Posiciones
<Tooltip content="Tooltip arriba" position="top">
  <Button>Arriba</Button>
</Tooltip>

<Tooltip content="Tooltip abajo" position="bottom">
  <Button>Abajo</Button>
</Tooltip>

<Tooltip content="Tooltip izquierda" position="left">
  <Button>Izquierda</Button>
</Tooltip>

<Tooltip content="Tooltip derecha" position="right">
  <Button>Derecha</Button>
</Tooltip>

// Retraso personalizado
<Tooltip content="Rapido!" delay={0}>
  <Button>Sin retraso</Button>
</Tooltip>

<Tooltip content="Paciente..." delay={1000}>
  <Button>1 segundo de retraso</Button>
</Tooltip>

// Deshabilitado
<Tooltip content="No se mostrara" disabled>
  <Button>Tooltip deshabilitado</Button>
</Tooltip>

// Con contenido complejo
<Tooltip content={<span>Contenido <strong>estilizado</strong></span>}>
  <Button>Contenido rico</Button>
</Tooltip>
```

#### Accesibilidad

El tooltip soporta navegacion por teclado:
- Se muestra con focus
- Se oculta con blur
- Funciona con lectores de pantalla

</details>

---

## Licencia

Licencia MIT - ver [LICENSE](./LICENSE) para detalles.
