# J-UI

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> **🇪🇸 [Leer en Español](./README.es.md)**

A modern, lightweight React component library with built-in theming support.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Theme System](#theme-system)
  - [ThemeProvider](#themeprovider)
  - [useTheme Hook](#usetheme-hook)
  - [Color System](#color-system)
  - [Theme Tokens](#theme-tokens)
- [Components](#components)
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

## Features

- Fully typed with TypeScript
- Built-in dark/light mode support
- Automatic color palette generation
- CSS variables for easy customization
- Tree-shakeable and lightweight
- React 18 & 19 compatible

## Installation

```bash
# npm
npm install j-ui

# yarn
yarn add j-ui

# pnpm
pnpm add j-ui
```

## Quick Start

Wrap your application with `ThemeProvider` and start using components:

```tsx
import { ThemeProvider, Button, Tooltip } from 'j-ui'

function App() {
  return (
    <ThemeProvider>
      <Tooltip content="Click me!">
        <Button>Hello J-UI</Button>
      </Tooltip>
    </ThemeProvider>
  )
}
```

---

## Theme System

J-UI includes a powerful theming system that automatically generates color palettes and handles light/dark mode switching.

### ThemeProvider

The `ThemeProvider` component must wrap your application to enable theming functionality.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Application content |
| `config` | `ThemeConfig` | `{}` | Theme configuration object |

#### ThemeConfig

```typescript
interface ThemeConfig {
  colors?: ThemeColors      // Custom color palette
  defaultMode?: ThemeMode   // 'light' | 'dark'
}

interface ThemeColors {
  primary?: string    // Default: '#8c75d1'
  secondary?: string  // Default: '#78808b'
  success?: string    // Default: '#79bc58'
  warning?: string    // Default: '#d5ac59'
  error?: string      // Default: '#d7595b'
  info?: string       // Default: '#6591c7'
}
```

#### Usage

```tsx
// Basic usage
<ThemeProvider>
  <App />
</ThemeProvider>

// With custom configuration
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

### useTheme Hook

Access and control the current theme from any component within the `ThemeProvider`.

```typescript
const { mode, setMode, toggleMode } = useTheme()
```

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `mode` | `'light' \| 'dark'` | Current theme mode |
| `setMode` | `(mode: ThemeMode) => void` | Set theme mode explicitly |
| `toggleMode` | `() => void` | Toggle between light and dark |

#### Example

```tsx
import { useTheme, Button } from 'j-ui'

function ThemeToggle() {
  const { mode, toggleMode } = useTheme()

  return (
    <Button onClick={toggleMode}>
      Current: {mode}
    </Button>
  )
}
```

### Color System

J-UI automatically generates 10 shades (50-900) for each semantic color. These are available as CSS variables:

```css
/* Base color */
var(--j-primary)

/* Color variants */
var(--j-primary-50)   /* Lightest */
var(--j-primary-100)
var(--j-primary-200)
var(--j-primary-300)
var(--j-primary-400)
var(--j-primary-500)
var(--j-primary-600)
var(--j-primary-700)
var(--j-primary-800)
var(--j-primary-900)  /* Darkest */

/* Semantic aliases */
var(--j-primary-light)     /* Light variant */
var(--j-primary-dark)      /* Dark variant */
var(--j-primary-hover)     /* Hover state */
var(--j-primary-border)    /* Border color */
var(--j-primary-contrast)  /* Contrast text color */
```

#### Neutral Colors

These automatically adapt based on the current theme mode:

| Variable | Description |
|----------|-------------|
| `--j-bg` | Background color |
| `--j-bgSubtle` | Subtle background |
| `--j-bgMuted` | Muted background |
| `--j-border` | Border color |
| `--j-borderHover` | Border hover color |
| `--j-text` | Primary text color |
| `--j-textMuted` | Muted text |
| `--j-textSubtle` | Subtle text |
| `--j-shadowSm` | Small shadow |
| `--j-shadowMd` | Medium shadow |
| `--j-shadowLg` | Large shadow |

### Theme Tokens

J-UI provides a `tokens` object with typed references to all CSS variables. This enables autocomplete in your IDE and type-safe styling in JavaScript/TypeScript.

#### Import

```tsx
import { tokens } from 'j-ui'
```

#### Usage

```tsx
// In inline styles
<div style={{
  backgroundColor: tokens.colorPrimaryBg,
  color: tokens.colorPrimary,
  boxShadow: tokens.shadowMd
}}>
  Styled with tokens
</div>

// In styled-components, emotion, etc.
const StyledCard = styled.div`
  background: ${tokens.colorBgSubtle};
  border: 1px solid ${tokens.colorBorder};
`
```

#### Available Tokens

**Semantic Colors** (for each: primary, secondary, success, warning, error, info):

| Token | CSS Variable |
|-------|--------------|
| `tokens.colorPrimary` | `var(--j-primary)` |
| `tokens.colorPrimaryHover` | `var(--j-primary-hover)` |
| `tokens.colorPrimaryBg` | `var(--j-primary-dark)` |
| `tokens.colorPrimaryBorder` | `var(--j-primary-border)` |
| `tokens.colorPrimaryContrast` | `var(--j-primary-contrast)` |
| `tokens.colorPrimary50` - `tokens.colorPrimary900` | `var(--j-primary-50)` - `var(--j-primary-900)` |

**Neutral Colors**:

| Token | CSS Variable |
|-------|--------------|
| `tokens.colorBg` | `var(--j-bg)` |
| `tokens.colorBgSubtle` | `var(--j-bgSubtle)` |
| `tokens.colorBgMuted` | `var(--j-bgMuted)` |
| `tokens.colorBorder` | `var(--j-border)` |
| `tokens.colorBorderHover` | `var(--j-borderHover)` |
| `tokens.colorText` | `var(--j-text)` |
| `tokens.colorTextMuted` | `var(--j-textMuted)` |
| `tokens.colorTextSubtle` | `var(--j-textSubtle)` |

**Shadows**:

| Token | CSS Variable |
|-------|--------------|
| `tokens.shadowSm` | `var(--j-shadowSm)` |
| `tokens.shadowMd` | `var(--j-shadowMd)` |
| `tokens.shadowLg` | `var(--j-shadowLg)` |

---

## Semantic DOM Styling

Most J-UI components expose `classNames` and `styles` props that allow you to style their internal parts (semantic slots) without needing to override CSS or inspect the DOM structure.

### How it works

Each component defines named **slots** representing its internal parts. You can target these slots using:

- **`classNames`** — apply CSS classes to specific internal parts
- **`styles`** — apply inline styles to specific internal parts

```tsx
// Apply a CSS class to the popup part of a Tooltip
<Tooltip
  content="Hello"
  classNames={{ popup: 'my-custom-popup' }}
>
  <Button>Hover me</Button>
</Tooltip>

// Apply inline styles to the icon and content parts of a Button
<Button
  icon={<SearchIcon />}
  styles={{
    icon: { color: 'red' },
    content: { fontWeight: 'bold' },
  }}
>
  Search
</Button>
```

### Priority order

Styles are merged with the following priority (highest wins):

1. **Component base styles** — internal defaults
2. **`styles.slot`** — semantic styles for each slot
3. **`style` prop** — direct style prop (only applies to `root`)

For `className`, the component-level `className` prop and `classNames.root` are merged together.

### Available slots per component

| Component | Slots |
|-----------|-------|
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

## Components

<details>
<summary><strong>AutoComplete</strong> - Input with auto-suggestion dropdown</summary>

### AutoComplete

An input component with auto-complete suggestions. Supports filtering, grouped options, keyboard navigation, backfill, controlled/uncontrolled state, multiple variants, validation status, clear button, and auto-flip dropdown positioning.

#### Import

```tsx
import { AutoComplete } from 'j-ui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `AutoCompleteOption[]` | `[]` | Available options |
| `value` | `string` | — | Controlled input value |
| `defaultValue` | `string` | `''` | Default input value (uncontrolled) |
| `placeholder` | `string` | — | Input placeholder text |
| `open` | `boolean` | — | Controlled dropdown visibility |
| `defaultOpen` | `boolean` | `false` | Default dropdown visibility |
| `disabled` | `boolean` | `false` | Disable the component |
| `allowClear` | `boolean` | `false` | Show clear button |
| `autoFocus` | `boolean` | `false` | Focus input on mount |
| `backfill` | `boolean` | `false` | Fill input with highlighted option value on keyboard navigation |
| `defaultActiveFirstOption` | `boolean` | `true` | Automatically highlight the first option |
| `variant` | `'outlined' \| 'filled' \| 'borderless'` | `'outlined'` | Input visual variant |
| `status` | `'error' \| 'warning'` | — | Validation status |
| `filterOption` | `boolean \| (inputValue, option) => boolean` | `true` | Filter function. `true` = case-insensitive includes, `false` = no filtering |
| `notFoundContent` | `ReactNode` | `null` | Content when no matches. `null` = hide dropdown |
| `popupMatchSelectWidth` | `boolean \| number` | `true` | `true` = match input width, number = fixed width |
| `onChange` | `(value: string) => void` | — | Called when value changes |
| `onSearch` | `(value: string) => void` | — | Called when user types |
| `onSelect` | `(value, option) => void` | — | Called when an option is selected |
| `onFocus` | `(e) => void` | — | Called on focus |
| `onBlur` | `(e) => void` | — | Called on blur |
| `onDropdownVisibleChange` | `(open: boolean) => void` | — | Called when dropdown visibility changes |
| `onClear` | `() => void` | — | Called when input is cleared |
| `prefix` | `ReactNode` | — | Prefix content in the input (e.g. icon on the left) |
| `suffix` | `ReactNode` | — | Suffix content in the input (e.g. icon on the right) |
| `className` | `string` | — | CSS class for the root element |
| `style` | `CSSProperties` | — | Inline styles for the root element |
| `classNames` | `AutoCompleteClassNames` | — | CSS classes for internal parts |
| `styles` | `AutoCompleteStyles` | — | Inline styles for internal parts |

#### Types

```tsx
type AutoCompleteVariant = 'outlined' | 'filled' | 'borderless'

type AutoCompleteStatus = 'error' | 'warning'

interface AutoCompleteOption {
  value: string
  label?: ReactNode
  disabled?: boolean
  options?: AutoCompleteOption[]  // for grouped options
}
```

#### Semantic DOM

| Slot | Description |
|------|-------------|
| `root` | Outer wrapper container |
| `input` | Input element |
| `dropdown` | Dropdown suggestions container |
| `option` | Individual option item |

#### Examples

**Basic usage**

```tsx
<AutoComplete
  options={[
    { value: 'React' },
    { value: 'Vue' },
    { value: 'Angular' },
  ]}
  placeholder="Search framework..."
/>
```

**Controlled value**

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

**Custom labels**

```tsx
<AutoComplete
  options={[
    { value: 'react', label: <span><strong>React</strong> - A JavaScript library</span> },
    { value: 'vue', label: <span><strong>Vue</strong> - The Progressive Framework</span> },
  ]}
/>
```

**Grouped options**

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
      value: 'languages',
      label: 'Languages',
      options: [
        { value: 'TypeScript' },
        { value: 'JavaScript' },
      ],
    },
  ]}
/>
```

**Custom filter**

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

**No filtering (async search)**

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

**Backfill mode**

```tsx
<AutoComplete
  backfill
  options={[
    { value: 'apple' },
    { value: 'banana' },
    { value: 'cherry' },
  ]}
/>
```

**Prefix & Suffix**

```tsx
// Prefix only
<AutoComplete
  prefix={<MailIcon />}
  options={[{ value: 'Option 1' }, { value: 'Option 2' }]}
  placeholder="With prefix"
/>

// Suffix only
<AutoComplete
  suffix={<SearchIcon />}
  options={[{ value: 'Option 1' }, { value: 'Option 2' }]}
  placeholder="With suffix"
/>

// Prefix + Suffix + Clear
<AutoComplete
  prefix={<GlobeIcon />}
  suffix={<SearchIcon />}
  allowClear
  options={[{ value: 'Option 1' }, { value: 'Option 2' }]}
  placeholder="With both"
/>
```

**Variants**

```tsx
<AutoComplete variant="outlined" options={[...]} placeholder="Outlined" />
<AutoComplete variant="filled" options={[...]} placeholder="Filled" />
<AutoComplete variant="borderless" options={[...]} placeholder="Borderless" />
```

**Validation status**

```tsx
<AutoComplete status="error" options={[...]} placeholder="Error" />
<AutoComplete status="warning" options={[...]} placeholder="Warning" />
```

**Not found content**

```tsx
<AutoComplete
  options={[]}
  notFoundContent="No results found"
  placeholder="Search..."
/>
```

**Disabled**

```tsx
<AutoComplete disabled options={[{ value: 'React' }]} value="React" />
```

</details>

---

<details>
<summary><strong>Anchor</strong> - Navigation links that track scroll position</summary>

### Anchor

A navigation component that renders a list of anchor links and highlights the currently active one based on scroll position. Supports vertical and horizontal layouts with nested links.

#### Import

```tsx
import { Anchor } from 'j-ui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `AnchorLinkItemProps[]` | `[]` | Declarative list of anchor links |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | Navigation direction |
| `offsetTop` | `number` | `0` | Offset in px from the top when calculating scroll position |
| `targetOffset` | `number` | `offsetTop` | Offset for scroll destination when clicking a link |
| `bounds` | `number` | `5` | Tolerance distance in px for detecting the active section |
| `getContainer` | `() => HTMLElement \| Window` | `() => window` | Scrollable container |
| `getCurrentAnchor` | `(activeLink: string) => string` | — | Custom function to determine the active link |
| `onChange` | `(currentActiveLink: string) => void` | — | Callback when the active link changes |
| `onClick` | `(e: MouseEvent, link: { title: ReactNode; href: string }) => void` | — | Callback when a link is clicked |
| `replace` | `boolean` | `false` | Use `replaceState` instead of `pushState` for URL updates |
| `className` | `string` | — | Additional CSS class |
| `style` | `CSSProperties` | — | Additional inline styles |

#### AnchorLinkItemProps

```typescript
interface AnchorLinkItemProps {
  key: string            // Unique key for the link
  href: string           // Link destination (must start with #)
  title: ReactNode       // Link content
  children?: AnchorLinkItemProps[]  // Nested links (vertical only)
}
```

#### Semantic DOM

| Slot | Description |
|------|-------------|
| `root` | Outer wrapper element |
| `track` | Background track line (vertical mode) |
| `indicator` | Active link indicator |
| `link` | Individual anchor link |

#### Examples

```tsx
// Basic vertical anchor
<Anchor
  items={[
    { key: 'section1', href: '#section1', title: 'Section 1' },
    { key: 'section2', href: '#section2', title: 'Section 2' },
    { key: 'section3', href: '#section3', title: 'Section 3' },
  ]}
/>

// Horizontal anchor
<Anchor
  direction="horizontal"
  items={[
    { key: 'overview', href: '#overview', title: 'Overview' },
    { key: 'features', href: '#features', title: 'Features' },
    { key: 'api', href: '#api', title: 'API' },
  ]}
/>

// Nested links (vertical only)
<Anchor
  items={[
    {
      key: 'components',
      href: '#components',
      title: 'Components',
      children: [
        { key: 'button', href: '#button', title: 'Button' },
        { key: 'input', href: '#input', title: 'Input' },
      ],
    },
    { key: 'hooks', href: '#hooks', title: 'Hooks' },
  ]}
/>

// With offset (e.g., for fixed header)
<Anchor
  offsetTop={64}
  items={[
    { key: 'intro', href: '#intro', title: 'Introduction' },
    { key: 'guide', href: '#guide', title: 'Guide' },
  ]}
/>

// Custom scroll container
<Anchor
  getContainer={() => document.getElementById('my-container')!}
  items={[
    { key: 'part1', href: '#part1', title: 'Part 1' },
    { key: 'part2', href: '#part2', title: 'Part 2' },
  ]}
/>

// With onChange callback
<Anchor
  onChange={(activeLink) => console.log('Active:', activeLink)}
  items={[
    { key: 'a', href: '#a', title: 'Section A' },
    { key: 'b', href: '#b', title: 'Section B' },
  ]}
/>

// Replace URL instead of push
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
<summary><strong>Badge</strong> - Compact label for status and metadata</summary>

### Badge

A compact label component for displaying status, categories, or metadata.

#### Import

```tsx
import { Badge } from 'j-ui'
// Optionally import tokens for type-safe colors
import { Badge, tokens } from 'j-ui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Badge content |
| `bgColor` | `string` | `'var(--j-primary-light)'` | Background color (CSS color, CSS variable, or token) |
| `color` | `string` | `'var(--j-primary)'` | Text and border color (CSS color, CSS variable, or token) |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | Border radius |
| `icon` | `ReactNode` | — | Optional icon on the left |
| `bordered` | `boolean` | `true` | Show border |

#### Radius Options

| Radius | Value |
|--------|-------|
| `none` | 0 |
| `sm` | 4px |
| `md` | 6px |
| `lg` | 12px |
| `full` | 9999px (pill shape) |

#### Semantic DOM

| Slot | Description |
|------|-------------|
| `root` | Outer wrapper element |
| `icon` | Icon element |
| `content` | Text content element |

#### Examples

```tsx
// Basic
<Badge>New</Badge>

// Using tokens (recommended - type-safe with autocomplete)
<Badge bgColor={tokens.colorSuccess100} color={tokens.colorSuccess}>
  Active
</Badge>

<Badge bgColor={tokens.colorError100} color={tokens.colorError}>
  Expired
</Badge>

<Badge bgColor={tokens.colorWarning100} color={tokens.colorWarning}>
  Pending
</Badge>

// Using CSS variables directly
<Badge bgColor="var(--j-info-light)" color="var(--j-info)">
  Info
</Badge>

// Different radius
<Badge radius="none">Square</Badge>
<Badge radius="full">Pill</Badge>

// With icon
<Badge icon={<CheckIcon />}>Verified</Badge>

// Without border
<Badge bordered={false}>Subtle</Badge>

// Custom colors (any CSS color)
<Badge bgColor="#ffe4e6" color="#be123c">
  Custom Pink
</Badge>
```

</details>

---

<details>
<summary><strong>Breadcrumb</strong> - Navigation breadcrumb trail</summary>

### Breadcrumb

A navigation component that displays the current location within a hierarchical structure. Supports custom separators, icons, dropdown menus, custom item rendering, and route parameters.

#### Import

```tsx
import { Breadcrumb } from 'j-ui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BreadcrumbItemType[]` | `[]` | Breadcrumb items |
| `separator` | `ReactNode` | `'/'` | Separator between items |
| `itemRender` | `(item, params, items, paths) => ReactNode` | — | Custom render function for each item |
| `params` | `Record<string, string>` | — | Route parameters |
| `className` | `string` | — | Additional CSS class |
| `style` | `CSSProperties` | — | Additional inline styles |
| `classNames` | `BreadcrumbClassNames` | — | CSS classes for internal parts |
| `styles` | `BreadcrumbStyles` | — | Styles for internal parts |

#### BreadcrumbItemType

```typescript
interface BreadcrumbItemType {
  title?: ReactNode       // Text/content of the item
  href?: string           // URL (renders as <a>)
  path?: string           // Path segment (accumulated for itemRender)
  icon?: ReactNode        // Icon before the title
  onClick?: (e: MouseEvent) => void  // Click handler
  className?: string      // Individual CSS class
  style?: CSSProperties   // Individual inline styles
  menu?: { items: BreadcrumbMenuItemType[] }  // Dropdown menu
}
```

#### BreadcrumbMenuItemType

```typescript
interface BreadcrumbMenuItemType {
  key: string             // Unique key
  title: ReactNode        // Item text
  href?: string           // Item URL
  icon?: ReactNode        // Item icon
  onClick?: (e: MouseEvent) => void  // Click handler
}
```

#### Semantic DOM

| Slot | Description |
|------|-------------|
| `root` | Outer `<nav>` element |
| `list` | `<ol>` list container |
| `item` | Individual `<li>` breadcrumb item |
| `separator` | Separator `<li>` element between items |
| `link` | Link or text element inside each item |
| `overlay` | Dropdown menu container |

#### Examples

```tsx
// Basic breadcrumb
<Breadcrumb
  items={[
    { title: 'Home', href: '/' },
    { title: 'Products', href: '/products' },
    { title: 'Detail' },
  ]}
/>

// With icons
<Breadcrumb
  items={[
    { title: 'Home', href: '/', icon: <HomeIcon /> },
    { title: 'Settings', href: '/settings', icon: <SettingsIcon /> },
    { title: 'Profile' },
  ]}
/>

// Custom separator
<Breadcrumb
  separator=">"
  items={[
    { title: 'Home', href: '/' },
    { title: 'Category', href: '/category' },
    { title: 'Item' },
  ]}
/>

// ReactNode separator
<Breadcrumb
  separator={<span style={{ color: 'red' }}>→</span>}
  items={[
    { title: 'Step 1', href: '#' },
    { title: 'Step 2', href: '#' },
    { title: 'Step 3' },
  ]}
/>

// With dropdown menu
<Breadcrumb
  items={[
    { title: 'Home', href: '/' },
    {
      title: 'Category',
      href: '/category',
      menu: {
        items: [
          { key: 'electronics', title: 'Electronics', href: '/electronics' },
          { key: 'clothing', title: 'Clothing', href: '/clothing' },
          { key: 'books', title: 'Books', href: '/books' },
        ],
      },
    },
    { title: 'Product' },
  ]}
/>

// With onClick handlers
<Breadcrumb
  items={[
    { title: 'Home', onClick: () => navigate('/') },
    { title: 'Users', onClick: () => navigate('/users') },
    { title: 'John Doe' },
  ]}
/>

// Custom item render with paths
<Breadcrumb
  items={[
    { title: 'Home', path: '' },
    { title: 'Users', path: 'users' },
    { title: ':id', path: ':id' },
  ]}
  params={{ id: '42' }}
  itemRender={(item, params, items, paths) => {
    const last = items.indexOf(item) === items.length - 1
    let path = paths[items.indexOf(item)]
    // Replace params
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

// With semantic DOM styling
<Breadcrumb
  items={[
    { title: 'Home', href: '/' },
    { title: 'Products', href: '/products' },
    { title: 'Detail' },
  ]}
  classNames={{ link: 'custom-link' }}
  styles={{
    separator: { color: '#999', margin: '0 12px' },
    overlay: { borderRadius: 8 },
  }}
/>
```

</details>

---

<details>
<summary><strong>Bubble</strong> - Floating action button with menus and groups</summary>

### Bubble

A floating action button (FAB) component for quick actions, with support for badges, tooltips, compact groups, and expandable menus.

#### Import

```tsx
import { Bubble, BackToTopIcon, ChatIcon, BellIcon, CloseIcon } from 'j-ui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | — | Icon to display |
| `description` | `string` | — | Text to display (only if no icon) |
| `position` | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'bottom-right'` | Fixed position on screen |
| `shape` | `'circle' \| 'square'` | `'circle'` | Bubble shape |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Bubble size |
| `color` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'primary'` | Semantic color |
| `badge` | `number \| boolean` | — | Show badge with number or dot |
| `badgeColor` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'error'` | Badge color |
| `tooltip` | `string` | — | Tooltip text |
| `tooltipPosition` | `'left' \| 'right' \| 'top' \| 'bottom'` | auto | Tooltip position |
| `offsetX` | `number` | `24` | Horizontal offset from edge (px) |
| `offsetY` | `number` | `24` | Vertical offset from edge (px) |
| `shadow` | `boolean \| 'sm' \| 'md' \| 'lg'` | `'lg'` | Apply shadow |
| `bordered` | `boolean` | `true` | Show border |
| `onBackToTop` | `() => void` | — | Callback when scrolling to top |
| `visibleOnScroll` | `number` | — | Show only after scrolling (px) |
| `disabled` | `boolean` | `false` | Disable bubble |

Also accepts all standard `<button>` HTML attributes.

#### Sizes

| Size | Dimensions | Icon Size |
|------|------------|-----------|
| `sm` | 40px | 16px |
| `md` | 48px | 20px |
| `lg` | 56px | 24px |

#### Built-in Icons

J-UI provides utility icons for common FAB use cases:

| Icon | Description |
|------|-------------|
| `BackToTopIcon` | Arrow pointing up |
| `ChatIcon` | Chat/message bubble |
| `BellIcon` | Notification bell |
| `CloseIcon` | X close icon |

#### Semantic DOM

| Slot | Description |
|------|-------------|
| `root` | Outer wrapper element |
| `icon` | Icon element |
| `badge` | Badge counter element |
| `tooltip` | Tooltip popup element |
| `tooltipArrow` | Tooltip arrow element |

**Bubble.Menu:**

| Slot | Description |
|------|-------------|
| `root` | Menu wrapper element |
| `trigger` | Menu trigger element |
| `menu` | Menu container element |

#### Examples

```tsx
// Basic
<Bubble icon={<ChatIcon />} />

// With tooltip
<Bubble icon={<ChatIcon />} tooltip="Open chat" />

// Different positions
<Bubble icon={<BellIcon />} position="top-right" />
<Bubble icon={<ChatIcon />} position="bottom-left" />

// With badge (number)
<Bubble icon={<BellIcon />} badge={5} />

// With badge (dot)
<Bubble icon={<ChatIcon />} badge={true} />

// Badge with custom color
<Bubble icon={<BellIcon />} badge={3} badgeColor="warning" />

// Different colors
<Bubble icon={<ChatIcon />} color="success" />
<Bubble icon={<BellIcon />} color="info" />

// Different sizes
<Bubble icon={<ChatIcon />} size="sm" />
<Bubble icon={<ChatIcon />} size="lg" />

// Square shape
<Bubble icon={<ChatIcon />} shape="square" />

// Without border
<Bubble icon={<ChatIcon />} bordered={false} />

// Back to top button (appears after scrolling 200px)
<Bubble
  icon={<BackToTopIcon />}
  tooltip="Back to top"
  visibleOnScroll={200}
  onBackToTop={() => console.log('Scrolled to top')}
/>

// Custom offset
<Bubble icon={<ChatIcon />} offsetX={40} offsetY={40} />

// With text instead of icon
<Bubble description="?" tooltip="Help" />
```

---

### Bubble.Group

A compact button bar that joins multiple Bubbles together with unified styling. The bubbles are rendered as a seamless group with shared shadow and automatic border-radius handling.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Child Bubble components |
| `position` | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'bottom-right'` | Fixed position on screen |
| `direction` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Layout direction |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size for all children |
| `offsetX` | `number` | `24` | Horizontal offset from edge (px) |
| `offsetY` | `number` | `24` | Vertical offset from edge (px) |
| `shadow` | `boolean \| 'sm' \| 'md' \| 'lg'` | `'lg'` | Shadow for the group container |

#### Direction

| Direction | Description |
|-----------|-------------|
| `top` | Bubbles stack upward from position |
| `bottom` | Bubbles stack downward from position |
| `left` | Bubbles stack leftward from position |
| `right` | Bubbles stack rightward from position |

#### Examples

```tsx
// Vertical compact group (stacks upward)
<Bubble.Group>
  <Bubble icon={<ChatIcon />} color="info" />
  <Bubble icon={<BellIcon />} color="warning" />
  <Bubble icon={<BackToTopIcon />} color="success" />
</Bubble.Group>

// Horizontal compact group
<Bubble.Group direction="left">
  <Bubble icon={<ChatIcon />} color="primary" />
  <Bubble icon={<BellIcon />} color="secondary" />
</Bubble.Group>

// Different position
<Bubble.Group position="top-right" direction="bottom">
  <Bubble icon={<ChatIcon />} />
  <Bubble icon={<BellIcon />} />
</Bubble.Group>

// With badges (badges extend outside the group)
<Bubble.Group>
  <Bubble icon={<ChatIcon />} badge={3} />
  <Bubble icon={<BellIcon />} badge={true} badgeColor="warning" />
</Bubble.Group>

// Custom size
<Bubble.Group size="lg">
  <Bubble icon={<ChatIcon />} />
  <Bubble icon={<BellIcon />} />
</Bubble.Group>
```

---

### Bubble.Menu

An expandable floating menu that shows/hides child Bubbles with animation. Supports click or hover activation.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Child Bubble components |
| `position` | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'bottom-right'` | Fixed position on screen |
| `direction` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Expansion direction |
| `trigger` | `'click' \| 'hover'` | `'click'` | Activation mode |
| `icon` | `ReactNode` | `+` | Trigger icon when closed |
| `openIcon` | `ReactNode` | — | Trigger icon when open (defaults to rotating the icon 45deg) |
| `shape` | `'circle' \| 'square'` | `'circle'` | Shape for trigger and children |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size for trigger and children |
| `color` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'primary'` | Trigger color |
| `offsetX` | `number` | `24` | Horizontal offset from edge (px) |
| `offsetY` | `number` | `24` | Vertical offset from edge (px) |
| `shadow` | `boolean \| 'sm' \| 'md' \| 'lg'` | `'lg'` | Apply shadow |
| `tooltip` | `string` | — | Tooltip for trigger (shown when closed) |
| `defaultOpen` | `boolean` | `false` | Initially open (uncontrolled) |
| `open` | `boolean` | — | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | — | Callback when state changes |
| `gap` | `number` | `12` | Space between bubbles (px) |

#### Examples

```tsx
// Basic expandable menu (click to open)
<Bubble.Menu>
  <Bubble icon={<ChatIcon />} tooltip="Chat" color="info" />
  <Bubble icon={<BellIcon />} tooltip="Notifications" color="warning" />
</Bubble.Menu>

// Hover to open
<Bubble.Menu trigger="hover">
  <Bubble icon={<ChatIcon />} tooltip="Chat" />
  <Bubble icon={<BellIcon />} tooltip="Alerts" />
</Bubble.Menu>

// Custom trigger icons
<Bubble.Menu
  icon={<ChatIcon />}
  openIcon={<CloseIcon />}
  color="success"
>
  <Bubble icon={<BellIcon />} tooltip="Notifications" />
  <Bubble icon={<BackToTopIcon />} tooltip="Back to top" />
</Bubble.Menu>

// Horizontal expansion
<Bubble.Menu direction="left">
  <Bubble icon={<ChatIcon />} />
  <Bubble icon={<BellIcon />} />
</Bubble.Menu>

// Controlled state
function MyComponent() {
  const [open, setOpen] = useState(false)

  return (
    <Bubble.Menu
      open={open}
      onOpenChange={setOpen}
      tooltip="Actions"
    >
      <Bubble icon={<ChatIcon />} onClick={() => openChat()} />
      <Bubble icon={<BellIcon />} onClick={() => openNotifications()} />
    </Bubble.Menu>
  )
}

// Different position
<Bubble.Menu position="top-left" direction="bottom">
  <Bubble icon={<ChatIcon />} />
  <Bubble icon={<BellIcon />} />
</Bubble.Menu>

// Inline mode (not fixed, flows with content)
<Bubble.Menu style={{ position: 'relative' }}>
  <Bubble icon={<ChatIcon />} />
  <Bubble icon={<BellIcon />} />
</Bubble.Menu>

// Custom gap
<Bubble.Menu gap={20}>
  <Bubble icon={<ChatIcon />} />
  <Bubble icon={<BellIcon />} />
</Bubble.Menu>
```

</details>

---

<details>
<summary><strong>Button</strong> - Versatile button with variants and animations</summary>

### Button

A versatile button component with multiple variants, sizes, and states.

#### Import

```tsx
import { Button } from 'j-ui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'dashed' \| 'ghost' \| 'link'` | `'primary'` | Button style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `color` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'primary'` | Semantic color |
| `icon` | `ReactNode` | — | Icon element |
| `iconPlacement` | `'start' \| 'end'` | `'start'` | Icon position relative to text |
| `loading` | `boolean` | `false` | Show loading spinner |
| `shadow` | `boolean \| 'sm' \| 'md' \| 'lg'` | `false` | Apply shadow |
| `clickAnimation` | `'pulse' \| 'ripple' \| 'shake' \| 'firecracker' \| 'confetti'` | — | Animation on click |
| `hoverAnimation` | `'pulse' \| 'ripple' \| 'shake' \| 'firecracker' \| 'confetti'` | — | Animation on hover |
| `gradient` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info'` | — | Preset gradient using theme color |
| `gradientAngle` | `number` | `135` | Angle for preset gradient (degrees) |
| `gradientCss` | `string` | — | Custom CSS gradient (overrides `gradient`) |
| `block` | `boolean` | `false` | Button takes 100% width of container |
| `bordered` | `boolean` | `false` | Add extra border |
| `disabled` | `boolean` | `false` | Disable button |
| `children` | `ReactNode` | — | Button content |

Also accepts all standard `<button>` HTML attributes.

#### Variants

| Variant | Description |
|---------|-------------|
| `primary` | Solid background with the selected color |
| `secondary` | Light background with darker text |
| `outline` | Transparent with solid colored border |
| `dashed` | Transparent with dashed colored border |
| `ghost` | Transparent, color appears on hover |
| `link` | Text-only, no padding, looks like a hyperlink |

#### Sizes

| Size | Padding | Font Size |
|------|---------|-----------|
| `sm` | `6px 12px` | 13px |
| `md` | `10px 18px` | 14px |
| `lg` | `14px 24px` | 16px |

#### Animations

| Animation | Description |
|-----------|-------------|
| `ripple` | Wave expanding from click point |
| `pulse` | Double border wave expanding outward |
| `shake` | Button shakes horizontally |
| `firecracker` | Particles burst from button edges |
| `confetti` | Particles burst from click point |

#### Semantic DOM

| Slot | Description |
|------|-------------|
| `root` | Outer button element |
| `icon` | Icon wrapper element |
| `spinner` | Loading spinner element |
| `content` | Text content wrapper |

#### Examples

```tsx
// Basic
<Button>Click me</Button>

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="dashed">Dashed</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Colors
<Button color="success">Success</Button>
<Button color="warning">Warning</Button>
<Button color="error">Error</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>

// Click animations
<Button clickAnimation="ripple">Ripple</Button>
<Button clickAnimation="pulse">Pulse</Button>
<Button clickAnimation="shake">Shake</Button>
<Button clickAnimation="firecracker">Firecracker</Button>
<Button clickAnimation="confetti">Confetti</Button>

// Hover animation
<Button hoverAnimation="pulse">Hover me</Button>

// Shadow
<Button shadow="lg">With Shadow</Button>

// Full width (block)
<Button block>Full Width Button</Button>

// Preset gradient (uses theme color shades)
<Button gradient="primary">Primary Gradient</Button>
<Button gradient="success">Success Gradient</Button>

// Custom gradient angle
<Button gradient="info" gradientAngle={45}>45deg Gradient</Button>
<Button gradient="warning" gradientAngle={90}>90deg Gradient</Button>

// Custom CSS gradient
<Button gradientCss="linear-gradient(90deg, #ff6b6b, #feca57)">
  Sunset
</Button>
<Button gradientCss="linear-gradient(135deg, #667eea, #764ba2)">
  Purple Haze
</Button>

// With icon (start position - default)
<Button icon={<PlusIcon />}>Add Item</Button>

// With icon at end
<Button icon={<ArrowRightIcon />} iconPlacement="end">
  Continue
</Button>

// Icon with dashed variant
<Button variant="dashed" icon={<UploadIcon />}>
  Upload File
</Button>

// Combined
<Button
  variant="outline"
  color="success"
  size="lg"
  clickAnimation="confetti"
  shadow
>
  Complete Order
</Button>
```

</details>

---

<details>
<summary><strong>Checkbox</strong> - Selection control with group and indeterminate support</summary>

### Checkbox

A checkbox component for toggling boolean values with support for indeterminate state, groups, controlled/uncontrolled modes, and semantic styling. Includes `Checkbox.Group` for managing multiple selections.

#### Import

```tsx
import { Checkbox } from 'j-ui'
```

#### Checkbox Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | — | Whether the checkbox is checked (controlled) |
| `defaultChecked` | `boolean` | `false` | Initial checked state (uncontrolled) |
| `disabled` | `boolean` | `false` | Disables the checkbox |
| `indeterminate` | `boolean` | `false` | Shows indeterminate (partial) state — displays a minus icon |
| `autoFocus` | `boolean` | `false` | Auto focus on mount |
| `onChange` | `(e: CheckboxChangeEvent) => void` | — | Callback when state changes |
| `value` | `string \| number` | — | Value identifier, used within `Checkbox.Group` |
| `children` | `ReactNode` | — | Label content displayed next to the checkbox |
| `id` | `string` | — | HTML id attribute |
| `name` | `string` | — | HTML name attribute for the input |
| `tabIndex` | `number` | — | Tab index for keyboard navigation |
| `className` | `string` | — | CSS class for root element |
| `style` | `CSSProperties` | — | Inline styles for root element |
| `classNames` | `CheckboxClassNames` | — | Semantic slot CSS classes |
| `styles` | `CheckboxStyles` | — | Semantic slot inline styles |

#### Checkbox.Group Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `(string \| number \| CheckboxOptionType)[]` | — | Options array for generating checkboxes |
| `value` | `(string \| number)[]` | — | Currently selected values (controlled) |
| `defaultValue` | `(string \| number)[]` | `[]` | Initial selected values (uncontrolled) |
| `disabled` | `boolean` | `false` | Disables all checkboxes in the group |
| `name` | `string` | — | Name attribute for all inputs |
| `onChange` | `(checkedValues: (string \| number)[]) => void` | — | Callback when selection changes |
| `children` | `ReactNode` | — | Checkbox children (alternative to `options`) |
| `className` | `string` | — | CSS class for root element |
| `style` | `CSSProperties` | — | Inline styles for root element |
| `classNames` | `CheckboxGroupClassNames` | — | Semantic slot CSS classes |
| `styles` | `CheckboxGroupStyles` | — | Semantic slot inline styles |

#### Types

```typescript
// Change event returned by onChange
interface CheckboxChangeEvent {
  target: {
    checked: boolean
    value?: string | number
  }
  nativeEvent: Event
}

// Option object for Checkbox.Group
interface CheckboxOptionType {
  label: ReactNode
  value: string | number
  disabled?: boolean
  style?: CSSProperties
  className?: string
}

// Semantic slot types
type CheckboxSemanticSlot = 'root' | 'checkbox' | 'indicator' | 'label'
type CheckboxGroupSemanticSlot = 'root'
```

#### Semantic DOM

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<label>` | Outer wrapper containing checkbox and label |
| `checkbox` | `<span>` | The checkbox box element (border + background) |
| `indicator` | `<span>` | The check/minus icon container inside the box |
| `label` | `<span>` | Label text next to the checkbox |

**Checkbox.Group:**

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<div>` | Wrapper `div` with `role="group"` containing all checkboxes |

#### Examples

```tsx
// Basic checkbox
<Checkbox>Remember me</Checkbox>

// Controlled checkbox
const [checked, setChecked] = useState(false)
<Checkbox
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
>
  I agree to the terms
</Checkbox>

// Disabled
<Checkbox disabled>Disabled</Checkbox>
<Checkbox disabled checked>Disabled checked</Checkbox>

// Indeterminate state (for "select all" patterns)
const [checkedList, setCheckedList] = useState(['Apple'])
const allOptions = ['Apple', 'Banana', 'Orange']
const allChecked = checkedList.length === allOptions.length
const indeterminate = checkedList.length > 0 && !allChecked
<Checkbox
  indeterminate={indeterminate}
  checked={allChecked}
  onChange={(e) => setCheckedList(e.target.checked ? allOptions : [])}
>
  Check all
</Checkbox>

// Group with options array
<Checkbox.Group
  options={['Apple', 'Banana', 'Orange']}
  defaultValue={['Apple']}
  onChange={(values) => console.log(values)}
/>

// Group with object options
<Checkbox.Group
  options={[
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Orange', value: 'orange', disabled: true },
  ]}
  defaultValue={['apple']}
/>

// Group with children (manual layout)
<Checkbox.Group onChange={(values) => console.log(values)}>
  <Checkbox value="A">Option A</Checkbox>
  <Checkbox value="B">Option B</Checkbox>
  <Checkbox value="C">Option C</Checkbox>
</Checkbox.Group>

// Controlled group
const [selected, setSelected] = useState<(string | number)[]>(['B'])
<Checkbox.Group value={selected} onChange={setSelected}>
  <Checkbox value="A">A</Checkbox>
  <Checkbox value="B">B</Checkbox>
  <Checkbox value="C">C</Checkbox>
</Checkbox.Group>

// Semantic styling
<Checkbox
  styles={{
    checkbox: { borderRadius: 999, width: 20, height: 20 },
    label: { fontWeight: 600 },
  }}
>
  Custom styled
</Checkbox>

// Semantic styling on Group
<Checkbox.Group
  options={['Red', 'Green', 'Blue']}
  styles={{ root: { gap: 16 } }}
/>
```

</details>

---

<details>
<summary><strong>ColorPicker</strong> - Color selection with gradients, presets, and format switching</summary>

### ColorPicker

A full-featured color picker with saturation-brightness panel, hue and alpha sliders, format switching (HEX/RGB/HSB), gradient mode with editable stops, color presets, three sizes, click/hover triggers, auto-flip placement, and custom panel rendering.

#### Import

```tsx
import { ColorPicker } from 'j-ui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| ColorPickerColor \| ColorPickerGradientStop[]` | — | Current color value (controlled) |
| `defaultValue` | `string \| ColorPickerColor \| ColorPickerGradientStop[]` | `'#1677ff'` | Initial color (uncontrolled) |
| `mode` | `ColorPickerMode \| ColorPickerMode[]` | `'single'` | Color mode(s). `'gradient'` shows tabs with Single/Gradient |
| `onModeChange` | `(mode: ColorPickerMode) => void` | — | Called when mode changes |
| `format` | `ColorPickerFormat` | — | Display format (controlled) |
| `defaultFormat` | `ColorPickerFormat` | `'hex'` | Initial display format (uncontrolled) |
| `disabled` | `boolean` | `false` | Disables the picker |
| `disabledAlpha` | `boolean` | `false` | Hides the alpha slider and alpha input |
| `allowClear` | `boolean` | `false` | Shows a clear button in the panel |
| `showText` | `boolean \| ((color: ColorPickerColor) => ReactNode)` | — | Shows color text next to the swatch. Custom function for custom text |
| `trigger` | `'click' \| 'hover'` | `'click'` | How the panel opens |
| `placement` | `ColorPickerPlacement` | `'bottomLeft'` | Panel placement with auto-flip |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Trigger button size |
| `open` | `boolean` | — | Whether the panel is open (controlled) |
| `presets` | `ColorPickerPreset[]` | — | Preset color palettes |
| `panelRender` | `(panel: ReactNode) => ReactNode` | — | Custom panel wrapper |
| `onChange` | `(color: ColorPickerColor, hex: string) => void` | — | Called on every color change (single mode) |
| `onChangeComplete` | `(color: ColorPickerColor, hex: string) => void` | — | Called when dragging ends (single mode) |
| `onGradientChange` | `(stops: ColorPickerGradientStop[], css: string) => void` | — | Called on gradient change (gradient mode) |
| `onFormatChange` | `(format: ColorPickerFormat) => void` | — | Called when format changes |
| `onOpenChange` | `(open: boolean) => void` | — | Called when panel opens/closes |
| `onClear` | `() => void` | — | Called when color is cleared |
| `children` | `ReactNode` | — | Custom trigger element (replaces default button) |
| `className` | `string` | — | CSS class for the root element |
| `style` | `CSSProperties` | — | Inline styles for the root element |
| `classNames` | `ColorPickerClassNames` | — | Semantic slot CSS classes |
| `styles` | `ColorPickerStyles` | — | Semantic slot inline styles |

#### Types

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

// Color object returned by onChange / onChangeComplete
interface ColorPickerColor {
  h: number; s: number; b: number; a: number
  toHexString: () => string
  toRgbString: () => string
  toHsbString: () => string
  toRgb: () => { r: number; g: number; b: number; a: number }
  toHsb: () => { h: number; s: number; b: number; a: number }
}

// Semantic slot types
type ColorPickerSemanticSlot = 'root' | 'trigger' | 'panel' | 'presets'
```

#### Semantic DOM

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<div>` | Outer wrapper (position relative) |
| `trigger` | `<button>` | Default trigger button with color swatch |
| `panel` | `<div>` | Floating panel containing all picker controls |
| `presets` | — | Reserved for preset palette section |

#### Examples

```tsx
// Basic color picker
<ColorPicker defaultValue="#1677ff" />

// Controlled
const [color, setColor] = useState('#ff6b6b')
<ColorPicker
  value={color}
  onChange={(c, hex) => setColor(hex)}
/>

// Show text next to swatch
<ColorPicker defaultValue="#52c41a" showText />

// Custom text function
<ColorPicker
  defaultValue="#1677ff"
  showText={(color) => color.toRgbString()}
/>

// Sizes
<ColorPicker size="sm" defaultValue="#1677ff" />
<ColorPicker size="md" defaultValue="#52c41a" />
<ColorPicker size="lg" defaultValue="#ff4d4f" />

// Disabled
<ColorPicker defaultValue="#1677ff" disabled />

// Disable alpha channel
<ColorPicker defaultValue="#1677ff" disabledAlpha />

// Allow clear
<ColorPicker defaultValue="#1677ff" allowClear />

// Hover trigger
<ColorPicker defaultValue="#1677ff" trigger="hover" />

// Placement
<ColorPicker defaultValue="#1677ff" placement="topRight" />

// Format control
<ColorPicker defaultValue="#1677ff" format="rgb" />

// Presets
<ColorPicker
  defaultValue="#1677ff"
  presets={[
    {
      label: 'Recommended',
      colors: ['#ff4d4f', '#ff7a45', '#ffa940', '#ffc53d', '#ffec3d', '#bae637', '#73d13d', '#36cfc9', '#40a9ff', '#597ef7', '#9254de', '#f759ab'],
    },
    {
      label: 'Recent',
      colors: ['#1677ff', '#52c41a'],
    },
  ]}
/>

// Gradient mode
<ColorPicker
  mode="gradient"
  onGradientChange={(stops, css) => console.log(css)}
/>

// Both modes (tabs)
<ColorPicker
  mode={['single', 'gradient']}
  onChange={(c, hex) => console.log('single:', hex)}
  onGradientChange={(stops, css) => console.log('gradient:', css)}
/>

// Custom trigger
<ColorPicker defaultValue="#1677ff">
  <button>Pick a color</button>
</ColorPicker>

// Custom panel render
<ColorPicker
  defaultValue="#1677ff"
  panelRender={(panel) => (
    <div style={{ padding: 8 }}>
      <h4>Choose color</h4>
      {panel}
    </div>
  )}
/>

// Semantic styling
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
<summary><strong>DatePicker</strong> - Date selection with calendar panel, range, and time support</summary>

### DatePicker

A comprehensive date picker with calendar panel, multiple picker modes (date, week, month, quarter, year), time selection, range picking with dual panels, mask input, multiple date selection, presets, disabled dates/times, custom cell rendering, pluggable date adapter system, and auto-flip positioning. Includes `DatePicker.RangePicker` for selecting date ranges.

#### Import

```tsx
import { DatePicker } from 'j-ui'
```

#### DatePicker Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `TDate \| null` | — | Selected date (controlled) |
| `defaultValue` | `TDate \| null` | — | Initial date (uncontrolled) |
| `onChange` | `(date: TDate \| null, dateString: string) => void` | — | Called when date changes |
| `picker` | `'date' \| 'week' \| 'month' \| 'quarter' \| 'year'` | `'date'` | Type of picker panel |
| `format` | `string \| ((date: TDate) => string)` | Auto | Date display format (e.g. `'YYYY-MM-DD'`) |
| `placeholder` | `string` | Auto | Input placeholder |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Component size |
| `variant` | `'outlined' \| 'borderless' \| 'filled'` | `'outlined'` | Input variant |
| `status` | `'error' \| 'warning'` | — | Validation status |
| `placement` | `DatePickerPlacement` | `'bottomLeft'` | Popup placement with auto-flip |
| `disabled` | `boolean` | `false` | Disables the picker |
| `inputReadOnly` | `boolean` | `false` | Makes the input read-only |
| `allowClear` | `boolean` | `true` | Shows clear button |
| `prefix` | `ReactNode` | — | Prefix content in the input |
| `suffix` | `ReactNode` | Calendar/Clock icon | Suffix content in the input |
| `needConfirm` | `boolean` | `true` when `showTime` | Requires OK button to confirm selection |
| `multiple` | `boolean` | `false` | Allows selecting multiple dates |
| `mask` | `boolean` | `false` | Enables mask-based input with per-segment editing |
| `disabledDate` | `(date: TDate) => boolean` | — | Function to disable specific dates |
| `minDate` | `TDate` | — | Minimum selectable date |
| `maxDate` | `TDate` | — | Maximum selectable date |
| `showTime` | `boolean \| TimePickerConfig` | — | Enables time selection alongside date |
| `showNow` | `boolean` | Auto | Shows "Now" button in footer |
| `showToday` | `boolean` | `true` | Shows "Today" button in footer |
| `presets` | `DatePickerPreset[]` | — | Quick-select preset dates |
| `open` | `boolean` | — | Whether the popup is open (controlled) |
| `defaultOpen` | `boolean` | `false` | Initial open state |
| `onOpenChange` | `(open: boolean) => void` | — | Called when popup opens/closes |
| `panelRender` | `(panel: ReactNode) => ReactNode` | — | Custom panel wrapper |
| `cellRender` | `(current: TDate, info: CellRenderInfo) => ReactNode` | — | Custom cell rendering |
| `onPanelChange` | `(date: TDate, mode: DatePickerMode) => void` | — | Called on panel mode/view change |
| `renderExtraFooter` | `() => ReactNode` | — | Extra footer content |
| `disabledTime` | `(date: TDate) => DisabledTimes` | — | Disables specific hours/minutes/seconds |
| `adapter` | `DateAdapter<TDate>` | `NativeDateAdapter` | Pluggable date library adapter |
| `className` | `string` | — | CSS class for the root element |
| `style` | `CSSProperties` | — | Inline styles for the root element |
| `classNames` | `DatePickerClassNames` | — | Semantic slot CSS classes |
| `styles` | `DatePickerStyles` | — | Semantic slot inline styles |

#### DatePicker.RangePicker Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `[TDate \| null, TDate \| null] \| null` | — | Selected range (controlled) |
| `defaultValue` | `[TDate \| null, TDate \| null] \| null` | — | Initial range (uncontrolled) |
| `onChange` | `(dates: [TDate, TDate] \| null, dateStrings: [string, string]) => void` | — | Called when range changes |
| `onCalendarChange` | `(dates, dateStrings, info: { range: 'start' \| 'end' }) => void` | — | Called on each calendar selection |
| `picker` | `DatePickerMode` | `'date'` | Picker mode |
| `format` | `string \| ((date: TDate) => string)` | Auto | Date format |
| `placeholder` | `[string, string]` | Auto | Placeholders for start/end |
| `separator` | `ReactNode` | Arrow icon | Separator between inputs |
| `allowEmpty` | `[boolean, boolean]` | — | Allow empty start/end |
| `disabled` | `boolean \| [boolean, boolean]` | `false` | Disable start/end independently |
| `size` | `DatePickerSize` | `'md'` | Component size |
| `variant` | `DatePickerVariant` | `'outlined'` | Input variant |
| `status` | `DatePickerStatus` | — | Validation status |
| `placement` | `DatePickerPlacement` | `'bottomLeft'` | Popup placement |
| `inputReadOnly` | `boolean` | `false` | Read-only inputs |
| `allowClear` | `boolean` | `true` | Show clear button |
| `prefix` | `ReactNode` | — | Prefix content |
| `suffix` | `ReactNode` | Calendar icon | Suffix content |
| `disabledDate` | `(date: TDate, info?: { from?: TDate }) => boolean` | — | Disable specific dates |
| `minDate` | `TDate` | — | Minimum selectable date |
| `maxDate` | `TDate` | — | Maximum selectable date |
| `showTime` | `boolean \| TimePickerConfig` | — | Enable time selection |
| `showNow` | `boolean` | — | Show "Now" button |
| `presets` | `RangePickerPreset[]` | — | Preset ranges |
| `open` | `boolean` | — | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Initial open state |
| `onOpenChange` | `(open: boolean) => void` | — | Open change callback |
| `panelRender` | `(panel: ReactNode) => ReactNode` | — | Custom panel wrapper |
| `cellRender` | `(current: TDate, info: CellRenderInfo) => ReactNode` | — | Custom cell rendering |
| `onPanelChange` | `(dates, modes) => void` | — | Panel change callback |
| `renderExtraFooter` | `() => ReactNode` | — | Extra footer content |
| `disabledTime` | `(date: TDate, type: 'start' \| 'end') => DisabledTimes` | — | Disable specific times |
| `linkedPanels` | `boolean` | `true` | Link left/right panel navigation |
| `adapter` | `DateAdapter<TDate>` | `NativeDateAdapter` | Date adapter |
| `className` | `string` | — | CSS class |
| `style` | `CSSProperties` | — | Inline styles |
| `classNames` | `DatePickerClassNames` | — | Semantic slot CSS classes |
| `styles` | `DatePickerStyles` | — | Semantic slot inline styles |

#### Types

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
  format?: string          // e.g. 'HH:mm:ss'
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

// Pluggable date adapter interface
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

// Semantic slot types
type DatePickerSemanticSlot = 'root' | 'input' | 'popup' | 'header' | 'body' | 'cell' | 'footer'
```

#### Semantic DOM

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<div>` | Outer wrapper (position relative) |
| `input` | `<div>` | Input wrapper with border, focus ring, prefix/suffix |
| `popup` | `<div>` | Floating calendar popup |
| `header` | `<div>` | Calendar header with navigation arrows and title |
| `body` | `<div>` | Calendar body with day/month/year/quarter grid |
| `cell` | `<div>` / `<button>` | Individual calendar cell (day, month, year, quarter) |
| `footer` | `<div>` | Panel footer with Today/Now/OK buttons and presets |

#### Examples

```tsx
// Basic date picker
<DatePicker />

// Controlled
const [date, setDate] = useState<Date | null>(null)
<DatePicker
  value={date}
  onChange={(d, dateStr) => setDate(d)}
/>

// Sizes
<DatePicker size="sm" />
<DatePicker size="md" />
<DatePicker size="lg" />

// Variants
<DatePicker variant="outlined" />
<DatePicker variant="filled" />
<DatePicker variant="borderless" />

// Validation status
<DatePicker status="error" />
<DatePicker status="warning" />

// Month picker
<DatePicker picker="month" />

// Year picker
<DatePicker picker="year" />

// Quarter picker
<DatePicker picker="quarter" />

// Week picker
<DatePicker picker="week" />

// Date + Time
<DatePicker showTime />

// Date + Time with config
<DatePicker
  showTime={{
    format: 'HH:mm',
    hourStep: 1,
    minuteStep: 15,
    showSecond: false,
  }}
/>

// Disabled dates
<DatePicker
  disabledDate={(date) => date.getDay() === 0 || date.getDay() === 6}
/>

// Min and max date
<DatePicker
  minDate={new Date(2024, 0, 1)}
  maxDate={new Date(2024, 11, 31)}
/>

// Presets
<DatePicker
  presets={[
    { label: 'Today', value: new Date() },
    { label: 'Yesterday', value: () => { const d = new Date(); d.setDate(d.getDate() - 1); return d } },
  ]}
/>

// Multiple dates
<DatePicker multiple />

// Mask input
<DatePicker mask />

// Custom cell render
<DatePicker
  cellRender={(date, info) => {
    if (info.type === 'date' && date.getDate() === 25) {
      return <span style={{ color: 'red' }}>{info.originNode}</span>
    }
    return info.originNode
  }}
/>

// Custom format
<DatePicker format="DD/MM/YYYY" />

// Range picker
<DatePicker.RangePicker />

// Range picker controlled
const [range, setRange] = useState<[Date, Date] | null>(null)
<DatePicker.RangePicker
  value={range}
  onChange={(dates, dateStrings) => setRange(dates)}
/>

// Range picker with presets
<DatePicker.RangePicker
  presets={[
    { label: 'Last 7 days', value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 7)
      return [start, end]
    }},
    { label: 'This month', value: () => {
      const now = new Date()
      return [new Date(now.getFullYear(), now.getMonth(), 1), now]
    }},
  ]}
/>

// Range picker with time
<DatePicker.RangePicker showTime />

// Prefix and suffix
<DatePicker prefix={<CalendarIcon />} suffix={null} />

// Semantic styling
<DatePicker
  styles={{
    input: { borderRadius: 999 },
    popup: { borderRadius: 16 },
    cell: { borderRadius: '50%' },
  }}
/>

// Pluggable adapter (e.g., dayjs, date-fns)
import { DayjsAdapter } from 'j-ui/adapters/dayjs'
<DatePicker adapter={new DayjsAdapter()} />
```

</details>

---

<details>
<summary><strong>Divider</strong> - Separator line with optional text</summary>

### Divider

A separator component for dividing content sections, with optional text and multiple styling options.

#### Import

```tsx
import { Divider } from 'j-ui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'horizontal' \| 'vertical'` | `'horizontal'` | Divider orientation |
| `dashed` | `boolean` | `false` | Use dashed line instead of solid |
| `orientation` | `'left' \| 'center' \| 'right'` | `'center'` | Text position (horizontal only) |
| `orientationMargin` | `number \| string` | — | Margin from edge to text (px or %) |
| `plain` | `boolean` | `false` | Plain text style (smaller, no bold) |
| `color` | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` | Line and text color |
| `thickness` | `'thin' \| 'normal' \| 'medium' \| 'thick' \| number` | `'normal'` | Line thickness |
| `children` | `ReactNode` | — | Text content inside the divider |

#### Thickness Values

| Thickness | Value |
|-----------|-------|
| `thin` | 1px |
| `normal` | 1px |
| `medium` | 2px |
| `thick` | 3px |
| `number` | Custom px value |

#### Semantic DOM

| Slot | Description |
|------|-------------|
| `root` | Outer wrapper element |
| `line` | Divider line element |
| `text` | Text label element (when children are provided) |

#### Examples

```tsx
// Basic horizontal divider
<Divider />

// With text
<Divider>Section Title</Divider>

// Text orientation
<Divider orientation="left">Left Text</Divider>
<Divider orientation="center">Center Text</Divider>
<Divider orientation="right">Right Text</Divider>

// Custom margin from edge
<Divider orientation="left" orientationMargin={20}>
  20px from left
</Divider>
<Divider orientation="left" orientationMargin="10%">
  10% from left
</Divider>

// Dashed line
<Divider dashed>Dashed Divider</Divider>

// Plain text (smaller, no bold)
<Divider plain>Plain Text</Divider>

// Colors
<Divider color="primary">Primary</Divider>
<Divider color="success">Success</Divider>
<Divider color="warning">Warning</Divider>
<Divider color="error">Error</Divider>
<Divider color="info">Info</Divider>

// Line thickness
<Divider thickness="thin" />
<Divider thickness="medium">Medium</Divider>
<Divider thickness="thick">Thick</Divider>
<Divider thickness={4}>Custom 4px</Divider>

// Vertical divider (inline separator)
<span>Item 1</span>
<Divider type="vertical" />
<span>Item 2</span>
<Divider type="vertical" />
<span>Item 3</span>

// Vertical with color
<span>Home</span>
<Divider type="vertical" color="primary" />
<span>About</span>

// Combined styles
<Divider dashed color="primary" thickness="medium" orientation="left">
  Important Section
</Divider>
```

</details>

---

<details>
<summary><strong>Dropdown</strong> - Contextual overlay menus</summary>

### Dropdown

A contextual menu component triggered by hover, click, or right-click. Supports nested sub-menus, item groups, dividers, danger items, custom overlay rendering, controlled state, arrow indicator, and a compound `Dropdown.Button` variant.

#### Import

```tsx
import { Dropdown } from 'j-ui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Trigger element |
| `menu` | `DropdownMenuConfig` | — | Menu configuration |
| `trigger` | `DropdownTrigger[]` | `['hover']` | Trigger type(s): `'hover'`, `'click'`, `'contextMenu'` |
| `placement` | `DropdownPlacement` | `'bottomLeft'` | Menu position |
| `arrow` | `boolean` | `false` | Show arrow indicator |
| `open` | `boolean` | — | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | — | Callback when open state changes |
| `disabled` | `boolean` | `false` | Disable the dropdown |
| `dropdownRender` | `(menu: ReactNode) => ReactNode` | — | Custom overlay render function |
| `className` | `string` | — | Additional CSS class |
| `style` | `CSSProperties` | — | Additional inline styles |
| `classNames` | `DropdownClassNames` | — | CSS classes for internal parts |
| `styles` | `DropdownStyles` | — | Styles for internal parts |

#### DropdownMenuConfig

```typescript
interface DropdownMenuConfig {
  items: DropdownMenuItemType[]   // Menu items
  onClick?: (info: { key: string; domEvent: MouseEvent }) => void  // Global click handler
}
```

#### DropdownMenuItemType

```typescript
interface DropdownMenuItemType {
  key: string                    // Unique key
  label?: ReactNode              // Item content
  icon?: ReactNode               // Left icon
  disabled?: boolean             // Disable item
  danger?: boolean               // Danger style (red)
  onClick?: (info: { key: string; domEvent: MouseEvent }) => void  // Individual handler
  children?: DropdownMenuItemType[]  // Sub-menu items
  type?: 'divider' | 'group'    // Special type
  title?: ReactNode              // Group title (when type: 'group')
}
```

#### Placements

| Placement | Description |
|-----------|-------------|
| `bottom` | Below, centered |
| `bottomLeft` | Below, left-aligned |
| `bottomRight` | Below, right-aligned |
| `top` | Above, centered |
| `topLeft` | Above, left-aligned |
| `topRight` | Above, right-aligned |

#### Dropdown.Button

A split button with a main action and a dropdown trigger.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Main button content |
| `menu` | `DropdownMenuConfig` | — | Menu configuration |
| `placement` | `DropdownPlacement` | `'bottomRight'` | Menu position |
| `trigger` | `DropdownTrigger[]` | `['hover']` | Trigger type(s) |
| `onClick` | `(e: MouseEvent) => void` | — | Main button click handler |
| `icon` | `ReactNode` | `<ChevronDownIcon />` | Dropdown button icon |
| `disabled` | `boolean` | `false` | Disable both buttons |
| `loading` | `boolean` | `false` | Loading state on main button |
| `variant` | `ButtonVariant` | `'primary'` | Button variant |
| `color` | `ButtonColor` | — | Button color |
| `size` | `ButtonSize` | `'md'` | Button size |
| `className` | `string` | — | Additional CSS class |
| `style` | `CSSProperties` | — | Additional inline styles |
| `classNames` | `DropdownClassNames` | — | CSS classes for internal parts |
| `styles` | `DropdownStyles` | — | Styles for internal parts |

#### Semantic DOM

| Slot | Description |
|------|-------------|
| `root` | Outer wrapper element |
| `overlay` | Menu overlay container |
| `item` | Individual menu item |
| `arrow` | Arrow indicator element |

#### Examples

```tsx
// Basic dropdown (hover)
<Dropdown
  menu={{
    items: [
      { key: 'edit', label: 'Edit' },
      { key: 'duplicate', label: 'Duplicate' },
      { key: 'delete', label: 'Delete', danger: true },
    ],
  }}
>
  <a>Hover me</a>
</Dropdown>

// Click trigger
<Dropdown
  trigger={['click']}
  menu={{
    items: [
      { key: 'profile', label: 'Profile' },
      { key: 'settings', label: 'Settings' },
      { key: 'logout', label: 'Log out' },
    ],
  }}
>
  <Button>Click me</Button>
</Dropdown>

// Context menu (right-click)
<Dropdown
  trigger={['contextMenu']}
  menu={{
    items: [
      { key: 'copy', label: 'Copy' },
      { key: 'paste', label: 'Paste' },
      { key: 'cut', label: 'Cut' },
    ],
  }}
>
  <div style={{ padding: 40, border: '1px dashed #ccc' }}>
    Right-click here
  </div>
</Dropdown>

// With icons
<Dropdown
  menu={{
    items: [
      { key: 'edit', label: 'Edit', icon: <EditIcon /> },
      { key: 'copy', label: 'Copy', icon: <CopyIcon /> },
      { key: 'delete', label: 'Delete', icon: <TrashIcon />, danger: true },
    ],
  }}
>
  <Button>Actions</Button>
</Dropdown>

// With dividers and groups
<Dropdown
  menu={{
    items: [
      { key: 'new', label: 'New File' },
      { key: 'open', label: 'Open File' },
      { key: 'd1', type: 'divider' },
      {
        key: 'recent',
        type: 'group',
        title: 'Recent Files',
        children: [
          { key: 'file1', label: 'document.tsx' },
          { key: 'file2', label: 'styles.css' },
        ],
      },
    ],
  }}
>
  <Button>File</Button>
</Dropdown>

// Nested sub-menus
<Dropdown
  menu={{
    items: [
      { key: 'save', label: 'Save' },
      {
        key: 'export',
        label: 'Export as...',
        children: [
          { key: 'pdf', label: 'PDF' },
          { key: 'png', label: 'PNG' },
          { key: 'svg', label: 'SVG' },
        ],
      },
    ],
  }}
>
  <Button>File</Button>
</Dropdown>

// Disabled items
<Dropdown
  menu={{
    items: [
      { key: 'edit', label: 'Edit' },
      { key: 'delete', label: 'Delete', disabled: true },
    ],
  }}
>
  <Button>Actions</Button>
</Dropdown>

// With arrow
<Dropdown
  arrow
  placement="bottom"
  menu={{
    items: [
      { key: 'a', label: 'Option A' },
      { key: 'b', label: 'Option B' },
    ],
  }}
>
  <Button>With Arrow</Button>
</Dropdown>

// Placement options
<Dropdown
  placement="topRight"
  menu={{
    items: [
      { key: 'a', label: 'Option A' },
      { key: 'b', label: 'Option B' },
    ],
  }}
>
  <Button>Top Right</Button>
</Dropdown>

// Global onClick handler
<Dropdown
  menu={{
    items: [
      { key: 'opt1', label: 'Option 1' },
      { key: 'opt2', label: 'Option 2' },
    ],
    onClick: ({ key }) => console.log('Clicked:', key),
  }}
>
  <Button>Select</Button>
</Dropdown>

// Controlled open state
const [open, setOpen] = useState(false)

<Dropdown
  open={open}
  onOpenChange={setOpen}
  trigger={['click']}
  menu={{
    items: [
      { key: 'a', label: 'Option A' },
      { key: 'b', label: 'Option B' },
    ],
  }}
>
  <Button>Controlled</Button>
</Dropdown>

// Custom overlay render
<Dropdown
  trigger={['click']}
  menu={{
    items: [
      { key: 'a', label: 'Option A' },
      { key: 'b', label: 'Option B' },
    ],
  }}
  dropdownRender={(menu) => (
    <div>
      {menu}
      <div style={{ padding: 8, borderTop: '1px solid #eee' }}>
        <a href="/settings">More settings...</a>
      </div>
    </div>
  )}
>
  <Button>Custom Overlay</Button>
</Dropdown>

// Dropdown.Button
<Dropdown.Button
  menu={{
    items: [
      { key: 'save-as', label: 'Save As...' },
      { key: 'export', label: 'Export' },
    ],
  }}
  onClick={() => console.log('Save clicked')}
>
  Save
</Dropdown.Button>

// Dropdown.Button with variants
<Dropdown.Button
  variant="outlined"
  color="success"
  size="lg"
  menu={{
    items: [
      { key: 'draft', label: 'Save as Draft' },
      { key: 'template', label: 'Save as Template' },
    ],
  }}
  onClick={() => console.log('Publish')}
>
  Publish
</Dropdown.Button>
```

</details>

---

<details>
<summary><strong>Form</strong> - Data collection with validation, layouts, and dynamic fields</summary>

### Form

A comprehensive form component with field-level validation (required, type, min/max, pattern, custom async validators), three layouts (horizontal, vertical, inline), `FormInstance` API for programmatic control, `Form.Item` for automatic value binding and error display, `Form.List` for dynamic field arrays, `Form.ErrorList`, `Form.Provider` for cross-form communication, and hooks (`useForm`, `useWatch`, `useFormInstance`).

#### Import

```tsx
import { Form } from 'j-ui'
```

#### Form Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `form` | `FormInstance` | — | Form instance created by `Form.useForm()` |
| `name` | `string` | — | Form name (used with `Form.Provider`) |
| `layout` | `'horizontal' \| 'vertical' \| 'inline'` | `'horizontal'` | Form layout |
| `variant` | `'outlined' \| 'filled' \| 'borderless' \| 'underlined'` | `'outlined'` | Input variant propagated to children |
| `size` | `'small' \| 'middle' \| 'large'` | `'middle'` | Size propagated to children |
| `initialValues` | `Record<string, any>` | — | Initial field values |
| `onFinish` | `(values: Record<string, any>) => void` | — | Called on successful submit |
| `onFinishFailed` | `(errorInfo: { values; errorFields }) => void` | — | Called when submit validation fails |
| `onValuesChange` | `(changedValues, allValues) => void` | — | Called when any field value changes |
| `onFieldsChange` | `(changedFields, allFields) => void` | — | Called when any field data changes |
| `fields` | `FieldData[]` | — | Controlled field data |
| `validateTrigger` | `string \| string[]` | `'onChange'` | Default validation trigger |
| `colon` | `boolean` | `true` | Show colon after label |
| `labelAlign` | `'left' \| 'right'` | `'left'` | Label text alignment (requires fixed width via `styles.label`) |
| `labelWrap` | `boolean` | `false` | Allow label text wrapping |
| `requiredMark` | `boolean \| 'optional' \| { position } \| function` | `true` | Required mark configuration |
| `disabled` | `boolean` | `false` | Disable all form fields |
| `scrollToFirstError` | `boolean \| ScrollIntoViewOptions` | `false` | Scroll to first error on submit |
| `className` | `string` | — | CSS class |
| `style` | `CSSProperties` | — | Inline styles |
| `classNames` | `FormClassNames` | — | Semantic slot CSS classes |
| `styles` | `FormStyles` | — | Semantic slot inline styles |

#### Form.Item Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `NamePath` | — | Field name (binds to form values) |
| `label` | `ReactNode` | — | Field label |
| `layout` | `FormLayout` | Inherited | Override layout per item (mix layouts) |
| `rules` | `FormRule[]` | — | Validation rules |
| `dependencies` | `NamePath[]` | — | Re-validate when these fields change |
| `validateTrigger` | `string \| string[]` | Inherited | Validation trigger override |
| `validateFirst` | `boolean` | `false` | Stop on first rule error |
| `validateDebounce` | `number` | — | Debounce validation (ms) |
| `valuePropName` | `string` | `'value'` | Child prop for value (e.g. `'checked'`) |
| `trigger` | `string` | `'onChange'` | Child prop for change event |
| `getValueFromEvent` | `(...args) => any` | — | Custom value extraction from event |
| `getValueProps` | `(value) => Record<string, any>` | — | Custom value-to-props mapping |
| `normalize` | `(value, prevValue, allValues) => any` | — | Normalize value before storing |
| `shouldUpdate` | `boolean \| ((prev, cur) => boolean)` | — | Force re-render on any value change |
| `noStyle` | `boolean` | `false` | Render without wrapper (just bind props) |
| `hidden` | `boolean` | `false` | Hide the field |
| `required` | `boolean` | Auto | Override required indicator |
| `colon` | `boolean` | Inherited | Override colon per item |
| `labelAlign` | `'left' \| 'right'` | Inherited | Override label alignment per item (requires fixed width via `styles.label`) |
| `hasFeedback` | `boolean` | `false` | Show validation status icon |
| `help` | `ReactNode` | Auto | Help text (overrides validation messages) |
| `extra` | `ReactNode` | — | Extra content below field |
| `validateStatus` | `FormValidateStatus` | Auto | Override validation status |
| `initialValue` | `any` | — | Initial value for this field |
| `children` | `ReactNode \| (control, meta, form) => ReactNode` | — | Field content or render prop |
| `className` | `string` | — | CSS class |
| `style` | `CSSProperties` | — | Inline styles |
| `classNames` | `FormItemClassNames` | — | Semantic slot CSS classes |
| `styles` | `FormItemStyles` | — | Semantic slot inline styles |

#### Form.List Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `NamePath` | — | Array field name |
| `children` | `(fields, operations, meta) => ReactNode` | — | Render function |
| `initialValue` | `any[]` | — | Initial array values |

#### Form.ErrorList Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `errors` | `ReactNode[]` | — | Error messages to display |
| `className` | `string` | — | CSS class |
| `style` | `CSSProperties` | — | Inline styles |

#### Form.Provider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onFormFinish` | `(name, info: { values, forms }) => void` | — | Called when any child form finishes |
| `onFormChange` | `(name, info: { changedFields, forms }) => void` | — | Called when any child form changes |

#### Hooks

| Hook | Signature | Description |
|------|-----------|-------------|
| `Form.useForm` | `(form?) => [FormInstance]` | Creates a form instance for programmatic control |
| `useWatch` | `(name, form?) => value` | Subscribes to a field value reactively |
| `useFormInstance` | `() => FormInstance` | Access form instance from any child component |

#### Types

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

// Semantic slot types
type FormSemanticSlot = 'root'
type FormItemSemanticSlot = 'root' | 'label' | 'control' | 'help' | 'extra'
```

#### Semantic DOM

**Form:**

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<form>` | Root form element |

**Form.Item:**

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<div>` | Item wrapper with layout (horizontal/vertical) |
| `label` | `<label>` | Label with required mark and colon |
| `control` | `<div>` | Control area wrapping the field |
| `help` | `<div>` | Validation messages or custom help text |
| `extra` | `<div>` | Extra content below the field |

#### Examples

```tsx
// Basic form
const [form] = Form.useForm()

<Form form={form} onFinish={(values) => console.log(values)}>
  <Form.Item label="Username" name="username" rules={[{ required: true }]}>
    <input />
  </Form.Item>
  <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
    <input />
  </Form.Item>
  <button type="submit">Submit</button>
</Form>

// Vertical layout
<Form layout="vertical">
  <Form.Item label="Name" name="name">
    <input />
  </Form.Item>
</Form>

// Inline layout
<Form layout="inline">
  <Form.Item name="search">
    <input placeholder="Search..." />
  </Form.Item>
  <button type="submit">Go</button>
</Form>

// Mix layouts (per-item override)
<Form layout="horizontal">
  <Form.Item label="Name" name="name">
    <input />
  </Form.Item>
  <Form.Item layout="vertical" label="Bio" name="bio">
    <textarea />
  </Form.Item>
</Form>

// Validation rules
<Form.Item
  label="Password"
  name="password"
  rules={[
    { required: true, message: 'Password is required' },
    { min: 8, message: 'At least 8 characters' },
    { pattern: /[A-Z]/, message: 'Must contain uppercase' },
  ]}
>
  <input type="password" />
</Form.Item>

// Custom async validator
<Form.Item
  label="Username"
  name="username"
  rules={[{
    validator: async (_, value) => {
      const exists = await checkUsername(value)
      if (exists) throw new Error('Username taken')
    },
  }]}
>
  <input />
</Form.Item>

// Dependencies (confirm password)
<Form.Item label="Password" name="password" rules={[{ required: true }]}>
  <input type="password" />
</Form.Item>
<Form.Item
  label="Confirm"
  name="confirm"
  dependencies={['password']}
  rules={[{
    validator: async (_, value) => {
      if (value !== form.getFieldValue('password')) {
        throw new Error('Passwords do not match')
      }
    },
  }]}
>
  <input type="password" />
</Form.Item>

// hasFeedback (status icons)
<Form.Item label="Email" name="email" hasFeedback rules={[{ type: 'email' }]}>
  <input />
</Form.Item>

// Checkbox with valuePropName
<Form.Item name="agree" valuePropName="checked">
  <Checkbox>I agree to the terms</Checkbox>
</Form.Item>

// Form.List (dynamic fields)
<Form.List name="users">
  {(fields, { add, remove }) => (
    <>
      {fields.map(({ key, name }) => (
        <div key={key} style={{ display: 'flex', gap: 8 }}>
          <Form.Item name={[name, 'name']} rules={[{ required: true }]}>
            <input placeholder="Name" />
          </Form.Item>
          <button type="button" onClick={() => remove(name)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => add()}>Add User</button>
    </>
  )}
</Form.List>

// useWatch
function PriceDisplay() {
  const price = Form.useWatch('price')
  return <span>Current: ${price ?? 0}</span>
}

// Programmatic control
form.setFieldsValue({ username: 'john', email: 'john@example.com' })
form.resetFields()
form.validateFields(['username'])
form.scrollToField('email')

// Disabled form
<Form disabled>
  <Form.Item label="Name" name="name"><input /></Form.Item>
</Form>

// Required mark variations
<Form requiredMark="optional">...</Form>
<Form requiredMark={{ position: 'prefix' }}>...</Form>
<Form requiredMark={false}>...</Form>

// Form.Provider (cross-form communication)
// Main form collects a project name + a contacts list.
// Clicking "Add contact" opens a modal with its own form.
// When the contact form submits, Form.Provider catches it
// via onFormFinish, adds the contact, resets the form & closes the modal.
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
        <Form.Item name="project" label="Project name" rules={[{ required: true }]}>
          <input />
        </Form.Item>
        <Form.Item label="Contacts">
          {contacts.map((c, i) => <div key={i}>{c.name} — {c.phone}</div>)}
          <button type="button" onClick={() => setShowModal(true)}>+ Add contact</button>
        </Form.Item>
        <Form.Item><button type="submit">Submit all</button></Form.Item>
      </Form>

      {/* Modal with its own form */}
      {showModal && (
        <div className="modal-overlay">
          <Form form={contactForm} name="contactForm" layout="vertical">
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <input />
            </Form.Item>
            <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
              <input />
            </Form.Item>
            <button type="button" onClick={() => contactForm.submit()}>Add</button>
          </Form>
        </div>
      )}
    </Form.Provider>
  )
}

// Semantic styling
<Form.Item
  label="Name"
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
<summary><strong>Flex</strong> - Flexbox container for layout</summary>

### Flex

A flexible box layout component for arranging elements with CSS Flexbox.

#### Import

```tsx
import { Flex } from 'j-ui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Flex container content |
| `vertical` | `boolean` | `false` | Vertical direction (column) instead of horizontal (row) |
| `wrap` | `'nowrap' \| 'wrap' \| 'wrap-reverse' \| boolean` | `'nowrap'` | Wrap behavior |
| `justify` | `FlexJustify` | `'normal'` | Horizontal alignment (justify-content) |
| `align` | `FlexAlign` | `'normal'` | Vertical alignment (align-items) |
| `gap` | `'small' \| 'middle' \| 'large' \| number \| [number, number]` | — | Space between elements |
| `flex` | `CSSProperties['flex']` | — | Flex property of the container |
| `component` | `ElementType` | `'div'` | HTML element to render |

#### FlexJustify Values

`'flex-start'` | `'center'` | `'flex-end'` | `'space-between'` | `'space-around'` | `'space-evenly'` | `'start'` | `'end'` | `'normal'`

#### FlexAlign Values

`'flex-start'` | `'center'` | `'flex-end'` | `'stretch'` | `'baseline'` | `'start'` | `'end'` | `'normal'`

#### Gap Values

| Gap | Value |
|-----|-------|
| `'small'` | 8px |
| `'middle'` | 16px |
| `'large'` | 24px |
| `number` | Custom px value |
| `[h, v]` | [horizontal, vertical] gap |

#### Examples

```tsx
// Basic horizontal flex
<Flex>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Flex>

// Vertical flex
<Flex vertical>
  <div>Top</div>
  <div>Middle</div>
  <div>Bottom</div>
</Flex>

// With gap
<Flex gap="middle">
  <div>Item 1</div>
  <div>Item 2</div>
</Flex>

// Custom numeric gap
<Flex gap={20}>
  <div>Item 1</div>
  <div>Item 2</div>
</Flex>

// Different horizontal and vertical gap
<Flex wrap gap={[16, 8]}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Flex>

// Justify and align
<Flex justify="center" align="center" style={{ height: 200 }}>
  <div>Centered</div>
</Flex>

// Space between
<Flex justify="space-between">
  <div>Left</div>
  <div>Right</div>
</Flex>

// With wrap
<Flex wrap gap="small">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</Flex>

// Custom element
<Flex component="nav" gap="middle">
  <a href="/">Home</a>
  <a href="/about">About</a>
</Flex>

// Combined
<Flex vertical gap="large" align="stretch">
  <Flex justify="space-between">
    <span>Title</span>
    <button>Action</button>
  </Flex>
  <div>Content</div>
</Flex>
```

</details>

---

<details>
<summary><strong>Grid</strong> - 24-column responsive grid system</summary>

### Grid

A responsive grid system based on 24 columns with Row and Col components.

#### Import

```tsx
import { Grid, Row, Col } from 'j-ui'
// or
import { Grid } from 'j-ui'
// Use as Grid.Row and Grid.Col
```

#### Row Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Col components |
| `gutter` | `number \| ResponsiveGutter \| [horizontal, vertical]` | `0` | Space between columns (px) |
| `align` | `'top' \| 'middle' \| 'bottom' \| 'stretch'` | `'top'` | Vertical alignment |
| `justify` | `'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between' \| 'space-evenly'` | `'start'` | Horizontal alignment |
| `wrap` | `boolean` | `true` | Allow wrapping |

#### Col Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Column content |
| `span` | `number` | — | Number of columns (1-24) |
| `offset` | `number` | — | Columns to offset from left |
| `push` | `number` | — | Move right with position |
| `pull` | `number` | — | Move left with position |
| `order` | `number` | — | Flex order |
| `flex` | `CSSProperties['flex']` | — | Flex property |
| `xs` | `number \| ColSpanProps` | — | <576px |
| `sm` | `number \| ColSpanProps` | — | ≥576px |
| `md` | `number \| ColSpanProps` | — | ≥768px |
| `lg` | `number \| ColSpanProps` | — | ≥992px |
| `xl` | `number \| ColSpanProps` | — | ≥1200px |
| `xxl` | `number \| ColSpanProps` | — | ≥1600px |

#### Breakpoints

| Breakpoint | Min Width |
|------------|-----------|
| `xs` | 0px |
| `sm` | 576px |
| `md` | 768px |
| `lg` | 992px |
| `xl` | 1200px |
| `xxl` | 1600px |

#### Examples

```tsx
// Basic grid
<Row>
  <Col span={12}>50%</Col>
  <Col span={12}>50%</Col>
</Row>

// Three columns
<Row>
  <Col span={8}>33.33%</Col>
  <Col span={8}>33.33%</Col>
  <Col span={8}>33.33%</Col>
</Row>

// With gutter
<Row gutter={16}>
  <Col span={6}>25%</Col>
  <Col span={6}>25%</Col>
  <Col span={6}>25%</Col>
  <Col span={6}>25%</Col>
</Row>

// Horizontal and vertical gutter
<Row gutter={[16, 24]}>
  <Col span={6}>Item</Col>
  <Col span={6}>Item</Col>
  <Col span={6}>Item</Col>
  <Col span={6}>Item</Col>
  <Col span={6}>Item</Col>
  <Col span={6}>Item</Col>
</Row>

// With offset
<Row>
  <Col span={8}>col-8</Col>
  <Col span={8} offset={8}>col-8 offset-8</Col>
</Row>

// Responsive
<Row gutter={16}>
  <Col xs={24} sm={12} md={8} lg={6}>
    Responsive column
  </Col>
  <Col xs={24} sm={12} md={8} lg={6}>
    Responsive column
  </Col>
  <Col xs={24} sm={12} md={8} lg={6}>
    Responsive column
  </Col>
  <Col xs={24} sm={12} md={8} lg={6}>
    Responsive column
  </Col>
</Row>

// Responsive with full props
<Row>
  <Col xs={{ span: 24 }} md={{ span: 12, offset: 6 }}>
    Complex responsive
  </Col>
</Row>

// Alignment
<Row justify="center" align="middle" style={{ height: 100 }}>
  <Col span={4}>Centered</Col>
</Row>

// Flex columns
<Row>
  <Col flex="100px">Fixed 100px</Col>
  <Col flex="auto">Flexible</Col>
  <Col flex="100px">Fixed 100px</Col>
</Row>

// Using Grid namespace
<Grid.Row gutter={16}>
  <Grid.Col span={12}>Left</Grid.Col>
  <Grid.Col span={12}>Right</Grid.Col>
</Grid.Row>
```

</details>

---

<details>
<summary><strong>Layout</strong> - Page layout with Header, Sider, Content, Footer</summary>

### Layout

A complete page layout system with Header, Footer, Sider, and Content components.

#### Import

```tsx
import { Layout } from 'j-ui'
// Use as Layout, Layout.Header, Layout.Sider, Layout.Content, Layout.Footer

// Or import individually
import { Layout, Header, Footer, Content, Sider } from 'j-ui'
```

#### Layout Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Layout content |
| `hasSider` | `boolean` | `false` | Has Sider as direct child |

#### Header Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Header content |

Default height: 64px, padding: 0 24px

#### Footer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Footer content |

Default padding: 24px 50px

#### Content Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Main content |

Default padding: 24px

#### Sider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Sider content |
| `width` | `number \| string` | `200` | Sider width (px) |
| `collapsedWidth` | `number` | `80` | Width when collapsed |
| `collapsible` | `boolean` | `false` | Can be collapsed |
| `collapsed` | `boolean` | — | Controlled collapsed state |
| `defaultCollapsed` | `boolean` | `false` | Initial collapsed state |
| `reverseArrow` | `boolean` | `false` | Reverse trigger arrow direction |
| `breakpoint` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'` | — | Auto-collapse breakpoint |
| `theme` | `'light' \| 'dark'` | `'dark'` | Sider theme |
| `trigger` | `ReactNode \| null` | — | Custom trigger, null to hide |
| `onCollapse` | `(collapsed: boolean, type: 'clickTrigger' \| 'responsive') => void` | — | Collapse callback |
| `onBreakpoint` | `(broken: boolean) => void` | — | Breakpoint callback |

#### Breakpoints

| Breakpoint | Width |
|------------|-------|
| `xs` | 480px |
| `sm` | 576px |
| `md` | 768px |
| `lg` | 992px |
| `xl` | 1200px |
| `xxl` | 1600px |

#### Sider Semantic DOM

| Slot | Description |
|------|-------------|
| `root` | Outer `<aside>` element |
| `content` | Inner content wrapper |
| `trigger` | Collapse trigger button |

#### Examples

```tsx
// Basic layout
<Layout>
  <Layout.Header>Header</Layout.Header>
  <Layout.Content>Content</Layout.Content>
  <Layout.Footer>Footer</Layout.Footer>
</Layout>

// With Sider
<Layout>
  <Layout.Header>Header</Layout.Header>
  <Layout hasSider>
    <Layout.Sider>Sidebar</Layout.Sider>
    <Layout.Content>Content</Layout.Content>
  </Layout>
  <Layout.Footer>Footer</Layout.Footer>
</Layout>

// Sider on right
<Layout hasSider>
  <Layout.Content>Content</Layout.Content>
  <Layout.Sider>Right Sidebar</Layout.Sider>
</Layout>

// Collapsible Sider
<Layout hasSider>
  <Layout.Sider collapsible>
    Navigation
  </Layout.Sider>
  <Layout.Content>Content</Layout.Content>
</Layout>

// Controlled collapse
function MyLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Layout hasSider>
      <Layout.Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(c) => setCollapsed(c)}
      >
        Navigation
      </Layout.Sider>
      <Layout.Content>Content</Layout.Content>
    </Layout>
  )
}

// Responsive collapse
<Layout hasSider>
  <Layout.Sider
    collapsible
    breakpoint="lg"
    onBreakpoint={(broken) => console.log('Broken:', broken)}
  >
    Responsive Sidebar
  </Layout.Sider>
  <Layout.Content>Content</Layout.Content>
</Layout>

// Custom collapsed width
<Layout hasSider>
  <Layout.Sider collapsible collapsedWidth={0}>
    Hidden when collapsed
  </Layout.Sider>
  <Layout.Content>Content</Layout.Content>
</Layout>

// Light theme
<Layout hasSider>
  <Layout.Sider theme="light">
    Light Sidebar
  </Layout.Sider>
  <Layout.Content>Content</Layout.Content>
</Layout>

// Custom trigger
<Layout hasSider>
  <Layout.Sider
    collapsible
    trigger={<span>Toggle</span>}
  >
    Custom Trigger
  </Layout.Sider>
  <Layout.Content>Content</Layout.Content>
</Layout>

// No trigger (control externally)
<Layout hasSider>
  <Layout.Sider collapsible trigger={null} collapsed={collapsed}>
    <button onClick={() => setCollapsed(!collapsed)}>Toggle</button>
  </Layout.Sider>
  <Layout.Content>Content</Layout.Content>
</Layout>

// Full page layout
<Layout style={{ minHeight: '100vh' }}>
  <Layout.Header>
    <div>Logo</div>
    <nav>Navigation</nav>
  </Layout.Header>
  <Layout hasSider>
    <Layout.Sider collapsible breakpoint="md">
      <nav>Side Navigation</nav>
    </Layout.Sider>
    <Layout>
      <Layout.Content>
        <main>Main Content</main>
      </Layout.Content>
      <Layout.Footer>© 2024 Company</Layout.Footer>
    </Layout>
  </Layout>
</Layout>
```

#### useSider Hook

Access sider context from child components:

```tsx
import { useSider } from 'j-ui'

function MenuComponent() {
  const { siderCollapsed } = useSider()

  return (
    <nav>
      {siderCollapsed ? <IconOnly /> : <FullMenu />}
    </nav>
  )
}
```

</details>

---

<details>
<summary><strong>Menu</strong> - Navigation menu with multiple modes</summary>

### Menu

A versatile navigation menu component supporting vertical, horizontal, and inline modes. Features sub-menus, item groups, dividers, selection management (single/multiple), inline collapse, and controlled/uncontrolled state.

#### Import

```tsx
import { Menu } from 'j-ui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `MenuItemType[]` | `[]` | Menu items (declarative) |
| `mode` | `'vertical' \| 'horizontal' \| 'inline'` | `'vertical'` | Menu display mode |
| `selectedKeys` | `string[]` | — | Controlled selected item keys |
| `defaultSelectedKeys` | `string[]` | `[]` | Initial selected keys (uncontrolled) |
| `openKeys` | `string[]` | — | Controlled open sub-menu keys |
| `defaultOpenKeys` | `string[]` | `[]` | Initial open sub-menu keys (uncontrolled) |
| `multiple` | `boolean` | `false` | Allow multiple selection |
| `selectable` | `boolean` | `true` | Enable item selection |
| `inlineCollapsed` | `boolean` | `false` | Collapse inline menu to icons only |
| `inlineIndent` | `number` | `24` | Indent width (px) per inline level |
| `triggerSubMenuAction` | `'hover' \| 'click'` | `'hover'` | How sub-menus are triggered |
| `onClick` | `(info: MenuClickInfo) => void` | — | Global click handler |
| `onSelect` | `(info: MenuSelectInfo) => void` | — | Callback when an item is selected |
| `onDeselect` | `(info: MenuSelectInfo) => void` | — | Callback when an item is deselected (multiple mode) |
| `onOpenChange` | `(openKeys: string[]) => void` | — | Callback when open sub-menus change |
| `expandIcon` | `ReactNode` | — | Custom expand icon for sub-menus |
| `className` | `string` | — | Additional CSS class |
| `style` | `CSSProperties` | — | Additional inline styles |
| `classNames` | `MenuClassNames` | — | CSS classes for internal parts |
| `styles` | `MenuStyles` | — | Styles for internal parts |

#### MenuItemType

A union of the following types:

**MenuItemOption** — Regular menu item:

```typescript
interface MenuItemOption {
  key: string
  label?: ReactNode       // Item content
  icon?: ReactNode        // Left icon
  disabled?: boolean      // Disable item
  danger?: boolean        // Danger style (red)
  title?: string          // HTML title attribute
  onClick?: (info: MenuClickInfo) => void
}
```

**SubMenuOption** — Item with nested children:

```typescript
interface SubMenuOption {
  key: string
  label?: ReactNode       // Sub-menu trigger text
  icon?: ReactNode        // Left icon
  disabled?: boolean
  children: MenuItemType[]  // Nested items
}
```

**MenuItemGroupOption** — Visual group with title:

```typescript
interface MenuItemGroupOption {
  key?: string
  type: 'group'
  label?: ReactNode       // Group title
  children: MenuItemType[]
}
```

**MenuDividerOption** — Separator line:

```typescript
interface MenuDividerOption {
  key?: string
  type: 'divider'
  dashed?: boolean        // Dashed line style
}
```

#### Callback Info

```typescript
interface MenuClickInfo {
  key: string             // Clicked item key
  keyPath: string[]       // Full key path from item to root
  domEvent: MouseEvent
}

interface MenuSelectInfo extends MenuClickInfo {
  selectedKeys: string[]  // All currently selected keys
}
```

#### Semantic DOM

| Slot | Description |
|------|-------------|
| `root` | Outer `<ul>` element |
| `item` | Individual menu item or sub-menu trigger |
| `submenu` | Sub-menu `<ul>` container (popup or inline) |
| `group` | Group `<li>` wrapper |
| `groupTitle` | Group title `<div>` element |
| `divider` | Divider `<li>` element |

#### Examples

```tsx
// Basic vertical menu
<Menu
  items={[
    { key: 'home', label: 'Home', icon: <HomeIcon /> },
    { key: 'about', label: 'About' },
    { key: 'contact', label: 'Contact' },
  ]}
  onClick={({ key }) => console.log('Clicked:', key)}
/>

// Horizontal menu
<Menu
  mode="horizontal"
  items={[
    { key: 'home', label: 'Home' },
    { key: 'products', label: 'Products' },
    { key: 'about', label: 'About' },
  ]}
  defaultSelectedKeys={['home']}
/>

// With sub-menus
<Menu
  items={[
    { key: 'inbox', label: 'Inbox', icon: <InboxIcon /> },
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingsIcon />,
      children: [
        { key: 'profile', label: 'Profile' },
        { key: 'account', label: 'Account' },
        { key: 'security', label: 'Security' },
      ],
    },
    { key: 'logout', label: 'Log out', danger: true },
  ]}
/>

// With groups and dividers
<Menu
  items={[
    {
      key: 'group1',
      type: 'group',
      label: 'Navigation',
      children: [
        { key: 'home', label: 'Home' },
        { key: 'dashboard', label: 'Dashboard' },
      ],
    },
    { key: 'd1', type: 'divider' },
    {
      key: 'group2',
      type: 'group',
      label: 'Settings',
      children: [
        { key: 'profile', label: 'Profile' },
        { key: 'preferences', label: 'Preferences' },
      ],
    },
  ]}
/>

// Dashed divider
<Menu
  items={[
    { key: 'item1', label: 'Item 1' },
    { key: 'd1', type: 'divider', dashed: true },
    { key: 'item2', label: 'Item 2' },
  ]}
/>

// Inline mode (sidebar)
<Menu
  mode="inline"
  defaultOpenKeys={['sub1']}
  defaultSelectedKeys={['1']}
  items={[
    {
      key: 'sub1',
      label: 'Navigation One',
      icon: <HomeIcon />,
      children: [
        { key: '1', label: 'Option 1' },
        { key: '2', label: 'Option 2' },
      ],
    },
    {
      key: 'sub2',
      label: 'Navigation Two',
      icon: <SettingsIcon />,
      children: [
        { key: '3', label: 'Option 3' },
        { key: '4', label: 'Option 4' },
      ],
    },
  ]}
  style={{ width: 256 }}
/>

// Inline collapsed (icon-only sidebar)
<Menu
  mode="inline"
  inlineCollapsed={true}
  items={[
    { key: 'home', label: 'Home', icon: <HomeIcon /> },
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingsIcon />,
      children: [
        { key: 'profile', label: 'Profile' },
        { key: 'account', label: 'Account' },
      ],
    },
  ]}
