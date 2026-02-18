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
  - [Avatar](#avatar)
  - [Anchor](#anchor)
  - [Badge](#badge)
  - [Breadcrumb](#breadcrumb)
  - [Bubble](#bubble)
  - [Button](#button)
  - [Card](#card)
  - [Calendar](#calendar)
  - [Carousel](#carousel)
  - [Checkbox](#checkbox)
  - [ColorPicker](#colorpicker)
  - [Collapse](#collapse)
  - [DataDisplay](#datadisplay)
  - [DatePicker](#datepicker)
  - [Divider](#divider)
  - [Dropdown](#dropdown)
  - [Empty](#empty)
  - [Form](#form)
  - [Input](#input)
  - [Image](#image)
  - [InputNumber](#inputnumber)
  - [Flex](#flex)
  - [Grid](#grid)
  - [Layout](#layout)
  - [Menu](#menu)
  - [Mention](#mention)
  - [NestedSelect](#nestedselect)
  - [Pagination](#pagination)
  - [Radio](#radio)
  - [Rate](#rate)
  - [Select](#select)
  - [Slider](#slider)
  - [Space](#space)
  - [Splitter](#splitter)
  - [Steps](#steps)
  - [Switch](#switch)
  - [Tabs](#tabs)
  - [Text](#text)
  - [TimePicker](#timepicker)
  - [Transfer](#transfer)
  - [TreeSelect](#treeselect)
  - [Upload](#upload)
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
| Badge | `root`, `indicator` |
| Badge.Ribbon | `wrapper`, `ribbon`, `content`, `corner` |
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
<summary><strong>Avatar</strong> - Representación de perfil de usuario</summary>

### Avatar

`Avatar` muestra la foto de perfil de un usuario, icono o iniciales. Soporta imágenes, iconos personalizados, textos de respaldo e indicadores de badge. Incluye `Avatar.Group` para mostrar listas de avatares superpuestos.

**Importación:**
```tsx
import { Avatar } from 'j-ui';
```

#### Props de Avatar

| Prop | Tipo | Predeterminado | Descripción |
|------|------|----------------|-------------|
| `src` | `string` | `undefined` | URL de la imagen fuente |
| `srcSet` | `string` | `undefined` | Fuentes de imagen responsivas |
| `alt` | `string` | `undefined` | Texto alternativo para la imagen |
| `icon` | `ReactNode` | `<UserIcon />` | Icono personalizado (mostrado cuando no hay imagen) |
| `shape` | `'circle' \| 'square'` | `'circle'` | Forma del avatar |
| `size` | `'small' \| 'default' \| 'large' \| number \| AvatarResponsiveSize` | `'default'` | Tamaño del avatar |
| `gap` | `number` | `4` | Espacio entre texto y borde del contenedor (para auto-escalado) |
| `count` | `number` | `undefined` | Conteo del badge (muestra "99+" si > 99) |
| `dot` | `boolean` | `false` | Mostrar indicador de punto |
| `draggable` | `boolean \| 'true' \| 'false'` | `true` | Si la imagen es arrastrable |
| `crossOrigin` | `'' \| 'anonymous' \| 'use-credentials'` | `undefined` | Configuración CORS para la imagen |
| `onError` | `() => boolean` | `undefined` | Callback cuando la imagen falla al cargar (devolver false para prevenir fallback) |
| `children` | `ReactNode` | `undefined` | Contenido de texto (usualmente iniciales) |
| `className` | `string` | `undefined` | Nombre de clase del elemento raíz |
| `style` | `CSSProperties` | `undefined` | Estilos en línea del elemento raíz |
| `classNames` | `SemanticClassNames<AvatarSemanticSlot>` | `undefined` | Nombres de clase semánticos |
| `styles` | `SemanticStyles<AvatarSemanticSlot>` | `undefined` | Estilos en línea semánticos |

#### Props de Avatar.Group

| Prop | Tipo | Predeterminado | Descripción |
|------|------|----------------|-------------|
| `max` | `{ count?: number; style?: CSSProperties }` | `undefined` | Máximo de avatares a mostrar (resto mostrado como "+N") |
| `size` | `AvatarSize` | `'default'` | Tamaño aplicado a todos los avatares hijos |
| `shape` | `'circle' \| 'square'` | `'circle'` | Forma aplicada a todos los avatares hijos |
| `children` | `ReactNode` | `undefined` | Componentes Avatar |
| `className` | `string` | `undefined` | Nombre de clase del contenedor |
| `style` | `CSSProperties` | `undefined` | Estilos en línea del contenedor |

#### Tipo AvatarResponsiveSize

```typescript
type AvatarResponsiveSize = Partial<Record<AvatarBreakpoint, number>>;
type AvatarBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

// Valores de breakpoint:
// xs: 0px, sm: 576px, md: 768px, lg: 992px, xl: 1200px, xxl: 1600px
```

#### Configuración de Tamaños

| Tamaño | Dimensión |
|--------|-----------|
| `small` | 24px (1.5rem) |
| `default` | 32px (2rem) |
| `large` | 40px (2.5rem) |
| Número personalizado | Píxeles especificados |
| Objeto responsivo | Tamaño basado en breakpoint del viewport |

#### Slots de DOM Semántico

| Slot | Descripción |
|------|-------------|
| `root` | El elemento contenedor raíz |
| `image` | El elemento de imagen (cuando se proporciona src) |
| `icon` | El contenedor de icono (cuando se proporciona icon) |
| `text` | El contenedor de texto (cuando se proporciona texto children) |

#### Ejemplos

**Uso básico con imagen:**
```tsx
import { Avatar } from 'j-ui';

<Avatar src="https://i.pravatar.cc/150?img=1" alt="Usuario" />
```

**Con iniciales:**
```tsx
<Avatar>JD</Avatar>
```

**Con icono personalizado:**
```tsx
<Avatar icon={<UserIcon />} />
```

**Diferentes formas:**
```tsx
<Avatar src="user.jpg" shape="circle" />
<Avatar src="user.jpg" shape="square" />
```

**Diferentes tamaños:**
```tsx
<Avatar src="user.jpg" size="small" />
<Avatar src="user.jpg" size="default" />
<Avatar src="user.jpg" size="large" />
<Avatar src="user.jpg" size={64} />
```

**Tamaño responsivo:**
```tsx
<Avatar
  src="user.jpg"
  size={{
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
  }}
/>
```

**Con conteo de badge:**
```tsx
<Avatar src="user.jpg" count={5} />
<Avatar src="user.jpg" count={99} />
<Avatar src="user.jpg" count={100} /> {/* Muestra "99+" */}
```

**Con indicador de punto:**
```tsx
<Avatar src="user.jpg" dot />
```

**Manejo de errores:**
```tsx
<Avatar
  src="url-invalida.jpg"
  onError={() => {
    console.log('La imagen falló al cargar');
    return true; // Permitir fallback a icono/texto
  }}
>
  FB
</Avatar>
```

**Grupo de Avatares:**
```tsx
<Avatar.Group>
  <Avatar src="https://i.pravatar.cc/150?img=1" />
  <Avatar src="https://i.pravatar.cc/150?img=2" />
  <Avatar src="https://i.pravatar.cc/150?img=3" />
  <Avatar src="https://i.pravatar.cc/150?img=4" />
</Avatar.Group>
```

**Grupo con conteo máximo:**
```tsx
<Avatar.Group max={{ count: 3 }}>
  <Avatar src="https://i.pravatar.cc/150?img=1" />
  <Avatar src="https://i.pravatar.cc/150?img=2" />
  <Avatar src="https://i.pravatar.cc/150?img=3" />
  <Avatar src="https://i.pravatar.cc/150?img=4" />
  <Avatar src="https://i.pravatar.cc/150?img=5" />
</Avatar.Group>
{/* Muestra primeros 3 avatares + "+2" */}
```

**Grupo con tamaño y forma personalizada:**
```tsx
<Avatar.Group size="large" shape="square">
  <Avatar src="user1.jpg" />
  <Avatar src="user2.jpg" />
  <Avatar>AB</Avatar>
  <Avatar icon={<UserIcon />} />
</Avatar.Group>
```

**Estilo personalizado para avatar de desbordamiento:**
```tsx
<Avatar.Group
  max={{
    count: 2,
    style: { backgroundColor: '#f56a00', color: '#fff' }
  }}
>
  <Avatar src="user1.jpg" />
  <Avatar src="user2.jpg" />
  <Avatar src="user3.jpg" />
</Avatar.Group>
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
<summary><strong>Badge</strong> - Indicador numerico y punto de estado</summary>

### Badge

Un pequeno indicador numerico o de estado para elementos de la interfaz. Envuelve cualquier contenido con un badge flotante de conteo, un indicador de punto, o muestra puntos de estado independientes.

#### Importar

```tsx
import { Badge } from 'j-ui'
```

#### Props de Badge

| Prop | Tipo | Por Defecto | Descripcion |
|------|------|-------------|-------------|
| `children` | `ReactNode` | — | Contenido a envolver (el badge flota en la esquina superior derecha) |
| `count` | `ReactNode` | — | Numero o contenido personalizado mostrado en el badge |
| `overflowCount` | `number` | `99` | Conteo maximo antes de mostrar `{overflowCount}+` |
| `dot` | `boolean` | `false` | Mostrar un indicador de punto en lugar de un conteo |
| `showZero` | `boolean` | `false` | Mostrar el badge cuando `count` es cero |
| `size` | `'default' \| 'small'` | `'default'` | Tamano del badge |
| `status` | `'success' \| 'processing' \| 'default' \| 'error' \| 'warning'` | — | Indicador de estado (independiente o con hijo) |
| `text` | `ReactNode` | — | Texto mostrado junto al punto de estado (solo en modo independiente) |
| `color` | `string` | — | Color personalizado (nombre predefinido o cualquier color CSS) |
| `offset` | `[number, number]` | — | Desplazamiento `[derecha, arriba]` en pixeles para la posicion del badge |
| `title` | `string` | — | Titulo tooltip para el indicador del badge |
| `className` | `string` | — | Clase para el elemento raiz |
| `style` | `CSSProperties` | — | Estilo para el elemento raiz |
| `classNames` | `BadgeClassNames` | — | Nombres de clase semanticos |
| `styles` | `BadgeStyles` | — | Estilos semanticos |

#### Colores Predefinidos

`pink` · `red` · `yellow` · `orange` · `cyan` · `green` · `blue` · `purple` · `geekblue` · `magenta` · `volcano` · `gold` · `lime`

#### Props de Badge.Ribbon

| Prop | Tipo | Por Defecto | Descripcion |
|------|------|-------------|-------------|
| `children` | `ReactNode` | — | Contenido a envolver |
| `text` | `ReactNode` | — | Texto mostrado dentro de la cinta |
| `color` | `string` | `tokens.colorPrimary` | Color de la cinta (nombre predefinido o color CSS) |
| `placement` | `'start' \| 'end'` | `'end'` | En que esquina aparece la cinta |
| `className` | `string` | — | Clase para el elemento contenedor |
| `style` | `CSSProperties` | — | Estilo para el elemento contenedor |
| `classNames` | `RibbonClassNames` | — | Nombres de clase semanticos |
| `styles` | `RibbonStyles` | — | Estilos semanticos |

#### DOM Semantico – Badge

| Slot | Descripcion |
|------|-------------|
| `root` | Elemento contenedor exterior |
| `indicator` | El elemento del badge de conteo / punto (`<sup>`) |

#### DOM Semantico – Badge.Ribbon

| Slot | Descripcion |
|------|-------------|
| `wrapper` | Elemento contenedor exterior |
| `ribbon` | La franja de la cinta |
| `content` | Contenido de texto dentro de la cinta |
| `corner` | El triangulo de esquina doblada |

#### Ejemplos

```tsx
// Badge de conteo envolviendo contenido
<Badge count={5}>
  <Avatar shape="square" />
</Badge>

// Conteo desbordado (muestra "99+")
<Badge count={120}>
  <Avatar shape="square" />
</Badge>

// Mostrar cero
<Badge count={0} showZero>
  <Avatar shape="square" />
</Badge>

// Indicador de punto
<Badge dot>
  <NotificationIcon />
</Badge>

// Tamano pequeno
<Badge count={5} size="small">
  <Avatar shape="square" />
</Badge>

// Desplazamiento personalizado
<Badge count={5} offset={[10, 10]}>
  <Avatar shape="square" />
</Badge>

// Puntos de estado (independiente, sin hijos)
<Badge status="success" text="Completado" />
<Badge status="processing" text="En Progreso" />
<Badge status="error" text="Fallido" />
<Badge status="warning" text="Advertencia" />
<Badge status="default" text="Inactivo" />

// Colores predefinidos
<Badge color="blue" count={8}>
  <Avatar shape="square" />
</Badge>
<Badge color="volcano" count={3}>
  <Avatar shape="square" />
</Badge>

// Color CSS personalizado
<Badge color="#faad14" count={10}>
  <Avatar shape="square" />
</Badge>

// Conteo independiente (sin hijos)
<Badge count={25} />

// Badge.Ribbon
<Badge.Ribbon text="Destacado">
  <Card>Contenido de la tarjeta</Card>
</Badge.Ribbon>

<Badge.Ribbon text="Oferta" color="red" placement="start">
  <Card>Contenido de la tarjeta</Card>
</Badge.Ribbon>
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
<summary><strong>Card</strong> - Contenedor versátil de contenido</summary>

### Card

`Card` es un contenedor versátil para agrupar información relacionada con encabezado opcional, imagen de portada, acciones, pestañas y estados de carga. Soporta diseños de cuadrícula y componentes de metadatos.

#### Importar

```tsx
import { Card } from 'j-ui'
```

#### Props

| Prop | Tipo | Por defecto | Descripción |
|------|------|-------------|-------------|
| `title` | `ReactNode` | - | Título de la tarjeta mostrado en el encabezado |
| `extra` | `ReactNode` | - | Contenido extra mostrado en la esquina superior derecha del encabezado |
| `cover` | `ReactNode` | - | Imagen de portada o contenido mostrado en la parte superior de la tarjeta |
| `actions` | `ReactNode[]` | - | Array de elementos de acción mostrados en la parte inferior (distribuidos uniformemente) |
| `loading` | `boolean` | `false` | Muestra el esqueleto de carga en lugar de los hijos |
| `hoverable` | `boolean` | `false` | Habilita efecto hover con sombra y animación de elevación |
| `size` | `CardSize` | `'default'` | Tamaño de la tarjeta: `'default'` (padding 1.5rem) o `'small'` (padding 0.75rem) |
| `variant` | `CardVariant` | `'outlined'` | Estilo de la tarjeta: `'outlined'` (con borde) o `'borderless'` (sin borde) |
| `type` | `'inner'` | - | Tipo de tarjeta anidada con fondo sutil en el encabezado |
| `tabList` | `CardTabItem[]` | - | Array de items de pestañas para mostrar en el encabezado |
| `activeTabKey` | `string` | - | Clave de la pestaña activa actual (controlado) |
| `defaultActiveTabKey` | `string` | - | Clave de la pestaña activa inicial (no controlado) |
| `tabProps` | `Partial<TabsProps>` | - | Props adicionales para pasar al componente Tabs |
| `onTabChange` | `(key: string) => void` | - | Callback ejecutado cuando cambia la pestaña |
| `children` | `ReactNode` | - | Contenido de la tarjeta |
| `className` | `string` | - | Nombre de clase del elemento raíz |
| `style` | `CSSProperties` | - | Estilos inline del elemento raíz |
| `classNames` | `CardClassNames` | - | Nombres de clase semánticos para slots de la tarjeta |
| `styles` | `CardStyles` | - | Estilos inline semánticos para slots de la tarjeta |

#### CardTabItem

```tsx
interface CardTabItem {
  key: string
  label: ReactNode
  disabled?: boolean
}
```

#### Props de Card.Meta

| Prop | Tipo | Por defecto | Descripción |
|------|------|-------------|-------------|
| `avatar` | `ReactNode` | - | Elemento avatar (típicamente un componente Avatar) |
| `title` | `ReactNode` | - | Título del meta |
| `description` | `ReactNode` | - | Descripción del meta |
| `className` | `string` | - | Nombre de clase del elemento raíz |
| `style` | `CSSProperties` | - | Estilos inline del elemento raíz |

#### Props de Card.Grid

| Prop | Tipo | Por defecto | Descripción |
|------|------|-------------|-------------|
| `hoverable` | `boolean` | `true` | Habilita efecto hover con sombra |
| `children` | `ReactNode` | - | Contenido de la celda de la cuadrícula |
| `className` | `string` | - | Nombre de clase del elemento raíz |
| `style` | `CSSProperties` | - | Estilos inline del elemento raíz |

#### Configuración de Tamaños

```tsx
type CardSize = 'default' | 'small'

// Valores de padding:
// 'default': 1.5rem (24px)
// 'small': 0.75rem (12px)
```

#### DOM Semántico

El componente Card utiliza nombres de clase y estilos semánticos para personalización:

```tsx
type CardSemanticSlot = 'root' | 'header' | 'body' | 'extra' | 'title' | 'actions' | 'cover'

interface CardClassNames {
  root?: string
  header?: string
  body?: string
  extra?: string
  title?: string
  actions?: string
  cover?: string
}

interface CardStyles {
  root?: CSSProperties
  header?: CSSProperties
  body?: CSSProperties
  extra?: CSSProperties
  title?: CSSProperties
  actions?: CSSProperties
  cover?: CSSProperties
}
```

#### Ejemplos

**Tarjeta básica:**

```tsx
<Card title="Título de Tarjeta">
  <p>El contenido de la tarjeta va aquí</p>
</Card>
```

**Tarjeta con imagen de portada:**

```tsx
<Card
  cover={
    <img
      alt="ejemplo"
      src="https://picsum.photos/400/200"
      style={{ width: '100%', display: 'block' }}
    />
  }
  title="Tarjeta con Foto"
>
  <p>Tarjeta con una imagen de portada mostrada en la parte superior</p>
</Card>
```

**Tarjeta con acciones:**

```tsx
<Card
  title="Tarjeta Interactiva"
  actions={[
    <HeartIcon size={18} />,
    <EditIcon size={18} />,
    <ShareIcon size={18} />
  ]}
>
  <p>Tarjeta con botones de acción en la parte inferior</p>
</Card>
```

**Tarjeta con contenido extra:**

```tsx
<Card
  title="Configuración"
  extra={<a href="#">Más</a>}
>
  <p>Tarjeta con contenido extra en la esquina superior derecha</p>
</Card>
```

**Estado de carga:**

```tsx
<Card title="Tarjeta Cargando" loading>
  <p>Este contenido está oculto mientras carga</p>
</Card>
```

**Tarjeta hoverable:**

```tsx
<Card title="Pasa el Mouse" hoverable>
  <p>Esta tarjeta tiene un efecto hover con sombra y animación de elevación</p>
</Card>
```

**Tarjeta tamaño pequeño:**

```tsx
<Card title="Tarjeta Pequeña" size="small">
  <p>Tarjeta compacta con padding reducido</p>
</Card>
```

**Tarjeta sin bordes:**

```tsx
<Card title="Sin Bordes" variant="borderless">
  <p>Tarjeta sin borde</p>
</Card>
```

**Tarjeta interna (anidada):**

```tsx
<Card title="Tarjeta Externa">
  <Card title="Tarjeta Interna" type="inner">
    <p>Tarjeta anidada con fondo sutil en el encabezado</p>
  </Card>
</Card>
```

**Tarjeta con pestañas:**

```tsx
<Card
  title="Tarjeta con Pestañas"
  tabList={[
    { key: 'tab1', label: 'Pestaña 1' },
    { key: 'tab2', label: 'Pestaña 2' },
    { key: 'tab3', label: 'Pestaña 3', disabled: true }
  ]}
  defaultActiveTabKey="tab1"
  onTabChange={(key) => console.log('Pestaña activa:', key)}
>
  <p>Contenido para la pestaña seleccionada</p>
</Card>
```

**Card.Meta con avatar:**

```tsx
import { Card, Avatar } from 'j-ui'

<Card>
  <Card.Meta
    avatar={<Avatar src="https://i.pravatar.cc/40" />}
    title="Título de Tarjeta"
    description="Esta es la descripción"
  />
</Card>
```

**Diseño Card.Grid:**

```tsx
<Card title="Tarjeta en Cuadrícula">
  <Card.Grid>Contenido 1</Card.Grid>
  <Card.Grid>Contenido 2</Card.Grid>
  <Card.Grid>Contenido 3</Card.Grid>
  <Card.Grid>Contenido 4</Card.Grid>
  <Card.Grid>Contenido 5</Card.Grid>
  <Card.Grid>Contenido 6</Card.Grid>
</Card>
```

**Pestañas controladas:**

```tsx
const [activeTab, setActiveTab] = useState('photos')

<Card
  title="Galería"
  tabList={[
    { key: 'photos', label: 'Fotos' },
    { key: 'videos', label: 'Videos' }
  ]}
  activeTabKey={activeTab}
  onTabChange={setActiveTab}
>
  {activeTab === 'photos' ? <PhotoGrid /> : <VideoGrid />}
</Card>
```

**Tarjeta compleja con todas las características:**

```tsx
<Card
  cover={<img src="https://picsum.photos/400/200" alt="portada" />}
  title="Producto Premium"
  extra={<Tag color="gold">Destacado</Tag>}
  hoverable
  actions={[
    <HeartIcon size={18} />,
    <ShoppingCartIcon size={18} />,
    <ShareIcon size={18} />
  ]}
>
  <Card.Meta
    avatar={<Avatar>JD</Avatar>}
    title="John Doe"
    description="Diseñador de productos"
  />
  <Divider />
  <p>Este es un producto premium con todas las características disponibles.</p>
</Card>
```

</details>

---

<details>
<summary><strong>Calendar</strong> - Calendario de selección de fechas</summary>

### Calendar

`Calendar` muestra un calendario completo para selección de fechas con vistas de mes y año. Soporta modos pantalla completa y tarjeta, renderizado personalizado de celdas, números de semana, restricciones de rango de fechas y adaptadores de fechas para diferentes librerías.

**Importación:**
```tsx
import { Calendar } from 'j-ui';
```

#### Props

| Prop | Tipo | Predeterminado | Descripción |
|------|------|----------------|-------------|
| `value` | `TDate` | `undefined` | Fecha seleccionada controlada |
| `defaultValue` | `TDate` | `today()` | Fecha seleccionada inicial (modo no controlado) |
| `fullscreen` | `boolean` | `true` | Modo pantalla completa (100% ancho) vs modo tarjeta (18.75rem) |
| `mode` | `'month' \| 'year'` | `undefined` | Modo de calendario controlado |
| `defaultMode` | `'month' \| 'year'` | `'month'` | Modo de calendario inicial (no controlado) |
| `showWeek` | `boolean` | `false` | Mostrar números de semana |
| `headerRender` | `(config: CalendarHeaderConfig) => ReactNode` | `undefined` | Renderizador de encabezado personalizado |
| `cellRender` | `(current: TDate, info: CalendarCellRenderInfo) => ReactNode` | `undefined` | Contenido de celda personalizado (mantiene estructura por defecto) |
| `fullCellRender` | `(current: TDate, info: CalendarCellRenderInfo) => ReactNode` | `undefined` | Reemplazar celda completa |
| `validRange` | `[TDate, TDate]` | `undefined` | Rango de fechas válidas [inicio, fin] |
| `disabledDate` | `(date: TDate) => boolean` | `undefined` | Función para deshabilitar fechas específicas |
| `onChange` | `(date: TDate) => void` | `undefined` | Callback cuando se selecciona una fecha |
| `onPanelChange` | `(date: TDate, mode: CalendarMode) => void` | `undefined` | Callback cuando cambia el panel (cambio de modo) |
| `onSelect` | `(date: TDate, info: CalendarSelectInfo) => void` | `undefined` | Callback en selección con información de origen |
| `adapter` | `DateAdapter<TDate>` | `NativeDateAdapter` | Adaptador de fechas personalizado |
| `className` | `string` | `undefined` | Nombre de clase del elemento raíz |
| `style` | `CSSProperties` | `undefined` | Estilos en línea del elemento raíz |
| `classNames` | `SemanticClassNames<CalendarSemanticSlot>` | `undefined` | Nombres de clase semánticos |
| `styles` | `SemanticStyles<CalendarSemanticSlot>` | `undefined` | Estilos en línea semánticos |

#### Interfaz CalendarHeaderConfig

```typescript
interface CalendarHeaderConfig<TDate = any> {
  value: TDate;                        // Fecha seleccionada actual
  type: CalendarMode;                  // Modo actual ('month' | 'year')
  onChange: (date: TDate) => void;     // Cambiar fecha seleccionada
  onTypeChange: (type: CalendarMode) => void; // Cambiar modo
}
```

#### Interfaz CalendarCellRenderInfo

```typescript
interface CalendarCellRenderInfo {
  originNode: ReactNode;  // Contenido de celda por defecto
  today: boolean;         // Si esta celda es hoy
  type: 'date' | 'month'; // Tipo de celda
}
```

#### Interfaz CalendarSelectInfo

```typescript
interface CalendarSelectInfo {
  source: 'year' | 'month' | 'date' | 'customize'; // Origen de la selección
}
```

#### Modos de Calendario

- **`month`**: Muestra una cuadrícula de días (6 semanas × 7 días)
- **`year`**: Muestra una cuadrícula de meses (3 × 4 cuadrícula)

#### Modos de Visualización

- **Pantalla completa** (`fullscreen={true}`): 100% ancho, celdas más grandes, adecuado para área de contenido principal
- **Tarjeta** (`fullscreen={false}`): 18.75rem (300px) ancho, compacto, adecuado para desplegables/paneles

#### Slots de DOM Semántico

| Slot | Descripción |
|------|-------------|
| `root` | El elemento contenedor raíz |
| `header` | Sección de encabezado con selectores de año/mes y alternador de modo |
| `body` | Sección de cuerpo que contiene la cuadrícula del calendario |
| `cell` | Celda individual de fecha o mes |

#### Adaptadores de Fechas

Calendar usa adaptadores de fechas para compatibilidad con diferentes librerías de fechas:
- **NativeDateAdapter** (por defecto): Usa Date nativo de JavaScript
- **DayJSAdapter**: Para librería Day.js
- **DateFnsAdapter**: Para librería date-fns
- **LuxonAdapter**: Para librería Luxon
- **MomentAdapter**: Para librería Moment.js

Use `CalendarAdapterProvider` para establecer adaptador para todos los calendarios en un subárbol.

#### Ejemplos

**Uso básico:**
```tsx
import { Calendar } from 'j-ui';

<Calendar
  onChange={(date) => console.log('Seleccionado:', date)}
/>
```

**Modo tarjeta (compacto):**
```tsx
<Calendar
  fullscreen={false}
  onChange={(date) => console.log('Seleccionado:', date)}
/>
```

**Valor controlado:**
```tsx
const [selectedDate, setSelectedDate] = useState(new Date());

<Calendar
  value={selectedDate}
  onChange={setSelectedDate}
/>
```

**Modo vista de año:**
```tsx
<Calendar
  defaultMode="year"
  onChange={(date) => console.log('Mes seleccionado:', date)}
/>
```

**Con números de semana:**
```tsx
<Calendar
  showWeek
  onChange={(date) => console.log('Seleccionado:', date)}
/>
```

**Con rango de fechas válidas:**
```tsx
const today = new Date();
const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

<Calendar
  validRange={[today, nextMonth]}
  onChange={(date) => console.log('Seleccionado:', date)}
/>
```

**Con fechas deshabilitadas (deshabilitar fines de semana):**
```tsx
<Calendar
  disabledDate={(date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Domingo o sábado
  }}
/>
```

**Renderizado de celda personalizado (agregar badges):**
```tsx
<Calendar
  cellRender={(date, info) => {
    const hasEvent = checkIfDateHasEvent(date);
    return hasEvent ? (
      <div>
        {info.originNode}
        <div style={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          backgroundColor: '#1890ff',
          margin: '0 auto'
        }} />
      </div>
    ) : info.originNode;
  }}
/>
```

**Renderizado de celda completo (contenido personalizado):**
```tsx
<Calendar
  fullscreen
  fullCellRender={(date, info) => {
    const events = getEventsForDate(date);
    return (
      <div style={{ padding: '0.5rem' }}>
        <div style={{
          textAlign: 'right',
          fontWeight: info.today ? 700 : 400,
          color: info.today ? '#1890ff' : 'inherit'
        }}>
          {date.getDate()}
        </div>
        {events.map((event, idx) => (
          <div
            key={idx}
            style={{
              fontSize: '0.75rem',
              padding: '0.125rem 0.25rem',
              backgroundColor: '#e6f7ff',
              borderRadius: '0.25rem',
              marginTop: '0.25rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {event.title}
          </div>
        ))}
      </div>
    );
  }}
/>
```

**Encabezado personalizado:**
```tsx
<Calendar
  headerRender={({ value, type, onChange, onTypeChange }) => (
    <div style={{ padding: '1rem', borderBottom: '1px solid #d9d9d9' }}>
      <h3>Encabezado de Calendario Personalizado</h3>
      <div>
        Actual: {value.toLocaleDateString()}
      </div>
      <button onClick={() => {
        const prev = new Date(value);
        prev.setMonth(prev.getMonth() - 1);
        onChange(prev);
      }}>
        Mes Anterior
      </button>
      <button onClick={() => onTypeChange(type === 'month' ? 'year' : 'month')}>
        Alternar: {type}
      </button>
    </div>
  )}
/>
```

**Con adaptador Day.js:**
```tsx
import { Calendar, CalendarAdapterProvider } from 'j-ui';
import { DayJSAdapter } from 'j-ui/adapters';
import dayjs from 'dayjs';

const adapter = new DayJSAdapter();

<CalendarAdapterProvider adapter={adapter}>
  <Calendar
    value={dayjs()}
    onChange={(date) => console.log('Seleccionado:', date.format('YYYY-MM-DD'))}
  />
</CalendarAdapterProvider>
```

**Seguimiento de cambio de panel:**
```tsx
<Calendar
  onPanelChange={(date, mode) => {
    console.log('Panel cambió a:', mode, 'en', date);
  }}
  onSelect={(date, info) => {
    console.log('Seleccionado vía:', info.source, 'fecha:', date);
  }}
/>
```

</details>

---

<details>
<summary><strong>Carousel</strong> - Deslizador de imágenes y contenido</summary>

### Carousel

`Carousel` es un componente de presentación de diapositivas para mostrar imágenes o contenido con reproducción automática, flechas de navegación, indicadores de puntos, efectos de fundido/desplazamiento, bucle infinito, soporte de arrastre e indicadores de progreso.

#### Importar

```tsx
import { Carousel } from 'j-ui'
```

#### Props

| Prop | Tipo | Por defecto | Descripción |
|------|------|-------------|-------------|
| `autoplay` | `boolean` | `false` | Habilita transiciones automáticas de diapositivas |
| `autoplaySpeed` | `number` | `3000` | Intervalo de reproducción automática en milisegundos |
| `arrows` | `boolean` | `false` | Muestra flechas de navegación anterior/siguiente |
| `dots` | `boolean \| { className?: string }` | `true` | Muestra indicadores de puntos (puede pasar className para estilo personalizado) |
| `dotPlacement` | `CarouselDotPlacement` | `'bottom'` | Posición de los puntos: `'top'`, `'bottom'`, `'left'` o `'right'` |
| `effect` | `CarouselEffect` | `'scrollx'` | Efecto de transición: `'scrollx'` (deslizar) o `'fade'` (fundido cruzado) |
| `speed` | `number` | `500` | Duración de la transición en milisegundos |
| `easing` | `string` | `'ease'` | Función de temporización de transición CSS |
| `infinite` | `boolean` | `true` | Habilita bucle infinito (envolvente sin costuras) |
| `draggable` | `boolean` | `false` | Habilita navegación arrastrando con eventos de puntero |
| `dragClamp` | `boolean` | `false` | Limita la distancia de arrastre a ±1 diapositiva desde la actual |
| `dotProgress` | `boolean` | `false` | Muestra barra de progreso animada en el punto activo durante autoplay |
| `initialSlide` | `number` | `0` | Índice de la diapositiva inicial a mostrar |
| `waitForAnimate` | `boolean` | `false` | Previene navegación mientras la transición está en progreso |
| `beforeChange` | `(current: number, next: number) => void` | - | Callback antes del cambio de diapositiva |
| `afterChange` | `(current: number) => void` | - | Callback después de que se completa el cambio de diapositiva |
| `children` | `ReactNode` | - | Contenido de las diapositivas (cada hijo se convierte en una diapositiva) |
| `className` | `string` | - | Nombre de clase del elemento raíz |
| `style` | `CSSProperties` | - | Estilos inline del elemento raíz |
| `classNames` | `CarouselClassNames` | - | Nombres de clase semánticos para slots del carousel |
| `styles` | `CarouselStyles` | - | Estilos inline semánticos para slots del carousel |

#### CarouselRef

```tsx
interface CarouselRef {
  goTo(index: number, animate?: boolean): void  // Navegar a una diapositiva específica
  next(): void                                  // Ir a la siguiente diapositiva
  prev(): void                                  // Ir a la diapositiva anterior
}

// Uso
const carouselRef = useRef<CarouselRef>(null)
carouselRef.current?.goTo(2)
```

#### DOM Semántico

El componente Carousel utiliza nombres de clase y estilos semánticos para personalización:

```tsx
type CarouselSemanticSlot = 'root' | 'track' | 'slide' | 'dots' | 'arrow'

interface CarouselClassNames {
  root?: string
  track?: string
  slide?: string
  dots?: string
  arrow?: string
}

interface CarouselStyles {
  root?: CSSProperties
  track?: CSSProperties
  slide?: CSSProperties
  dots?: CSSProperties
  arrow?: CSSProperties
}
```

#### Ejemplos

**Carousel básico:**

```tsx
<Carousel>
  <div style={{ height: '200px', backgroundColor: '#1890ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    Diapositiva 1
  </div>
  <div style={{ height: '200px', backgroundColor: '#52c41a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    Diapositiva 2
  </div>
  <div style={{ height: '200px', backgroundColor: '#fa8c16', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    Diapositiva 3
  </div>
</Carousel>
```

**Autoplay con puntos de progreso:**

```tsx
<Carousel autoplay autoplaySpeed={4000} dotProgress>
  <img src="https://picsum.photos/800/400?random=1" alt="1" style={{ width: '100%', display: 'block' }} />
  <img src="https://picsum.photos/800/400?random=2" alt="2" style={{ width: '100%', display: 'block' }} />
  <img src="https://picsum.photos/800/400?random=3" alt="3" style={{ width: '100%', display: 'block' }} />
</Carousel>
```

**Efecto de fundido:**

```tsx
<Carousel effect="fade" autoplay>
  <div style={{ height: '300px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} />
  <div style={{ height: '300px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }} />
  <div style={{ height: '300px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }} />
</Carousel>
```

**Carousel vertical:**

```tsx
<Carousel dotPlacement="right" style={{ height: '400px' }}>
  <div style={{ height: '400px', backgroundColor: '#1890ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    Diapositiva Vertical 1
  </div>
  <div style={{ height: '400px', backgroundColor: '#52c41a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    Diapositiva Vertical 2
  </div>
  <div style={{ height: '400px', backgroundColor: '#fa8c16', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    Diapositiva Vertical 3
  </div>
</Carousel>
```

**Con flechas:**

```tsx
<Carousel arrows autoplay>
  <img src="https://picsum.photos/800/400?random=4" alt="4" style={{ width: '100%', display: 'block' }} />
  <img src="https://picsum.photos/800/400?random=5" alt="5" style={{ width: '100%', display: 'block' }} />
  <img src="https://picsum.photos/800/400?random=6" alt="6" style={{ width: '100%', display: 'block' }} />
</Carousel>
```

**Sin puntos:**

```tsx
<Carousel dots={false} arrows autoplay>
  <div style={{ height: '200px', backgroundColor: '#722ed1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    Sin Puntos 1
  </div>
  <div style={{ height: '200px', backgroundColor: '#eb2f96', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    Sin Puntos 2
  </div>
</Carousel>
```

**Carousel arrastrable:**

```tsx
<Carousel draggable dragClamp>
  <div style={{ height: '250px', backgroundColor: '#13c2c2', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    ¡Arrástrame! Diapositiva 1
  </div>
  <div style={{ height: '250px', backgroundColor: '#1890ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    ¡Arrástrame! Diapositiva 2
  </div>
  <div style={{ height: '250px', backgroundColor: '#722ed1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    ¡Arrástrame! Diapositiva 3
  </div>
</Carousel>
```

**Carousel no infinito:**

```tsx
<Carousel infinite={false} arrows>
  <div style={{ height: '200px', backgroundColor: '#f5222d', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    Primera Diapositiva
  </div>
  <div style={{ height: '200px', backgroundColor: '#fa541c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    Diapositiva del Medio
  </div>
  <div style={{ height: '200px', backgroundColor: '#fa8c16', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    Última Diapositiva
  </div>
</Carousel>
```

**Navegación controlada con ref:**

```tsx
const carouselRef = useRef<CarouselRef>(null)

<div>
  <Carousel ref={carouselRef}>
    <div style={{ height: '200px', backgroundColor: '#1890ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Diapositiva 1</div>
    <div style={{ height: '200px', backgroundColor: '#52c41a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Diapositiva 2</div>
    <div style={{ height: '200px', backgroundColor: '#fa8c16', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Diapositiva 3</div>
    <div style={{ height: '200px', backgroundColor: '#eb2f96', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Diapositiva 4</div>
  </Carousel>

  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
    <Button onClick={() => carouselRef.current?.prev()}>Anterior</Button>
    <Button onClick={() => carouselRef.current?.next()}>Siguiente</Button>
    <Button onClick={() => carouselRef.current?.goTo(2)}>Ir a Diapositiva 3</Button>
  </div>
</div>
```

**Callbacks antes/después del cambio:**

```tsx
<Carousel
  autoplay
  beforeChange={(current, next) => console.log(`Cambiando de ${current} a ${next}`)}
  afterChange={(current) => console.log(`Ahora en diapositiva ${current}`)}
>
  <div style={{ height: '200px', backgroundColor: '#1890ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Diapositiva 1</div>
  <div style={{ height: '200px', backgroundColor: '#52c41a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Diapositiva 2</div>
  <div style={{ height: '200px', backgroundColor: '#fa8c16', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Diapositiva 3</div>
</Carousel>
```

**Posición personalizada de puntos (arriba):**

```tsx
<Carousel dotPlacement="top" autoplay>
  <img src="https://picsum.photos/800/400?random=7" alt="7" style={{ width: '100%', display: 'block' }} />
  <img src="https://picsum.photos/800/400?random=8" alt="8" style={{ width: '100%', display: 'block' }} />
  <img src="https://picsum.photos/800/400?random=9" alt="9" style={{ width: '100%', display: 'block' }} />
</Carousel>
```

**Esperar animación (previene clics rápidos):**

```tsx
<Carousel arrows waitForAnimate>
  <div style={{ height: '200px', backgroundColor: '#1890ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Diapositiva 1</div>
  <div style={{ height: '200px', backgroundColor: '#52c41a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Diapositiva 2</div>
  <div style={{ height: '200px', backgroundColor: '#fa8c16', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Diapositiva 3</div>
</Carousel>
```

**Diapositiva inicial:**

```tsx
<Carousel initialSlide={2} arrows>
  <div style={{ height: '200px', backgroundColor: '#1890ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Diapositiva 1</div>
  <div style={{ height: '200px', backgroundColor: '#52c41a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Diapositiva 2</div>
  <div style={{ height: '200px', backgroundColor: '#fa8c16', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Diapositiva 3 (comienza aquí)</div>
  <div style={{ height: '200px', backgroundColor: '#eb2f96', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Diapositiva 4</div>
</Carousel>
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
<summary><strong>Collapse</strong> - Paneles acordeón expandibles</summary>

### Collapse

`Collapse` muestra paneles colapsables con animaciones suaves para ocultar y mostrar contenido. Soporta modo acordeón, iconos de expansión personalizados, diferentes tamaños, estilo ghost y comportamiento colapsable flexible.

#### Importar

```tsx
import { Collapse } from 'j-ui'
```

#### Props

| Prop | Tipo | Por defecto | Descripción |
|------|------|-------------|-------------|
| `items` | `CollapseItem[]` | - | Array de elementos del panel (alternativa a usar hijos `Collapse.Panel`) |
| `accordion` | `boolean` | `false` | Modo acordeón - solo un panel puede estar abierto a la vez |
| `activeKey` | `string \| string[]` | - | Clave(s) de panel activo actualmente - modo controlado |
| `defaultActiveKey` | `string \| string[]` | - | Clave(s) de panel activo inicial - modo no controlado |
| `bordered` | `boolean` | `true` | Muestra borde alrededor del collapse |
| `ghost` | `boolean` | `false` | Hace el collapse sin bordes y con fondo transparente |
| `size` | `CollapseSize` | `'middle'` | Tamaño del panel: `'small'`, `'middle'` o `'large'` |
| `collapsible` | `CollapseCollapsible` | - | Comportamiento colapsable global: `'header'` (header completo clickeable), `'icon'` (solo icono clickeable), o `'disabled'` |
| `expandIcon` | `(props: { isActive: boolean }) => ReactNode` | - | Función de renderizado de icono de expansión personalizado |
| `expandIconPlacement` | `'start' \| 'end'` | `'start'` | Posición del icono de expansión |
| `destroyOnHidden` | `boolean` | `false` | Desmonta el contenido cuando el panel está cerrado |
| `onChange` | `(key: string \| string[]) => void` | - | Callback cuando cambia(n) el/los panel(es) activo(s) |
| `children` | `ReactNode` | - | Componentes Collapse.Panel |
| `className` | `string` | - | Nombre de clase del elemento raíz |
| `style` | `CSSProperties` | - | Estilos inline del elemento raíz |
| `classNames` | `CollapseClassNames` | - | Nombres de clase semánticos para slots del collapse |
| `styles` | `CollapseStyles` | - | Estilos inline semánticos para slots del collapse |

#### CollapseItem

```tsx
interface CollapseItem {
  key: string                      // Identificador único del panel
  label?: ReactNode                // Contenido del encabezado del panel
  children?: ReactNode             // Contenido del panel
  extra?: ReactNode                // Contenido extra en el encabezado (lado derecho)
  showArrow?: boolean              // Mostrar icono de flecha de expansión
  collapsible?: CollapseCollapsible // Comportamiento colapsable específico del panel
  forceRender?: boolean            // Renderizar contenido incluso cuando está colapsado
  className?: string               // Nombre de clase del contenedor del panel
  style?: CSSProperties            // Estilos inline del contenedor del panel
}
```

#### Props de Collapse.Panel

```tsx
interface CollapsePanelProps {
  panelKey: string                 // Identificador único del panel (requerido)
  header?: ReactNode               // Contenido del encabezado del panel
  children?: ReactNode             // Contenido del panel
  extra?: ReactNode                // Contenido extra en el encabezado (lado derecho)
  showArrow?: boolean              // Mostrar icono de flecha de expansión
  collapsible?: CollapseCollapsible // Comportamiento colapsable específico del panel
  forceRender?: boolean            // Renderizar contenido incluso cuando está colapsado
  className?: string               // Nombre de clase del contenedor del panel
  style?: CSSProperties            // Estilos inline del contenedor del panel
}
```

#### Configuración de Tamaños

```tsx
type CollapseSize = 'large' | 'middle' | 'small'

// Configuraciones de tamaño:
// small:  headerPadding: '0.375rem 0.75rem',  contentPadding: '0.75rem',  fontSize: '0.8125rem'
// middle: headerPadding: '0.75rem 1rem',      contentPadding: '1rem',     fontSize: '0.875rem'
// large:  headerPadding: '1rem 1.25rem',      contentPadding: '1.25rem',  fontSize: '1rem'
```

#### DOM Semántico

El componente Collapse utiliza nombres de clase y estilos semánticos para personalización:

```tsx
type CollapseSemanticSlot = 'root' | 'header' | 'content' | 'arrow'

interface CollapseClassNames {
  root?: string
  header?: string
  content?: string
  arrow?: string
}

interface CollapseStyles {
  root?: CSSProperties
  header?: CSSProperties
  content?: CSSProperties
  arrow?: CSSProperties
}
```

#### Ejemplos

**Collapse básico:**

```tsx
<Collapse
  items={[
    {
      key: '1',
      label: 'Panel 1',
      children: <p>Contenido del panel 1</p>,
    },
    {
      key: '2',
      label: 'Panel 2',
      children: <p>Contenido del panel 2</p>,
    },
    {
      key: '3',
      label: 'Panel 3',
      children: <p>Contenido del panel 3</p>,
    },
  ]}
  defaultActiveKey={['1']}
/>
```

**Modo acordeón (solo un panel abierto):**

```tsx
<Collapse
  accordion
  items={[
    {
      key: '1',
      label: 'Panel de Acordeón 1',
      children: <p>Solo un panel puede estar abierto a la vez</p>,
    },
    {
      key: '2',
      label: 'Panel de Acordeón 2',
      children: <p>Abrir este cerrará el otro</p>,
    },
    {
      key: '3',
      label: 'Panel de Acordeón 3',
      children: <p>Paneles mutuamente exclusivos</p>,
    },
  ]}
  defaultActiveKey="1"
/>
```

**Estilo ghost (sin borde, fondo transparente):**

```tsx
<Collapse
  ghost
  items={[
    {
      key: '1',
      label: 'Panel Ghost 1',
      children: <p>Sin bordes y transparente</p>,
    },
    {
      key: '2',
      label: 'Panel Ghost 2',
      children: <p>Estilo minimalista</p>,
    },
  ]}
/>
```

**Sin borde:**

```tsx
<Collapse
  bordered={false}
  items={[
    {
      key: '1',
      label: 'Panel Sin Borde',
      children: <p>Sin borde exterior</p>,
    },
  ]}
/>
```

**Tamaño personalizado (pequeño):**

```tsx
<Collapse
  size="small"
  items={[
    {
      key: '1',
      label: 'Panel Pequeño',
      children: <p>Tamaño compacto con padding reducido</p>,
    },
  ]}
/>
```

**Tamaño personalizado (grande):**

```tsx
<Collapse
  size="large"
  items={[
    {
      key: '1',
      label: 'Panel Grande',
      children: <p>Tamaño espacioso con padding aumentado</p>,
    },
  ]}
/>
```

**Colapsable solo con icono:**

```tsx
<Collapse
  collapsible="icon"
  items={[
    {
      key: '1',
      label: 'Haz clic solo en la flecha',
      children: <p>El texto del encabezado no es clickeable, solo el icono</p>,
    },
  ]}
/>
```

**Panel deshabilitado:**

```tsx
<Collapse
  items={[
    {
      key: '1',
      label: 'Panel Activo',
      children: <p>Este panel puede ser alternado</p>,
    },
    {
      key: '2',
      label: 'Panel Deshabilitado',
      children: <p>Este panel no puede ser alternado</p>,
      collapsible: 'disabled',
    },
  ]}
/>
```

**Icono de expansión personalizado:**

```tsx
<Collapse
  expandIcon={({ isActive }) => (
    <span style={{ transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
      ▼
    </span>
  )}
  items={[
    {
      key: '1',
      label: 'Panel con Icono Personalizado',
      children: <p>Usando un icono de expansión personalizado</p>,
    },
  ]}
/>
```

**Icono de expansión al final:**

```tsx
<Collapse
  expandIconPlacement="end"
  items={[
    {
      key: '1',
      label: 'Icono a la Derecha',
      children: <p>El icono de expansión está posicionado al final</p>,
    },
  ]}
/>
```

**Con contenido extra:**

```tsx
<Collapse
  items={[
    {
      key: '1',
      label: 'Panel con Extra',
      extra: <a href="#" onClick={(e) => e.stopPropagation()}>Editar</a>,
      children: <p>El encabezado tiene contenido extra a la derecha</p>,
    },
  ]}
/>
```

**Sin flecha:**

```tsx
<Collapse
  items={[
    {
      key: '1',
      label: 'Panel Sin Flecha',
      showArrow: false,
      children: <p>Este panel no tiene flecha de expansión</p>,
    },
  ]}
/>
```

**Collapse controlado:**

```tsx
const [activeKeys, setActiveKeys] = useState<string[]>(['1'])

<div>
  <Button onClick={() => setActiveKeys(['1', '2'])}>Abrir Todos</Button>
  <Button onClick={() => setActiveKeys([])}>Cerrar Todos</Button>

  <Collapse
    activeKey={activeKeys}
    onChange={(keys) => setActiveKeys(Array.isArray(keys) ? keys : [keys])}
    items={[
      {
        key: '1',
        label: 'Panel 1',
        children: <p>Panel controlado 1</p>,
      },
      {
        key: '2',
        label: 'Panel 2',
        children: <p>Panel controlado 2</p>,
      },
    ]}
  />
</div>
```

**Destruir al ocultar (desmontar contenido cuando se cierra):**

```tsx
<Collapse
  destroyOnHidden
  items={[
    {
      key: '1',
      label: 'Destruye Contenido',
      children: <p>Este contenido se desmonta cuando el panel se cierra</p>,
    },
  ]}
/>
```

**Forzar renderizado (mantener contenido montado):**

```tsx
<Collapse
  items={[
    {
      key: '1',
      label: 'Siempre Renderizado',
      forceRender: true,
      children: <p>Este contenido permanece montado incluso cuando está colapsado</p>,
    },
  ]}
/>
```

**Usando sintaxis Collapse.Panel:**

```tsx
<Collapse defaultActiveKey={['1']}>
  <Collapse.Panel panelKey="1" header="Panel 1">
    <p>Contenido usando sintaxis Collapse.Panel</p>
  </Collapse.Panel>
  <Collapse.Panel panelKey="2" header="Panel 2" extra={<a href="#">Más</a>}>
    <p>Otro panel con contenido extra</p>
  </Collapse.Panel>
  <Collapse.Panel panelKey="3" header="Panel 3" showArrow={false}>
    <p>Panel sin icono de flecha</p>
  </Collapse.Panel>
</Collapse>
```

</details>

---

<details>
<summary><strong>DataDisplay</strong> - Tabla de presentación de datos estructurados</summary>

### DataDisplay

`DataDisplay` muestra datos estructurados en formato de tabla con pares etiqueta-valor. Soporta layouts horizontal y vertical, columnas responsivas, spanning personalizado, estilo bordered y dimensionamiento flexible.

#### Importar

```tsx
import { DataDisplay } from 'j-ui'
```

#### Props

| Prop | Tipo | Por defecto | Descripción |
|------|------|-------------|-------------|
| `items` | `DataDisplayItem[]` | - | Array de elementos de datos (alternativa a usar hijos `DataDisplay.Item`) |
| `title` | `ReactNode` | - | Título mostrado en el encabezado |
| `extra` | `ReactNode` | - | Contenido extra en el encabezado (lado derecho) |
| `bordered` | `boolean` | `false` | Mostrar bordes y fondo en las etiquetas |
| `column` | `number \| Responsive` | `3` | Número de columnas por fila (soporta breakpoints responsivos) |
| `layout` | `DataDisplayLayout` | `'horizontal'` | Modo de layout: `'horizontal'` (pares etiqueta-valor en la misma fila) o `'vertical'` (etiquetas en una fila, valores en otra) |
| `colon` | `boolean` | `true` | Mostrar dos puntos (`:`) después de las etiquetas |
| `size` | `DataDisplaySize` | `'middle'` | Tamaño del display: `'small'`, `'middle'` o `'large'` |
| `labelStyle` | `CSSProperties` | - | Estilo global para todas las etiquetas |
| `contentStyle` | `CSSProperties` | - | Estilo global para todas las celdas de contenido |
| `children` | `ReactNode` | - | Componentes DataDisplay.Item |
| `className` | `string` | - | Nombre de clase del elemento raíz |
| `style` | `CSSProperties` | - | Estilos inline del elemento raíz |
| `classNames` | `DataDisplayClassNames` | - | Nombres de clase semánticos para slots del data display |
| `styles` | `DataDisplayStyles` | - | Estilos inline semánticos para slots del data display |

#### DataDisplayItem

```tsx
interface DataDisplayItem {
  key: string                                          // Identificador único del elemento
  label?: ReactNode                                    // Texto de la etiqueta
  children?: ReactNode                                 // Contenido/valor
  span?: number | Partial<Record<Breakpoint, number>>  // Span de columnas (soporta responsivo)
  labelStyle?: CSSProperties                           // Estilo de etiqueta específico del elemento
  contentStyle?: CSSProperties                         // Estilo de contenido específico del elemento
}
```

#### Props de DataDisplay.Item

```tsx
interface DataDisplayItemProps {
  itemKey: string                                      // Identificador único del elemento (requerido)
  label?: ReactNode                                    // Texto de la etiqueta
  children?: ReactNode                                 // Contenido/valor
  span?: number | Partial<Record<Breakpoint, number>>  // Span de columnas (soporta responsivo)
  labelStyle?: CSSProperties                           // Estilo de etiqueta específico del elemento
  contentStyle?: CSSProperties                         // Estilo de contenido específico del elemento
}
```

#### Breakpoints Responsivos

```tsx
type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

// Valores de breakpoints:
// xs: 0px, sm: 576px, md: 768px, lg: 992px, xl: 1200px, xxl: 1600px

// Ejemplo de uso:
column={{ xs: 1, sm: 2, md: 3, lg: 4 }}
span={{ xs: 1, md: 2 }}
```

#### Configuración de Tamaños

```tsx
type DataDisplaySize = 'large' | 'middle' | 'small'

// Configuraciones de tamaño:
// small:  headerPadding: '0.5rem 0',  cellPadding: '0.375rem 0.75rem', fontSize: '0.8125rem'
// middle: headerPadding: '0.75rem 0', cellPadding: '0.75rem 1rem',     fontSize: '0.875rem'
// large:  headerPadding: '1rem 0',    cellPadding: '1rem 1.5rem',      fontSize: '1rem'
```

#### DOM Semántico

El componente DataDisplay utiliza nombres de clase y estilos semánticos para personalización:

```tsx
type DataDisplaySemanticSlot = 'root' | 'header' | 'title' | 'extra' | 'label' | 'content' | 'table' | 'row'

interface DataDisplayClassNames {
  root?: string
  header?: string
  title?: string
  extra?: string
  label?: string
  content?: string
  table?: string
  row?: string
}

interface DataDisplayStyles {
  root?: CSSProperties
  header?: CSSProperties
  title?: CSSProperties
  extra?: CSSProperties
  label?: CSSProperties
  content?: CSSProperties
  table?: CSSProperties
  row?: CSSProperties
}
```

#### Ejemplos

**Data display básico:**

```tsx
<DataDisplay
  items={[
    { key: '1', label: 'Nombre', children: 'John Doe' },
    { key: '2', label: 'Email', children: 'john@example.com' },
    { key: '3', label: 'Teléfono', children: '+1 234 567 890' },
    { key: '4', label: 'Dirección', children: '123 Main St, Ciudad, País' },
    { key: '5', label: 'Estado', children: 'Activo' },
    { key: '6', label: 'Rol', children: 'Administrador' },
  ]}
/>
```

**Con título y extra:**

```tsx
<DataDisplay
  title="Información de Usuario"
  extra={<a href="#">Editar</a>}
  items={[
    { key: '1', label: 'Usuario', children: 'johndoe' },
    { key: '2', label: 'Email', children: 'john@example.com' },
    { key: '3', label: 'Registro', children: '2024-01-15' },
  ]}
/>
```

**Estilo bordered:**

```tsx
<DataDisplay
  bordered
  items={[
    { key: '1', label: 'Producto', children: 'Laptop' },
    { key: '2', label: 'Precio', children: '$999' },
    { key: '3', label: 'Stock', children: '15 unidades' },
    { key: '4', label: 'Categoría', children: 'Electrónica' },
  ]}
/>
```

**Layout vertical:**

```tsx
<DataDisplay
  layout="vertical"
  bordered
  items={[
    { key: '1', label: 'Q1', children: '$10,000' },
    { key: '2', label: 'Q2', children: '$15,000' },
    { key: '3', label: 'Q3', children: '$12,000' },
    { key: '4', label: 'Q4', children: '$18,000' },
  ]}
/>
```

**Número de columnas personalizado:**

```tsx
<DataDisplay
  column={2}
  items={[
    { key: '1', label: 'Nombre', children: 'John' },
    { key: '2', label: 'Apellido', children: 'Doe' },
    { key: '3', label: 'Edad', children: '30' },
    { key: '4', label: 'Ciudad', children: 'Nueva York' },
  ]}
/>
```

**Columnas responsivas:**

```tsx
<DataDisplay
  column={{ xs: 1, sm: 2, md: 3, lg: 4 }}
  items={[
    { key: '1', label: 'Campo 1', children: 'Valor 1' },
    { key: '2', label: 'Campo 2', children: 'Valor 2' },
    { key: '3', label: 'Campo 3', children: 'Valor 3' },
    { key: '4', label: 'Campo 4', children: 'Valor 4' },
    { key: '5', label: 'Campo 5', children: 'Valor 5' },
    { key: '6', label: 'Campo 6', children: 'Valor 6' },
  ]}
/>
```

**Elemento con span personalizado:**

```tsx
<DataDisplay
  column={3}
  bordered
  items={[
    { key: '1', label: 'Nombre', children: 'John Doe' },
    { key: '2', label: 'Email', children: 'john@example.com' },
    { key: '3', label: 'Teléfono', children: '+1 234 567 890' },
    { key: '4', label: 'Dirección Completa', children: '123 Main Street, Apartamento 4B, Nueva York, NY 10001', span: 3 },
    { key: '5', label: 'Ciudad', children: 'Nueva York' },
    { key: '6', label: 'País', children: 'USA' },
  ]}
/>
```

**Span responsivo:**

```tsx
<DataDisplay
  column={{ xs: 1, md: 3 }}
  bordered
  items={[
    { key: '1', label: 'Título', children: 'Descripción del Producto' },
    { key: '2', label: 'SKU', children: 'ABC-123' },
    { key: '3', label: 'Precio', children: '$99.99' },
    { key: '4', label: 'Descripción', children: 'Esta es una descripción detallada del producto que abarca múltiples columnas en pantallas más grandes.', span: { xs: 1, md: 3 } },
  ]}
/>
```

**Sin dos puntos:**

```tsx
<DataDisplay
  colon={false}
  items={[
    { key: '1', label: 'Temperatura', children: '72°F' },
    { key: '2', label: 'Humedad', children: '45%' },
    { key: '3', label: 'Presión', children: '1013 hPa' },
  ]}
/>
```

**Tamaño pequeño:**

```tsx
<DataDisplay
  size="small"
  bordered
  items={[
    { key: '1', label: 'Compacto', children: 'Tamaño pequeño' },
    { key: '2', label: 'Padding', children: 'Reducido' },
    { key: '3', label: 'Fuente', children: 'Más pequeña' },
  ]}
/>
```

**Tamaño grande:**

```tsx
<DataDisplay
  size="large"
  bordered
  items={[
    { key: '1', label: 'Espacioso', children: 'Tamaño grande' },
    { key: '2', label: 'Padding', children: 'Aumentado' },
    { key: '3', label: 'Fuente', children: 'Más grande' },
  ]}
/>
```

**Estilos personalizados de label/content:**

```tsx
<DataDisplay
  labelStyle={{ fontWeight: 'bold', color: '#1890ff' }}
  contentStyle={{ fontStyle: 'italic' }}
  items={[
    { key: '1', label: 'Personalizado', children: 'Estilo global' },
    { key: '2', label: 'Sobrescribir', children: 'Estilo específico del elemento', contentStyle: { fontStyle: 'normal', color: '#52c41a' } },
  ]}
/>
```

**Usando sintaxis DataDisplay.Item:**

```tsx
<DataDisplay title="Detalles del Producto" bordered column={2}>
  <DataDisplay.Item itemKey="1" label="Nombre del Producto">
    Mouse Inalámbrico
  </DataDisplay.Item>
  <DataDisplay.Item itemKey="2" label="Precio">
    $29.99
  </DataDisplay.Item>
  <DataDisplay.Item itemKey="3" label="Fabricante">
    TechCorp
  </DataDisplay.Item>
  <DataDisplay.Item itemKey="4" label="Garantía">
    2 años
  </DataDisplay.Item>
  <DataDisplay.Item itemKey="5" label="Descripción" span={2}>
    Mouse inalámbrico de alta precisión con diseño ergonómico y larga duración de batería.
  </DataDisplay.Item>
</DataDisplay>
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
<summary><strong>Empty</strong> - Marcador de posición de estado vacío con animación opcional de tumbleweed</summary>

### Empty

`Empty` muestra un marcador de posición para áreas de contenido vacías con una ilustración, texto descriptivo y botones de acción opcionales. Presenta un efecto único de tumbleweed animado para agregar personalidad a los estados vacíos.

#### Importar

```tsx
import { Empty } from 'j-ui'
```

#### Props

| Prop | Tipo | Por defecto | Descripción |
|------|------|-------------|-------------|
| `image` | `ReactNode` | Ilustración integrada | Imagen personalizada (URL string o nodo React). Por defecto usa ilustración simple integrada |
| `imageStyle` | `CSSProperties` | - | Estilo para el contenedor de la imagen |
| `description` | `ReactNode \| false` | `'No data'` | Texto descriptivo debajo de la imagen. Establecer como `false` para ocultar |
| `tumbleweed` | `boolean` | `false` | Mostrar tumbleweed animado rodando a través del estado vacío |
| `iconColor` | `string` | `tokens.colorBorder` | Color de trazo para el icono SVG integrado (solo aplica cuando se usa imagen predeterminada) |
| `tumbleweedColor` | `string` | `tokens.colorTextSubtle` | Color de relleno para el SVG del tumbleweed |
| `windColor` | `string` | `tokens.colorTextSubtle` | Color de trazo para las líneas de viento |
| `shadowColor` | `string` | `tokens.colorTextSubtle` | Color de fondo para la sombra del tumbleweed |
| `children` | `ReactNode` | - | Contenido del footer (ej. botones de acción) |
| `className` | `string` | - | Nombre de clase del elemento raíz |
| `style` | `CSSProperties` | - | Estilos inline del elemento raíz |
| `classNames` | `EmptyClassNames` | - | Nombres de clase semánticos para slots de empty |
| `styles` | `EmptyStyles` | - | Estilos inline semánticos para slots de empty |

#### Propiedades Estáticas

```tsx
Empty.PRESENTED_IMAGE_SIMPLE // Componente de ilustración simple integrado
```

#### DOM Semántico

El componente Empty utiliza nombres de clase y estilos semánticos para personalización:

```tsx
type EmptySemanticSlot = 'root' | 'image' | 'description' | 'footer'

interface EmptyClassNames {
  root?: string
  image?: string
  description?: string
  footer?: string
}

interface EmptyStyles {
  root?: CSSProperties
  image?: CSSProperties
  description?: CSSProperties
  footer?: CSSProperties
}
```

#### Ejemplos

**Estado vacío básico:**

```tsx
<Empty />
```

**Descripción personalizada:**

```tsx
<Empty description="No se encontraron elementos" />
```

**Sin descripción:**

```tsx
<Empty description={false} />
```

**Imagen personalizada (URL):**

```tsx
<Empty
  image="https://via.placeholder.com/150"
  description="Sin resultados"
/>
```

**Imagen personalizada (ReactNode):**

```tsx
<Empty
  image={
    <div style={{ fontSize: '4rem', opacity: 0.3 }}>
      📦
    </div>
  }
  description="Caja vacía"
/>
```

**Con botón de acción:**

```tsx
<Empty description="Aún no hay tareas">
  <Button type="primary">Crear Tarea</Button>
</Empty>
```

**Animación de tumbleweed:**

```tsx
<Empty
  tumbleweed
  description="No hay nada que ver aquí..."
/>
```

**Color de icono personalizado:**

```tsx
<Empty
  iconColor="#1890ff"
  description="Icono con color personalizado"
/>
```

**Colores personalizados del tumbleweed:**

```tsx
<Empty
  tumbleweed
  tumbleweedColor="#8B4513"
  windColor="#A0522D"
  shadowColor="#D2691E"
  description="Tema personalizado de tumbleweed"
/>
```

**Usando constante de imagen integrada:**

```tsx
<Empty
  image={Empty.PRESENTED_IMAGE_SIMPLE}
  description="Usando explícitamente la imagen predeterminada"
/>
```

**Múltiples botones de acción:**

```tsx
<Empty description="Tu carrito está vacío">
  <div style={{ display: 'flex', gap: '0.5rem' }}>
    <Button>Explorar Productos</Button>
    <Button type="primary">Ver Lista de Deseos</Button>
  </div>
</Empty>
```

**Estilizado personalizado:**

```tsx
<Empty
  description="Estado vacío estilizado"
  style={{ padding: '4rem' }}
  styles={{
    description: { color: '#1890ff', fontSize: '1rem' },
    footer: { marginTop: '2rem' }
  }}
>
  <Button>Comenzar</Button>
</Empty>
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
<summary><strong>Input</strong> - Campos de entrada de texto con múltiples variantes</summary>

### Input

Un componente de entrada integral con soporte para entrada de texto, áreas de texto, búsqueda, contraseña y campos de contraseña de un solo uso (OTP).

#### Importar

```tsx
import { Input } from 'j-ui'
```

#### Props de Input

| Prop | Tipo | Por Defecto | Descripción |
|------|------|-------------|-------------|
| `value` | `string` | — | Valor controlado |
| `defaultValue` | `string` | — | Valor inicial no controlado |
| `placeholder` | `string` | — | Texto de marcador de posición |
| `type` | `string` | `'text'` | Tipo de input nativo |
| `disabled` | `boolean` | `false` | Deshabilitar input |
| `readOnly` | `boolean` | `false` | Input de solo lectura |
| `size` | `'small' \| 'middle' \| 'large'` | `'middle'` | Tamaño del input |
| `variant` | `'outlined' \| 'filled' \| 'borderless' \| 'underlined'` | `'outlined'` | Variante de estilo visual |
| `status` | `'error' \| 'warning'` | — | Estado de validación |
| `prefix` | `ReactNode` | — | Contenido antes del texto de entrada |
| `suffix` | `ReactNode` | — | Contenido después del texto de entrada |
| `addonBefore` | `ReactNode` | — | Contenido antes del contenedor de entrada |
| `addonAfter` | `ReactNode` | — | Contenido después del contenedor de entrada |
| `allowClear` | `boolean \| { clearIcon?: ReactNode }` | `false` | Mostrar botón de limpiar |
| `showCount` | `boolean` | `false` | Mostrar contador de caracteres |
| `count` | `CountConfig` | — | Configuración avanzada del contador |
| `maxLength` | `number` | — | Longitud máxima de caracteres |
| `onChange` | `(e: ChangeEvent) => void` | — | Callback de cambio de valor |
| `onPressEnter` | `(e: KeyboardEvent) => void` | — | Callback de tecla Enter |
| `onFocus` | `(e: FocusEvent) => void` | — | Callback de focus |
| `onBlur` | `(e: FocusEvent) => void` | — | Callback de blur |
| `classNames` | `SemanticClassNames<'root' \| 'wrapper' \| 'input' \| 'prefix' \| 'suffix' \| 'addonBefore' \| 'addonAfter' \| 'clear' \| 'count'>` | — | Nombres de clase semánticos |
| `styles` | `SemanticStyles<'root' \| 'wrapper' \| 'input' \| 'prefix' \| 'suffix' \| 'addonBefore' \| 'addonAfter' \| 'clear' \| 'count'>` | — | Estilos inline semánticos |

#### Props de Input.TextArea

Extiende props de `Input` con:

| Prop | Tipo | Por Defecto | Descripción |
|------|------|-------------|-------------|
| `autoSize` | `boolean \| { minRows?: number; maxRows?: number }` | `false` | Auto-redimensionar según contenido |
| `onResize` | `(size: { width: number; height: number }) => void` | — | Callback de redimensionamiento |

#### Props de Input.Search

Extiende props de `Input` con:

| Prop | Tipo | Por Defecto | Descripción |
|------|------|-------------|-------------|
| `enterButton` | `boolean \| ReactNode` | `false` | Mostrar botón de búsqueda |
| `loading` | `boolean` | `false` | Mostrar estado de carga |
| `onSearch` | `(value: string, e: Event) => void` | — | Callback de búsqueda |

#### Props de Input.Password

Extiende props de `Input` con:

| Prop | Tipo | Por Defecto | Descripción |
|------|------|-------------|-------------|
| `visibilityToggle` | `boolean` | `true` | Mostrar botón de alternar visibilidad |
| `iconRender` | `(visible: boolean) => ReactNode` | — | Iconos de visibilidad personalizados |

#### Props de Input.OTP

| Prop | Tipo | Por Defecto | Descripción |
|------|------|-------------|-------------|
| `value` | `string` | — | Valor controlado |
| `defaultValue` | `string` | — | Valor inicial no controlado |
| `onChange` | `(value: string) => void` | — | Callback de cambio de valor |
| `length` | `number` | `6` | Número de dígitos OTP |
| `formatter` | `(value: string) => string` | — | Formatear valor de entrada |
| `mask` | `boolean \| string` | `false` | Enmascarar caracteres (true = '•', o carácter personalizado) |
| `disabled` | `boolean` | `false` | Deshabilitar todos los inputs |
| `status` | `'error' \| 'warning'` | — | Estado de validación |
| `size` | `'small' \| 'middle' \| 'large'` | `'middle'` | Tamaño del input |
| `variant` | `'outlined' \| 'filled' \| 'borderless' \| 'underlined'` | `'outlined'` | Variante de estilo visual |

#### CountConfig

| Prop | Tipo | Por Defecto | Descripción |
|------|------|-------------|-------------|
| `max` | `number` | — | Conteo máximo a mostrar |
| `exceedFormatter` | `(count: number, max: number) => ReactNode` | — | Formateador personalizado al exceder el máximo |
| `show` | `boolean \| ((args: { value: string; count: number; maxLength?: number }) => boolean)` | — | Si mostrar el contador |
| `strategy` | `(text: string) => number` | — | Estrategia de conteo personalizada |

#### InputRef

| Método | Descripción |
|--------|-------------|
| `focus(options?)` | Enfocar el input. Opciones: `{ preventScroll?: boolean; cursor?: 'start' \| 'end' \| 'all' }` |
| `blur()` | Quitar el foco del input |
| `input` | Referencia al elemento nativo input/textarea |

#### Configuración de Tamaños

| Tamaño | Altura | Tamaño de Fuente |
|--------|--------|------------------|
| `small` | 1.5rem (24px) | 0.75rem (12px) |
| `middle` | 2rem (32px) | 0.875rem (14px) |
| `large` | 2.5rem (40px) | 1rem (16px) |

#### Estilos de Variantes

- **outlined** - Estilo de borde predeterminado
- **filled** - Fondo relleno con borde sutil
- **borderless** - Sin borde ni fondo
- **underlined** - Solo borde inferior

#### DOM Semántico

##### Input / TextArea / Search / Password

| Slot | Descripción |
|------|-------------|
| `root` | Elemento contenedor externo |
| `wrapper` | Contenedor de input con prefix/suffix |
| `input` | Elemento nativo input/textarea |
| `prefix` | Contenedor de contenido prefijo |
| `suffix` | Contenedor de contenido sufijo |
| `addonBefore` | Contenedor de addon antes |
| `addonAfter` | Contenedor de addon después |
| `clear` | Botón de limpiar |
| `count` | Visualización de contador de caracteres |

##### Input.OTP

| Slot | Descripción |
|------|-------------|
| `root` | Elemento contenedor externo |
| `input` | Elemento individual de input OTP |

#### Ejemplos

```tsx
// Input básico
<Input placeholder="Ingrese texto" />

// Input controlado
const [value, setValue] = useState('')
<Input value={value} onChange={(e) => setValue(e.target.value)} />

// Diferentes tamaños
<Input size="small" placeholder="Pequeño" />
<Input size="middle" placeholder="Medio (predeterminado)" />
<Input size="large" placeholder="Grande" />

// Variantes
<Input variant="outlined" placeholder="Outlined (predeterminado)" />
<Input variant="filled" placeholder="Relleno" />
<Input variant="borderless" placeholder="Sin borde" />
<Input variant="underlined" placeholder="Subrayado" />

// Estados de validación
<Input status="error" placeholder="Estado de error" />
<Input status="warning" placeholder="Estado de advertencia" />

// Con prefix/suffix
<Input prefix={<SearchIcon />} placeholder="Buscar" />
<Input suffix="@example.com" placeholder="Email" />
<Input prefix="https://" suffix=".com" placeholder="sitio web" />

// Con addons
<Input addonBefore="https://" addonAfter=".com" placeholder="sitio web" />
<Input addonBefore={<SelectIcon />} placeholder="URL" />

// Permitir limpiar
<Input allowClear placeholder="Se puede limpiar" />
<Input allowClear={{ clearIcon: <CustomIcon /> }} />

// Contador de caracteres
<Input showCount maxLength={50} placeholder="Máximo 50 caracteres" />
<Input
  count={{
    max: 100,
    show: true,
    exceedFormatter: (count, max) => `${count}/${max} (¡excedido!)`,
  }}
  placeholder="Conteo avanzado"
/>

// Deshabilitado y solo lectura
<Input disabled placeholder="Deshabilitado" />
<Input readOnly value="Valor de solo lectura" />

// Con ref (gestión de foco)
const inputRef = useRef<InputRef>(null)
<Input ref={inputRef} />
// Más tarde: inputRef.current?.focus({ cursor: 'end' })

// TextArea
<Input.TextArea placeholder="Ingrese múltiples líneas" />
<Input.TextArea rows={4} placeholder="4 filas fijas" />
<Input.TextArea autoSize placeholder="Auto-redimensionar" />
<Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
<Input.TextArea showCount maxLength={200} />

// Búsqueda
<Input.Search placeholder="Buscar" onSearch={(value) => console.log(value)} />
<Input.Search enterButton placeholder="Buscar con botón" />
<Input.Search enterButton="Ir" placeholder="Texto de botón personalizado" />
<Input.Search enterButton={<SearchIcon />} />
<Input.Search loading placeholder="Cargando..." />

// Contraseña
<Input.Password placeholder="Ingrese contraseña" />
<Input.Password visibilityToggle={false} placeholder="Sin alternar" />
<Input.Password
  iconRender={(visible) => visible ? <EyeIcon /> : <EyeOffIcon />}
  placeholder="Iconos personalizados"
/>

// OTP
<Input.OTP length={6} onChange={(value) => console.log(value)} />
<Input.OTP length={4} mask />
<Input.OTP length={6} mask="*" />
<Input.OTP
  length={6}
  formatter={(value) => value.toUpperCase()}
  placeholder="Solo A-Z"
/>

// Estilizado semántico
<Input
  placeholder="Input estilizado"
  classNames={{
    root: 'custom-root',
    input: 'custom-input',
  }}
  styles={{
    input: { fontWeight: 600 },
    wrapper: { borderColor: 'blue' },
  }}
/>
```

</details>

---

<details>
<summary><strong>Image</strong> - Imagen con vista previa, zoom y soporte de galería</summary>

### Image

`Image` muestra imágenes con estados de carga, manejo de errores, soporte de fallback y una vista previa interactiva con controles de zoom, rotación, volteo y desplazamiento. Incluye `Image.PreviewGroup` para crear galerías de imágenes con navegación.

#### Importar

```tsx
import { Image } from 'j-ui'
```

#### Props

| Prop | Tipo | Por defecto | Descripción |
|------|------|-------------|-------------|
| `src` | `string` | - | URL de la fuente de la imagen |
| `alt` | `string` | - | Texto alternativo para accesibilidad |
| `width` | `string \| number` | - | Ancho de la imagen (valor CSS) |
| `height` | `string \| number` | - | Alto de la imagen (valor CSS) |
| `fallback` | `string` | - | URL de imagen de respaldo cuando falla la carga principal |
| `placeholder` | `ReactNode \| boolean` | - | Marcador de posición de carga. `true` = efecto shimmer integrado |
| `preview` | `boolean \| PreviewConfig` | `true` | Configuración de vista previa. `false` para deshabilitar |
| `onError` | `(e: SyntheticEvent) => void` | - | Callback cuando falla la carga de imagen |
| `className` | `string` | - | Nombre de clase del elemento raíz |
| `style` | `CSSProperties` | - | Estilos inline del elemento raíz |
| `classNames` | `ImageClassNames` | - | Nombres de clase semánticos para slots de imagen |
| `styles` | `ImageStyles` | - | Estilos inline semánticos para slots de imagen |

#### PreviewConfig

```tsx
interface PreviewConfig {
  open?: boolean                          // Estado abierto de vista previa controlado
  src?: string                            // Fuente de vista previa personalizada (ej., alta resolución)
  onOpenChange?: (open: boolean) => void  // Callback cuando cambia el estado de vista previa
  minScale?: number                       // Escala de zoom mínima (predeterminado: 1)
  maxScale?: number                       // Escala de zoom máxima (predeterminado: 50)
  scaleStep?: number                      // Multiplicador de paso de zoom (predeterminado: 0.5)
}
```

#### Props de Image.PreviewGroup

| Prop | Tipo | Por defecto | Descripción |
|------|------|-------------|-------------|
| `items` | `(string \| { src: string; alt?: string })[]` | - | Array declarativo de imágenes (alternativa a children) |
| `preview` | `boolean \| PreviewGroupConfig` | `true` | Configuración de vista previa del grupo. `false` para deshabilitar |
| `children` | `ReactNode` | - | Componentes Image para incluir en la galería |

#### PreviewGroupConfig

```tsx
interface PreviewGroupConfig extends PreviewConfig {
  current?: number                                      // Índice de imagen actual controlado
  onChange?: (current: number, prev: number) => void    // Callback cuando cambia la imagen
  countRender?: (current: number, total: number) => ReactNode // Renderizador de contador personalizado
}
```

#### Características de Vista Previa

La superposición de vista previa incluye:
- **Zoom**: Rueda del mouse, teclado (+/-), o botones de barra de herramientas
- **Desplazamiento**: Arrastra para desplazar cuando está ampliado
- **Rotación**: Rotación de 90° izquierda/derecha
- **Volteo**: Volteo horizontal y vertical
- **Restablecer**: Restablecer todas las transformaciones
- **Navegación** (grupos): Prev/next con flechas o teclado (←/→)
- **Teclado**: Escape para cerrar, teclas de flecha para navegación

#### DOM Semántico

El componente Image utiliza nombres de clase y estilos semánticos para personalización:

```tsx
type ImageSemanticSlot = 'root' | 'image' | 'mask'

interface ImageClassNames {
  root?: string
  image?: string
  mask?: string   // Máscara hover de vista previa
}

interface ImageStyles {
  root?: CSSProperties
  image?: CSSProperties
  mask?: CSSProperties
}
```

#### Ejemplos

**Imagen básica:**

```tsx
<Image
  src="https://via.placeholder.com/400x300"
  alt="Marcador de posición"
/>
```

**Con dimensiones:**

```tsx
<Image
  src="https://via.placeholder.com/400x300"
  alt="Tamaño fijo"
  width={400}
  height={300}
/>
```

**Imagen de respaldo:**

```tsx
<Image
  src="https://broken-url.example/image.jpg"
  fallback="https://via.placeholder.com/400x300?text=Fallback"
  alt="Con respaldo"
  width={400}
  height={300}
/>
```

**Marcador de posición personalizado:**

```tsx
<Image
  src="https://via.placeholder.com/400x300"
  placeholder={<div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>}
  width={400}
  height={300}
/>
```

**Marcador de posición shimmer integrado:**

```tsx
<Image
  src="https://via.placeholder.com/400x300"
  placeholder={true}
  width={400}
  height={300}
/>
```

**Deshabilitar vista previa:**

```tsx
<Image
  src="https://via.placeholder.com/400x300"
  preview={false}
  width={400}
  height={300}
/>
```

**Vista previa controlada:**

```tsx
const [open, setOpen] = useState(false)

<div>
  <Button onClick={() => setOpen(true)}>Abrir Vista Previa</Button>
  <Image
    src="https://via.placeholder.com/800x600"
    preview={{
      open,
      onOpenChange: setOpen
    }}
    width={400}
    height={300}
  />
</div>
```

**Fuente de vista previa personalizada (alta resolución):**

```tsx
<Image
  src="https://via.placeholder.com/400x300"
  preview={{
    src: "https://via.placeholder.com/1920x1080"
  }}
  width={400}
  height={300}
/>
```

**Configuración de zoom personalizada:**

```tsx
<Image
  src="https://via.placeholder.com/800x600"
  preview={{
    minScale: 0.5,
    maxScale: 10,
    scaleStep: 0.25
  }}
  width={400}
  height={300}
/>
```

**Grupo de vista previa con items:**

```tsx
<Image.PreviewGroup
  items={[
    "https://via.placeholder.com/800x600/FF6B6B/FFFFFF?text=Imagen+1",
    "https://via.placeholder.com/800x600/4ECDC4/FFFFFF?text=Imagen+2",
    "https://via.placeholder.com/800x600/45B7D1/FFFFFF?text=Imagen+3",
    { src: "https://via.placeholder.com/800x600/FFA07A/FFFFFF?text=Imagen+4", alt: "Cuarta imagen" }
  ]}
/>
```

**Grupo de vista previa con children:**

```tsx
<Image.PreviewGroup>
  <Image src="https://via.placeholder.com/300x200/FF6B6B" width={300} height={200} />
  <Image src="https://via.placeholder.com/300x200/4ECDC4" width={300} height={200} />
  <Image src="https://via.placeholder.com/300x200/45B7D1" width={300} height={200} />
  <Image src="https://via.placeholder.com/300x200/FFA07A" width={300} height={200} />
</Image.PreviewGroup>
```

**Navegación de grupo controlada:**

```tsx
const [current, setCurrent] = useState(0)

<Image.PreviewGroup
  preview={{
    current,
    onChange: (curr, prev) => {
      console.log(`Cambiado de ${prev} a ${curr}`)
      setCurrent(curr)
    }
  }}
  items={[
    "https://via.placeholder.com/800x600/FF6B6B",
    "https://via.placeholder.com/800x600/4ECDC4",
    "https://via.placeholder.com/800x600/45B7D1"
  ]}
/>
```

**Renderizado de contador personalizado:**

```tsx
<Image.PreviewGroup
  preview={{
    countRender: (current, total) => (
      <span style={{ fontWeight: 'bold' }}>
        {current} de {total}
      </span>
    )
  }}
  items={[
    "https://via.placeholder.com/800x600/FF6B6B",
    "https://via.placeholder.com/800x600/4ECDC4",
    "https://via.placeholder.com/800x600/45B7D1"
  ]}
/>
```

**Grupo mixto con diferentes fuentes:**

```tsx
<Image.PreviewGroup>
  <Image
    src="https://via.placeholder.com/300x200/FF6B6B"
    preview={{ src: "https://via.placeholder.com/1920x1080/FF6B6B" }}
    width={300}
    height={200}
  />
  <Image
    src="https://via.placeholder.com/300x200/4ECDC4"
    fallback="https://via.placeholder.com/300x200/999999?text=Error"
    width={300}
    height={200}
  />
  <Image
    src="https://via.placeholder.com/300x200/45B7D1"
    placeholder={true}
    width={300}
    height={200}
  />
</Image.PreviewGroup>
```

</details>

---

<details>
<summary><strong>InputNumber</strong> - Entrada numérica con controles de incremento</summary>

### InputNumber

Un componente de entrada numérica con controles de incremento/decremento, navegación por teclado y opciones avanzadas de formato.

#### Importar

```tsx
import { InputNumber } from 'j-ui'
```

#### Props

| Prop | Tipo | Por Defecto | Descripción |
|------|------|-------------|-------------|
| `value` | `number \| string \| null` | — | Valor controlado |
| `defaultValue` | `number \| string \| null` | — | Valor inicial no controlado |
| `onChange` | `(value: number \| string \| null) => void` | — | Callback de cambio de valor |
| `onStep` | `(value: number, info: { offset: number; type: 'up' \| 'down' }) => void` | — | Callback de paso (al incrementar/decrementar) |
| `onPressEnter` | `(e: KeyboardEvent) => void` | — | Callback de tecla Enter |
| `onFocus` | `(e: FocusEvent) => void` | — | Callback de focus |
| `onBlur` | `(e: FocusEvent) => void` | — | Callback de blur |
| `min` | `number` | `-Infinity` | Valor mínimo |
| `max` | `number` | `Infinity` | Valor máximo |
| `step` | `number` | `1` | Valor de incremento/decremento |
| `precision` | `number` | — | Precisión decimal (auto-inferida del step si no se especifica) |
| `formatter` | `(value: string \| number, info: { userTyping: boolean; input: string }) => string` | — | Formateador personalizado para visualización |
| `parser` | `(displayValue: string) => number \| string` | — | Parser para convertir valor de visualización a numérico |
| `controls` | `boolean \| { upIcon?: ReactNode; downIcon?: ReactNode }` | `true` | Mostrar controles de paso (botones arriba/abajo) |
| `keyboard` | `boolean` | `true` | Habilitar navegación por teclado (flechas) |
| `changeOnWheel` | `boolean` | `false` | Habilitar rueda del ratón para cambiar valor cuando está enfocado |
| `changeOnBlur` | `boolean` | `true` | Confirmar valor al perder el foco (vs. al escribir) |
| `stringMode` | `boolean` | `false` | Retornar valor como string con precisión exacta |
| `decimalSeparator` | `string` | — | Separador decimal personalizado (ej. ',') |
| `placeholder` | `string` | — | Texto de marcador de posición |
| `disabled` | `boolean` | `false` | Deshabilitar input |
| `readOnly` | `boolean` | `false` | Input de solo lectura |
| `id` | `string` | — | Atributo HTML id |
| `autoFocus` | `boolean` | `false` | Auto-enfocar al montar |
| `name` | `string` | — | Atributo HTML name |
| `tabIndex` | `number` | — | Índice de tabulación |
| `size` | `'small' \| 'middle' \| 'large'` | `'middle'` | Tamaño del input |
| `variant` | `'outlined' \| 'filled' \| 'borderless' \| 'underlined'` | `'outlined'` | Variante de estilo visual |
| `status` | `'error' \| 'warning'` | — | Estado de validación |
| `prefix` | `ReactNode` | — | Contenido antes del texto de entrada |
| `suffix` | `ReactNode` | — | Contenido después del texto (antes de controles) |
| `addonBefore` | `ReactNode` | — | Contenido antes del contenedor de entrada |
| `addonAfter` | `ReactNode` | — | Contenido después del contenedor de entrada |
| `classNames` | `SemanticClassNames<'root' \| 'input' \| 'prefix' \| 'suffix' \| 'handler' \| 'handlerUp' \| 'handlerDown' \| 'addon'>` | — | Nombres de clase semánticos |
| `styles` | `SemanticStyles<'root' \| 'input' \| 'prefix' \| 'suffix' \| 'handler' \| 'handlerUp' \| 'handlerDown' \| 'addon'>` | — | Estilos inline semánticos |

#### InputNumberRef

| Método | Descripción |
|--------|-------------|
| `focus(options?)` | Enfocar el input. Opciones: `{ preventScroll?: boolean; cursor?: 'start' \| 'end' \| 'all' }` |
| `blur()` | Quitar el foco del input |
| `input` | Referencia al elemento nativo input |
| `nativeElement` | Referencia al elemento raíz |

#### Configuración de Tamaños

| Tamaño | Altura | Tamaño de Fuente |
|--------|--------|------------------|
| `small` | 1.5rem (24px) | 0.75rem (12px) |
| `middle` | 2rem (32px) | 0.875rem (14px) |
| `large` | 2.5rem (40px) | 1rem (16px) |

#### Estilos de Variantes

- **outlined** - Estilo de borde predeterminado
- **filled** - Fondo relleno con borde sutil
- **borderless** - Sin borde ni fondo
- **underlined** - Solo borde inferior

#### DOM Semántico

| Slot | Descripción |
|------|-------------|
| `root` | Elemento contenedor externo |
| `input` | Contenedor de input con borde/fondo |
| `prefix` | Contenedor de contenido prefijo |
| `suffix` | Contenedor de contenido sufijo |
| `handler` | Contenedor de controles de paso |
| `handlerUp` | Botón de incremento |
| `handlerDown` | Botón de decremento |
| `addon` | Contenedor de addon (antes/después) |

#### Ejemplos

```tsx
// Básico
<InputNumber placeholder="Ingrese número" />

// Controlado
const [value, setValue] = useState<number | null>(0)
<InputNumber value={value} onChange={setValue} />

// Min/max/step
<InputNumber min={0} max={100} step={5} defaultValue={10} />
<InputNumber min={0} max={1} step={0.1} defaultValue={0.5} />

// Precisión
<InputNumber precision={2} defaultValue={3.14159} />
<InputNumber step={0.01} defaultValue={1.5} /> // Precisión automática del step

// Diferentes tamaños
<InputNumber size="small" placeholder="Pequeño" />
<InputNumber size="middle" placeholder="Medio (predeterminado)" />
<InputNumber size="large" placeholder="Grande" />

// Variantes
<InputNumber variant="outlined" placeholder="Outlined (predeterminado)" />
<InputNumber variant="filled" placeholder="Relleno" />
<InputNumber variant="borderless" placeholder="Sin borde" />
<InputNumber variant="underlined" placeholder="Subrayado" />

// Estados
<InputNumber status="error" placeholder="Estado de error" />
<InputNumber status="warning" placeholder="Estado de advertencia" />

// Con prefix/suffix
<InputNumber prefix="$" placeholder="Precio" />
<InputNumber suffix="kg" placeholder="Peso" />
<InputNumber prefix="$" suffix="USD" defaultValue={100} />

// Con addons
<InputNumber addonBefore="Precio" addonAfter="USD" />
<InputNumber addonBefore="$" addonAfter=".00" />

// Sin controles
<InputNumber controls={false} placeholder="Sin botones" />

// Iconos de control personalizados
<InputNumber
  controls={{
    upIcon: <PlusIcon />,
    downIcon: <MinusIcon />,
  }}
/>

// Navegación por teclado
<InputNumber keyboard placeholder="Use flechas del teclado" />

// Rueda del ratón (cuando está enfocado)
<InputNumber changeOnWheel placeholder="Enfoque y desplace" />

// Cambio al perder foco vs al escribir
<InputNumber changeOnBlur={false} placeholder="Actualiza al escribir" />

// Modo string (para precisión exacta)
<InputNumber
  stringMode
  precision={10}
  onChange={(val) => console.log(typeof val)} // "string"
/>

// Separador decimal personalizado
<InputNumber decimalSeparator="," placeholder="Formato europeo" />

// Formateador/parser personalizado (ej. moneda)
<InputNumber
  formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
  defaultValue={1000000}
/>

// Porcentaje
<InputNumber
  min={0}
  max={100}
  formatter={(value) => `${value}%`}
  parser={(value) => value.replace('%', '')}
  defaultValue={50}
/>

// Deshabilitado y solo lectura
<InputNumber disabled defaultValue={42} />
<InputNumber readOnly value={42} />

// Con ref (gestión de foco)
const inputRef = useRef<InputNumberRef>(null)
<InputNumber ref={inputRef} />
// Más tarde: inputRef.current?.focus({ cursor: 'end' })

// Callback de paso
<InputNumber
  onStep={(value, info) => {
    console.log(`Nuevo valor: ${value}, offset: ${info.offset}, tipo: ${info.type}`)
  }}
/>

// Estilizado semántico
<InputNumber
  classNames={{
    root: 'custom-root',
    input: 'custom-input',
    handler: 'custom-handler',
  }}
  styles={{
    input: { borderColor: 'blue' },
    handlerUp: { color: 'green' },
    handlerDown: { color: 'red' },
  }}
/>
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
<summary><strong>Mention</strong> - Textarea con autocompletado de @menciones</summary>

### Mention

Un componente de textarea con detección de menciones y dropdown de autocompletado. Detecta disparadores de mención (como @, #) y muestra sugerencias filtrables.

#### Importar

```tsx
import { Mention } from 'j-ui'
```

#### Props

| Prop | Tipo | Por Defecto | Descripción |
|------|------|-------------|-------------|
| `value` | `string` | — | Valor controlado |
| `defaultValue` | `string` | `''` | Valor inicial no controlado |
| `onChange` | `(text: string) => void` | — | Callback de cambio de valor |
| `onSelect` | `(option: MentionOption, prefix: string) => void` | — | Callback al seleccionar opción |
| `onSearch` | `(text: string, prefix: string) => void` | — | Callback de búsqueda (se activa al detectar mención) |
| `onFocus` | `(e: FocusEvent) => void` | — | Callback de focus |
| `onBlur` | `(e: FocusEvent) => void` | — | Callback de blur |
| `onPopupScroll` | `(e: UIEvent) => void` | — | Callback de scroll del dropdown |
| `options` | `MentionOption[]` | `[]` | Opciones de mención disponibles |
| `prefix` | `string \| string[]` | `'@'` | Carácter(es) disparador de mención |
| `split` | `string` | `' '` | Carácter separador después de mención |
| `filterOption` | `false \| ((input: string, option: MentionOption) => boolean)` | `true` | Función de filtro o false para deshabilitar filtrado |
| `validateSearch` | `(text: string, props: MentionProps) => boolean` | — | Validar texto de búsqueda antes de mostrar dropdown |
| `notFoundContent` | `ReactNode` | `'No matches'` | Contenido cuando no hay coincidencias (null para ocultar) |
| `placement` | `'top' \| 'bottom'` | `'bottom'` | Ubicación del dropdown (auto-flip cuando sea necesario) |
| `allowClear` | `boolean` | `false` | Mostrar botón de limpiar |
| `placeholder` | `string` | — | Texto de marcador de posición |
| `disabled` | `boolean` | `false` | Deshabilitar input |
| `readOnly` | `boolean` | `false` | Input de solo lectura |
| `id` | `string` | — | Atributo HTML id |
| `autoFocus` | `boolean` | `false` | Auto-enfocar al montar |
| `rows` | `number` | `1` | Número inicial de filas |
| `autoSize` | `boolean \| { minRows?: number; maxRows?: number }` | `false` | Auto-redimensionar según contenido |
| `resize` | `boolean` | `false` | Permitir redimensionamiento manual (cuando autoSize es false) |
| `size` | `'small' \| 'middle' \| 'large'` | `'middle'` | Tamaño del input |
| `variant` | `'outlined' \| 'filled' \| 'borderless' \| 'underlined'` | `'outlined'` | Variante de estilo visual |
| `status` | `'error' \| 'warning'` | — | Estado de validación |
| `classNames` | `SemanticClassNames<'root' \| 'textarea' \| 'dropdown' \| 'option'>` | — | Nombres de clase semánticos |
| `styles` | `SemanticStyles<'root' \| 'textarea' \| 'dropdown' \| 'option'>` | — | Estilos inline semánticos |

#### MentionOption

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `value` | `string` | Valor de opción (insertado en texto) |
| `label` | `ReactNode` | Etiqueta de visualización (por defecto es value) |
| `disabled` | `boolean` | Deshabilitar esta opción |

#### MentionRef

| Método | Descripción |
|--------|-------------|
| `focus(options?)` | Enfocar el textarea. Opciones: `{ preventScroll?: boolean; cursor?: 'start' \| 'end' \| 'all' }` |
| `blur()` | Quitar el foco del textarea |
| `textarea` | Referencia al elemento nativo textarea |
| `nativeElement` | Referencia al elemento raíz |

#### Configuración de Tamaños

| Tamaño | Altura | Tamaño de Fuente | Altura de Línea |
|--------|--------|------------------|-----------------|
| `small` | 1.5rem (24px) | 0.75rem (12px) | 1.125rem |
| `middle` | 2rem (32px) | 0.875rem (14px) | 1.375rem |
| `large` | 2.5rem (40px) | 1rem (16px) | 1.5rem |

#### Estilos de Variantes

- **outlined** - Estilo de borde predeterminado
- **filled** - Fondo relleno con borde sutil
- **borderless** - Sin borde ni fondo
- **underlined** - Solo borde inferior

#### DOM Semántico

| Slot | Descripción |
|------|-------------|
| `root` | Elemento contenedor externo |
| `textarea` | Elemento nativo textarea |
| `dropdown` | Contenedor del dropdown |
| `option` | Elemento de opción individual |

#### Ejemplos

```tsx
// Uso básico
const options = [
  { value: 'alice', label: 'Alice Johnson' },
  { value: 'bob', label: 'Bob Smith' },
  { value: 'charlie', label: 'Charlie Davis' },
]
<Mention options={options} placeholder="Escribe @ para mencionar" />

// Controlado
const [value, setValue] = useState('')
<Mention value={value} onChange={setValue} options={options} />

// Múltiples prefijos (@ para usuarios, # para tags)
const userOptions = [
  { value: 'alice', label: '@Alice' },
  { value: 'bob', label: '@Bob' },
]
const tagOptions = [
  { value: 'urgente', label: '#urgente' },
  { value: 'importante', label: '#importante' },
]
<Mention
  prefix={['@', '#']}
  options={[...userOptions, ...tagOptions]}
  onSearch={(text, prefix) => {
    if (prefix === '@') loadUsers(text)
    if (prefix === '#') loadTags(text)
  }}
/>

// Carácter separador personalizado
<Mention
  options={options}
  prefix="@"
  split=" "  // Por defecto: espacio después de mención
/>

// Filtrado personalizado
<Mention
  options={options}
  filterOption={(input, option) => {
    return option.value.toLowerCase().startsWith(input.toLowerCase())
  }}
/>

// Deshabilitar filtrado (control manual)
<Mention
  options={filteredOptions}
  filterOption={false}
  onSearch={(text) => setFilteredOptions(customFilter(text))}
/>

// Validar búsqueda (longitud mínima, regex, etc.)
<Mention
  options={options}
  validateSearch={(text) => text.length >= 2}
  placeholder="Escribe @ + al menos 2 caracteres"
/>

// Diferentes tamaños
<Mention size="small" options={options} />
<Mention size="middle" options={options} />
<Mention size="large" options={options} />

// Variantes
<Mention variant="outlined" options={options} />
<Mention variant="filled" options={options} />
<Mention variant="borderless" options={options} />
<Mention variant="underlined" options={options} />

// Estados
<Mention status="error" options={options} />
<Mention status="warning" options={options} />

// AutoSize
<Mention autoSize options={options} placeholder="Auto-redimensionar" />
<Mention autoSize={{ minRows: 2, maxRows: 6 }} options={options} />

// Filas fijas con redimensionamiento manual
<Mention rows={4} resize options={options} />

// Permitir limpiar
<Mention allowClear options={options} />

// Ubicación
<Mention placement="top" options={options} />
<Mention placement="bottom" options={options} /> // auto-flip si no hay espacio

// Contenido personalizado cuando no se encuentra
<Mention notFoundContent="No se encontraron usuarios" options={options} />
<Mention notFoundContent={null} options={options} /> // ocultar cuando no hay coincidencias

// Deshabilitado y solo lectura
<Mention disabled options={options} defaultValue="No editable" />
<Mention readOnly options={options} value="Solo lectura" />

// Callback de selección
<Mention
  options={options}
  onSelect={(option, prefix) => {
    console.log(`Seleccionado ${prefix}${option.value}`)
  }}
/>

// Con ref
const mentionRef = useRef<MentionRef>(null)
<Mention ref={mentionRef} options={options} />
// Más tarde: mentionRef.current?.focus({ cursor: 'end' })

// Opciones enriquecidas con etiquetas personalizadas
<Mention
  options={[
    {
      value: 'alice',
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Avatar src="/alice.jpg" />
          <span>Alice Johnson</span>
        </div>
      ),
    },
    { value: 'bob', label: 'Bob Smith' },
  ]}
/>

// Carga asíncrona
const [options, setOptions] = useState([])
<Mention
  options={options}
  onSearch={async (text, prefix) => {
    if (prefix === '@') {
      const users = await fetchUsers(text)
      setOptions(users.map(u => ({ value: u.id, label: u.name })))
    }
  }}
/>

// Estilizado semántico
<Mention
  options={options}
  classNames={{
    root: 'custom-root',
    textarea: 'custom-textarea',
    dropdown: 'custom-dropdown',
  }}
  styles={{
    textarea: { fontFamily: 'monospace' },
    option: { padding: '1rem' },
  }}
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
<summary><strong>Radio</strong> - Selección única de opciones</summary>

### Radio

Un componente de botón de radio para selección única. Incluye Radio.Group para gestionar múltiples radios y Radio.Button para opciones de estilo botón.

#### Importar

```tsx
import { Radio } from 'j-ui'
```

#### Props de Radio

| Prop | Tipo | Por Defecto | Descripción |
|------|------|-------------|-------------|
| `checked` | `boolean` | — | Estado marcado controlado |
| `defaultChecked` | `boolean` | `false` | Estado inicial marcado (no controlado) |
| `disabled` | `boolean` | `false` | Deshabilitar el radio |
| `autoFocus` | `boolean` | `false` | Auto-enfocar al montar |
| `value` | `string \| number` | — | Valor del radio (usado por Radio.Group) |
| `onChange` | `(e: RadioChangeEvent) => void` | — | Callback de cambio |
| `children` | `ReactNode` | — | Contenido de la etiqueta |
| `id` | `string` | — | Atributo HTML id |
| `name` | `string` | — | Atributo HTML name (para agrupación) |
| `tabIndex` | `number` | — | Índice de tabulación |
| `classNames` | `SemanticClassNames<'root' \| 'radio' \| 'indicator' \| 'label'>` | — | Nombres de clase semánticos |
| `styles` | `SemanticStyles<'root' \| 'radio' \| 'indicator' \| 'label'>` | — | Estilos inline semánticos |

#### Props de Radio.Group

| Prop | Tipo | Por Defecto | Descripción |
|------|------|-------------|-------------|
| `value` | `string \| number` | — | Valor seleccionado controlado |
| `defaultValue` | `string \| number` | — | Valor inicial seleccionado (no controlado) |
| `onChange` | `(e: RadioChangeEvent) => void` | — | Callback de cambio |
| `disabled` | `boolean` | `false` | Deshabilitar todos los radios del grupo |
| `name` | `string` | — | Atributo HTML name para todos los radios |
| `options` | `(string \| number \| RadioOptionType)[]` | — | Array de opciones para auto-generación |
| `optionType` | `'default' \| 'button'` | `'default'` | Renderizar como círculos de radio o botones |
| `buttonStyle` | `'outline' \| 'solid'` | `'outline'` | Estilo de botón (cuando optionType es 'button') |
| `size` | `'small' \| 'middle' \| 'large'` | `'middle'` | Tamaño de botón (cuando optionType es 'button') |
| `children` | `ReactNode` | — | Children manuales de Radio/Radio.Button |
| `classNames` | `SemanticClassNames<'root'>` | — | Nombres de clase semánticos |
| `styles` | `SemanticStyles<'root'>` | — | Estilos inline semánticos |

#### RadioOptionType

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `label` | `ReactNode` | Etiqueta de visualización |
| `value` | `string \| number` | Valor de opción |
| `disabled` | `boolean` | Deshabilitar esta opción |
| `style` | `CSSProperties` | Estilo inline para esta opción |
| `className` | `string` | Clase CSS para esta opción |

#### RadioChangeEvent

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `target.checked` | `boolean` | Si el radio está marcado |
| `target.value` | `string \| number` | Valor del radio |
| `nativeEvent` | `Event` | Evento nativo del DOM |

#### Configuración de Tamaños de Botón (Radio.Button)

| Tamaño | Altura | Tamaño de Fuente | Padding (H) |
|--------|--------|------------------|-------------|
| `small` | 1.5rem (24px) | 0.75rem (12px) | 0.5rem |
| `middle` | 2rem (32px) | 0.875rem (14px) | 0.75rem |
| `large` | 2.5rem (40px) | 1rem (16px) | 1rem |

#### Estilos de Botón

- **outline** - Borde y color de texto cambian cuando se selecciona (predeterminado)
- **solid** - Fondo se rellena cuando se selecciona

#### DOM Semántico

##### Radio

| Slot | Descripción |
|------|-------------|
| `root` | Elemento label externo |
| `radio` | Contenedor del círculo de radio |
| `indicator` | Círculo relleno interno (cuando está marcado) |
| `label` | Contenedor de texto de etiqueta |

##### Radio.Group

| Slot | Descripción |
|------|-------------|
| `root` | Elemento contenedor del grupo |

#### Ejemplos

```tsx
// Radio básico
<Radio>Opción A</Radio>

// Controlado
const [value, setValue] = useState('a')
<Radio checked={value === 'a'} onChange={() => setValue('a')}>
  Opción A
</Radio>

// Radio.Group (recomendado para múltiples radios)
const [value, setValue] = useState('a')
<Radio.Group value={value} onChange={(e) => setValue(e.target.value)}>
  <Radio value="a">Opción A</Radio>
  <Radio value="b">Opción B</Radio>
  <Radio value="c">Opción C</Radio>
</Radio.Group>

// Radio.Group con array de opciones
<Radio.Group
  options={['Manzana', 'Plátano', 'Naranja']}
  defaultValue="Manzana"
/>

// Opciones con etiquetas y valores personalizados
<Radio.Group
  options={[
    { label: 'Opción 1', value: 1 },
    { label: 'Opción 2', value: 2 },
    { label: 'Opción 3 (deshabilitada)', value: 3, disabled: true },
  ]}
  defaultValue={1}
/>

// Radio.Button (radios de estilo botón)
<Radio.Group optionType="button" defaultValue="a">
  <Radio.Button value="a">Opción A</Radio.Button>
  <Radio.Button value="b">Opción B</Radio.Button>
  <Radio.Button value="c">Opción C</Radio.Button>
</Radio.Group>

// Botón con array de opciones
<Radio.Group
  optionType="button"
  options={['React', 'Vue', 'Angular']}
  defaultValue="React"
/>

// Estilo de botón sólido
<Radio.Group
  optionType="button"
  buttonStyle="solid"
  defaultValue="a"
  options={[
    { label: 'Opción A', value: 'a' },
    { label: 'Opción B', value: 'b' },
    { label: 'Opción C', value: 'c' },
  ]}
/>

// Tamaños de botón
<Radio.Group optionType="button" size="small" options={['S', 'M', 'L']} />
<Radio.Group optionType="button" size="middle" options={['S', 'M', 'L']} />
<Radio.Group optionType="button" size="large" options={['S', 'M', 'L']} />

// Grupo deshabilitado
<Radio.Group disabled options={['A', 'B', 'C']} defaultValue="A" />

// Opción individual deshabilitada
<Radio.Group defaultValue="a">
  <Radio value="a">Habilitado</Radio>
  <Radio value="b" disabled>Deshabilitado</Radio>
  <Radio value="c">Habilitado</Radio>
</Radio.Group>

// Con atributo name (para envío de formulario)
<Radio.Group name="preferencia" defaultValue="opcion1">
  <Radio value="opcion1">Opción 1</Radio>
  <Radio value="opcion2">Opción 2</Radio>
</Radio.Group>

// Layout vertical (usando Flex o Space)
<Flex vertical>
  <Radio.Group defaultValue="a">
    <Radio value="a">Opción A</Radio>
    <Radio value="b">Opción B</Radio>
    <Radio value="c">Opción C</Radio>
  </Radio.Group>
</Flex>

// Callback onChange
<Radio.Group
  onChange={(e) => {
    console.log('Seleccionado:', e.target.value)
    console.log('Marcado:', e.target.checked)
  }}
  options={['A', 'B', 'C']}
/>

// Estilizado semántico (Radio)
<Radio
  classNames={{
    root: 'custom-root',
    radio: 'custom-radio',
    label: 'custom-label',
  }}
  styles={{
    radio: { borderColor: 'blue', backgroundColor: 'lightblue' },
    label: { fontWeight: 600 },
  }}
>
  Estilizado Personalizado
</Radio>

// Estilizado semántico (Radio.Group)
<Radio.Group
  classNames={{ root: 'custom-group' }}
  styles={{ root: { gap: '1rem' } }}
  options={['A', 'B', 'C']}
/>
```

</details>

---

<details>
<summary><strong>Rate</strong> - Componente de calificación por estrellas con soporte para medias estrellas</summary>

### Rate

Un componente de calificación por estrellas para recopilar opiniones de usuarios. Soporta cantidad de estrellas personalizable, selección de medias estrellas, tooltips, navegación por teclado y caracteres personalizados.

#### Importar

```tsx
import { Rate } from 'j-ui'
```

#### Props

| Prop | Tipo | Por Defecto | Descripción |
|------|------|-------------|-------------|
| `allowClear` | `boolean` | `true` | Permite limpiar la selección haciendo clic en el mismo valor nuevamente |
| `allowHalf` | `boolean` | `false` | Permite seleccionar medias estrellas |
| `autoFocus` | `boolean` | `false` | Enfoque automático al montar |
| `character` | `ReactNode \| ((index: number) => ReactNode)` | SVG de estrella | Carácter personalizado para renderizar en cada estrella |
| `count` | `number` | `5` | Número total de estrellas |
| `defaultValue` | `number` | `0` | Valor por defecto para modo no controlado |
| `disabled` | `boolean` | `false` | Deshabilita la interacción (modo solo lectura) |
| `size` | `'small' \| 'middle' \| 'large'` | `'middle'` | Tamaño de las estrellas |
| `tooltips` | `string[]` | - | Texto de tooltip para cada estrella (el índice del array corresponde al índice de la estrella) |
| `value` | `number` | - | Valor actual (modo controlado) |
| `style` | `CSSProperties` | - | Estilos inline de la raíz |
| `className` | `string` | - | Clase CSS de la raíz |
| `classNames` | `RateClassNames` | - | Clases para slots semánticos |
| `styles` | `RateStyles` | - | Estilos para slots semánticos |
| `onBlur` | `() => void` | - | Callback al perder el foco |
| `onChange` | `(value: number) => void` | - | Callback al cambiar el valor |
| `onFocus` | `() => void` | - | Callback al enfocar |
| `onHoverChange` | `(value: number) => void` | - | Callback al cambiar el valor de hover (se llama con `0` al salir el mouse) |
| `onKeyDown` | `(event: KeyboardEvent) => void` | - | Callback al presionar una tecla |

#### RateRef

| Método | Descripción |
|--------|-------------|
| `focus()` | Enfoca el componente de calificación |
| `blur()` | Desenfoca el componente de calificación |

#### Configuración de Tamaños

| Tamaño | Tamaño de Fuente | Separación |
|--------|------------------|------------|
| `small` | 0.875rem (14px) | 0.25rem (4px) |
| `middle` | 1.25rem (20px) | 0.5rem (8px) |
| `large` | 2rem (32px) | 0.625rem (10px) |

#### DOM Semántico

| Slot | Descripción |
|------|-------------|
| `root` | El elemento contenedor con `role="radiogroup"` |
| `star` | Cada contenedor de estrella (múltiples elementos) |
| `character` | El elemento del carácter dentro de cada estrella (capas de fondo y primer plano) |

#### Ejemplos

**Uso básico:**
```tsx
const [value, setValue] = useState(0)

<Rate value={value} onChange={setValue} />
```

**Soporte para medias estrellas:**
```tsx
<Rate allowHalf defaultValue={2.5} />
```

**Cantidad de estrellas personalizada:**
```tsx
<Rate count={10} defaultValue={7} />
```

**Tamaños:**
```tsx
<Rate size="small" defaultValue={3} />
<Rate size="middle" defaultValue={3} />
<Rate size="large" defaultValue={3} />
```

**Con tooltips:**
```tsx
<Rate
  tooltips={['Terrible', 'Malo', 'Normal', 'Bueno', 'Excelente']}
  defaultValue={3}
/>
```

**Carácter personalizado:**
```tsx
<Rate character="❤️" defaultValue={3} />

// O carácter dinámico por estrella
<Rate
  character={(index) => index + 1} // Muestra números 1-5
  defaultValue={3}
/>
```

**Deshabilitado (solo lectura):**
```tsx
<Rate disabled value={3.5} allowHalf />
```

**Navegación por teclado:**
El componente Rate soporta navegación por teclado cuando está enfocado:
- Flecha Derecha / Flecha Arriba: Incrementa la calificación en 1 (o 0.5 si `allowHalf` está habilitado)
- Flecha Izquierda / Flecha Abajo: Decrementa la calificación en 1 (o 0.5 si `allowHalf` está habilitado)

**Controlado con prevención de limpieza:**
```tsx
const [value, setValue] = useState(4)

<Rate
  value={value}
  onChange={setValue}
  allowClear={false} // Previene limpiar una vez establecido
/>
```

**Estilos personalizados:**
```tsx
<Rate
  defaultValue={3}
  styles={{
    character: { color: '#ff4d4f', fontSize: '2rem' },
  }}
/>
```

</details>

---

<details>
<summary><strong>Select</strong> - Componente de selección desplegable con búsqueda, etiquetas y scroll virtual</summary>

### Select

Un potente componente de selección desplegable que soporta selección simple, selección múltiple, modo de etiquetas, búsqueda/filtrado, scroll virtual para grandes conjuntos de datos, grupos de opciones y personalización extensa.

#### Importar

```tsx
import { Select } from 'j-ui'
```

#### Props

| Prop | Tipo | Por Defecto | Descripción |
|------|------|-------------|-------------|
| `options` | `(SelectOption \| SelectOptionGroup)[]` | `[]` | Array de opciones o grupos de opciones |
| `fieldNames` | `SelectFieldNames` | `{ label: 'label', value: 'value', options: 'options' }` | Nombres de campos personalizados para propiedades de opciones |
| `value` | `string \| number \| (string \| number)[]` | - | Valor actual (controlado) |
| `defaultValue` | `string \| number \| (string \| number)[]` | - | Valor por defecto (no controlado) |
| `mode` | `'multiple' \| 'tags'` | - | Modo de selección: `multiple` para multi-selección, `tags` para crear etiquetas personalizadas |
| `labelInValue` | `boolean` | `false` | Si retornar objetos `{ value, label }` en onChange en lugar de solo valores |
| `placeholder` | `string` | `'Select...'` | Texto del placeholder |
| `showSearch` | `boolean` | - | Habilitar búsqueda/filtro (auto-habilitado en modo tags) |
| `size` | `'large' \| 'middle' \| 'small'` | `'middle'` | Tamaño del input de selección |
| `variant` | `'outlined' \| 'filled' \| 'borderless'` | `'outlined'` | Variante de estilo visual |
| `status` | `'error' \| 'warning'` | - | Estado de validación |
| `placement` | `'bottomLeft' \| 'bottomRight' \| 'topLeft' \| 'topRight'` | `'bottomLeft'` | Posición inicial del desplegable (se auto-voltea si se desborda) |
| `allowClear` | `boolean` | `false` | Mostrar botón para limpiar la selección |
| `disabled` | `boolean` | `false` | Deshabilitar el select |
| `loading` | `boolean` | `false` | Mostrar indicador de carga |
| `autoFocus` | `boolean` | `false` | Auto-enfocar al montar |
| `virtual` | `boolean` | `true` | Habilitar scroll virtual para listas grandes (umbral: 32 items) |
| `popupMatchSelectWidth` | `boolean \| number` | `true` | Igualar ancho del dropdown al select, o establecer ancho personalizado en píxeles |
| `maxTagCount` | `number` | - | Número máximo de etiquetas a mostrar en modo múltiple (resto mostrado en `+N`) |
| `maxTagPlaceholder` | `ReactNode \| ((omitted: (string \| number)[]) => ReactNode)` | `+N` | Placeholder personalizado para etiquetas omitidas |
| `maxCount` | `number` | - | Número máximo de items que pueden ser seleccionados en modo múltiple |
| `defaultActiveFirstOption` | `boolean` | `true` | Auto-resaltar primera opción al abrir el dropdown |
| `optionFilterProp` | `string` | - | Nombre de propiedad para filtrar (usa texto buscable por defecto) |
| `filterOption` | `boolean \| ((input: string, option: SelectOption) => boolean)` | `true` | Función de filtro o `false` para deshabilitar filtrado |
| `filterSort` | `(a: SelectOption, b: SelectOption) => number` | - | Ordenar opciones filtradas |
| `tokenSeparators` | `string[]` | - | Caracteres que activan la creación de etiquetas en modo tags (ej. `[',', ' ']`) |
| `open` | `boolean` | - | Controlar visibilidad del dropdown (controlado) |
| `dropdownRender` | `(menu: ReactNode) => ReactNode` | - | Personalizar contenido del dropdown (envuelve el menú) |
| `tagRender` | `(props: SelectTagRenderProps) => ReactNode` | - | Renderizador de etiquetas personalizado en modo múltiple |
| `labelRender` | `(props: SelectLabelRenderProps) => ReactNode` | - | Renderizador de etiqueta personalizado para valor seleccionado |
| `notFoundContent` | `ReactNode` | `'No data'` | Contenido mostrado cuando no hay opciones que coincidan (establecer en `null` para ocultar) |
| `suffix` | `ReactNode` | Ícono de chevron | Ícono de sufijo personalizado (reemplaza el chevron) |
| `removeIcon` | `ReactNode` | Ícono de cerrar | Ícono personalizado para eliminar etiquetas |
| `clearIcon` | `ReactNode` | Ícono de limpiar | Ícono personalizado para el botón de limpiar |
| `prefix` | `ReactNode` | - | Elemento prefijo dentro del select |
| `optionRender` | `(option: SelectOption, info: { index: number }) => ReactNode` | - | Renderizador de opciones personalizado |
| `onChange` | `(value: any, option: any) => void` | - | Callback cuando el valor cambia |
| `onSelect` | `(value: string \| number, option: SelectOption) => void` | - | Callback cuando una opción es seleccionada |
| `onDeselect` | `(value: string \| number, option: SelectOption) => void` | - | Callback cuando una opción es deseleccionada (modo múltiple) |
| `onSearch` | `(value: string) => void` | - | Callback cuando el input de búsqueda cambia |
| `onClear` | `() => void` | - | Callback cuando el botón de limpiar es clickeado |
| `onFocus` | `() => void` | - | Callback al enfocar |
| `onBlur` | `() => void` | - | Callback al desenfocar |
| `onDropdownVisibleChange` | `(open: boolean) => void` | - | Callback cuando la visibilidad del dropdown cambia |
| `onKeyDown` | `(e: KeyboardEvent) => void` | - | Callback al presionar tecla |
| `className` | `string` | - | Clase CSS de la raíz |
| `style` | `CSSProperties` | - | Estilos inline de la raíz |
| `classNames` | `SelectClassNames` | - | Clases para slots semánticos |
| `styles` | `SelectStyles` | - | Estilos para slots semánticos |

#### SelectOption

```typescript
interface SelectOption {
  value: string | number
  label?: ReactNode
  disabled?: boolean
  title?: string // Usado para búsqueda si se proporciona
  [key: string]: unknown // Campos personalizados adicionales
}
```

#### SelectOptionGroup

```typescript
interface SelectOptionGroup {
  label: ReactNode
  title?: string
  options: SelectOption[]
}
```

#### SelectFieldNames

```typescript
interface SelectFieldNames {
  label?: string    // Por defecto: 'label'
  value?: string    // Por defecto: 'value'
  options?: string  // Por defecto: 'options' (para grupos)
}
```

#### Configuración de Tamaños

| Tamaño | Altura | Tamaño de Fuente |
|--------|--------|------------------|
| `large` | 2.5rem (40px) | 1rem (16px) |
| `middle` | 2.25rem (36px) | 0.875rem (14px) |
| `small` | 1.75rem (28px) | 0.875rem (14px) |

#### DOM Semántico

| Slot | Descripción |
|------|-------------|
| `root` | El contenedor más externo |
| `selector` | La caja de selección clickeable con los valores seleccionados |
| `search` | El elemento input de búsqueda (cuando `showSearch` está habilitado) |
| `dropdown` | El contenedor del menú desplegable |
| `option` | Cada elemento de opción en el dropdown (múltiples elementos) |
| `tag` | Cada elemento de etiqueta en modo múltiple (múltiples elementos) |

#### Ejemplos

**Uso básico:**
```tsx
const [value, setValue] = useState('apple')

const options = [
  { value: 'apple', label: 'Manzana' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Naranja' },
]

<Select options={options} value={value} onChange={setValue} />
```

**Con búsqueda:**
```tsx
<Select
  options={options}
  showSearch
  placeholder="Buscar y seleccionar..."
  onChange={setValue}
/>
```

**Selección múltiple:**
```tsx
const [values, setValues] = useState<string[]>([])

<Select
  mode="multiple"
  options={options}
  value={values}
  onChange={setValues}
  placeholder="Seleccionar múltiples items"
  maxTagCount={3}
/>
```

**Modo tags (crear etiquetas personalizadas):**
```tsx
<Select
  mode="tags"
  value={tags}
  onChange={setTags}
  placeholder="Escribe y presiona Enter para crear etiquetas"
  tokenSeparators={[',', ' ']}
/>
```

**Grupos de opciones:**
```tsx
const groupedOptions = [
  {
    label: 'Frutas',
    options: [
      { value: 'apple', label: 'Manzana' },
      { value: 'banana', label: 'Banana' },
    ],
  },
  {
    label: 'Vegetales',
    options: [
      { value: 'carrot', label: 'Zanahoria' },
      { value: 'potato', label: 'Papa' },
    ],
  },
]

<Select options={groupedOptions} />
```

**Tamaños y variantes:**
```tsx
<Select size="small" variant="outlined" options={options} />
<Select size="middle" variant="filled" options={options} />
<Select size="large" variant="borderless" options={options} />
```

**Con estado:**
```tsx
<Select status="error" options={options} />
<Select status="warning" options={options} />
```

**Nombres de campos personalizados:**
```tsx
const customOptions = [
  { id: 1, name: 'Opción 1' },
  { id: 2, name: 'Opción 2' },
]

<Select
  options={customOptions}
  fieldNames={{ label: 'name', value: 'id' }}
  onChange={(value) => console.log(value)}
/>
```

**Modo labelInValue:**
```tsx
<Select
  options={options}
  labelInValue
  onChange={(obj) => console.log(obj.value, obj.label)}
/>
```

**Scroll virtual:**
El scroll virtual está habilitado por defecto para listas con más de 32 items. Mejora significativamente el rendimiento con grandes conjuntos de datos.

```tsx
const largeOptions = Array.from({ length: 1000 }, (_, i) => ({
  value: i,
  label: `Opción ${i + 1}`,
}))

<Select
  options={largeOptions}
  virtual // true por defecto
  showSearch
/>
```

**Renderizado de dropdown personalizado:**
```tsx
<Select
  options={options}
  dropdownRender={(menu) => (
    <>
      {menu}
      <div style={{ padding: '0.5rem', borderTop: '1px solid #ddd' }}>
        <button onClick={handleAddNew}>+ Agregar Nuevo Item</button>
      </div>
    </>
  )}
/>
```

**Renderizado de opción personalizado:**
```tsx
<Select
  options={options}
  optionRender={(option) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span style={{ fontSize: '1.25rem' }}>{option.icon}</span>
      <span>{option.label}</span>
    </div>
  )}
/>
```

**Navegación por teclado:**
- Flecha Abajo: Abrir dropdown / Navegar abajo
- Flecha Arriba: Navegar arriba
- Enter: Seleccionar opción resaltada / Crear etiqueta (en modo tags)
- Escape: Cerrar dropdown
- Backspace: Eliminar última etiqueta (en modo múltiple cuando la búsqueda está vacía)

**Estado de carga:**
```tsx
<Select loading options={options} placeholder="Cargando..." />
```

**Conteo máximo (limitar selecciones):**
```tsx
<Select
  mode="multiple"
  maxCount={3}
  options={options}
  placeholder="Seleccionar hasta 3 items"
/>
```

</details>

---

<details>
<summary><strong>Slider</strong> - Control deslizante de rango con tooltips, marcas y manijas editables</summary>

### Slider

Un componente versátil de control deslizante que soporta valores individuales, rangos con múltiples manijas, rangos editables (agregar/eliminar manijas dinámicamente), marcas con etiquetas personalizadas, pistas arrastrables, orientación vertical/horizontal y navegación por teclado.

#### Importar

```tsx
import { Slider } from 'j-ui'
```

#### Props

| Prop | Tipo | Por Defecto | Descripción |
|------|------|-------------|-------------|
| `defaultValue` | `number \| number[]` | `min` o `[min, min]` | Valor por defecto (no controlado) |
| `value` | `number \| number[]` | - | Valor actual (controlado) |
| `min` | `number` | `0` | Valor mínimo |
| `max` | `number` | `100` | Valor máximo |
| `step` | `number \| null` | `1` | Tamaño del paso (`null` significa ajustar solo a las marcas) |
| `marks` | `SliderMarks` | - | Etiquetas de marca en valores específicos (Record<number, label>) |
| `dots` | `boolean` | `false` | Mostrar puntos en cada posición de paso |
| `included` | `boolean` | `true` | Resaltar pista entre manijas (o desde min hasta manija en modo individual) |
| `range` | `boolean \| SliderRangeConfig` | `false` | Habilitar modo de rango con múltiples manijas |
| `vertical` | `boolean` | `false` | Orientación vertical |
| `reverse` | `boolean` | `false` | Invertir la dirección (derecha-a-izquierda o abajo-a-arriba) |
| `disabled` | `boolean` | `false` | Deshabilitar interacción |
| `keyboard` | `boolean` | `true` | Habilitar navegación por teclado |
| `tooltip` | `SliderTooltipConfig` | - | Configuración de tooltip (posición, formateador, visibilidad) |
| `draggableTrack` | `boolean` | `false` | Permitir arrastrar la pista completa para mover todas las manijas juntas (solo modo rango) |
| `onChange` | `(value: number \| number[]) => void` | - | Callback al cambiar el valor (se dispara durante el arrastre) |
| `onChangeComplete` | `(value: number \| number[]) => void` | - | Callback cuando el arrastre se completa o el ajuste por teclado finaliza |
| `style` | `CSSProperties` | - | Estilos inline de la raíz |
| `className` | `string` | - | Clase CSS de la raíz |
| `classNames` | `SliderClassNames` | - | Clases para slots semánticos |
| `styles` | `SliderStyles` | - | Estilos para slots semánticos |

#### SliderRangeConfig

```typescript
interface SliderRangeConfig {
  editable?: boolean          // Permitir agregar/eliminar manijas dinámicamente
  minCount?: number           // Número mínimo de manijas (por defecto: editable ? 1 : 2)
  maxCount?: number           // Número máximo de manijas (por defecto: Infinity)
  draggableTrack?: boolean    // Permitir arrastrar la pista completa
}
```

#### SliderTooltipConfig

```typescript
interface SliderTooltipConfig {
  open?: boolean                              // Forzar mostrar (true) u ocultar (false) tooltips
  placement?: 'top' | 'bottom' | 'left' | 'right'  // Posición del tooltip (por defecto: 'top' para horizontal, 'right' para vertical)
  formatter?: ((value: number) => ReactNode) | null  // Formateador personalizado (null para ocultar tooltips)
}
```

#### SliderMarks

```typescript
type SliderMarkLabel = ReactNode | { style?: CSSProperties; label: ReactNode }
type SliderMarks = Record<number, SliderMarkLabel>

// Ejemplo:
const marks = {
  0: 'Mín',
  50: { label: '50%', style: { color: 'blue' } },
  100: 'Máx',
}
```

#### SliderRef

| Método | Descripción |
|--------|-------------|
| `focus()` | Enfocar el slider (habilita navegación por teclado) |
| `blur()` | Desenfocar el slider |

#### DOM Semántico

| Slot | Descripción |
|------|-------------|
| `root` | El contenedor más externo con manejo de eventos de teclado |
| `rail` | La pista de fondo (longitud completa del slider) |
| `track` | El segmento(s) de pista resaltado entre manijas (múltiples elementos en modo rango) |
| `handle` | La(s) manija(s) arrastrable(s) (múltiples elementos en modo rango) |
| `mark` | Etiquetas de marca en posiciones específicas (múltiples elementos) |
| `dot` | Pequeños puntos en posiciones de paso/marca (múltiples elementos) |
| `tooltip` | Tooltip mostrado al pasar el mouse/arrastrar para cada manija (múltiples elementos) |

#### Ejemplos

**Uso básico:**
```tsx
const [value, setValue] = useState(30)

<Slider value={value} onChange={setValue} />
```

**Modo rango (dos manijas):**
```tsx
const [range, setRange] = useState([20, 60])

<Slider range value={range} onChange={setRange} />
```

**Con marcas:**
```tsx
<Slider
  defaultValue={50}
  marks={{
    0: '0°C',
    25: '25°C',
    50: '50°C',
    75: '75°C',
    100: '100°C',
  }}
/>
```

**Con estilos de marca personalizados:**
```tsx
<Slider
  marks={{
    0: 'Mín',
    50: {
      label: '⭐ Recomendado',
      style: { color: '#faad14', fontWeight: 600 }
    },
    100: 'Máx',
  }}
/>
```

**Con puntos:**
```tsx
<Slider defaultValue={30} step={10} dots />
```

**Step null (ajustar solo a marcas):**
```tsx
<Slider
  defaultValue={25}
  step={null}
  marks={{ 0: '0', 25: '25', 50: '50', 75: '75', 100: '100' }}
/>
```

**Rango editable (agregar/eliminar manijas):**
```tsx
<Slider
  range={{ editable: true, minCount: 1, maxCount: 5 }}
  defaultValue={[20, 50, 80]}
/>
```

Para usar rango editable:
- **Agregar manijas:** Hacer clic en cualquier parte de la pista
- **Eliminar manijas:** Arrastrar una manija lejos (60px) de la pista, o presionar Delete/Backspace cuando esté enfocado
- **Teclado:** Tab para cambiar entre manijas, Delete/Backspace para eliminar manija activa

**Pista arrastrable:**
```tsx
<Slider
  range
  defaultValue={[20, 60]}
  draggableTrack
/>
```

Hacer clic y arrastrar la pista resaltada para mover ambas manijas juntas.

**Slider vertical:**
```tsx
<div style={{ height: '300px' }}>
  <Slider vertical defaultValue={50} />
</div>
```

**Dirección inversa:**
```tsx
<Slider reverse defaultValue={30} />
```

**Deshabilitado:**
```tsx
<Slider disabled value={50} />
```

**Tooltip personalizado:**
```tsx
<Slider
  defaultValue={30}
  tooltip={{
    open: true,  // Siempre visible
    placement: 'bottom',
    formatter: (value) => `${value}%`,
  }}
/>
```

**Ocultar tooltip:**
```tsx
<Slider
  defaultValue={50}
  tooltip={{ formatter: null }}
/>
```

**Navegación por teclado:**
El slider soporta navegación completa por teclado cuando está enfocado:
- **Flecha Derecha / Flecha Arriba:** Incrementar valor por paso (respeta `reverse`)
- **Flecha Izquierda / Flecha Abajo:** Decrementar valor por paso (respeta `reverse`)
- **Home:** Saltar al valor mínimo
- **End:** Saltar al valor máximo
- **Tab / Shift+Tab:** Cambiar entre manijas (en modo rango)
- **Delete / Backspace:** Eliminar manija activa (en modo rango editable)

**Estilos personalizados:**
```tsx
<Slider
  defaultValue={50}
  styles={{
    handle: {
      backgroundColor: '#ff4d4f',
      borderColor: '#ff4d4f',
    },
    track: {
      backgroundColor: '#ff7875',
    },
  }}
/>
```

**Included vs no included:**
```tsx
// Included (por defecto): resalta pista desde min hasta manija
<Slider defaultValue={30} included />

// No included: sin resaltado de pista
<Slider defaultValue={30} included={false} />

// Rango con included: resalta entre manijas
<Slider range defaultValue={[20, 60]} included />
```

**Controlado con cambio completo:**
```tsx
const [value, setValue] = useState(50)

<Slider
  value={value}
  onChange={(v) => console.log('Cambiando:', v)}  // Se dispara durante el arrastre
  onChangeComplete={(v) => {
    console.log('Final:', v)  // Se dispara cuando el arrastre se completa
    setValue(v)
  }}
/>
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
<summary><strong>Switch</strong> - Interruptor de alternancia para estados on/off con soporte de carga</summary>

### Switch

Un componente de interruptor de alternancia para estados binarios on/off. Soporta dos tamaños, estado de carga con spinner, etiquetas de texto personalizadas para estados marcado/desmarcado, y accesibilidad por teclado.

#### Importar

```tsx
import { Switch } from 'j-ui'
```

#### Props

| Prop | Tipo | Por Defecto | Descripción |
|------|------|-------------|-------------|
| `autoFocus` | `boolean` | `false` | Auto-enfocar al montar |
| `checked` | `boolean` | - | Estado marcado actual (controlado) |
| `checkedChildren` | `ReactNode` | - | Contenido mostrado dentro del switch cuando está marcado (ej. "ON") |
| `defaultChecked` | `boolean` | `false` | Estado marcado por defecto (no controlado) |
| `defaultValue` | `boolean` | `false` | Alias para `defaultChecked` |
| `disabled` | `boolean` | `false` | Deshabilitar el switch |
| `loading` | `boolean` | `false` | Mostrar spinner de carga (también deshabilita la interacción) |
| `size` | `'default' \| 'small'` | `'default'` | Tamaño del switch |
| `unCheckedChildren` | `ReactNode` | - | Contenido mostrado dentro del switch cuando está desmarcado (ej. "OFF") |
| `value` | `boolean` | - | Alias para `checked` |
| `onChange` | `(checked: boolean, event: MouseEvent) => void` | - | Callback cuando el estado marcado cambia |
| `onClick` | `(checked: boolean, event: MouseEvent) => void` | - | Callback de clic (se dispara después de onChange) |
| `className` | `string` | - | Clase CSS de la raíz |
| `style` | `CSSProperties` | - | Estilos inline de la raíz |
| `classNames` | `SwitchClassNames` | - | Clases para slots semánticos |
| `styles` | `SwitchStyles` | - | Estilos para slots semánticos |
| `tabIndex` | `number` | - | Índice de tabulación personalizado |
| `id` | `string` | - | Atributo id de HTML |

#### SwitchRef

| Método | Descripción |
|--------|-------------|
| `focus()` | Enfocar el switch |
| `blur()` | Desenfocar el switch |

#### Configuración de Tamaños

| Tamaño | Altura de Pista | Ancho Mínimo de Pista | Tamaño de Pulgar |
|--------|-----------------|------------------------|------------------|
| `default` | 1.375rem (22px) | 2.75rem (44px) | 1.125rem (18px) |
| `small` | 1rem (16px) | 1.75rem (28px) | 0.75rem (12px) |

#### DOM Semántico

| Slot | Descripción |
|------|-------------|
| `root` | El elemento button (contenedor externo) |
| `track` | La pista de fondo que cambia de color |
| `thumb` | El pulgar circular deslizante |
| `inner` | El contenedor de contenido de texto (para checkedChildren/unCheckedChildren) |

#### Ejemplos

**Uso básico:**
```tsx
const [checked, setChecked] = useState(false)

<Switch checked={checked} onChange={setChecked} />
```

**No controlado:**
```tsx
<Switch defaultChecked />
```

**Con etiquetas de texto:**
```tsx
<Switch
  checkedChildren="ON"
  unCheckedChildren="OFF"
  defaultChecked
/>
```

**Tamaño pequeño:**
```tsx
<Switch size="small" defaultChecked />
<Switch size="small" checkedChildren="✓" unCheckedChildren="✗" />
```

**Deshabilitado:**
```tsx
<Switch disabled />
<Switch disabled checked />
```

**Estado de carga:**
```tsx
<Switch loading />
<Switch loading checked />
```

**Con manejador onChange:**
```tsx
const [checked, setChecked] = useState(false)

<Switch
  checked={checked}
  onChange={(checked) => {
    console.log('El switch ahora está:', checked)
    setChecked(checked)
  }}
/>
```

**Estilos personalizados:**
```tsx
<Switch
  defaultChecked
  styles={{
    track: {
      backgroundColor: checked ? '#52c41a' : '#d9d9d9',
    },
  }}
/>
```

**Accesibilidad por teclado:**
El componente Switch es completamente accesible por teclado:
- **Espacio / Enter:** Alternar el switch
- Soporta gestión de foco estándar con anillo de foco en navegación por teclado

**Con iconos como etiquetas:**
```tsx
<Switch
  checkedChildren={<CheckOutlined />}
  unCheckedChildren={<CloseOutlined />}
  defaultChecked
/>
```

**Usando aliases value/defaultValue:**
```tsx
// Estos son equivalentes a checked/defaultChecked
<Switch value={isEnabled} onChange={setEnabled} />
<Switch defaultValue={true} />
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
<summary><strong>TimePicker</strong> - Selector de tiempo</summary>

### TimePicker

`TimePicker` permite a los usuarios seleccionar valores de tiempo (horas, minutos, segundos) a través de una interfaz de selección desplegable. Soporta formatos de 12 y 24 horas, pasos personalizados, restricciones de tiempo, selección de rangos de tiempo y vistas de reloj analógico.

**Importación:**
```tsx
import { TimePicker } from 'j-ui';
```

#### Props de TimePicker

| Prop | Tipo | Predeterminado | Descripción |
|------|------|----------------|-------------|
| `value` | `Date \| null` | `undefined` | Valor controlado del tiempo (modo controlado) |
| `defaultValue` | `Date \| null` | `null` | Valor inicial del tiempo (modo no controlado) |
| `onChange` | `(date: Date \| null) => void` | `undefined` | Callback cuando cambia el valor del tiempo |
| `format` | `string` | `'HH:mm'` | Formato del tiempo - `'HH:mm'` (24h), `'hh:mm A'` (12h), soporta segundos `'ss'` |
| `use12Hours` | `boolean` | `false` | Si se usa formato de 12 horas con AM/PM |
| `hourStep` | `number` | `1` | Incremento de intervalo para horas |
| `minuteStep` | `number` | `1` | Incremento de intervalo para minutos |
| `secondStep` | `number` | `1` | Incremento de intervalo para segundos |
| `needConfirm` | `boolean` | `true` | Si se requiere confirmación (botón OK) para aplicar el valor seleccionado |
| `showNow` | `boolean` | `true` | Si se muestra el botón "Ahora" en el pie de página |
| `showAnalog` | `boolean` | `false` | Si se muestra la vista de reloj analógico en lugar de columnas digitales |
| `changeOnScroll` | `boolean` | `false` | Si se permite selección desplazando columnas en lugar de hacer clic |
| `disabledTime` | `() => DisabledTimeConfig` | `undefined` | Función que devuelve la configuración de tiempos deshabilitados |
| `disabled` | `boolean` | `false` | Si el selector de tiempo está deshabilitado |
| `placeholder` | `string` | `'Select time'` | Texto de placeholder cuando vacío |
| `size` | `'small' \| 'middle' \| 'large'` | `'middle'` | Tamaño del selector de tiempo |
| `allowClear` | `boolean` | `true` | Si se permite limpiar el valor seleccionado |
| `open` | `boolean` | `undefined` | Si el desplegable está abierto (modo controlado) |
| `defaultOpen` | `boolean` | `false` | Si el desplegable está abierto inicialmente (modo no controlado) |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Callback cuando cambia el estado de apertura del desplegable |
| `getPopupContainer` | `(trigger: HTMLElement) => HTMLElement` | `undefined` | Función para obtener el contenedor del desplegable |
| `popupClassName` | `string` | `undefined` | Nombre de clase personalizado para el desplegable |
| `popupStyle` | `CSSProperties` | `undefined` | Estilos en línea personalizados para el desplegable |
| `className` | `SemanticClassNames<'root' \| 'input' \| 'clear'>` | `undefined` | Nombres de clase semánticos para diferentes partes del componente |
| `rootClassName` | `string` | `undefined` | Nombre de clase raíz aplicado al wrapper del componente |
| `styles` | `SemanticStyles<'root' \| 'input' \| 'clear'>` | `undefined` | Estilos en línea semánticos para diferentes partes del componente |

#### Props de TimePicker.RangePicker

`TimePicker.RangePicker` hereda todas las props de `TimePicker` excepto `value`, `defaultValue`, `onChange` y `placeholder`, y agrega:

| Prop | Tipo | Predeterminado | Descripción |
|------|------|----------------|-------------|
| `value` | `[Date \| null, Date \| null]` | `undefined` | Valores controlados del rango de tiempo [inicio, fin] |
| `defaultValue` | `[Date \| null, Date \| null]` | `[null, null]` | Valores iniciales del rango de tiempo |
| `onChange` | `(dates: [Date \| null, Date \| null]) => void` | `undefined` | Callback cuando cambian los valores del rango |
| `disabled` | `boolean \| [boolean, boolean]` | `false` | Estado deshabilitado para ambos o cada selector individualmente |
| `placeholder` | `[string, string]` | `['Start time', 'End time']` | Placeholders para los selectores de inicio y fin |
| `separator` | `ReactNode` | `'~'` | Elemento separador entre los selectores de inicio y fin |
| `order` | `boolean` | `true` | Si se intercambian automáticamente los valores si inicio > fin |

#### Interfaz DisabledTimeConfig

```typescript
interface DisabledTimeConfig {
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
}
```

#### Configuración de Tamaños

| Tamaño | Altura del Input |
|--------|------------------|
| `small` | 1.75rem (28px) |
| `middle` | 2.25rem (36px) |
| `large` | 2.75rem (44px) |

#### Slots de DOM Semántico

| Slot | Descripción |
|------|-------------|
| `root` | El contenedor raíz del selector de tiempo |
| `input` | El elemento de entrada donde se muestra el tiempo |
| `clear` | El botón para limpiar el valor seleccionado |

#### Ejemplos

**Uso básico:**
```tsx
import { TimePicker } from 'j-ui';

<TimePicker
  placeholder="Selecciona hora"
  onChange={(date) => console.log('Hora seleccionada:', date)}
/>
```

**Con formato de 12 horas:**
```tsx
<TimePicker
  format="hh:mm A"
  use12Hours
  defaultValue={new Date()}
/>
```

**Con pasos personalizados:**
```tsx
<TimePicker
  hourStep={2}
  minuteStep={15}
  secondStep={10}
  format="HH:mm:ss"
/>
```

**Vista de reloj analógico:**
```tsx
<TimePicker
  showAnalog
  use12Hours
  format="hh:mm A"
/>
```

**Sin confirmación (actualización instantánea):**
```tsx
<TimePicker
  needConfirm={false}
  showNow={false}
/>
```

**Con selección por desplazamiento:**
```tsx
<TimePicker
  changeOnScroll
  needConfirm={false}
/>
```

**Con tiempos deshabilitados:**
```tsx
<TimePicker
  disabledTime={() => ({
    disabledHours: () => [0, 1, 2, 3, 4, 5, 22, 23], // Deshabilitar horario nocturno
    disabledMinutes: (hour) => hour === 12 ? [0, 15, 30, 45] : [], // Deshabilitar ciertos minutos al mediodía
  })}
/>
```

**Selector de rango de tiempo:**
```tsx
<TimePicker.RangePicker
  placeholder={['Hora de inicio', 'Hora de fin']}
  onChange={(dates) => console.log('Rango:', dates)}
/>
```

**Rango con deshabilitación selectiva:**
```tsx
<TimePicker.RangePicker
  disabled={[false, true]} // Solo el inicio habilitado
  defaultValue={[new Date(), null]}
/>
```

**Formatos de cadena de tiempo soportados:**
- `'HH:mm'` - 24 horas (predeterminado)
- `'hh:mm A'` - 12 horas con AM/PM
- `'HH:mm:ss'` - 24 horas con segundos
- `'hh:mm:ss A'` - 12 horas con segundos

</details>

---

<details>
<summary><strong>Transfer</strong> - Transferencia de items entre listas</summary>

### Transfer

`Transfer` es un componente de lista dual que permite a los usuarios mover items entre dos listas (origen y destino). Se utiliza comúnmente para seleccionar múltiples items de un conjunto grande, gestionar permisos u organizar datos entre categorías.

**Importación:**
```tsx
import { Transfer } from 'j-ui';
```

#### Props

| Prop | Tipo | Predeterminado | Descripción |
|------|------|----------------|-------------|
| `dataSource` | `TransferItem[]` | *requerido* | Fuente de datos completa para todos los items |
| `targetKeys` | `string[]` | `undefined` | Claves controladas de items en la lista destino |
| `defaultTargetKeys` | `string[]` | `[]` | Claves iniciales de items en la lista destino (modo no controlado) |
| `selectedKeys` | `string[]` | `undefined` | Claves controladas de items actualmente seleccionados |
| `defaultSelectedKeys` | `string[]` | `[]` | Claves seleccionadas inicialmente (modo no controlado) |
| `onChange` | `(targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => void` | `undefined` | Callback cuando se transfieren items |
| `onSelectChange` | `(sourceSelectedKeys: string[], targetSelectedKeys: string[]) => void` | `undefined` | Callback cuando cambia la selección |
| `onSearch` | `(direction: TransferDirection, value: string) => void` | `undefined` | Callback cuando cambia el input de búsqueda |
| `render` | `(record: TransferItem) => ReactNode` | `undefined` | Función de renderizado personalizada para items (por defecto `item.title`) |
| `disabled` | `boolean` | `false` | Si el transfer está deshabilitado |
| `showSearch` | `boolean` | `false` | Si se muestran cajas de búsqueda en ambas listas |
| `filterOption` | `(inputValue: string, item: TransferItem) => boolean` | Coincidencia de título sin distinción de mayúsculas | Función de filtro personalizada para búsqueda |
| `titles` | `[ReactNode, ReactNode]` | `['Source', 'Target']` | Títulos para las listas origen y destino |
| `operations` | `[string, string]` | `undefined` | Texto personalizado para botones de operación (por defecto iconos de flecha) |
| `showSelectAll` | `boolean` | `true` | Si se muestra el checkbox "seleccionar todo" en los encabezados |
| `oneWay` | `boolean` | `false` | Modo de transferencia unidireccional (muestra iconos de remover en lugar de flecha izquierda) |
| `status` | `'error' \| 'warning'` | `undefined` | Estado de validación que afecta el color del borde |
| `footer` | `ReactNode \| ((props: { direction: TransferDirection }) => ReactNode)` | `undefined` | Contenido del pie de página para las listas (puede ser función específica por dirección) |
| `pagination` | `boolean \| { pageSize?: number }` | `false` | Habilitar paginación (pageSize predeterminado: 10) |
| `listStyle` | `CSSProperties \| ((direction: TransferDirection) => CSSProperties)` | `undefined` | Estilos personalizados para paneles de lista (puede ser función específica por dirección) |
| `className` | `string` | `undefined` | Nombre de clase del elemento raíz |
| `style` | `CSSProperties` | `undefined` | Estilos en línea del elemento raíz |
| `classNames` | `SemanticClassNames<TransferSemanticSlot>` | `undefined` | Nombres de clase semánticos para slots del componente |
| `styles` | `SemanticStyles<TransferSemanticSlot>` | `undefined` | Estilos en línea semánticos para slots del componente |

#### Interfaz TransferItem

```typescript
interface TransferItem {
  key: string;           // Identificador único
  title: string;         // Título de visualización (usado para renderizado y búsqueda por defecto)
  description?: string;  // Descripción opcional
  disabled?: boolean;    // Si el item está deshabilitado
  [key: string]: unknown; // Propiedades personalizadas adicionales
}
```

#### Tipo TransferDirection

```typescript
type TransferDirection = 'left' | 'right';
```

#### Dimensiones Predeterminadas

- **Ancho del panel de lista**: 12rem (192px)
- **Altura del panel de lista**: 18rem (288px)
- **Tamaño de página de paginación predeterminado**: 10 items

#### Slots de DOM Semántico

| Slot | Descripción |
|------|-------------|
| `root` | El contenedor raíz que envuelve ambas listas y operaciones |
| `list` | Panel de lista individual (aplicado tanto a origen como destino) |
| `header` | Encabezado de lista que contiene checkbox, título y conteo |
| `search` | Contenedor del input de búsqueda |
| `item` | Fila de item de transferencia individual |
| `operation` | Contenedor de botones de operación (flechas de transferencia) |

#### Ejemplos

**Uso básico:**
```tsx
import { Transfer } from 'j-ui';

const [targetKeys, setTargetKeys] = useState<string[]>([]);

const dataSource = [
  { key: '1', title: 'Item 1' },
  { key: '2', title: 'Item 2' },
  { key: '3', title: 'Item 3', disabled: true },
];

<Transfer
  dataSource={dataSource}
  targetKeys={targetKeys}
  onChange={(newTargetKeys) => setTargetKeys(newTargetKeys)}
/>
```

**Con búsqueda:**
```tsx
<Transfer
  dataSource={dataSource}
  targetKeys={targetKeys}
  onChange={setTargetKeys}
  showSearch
  onSearch={(direction, value) => {
    console.log(`Buscando en lista ${direction}:`, value);
  }}
/>
```

**Títulos y operaciones personalizadas:**
```tsx
<Transfer
  dataSource={dataSource}
  targetKeys={targetKeys}
  onChange={setTargetKeys}
  titles={['Disponibles', 'Seleccionados']}
  operations={['Agregar', 'Remover']}
/>
```

**Renderizado de item personalizado:**
```tsx
<Transfer
  dataSource={dataSource}
  targetKeys={targetKeys}
  onChange={setTargetKeys}
  render={(item) => (
    <div>
      <strong>{item.title}</strong>
      {item.description && <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
        {item.description}
      </div>}
    </div>
  )}
/>
```

**Transferencia unidireccional (con iconos de remover):**
```tsx
<Transfer
  dataSource={dataSource}
  targetKeys={targetKeys}
  onChange={setTargetKeys}
  oneWay
  titles={['Todos los Items', 'Mi Selección']}
/>
```

**Con paginación:**
```tsx
<Transfer
  dataSource={largeDataSource} // 100+ items
  targetKeys={targetKeys}
  onChange={setTargetKeys}
  pagination={{ pageSize: 15 }}
  showSearch
/>
```

**Con filtro personalizado:**
```tsx
<Transfer
  dataSource={dataSource}
  targetKeys={targetKeys}
  onChange={setTargetKeys}
  showSearch
  filterOption={(inputValue, item) => {
    // Búsqueda personalizada: verificar título y descripción
    const search = inputValue.toLowerCase();
    return (
      item.title.toLowerCase().includes(search) ||
      item.description?.toLowerCase().includes(search) ||
      false
    );
  }}
/>
```

**Con pie de página:**
```tsx
<Transfer
  dataSource={dataSource}
  targetKeys={targetKeys}
  onChange={setTargetKeys}
  footer={(props) => (
    <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
      {props.direction === 'left' ? 'Selecciona items para transferir' : 'Items seleccionados'}
    </div>
  )}
/>
```

**Con estado de validación:**
```tsx
<Transfer
  dataSource={dataSource}
  targetKeys={targetKeys}
  onChange={setTargetKeys}
  status={targetKeys.length === 0 ? 'error' : undefined}
/>
```

**Selección controlada:**
```tsx
const [targetKeys, setTargetKeys] = useState<string[]>([]);
const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

<Transfer
  dataSource={dataSource}
  targetKeys={targetKeys}
  selectedKeys={selectedKeys}
  onChange={(newTargetKeys, direction, moveKeys) => {
    console.log('Movidos:', moveKeys, 'hacia', direction);
    setTargetKeys(newTargetKeys);
  }}
  onSelectChange={(sourceSelected, targetSelected) => {
    setSelectedKeys([...sourceSelected, ...targetSelected]);
  }}
/>
```

</details>

---

<details>
<summary><strong>TreeSelect</strong> - Selección de árbol jerárquico</summary>

### TreeSelect

`TreeSelect` es un componente selector de árbol jerárquico que permite a los usuarios seleccionar valores de una estructura de árbol. Soporta modos de selección simple y múltiple, checkboxes con comportamiento en cascada, filtrado por búsqueda, carga diferida y visualización de líneas de árbol.

**Importación:**
```tsx
import { TreeSelect } from 'j-ui';
```

#### Props

| Prop | Tipo | Predeterminado | Descripción |
|------|------|----------------|-------------|
| `treeData` | `TreeSelectTreeData[]` | `[]` | Fuente de datos del árbol jerárquico |
| `fieldNames` | `TreeSelectFieldNames` | `{ label: 'title', value: 'value', children: 'children' }` | Mapeo personalizado de nombres de campos |
| `value` | `string \| number \| (string \| number)[]` | `undefined` | Valor controlado |
| `defaultValue` | `string \| number \| (string \| number)[]` | `''` o `[]` | Valor inicial (modo no controlado) |
| `onChange` | `(value: any, labelList: ReactNode[], extra: { triggerValue }) => void` | `undefined` | Callback cuando cambia la selección |
| `multiple` | `boolean` | `false` | Permitir selección múltiple (sin checkboxes) |
| `treeCheckable` | `boolean` | `false` | Mostrar checkboxes para selección |
| `treeCheckStrictly` | `boolean` | `false` | Selección independiente de checkbox (sin cascada) |
| `showCheckedStrategy` | `'SHOW_ALL' \| 'SHOW_PARENT' \| 'SHOW_CHILD'` | `'SHOW_ALL'` | Estrategia para mostrar valores marcados |
| `treeDefaultExpandAll` | `boolean` | `false` | Expandir todos los nodos del árbol por defecto |
| `treeDefaultExpandedKeys` | `(string \| number)[]` | `[]` | Claves de nodos expandidos por defecto (no controlado) |
| `treeExpandedKeys` | `(string \| number)[]` | `undefined` | Claves de nodos expandidos controladas |
| `onTreeExpand` | `(expandedKeys: (string \| number)[]) => void` | `undefined` | Callback cuando cambia la expansión del árbol |
| `loadData` | `(node: TreeSelectTreeData) => Promise<void>` | `undefined` | Cargar datos asincrónicamente para un nodo |
| `treeLine` | `boolean` | `false` | Mostrar líneas de árbol conectando nodos |
| `switcherIcon` | `ReactNode` | `undefined` | Icono personalizado de expandir/colapsar |
| `showSearch` | `boolean` | `false` | Habilitar input de búsqueda |
| `filterTreeNode` | `boolean \| ((inputValue: string, treeNode: TreeSelectTreeData) => boolean)` | `true` | Función de filtro para búsqueda (false deshabilita) |
| `treeNodeFilterProp` | `string` | `'title'` | Nombre de propiedad para filtrar |
| `allowClear` | `boolean` | `false` | Mostrar botón de limpiar |
| `placeholder` | `string` | `undefined` | Texto de placeholder cuando está vacío |
| `disabled` | `boolean` | `false` | Si el TreeSelect está deshabilitado |
| `size` | `'large' \| 'middle' \| 'small'` | `'middle'` | Tamaño del selector |
| `variant` | `'outlined' \| 'filled' \| 'borderless' \| 'underlined'` | `'outlined'` | Variante visual |
| `status` | `'error' \| 'warning'` | `undefined` | Estado de validación |
| `placement` | `'bottomLeft' \| 'bottomRight' \| 'topLeft' \| 'topRight'` | `'bottomLeft'` | Posición del desplegable |
| `maxCount` | `number` | `undefined` | Número máximo de items seleccionados |
| `maxTagCount` | `number` | `undefined` | Número máximo de tags a mostrar |
| `maxTagPlaceholder` | `ReactNode \| ((omittedValues) => ReactNode)` | `'+N'` | Placeholder para tags ocultos |
| `tagRender` | `(props: TreeSelectTagRenderProps) => ReactNode` | `undefined` | Renderizador personalizado de tags |
| `notFoundContent` | `ReactNode` | `'No data'` | Contenido cuando no se encuentran resultados |
| `listHeight` | `number` | `256` | Altura máxima del desplegable en píxeles |
| `popupMatchSelectWidth` | `boolean \| number` | `true` | Coincidir ancho del desplegable con el selector |
| `dropdownRender` | `(menu: ReactNode) => ReactNode` | `undefined` | Wrapper personalizado del contenido del desplegable |
| `suffixIcon` | `ReactNode` | `<ChevronDownIcon />` | Icono de sufijo personalizado |
| `prefix` | `ReactNode` | `undefined` | Elemento prefijo |
| `onSearch` | `(value: string) => void` | `undefined` | Callback cuando cambia el input de búsqueda |
| `onDropdownVisibleChange` | `(open: boolean) => void` | `undefined` | Callback cuando cambia la visibilidad del desplegable |
| `onClear` | `() => void` | `undefined` | Callback cuando se hace clic en el botón de limpiar |
| `open` | `boolean` | `undefined` | Estado de apertura del desplegable controlado |
| `className` | `string` | `undefined` | Nombre de clase del elemento raíz |
| `style` | `CSSProperties` | `undefined` | Estilos en línea del elemento raíz |
| `classNames` | `SemanticClassNames<TreeSelectSemanticSlot>` | `undefined` | Nombres de clase semánticos |
| `styles` | `SemanticStyles<TreeSelectSemanticSlot>` | `undefined` | Estilos en línea semánticos |

#### Interfaz TreeSelectTreeData

```typescript
interface TreeSelectTreeData {
  value: string | number;          // Valor único del nodo
  title?: ReactNode;               // Etiqueta de visualización
  children?: TreeSelectTreeData[]; // Nodos hijos
  disabled?: boolean;              // Deshabilitar nodo completo
  disableCheckbox?: boolean;       // Deshabilitar solo checkbox
  selectable?: boolean;            // Si el nodo es seleccionable
  isLeaf?: boolean;                // Marcar como hoja (para carga diferida)
  [key: string]: unknown;          // Propiedades personalizadas adicionales
}
```

#### Interfaz TreeSelectFieldNames

```typescript
interface TreeSelectFieldNames {
  label?: string;    // Nombre del campo para etiqueta de visualización (por defecto: 'title')
  value?: string;    // Nombre del campo para valor (por defecto: 'value')
  children?: string; // Nombre del campo para array de hijos (por defecto: 'children')
}
```

#### Interfaz TreeSelectTagRenderProps

```typescript
interface TreeSelectTagRenderProps {
  label: ReactNode;
  value: string | number;
  closable: boolean;
  onClose: () => void;
}
```

#### Estrategia de Mostrar Marcados

- **`SHOW_ALL`**: Mostrar todos los nodos marcados (incluyendo padres e hijos)
- **`SHOW_PARENT`**: Solo mostrar nodos padres si todos los hijos están seleccionados
- **`SHOW_CHILD`**: Solo mostrar nodos hoja (nodos hijos sin hijos)

#### Configuración de Tamaños

| Tamaño | Altura | Tamaño de Fuente | Altura de Tag |
|--------|--------|------------------|---------------|
| `large` | 2.5rem (40px) | 1rem (16px) | 1.75rem |
| `middle` | 2.25rem (36px) | 0.875rem (14px) | 1.5rem |
| `small` | 1.75rem (28px) | 0.875rem (14px) | 1rem |

#### Slots de DOM Semántico

| Slot | Descripción |
|------|-------------|
| `root` | El elemento contenedor raíz |
| `selector` | El área de selector/input donde se muestran los valores |
| `dropdown` | El panel desplegable que contiene el árbol |
| `tree` | El contenedor del árbol |
| `node` | Fila de nodo individual del árbol |
| `tag` | Elemento tag (para modo múltiple) |

#### Navegación por Teclado

- **Flecha Abajo/Arriba**: Navegar a través de nodos visibles del árbol
- **Flecha Derecha**: Expandir nodo enfocado
- **Flecha Izquierda**: Colapsar nodo enfocado
- **Enter**: Seleccionar/marcar nodo enfocado
- **Escape**: Cerrar desplegable y limpiar búsqueda
- **Backspace**: Remover último tag (en modo múltiple cuando la búsqueda está vacía)

#### Ejemplos

**Uso básico:**
```tsx
import { TreeSelect } from 'j-ui';

const treeData = [
  {
    value: 'parent1',
    title: 'Padre 1',
    children: [
      { value: 'child1', title: 'Hijo 1' },
      { value: 'child2', title: 'Hijo 2' },
    ],
  },
  { value: 'parent2', title: 'Padre 2' },
];

<TreeSelect
  treeData={treeData}
  placeholder="Seleccionar nodo"
  onChange={(value, labels) => console.log('Seleccionado:', value, labels)}
/>
```

**Con checkboxes (en cascada):**
```tsx
<TreeSelect
  treeData={treeData}
  treeCheckable
  placeholder="Seleccionar items"
  onChange={(values) => console.log('Marcados:', values)}
/>
```

**Checkboxes independientes (sin cascada):**
```tsx
<TreeSelect
  treeData={treeData}
  treeCheckable
  treeCheckStrictly
  showCheckedStrategy={TreeSelect.SHOW_ALL}
/>
```

**Mostrar solo nodos padre:**
```tsx
<TreeSelect
  treeData={treeData}
  treeCheckable
  showCheckedStrategy={TreeSelect.SHOW_PARENT}
  placeholder="Seleccionar categorías"
/>
```

**Mostrar solo nodos hoja:**
```tsx
<TreeSelect
  treeData={treeData}
  treeCheckable
  showCheckedStrategy={TreeSelect.SHOW_CHILD}
  placeholder="Seleccionar items"
/>
```

**Con búsqueda:**
```tsx
<TreeSelect
  treeData={treeData}
  showSearch
  placeholder="Buscar y seleccionar"
  onSearch={(value) => console.log('Buscando:', value)}
/>
```

**Filtro de búsqueda personalizado:**
```tsx
<TreeSelect
  treeData={treeData}
  showSearch
  filterTreeNode={(input, node) => {
    return node.title?.toString().toLowerCase().includes(input.toLowerCase()) || false;
  }}
/>
```

**Con líneas de árbol:**
```tsx
<TreeSelect
  treeData={treeData}
  treeLine
  treeDefaultExpandAll
  placeholder="Seleccionar con líneas de árbol"
/>
```

**Carga diferida:**
```tsx
const [treeData, setTreeData] = useState([
  { value: '0', title: 'Nodo 0', isLeaf: false },
]);

const loadData = async (node) => {
  // Simular carga asincrónica
  await new Promise(resolve => setTimeout(resolve, 1000));

  const children = [
    { value: `${node.value}-0`, title: `Hijo ${node.value}-0`, isLeaf: true },
    { value: `${node.value}-1`, title: `Hijo ${node.value}-1`, isLeaf: true },
  ];

  // Actualizar treeData para agregar hijos a este nodo
  setTreeData(prev => updateTreeData(prev, node.value, children));
};

<TreeSelect
  treeData={treeData}
  loadData={loadData}
  placeholder="Carga diferida de nodos"
/>
```

**Selección múltiple sin checkboxes:**
```tsx
<TreeSelect
  treeData={treeData}
  multiple
  placeholder="Seleccionar múltiples"
  maxTagCount={3}
  maxTagPlaceholder={(omitted) => `+${omitted.length} más`}
/>
```

**Nombres de campo personalizados:**
```tsx
const customData = [
  {
    id: '1',
    name: 'Padre',
    items: [
      { id: '1-1', name: 'Hijo 1' },
      { id: '1-2', name: 'Hijo 2' },
    ],
  },
];

<TreeSelect
  treeData={customData}
  fieldNames={{
    label: 'name',
    value: 'id',
    children: 'items',
  }}
/>
```

**Con renderizado de tag personalizado:**
```tsx
<TreeSelect
  treeData={treeData}
  treeCheckable
  tagRender={({ label, onClose }) => (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.125rem 0.5rem',
      backgroundColor: '#1890ff',
      color: '#fff',
      borderRadius: '0.25rem',
    }}>
      {label}
      <span onClick={onClose} style={{ marginLeft: '0.25rem', cursor: 'pointer' }}>×</span>
    </span>
  )}
/>
```

**Nodos deshabilitados:**
```tsx
const dataWithDisabled = [
  {
    value: 'parent1',
    title: 'Padre 1',
    children: [
      { value: 'child1', title: 'Hijo 1' },
      { value: 'child2', title: 'Hijo 2 (deshabilitado)', disabled: true },
    ],
  },
];

<TreeSelect treeData={dataWithDisabled} />
```

**Con estado de validación:**
```tsx
<TreeSelect
  treeData={treeData}
  status="error"
  placeholder="Seleccionar campo requerido"
/>
```

</details>

---

<details>
<summary><strong>Upload</strong> - Carga de archivos</summary>

### Upload

`Upload` es un componente de carga de archivos que soporta selección múltiple, arrastrar y soltar, seguimiento de progreso, vista previa y solicitudes de carga personalizadas. Proporciona diferentes modos de visualización incluyendo listas de texto, miniaturas de imágenes y diseños de tarjetas.

**Importación:**
```tsx
import { Upload } from 'j-ui';
```

#### Props

| Prop | Tipo | Predeterminado | Descripción |
|------|------|----------------|-------------|
| `accept` | `string` | `undefined` | Tipos de archivo aceptados (ej., `'image/*'`, `'.pdf,.doc'`) |
| `action` | `string \| ((file: UploadFile) => Promise<string>)` | `undefined` | URL de carga o función asíncrona que devuelve URL |
| `beforeUpload` | `(file: File, fileList: File[]) => boolean \| string \| Promise<File \| boolean \| void> \| void` | `undefined` | Hook de validación pre-carga |
| `customRequest` | `(options: UploadRequestOption) => { abort: () => void } \| void` | XMLHttpRequest integrado | Implementación de carga personalizada |
| `data` | `Record<string, unknown> \| ((file: UploadFile) => Record<string, unknown> \| Promise<...>)` | `undefined` | Datos adicionales para enviar con la carga |
| `defaultFileList` | `UploadFile[]` | `[]` | Lista de archivos inicial (modo no controlado) |
| `fileList` | `UploadFile[]` | `undefined` | Lista de archivos controlada |
| `directory` | `boolean` | `false` | Habilitar carga de carpetas/directorios |
| `disabled` | `boolean` | `false` | Si la carga está deshabilitada |
| `headers` | `Record<string, string>` | `undefined` | Headers HTTP personalizados para la solicitud de carga |
| `listType` | `'text' \| 'picture' \| 'picture-card' \| 'picture-circle'` | `'text'` | Estilo de visualización de la lista de archivos |
| `maxCount` | `number` | `undefined` | Número máximo de archivos permitidos |
| `method` | `string` | `'post'` | Método HTTP para la carga |
| `multiple` | `boolean` | `false` | Permitir selección múltiple de archivos |
| `name` | `string` | `'file'` | Nombre del parámetro de archivo enviado al backend |
| `openFileDialogOnClick` | `boolean` | `true` | Abrir diálogo de archivo al hacer clic en el disparador |
| `showUploadList` | `ShowUploadListConfig` | `true` | Mostrar/configurar visualización de lista de archivos |
| `withCredentials` | `boolean` | `false` | Incluir credenciales en solicitudes CORS |
| `progress` | `UploadProgressConfig` | `undefined` | Configuración de barra de progreso |
| `itemRender` | `(originNode, file, fileList, actions) => ReactNode` | `undefined` | Renderizador personalizado de items de lista |
| `onChange` | `(info: UploadChangeParam) => void` | `undefined` | Callback cuando cambia el estado de carga |
| `onPreview` | `(file: UploadFile) => void` | `undefined` | Callback cuando se hace clic en el icono de vista previa |
| `onDownload` | `(file: UploadFile) => void` | `undefined` | Callback cuando se hace clic en el icono de descarga |
| `onRemove` | `(file: UploadFile) => boolean \| Promise<boolean> \| void` | `undefined` | Callback antes de eliminar archivo (devolver false para prevenir) |
| `onDrop` | `(event: DragEvent) => void` | `undefined` | Callback cuando se sueltan archivos |
| `children` | `ReactNode` | `undefined` | Elemento disparador personalizado |
| `className` | `string` | `undefined` | Nombre de clase del elemento raíz |
| `style` | `CSSProperties` | `undefined` | Estilos en línea del elemento raíz |
| `classNames` | `SemanticClassNames<UploadSemanticSlot>` | `undefined` | Nombres de clase semánticos |
| `styles` | `SemanticStyles<UploadSemanticSlot>` | `undefined` | Estilos en línea semánticos |

#### Interfaz UploadFile

```typescript
interface UploadFile<T = any> {
  uid: string;                 // Identificador único
  name: string;                // Nombre del archivo
  status?: UploadFileStatus;   // 'uploading' | 'done' | 'error' | 'removed'
  percent?: number;            // Progreso de carga (0-100)
  thumbUrl?: string;           // URL de miniatura
  url?: string;                // URL del archivo después de la carga
  type?: string;               // Tipo MIME
  size?: number;               // Tamaño del archivo en bytes
  originFileObj?: File;        // Objeto File original
  response?: T;                // Respuesta del servidor
  error?: any;                 // Objeto de error si la carga falló
  crossOrigin?: '' | 'anonymous' | 'use-credentials';
  preview?: string;            // Vista previa Base64 para imágenes
}
```

#### Tipo ShowUploadListConfig

```typescript
type ShowUploadListConfig = boolean | {
  showPreviewIcon?: boolean;
  showRemoveIcon?: boolean;
  showDownloadIcon?: boolean;
  previewIcon?: ReactNode | ((file: UploadFile) => ReactNode);
  removeIcon?: ReactNode | ((file: UploadFile) => ReactNode);
  downloadIcon?: ReactNode | ((file: UploadFile) => ReactNode);
};
```

#### Interfaz UploadProgressConfig

```typescript
interface UploadProgressConfig {
  strokeColor?: string;
  strokeWidth?: number;
  format?: (percent: number, file: UploadFile) => ReactNode;
}
```

#### Interfaz UploadRef

```typescript
interface UploadRef {
  upload: (file?: UploadFile) => void;  // Disparar carga manualmente
  nativeElement: HTMLDivElement | null;
}
```

#### Slots de DOM Semántico

| Slot | Descripción |
|------|-------------|
| `root` | El elemento contenedor raíz |
| `trigger` | El elemento disparador clickeable |
| `dragger` | Área de arrastrar y soltar (Upload.Dragger) |
| `list` | Contenedor de lista de archivos |
| `item` | Item individual de lista de archivos |
| `itemActions` | Contenedor de botones de acción para cada item |
| `thumbnail` | Imagen miniatura o icono |

#### Valores de Retorno de beforeUpload

- `false`: Prevenir carga pero agregar archivo a la lista
- `Upload.LIST_IGNORE`: No agregar archivo a la lista en absoluto
- `Promise<File>`: Transformar archivo antes de cargar
- `Promise<false>`: Validación asíncrona para prevenir carga

#### Ejemplos

**Uso básico:**
```tsx
import { Upload, Button } from 'j-ui';

<Upload
  action="/api/upload"
  onChange={(info) => {
    if (info.file.status === 'done') {
      console.log('Carga exitosa:', info.file.response);
    } else if (info.file.status === 'error') {
      console.log('Carga fallida:', info.file.error);
    }
  }}
>
  <Button>Haz clic para Cargar</Button>
</Upload>
```

**Lista de imágenes:**
```tsx
<Upload
  action="/api/upload"
  listType="picture"
  defaultFileList={[
    {
      uid: '-1',
      name: 'imagen.png',
      status: 'done',
      url: 'https://example.com/imagen.png',
    },
  ]}
>
  <Button>Cargar Imagen</Button>
</Upload>
```

**Tarjeta de imagen (diseño de cuadrícula):**
```tsx
<Upload
  action="/api/upload"
  listType="picture-card"
  maxCount={4}
>
  <div>
    <PlusIcon />
    <div>Cargar</div>
  </div>
</Upload>
```

**Arrastrar y soltar:**
```tsx
<Upload.Dragger
  action="/api/upload"
  multiple
  onChange={(info) => console.log('Archivos:', info.fileList)}
>
  <p>Haz clic o arrastra archivos a esta área para cargar</p>
  <p>Soporta carga individual o masiva</p>
</Upload.Dragger>
```

**Con restricción de tipo de archivo:**
```tsx
<Upload
  action="/api/upload"
  accept="image/*"
  beforeUpload={(file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      console.error('¡Solo puedes cargar archivos JPG/PNG!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      console.error('¡La imagen debe ser menor a 2MB!');
      return false;
    }
    return true;
  }}
>
  <Button>Cargar Imagen (JPG/PNG, máx 2MB)</Button>
</Upload>
```

**Lista de archivos controlada:**
```tsx
const [fileList, setFileList] = useState<UploadFile[]>([]);

<Upload
  action="/api/upload"
  fileList={fileList}
  onChange={({ fileList: newFileList }) => setFileList(newFileList)}
  onRemove={(file) => {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList);
  }}
>
  <Button>Cargar</Button>
</Upload>
```

**Disparador de carga manual:**
```tsx
const uploadRef = useRef<UploadRef>(null);
const [fileList, setFileList] = useState<UploadFile[]>([]);

<>
  <Upload
    ref={uploadRef}
    action="/api/upload"
    fileList={fileList}
    onChange={({ fileList }) => setFileList(fileList)}
    beforeUpload={() => false} // Prevenir auto-carga
  >
    <Button>Seleccionar Archivo</Button>
  </Upload>
  <Button
    onClick={() => uploadRef.current?.upload()}
    disabled={fileList.length === 0}
  >
    Iniciar Carga
  </Button>
</>
```

**Solicitud personalizada:**
```tsx
<Upload
  customRequest={async (options) => {
    const formData = new FormData();
    formData.append('file', options.file);

    try {
      const response = await fetch(options.action, {
        method: 'POST',
        body: formData,
        onUploadProgress: (e) => {
          options.onProgress({ percent: (e.loaded / e.total) * 100 });
        },
      });
      const data = await response.json();
      options.onSuccess(data, options.file);
    } catch (error) {
      options.onError(error);
    }
  }}
  action="/api/upload"
>
  <Button>Cargar con Solicitud Personalizada</Button>
</Upload>
```

**Con visualización de progreso personalizada:**
```tsx
<Upload
  action="/api/upload"
  progress={{
    strokeWidth: 3,
    strokeColor: '#52c41a',
    format: (percent) => `${Math.round(percent)}% cargado`,
  }}
>
  <Button>Cargar con Progreso Personalizado</Button>
</Upload>
```

**URL de carga dinámica:**
```tsx
<Upload
  action={async (file) => {
    // Obtener URL prefirmada del servidor
    const response = await fetch('/api/get-upload-url', {
      method: 'POST',
      body: JSON.stringify({ filename: file.name }),
    });
    const { url } = await response.json();
    return url;
  }}
>
  <Button>Cargar a URL Dinámica</Button>
</Upload>
```

**Con modal de vista previa:**
```tsx
const [previewUrl, setPreviewUrl] = useState('');
const [previewVisible, setPreviewVisible] = useState(false);

<>
  <Upload
    action="/api/upload"
    listType="picture-card"
    onPreview={(file) => {
      setPreviewUrl(file.url || file.thumbUrl || '');
      setPreviewVisible(true);
    }}
  >
    <div>Cargar</div>
  </Upload>
  {previewVisible && (
    <Modal open onClose={() => setPreviewVisible(false)}>
      <img src={previewUrl} alt="vista previa" style={{ width: '100%' }} />
    </Modal>
  )}
</>
```

**Carga de directorio:**
```tsx
<Upload
  action="/api/upload"
  directory
  multiple
  onChange={(info) => {
    console.log('Archivos del directorio cargado:', info.fileList);
  }}
>
  <Button>Cargar Carpeta</Button>
</Upload>
```

**Transformar archivo antes de cargar:**
```tsx
<Upload
  action="/api/upload"
  beforeUpload={async (file) => {
    // Comprimir imagen antes de cargar
    if (file.type.startsWith('image/')) {
      const compressed = await compressImage(file);
      return compressed;
    }
    return file;
  }}
>
  <Button>Cargar (Auto-comprimir imágenes)</Button>
</Upload>
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