/>

// Multiple selection
<Menu
  multiple
  items={[
    { key: 'bold', label: 'Bold', icon: <BoldIcon /> },
    { key: 'italic', label: 'Italic', icon: <ItalicIcon /> },
    { key: 'underline', label: 'Underline', icon: <UnderlineIcon /> },
  ]}
  defaultSelectedKeys={['bold']}
  onSelect={({ selectedKeys }) => console.log('Selected:', selectedKeys)}
/>

// Click trigger for sub-menus
<Menu
  triggerSubMenuAction="click"
  items={[
    { key: 'home', label: 'Home' },
    {
      key: 'more',
      label: 'More',
      children: [
        { key: 'help', label: 'Help' },
        { key: 'about', label: 'About' },
      ],
    },
  ]}
/>

// Controlled state
const [selectedKeys, setSelectedKeys] = useState(['home'])
const [openKeys, setOpenKeys] = useState<string[]>([])

<Menu
  selectedKeys={selectedKeys}
  openKeys={openKeys}
  onSelect={({ selectedKeys }) => setSelectedKeys(selectedKeys)}
  onOpenChange={(keys) => setOpenKeys(keys)}
  items={[
    { key: 'home', label: 'Home' },
    {
      key: 'nav',
      label: 'Navigation',
      children: [
        { key: 'page1', label: 'Page 1' },
        { key: 'page2', label: 'Page 2' },
      ],
    },
  ]}
/>

// Disabled items
<Menu
  items={[
    { key: 'active', label: 'Active' },
    { key: 'disabled', label: 'Disabled', disabled: true },
    { key: 'danger', label: 'Delete', danger: true },
  ]}
/>

// Custom expand icon
<Menu
  expandIcon={<span>+</span>}
  items={[
    {
      key: 'sub',
      label: 'Sub Menu',
      children: [
        { key: 'a', label: 'Item A' },
        { key: 'b', label: 'Item B' },
      ],
    },
  ]}
/>

// Non-selectable menu (action-only)
<Menu
  selectable={false}
  items={[
    { key: 'copy', label: 'Copy', icon: <CopyIcon /> },
    { key: 'paste', label: 'Paste', icon: <PasteIcon /> },
  ]}
  onClick={({ key }) => handleAction(key)}
/>
```

</details>

---

<details>
<summary><strong>NestedSelect</strong> - Cascading hierarchical selection with search and multiple mode</summary>

### NestedSelect

A cascading selection component for hierarchical data (e.g., province/city/district). Supports single and multiple selection with checkboxes, search with highlighting, lazy loading, custom field names, display render, tag management, expand-on-hover, and an inline panel variant (`NestedSelect.Panel`).

#### Import

```tsx
import { NestedSelect } from 'j-ui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `NestedSelectOption[]` | `[]` | Hierarchical options |
| `value` | `(string\|number)[] \| (string\|number)[][]` | — | Controlled value. Single: path array. Multiple: array of paths |
| `defaultValue` | `(string\|number)[] \| (string\|number)[][]` | — | Default value (uncontrolled) |
| `placeholder` | `string` | `'Seleccionar'` | Placeholder text |
| `open` | `boolean` | — | Controlled dropdown visibility |
| `disabled` | `boolean` | `false` | Disable the component |
| `allowClear` | `boolean` | `true` | Show clear button |
| `expandTrigger` | `'click' \| 'hover'` | `'click'` | How to expand sub-options |
| `changeOnSelect` | `boolean` | `false` | Allow selecting intermediate levels |
| `showSearch` | `boolean \| NestedSelectSearchConfig` | `false` | Enable search |
| `variant` | `'outlined' \| 'filled' \| 'borderless'` | `'outlined'` | Visual variant |
| `status` | `'error' \| 'warning'` | — | Validation status |
| `size` | `'large' \| 'middle' \| 'small'` | `'middle'` | Component size |
| `suffixIcon` | `ReactNode` | chevron | Custom suffix icon |
| `expandIcon` | `ReactNode` | chevron-right | Custom expand icon |
| `notFoundContent` | `ReactNode` | `'Sin resultados'` | Content when search has no matches |
| `displayRender` | `(labels, selectedOptions) => ReactNode` | — | Custom display render (single mode) |
| `fieldNames` | `NestedSelectFieldNames` | — | Custom field name mapping |
| `placement` | `NestedSelectPlacement` | `'bottomLeft'` | Dropdown position |
| `multiple` | `boolean` | `false` | Enable multiple selection with checkboxes |
| `showCheckedStrategy` | `'SHOW_PARENT' \| 'SHOW_CHILD'` | `'SHOW_CHILD'` | Tag display strategy in multiple mode |
| `maxTagCount` | `number` | — | Max visible tags in multiple mode |
| `maxTagPlaceholder` | `ReactNode \| ((omitted) => ReactNode)` | — | Placeholder for hidden tags |
| `tagRender` | `(props: NestedSelectTagRenderProps) => ReactNode` | — | Custom tag render |
| `loadData` | `(selectedOptions) => void` | — | Lazy load callback |
| `prefix` | `ReactNode` | — | Content before value in selector |
| `popupRender` | `(menus: ReactNode) => ReactNode` | — | Custom dropdown content wrapper |
| `onChange` | `(value, selectedOptions) => void` | — | Called when selection changes |
| `onDropdownVisibleChange` | `(open: boolean) => void` | — | Called when dropdown visibility changes |
| `className` | `string` | — | CSS class for the root element |
| `style` | `CSSProperties` | — | Inline styles for the root element |
| `classNames` | `NestedSelectClassNames` | — | CSS classes for internal parts |
| `styles` | `NestedSelectStyles` | — | Inline styles for internal parts |

#### NestedSelect.Panel Props

An inline version of the cascading menus (no dropdown/selector).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `NestedSelectOption[]` | `[]` | Hierarchical options |
| `value` | `(string\|number)[] \| (string\|number)[][]` | — | Controlled value |
| `defaultValue` | `(string\|number)[] \| (string\|number)[][]` | — | Default value |
| `onChange` | `(value, selectedOptions) => void` | — | Called when selection changes |
| `multiple` | `boolean` | `false` | Enable multiple selection |
| `expandTrigger` | `'click' \| 'hover'` | `'click'` | How to expand sub-options |
| `changeOnSelect` | `boolean` | `false` | Allow selecting intermediate levels |
| `fieldNames` | `NestedSelectFieldNames` | — | Custom field name mapping |
| `expandIcon` | `ReactNode` | — | Custom expand icon |
| `disabled` | `boolean` | `false` | Disable the panel |

#### Types

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

#### Semantic DOM

| Slot | Description |
|------|-------------|
| `root` | Outer wrapper container |
| `selector` | Trigger/input element |
| `dropdown` | Dropdown popup container |
| `menu` | Each cascading column menu |
| `option` | Individual option item |

#### Examples

**Basic usage**

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
  placeholder="Select location"
/>
```

**Controlled value**

```tsx
const [value, setValue] = useState<(string | number)[]>([])

<NestedSelect
  value={value}
  onChange={(val) => setValue(val)}
  options={options}
/>
```

**Expand on hover**

```tsx
<NestedSelect
  expandTrigger="hover"
  options={options}
/>
```

**Allow selecting intermediate levels**

```tsx
<NestedSelect
  changeOnSelect
  options={options}
/>
```

**With search**

```tsx
<NestedSelect
  showSearch
  options={options}
  placeholder="Search..."
/>
```

**Custom search filter and render**

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

**Multiple selection**

```tsx
<NestedSelect
  multiple
  options={options}
  placeholder="Select multiple..."
/>
```

**SHOW_PARENT strategy**

```tsx
<NestedSelect
  multiple
  showCheckedStrategy={NestedSelect.SHOW_PARENT}
  options={options}
/>
```

**Max tag count**

```tsx
<NestedSelect
  multiple
  maxTagCount={2}
  maxTagPlaceholder={(omitted) => `+${omitted.length} more`}
  options={options}
/>
```

**Custom display render**

```tsx
<NestedSelect
  displayRender={(labels) => labels.join(' > ')}
  options={options}
/>
```

**Custom field names**

```tsx
<NestedSelect
  fieldNames={{ label: 'name', value: 'code', children: 'items' }}
  options={[
    { code: 'us', name: 'United States', items: [{ code: 'ny', name: 'New York' }] },
  ]}
/>
```

**Lazy loading**

```tsx
const [options, setOptions] = useState(initialOptions)

<NestedSelect
  options={options}
  loadData={(selectedOptions) => {
    const target = selectedOptions[selectedOptions.length - 1]
    target.loading = true
    // Fetch children...
    setTimeout(() => {
      target.loading = false
      target.children = [{ value: 'child1', label: 'Child 1' }]
      setOptions([...options])
    }, 1000)
  }}
/>
```

**Inline Panel variant**

```tsx
<NestedSelect.Panel
  options={options}
  onChange={(value, selectedOptions) => console.log(value)}
/>
```

**Disabled and validation status**

```tsx
<NestedSelect disabled options={options} value={['zhejiang', 'hangzhou']} />
<NestedSelect status="error" options={options} />
<NestedSelect status="warning" options={options} />
```

**Sizes and variants**

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
<summary><strong>Pagination</strong> - Page-level navigation with size changer and quick jumper</summary>

### Pagination

A navigation component for splitting content across multiple pages. Supports controlled/uncontrolled state, page size selection, quick page jumper, simple mode, custom item rendering, and two sizes.

#### Import

```tsx
import { Pagination } from 'j-ui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `total` | `number` | `0` | Total number of data items |
| `current` | `number` | — | Controlled current page |
| `defaultCurrent` | `number` | `1` | Default current page (uncontrolled) |
| `pageSize` | `number` | — | Controlled number of items per page |
| `defaultPageSize` | `number` | `10` | Default items per page (uncontrolled) |
| `pageSizeOptions` | `number[]` | `[10, 20, 50, 100]` | Options for the page size selector |
| `showSizeChanger` | `boolean` | auto (`total > 50`) | Show page size changer |
| `showQuickJumper` | `boolean` | `false` | Show quick page jumper input |
| `showTotal` | `(total, range) => ReactNode` | — | Render function for displaying total info |
| `simple` | `boolean` | `false` | Simple mode (input + total pages) |
| `size` | `'default' \| 'small'` | `'default'` | Pagination size |
| `disabled` | `boolean` | `false` | Disable all interactions |
| `hideOnSinglePage` | `boolean` | `false` | Hide pagination when only one page |
| `showLessItems` | `boolean` | `false` | Show fewer page buttons |
| `showTitle` | `boolean` | `true` | Show tooltip titles on buttons |
| `itemRender` | `PaginationItemRender` | — | Custom render function for page items |
| `onChange` | `(page, pageSize) => void` | — | Called when page or pageSize changes |
| `onShowSizeChange` | `(current, size) => void` | — | Called when pageSize changes |
| `className` | `string` | — | CSS class for the root element |
| `style` | `CSSProperties` | — | Inline styles for the root element |
| `classNames` | `PaginationClassNames` | — | CSS classes for internal parts |
| `styles` | `PaginationStyles` | — | Inline styles for internal parts |

#### Types

```tsx
type PaginationSize = 'default' | 'small'

type PaginationItemType = 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next'

type PaginationItemRender = (
  page: number,
  type: PaginationItemType,
  originalElement: ReactNode,
) => ReactNode
```

#### Semantic DOM

| Slot | Description |
|------|-------------|
| `root` | Outer `<nav>` wrapper |
| `item` | Each page/navigation button |
| `options` | Container for size changer and quick jumper |

#### Examples

**Basic usage**

```tsx
<Pagination total={50} />
```

**Controlled current page**

```tsx
const [page, setPage] = useState(1)

<Pagination
  current={page}
  total={100}
  onChange={(p) => setPage(p)}
/>
```

**Show total and quick jumper**

```tsx
<Pagination
  total={500}
  showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
  showQuickJumper
/>
```

**Page size changer**

```tsx
<Pagination
  total={200}
  showSizeChanger
  pageSizeOptions={[10, 25, 50]}
  onShowSizeChange={(current, size) => console.log(current, size)}
/>
```

**Small size**

```tsx
<Pagination total={100} size="small" />
```

**Simple mode**

```tsx
<Pagination total={100} simple />
```

**Custom item render**

```tsx
<Pagination
  total={100}
  itemRender={(page, type, originalElement) => {
    if (type === 'prev') return <a href="#">Previous</a>
    if (type === 'next') return <a href="#">Next</a>
    return originalElement
  }}
/>
```

**Hide on single page**

```tsx
<Pagination total={5} pageSize={10} hideOnSinglePage />
```

**Disabled state**

```tsx
<Pagination total={100} disabled />
```

**Show fewer items**

```tsx
<Pagination total={500} showLessItems />
```

</details>

---

<details>
<summary><strong>Space</strong> - Spacing and compact grouping for inline elements</summary>

### Space

A component for setting spacing between inline elements. Supports horizontal/vertical direction, custom sizes, split separators, and a `Space.Compact` subcomponent for grouping elements without gaps.

#### Import

```tsx
import { Space } from 'j-ui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Content |
| `size` | `SpaceSize \| [SpaceSize, SpaceSize]` | `'small'` | Gap between elements. Can be a single value or `[horizontal, vertical]` |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Orientation |
| `align` | `'start' \| 'end' \| 'center' \| 'baseline'` | `'center'` (horizontal) | Cross-axis alignment |
| `wrap` | `boolean` | `false` | Allow wrapping when items overflow |
| `split` | `ReactNode` | — | Separator element between items |
| `className` | `string` | — | Additional CSS class |
| `style` | `CSSProperties` | — | Additional inline styles |

#### SpaceSize

| Value | Size |
|-------|------|
| `'small'` | 8px |
| `'middle'` | 16px |
| `'large'` | 24px |
| `number` | Custom px value |

#### Space.Compact

Groups elements together removing gaps and adjusting border-radius so they appear as a single unit.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Content |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Compact direction |
| `block` | `boolean` | `false` | Take 100% of available width |
| `className` | `string` | — | Additional CSS class |
| `style` | `CSSProperties` | — | Additional inline styles |

#### Hook: useCompactItemContext

Returns context info for items inside `Space.Compact`:

```typescript
interface CompactItemContextValue {
  isFirstItem: boolean
  isLastItem: boolean
  direction: 'horizontal' | 'vertical'
}
```

#### Semantic DOM

| Slot | Description |
|------|-------------|
| `root` | Outer wrapper element |
| `item` | Individual item wrapper |
| `separator` | Split separator element |

#### Examples

```tsx
// Basic horizontal spacing
<Space>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
  <Button>Button 3</Button>
</Space>

// Vertical spacing
<Space direction="vertical">
  <Text>Line 1</Text>
  <Text>Line 2</Text>
  <Text>Line 3</Text>
</Space>

// Custom size
<Space size="large">
  <Badge>Tag 1</Badge>
  <Badge>Tag 2</Badge>
</Space>

// Numeric size
<Space size={32}>
  <Button>A</Button>
  <Button>B</Button>
</Space>

// Different horizontal and vertical sizes
<Space size={['middle', 'large']} wrap>
  <Button>1</Button>
  <Button>2</Button>
  <Button>3</Button>
  <Button>4</Button>
</Space>

// With separator
<Space split={<Divider type="vertical" />}>
  <a href="#">Link 1</a>
  <a href="#">Link 2</a>
  <a href="#">Link 3</a>
</Space>

// Wrap mode
<Space wrap size="middle">
  {tags.map((tag) => (
    <Badge key={tag}>{tag}</Badge>
  ))}
</Space>

// Alignment
<Space align="baseline">
  <Text style={{ fontSize: 24 }}>Large</Text>
  <Text style={{ fontSize: 12 }}>Small</Text>
</Space>

// Space.Compact - horizontal group
<Space.Compact>
  <Button>Left</Button>
  <Button>Center</Button>
  <Button>Right</Button>
</Space.Compact>

// Space.Compact - vertical group
<Space.Compact direction="vertical">
  <Button>Top</Button>
  <Button>Middle</Button>
  <Button>Bottom</Button>
</Space.Compact>

// Space.Compact - full width
<Space.Compact block>
  <Input style={{ flex: 1 }} />
  <Button>Search</Button>
</Space.Compact>
```

</details>

---

<details>
<summary><strong>Splitter</strong> - Resizable split panels</summary>

### Splitter

A component for creating resizable split panels. Supports horizontal/vertical orientation, collapsible panels, min/max constraints, controlled sizes, and lazy resize mode.

#### Import

```tsx
import { Splitter } from 'j-ui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Only accepts `Splitter.Panel` as children |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Split direction |
| `lazy` | `boolean` | `false` | Lazy mode: only updates sizes on mouse release |
| `onResize` | `(sizes: number[]) => void` | — | Callback when sizes change |
| `onResizeStart` | `(sizes: number[]) => void` | — | Callback when dragging starts |
| `onResizeEnd` | `(sizes: number[]) => void` | — | Callback when dragging ends |
| `className` | `string` | — | Additional CSS class |
| `style` | `CSSProperties` | — | Additional inline styles |

#### Splitter.Panel

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Panel content |
| `defaultSize` | `number \| string` | — | Initial size (px or percentage like `"50%"`) |
| `size` | `number \| string` | — | Controlled size |
| `min` | `number \| string` | — | Minimum size (px or percentage) |
| `max` | `number \| string` | — | Maximum size (px or percentage) |
| `resizable` | `boolean` | `true` | Allow resizing this panel |
| `collapsible` | `boolean \| { start?: boolean; end?: boolean }` | `false` | Allow collapsing. `true` = both sides, or specify per side |
| `className` | `string` | — | Additional CSS class |
| `style` | `CSSProperties` | — | Additional inline styles |

#### Semantic DOM

| Slot | Description |
|------|-------------|
| `root` | Outer container element |
| `panel` | Individual panel wrapper |
| `bar` | Drag bar between panels |
| `collapseButton` | Collapse/expand button on the bar |

#### Examples

```tsx
// Basic two-panel split
<Splitter style={{ height: 400 }}>
  <Splitter.Panel>
    <div>Left Panel</div>
  </Splitter.Panel>
  <Splitter.Panel>
    <div>Right Panel</div>
  </Splitter.Panel>
</Splitter>

// Vertical split
<Splitter orientation="vertical" style={{ height: 600 }}>
  <Splitter.Panel>
    <div>Top Panel</div>
  </Splitter.Panel>
  <Splitter.Panel>
    <div>Bottom Panel</div>
  </Splitter.Panel>
</Splitter>

// With default sizes
<Splitter style={{ height: 400 }}>
  <Splitter.Panel defaultSize="30%">
    <div>Sidebar (30%)</div>
  </Splitter.Panel>
  <Splitter.Panel defaultSize="70%">
    <div>Content (70%)</div>
  </Splitter.Panel>
</Splitter>

// Three panels
<Splitter style={{ height: 400 }}>
  <Splitter.Panel defaultSize="25%">
    <div>Left</div>
  </Splitter.Panel>
  <Splitter.Panel defaultSize="50%">
    <div>Center</div>
  </Splitter.Panel>
  <Splitter.Panel defaultSize="25%">
    <div>Right</div>
  </Splitter.Panel>
</Splitter>

// With min and max constraints
<Splitter style={{ height: 400 }}>
  <Splitter.Panel min="20%" max="60%">
    <div>Constrained (20%-60%)</div>
  </Splitter.Panel>
  <Splitter.Panel>
    <div>Flexible</div>
  </Splitter.Panel>
</Splitter>

// Min/max in pixels
<Splitter style={{ height: 400 }}>
  <Splitter.Panel min={200} max={500}>
    <div>200px-500px</div>
  </Splitter.Panel>
  <Splitter.Panel>
    <div>Remaining</div>
  </Splitter.Panel>
</Splitter>

// Collapsible panels
<Splitter style={{ height: 400 }}>
  <Splitter.Panel collapsible>
    <div>Collapsible panel</div>
  </Splitter.Panel>
  <Splitter.Panel>
    <div>Main content</div>
  </Splitter.Panel>
</Splitter>

// Collapsible on specific side
<Splitter style={{ height: 400 }}>
  <Splitter.Panel collapsible={{ end: true }}>
    <div>Collapse towards end</div>
  </Splitter.Panel>
  <Splitter.Panel collapsible={{ start: true }}>
    <div>Collapse towards start</div>
  </Splitter.Panel>
</Splitter>

// Non-resizable panel
<Splitter style={{ height: 400 }}>
  <Splitter.Panel defaultSize={80} resizable={false}>
    <div>Fixed 80px sidebar</div>
  </Splitter.Panel>
  <Splitter.Panel>
    <div>Flexible content</div>
  </Splitter.Panel>
</Splitter>

// Lazy mode (preview line while dragging)
<Splitter lazy style={{ height: 400 }}>
  <Splitter.Panel>
    <div>Left</div>
  </Splitter.Panel>
  <Splitter.Panel>
    <div>Right</div>
  </Splitter.Panel>
</Splitter>

// With resize callbacks
<Splitter
  style={{ height: 400 }}
  onResizeStart={(sizes) => console.log('Start:', sizes)}
  onResize={(sizes) => console.log('Resizing:', sizes)}
  onResizeEnd={(sizes) => console.log('End:', sizes)}
>
  <Splitter.Panel>
    <div>Left</div>
  </Splitter.Panel>
  <Splitter.Panel>
    <div>Right</div>
  </Splitter.Panel>
</Splitter>

// Nested splitters (IDE-like layout)
<Splitter style={{ height: '100vh' }}>
  <Splitter.Panel defaultSize="20%" min="15%" collapsible>
    <div>File Explorer</div>
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
<summary><strong>Steps</strong> - Step-by-step navigation bar with multiple display modes</summary>

### Steps

A navigation component that guides users through a multi-step workflow. Supports horizontal and vertical directions, navigation type, dot style, progress percentage, custom icons, clickable steps, and two sizes.

#### Import

```tsx
import { Steps } from 'j-ui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `StepItem[]` | `[]` | Step definitions |
| `current` | `number` | `0` | Index of the current step |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction |
| `size` | `'default' \| 'small'` | `'default'` | Step size |
| `status` | `StepStatus` | `'process'` | Status of the current step |
| `type` | `'default' \| 'navigation'` | `'default'` | Display type |
| `labelPlacement` | `'horizontal' \| 'vertical'` | `'horizontal'` | Label position relative to icon |
| `progressDot` | `boolean \| ProgressDotRender` | `false` | Use dot style or custom dot render |
| `percent` | `number` | — | Progress percentage ring on current step icon |
| `initial` | `number` | `0` | Starting number for step numbering |
| `onChange` | `(current: number) => void` | — | Callback when a step is clicked (enables clickable steps) |
| `className` | `string` | — | CSS class for the root element |
| `style` | `CSSProperties` | — | Inline styles for the root element |
| `classNames` | `StepsClassNames` | — | CSS classes for internal parts |
| `styles` | `StepsStyles` | — | Inline styles for internal parts |

#### Types

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

#### Semantic DOM

| Slot | Description |
|------|-------------|
| `root` | Outer wrapper container |
| `step` | Individual step wrapper |
| `icon` | Step icon/number circle |
| `content` | Title and description container |
| `tail` | Connector line between steps |

#### Examples

**Basic usage**

```tsx
<Steps
  current={1}
  items={[
    { title: 'Finished', description: 'This is a description' },
    { title: 'In Progress', description: 'This is a description' },
    { title: 'Waiting', description: 'This is a description' },
  ]}
/>
```

**Small size**

```tsx
<Steps
  size="small"
  current={1}
  items={[
    { title: 'Finished' },
    { title: 'In Progress' },
    { title: 'Waiting' },
  ]}
/>
```

**Vertical direction**

```tsx
<Steps
  direction="vertical"
  current={1}
  items={[
    { title: 'Step 1', description: 'Description for step 1' },
    { title: 'Step 2', description: 'Description for step 2' },
    { title: 'Step 3', description: 'Description for step 3' },
  ]}
/>
```

**With custom icons**

```tsx
<Steps
  current={1}
  items={[
    { title: 'Login', icon: <UserIcon /> },
    { title: 'Verification', icon: <IdIcon /> },
    { title: 'Done', icon: <CheckIcon /> },
  ]}
/>
```

**Error status**

```tsx
<Steps
  current={1}
  status="error"
  items={[
    { title: 'Finished' },
    { title: 'Error', description: 'Something went wrong' },
    { title: 'Waiting' },
  ]}
/>
```

**Dot style**

```tsx
<Steps
  progressDot
  current={1}
  items={[
    { title: 'Finished', description: 'This is a description' },
    { title: 'In Progress', description: 'This is a description' },
    { title: 'Waiting', description: 'This is a description' },
  ]}
/>
```

**Navigation type**

```tsx
<Steps
  type="navigation"
  current={1}
  onChange={(step) => console.log(step)}
  items={[
    { title: 'Step 1' },
    { title: 'Step 2' },
    { title: 'Step 3' },
  ]}
/>
```

**Clickable steps**

```tsx
const [current, setCurrent] = useState(0)

<Steps
  current={current}
  onChange={setCurrent}
  items={[
    { title: 'Step 1' },
    { title: 'Step 2' },
    { title: 'Step 3' },
  ]}
/>
```

**With progress percentage**

```tsx
<Steps
  current={1}
  percent={60}
  items={[
    { title: 'Finished' },
    { title: 'In Progress' },
    { title: 'Waiting' },
  ]}
/>
```

**Vertical labels**

```tsx
<Steps
  current={1}
  labelPlacement="vertical"
  items={[
    { title: 'Finished' },
    { title: 'In Progress' },
    { title: 'Waiting' },
  ]}
/>
```

**Per-step status and disabled**

```tsx
<Steps
  items={[
    { title: 'Finished', status: 'finish' },
    { title: 'Error', status: 'error' },
    { title: 'Disabled', disabled: true },
  ]}
/>
```

**Custom dot render**

```tsx
<Steps
  current={1}
  progressDot={(dot, { index, status }) => (
    <Tooltip title={`Step ${index + 1}: ${status}`}>
      {dot}
    </Tooltip>
  )}
  items={[
    { title: 'Finished', description: 'Done' },
    { title: 'In Progress', description: 'Working' },
    { title: 'Waiting', description: 'Pending' },
  ]}
/>
```

</details>

---

<details>
<summary><strong>Tabs</strong> - Tabbed navigation with line, card, and editable modes</summary>

### Tabs

A tabbed navigation component for switching between content panels. Supports line, card, and editable-card types, four tab positions (top/bottom/left/right), overflow scrolling with arrow buttons, ink bar indicator with customizable size and alignment, extra content in the tab bar, and controlled/uncontrolled state.

#### Import

```tsx
import { Tabs } from 'j-ui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `TabItem[]` | `[]` | Tab definitions |
| `activeKey` | `string` | — | Controlled active tab key |
| `defaultActiveKey` | `string` | first item key | Default active tab key (uncontrolled) |
| `type` | `'line' \| 'card' \| 'editable-card'` | `'line'` | Tab display style |
| `size` | `'large' \| 'middle' \| 'small'` | `'middle'` | Tab size |
| `tabPosition` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Position of the tab bar |
| `centered` | `boolean` | `false` | Center tabs in the tab bar |
| `animated` | `boolean \| { inkBar: boolean; tabPane: boolean }` | `{ inkBar: true, tabPane: false }` | Animation configuration |
| `tabBarGutter` | `number` | — | Gap between tabs in pixels |
| `tabBarStyle` | `CSSProperties` | — | Extra styles for the tab bar |
| `tabBarExtraContent` | `ReactNode \| { left?: ReactNode; right?: ReactNode }` | — | Extra content in the tab bar |
| `indicator` | `IndicatorConfig` | — | Ink bar indicator size and alignment |
| `addIcon` | `ReactNode` | `+` | Custom add icon (editable-card) |
| `removeIcon` | `ReactNode` | `×` | Custom remove icon (editable-card) |
| `hideAdd` | `boolean` | `false` | Hide add button (editable-card) |
| `destroyOnHidden` | `boolean` | `false` | Destroy inactive tab panels |
| `onChange` | `(activeKey: string) => void` | — | Called when active tab changes |
| `onEdit` | `(key, action) => void` | — | Called on add/remove (editable-card) |
| `onTabClick` | `(key, event) => void` | — | Called when a tab is clicked |
| `className` | `string` | — | CSS class for the root element |
| `style` | `CSSProperties` | — | Inline styles for the root element |
| `classNames` | `TabsClassNames` | — | CSS classes for internal parts |
| `styles` | `TabsStyles` | — | Inline styles for internal parts |

#### Types

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

#### Semantic DOM

| Slot | Description |
|------|-------------|
| `root` | Outer wrapper container |
| `tabBar` | Tab bar navigation area |
| `tab` | Individual tab button |
| `content` | Tab panel content area |
| `inkBar` | Active tab indicator line |

#### Examples

**Basic usage**

```tsx
<Tabs
  items={[
    { key: '1', label: 'Tab 1', children: 'Content of Tab 1' },
    { key: '2', label: 'Tab 2', children: 'Content of Tab 2' },
    { key: '3', label: 'Tab 3', children: 'Content of Tab 3' },
  ]}
/>
```

**Controlled active tab**

```tsx
const [activeKey, setActiveKey] = useState('1')

<Tabs
  activeKey={activeKey}
  onChange={setActiveKey}
  items={[
    { key: '1', label: 'Tab 1', children: 'Content 1' },
    { key: '2', label: 'Tab 2', children: 'Content 2' },
  ]}
/>
```

**Card type**

```tsx
<Tabs
  type="card"
  items={[
    { key: '1', label: 'Card Tab 1', children: 'Content 1' },
    { key: '2', label: 'Card Tab 2', children: 'Content 2' },
    { key: '3', label: 'Card Tab 3', children: 'Content 3' },
  ]}
/>
```

**Editable card (add/remove)**

```tsx
const [items, setItems] = useState([
  { key: '1', label: 'Tab 1', children: 'Content 1' },
  { key: '2', label: 'Tab 2', children: 'Content 2' },
])

<Tabs
  type="editable-card"
  items={items}
  onEdit={(key, action) => {
    if (action === 'add') {
      const newKey = String(Date.now())
      setItems([...items, { key: newKey, label: 'New Tab', children: 'New content' }])
    } else {
      setItems(items.filter((item) => item.key !== key))
    }
  }}
/>
```

**Tab positions**

```tsx
<Tabs
  tabPosition="left"
  items={[
    { key: '1', label: 'Tab 1', children: 'Content 1' },
    { key: '2', label: 'Tab 2', children: 'Content 2' },
  ]}
/>
```

**Sizes**

```tsx
<Tabs size="small" items={[...]} />
<Tabs size="middle" items={[...]} />
<Tabs size="large" items={[...]} />
```

**With icons**

```tsx
<Tabs
  items={[
    { key: '1', label: 'Home', icon: <HomeIcon />, children: 'Home content' },
    { key: '2', label: 'Settings', icon: <SettingsIcon />, children: 'Settings content' },
  ]}
/>
```

**Centered tabs**

```tsx
<Tabs
  centered
  items={[
    { key: '1', label: 'Tab 1', children: 'Content 1' },
    { key: '2', label: 'Tab 2', children: 'Content 2' },
  ]}
/>
```

**Disabled tab**

```tsx
<Tabs
  items={[
    { key: '1', label: 'Active' },
    { key: '2', label: 'Disabled', disabled: true },
    { key: '3', label: 'Normal' },
  ]}
/>
```

**Extra content in tab bar**

```tsx
<Tabs
  tabBarExtraContent={<button>Extra Action</button>}
  items={[
    { key: '1', label: 'Tab 1', children: 'Content 1' },
    { key: '2', label: 'Tab 2', children: 'Content 2' },
  ]}
/>

{/* Left and right extra content */}
<Tabs
  tabBarExtraContent={{ left: <span>Left</span>, right: <span>Right</span> }}
  items={[...]}
/>
```

**Custom indicator**

```tsx
<Tabs
  indicator={{ size: 40, align: 'center' }}
  items={[
    { key: '1', label: 'Tab 1', children: 'Content 1' },
    { key: '2', label: 'Tab 2', children: 'Content 2' },
  ]}
/>
```

**Destroy inactive panels**

```tsx
<Tabs
  destroyOnHidden
  items={[
    { key: '1', label: 'Tab 1', children: <HeavyComponent /> },
    { key: '2', label: 'Tab 2', children: <AnotherComponent /> },
  ]}
/>
```

</details>

---

<details>
<summary><strong>Text</strong> - Typography with formatting and copy-to-clipboard</summary>

### Text

A typography component for displaying text with various styles, formatting options, and utility features like copy-to-clipboard and text truncation.

#### Import

```tsx
import { Text } from 'j-ui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Text content |
| `type` | `'default' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` | Text color/type |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Text size |
| `weight` | `'thin' \| 'light' \| 'normal' \| 'medium' \| 'semibold' \| 'bold' \| 'extrabold' \| 'black'` | — | Font weight |
| `lineHeight` | `'none' \| 'tight' \| 'snug' \| 'normal' \| 'relaxed' \| 'loose'` | — | Line height |
| `disabled` | `boolean` | `false` | Disabled style (gray, no interaction) |
| `mark` | `boolean` | `false` | Highlight with yellow background |
| `code` | `boolean` | `false` | Inline code style |
| `keyboard` | `boolean` | `false` | Keyboard key style |
| `underline` | `boolean` | `false` | Underlined text |
| `delete` | `boolean` | `false` | Strikethrough text |
| `italic` | `boolean` | `false` | Italic text |
| `copyable` | `boolean \| { text?: string; onCopy?: () => void }` | `false` | Show copy button |
| `ellipsis` | `boolean \| EllipsisConfig` | `false` | Truncate with ellipsis |

#### EllipsisConfig

```typescript
interface EllipsisConfig {
  rows?: number           // Lines before truncating (default: 1)
  expandable?: boolean    // Show expand/collapse button
  onExpand?: (expanded: boolean) => void  // Callback on expand change
}
```

#### Sizes

| Size | Font Size |
|------|-----------|
| `xs` | 10px |
| `sm` | 13px |
| `md` | 16px |
| `lg` | 24px |
| `xl` | 36px |

#### Weights

| Weight | Value |
|--------|-------|
| `thin` | 100 |
| `light` | 300 |
| `normal` | 400 |
| `medium` | 500 |
| `semibold` | 600 |
| `bold` | 700 |
| `extrabold` | 800 |
| `black` | 900 |

#### Line Heights

| LineHeight | Value |
|------------|-------|
| `none` | 1 |
| `tight` | 1.25 |
| `snug` | 1.375 |
| `normal` | 1.5 |
| `relaxed` | 1.625 |
| `loose` | 2 |

#### Semantic DOM

| Slot | Description |
|------|-------------|
| `root` | Outer wrapper element |
| `content` | Text content element |
| `copyButton` | Copy-to-clipboard button |
| `expandButton` | Expand/collapse toggle button |

#### Examples

```tsx
// Basic
<Text>Hello world</Text>

// Types (colors)
<Text type="secondary">Secondary text</Text>
<Text type="success">Success message</Text>
<Text type="warning">Warning message</Text>
<Text type="error">Error message</Text>
<Text type="info">Info message</Text>

// Sizes
<Text size="xs">Extra small</Text>
<Text size="sm">Small</Text>
<Text size="md">Medium</Text>
<Text size="lg">Large</Text>
<Text size="xl">Extra large</Text>

// Font weight
<Text weight="light">Light text</Text>
<Text weight="bold">Bold text</Text>
<Text weight="black">Black text</Text>

// Text styles
<Text mark>Highlighted text</Text>
<Text code>const x = 42</Text>
<Text keyboard>Ctrl</Text> + <Text keyboard>C</Text>
<Text underline>Underlined</Text>
<Text delete>Deleted</Text>
<Text italic>Italic</Text>

// Disabled
<Text disabled>Disabled text</Text>

// Copy to clipboard
<Text copyable>Click the icon to copy this text</Text>

// Custom text to copy
<Text copyable={{ text: "Custom text", onCopy: () => console.log('Copied!') }}>
  Visible text (copies "Custom text")
</Text>

// Single-line ellipsis
<Text ellipsis style={{ width: 200 }}>
  This is a very long text that will be truncated with an ellipsis
</Text>

// Multi-line ellipsis (3 rows)
<Text ellipsis={{ rows: 3 }} style={{ width: 200 }}>
  This is a very long text that spans multiple lines and will be
  truncated after three rows with an ellipsis at the end.
</Text>

// Expandable ellipsis
<Text ellipsis={{ rows: 2, expandable: true }} style={{ width: 200 }}>
  This text can be expanded or collapsed by clicking the button.
  Very useful for long content that you want to show partially.
</Text>

// Combined styles
<Text type="error" weight="bold" size="lg">
  Important Error!
</Text>

<Text type="success" italic underline>
  Task completed successfully
</Text>
```

</details>

---

<details>
<summary><strong>Waterfall</strong> - Masonry/Pinterest-style grid layout</summary>

### Waterfall

A masonry-style layout component that distributes items into columns based on available height, creating a Pinterest-like waterfall effect.

#### Import

```tsx
import { Waterfall } from 'j-ui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `WaterfallItem<T>[]` | `[]` | Array of items to render |
| `columns` | `number \| Partial<Record<Breakpoint, number>>` | `3` | Number of columns (fixed or responsive) |
| `gutter` | `number \| ResponsiveGutter \| [horizontal, vertical]` | `0` | Space between items (px) |
| `itemRender` | `(info: WaterfallItemRenderInfo<T>) => ReactNode` | — | Function to render each item |
| `fresh` | `boolean` | `false` | Continuously monitor item size changes |
| `onLayoutChange` | `(layoutInfo: WaterfallLayoutInfo[]) => void` | — | Callback when column assignment changes |

#### WaterfallItem

```typescript
interface WaterfallItem<T = unknown> {
  key: Key              // Unique identifier
  children?: ReactNode  // Content (takes priority over itemRender)
  height?: number       // Known height in px (improves initial layout)
  column?: number       // Force specific column (0-indexed)
  data?: T              // Custom data associated with item
}
```

#### WaterfallItemRenderInfo

Passed to `itemRender` function:

```typescript
interface WaterfallItemRenderInfo<T> extends WaterfallItem<T> {
  index: number         // Index in original array
  assignedColumn: number // Column assigned by algorithm
}
```

#### Breakpoints

| Breakpoint | Min Width |
|------------|-----------|
| `xs` | 0px |
| `sm` | 576px |
| `md` | 768px |
| `lg` | 992px |
| `xl` | 1200px |
| `xxl` | 1600px |

#### Semantic DOM

| Slot | Description |
|------|-------------|
| `root` | Outer container element |
| `column` | Individual column wrapper |
| `item` | Individual item wrapper |

#### Examples

```tsx
// Basic usage with children
<Waterfall
  items={[
    { key: 1, children: <Card>Item 1</Card> },
    { key: 2, children: <Card>Item 2 with more content</Card> },
    { key: 3, children: <Card>Item 3</Card> },
  ]}
/>

// Using itemRender
<Waterfall
  items={images.map((img) => ({
    key: img.id,
    data: img,
  }))}
  itemRender={({ data, index }) => (
    <img src={data.url} alt={`Image ${index}`} />
  )}
/>

// Custom columns
<Waterfall items={items} columns={4} />

// Responsive columns
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

// With gutter
<Waterfall items={items} gutter={16} />

// Different horizontal and vertical gutter
<Waterfall items={items} gutter={[16, 24]} />

// Responsive gutter
<Waterfall
  items={items}
  gutter={{ xs: 8, md: 16, lg: 24 }}
/>

// With known heights (better initial layout)
<Waterfall
  items={[
    { key: 1, height: 200, children: <Card /> },
    { key: 2, height: 150, children: <Card /> },
    { key: 3, height: 300, children: <Card /> },
  ]}
/>

// Force specific columns
<Waterfall
  items={[
    { key: 'featured', column: 0, children: <FeaturedCard /> },
    { key: 'item1', children: <Card /> },
    { key: 'item2', children: <Card /> },
  ]}
  columns={3}
/>

// Monitor size changes (for dynamic content)
<Waterfall
  items={items}
  fresh
  onLayoutChange={(layout) => {
    console.log('Layout changed:', layout)
  }}
/>

// With ref
const waterfallRef = useRef<WaterfallRef>(null)

<Waterfall
  ref={waterfallRef}
  items={items}
/>

// Access native element
waterfallRef.current?.nativeElement

// Complete example with images
function ImageGallery() {
  const images = [
    { id: 1, url: '/img1.jpg', height: 200 },
    { id: 2, url: '/img2.jpg', height: 300 },
    { id: 3, url: '/img3.jpg', height: 150 },
    { id: 4, url: '/img4.jpg', height: 250 },
  ]

  return (
    <Waterfall
      columns={{ xs: 2, md: 3, lg: 4 }}
      gutter={[16, 16]}
      items={images.map((img) => ({
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

#### Algorithm

The waterfall layout uses a "shortest column first" algorithm:
1. Items are placed in the column with the smallest current height
2. If an item specifies a `column` prop, it will be placed there instead
3. Known heights (`height` prop) are used for initial layout
4. Dynamic heights are measured after render and layout adjusts accordingly
5. With `fresh=true`, items are continuously monitored for size changes

</details>

---

<details>
<summary><strong>Tooltip</strong> - Lightweight hover tooltips</summary>

### Tooltip

A lightweight tooltip component for displaying additional information on hover.

#### Import

```tsx
import { Tooltip } from 'j-ui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `ReactNode` | — | Tooltip content |
| `children` | `ReactNode` | — | Trigger element |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Tooltip position |
| `delay` | `number` | `200` | Delay before showing (ms) |
| `disabled` | `boolean` | `false` | Disable tooltip |

#### Positions

| Position | Description |
|----------|-------------|
| `top` | Above the trigger element |
| `bottom` | Below the trigger element |
| `left` | Left of the trigger element |
| `right` | Right of the trigger element |

#### Semantic DOM

| Slot | Description |
|------|-------------|
| `root` | Wrapper around the trigger element |
| `popup` | Tooltip popup container |
| `arrow` | Tooltip arrow element |

#### Examples

```tsx
// Basic
<Tooltip content="Hello!">
  <Button>Hover me</Button>
</Tooltip>

// Positions
<Tooltip content="Top tooltip" position="top">
  <Button>Top</Button>
</Tooltip>

<Tooltip content="Bottom tooltip" position="bottom">
  <Button>Bottom</Button>
</Tooltip>

<Tooltip content="Left tooltip" position="left">
  <Button>Left</Button>
</Tooltip>

<Tooltip content="Right tooltip" position="right">
  <Button>Right</Button>
</Tooltip>

// Custom delay
<Tooltip content="Quick!" delay={0}>
  <Button>No delay</Button>
</Tooltip>

<Tooltip content="Patient..." delay={1000}>
  <Button>1 second delay</Button>
</Tooltip>

// Disabled
<Tooltip content="Won't show" disabled>
  <Button>Disabled tooltip</Button>
</Tooltip>

// With complex content
<Tooltip content={<span>Styled <strong>content</strong></span>}>
  <Button>Rich content</Button>
</Tooltip>
```

#### Accessibility

The tooltip supports keyboard navigation:
- Shows on focus
- Hides on blur
- Works with screen readers

</details>

---

## License

MIT License - see [LICENSE](./LICENSE) for details.
