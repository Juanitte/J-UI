# Ino-UI

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> **🇪🇸 [Leer en Español](./LEAME.md)**

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
- [Utils](#utils)
  - [DOM Utilities](#dom-utilities)
  - [Object Utilities](#object-utilities)
  - [Breakpoint Utilities](#breakpoint-utilities)
  - [Hooks](#hooks-1)
- [Components](#components)
  - [Affix](#affix)
  - [Alert](#alert)
  - [AutoComplete](#autocomplete)
  - [Avatar](#avatar)
  - [Anchor](#anchor)
  - [App](#app)
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
  - [ConfigProvider](#configprovider)
  - [DataDisplay](#datadisplay)
  - [DatePicker](#datepicker)
  - [Divider](#divider)
  - [Drawer](#drawer)
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
  - [Modal](#modal)
  - [NestedSelect](#nestedselect)
  - [Pagination](#pagination)
  - [PopAlert](#popalert)
  - [PopConfirm](#popconfirm)
  - [Popover](#popover)
  - [Progress](#progress)
  - [QRCode](#qrcode)
  - [Radio](#radio)
  - [Rate](#rate)
  - [Result](#result)
  - [Select](#select)
  - [Slider](#slider)
  - [Space](#space)
  - [Spinner](#spinner)
  - [Splitter](#splitter)
  - [Steps](#steps)
  - [Statistic](#statistic)
  - [Switch](#switch)
  - [Table](#table)
  - [Tabs](#tabs)
  - [Tag](#tag)
  - [Text](#text)
  - [TimePicker](#timepicker)
  - [Timeline](#timeline)
  - [Toggle](#toggle)
  - [Tour](#tour)
  - [Transfer](#transfer)
  - [Tree](#tree)
  - [TreeSelect](#treeselect)
  - [Upload](#upload)
  - [Waterfall](#waterfall)
  - [Watermark](#watermark)
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
npm install @juanitte/inoui

# yarn
yarn add @juanitte/inoui

# pnpm
pnpm add @juanitte/inoui
```

## Quick Start

Wrap your application with `ThemeProvider` and start using components:

```tsx
import { ThemeProvider, Button, Tooltip } from '@juanitte/inoui'

function App() {
  return (
    <ThemeProvider>
      <Tooltip content="Click me!">
        <Button>Hello Ino-UI</Button>
      </Tooltip>
    </ThemeProvider>
  )
}
```

---

## Theme System

Ino-UI includes a powerful theming system that automatically generates color palettes and handles light/dark mode switching.

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
import { useTheme, Button } from '@juanitte/inoui'

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

Ino-UI automatically generates 10 shades (50-900) for each semantic color. These are available as CSS variables:

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

Ino-UI provides a `tokens` object with typed references to all CSS variables. This enables autocomplete in your IDE and type-safe styling in JavaScript/TypeScript.

#### Import

```tsx
import { tokens } from '@juanitte/inoui'
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

Most Ino-UI components expose `classNames` and `styles` props that allow you to style their internal parts (semantic slots) without needing to override CSS or inspect the DOM structure.

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
| Affix | `root`, `affix` |
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

## Utils

Ino-UI exports a set of utility functions and hooks that can be used independently in your application.

```tsx
import {
  getScrollBarSize, scrollTo, canUseDom,
  omit, classNames,
  BREAKPOINT_VALUES, BREAKPOINT_ORDER, getResponsiveValue,
  useEvent, useMergedState, useWindowWidth, useBreakpoint,
} from '@juanitte/inoui'
import type {
  ScrollToOptions, ClassValue,
  Breakpoint, ResponsiveValue,
  UseMergedStateOptions,
} from '@juanitte/inoui'
```

---

### DOM Utilities

#### `getScrollBarSize(fresh?)`

Returns the browser's native scrollbar width in pixels. The result is cached after the first call.

```tsx
import { getScrollBarSize } from '@juanitte/inoui'

const width = getScrollBarSize()      // e.g. 17 (cached)
const fresh = getScrollBarSize(true)  // re-measures even if cached
```

Returns `0` in SSR / non-DOM environments.

#### `scrollTo(top, options?)`

Smoothly scrolls a container to a target vertical position using an easeInOutCubic easing curve.

```tsx
import { scrollTo } from '@juanitte/inoui'
import type { ScrollToOptions } from '@juanitte/inoui'

scrollTo(500)                        // scroll window to y=500
scrollTo(0, {
  container: myRef.current,         // scroll a custom element
  duration: 600,                    // animation duration in ms (default: 450)
  callback: () => console.log('done'),
})
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `container` | `HTMLElement \| Window` | `window` | Scroll target |
| `duration` | `number` | `450` | Animation duration in ms |
| `callback` | `() => void` | — | Called when animation completes |

#### `canUseDom()`

Returns `true` when running in a real browser environment (DOM is available). SSR-safe alternative to checking `typeof window !== 'undefined'`.

```tsx
import { canUseDom } from '@juanitte/inoui'

if (canUseDom()) {
  // safe to access document, window, etc.
}
```

---

### Object Utilities

#### `omit(obj, keys)`

Returns a shallow copy of `obj` with the specified keys removed. Fully typed.

```tsx
import { omit } from '@juanitte/inoui'

const clean = omit(props, ['className', 'style'])
// clean is typed as Omit<typeof props, 'className' | 'style'>
```

#### `classNames(...args)`

Builds a class name string from any mix of strings, numbers, objects, and arrays — falsy values are automatically ignored.

```tsx
import { classNames } from '@juanitte/inoui'
import type { ClassValue } from '@juanitte/inoui'

classNames('foo', undefined, 'bar')           // 'foo bar'
classNames({ active: true, disabled: false }) // 'active'
classNames(['a', ['b', 'c']], 'z')            // 'a b c z'
```

---

### Breakpoint Utilities

These utilities implement a shared responsive breakpoint system used by [Avatar](#avatar), [DataDisplay](#datadisplay), [Grid](#grid), and [Waterfall](#waterfall).

```tsx
import { BREAKPOINT_VALUES, BREAKPOINT_ORDER, getResponsiveValue } from '@juanitte/inoui'
import type { Breakpoint, ResponsiveValue } from '@juanitte/inoui'
```

#### `Breakpoint` type

```typescript
type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
```

#### `BREAKPOINT_VALUES`

```typescript
const BREAKPOINT_VALUES: Record<Breakpoint, number> = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
}
```

#### `BREAKPOINT_ORDER`

Breakpoints sorted from largest to smallest, used when resolving `ResponsiveValue`:

```typescript
const BREAKPOINT_ORDER: Breakpoint[] = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs']
```

#### `ResponsiveValue<T>`

A value that can either be a scalar or a per-breakpoint map:

```typescript
type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>
```

#### `getResponsiveValue(value, windowWidth)`

Resolves a `ResponsiveValue<T>` to a concrete value given the current window width. If `value` is a scalar it is returned as-is; if it is an object, the largest active breakpoint wins.

```tsx
import { getResponsiveValue } from '@juanitte/inoui'

getResponsiveValue(3, 1024)                        // 3
getResponsiveValue({ xs: 1, md: 2, xl: 4 }, 1024) // 2  (lg ≥ md, xl not yet active)
```

---

### Hooks

#### `useEvent(fn)`

Returns a stable function reference that always calls the latest version of `fn`. The returned reference never changes between renders, so it is safe to pass to memoized children without causing re-renders.

```tsx
import { useEvent } from '@juanitte/inoui'

const handleClick = useEvent((e: MouseEvent) => {
  console.log(count) // always reads the latest `count`
})
```

#### `useMergedState(defaultValue, options?)`

Merges controlled and uncontrolled state into a single interface. Behaves like `useState` but also accepts an optional `value` / `onChange` pair for controlled use.

```tsx
import { useMergedState } from '@juanitte/inoui'
import type { UseMergedStateOptions } from '@juanitte/inoui'

// Uncontrolled
const [value, setValue] = useMergedState('hello')

// Controlled
const [value, setValue] = useMergedState('hello', {
  value: controlledValue,
  onChange: (next, prev) => setControlledValue(next),
  postState: (v) => v.trim(), // optional transform before returning
})
```

| Option | Type | Description |
|--------|------|-------------|
| `value` | `T \| undefined` | External controlled value. When defined, the hook is in controlled mode. |
| `onChange` | `(next: T, prev: T) => void` | Called on every state change (controlled and uncontrolled). |
| `postState` | `(value: T) => T` | Optional transform applied before the value is returned. |

#### `useWindowWidth()`

Returns the current `window.innerWidth`, updating on every resize event. SSR-safe — returns `1200` on the server.

```tsx
import { useWindowWidth } from '@juanitte/inoui'

function MyComponent() {
  const width = useWindowWidth()
  return <p>Window is {width}px wide</p>
}
```

#### `useBreakpoint()`

Returns a map of active breakpoints based on the current window width.

```tsx
import { useBreakpoint } from '@juanitte/inoui'

function MyComponent() {
  const screens = useBreakpoint()
  // { xs: true, sm: true, md: true, lg: false, xl: false, xxl: false } at 800px
  return <p>{screens.md ? 'Medium or larger' : 'Smaller than md'}</p>
}
```

Returns `Record<Breakpoint, boolean>` where each key is `true` if the window width meets or exceeds that breakpoint's minimum width.

---

## Components

<details>
<summary><strong>Affix</strong> - Stick an element to the viewport edge while scrolling</summary>

### Affix

`Affix` keeps its children pinned to the top or bottom of the viewport (or a custom scroll container) once the user scrolls past a defined threshold. A placeholder `div` of equal size replaces the content in the normal flow so the page layout does not jump when the element becomes fixed.

```tsx
import { Affix } from '@juanitte/inoui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `offsetTop` | `number` | `0`* | Distance in px from the top of the container at which to pin the element. *Defaults to `0` when neither `offsetTop` nor `offsetBottom` is set |
| `offsetBottom` | `number` | — | Distance in px from the bottom of the container at which to pin the element. `offsetTop` takes priority if both are set |
| `target` | `() => HTMLElement \| Window` | `window` | Returns the scrollable container to observe. Defaults to `window` |
| `onChange` | `(affixed: boolean) => void` | — | Called when the affixed state changes |
| `children` | `ReactNode` | — | Content to affix |
| `className` | `string` | — | CSS class on the root placeholder |
| `style` | `CSSProperties` | — | Inline style on the root placeholder |
| `classNames` | `AffixClassNames` | — | Semantic class names per slot |
| `styles` | `AffixStyles` | — | Semantic inline styles per slot |

#### Types

```ts
type AffixSemanticSlot = 'root' | 'affix'
type AffixClassNames   = SemanticClassNames<AffixSemanticSlot>
type AffixStyles       = SemanticStyles<AffixSemanticSlot>
```

#### Behaviour

- **Two divs:** `root` is a normal-flow placeholder that holds the reserved height when affixed; `affix` is the inner element that switches to `position: fixed`.
- **Affixed styles:** `position: fixed; top | bottom: <computed>; left: <measured>; width: <measured>; z-index: 10`.
- **Scroll listeners:** passive listener on the target container + `window` resize. When `target` is a custom element, an additional passive `window` scroll listener keeps the affixed element tracking the container as it moves within the page.
- **onChange:** fires with `true` on the first tick that triggers pinning, and `false` on the first tick that releases it.

#### Examples

**1. Stick to top of window**
```tsx
<Affix>
  <Button>Fixed at top</Button>
</Affix>
```

**2. Offset from top**
```tsx
<Affix offsetTop={64}>
  <nav>Site navigation</nav>
</Affix>
```

**3. Stick to bottom**
```tsx
<Affix offsetBottom={24}>
  <div>Footer actions</div>
</Affix>
```

**4. onChange callback**
```tsx
<Affix offsetTop={0} onChange={(affixed) => console.log('affixed:', affixed)}>
  <Button>Track me</Button>
</Affix>
```

**5. Custom scroll container**
```tsx
const containerRef = useRef<HTMLDivElement>(null)

<div ref={containerRef} style={{ height: 400, overflowY: 'auto' }}>
  <Affix offsetTop={8} target={() => containerRef.current!}>
    <Button>Sticky inside scroll area</Button>
  </Affix>
  <div style={{ height: 1200 }}>Long content…</div>
</div>
```

**6. Sticky toolbar**
```tsx
<Affix offsetTop={0}>
  <div style={{ background: tokens.colorBg, padding: '0.5rem 1rem', borderBottom: `1px solid ${tokens.colorBorder}` }}>
    <Button>Save</Button>
    <Button variant="ghost">Cancel</Button>
  </div>
</Affix>
```

**7. Semantic styles**
```tsx
<Affix
  offsetTop={0}
  styles={{
    affix: { boxShadow: '0 2px 8px rgba(0,0,0,0.15)', background: tokens.colorBg },
  }}
>
  <nav>Navigation</nav>
</Affix>
```

</details>

---

<details>
<summary><strong>Alert</strong> - Feedback banner with type, icon, close, auto-dismiss, and error boundary</summary>

### Alert

`Alert` is a feedback component that displays contextual messages to the user. It supports four severity types (`success`, `info`, `warning`, `error`) with automatic color theming (light/dark aware via `color-mix`), an optional icon, a close button with slide-out animation, a custom action slot, and a full-width `banner` mode. The compound `Alert.ErrorBoundary` wraps children and renders an error alert when a React error is caught.

```tsx
import { Alert } from '@juanitte/inoui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'success' \| 'info' \| 'warning' \| 'error'` | `'info'` (or `'warning'` in banner mode) | Severity level — controls background, border, and icon color |
| `title` | `ReactNode` | — | Main message text (bold when `description` is present) |
| `description` | `ReactNode` | — | Secondary description below the title |
| `showIcon` | `boolean` | `false` (or `true` in banner mode) | Show the type icon |
| `icon` | `ReactNode` | — | Custom icon replacing the default type icon |
| `closable` | `boolean \| AlertClosable` | `false` | Show close button; pass an object for `closeIcon`, `onClose`, and `afterClose` callbacks |
| `action` | `ReactNode` | — | Extra content (e.g. a button) placed on the right side |
| `banner` | `boolean` | `false` | Full-width banner mode: no border-radius, bottom border only, `showIcon` and `type='warning'` by default |
| `className` | `string` | — | CSS class on the root element |
| `style` | `CSSProperties` | — | Inline style on the root element |
| `classNames` | `AlertClassNames` | — | Semantic class names per slot |
| `styles` | `AlertStyles` | — | Semantic inline styles per slot |

#### AlertClosable

| Field | Type | Description |
|-------|------|-------------|
| `closeIcon` | `ReactNode` | Custom close icon |
| `onClose` | `(e: React.MouseEvent) => void` | Called when the close button is clicked |
| `afterClose` | `() => void` | Called after the close animation completes |

#### Alert.ErrorBoundary

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Content to wrap |
| `title` | `ReactNode` | `'Something went wrong'` | Error alert title |
| `description` | `ReactNode` | `error.message` | Error alert description |

#### Types

```ts
type AlertType = 'success' | 'info' | 'warning' | 'error'

type AlertSemanticSlot = 'root' | 'icon' | 'content' | 'message' | 'description' | 'action' | 'closeBtn'
type AlertClassNames   = SemanticClassNames<AlertSemanticSlot>
type AlertStyles       = SemanticStyles<AlertSemanticSlot>
```

#### Close animation

When the alert is dismissed via the close button, the component:
1. Fades out the alert card (opacity → 0, 250 ms ease).
2. Collapses the wrapper height to 0 using `grid-template-rows: 0fr` (300 ms ease).
3. After the collapse transition ends, calls `afterClose` and unmounts.

#### Examples

**1. Basic types**
```tsx
<Alert type="success" title="Operation completed successfully" />
<Alert type="info"    title="A new version is available" />
<Alert type="warning" title="Disk space running low" />
<Alert type="error"   title="Failed to save changes" />
```

**2. With description**
```tsx
<Alert
  type="success"
  title="File uploaded"
  description="document.pdf has been uploaded and is being processed. You will receive a notification once it's ready."
  showIcon
/>
```

**3. Show icon**
```tsx
<Alert type="info" title="Tip: press Ctrl+K for quick search" showIcon />
```

**4. Custom icon**
```tsx
<Alert type="info" title="Scheduled maintenance tonight" icon={<span>🔧</span>} showIcon />
```

**5. Closable**
```tsx
<Alert
  type="warning"
  title="Your session will expire in 5 minutes"
  closable
  showIcon
/>
```

**6. Closable with callbacks**
```tsx
<Alert
  type="error"
  title="Connection lost"
  closable={{
    onClose: () => console.log('Alert closed'),
    afterClose: () => console.log('Close animation finished'),
  }}
  showIcon
/>
```

**7. Custom close icon**
```tsx
<Alert
  type="info"
  title="Notification"
  closable={{ closeIcon: <span>✕</span> }}
/>
```

**8. Action slot**
```tsx
<Alert
  type="warning"
  title="Unsaved changes"
  description="You have unsaved changes that will be lost."
  showIcon
  action={<button onClick={() => save()}>Save now</button>}
  closable
/>
```

**9. Banner mode**
```tsx
// Full-width banner — defaults to type="warning" and showIcon=true
<Alert banner title="The site will be under maintenance from 2:00 AM to 4:00 AM." />
```

**10. Banner with custom type**
```tsx
<Alert banner type="error" title="Service outage detected. Our team has been notified." />
```

**11. Title only (no description)**
```tsx
<Alert type="info" title="Press Enter to confirm" showIcon />
```

**12. Description only (no title)**
```tsx
<Alert type="warning" description="Some features may not work as expected in this browser." showIcon />
```

**13. Error boundary**
```tsx
import { Alert } from '@juanitte/inoui'

function RiskyWidget() {
  // This might throw during render
  return <div>{JSON.parse('invalid')}</div>
}

<Alert.ErrorBoundary title="Widget crashed" description="Please refresh the page.">
  <RiskyWidget />
</Alert.ErrorBoundary>
```

**14. Semantic styles**
```tsx
<Alert
  type="success"
  title="Payment received"
  description="Your invoice has been updated."
  showIcon
  styles={{
    root: { borderRadius: 12 },
    message: { fontSize: '1rem' },
    description: { fontStyle: 'italic' },
  }}
/>
```

**15. Multiple stacked alerts**
```tsx
import { useState } from 'react'
import { Alert, Button } from '@juanitte/inoui'

function Notifications() {
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'info' as const, title: 'Welcome back!' },
    { id: 2, type: 'warning' as const, title: 'Your trial expires tomorrow' },
    { id: 3, type: 'success' as const, title: 'Profile updated' },
  ])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {alerts.map((a) => (
        <Alert
          key={a.id}
          type={a.type}
          title={a.title}
          showIcon
          closable={{
            afterClose: () => setAlerts(prev => prev.filter(x => x.id !== a.id)),
          }}
        />
      ))}
    </div>
  )
}
```

</details>

---

<details>
<summary><strong>AutoComplete</strong> - Input with auto-suggestion dropdown</summary>

### AutoComplete

An input component with auto-complete suggestions. Supports filtering, grouped options, keyboard navigation, backfill, controlled/uncontrolled state, multiple variants, validation status, clear button, and auto-flip dropdown positioning.

#### Import

```tsx
import { AutoComplete } from '@juanitte/inoui'
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
<summary><strong>Avatar</strong> - User profile representation</summary>

### Avatar

`Avatar` displays a user's profile picture, icon, or initials. It supports images, custom icons, text fallbacks, and badge indicators. Includes `Avatar.Group` for displaying overlapping avatar lists.

**Import:**
```tsx
import { Avatar } from '@juanitte/inoui';
```

#### Avatar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | `undefined` | Image source URL |
| `srcSet` | `string` | `undefined` | Responsive image sources |
| `alt` | `string` | `undefined` | Alternative text for image |
| `icon` | `ReactNode` | `<UserIcon />` | Custom icon (shown when no image) |
| `shape` | `'circle' \| 'square'` | `'circle'` | Avatar shape |
| `size` | `'small' \| 'default' \| 'large' \| number \| AvatarResponsiveSize` | `'default'` | Avatar size |
| `gap` | `number` | `4` | Gap between text and container edge (for auto-scaling) |
| `count` | `number` | `undefined` | Badge count (shows as "99+" if > 99) |
| `dot` | `boolean` | `false` | Show dot indicator |
| `draggable` | `boolean \| 'true' \| 'false'` | `true` | Whether image is draggable |
| `crossOrigin` | `'' \| 'anonymous' \| 'use-credentials'` | `undefined` | CORS setting for image |
| `onError` | `() => boolean` | `undefined` | Callback when image fails to load (return false to prevent fallback) |
| `children` | `ReactNode` | `undefined` | Text content (usually initials) |
| `className` | `string` | `undefined` | Root element class name |
| `style` | `CSSProperties` | `undefined` | Root element inline styles |
| `classNames` | `SemanticClassNames<AvatarSemanticSlot>` | `undefined` | Semantic class names |
| `styles` | `SemanticStyles<AvatarSemanticSlot>` | `undefined` | Semantic inline styles |

#### Avatar.Group Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `max` | `{ count?: number; style?: CSSProperties }` | `undefined` | Maximum avatars to show (rest shown as "+N") |
| `size` | `AvatarSize` | `'default'` | Size applied to all child avatars |
| `shape` | `'circle' \| 'square'` | `'circle'` | Shape applied to all child avatars |
| `children` | `ReactNode` | `undefined` | Avatar components |
| `className` | `string` | `undefined` | Container class name |
| `style` | `CSSProperties` | `undefined` | Container inline styles |

#### AvatarResponsiveSize Type

`AvatarResponsiveSize` is an alias for `ResponsiveValue<number>` from the shared [Utils](#utils) breakpoint system:

```typescript
// Equivalent to:
type AvatarResponsiveSize = Partial<Record<Breakpoint, number>>
// where Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
```

See [Breakpoint Utilities](#breakpoint-utilities) for the full type definitions and breakpoint values.

#### Size Configuration

| Size | Dimension |
|------|-----------|
| `small` | 24px (1.5rem) |
| `default` | 32px (2rem) |
| `large` | 40px (2.5rem) |
| Custom number | Specified pixels |
| Responsive object | Size based on viewport breakpoint |

#### Semantic DOM Slots

| Slot | Description |
|------|-------------|
| `root` | The root container element |
| `image` | The image element (when src is provided) |
| `icon` | The icon container (when icon is provided) |
| `text` | The text container (when children text is provided) |

#### Examples

**Basic usage with image:**
```tsx
import { Avatar } from '@juanitte/inoui';

<Avatar src="https://i.pravatar.cc/150?img=1" alt="User" />
```

**With initials:**
```tsx
<Avatar>JD</Avatar>
```

**With custom icon:**
```tsx
<Avatar icon={<UserIcon />} />
```

**Different shapes:**
```tsx
<Avatar src="user.jpg" shape="circle" />
<Avatar src="user.jpg" shape="square" />
```

**Different sizes:**
```tsx
<Avatar src="user.jpg" size="small" />
<Avatar src="user.jpg" size="default" />
<Avatar src="user.jpg" size="large" />
<Avatar src="user.jpg" size={64} />
```

**Responsive size:**
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

**With badge count:**
```tsx
<Avatar src="user.jpg" count={5} />
<Avatar src="user.jpg" count={99} />
<Avatar src="user.jpg" count={100} /> {/* Shows "99+" */}
```

**With dot indicator:**
```tsx
<Avatar src="user.jpg" dot />
```

**Error handling:**
```tsx
<Avatar
  src="invalid-url.jpg"
  onError={() => {
    console.log('Image failed to load');
    return true; // Allow fallback to icon/text
  }}
>
  FB
</Avatar>
```

**Avatar Group:**
```tsx
<Avatar.Group>
  <Avatar src="https://i.pravatar.cc/150?img=1" />
  <Avatar src="https://i.pravatar.cc/150?img=2" />
  <Avatar src="https://i.pravatar.cc/150?img=3" />
  <Avatar src="https://i.pravatar.cc/150?img=4" />
</Avatar.Group>
```

**Group with max count:**
```tsx
<Avatar.Group max={{ count: 3 }}>
  <Avatar src="https://i.pravatar.cc/150?img=1" />
  <Avatar src="https://i.pravatar.cc/150?img=2" />
  <Avatar src="https://i.pravatar.cc/150?img=3" />
  <Avatar src="https://i.pravatar.cc/150?img=4" />
  <Avatar src="https://i.pravatar.cc/150?img=5" />
</Avatar.Group>
{/* Shows first 3 avatars + "+2" */}
```

**Group with custom size and shape:**
```tsx
<Avatar.Group size="large" shape="square">
  <Avatar src="user1.jpg" />
  <Avatar src="user2.jpg" />
  <Avatar>AB</Avatar>
  <Avatar icon={<UserIcon />} />
</Avatar.Group>
```

**Custom styling for overflow avatar:**
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
<summary><strong>Anchor</strong> - Navigation links that track scroll position</summary>

### Anchor

A navigation component that renders a list of anchor links and highlights the currently active one based on scroll position. Supports vertical and horizontal layouts with nested links.

#### Import

```tsx
import { Anchor } from '@juanitte/inoui'
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
<summary><strong>App</strong> - Root provider that wires Modal and PopAlert APIs into context</summary>

### App

`App` is a thin root-level provider that internally calls `useModal()` and `usePopAlert()`, mounts their `contextHolder` nodes, and exposes both APIs through React context. Any descendant component can call `App.useApp()` to access `modal` and `notification` without managing hooks or `contextHolder` placement itself.

```tsx
import { App } from '@juanitte/inoui'
```

#### Setup

```tsx
// main.tsx (or your app entry point)
import { App } from '@juanitte/inoui'

createRoot(document.getElementById('root')!).render(
  <App>
    <MyApp />
  </App>
)
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `notification` | `PopAlertHookConfig` | — | Configuration forwarded to the internal `usePopAlert()` call (placement, size, duration, maxCount, offset) |
| `children` | `ReactNode` | — | Application content |
| `className` | `string` | — | CSS class on the root `<div>` |
| `style` | `CSSProperties` | — | Inline style on the root `<div>` |

#### App.useApp()

```ts
const { modal, notification } = App.useApp()
```

Returns the `AppContextValue` from the nearest `<App>` ancestor. Throws if called outside an `<App>`.

| Field | Type | Description |
|-------|------|-------------|
| `modal` | `ModalHookApi` | Programmatic modal API — same as the `modal` returned by `useModal()` |
| `notification` | `PopAlertApi` | Toast notification API — same as the `api` returned by `usePopAlert()` |

See [Modal](#modal) → `useModal hook` and [PopAlert](#popalert) → `PopAlertApi` for the full method reference.

#### Context value types

```ts
interface AppContextValue {
  modal:        ModalHookApi  // confirm, info, success, warning, error, destroyAll
  notification: PopAlertApi   // open, success, error, info, warning, loading, destroy
}
```

#### Examples

**1. Basic setup**
```tsx
import { App } from '@juanitte/inoui'

createRoot(document.getElementById('root')!).render(
  <App>
    <MyApp />
  </App>
)
```

**2. With notification defaults**
```tsx
<App notification={{ placement: 'topRight', duration: 4, maxCount: 5 }}>
  <MyApp />
</App>
```

**3. Using App.useApp() in a child component**
```tsx
import { App, Button } from '@juanitte/inoui'

function DeleteButton({ id }: { id: number }) {
  const { modal, notification } = App.useApp()

  const handleClick = () => {
    modal.confirm({
      title: 'Delete this item?',
      content: 'This action cannot be undone.',
      onOk: async () => {
        await deleteItem(id)
        notification.success('Item deleted.')
      },
    })
  }

  return <Button variant="danger" onClick={handleClick}>Delete</Button>
}
```

**4. Notifications from anywhere in the tree**
```tsx
function SaveButton() {
  const { notification } = App.useApp()

  return (
    <Button onClick={async () => {
      await save()
      notification.success('Saved!')
    }}>
      Save
    </Button>
  )
}
```

**5. Programmatic confirm dialog**
```tsx
function LogoutButton() {
  const { modal } = App.useApp()

  return (
    <Button onClick={() => modal.confirm({
      title: 'Log out?',
      onOk: logout,
    })}>
      Log out
    </Button>
  )
}
```

</details>

---

<details>
<summary><strong>Badge</strong> - Numeric indicator and status dot</summary>

### Badge

A small numerical value or status indicator for UI elements. Wraps any content with a floating count badge, dot indicator, or displays standalone status dots.

#### Import

```tsx
import { Badge } from '@juanitte/inoui'
```

#### Badge Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Content to wrap (badge floats at top-right) |
| `count` | `ReactNode` | — | Number or custom content shown in the badge |
| `overflowCount` | `number` | `99` | Max count before showing `{overflowCount}+` |
| `dot` | `boolean` | `false` | Show a dot indicator instead of a count |
| `showZero` | `boolean` | `false` | Show the badge when `count` is zero |
| `size` | `'default' \| 'small'` | `'default'` | Badge size |
| `status` | `'success' \| 'processing' \| 'default' \| 'error' \| 'warning'` | — | Status indicator (standalone or with child) |
| `text` | `ReactNode` | — | Text shown next to the status dot (standalone mode only) |
| `color` | `string` | — | Custom color (preset name or any CSS color) |
| `offset` | `[number, number]` | — | `[right, top]` offset in pixels for the badge position |
| `title` | `string` | — | Tooltip title for the badge indicator |
| `className` | `string` | — | Class for the root element |
| `style` | `CSSProperties` | — | Style for the root element |
| `classNames` | `BadgeClassNames` | — | Semantic class names |
| `styles` | `BadgeStyles` | — | Semantic styles |

#### Preset Colors

`pink` · `red` · `yellow` · `orange` · `cyan` · `green` · `blue` · `purple` · `geekblue` · `magenta` · `volcano` · `gold` · `lime`

#### Badge.Ribbon Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Content to wrap |
| `text` | `ReactNode` | — | Text displayed inside the ribbon |
| `color` | `string` | `tokens.colorPrimary` | Ribbon color (preset name or CSS color) |
| `placement` | `'start' \| 'end'` | `'end'` | Which corner the ribbon appears on |
| `className` | `string` | — | Class for the wrapper element |
| `style` | `CSSProperties` | — | Style for the wrapper element |
| `classNames` | `RibbonClassNames` | — | Semantic class names |
| `styles` | `RibbonStyles` | — | Semantic styles |

#### Semantic DOM – Badge

| Slot | Description |
|------|-------------|
| `root` | Outer wrapper element |
| `indicator` | The count badge / dot element (`<sup>`) |

#### Semantic DOM – Badge.Ribbon

| Slot | Description |
|------|-------------|
| `wrapper` | Outer wrapper element |
| `ribbon` | The ribbon strip |
| `content` | Text content inside the ribbon |
| `corner` | The folded corner triangle |

#### Examples

```tsx
// Count badge wrapping content
<Badge count={5}>
  <Avatar shape="square" />
</Badge>

// Overflow count (shows "99+")
<Badge count={120}>
  <Avatar shape="square" />
</Badge>

// Show zero
<Badge count={0} showZero>
  <Avatar shape="square" />
</Badge>

// Dot indicator
<Badge dot>
  <NotificationIcon />
</Badge>

// Small size
<Badge count={5} size="small">
  <Avatar shape="square" />
</Badge>

// Custom offset
<Badge count={5} offset={[10, 10]}>
  <Avatar shape="square" />
</Badge>

// Status dots (standalone, no children)
<Badge status="success" text="Completed" />
<Badge status="processing" text="In Progress" />
<Badge status="error" text="Failed" />
<Badge status="warning" text="Warning" />
<Badge status="default" text="Inactive" />

// Preset colors
<Badge color="blue" count={8}>
  <Avatar shape="square" />
</Badge>
<Badge color="volcano" count={3}>
  <Avatar shape="square" />
</Badge>

// Custom CSS color
<Badge color="#faad14" count={10}>
  <Avatar shape="square" />
</Badge>

// Standalone count (no children)
<Badge count={25} />

// Badge.Ribbon
<Badge.Ribbon text="Featured">
  <Card>Card content</Card>
</Badge.Ribbon>

<Badge.Ribbon text="Sale" color="red" placement="start">
  <Card>Card content</Card>
</Badge.Ribbon>
```

</details>

---

<details>
<summary><strong>Breadcrumb</strong> - Navigation breadcrumb trail</summary>

### Breadcrumb

A navigation component that displays the current location within a hierarchical structure. Supports custom separators, icons, dropdown menus, custom item rendering, and route parameters.

#### Import

```tsx
import { Breadcrumb } from '@juanitte/inoui'
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
import { Bubble, BackToTopIcon, ChatIcon, BellIcon, CloseIcon } from '@juanitte/inoui'
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

Ino-UI provides utility icons for common FAB use cases:

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
import { Button } from '@juanitte/inoui'
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
<summary><strong>Card</strong> - Versatile content container</summary>

### Card

`Card` is a versatile container for grouping related information with optional header, cover image, actions, tabs, and loading states. Supports grid layouts and metadata components.

#### Import

```tsx
import { Card } from '@juanitte/inoui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | - | Card title displayed in header |
| `extra` | `ReactNode` | - | Extra content displayed in top-right corner of header |
| `cover` | `ReactNode` | - | Cover image or content displayed at the top of the card |
| `actions` | `ReactNode[]` | - | Array of action elements displayed at the bottom (evenly distributed) |
| `loading` | `boolean` | `false` | Shows loading skeleton instead of children |
| `hoverable` | `boolean` | `false` | Enables hover effect with shadow and lift animation |
| `size` | `CardSize` | `'default'` | Card size: `'default'` (1.5rem padding) or `'small'` (0.75rem padding) |
| `variant` | `CardVariant` | `'outlined'` | Card style: `'outlined'` (with border) or `'borderless'` (no border) |
| `type` | `'inner'` | - | Nested card type with subtle background in header |
| `tabList` | `CardTabItem[]` | - | Array of tab items to display in header |
| `activeTabKey` | `string` | - | Current active tab key (controlled) |
| `defaultActiveTabKey` | `string` | - | Initial active tab key (uncontrolled) |
| `tabProps` | `Partial<TabsProps>` | - | Additional props to pass to the Tabs component |
| `onTabChange` | `(key: string) => void` | - | Callback fired when tab changes |
| `children` | `ReactNode` | - | Card content |
| `className` | `string` | - | Root element class name |
| `style` | `CSSProperties` | - | Root element inline styles |
| `classNames` | `CardClassNames` | - | Semantic class names for card slots |
| `styles` | `CardStyles` | - | Semantic inline styles for card slots |

#### CardTabItem

```tsx
interface CardTabItem {
  key: string
  label: ReactNode
  disabled?: boolean
}
```

#### Card.Meta Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `avatar` | `ReactNode` | - | Avatar element (typically an Avatar component) |
| `title` | `ReactNode` | - | Meta title |
| `description` | `ReactNode` | - | Meta description |
| `className` | `string` | - | Root element class name |
| `style` | `CSSProperties` | - | Root element inline styles |

#### Card.Grid Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `hoverable` | `boolean` | `true` | Enables hover effect with shadow |
| `children` | `ReactNode` | - | Grid cell content |
| `className` | `string` | - | Root element class name |
| `style` | `CSSProperties` | - | Root element inline styles |

#### Size Config

```tsx
type CardSize = 'default' | 'small'

// Padding values:
// 'default': 1.5rem (24px)
// 'small': 0.75rem (12px)
```

#### Semantic DOM

The Card component uses semantic class names and styles for customization:

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

#### Examples

**Basic card:**

```tsx
<Card title="Card Title">
  <p>Card content goes here</p>
</Card>
```

**Card with cover image:**

```tsx
<Card
  cover={
    <img
      alt="example"
      src="https://picsum.photos/400/200"
      style={{ width: '100%', display: 'block' }}
    />
  }
  title="Photo Card"
>
  <p>Card with a cover image displayed at the top</p>
</Card>
```

**Card with actions:**

```tsx
<Card
  title="Interactive Card"
  actions={[
    <HeartIcon size={18} />,
    <EditIcon size={18} />,
    <ShareIcon size={18} />
  ]}
>
  <p>Card with action buttons at the bottom</p>
</Card>
```

**Card with extra content:**

```tsx
<Card
  title="Settings"
  extra={<a href="#">More</a>}
>
  <p>Card with extra content in the top-right corner</p>
</Card>
```

**Loading state:**

```tsx
<Card title="Loading Card" loading>
  <p>This content is hidden while loading</p>
</Card>
```

**Hoverable card:**

```tsx
<Card title="Hover Me" hoverable>
  <p>This card has a hover effect with shadow and lift animation</p>
</Card>
```

**Small size card:**

```tsx
<Card title="Small Card" size="small">
  <p>Compact card with reduced padding</p>
</Card>
```

**Borderless card:**

```tsx
<Card title="Borderless" variant="borderless">
  <p>Card without a border</p>
</Card>
```

**Inner card (nested):**

```tsx
<Card title="Outer Card">
  <Card title="Inner Card" type="inner">
    <p>Nested card with subtle header background</p>
  </Card>
</Card>
```

**Card with tabs:**

```tsx
<Card
  title="Tabbed Card"
  tabList={[
    { key: 'tab1', label: 'Tab 1' },
    { key: 'tab2', label: 'Tab 2' },
    { key: 'tab3', label: 'Tab 3', disabled: true }
  ]}
  defaultActiveTabKey="tab1"
  onTabChange={(key) => console.log('Active tab:', key)}
>
  <p>Content for the selected tab</p>
</Card>
```

**Card.Meta with avatar:**

```tsx
import { Card, Avatar } from '@juanitte/inoui'

<Card>
  <Card.Meta
    avatar={<Avatar src="https://i.pravatar.cc/40" />}
    title="Card Title"
    description="This is the description"
  />
</Card>
```

**Card.Grid layout:**

```tsx
<Card title="Grid Card">
  <Card.Grid>Content 1</Card.Grid>
  <Card.Grid>Content 2</Card.Grid>
  <Card.Grid>Content 3</Card.Grid>
  <Card.Grid>Content 4</Card.Grid>
  <Card.Grid>Content 5</Card.Grid>
  <Card.Grid>Content 6</Card.Grid>
</Card>
```

**Controlled tabs:**

```tsx
const [activeTab, setActiveTab] = useState('photos')

<Card
  title="Gallery"
  tabList={[
    { key: 'photos', label: 'Photos' },
    { key: 'videos', label: 'Videos' }
  ]}
  activeTabKey={activeTab}
  onTabChange={setActiveTab}
>
  {activeTab === 'photos' ? <PhotoGrid /> : <VideoGrid />}
</Card>
```

**Complex card with all features:**

```tsx
<Card
  cover={<img src="https://picsum.photos/400/200" alt="cover" />}
  title="Premium Product"
  extra={<Tag color="gold">Featured</Tag>}
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
    description="Product designer"
  />
  <Divider />
  <p>This is a premium product with all available features.</p>
</Card>
```

</details>

---

<details>
<summary><strong>Calendar</strong> - Date selection calendar</summary>

### Calendar

`Calendar` displays a full calendar for date selection with month and year views. Supports fullscreen and card modes, custom cell rendering, week numbers, date range restrictions, and date adapters for different date libraries.

**Import:**
```tsx
import { Calendar } from '@juanitte/inoui';
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `TDate` | `undefined` | Controlled selected date |
| `defaultValue` | `TDate` | `today()` | Initial selected date (uncontrolled mode) |
| `fullscreen` | `boolean` | `true` | Fullscreen mode (100% width) vs card mode (18.75rem) |
| `mode` | `'month' \| 'year'` | `undefined` | Controlled calendar mode |
| `defaultMode` | `'month' \| 'year'` | `'month'` | Initial calendar mode (uncontrolled) |
| `showWeek` | `boolean` | `false` | Show week numbers |
| `headerRender` | `(config: CalendarHeaderConfig) => ReactNode` | `undefined` | Custom header renderer |
| `cellRender` | `(current: TDate, info: CalendarCellRenderInfo) => ReactNode` | `undefined` | Custom cell content (keeps default structure) |
| `fullCellRender` | `(current: TDate, info: CalendarCellRenderInfo) => ReactNode` | `undefined` | Replace entire cell |
| `validRange` | `[TDate, TDate]` | `undefined` | Valid date range [start, end] |
| `disabledDate` | `(date: TDate) => boolean` | `undefined` | Function to disable specific dates |
| `onChange` | `(date: TDate) => void` | `undefined` | Callback when date is selected |
| `onPanelChange` | `(date: TDate, mode: CalendarMode) => void` | `undefined` | Callback when panel changes (mode toggle) |
| `onSelect` | `(date: TDate, info: CalendarSelectInfo) => void` | `undefined` | Callback on selection with source info |
| `adapter` | `DateAdapter<TDate>` | `NativeDateAdapter` | Custom date adapter |
| `className` | `string` | `undefined` | Root element class name |
| `style` | `CSSProperties` | `undefined` | Root element inline styles |
| `classNames` | `SemanticClassNames<CalendarSemanticSlot>` | `undefined` | Semantic class names |
| `styles` | `SemanticStyles<CalendarSemanticSlot>` | `undefined` | Semantic inline styles |

#### CalendarHeaderConfig Interface

```typescript
interface CalendarHeaderConfig<TDate = any> {
  value: TDate;                        // Current selected date
  type: CalendarMode;                  // Current mode ('month' | 'year')
  onChange: (date: TDate) => void;     // Change selected date
  onTypeChange: (type: CalendarMode) => void; // Change mode
}
```

#### CalendarCellRenderInfo Interface

```typescript
interface CalendarCellRenderInfo {
  originNode: ReactNode;  // Default cell content
  today: boolean;         // Whether this cell is today
  type: 'date' | 'month'; // Type of cell
}
```

#### CalendarSelectInfo Interface

```typescript
interface CalendarSelectInfo {
  source: 'year' | 'month' | 'date' | 'customize'; // Selection source
}
```

#### Calendar Modes

- **`month`**: Displays a grid of days (6 weeks × 7 days)
- **`year`**: Displays a grid of months (3 × 4 grid)

#### Display Modes

- **Fullscreen** (`fullscreen={true}`): 100% width, larger cells, suitable for main content area
- **Card** (`fullscreen={false}`): 18.75rem (300px) width, compact, suitable for dropdowns/panels

#### Semantic DOM Slots

| Slot | Description |
|------|-------------|
| `root` | The root container element |
| `header` | Header section with year/month selectors and mode toggle |
| `body` | Body section containing the calendar grid |
| `cell` | Individual date or month cell |

#### Date Adapters

Calendar uses date adapters for compatibility with different date libraries:
- **NativeDateAdapter** (default): Uses native JavaScript Date
- **DayJSAdapter**: For Day.js library
- **DateFnsAdapter**: For date-fns library
- **LuxonAdapter**: For Luxon library
- **MomentAdapter**: For Moment.js library

Use `CalendarAdapterProvider` to set adapter for all calendars in a subtree.

#### Examples

**Basic usage:**
```tsx
import { Calendar } from '@juanitte/inoui';

<Calendar
  onChange={(date) => console.log('Selected:', date)}
/>
```

**Card mode (compact):**
```tsx
<Calendar
  fullscreen={false}
  onChange={(date) => console.log('Selected:', date)}
/>
```

**Controlled value:**
```tsx
const [selectedDate, setSelectedDate] = useState(new Date());

<Calendar
  value={selectedDate}
  onChange={setSelectedDate}
/>
```

**Year view mode:**
```tsx
<Calendar
  defaultMode="year"
  onChange={(date) => console.log('Month selected:', date)}
/>
```

**With week numbers:**
```tsx
<Calendar
  showWeek
  onChange={(date) => console.log('Selected:', date)}
/>
```

**With valid date range:**
```tsx
const today = new Date();
const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

<Calendar
  validRange={[today, nextMonth]}
  onChange={(date) => console.log('Selected:', date)}
/>
```

**With disabled dates (disable weekends):**
```tsx
<Calendar
  disabledDate={(date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  }}
/>
```

**Custom cell rendering (add badges):**
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

**Full cell rendering (custom content):**
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

**Custom header:**
```tsx
<Calendar
  headerRender={({ value, type, onChange, onTypeChange }) => (
    <div style={{ padding: '1rem', borderBottom: '1px solid #d9d9d9' }}>
      <h3>Custom Calendar Header</h3>
      <div>
        Current: {value.toLocaleDateString()}
      </div>
      <button onClick={() => {
        const prev = new Date(value);
        prev.setMonth(prev.getMonth() - 1);
        onChange(prev);
      }}>
        Previous Month
      </button>
      <button onClick={() => onTypeChange(type === 'month' ? 'year' : 'month')}>
        Toggle: {type}
      </button>
    </div>
  )}
/>
```

**With Day.js adapter:**
```tsx
import { Calendar, CalendarAdapterProvider } from '@juanitte/inoui';
import { DayJSAdapter } from '@juanitte/inoui/adapters';
import dayjs from 'dayjs';

const adapter = new DayJSAdapter();

<CalendarAdapterProvider adapter={adapter}>
  <Calendar
    value={dayjs()}
    onChange={(date) => console.log('Selected:', date.format('YYYY-MM-DD'))}
  />
</CalendarAdapterProvider>
```

**Panel change tracking:**
```tsx
<Calendar
  onPanelChange={(date, mode) => {
    console.log('Panel changed to:', mode, 'at', date);
  }}
  onSelect={(date, info) => {
    console.log('Selected via:', info.source, 'date:', date);
  }}
/>
```

</details>

---

<details>
<summary><strong>Carousel</strong> - Image and content slider</summary>

### Carousel

`Carousel` is a slideshow component for cycling through images or content with autoplay, arrows, dots navigation, fade/scroll effects, infinite loop, drag support, and progress indicators.

#### Import

```tsx
import { Carousel } from '@juanitte/inoui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `autoplay` | `boolean` | `false` | Enables automatic slide transitions |
| `autoplaySpeed` | `number` | `3000` | Autoplay interval in milliseconds |
| `arrows` | `boolean` | `false` | Shows previous/next navigation arrows |
| `dots` | `boolean \| { className?: string }` | `true` | Shows dot indicators (can pass className for custom styling) |
| `dotPlacement` | `CarouselDotPlacement` | `'bottom'` | Dot position: `'top'`, `'bottom'`, `'left'`, or `'right'` |
| `effect` | `CarouselEffect` | `'scrollx'` | Transition effect: `'scrollx'` (slide) or `'fade'` (crossfade) |
| `speed` | `number` | `500` | Transition duration in milliseconds |
| `easing` | `string` | `'ease'` | CSS transition timing function |
| `infinite` | `boolean` | `true` | Enables infinite loop (seamless wrap-around) |
| `draggable` | `boolean` | `false` | Enables drag-to-navigate with pointer events |
| `dragClamp` | `boolean` | `false` | Limits drag distance to ±1 slide from current |
| `dotProgress` | `boolean` | `false` | Shows animated progress bar on active dot during autoplay |
| `initialSlide` | `number` | `0` | Index of the initial slide to display |
| `waitForAnimate` | `boolean` | `false` | Prevents navigation while transition is in progress |
| `beforeChange` | `(current: number, next: number) => void` | - | Callback before slide change |
| `afterChange` | `(current: number) => void` | - | Callback after slide change completes |
| `children` | `ReactNode` | - | Slide content (each child becomes a slide) |
| `className` | `string` | - | Root element class name |
| `style` | `CSSProperties` | - | Root element inline styles |
| `classNames` | `CarouselClassNames` | - | Semantic class names for carousel slots |
| `styles` | `CarouselStyles` | - | Semantic inline styles for carousel slots |

#### CarouselRef

```tsx
interface CarouselRef {
  goTo(index: number, animate?: boolean): void  // Navigate to specific slide
  next(): void                                  // Go to next slide
  prev(): void                                  // Go to previous slide
}

// Usage
const carouselRef = useRef<CarouselRef>(null)
carouselRef.current?.goTo(2)
```

#### Semantic DOM

The Carousel component uses semantic class names and styles for customization:

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

#### Examples

**Basic carousel:**

```tsx
<Carousel>
  <div style={{ height: '200px', backgroundColor: '#1890ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    Slide 1
  </div>
  <div style={{ height: '200px', backgroundColor: '#52c41a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    Slide 2
  </div>
  <div style={{ height: '200px', backgroundColor: '#fa8c16', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    Slide 3
  </div>
</Carousel>
```

**Autoplay with progress dots:**

```tsx
<Carousel autoplay autoplaySpeed={4000} dotProgress>
  <img src="https://picsum.photos/800/400?random=1" alt="1" style={{ width: '100%', display: 'block' }} />
  <img src="https://picsum.photos/800/400?random=2" alt="2" style={{ width: '100%', display: 'block' }} />
  <img src="https://picsum.photos/800/400?random=3" alt="3" style={{ width: '100%', display: 'block' }} />
</Carousel>
```

**Fade effect:**

```tsx
<Carousel effect="fade" autoplay>
  <div style={{ height: '300px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} />
  <div style={{ height: '300px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }} />
  <div style={{ height: '300px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }} />
</Carousel>
```

**Vertical carousel:**

```tsx
<Carousel dotPlacement="right" style={{ height: '400px' }}>
  <div style={{ height: '400px', backgroundColor: '#1890ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    Vertical Slide 1
  </div>
  <div style={{ height: '400px', backgroundColor: '#52c41a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    Vertical Slide 2
  </div>
  <div style={{ height: '400px', backgroundColor: '#fa8c16', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    Vertical Slide 3
  </div>
</Carousel>
```

**With arrows:**

```tsx
<Carousel arrows autoplay>
  <img src="https://picsum.photos/800/400?random=4" alt="4" style={{ width: '100%', display: 'block' }} />
  <img src="https://picsum.photos/800/400?random=5" alt="5" style={{ width: '100%', display: 'block' }} />
  <img src="https://picsum.photos/800/400?random=6" alt="6" style={{ width: '100%', display: 'block' }} />
</Carousel>
```

**Without dots:**

```tsx
<Carousel dots={false} arrows autoplay>
  <div style={{ height: '200px', backgroundColor: '#722ed1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    No Dots 1
  </div>
  <div style={{ height: '200px', backgroundColor: '#eb2f96', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    No Dots 2
  </div>
</Carousel>
```

**Draggable carousel:**

```tsx
<Carousel draggable dragClamp>
  <div style={{ height: '250px', backgroundColor: '#13c2c2', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    Drag me! Slide 1
  </div>
  <div style={{ height: '250px', backgroundColor: '#1890ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    Drag me! Slide 2
  </div>
  <div style={{ height: '250px', backgroundColor: '#722ed1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    Drag me! Slide 3
  </div>
</Carousel>
```

**Non-infinite carousel:**

```tsx
<Carousel infinite={false} arrows>
  <div style={{ height: '200px', backgroundColor: '#f5222d', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    First Slide
  </div>
  <div style={{ height: '200px', backgroundColor: '#fa541c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    Middle Slide
  </div>
  <div style={{ height: '200px', backgroundColor: '#fa8c16', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    Last Slide
  </div>
</Carousel>
```

**Controlled navigation with ref:**

```tsx
const carouselRef = useRef<CarouselRef>(null)

<div>
  <Carousel ref={carouselRef}>
    <div style={{ height: '200px', backgroundColor: '#1890ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Slide 1</div>
    <div style={{ height: '200px', backgroundColor: '#52c41a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Slide 2</div>
    <div style={{ height: '200px', backgroundColor: '#fa8c16', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Slide 3</div>
    <div style={{ height: '200px', backgroundColor: '#eb2f96', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Slide 4</div>
  </Carousel>

  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
    <Button onClick={() => carouselRef.current?.prev()}>Previous</Button>
    <Button onClick={() => carouselRef.current?.next()}>Next</Button>
    <Button onClick={() => carouselRef.current?.goTo(2)}>Go to Slide 3</Button>
  </div>
</div>
```

**Before/after change callbacks:**

```tsx
<Carousel
  autoplay
  beforeChange={(current, next) => console.log(`Changing from ${current} to ${next}`)}
  afterChange={(current) => console.log(`Now on slide ${current}`)}
>
  <div style={{ height: '200px', backgroundColor: '#1890ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Slide 1</div>
  <div style={{ height: '200px', backgroundColor: '#52c41a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Slide 2</div>
  <div style={{ height: '200px', backgroundColor: '#fa8c16', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Slide 3</div>
</Carousel>
```

**Custom dot placement (top):**

```tsx
<Carousel dotPlacement="top" autoplay>
  <img src="https://picsum.photos/800/400?random=7" alt="7" style={{ width: '100%', display: 'block' }} />
  <img src="https://picsum.photos/800/400?random=8" alt="8" style={{ width: '100%', display: 'block' }} />
  <img src="https://picsum.photos/800/400?random=9" alt="9" style={{ width: '100%', display: 'block' }} />
</Carousel>
```

**Wait for animate (prevents rapid clicking):**

```tsx
<Carousel arrows waitForAnimate>
  <div style={{ height: '200px', backgroundColor: '#1890ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Slide 1</div>
  <div style={{ height: '200px', backgroundColor: '#52c41a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Slide 2</div>
  <div style={{ height: '200px', backgroundColor: '#fa8c16', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Slide 3</div>
</Carousel>
```

**Initial slide:**

```tsx
<Carousel initialSlide={2} arrows>
  <div style={{ height: '200px', backgroundColor: '#1890ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Slide 1</div>
  <div style={{ height: '200px', backgroundColor: '#52c41a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Slide 2</div>
  <div style={{ height: '200px', backgroundColor: '#fa8c16', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Slide 3 (starts here)</div>
  <div style={{ height: '200px', backgroundColor: '#eb2f96', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Slide 4</div>
</Carousel>
```

</details>

---

<details>
<summary><strong>Checkbox</strong> - Selection control with group and indeterminate support</summary>

### Checkbox

A checkbox component for toggling boolean values with support for indeterminate state, groups, controlled/uncontrolled modes, and semantic styling. Includes `Checkbox.Group` for managing multiple selections.

#### Import

```tsx
import { Checkbox } from '@juanitte/inoui'
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
import { ColorPicker } from '@juanitte/inoui'
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
<summary><strong>Collapse</strong> - Expandable accordion panels</summary>

### Collapse

`Collapse` displays collapsible panels with smooth animations for hiding and showing content. Supports accordion mode, custom expand icons, different sizes, ghost style, and flexible collapsible behavior.

#### Import

```tsx
import { Collapse } from '@juanitte/inoui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `CollapseItem[]` | - | Array of panel items (alternative to using `Collapse.Panel` children) |
| `accordion` | `boolean` | `false` | Accordion mode - only one panel can be open at a time |
| `activeKey` | `string \| string[]` | - | Currently active panel key(s) - controlled mode |
| `defaultActiveKey` | `string \| string[]` | - | Initial active panel key(s) - uncontrolled mode |
| `bordered` | `boolean` | `true` | Shows border around the collapse |
| `ghost` | `boolean` | `false` | Makes the collapse borderless with transparent background |
| `size` | `CollapseSize` | `'middle'` | Panel size: `'small'`, `'middle'`, or `'large'` |
| `collapsible` | `CollapseCollapsible` | - | Global collapsible behavior: `'header'` (full header clickable), `'icon'` (only icon clickable), or `'disabled'` |
| `expandIcon` | `(props: { isActive: boolean }) => ReactNode` | - | Custom expand icon render function |
| `expandIconPlacement` | `'start' \| 'end'` | `'start'` | Position of the expand icon |
| `destroyOnHidden` | `boolean` | `false` | Unmount content when panel is closed |
| `onChange` | `(key: string \| string[]) => void` | - | Callback when active panel(s) change |
| `children` | `ReactNode` | - | Collapse.Panel components |
| `className` | `string` | - | Root element class name |
| `style` | `CSSProperties` | - | Root element inline styles |
| `classNames` | `CollapseClassNames` | - | Semantic class names for collapse slots |
| `styles` | `CollapseStyles` | - | Semantic inline styles for collapse slots |

#### CollapseItem

```tsx
interface CollapseItem {
  key: string                      // Unique panel identifier
  label?: ReactNode                // Panel header content
  children?: ReactNode             // Panel content
  extra?: ReactNode                // Extra content in header (right side)
  showArrow?: boolean              // Show expand arrow icon
  collapsible?: CollapseCollapsible // Panel-specific collapsible behavior
  forceRender?: boolean            // Render content even when collapsed
  className?: string               // Panel wrapper class name
  style?: CSSProperties            // Panel wrapper inline styles
}
```

#### Collapse.Panel Props

```tsx
interface CollapsePanelProps {
  panelKey: string                 // Unique panel identifier (required)
  header?: ReactNode               // Panel header content
  children?: ReactNode             // Panel content
  extra?: ReactNode                // Extra content in header (right side)
  showArrow?: boolean              // Show expand arrow icon
  collapsible?: CollapseCollapsible // Panel-specific collapsible behavior
  forceRender?: boolean            // Render content even when collapsed
  className?: string               // Panel wrapper class name
  style?: CSSProperties            // Panel wrapper inline styles
}
```

#### Size Config

```tsx
type CollapseSize = 'large' | 'middle' | 'small'

// Size configurations:
// small:  headerPadding: '0.375rem 0.75rem',  contentPadding: '0.75rem',  fontSize: '0.8125rem'
// middle: headerPadding: '0.75rem 1rem',      contentPadding: '1rem',     fontSize: '0.875rem'
// large:  headerPadding: '1rem 1.25rem',      contentPadding: '1.25rem',  fontSize: '1rem'
```

#### Semantic DOM

The Collapse component uses semantic class names and styles for customization:

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

#### Examples

**Basic collapse:**

```tsx
<Collapse
  items={[
    {
      key: '1',
      label: 'Panel 1',
      children: <p>Content of panel 1</p>,
    },
    {
      key: '2',
      label: 'Panel 2',
      children: <p>Content of panel 2</p>,
    },
    {
      key: '3',
      label: 'Panel 3',
      children: <p>Content of panel 3</p>,
    },
  ]}
  defaultActiveKey={['1']}
/>
```

**Accordion mode (only one panel open):**

```tsx
<Collapse
  accordion
  items={[
    {
      key: '1',
      label: 'Accordion Panel 1',
      children: <p>Only one panel can be open at a time</p>,
    },
    {
      key: '2',
      label: 'Accordion Panel 2',
      children: <p>Opening this will close the other</p>,
    },
    {
      key: '3',
      label: 'Accordion Panel 3',
      children: <p>Mutually exclusive panels</p>,
    },
  ]}
  defaultActiveKey="1"
/>
```

**Ghost style (no border, transparent background):**

```tsx
<Collapse
  ghost
  items={[
    {
      key: '1',
      label: 'Ghost Panel 1',
      children: <p>Borderless and transparent</p>,
    },
    {
      key: '2',
      label: 'Ghost Panel 2',
      children: <p>Minimal styling</p>,
    },
  ]}
/>
```

**Without border:**

```tsx
<Collapse
  bordered={false}
  items={[
    {
      key: '1',
      label: 'Borderless Panel',
      children: <p>No outer border</p>,
    },
  ]}
/>
```

**Custom size (small):**

```tsx
<Collapse
  size="small"
  items={[
    {
      key: '1',
      label: 'Small Panel',
      children: <p>Compact size with reduced padding</p>,
    },
  ]}
/>
```

**Custom size (large):**

```tsx
<Collapse
  size="large"
  items={[
    {
      key: '1',
      label: 'Large Panel',
      children: <p>Spacious size with increased padding</p>,
    },
  ]}
/>
```

**Icon-only collapsible:**

```tsx
<Collapse
  collapsible="icon"
  items={[
    {
      key: '1',
      label: 'Click the arrow only',
      children: <p>The header text is not clickable, only the icon</p>,
    },
  ]}
/>
```

**Disabled panel:**

```tsx
<Collapse
  items={[
    {
      key: '1',
      label: 'Active Panel',
      children: <p>This panel can be toggled</p>,
    },
    {
      key: '2',
      label: 'Disabled Panel',
      children: <p>This panel cannot be toggled</p>,
      collapsible: 'disabled',
    },
  ]}
/>
```

**Custom expand icon:**

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
      label: 'Custom Icon Panel',
      children: <p>Using a custom expand icon</p>,
    },
  ]}
/>
```

**Expand icon at end:**

```tsx
<Collapse
  expandIconPlacement="end"
  items={[
    {
      key: '1',
      label: 'Icon on Right',
      children: <p>The expand icon is positioned at the end</p>,
    },
  ]}
/>
```

**With extra content:**

```tsx
<Collapse
  items={[
    {
      key: '1',
      label: 'Panel with Extra',
      extra: <a href="#" onClick={(e) => e.stopPropagation()}>Edit</a>,
      children: <p>The header has extra content on the right</p>,
    },
  ]}
/>
```

**Without arrow:**

```tsx
<Collapse
  items={[
    {
      key: '1',
      label: 'No Arrow Panel',
      showArrow: false,
      children: <p>This panel has no expand arrow</p>,
    },
  ]}
/>
```

**Controlled collapse:**

```tsx
const [activeKeys, setActiveKeys] = useState<string[]>(['1'])

<div>
  <Button onClick={() => setActiveKeys(['1', '2'])}>Open All</Button>
  <Button onClick={() => setActiveKeys([])}>Close All</Button>

  <Collapse
    activeKey={activeKeys}
    onChange={(keys) => setActiveKeys(Array.isArray(keys) ? keys : [keys])}
    items={[
      {
        key: '1',
        label: 'Panel 1',
        children: <p>Controlled panel 1</p>,
      },
      {
        key: '2',
        label: 'Panel 2',
        children: <p>Controlled panel 2</p>,
      },
    ]}
  />
</div>
```

**Destroy on hidden (unmount content when closed):**

```tsx
<Collapse
  destroyOnHidden
  items={[
    {
      key: '1',
      label: 'Destroys Content',
      children: <p>This content is unmounted when the panel closes</p>,
    },
  ]}
/>
```

**Force render (keep content mounted):**

```tsx
<Collapse
  items={[
    {
      key: '1',
      label: 'Always Rendered',
      forceRender: true,
      children: <p>This content stays mounted even when collapsed</p>,
    },
  ]}
/>
```

**Using Collapse.Panel syntax:**

```tsx
<Collapse defaultActiveKey={['1']}>
  <Collapse.Panel panelKey="1" header="Panel 1">
    <p>Content using Collapse.Panel syntax</p>
  </Collapse.Panel>
  <Collapse.Panel panelKey="2" header="Panel 2" extra={<a href="#">More</a>}>
    <p>Another panel with extra content</p>
  </Collapse.Panel>
  <Collapse.Panel panelKey="3" header="Panel 3" showArrow={false}>
    <p>Panel without arrow icon</p>
  </Collapse.Panel>
</Collapse>
```

</details>

---

<details>
<summary><strong>ConfigProvider</strong> - Global component size, disabled state, and locale</summary>

### ConfigProvider

`ConfigProvider` is a context provider that configures global defaults for all descendant Ino-UI components. It can be nested — each level inherits from its parent and only overrides the keys it supplies. `ConfigProvider.useConfig()` reads the nearest provider's value and never throws; outside any provider it returns the `en_US` defaults.

```tsx
import { ConfigProvider } from '@juanitte/inoui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `componentSize` | `ConfigSize` | — | Sets the default `size` for all size-aware components (`'small'`, `'middle'`, `'large'`) |
| `componentDisabled` | `boolean` | — | Globally disables all interactive components |
| `locale` | `Locale` | `en_US` | Localization strings for built-in component text |
| `children` | `ReactNode` | — | **Required.** Subtree to configure |

#### ConfigProvider.useConfig()

```ts
const { componentSize, componentDisabled, locale } = ConfigProvider.useConfig()
```

Returns the resolved `ConfigContextValue` from the nearest `<ConfigProvider>`. Outside any provider returns the `en_US` defaults. Never throws.

#### Types

```ts
type ConfigSize = 'small' | 'middle' | 'large'

interface ConfigContextValue {
  componentSize?:    ConfigSize
  componentDisabled?: boolean
  locale:            Locale
}

interface Locale {
  locale:      string                      // BCP 47 code, e.g. 'en_US'
  DatePicker?: Partial<DatePickerLocale>
  Pagination?: Partial<PaginationLocale>
  Form?:       Partial<FormLocale>
}

interface DatePickerLocale {
  placeholder:               string  // 'Select date'
  yearPlaceholder:           string  // 'Select year'
  quarterPlaceholder:        string  // 'Select quarter'
  monthPlaceholder:          string  // 'Select month'
  weekPlaceholder:           string  // 'Select week'
  dateTimePlaceholder:       string  // 'Select date and time'
  rangeStartPlaceholder:     string  // 'Start date'
  rangeEndPlaceholder:       string  // 'End date'
  rangeStartTimePlaceholder: string  // 'Start date time'
  rangeEndTimePlaceholder:   string  // 'End date time'
  today:                     string  // 'Today'
  now:                       string  // 'Now'
  ok:                        string  // 'OK'
}

interface PaginationLocale {
  itemsPerPage: string  // '/ page'  — suffix after page size, e.g. "10 / page"
  jumpTo:       string  // 'Go to'   — prefix for quick-jumper input
}

interface FormLocale {
  defaultRequiredMessage: string  // 'This field is required'
  defaultPatternMessage:  string  // 'Does not match the required pattern'
}
```

#### Built-in locales

```ts
import { en_US, es_ES } from '@juanitte/inoui'
```

| Export | locale | Coverage |
|--------|--------|----------|
| `en_US` | `'en_US'` | DatePicker, Pagination, Form |
| `es_ES` | `'es_ES'` | DatePicker, Pagination, Form |

#### Affected components

| Setting | Affected components |
|---------|---------------------|
| `componentSize` | All components that accept a `size` prop (Button, Input, Select, DatePicker, Pagination, Rate, Slider, …) |
| `componentDisabled` | All interactive components (Button, Input, Select, Checkbox, Radio, Switch, DatePicker, …) |
| `locale.DatePicker` | [DatePicker](#datepicker) — placeholders and button labels |
| `locale.Pagination` | [Pagination](#pagination) — page-size suffix and jump-to prefix |
| `locale.Form` | [Form](#form) — default required and pattern validation messages |

#### Examples

**1. Global locale**
```tsx
import { ConfigProvider, es_ES } from '@juanitte/inoui'

<ConfigProvider locale={es_ES}>
  <App />
</ConfigProvider>
```

**2. Global size**
```tsx
<ConfigProvider componentSize="small">
  <App />
</ConfigProvider>
```

**3. Global disabled state**
```tsx
<ConfigProvider componentDisabled>
  <form>
    <Input />
    <Select options={[]} />
    <Button>Submit</Button>
  </form>
</ConfigProvider>
```

**4. Nested providers — override in a sub-section**
```tsx
<ConfigProvider locale={en_US} componentSize="middle">
  <App>
    {/* Only this sub-tree uses small size */}
    <ConfigProvider componentSize="small">
      <CompactToolbar />
    </ConfigProvider>
  </App>
</ConfigProvider>
```

**5. Custom locale (partial override)**
```tsx
import { en_US } from '@juanitte/inoui'

const myLocale = {
  ...en_US,
  Pagination: { itemsPerPage: 'rows', jumpTo: 'Jump to' },
}

<ConfigProvider locale={myLocale}>
  <App />
</ConfigProvider>
```

**6. Reading config in a custom component**
```tsx
import { ConfigProvider } from '@juanitte/inoui'

function MyField() {
  const { componentSize, componentDisabled } = ConfigProvider.useConfig()
  return (
    <input
      disabled={componentDisabled}
      style={{ fontSize: componentSize === 'small' ? 12 : 14 }}
    />
  )
}
```

</details>

---

<details>
<summary><strong>DataDisplay</strong> - Structured data presentation table</summary>

### DataDisplay

`DataDisplay` displays structured data in a table format with label-value pairs. Supports horizontal and vertical layouts, responsive columns, custom spanning, bordered style, and flexible sizing.

#### Import

```tsx
import { DataDisplay } from '@juanitte/inoui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `DataDisplayItem[]` | - | Array of data items (alternative to using `DataDisplay.Item` children) |
| `title` | `ReactNode` | - | Display title shown in header |
| `extra` | `ReactNode` | - | Extra content in header (right side) |
| `bordered` | `boolean` | `false` | Show borders and background on labels |
| `column` | `number \| Responsive` | `3` | Number of columns per row (supports responsive breakpoints) |
| `layout` | `DataDisplayLayout` | `'horizontal'` | Layout mode: `'horizontal'` (label-value pairs in same row) or `'vertical'` (labels in one row, values in another) |
| `colon` | `boolean` | `true` | Show colon (`:`) after labels |
| `size` | `DataDisplaySize` | `'middle'` | Display size: `'small'`, `'middle'`, or `'large'` |
| `labelStyle` | `CSSProperties` | - | Global style for all labels |
| `contentStyle` | `CSSProperties` | - | Global style for all content cells |
| `children` | `ReactNode` | - | DataDisplay.Item components |
| `className` | `string` | - | Root element class name |
| `style` | `CSSProperties` | - | Root element inline styles |
| `classNames` | `DataDisplayClassNames` | - | Semantic class names for data display slots |
| `styles` | `DataDisplayStyles` | - | Semantic inline styles for data display slots |

#### DataDisplayItem

```tsx
interface DataDisplayItem {
  key: string                                          // Unique item identifier
  label?: ReactNode                                    // Label text
  children?: ReactNode                                 // Content/value
  span?: number | Partial<Record<Breakpoint, number>>  // Column span (supports responsive)
  labelStyle?: CSSProperties                           // Item-specific label style
  contentStyle?: CSSProperties                         // Item-specific content style
}
```

#### DataDisplay.Item Props

```tsx
interface DataDisplayItemProps {
  itemKey: string                                      // Unique item identifier (required)
  label?: ReactNode                                    // Label text
  children?: ReactNode                                 // Content/value
  span?: number | Partial<Record<Breakpoint, number>>  // Column span (supports responsive)
  labelStyle?: CSSProperties                           // Item-specific label style
  contentStyle?: CSSProperties                         // Item-specific content style
}
```

#### Responsive Breakpoints

`DataDisplay` uses the shared `Breakpoint` type from [Utils](#utils). See [Breakpoint Utilities](#breakpoint-utilities) for the full type definitions.

```tsx
// Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
// xs: 0px, sm: 576px, md: 768px, lg: 992px, xl: 1200px, xxl: 1600px

// Usage example:
column={{ xs: 1, sm: 2, md: 3, lg: 4 }}
span={{ xs: 1, md: 2 }}
```

#### Size Config

```tsx
type DataDisplaySize = 'large' | 'middle' | 'small'

// Size configurations:
// small:  headerPadding: '0.5rem 0',  cellPadding: '0.375rem 0.75rem', fontSize: '0.8125rem'
// middle: headerPadding: '0.75rem 0', cellPadding: '0.75rem 1rem',     fontSize: '0.875rem'
// large:  headerPadding: '1rem 0',    cellPadding: '1rem 1.5rem',      fontSize: '1rem'
```

#### Semantic DOM

The DataDisplay component uses semantic class names and styles for customization:

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

#### Examples

**Basic data display:**

```tsx
<DataDisplay
  items={[
    { key: '1', label: 'Name', children: 'John Doe' },
    { key: '2', label: 'Email', children: 'john@example.com' },
    { key: '3', label: 'Phone', children: '+1 234 567 890' },
    { key: '4', label: 'Address', children: '123 Main St, City, Country' },
    { key: '5', label: 'Status', children: 'Active' },
    { key: '6', label: 'Role', children: 'Administrator' },
  ]}
/>
```

**With title and extra:**

```tsx
<DataDisplay
  title="User Information"
  extra={<a href="#">Edit</a>}
  items={[
    { key: '1', label: 'Username', children: 'johndoe' },
    { key: '2', label: 'Email', children: 'john@example.com' },
    { key: '3', label: 'Joined', children: '2024-01-15' },
  ]}
/>
```

**Bordered style:**

```tsx
<DataDisplay
  bordered
  items={[
    { key: '1', label: 'Product', children: 'Laptop' },
    { key: '2', label: 'Price', children: '$999' },
    { key: '3', label: 'Stock', children: '15 units' },
    { key: '4', label: 'Category', children: 'Electronics' },
  ]}
/>
```

**Vertical layout:**

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

**Custom column count:**

```tsx
<DataDisplay
  column={2}
  items={[
    { key: '1', label: 'First Name', children: 'John' },
    { key: '2', label: 'Last Name', children: 'Doe' },
    { key: '3', label: 'Age', children: '30' },
    { key: '4', label: 'City', children: 'New York' },
  ]}
/>
```

**Responsive columns:**

```tsx
<DataDisplay
  column={{ xs: 1, sm: 2, md: 3, lg: 4 }}
  items={[
    { key: '1', label: 'Field 1', children: 'Value 1' },
    { key: '2', label: 'Field 2', children: 'Value 2' },
    { key: '3', label: 'Field 3', children: 'Value 3' },
    { key: '4', label: 'Field 4', children: 'Value 4' },
    { key: '5', label: 'Field 5', children: 'Value 5' },
    { key: '6', label: 'Field 6', children: 'Value 6' },
  ]}
/>
```

**Item with custom span:**

```tsx
<DataDisplay
  column={3}
  bordered
  items={[
    { key: '1', label: 'Name', children: 'John Doe' },
    { key: '2', label: 'Email', children: 'john@example.com' },
    { key: '3', label: 'Phone', children: '+1 234 567 890' },
    { key: '4', label: 'Full Address', children: '123 Main Street, Apartment 4B, New York, NY 10001', span: 3 },
    { key: '5', label: 'City', children: 'New York' },
    { key: '6', label: 'Country', children: 'USA' },
  ]}
/>
```

**Responsive span:**

```tsx
<DataDisplay
  column={{ xs: 1, md: 3 }}
  bordered
  items={[
    { key: '1', label: 'Title', children: 'Product Description' },
    { key: '2', label: 'SKU', children: 'ABC-123' },
    { key: '3', label: 'Price', children: '$99.99' },
    { key: '4', label: 'Description', children: 'This is a detailed product description that spans multiple columns on larger screens.', span: { xs: 1, md: 3 } },
  ]}
/>
```

**Without colon:**

```tsx
<DataDisplay
  colon={false}
  items={[
    { key: '1', label: 'Temperature', children: '72°F' },
    { key: '2', label: 'Humidity', children: '45%' },
    { key: '3', label: 'Pressure', children: '1013 hPa' },
  ]}
/>
```

**Small size:**

```tsx
<DataDisplay
  size="small"
  bordered
  items={[
    { key: '1', label: 'Compact', children: 'Small size' },
    { key: '2', label: 'Padding', children: 'Reduced' },
    { key: '3', label: 'Font', children: 'Smaller' },
  ]}
/>
```

**Large size:**

```tsx
<DataDisplay
  size="large"
  bordered
  items={[
    { key: '1', label: 'Spacious', children: 'Large size' },
    { key: '2', label: 'Padding', children: 'Increased' },
    { key: '3', label: 'Font', children: 'Larger' },
  ]}
/>
```

**Custom label/content styles:**

```tsx
<DataDisplay
  labelStyle={{ fontWeight: 'bold', color: '#1890ff' }}
  contentStyle={{ fontStyle: 'italic' }}
  items={[
    { key: '1', label: 'Custom', children: 'Styled globally' },
    { key: '2', label: 'Override', children: 'Item-specific style', contentStyle: { fontStyle: 'normal', color: '#52c41a' } },
  ]}
/>
```

**Using DataDisplay.Item syntax:**

```tsx
<DataDisplay title="Product Details" bordered column={2}>
  <DataDisplay.Item itemKey="1" label="Product Name">
    Wireless Mouse
  </DataDisplay.Item>
  <DataDisplay.Item itemKey="2" label="Price">
    $29.99
  </DataDisplay.Item>
  <DataDisplay.Item itemKey="3" label="Manufacturer">
    TechCorp
  </DataDisplay.Item>
  <DataDisplay.Item itemKey="4" label="Warranty">
    2 years
  </DataDisplay.Item>
  <DataDisplay.Item itemKey="5" label="Description" span={2}>
    High-precision wireless mouse with ergonomic design and long battery life.
  </DataDisplay.Item>
</DataDisplay>
```

</details>

---

<details>
<summary><strong>DatePicker</strong> - Date selection with calendar panel, range, and time support</summary>

### DatePicker

A comprehensive date picker with calendar panel, multiple picker modes (date, week, month, quarter, year), time selection, range picking with dual panels, mask input, multiple date selection, presets, disabled dates/times, custom cell rendering, pluggable date adapter system, and auto-flip positioning. Includes `DatePicker.RangePicker` for selecting date ranges.

> **Locale:** placeholder texts and button labels (`Today`, `Now`, `OK`) come from [`ConfigProvider`](#configprovider) `locale.DatePicker`. Wrap your app in `<ConfigProvider locale={es_ES}>` to localise them.

#### Import

```tsx
import { DatePicker } from '@juanitte/inoui'
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
import { DayjsAdapter } from '@juanitte/inoui/adapters/dayjs'
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
import { Divider } from '@juanitte/inoui'
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
<summary><strong>Drawer</strong> - Slide-in panel overlay with header, footer, and loading state</summary>

### Drawer

`Drawer` is a slide-in panel that overlays the page from any edge. It renders into a portal on `document.body`, locks body scroll while open, and slides in/out with a 300 ms CSS transition. The panel supports a header with title and extra actions, a scrollable body with an optional loading skeleton, a footer slot, ESC key dismissal, mask click to close, two preset sizes, and a `destroyOnClose` option to unmount content when closed.

```tsx
import { Drawer } from '@juanitte/inoui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Whether the drawer is visible |
| `onClose` | `(e: MouseEvent \| KeyboardEvent) => void` | — | Called when the user closes the drawer (close button, mask click, or ESC) |
| `afterOpenChange` | `(open: boolean) => void` | — | Called after the open/close animation completes |
| `placement` | `DrawerPlacement` | `'right'` | Which edge the panel slides from |
| `size` | `DrawerSize` | `'default'` | Preset width/height: `'default'` = 378 px, `'large'` = 736 px |
| `width` | `number \| string` | — | Custom width (overrides `size`, for left/right placement) |
| `height` | `number \| string` | — | Custom height (overrides `size`, for top/bottom placement) |
| `title` | `ReactNode` | — | Header title |
| `extra` | `ReactNode` | — | Extra content in the header (e.g. action buttons), rendered after the title |
| `footer` | `ReactNode` | — | Footer content below the body |
| `closable` | `boolean` | `true` | Show the close button in the header |
| `closeIcon` | `ReactNode` | — | Custom close icon |
| `mask` | `boolean` | `true` | Show the semi-transparent backdrop |
| `maskClosable` | `boolean` | `true` | Close the drawer when clicking the mask |
| `keyboard` | `boolean` | `true` | Close the drawer on ESC key press |
| `zIndex` | `number` | `1000` | z-index for the overlay |
| `destroyOnClose` | `boolean` | `false` | Unmount body content when closed |
| `loading` | `boolean` | `false` | Show an animated skeleton placeholder instead of children |
| `children` | `ReactNode` | — | Body content |
| `className` | `string` | — | CSS class on the panel element |
| `style` | `CSSProperties` | — | Inline style on the panel element |
| `classNames` | `DrawerClassNames` | — | Semantic class names per slot |
| `styles` | `DrawerStyles` | — | Semantic inline styles per slot |

#### Types

```ts
type DrawerPlacement = 'right' | 'left' | 'top' | 'bottom'
type DrawerSize      = 'default' | 'large'

// Semantic slots
type DrawerSemanticSlot = 'root' | 'mask' | 'header' | 'body' | 'footer' | 'closeBtn'
type DrawerClassNames   = SemanticClassNames<DrawerSemanticSlot>
type DrawerStyles       = SemanticStyles<DrawerSemanticSlot>
```

#### Animation

- **Open:** The portal mounts, then a double-`requestAnimationFrame` triggers the slide-in (`transform: translate(0, 0)`) and mask fade-in (`opacity: 1`), both 300 ms ease.
- **Close:** The panel slides out to its edge and the mask fades to transparent. After the transition ends, `afterOpenChange(false)` fires and the portal unmounts (or hides if `destroyOnClose` is `false`).
- Body `overflow: hidden` is applied while mounted to prevent background scrolling.

#### Examples

**1. Basic right drawer**
```tsx
import { useState } from 'react'
import { Drawer, Button } from '@juanitte/inoui'

function App() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer
        title="Basic Drawer"
        open={open}
        onClose={() => setOpen(false)}
      >
        <p>Some content inside the drawer.</p>
      </Drawer>
    </>
  )
}
```

**2. Left placement**
```tsx
<Drawer title="Left Drawer" placement="left" open={open} onClose={close}>
  <p>Slides in from the left edge.</p>
</Drawer>
```

**3. Top placement**
```tsx
<Drawer title="Top Drawer" placement="top" open={open} onClose={close}>
  <p>Slides down from the top.</p>
</Drawer>
```

**4. Bottom placement**
```tsx
<Drawer title="Bottom Drawer" placement="bottom" open={open} onClose={close}>
  <p>Slides up from the bottom.</p>
</Drawer>
```

**5. Large size**
```tsx
<Drawer title="Large Drawer" size="large" open={open} onClose={close}>
  <p>736 px wide panel.</p>
</Drawer>
```

**6. Custom width**
```tsx
<Drawer title="Custom Width" width={500} open={open} onClose={close}>
  <p>Exactly 500 px wide.</p>
</Drawer>
```

**7. Custom height (top/bottom)**
```tsx
<Drawer title="Short Top Panel" placement="top" height="30vh" open={open} onClose={close}>
  <p>30% of the viewport height.</p>
</Drawer>
```

**8. With extra header actions**
```tsx
<Drawer
  title="Settings"
  extra={<Button size="small" type="primary" onClick={save}>Save</Button>}
  open={open}
  onClose={close}
>
  <p>Form content here.</p>
</Drawer>
```

**9. With footer**
```tsx
<Drawer
  title="Edit Profile"
  footer={
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
      <Button onClick={close}>Cancel</Button>
      <Button type="primary" onClick={save}>Save</Button>
    </div>
  }
  open={open}
  onClose={close}
>
  <p>Form fields here.</p>
</Drawer>
```

**10. No close button**
```tsx
<Drawer title="No Close Button" closable={false} open={open} onClose={close}>
  <p>User must click the mask or press ESC to close.</p>
</Drawer>
```

**11. Custom close icon**
```tsx
<Drawer title="Custom Icon" closeIcon={<span>✕</span>} open={open} onClose={close}>
  <p>Custom × icon in the header.</p>
</Drawer>
```

**12. No mask**
```tsx
<Drawer title="No Mask" mask={false} open={open} onClose={close}>
  <p>The background is still interactive.</p>
</Drawer>
```

**13. Mask not closable**
```tsx
<Drawer title="Mask not closable" maskClosable={false} open={open} onClose={close}>
  <p>Clicking the backdrop does not close the drawer.</p>
</Drawer>
```

**14. Disable ESC key**
```tsx
<Drawer title="No ESC" keyboard={false} open={open} onClose={close}>
  <p>Pressing Escape does nothing.</p>
</Drawer>
```

**15. Destroy on close**
```tsx
<Drawer title="Destroy on close" destroyOnClose open={open} onClose={close}>
  <p>Content is unmounted when the drawer closes, resetting internal state.</p>
</Drawer>
```

**16. Loading state**
```tsx
const [loading, setLoading] = useState(true)

<Drawer title="User Details" loading={loading} open={open} onClose={close}>
  <p>This content is hidden while loading.</p>
</Drawer>
```

**17. afterOpenChange callback**
```tsx
<Drawer
  title="Animated"
  open={open}
  onClose={close}
  afterOpenChange={(isOpen) => {
    console.log(isOpen ? 'Fully opened' : 'Fully closed')
  }}
>
  <p>Check the console.</p>
</Drawer>
```

**18. Semantic styles**
```tsx
<Drawer
  title="Styled Drawer"
  open={open}
  onClose={close}
  styles={{
    root: { backgroundColor: '#fafafa' },
    header: { borderBottom: '2px solid #1677ff' },
    body: { padding: '2rem' },
    footer: { borderTop: '2px solid #1677ff' },
    mask: { backgroundColor: 'rgba(0,0,0,0.7)' },
  }}
  footer={<span>Custom styled footer</span>}
>
  <p>Custom styled content.</p>
</Drawer>
```

**19. Full-featured example**
```tsx
import { useState } from 'react'
import { Drawer, Button } from '@juanitte/inoui'

function SettingsPanel() {
  const [open, setOpen]       = useState(false)
  const [loading, setLoading] = useState(false)

  const handleOpen = () => {
    setOpen(true)
    setLoading(true)
    setTimeout(() => setLoading(false), 1200)
  }

  return (
    <>
      <Button onClick={handleOpen}>Open Settings</Button>
      <Drawer
        title="Application Settings"
        placement="right"
        size="large"
        open={open}
        onClose={() => setOpen(false)}
        loading={loading}
        extra={<Button size="small" onClick={() => setOpen(false)}>Reset</Button>}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={() => { /* save */ setOpen(false) }}>
              Apply Changes
            </Button>
          </div>
        }
        afterOpenChange={(isOpen) => {
          if (!isOpen) console.log('Drawer fully closed')
        }}
      >
        <h3>General</h3>
        <p>Language, timezone, notifications…</p>
        <h3>Appearance</h3>
        <p>Theme, font size, density…</p>
        <h3>Privacy</h3>
        <p>Data sharing, cookies…</p>
      </Drawer>
    </>
  )
}
```

</details>

---

<details>
<summary><strong>Dropdown</strong> - Contextual overlay menus</summary>

### Dropdown

A contextual menu component triggered by hover, click, or right-click. Supports nested sub-menus, item groups, dividers, danger items, custom overlay rendering, controlled state, arrow indicator, and a compound `Dropdown.Button` variant.

#### Import

```tsx
import { Dropdown } from '@juanitte/inoui'
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
<summary><strong>Empty</strong> - Empty state placeholder with optional tumbleweed animation</summary>

### Empty

`Empty` displays a placeholder for empty content areas with an illustration, description text, and optional action buttons. Features a unique animated tumbleweed effect for adding personality to empty states.

#### Import

```tsx
import { Empty } from '@juanitte/inoui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `image` | `ReactNode` | Built-in illustration | Custom image (string URL or React node). Defaults to built-in simple illustration |
| `imageStyle` | `CSSProperties` | - | Style for the image container |
| `description` | `ReactNode \| false` | `'No data'` | Description text below image. Set to `false` to hide |
| `tumbleweed` | `boolean` | `false` | Show animated tumbleweed rolling across the empty state |
| `iconColor` | `string` | `tokens.colorBorder` | Stroke color for the built-in icon SVG (only applies when using default image) |
| `tumbleweedColor` | `string` | `tokens.colorTextSubtle` | Fill color for the tumbleweed SVG |
| `windColor` | `string` | `tokens.colorTextSubtle` | Stroke color for the wind lines |
| `shadowColor` | `string` | `tokens.colorTextSubtle` | Background color for the tumbleweed shadow |
| `children` | `ReactNode` | - | Footer content (e.g. action buttons) |
| `className` | `string` | - | Root element class name |
| `style` | `CSSProperties` | - | Root element inline styles |
| `classNames` | `EmptyClassNames` | - | Semantic class names for empty slots |
| `styles` | `EmptyStyles` | - | Semantic inline styles for empty slots |

#### Static Properties

```tsx
Empty.PRESENTED_IMAGE_SIMPLE // Built-in simple illustration component
```

#### Semantic DOM

The Empty component uses semantic class names and styles for customization:

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

#### Examples

**Basic empty state:**

```tsx
<Empty />
```

**Custom description:**

```tsx
<Empty description="No items found" />
```

**Without description:**

```tsx
<Empty description={false} />
```

**Custom image (URL):**

```tsx
<Empty
  image="https://via.placeholder.com/150"
  description="No results"
/>
```

**Custom image (ReactNode):**

```tsx
<Empty
  image={
    <div style={{ fontSize: '4rem', opacity: 0.3 }}>
      📦
    </div>
  }
  description="Empty box"
/>
```

**With action button:**

```tsx
<Empty description="No tasks yet">
  <Button type="primary">Create Task</Button>
</Empty>
```

**Tumbleweed animation:**

```tsx
<Empty
  tumbleweed
  description="Nothing to see here..."
/>
```

**Custom icon color:**

```tsx
<Empty
  iconColor="#1890ff"
  description="Custom colored icon"
/>
```

**Custom tumbleweed colors:**

```tsx
<Empty
  tumbleweed
  tumbleweedColor="#8B4513"
  windColor="#A0522D"
  shadowColor="#D2691E"
  description="Custom tumbleweed theme"
/>
```

**Using built-in image constant:**

```tsx
<Empty
  image={Empty.PRESENTED_IMAGE_SIMPLE}
  description="Explicitly using default image"
/>
```

**Multiple action buttons:**

```tsx
<Empty description="Your cart is empty">
  <div style={{ display: 'flex', gap: '0.5rem' }}>
    <Button>Browse Products</Button>
    <Button type="primary">View Wishlist</Button>
  </div>
</Empty>
```

**Custom styling:**

```tsx
<Empty
  description="Styled empty state"
  style={{ padding: '4rem' }}
  styles={{
    description: { color: '#1890ff', fontSize: '1rem' },
    footer: { marginTop: '2rem' }
  }}
>
  <Button>Get Started</Button>
</Empty>
```

</details>

---

<details>
<summary><strong>Form</strong> - Data collection with validation, layouts, and dynamic fields</summary>

### Form

A comprehensive form component with field-level validation (required, type, min/max, pattern, custom async validators), three layouts (horizontal, vertical, inline), `FormInstance` API for programmatic control, `Form.Item` for automatic value binding and error display, `Form.List` for dynamic field arrays, `Form.ErrorList`, `Form.Provider` for cross-form communication, and hooks (`useForm`, `useWatch`, `useFormInstance`).

> **Locale:** default validation messages ("This field is required", "Does not match the required pattern") come from [`ConfigProvider`](#configprovider) `locale.Form`. Override them globally with a custom locale or per-field via the `rules` prop.

#### Import

```tsx
import { Form } from '@juanitte/inoui'
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
<summary><strong>Input</strong> - Text input fields with multiple variants</summary>

### Input

A comprehensive input component with support for text input, text areas, search, password, and one-time password (OTP) fields.

#### Import

```tsx
import { Input } from '@juanitte/inoui'
```

#### Input Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Controlled value |
| `defaultValue` | `string` | — | Initial uncontrolled value |
| `placeholder` | `string` | — | Placeholder text |
| `type` | `string` | `'text'` | Native input type |
| `disabled` | `boolean` | `false` | Disable input |
| `readOnly` | `boolean` | `false` | Make input read-only |
| `size` | `'small' \| 'middle' \| 'large'` | `'middle'` | Input size |
| `variant` | `'outlined' \| 'filled' \| 'borderless' \| 'underlined'` | `'outlined'` | Visual style variant |
| `status` | `'error' \| 'warning'` | — | Validation status |
| `prefix` | `ReactNode` | — | Content before input text |
| `suffix` | `ReactNode` | — | Content after input text |
| `addonBefore` | `ReactNode` | — | Content before input wrapper |
| `addonAfter` | `ReactNode` | — | Content after input wrapper |
| `allowClear` | `boolean \| { clearIcon?: ReactNode }` | `false` | Show clear button |
| `showCount` | `boolean` | `false` | Show character count |
| `count` | `CountConfig` | — | Advanced count configuration |
| `maxLength` | `number` | — | Maximum character length |
| `onChange` | `(e: ChangeEvent) => void` | — | Value change callback |
| `onPressEnter` | `(e: KeyboardEvent) => void` | — | Enter key callback |
| `onFocus` | `(e: FocusEvent) => void` | — | Focus callback |
| `onBlur` | `(e: FocusEvent) => void` | — | Blur callback |
| `classNames` | `SemanticClassNames<'root' \| 'wrapper' \| 'input' \| 'prefix' \| 'suffix' \| 'addonBefore' \| 'addonAfter' \| 'clear' \| 'count'>` | — | Semantic class names |
| `styles` | `SemanticStyles<'root' \| 'wrapper' \| 'input' \| 'prefix' \| 'suffix' \| 'addonBefore' \| 'addonAfter' \| 'clear' \| 'count'>` | — | Semantic inline styles |

#### Input.TextArea Props

Extends `Input` props with:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `autoSize` | `boolean \| { minRows?: number; maxRows?: number }` | `false` | Auto-resize based on content |
| `onResize` | `(size: { width: number; height: number }) => void` | — | Resize callback |

#### Input.Search Props

Extends `Input` props with:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enterButton` | `boolean \| ReactNode` | `false` | Show search button |
| `loading` | `boolean` | `false` | Show loading state |
| `onSearch` | `(value: string, e: Event) => void` | — | Search callback |

#### Input.Password Props

Extends `Input` props with:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visibilityToggle` | `boolean` | `true` | Show visibility toggle button |
| `iconRender` | `(visible: boolean) => ReactNode` | — | Custom visibility icons |

#### Input.OTP Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Controlled value |
| `defaultValue` | `string` | — | Initial uncontrolled value |
| `onChange` | `(value: string) => void` | — | Value change callback |
| `length` | `number` | `6` | Number of OTP digits |
| `formatter` | `(value: string) => string` | — | Format input value |
| `mask` | `boolean \| string` | `false` | Mask characters (true = '•', or custom char) |
| `disabled` | `boolean` | `false` | Disable all inputs |
| `status` | `'error' \| 'warning'` | — | Validation status |
| `size` | `'small' \| 'middle' \| 'large'` | `'middle'` | Input size |
| `variant` | `'outlined' \| 'filled' \| 'borderless' \| 'underlined'` | `'outlined'` | Visual style variant |

#### CountConfig

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `max` | `number` | — | Maximum count to display |
| `exceedFormatter` | `(count: number, max: number) => ReactNode` | — | Custom formatter when exceeding max |
| `show` | `boolean \| ((args: { value: string; count: number; maxLength?: number }) => boolean)` | — | Whether to show count |
| `strategy` | `(text: string) => number` | — | Custom count strategy |

#### InputRef

| Method | Description |
|--------|-------------|
| `focus(options?)` | Focus the input. Options: `{ preventScroll?: boolean; cursor?: 'start' \| 'end' \| 'all' }` |
| `blur()` | Remove focus from input |
| `input` | Reference to the native input/textarea element |

#### Size Configuration

| Size | Height | Font Size |
|------|--------|-----------|
| `small` | 1.5rem (24px) | 0.75rem (12px) |
| `middle` | 2rem (32px) | 0.875rem (14px) |
| `large` | 2.5rem (40px) | 1rem (16px) |

#### Variant Styles

- **outlined** - Default border style
- **filled** - Filled background with subtle border
- **borderless** - No border or background
- **underlined** - Bottom border only

#### Semantic DOM

##### Input / TextArea / Search / Password

| Slot | Description |
|------|-------------|
| `root` | Outer container element |
| `wrapper` | Input wrapper with prefix/suffix |
| `input` | Native input/textarea element |
| `prefix` | Prefix content container |
| `suffix` | Suffix content container |
| `addonBefore` | Addon before container |
| `addonAfter` | Addon after container |
| `clear` | Clear button |
| `count` | Character count display |

##### Input.OTP

| Slot | Description |
|------|-------------|
| `root` | Outer container element |
| `input` | Individual OTP input element |

#### Examples

```tsx
// Basic input
<Input placeholder="Enter text" />

// Controlled input
const [value, setValue] = useState('')
<Input value={value} onChange={(e) => setValue(e.target.value)} />

// Different sizes
<Input size="small" placeholder="Small" />
<Input size="middle" placeholder="Middle (default)" />
<Input size="large" placeholder="Large" />

// Variants
<Input variant="outlined" placeholder="Outlined (default)" />
<Input variant="filled" placeholder="Filled" />
<Input variant="borderless" placeholder="Borderless" />
<Input variant="underlined" placeholder="Underlined" />

// Status states
<Input status="error" placeholder="Error state" />
<Input status="warning" placeholder="Warning state" />

// With prefix/suffix
<Input prefix={<SearchIcon />} placeholder="Search" />
<Input suffix="@example.com" placeholder="Email" />
<Input prefix="https://" suffix=".com" placeholder="website" />

// With addons
<Input addonBefore="https://" addonAfter=".com" placeholder="website" />
<Input addonBefore={<SelectIcon />} placeholder="URL" />

// Allow clear
<Input allowClear placeholder="Can be cleared" />
<Input allowClear={{ clearIcon: <CustomIcon /> }} />

// Character count
<Input showCount maxLength={50} placeholder="Max 50 characters" />
<Input
  count={{
    max: 100,
    show: true,
    exceedFormatter: (count, max) => `${count}/${max} (exceeded!)`,
  }}
  placeholder="Advanced count"
/>

// Disabled and readonly
<Input disabled placeholder="Disabled" />
<Input readOnly value="Read only value" />

// With ref (focus management)
const inputRef = useRef<InputRef>(null)
<Input ref={inputRef} />
// Later: inputRef.current?.focus({ cursor: 'end' })

// TextArea
<Input.TextArea placeholder="Enter multiple lines" />
<Input.TextArea rows={4} placeholder="Fixed 4 rows" />
<Input.TextArea autoSize placeholder="Auto-resize" />
<Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
<Input.TextArea showCount maxLength={200} />

// Search
<Input.Search placeholder="Search" onSearch={(value) => console.log(value)} />
<Input.Search enterButton placeholder="Search with button" />
<Input.Search enterButton="Go" placeholder="Custom button text" />
<Input.Search enterButton={<SearchIcon />} />
<Input.Search loading placeholder="Loading..." />

// Password
<Input.Password placeholder="Enter password" />
<Input.Password visibilityToggle={false} placeholder="No toggle" />
<Input.Password
  iconRender={(visible) => visible ? <EyeIcon /> : <EyeOffIcon />}
  placeholder="Custom icons"
/>

// OTP
<Input.OTP length={6} onChange={(value) => console.log(value)} />
<Input.OTP length={4} mask />
<Input.OTP length={6} mask="*" />
<Input.OTP
  length={6}
  formatter={(value) => value.toUpperCase()}
  placeholder="A-Z only"
/>

// Semantic styling
<Input
  placeholder="Styled input"
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
<summary><strong>Image</strong> - Image with preview, zoom, and gallery support</summary>

### Image

`Image` displays images with loading states, error handling, fallback support, and an interactive preview overlay featuring zoom, rotation, flip, and pan controls. Includes `Image.PreviewGroup` for creating image galleries with navigation.

#### Import

```tsx
import { Image } from '@juanitte/inoui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | - | Image source URL |
| `alt` | `string` | - | Alt text for accessibility |
| `width` | `string \| number` | - | Image width (CSS value) |
| `height` | `string \| number` | - | Image height (CSS value) |
| `fallback` | `string` | - | Fallback image URL when main image fails to load |
| `placeholder` | `ReactNode \| boolean` | - | Loading placeholder. `true` = built-in shimmer effect |
| `preview` | `boolean \| PreviewConfig` | `true` | Preview configuration. `false` to disable |
| `onError` | `(e: SyntheticEvent) => void` | - | Callback when image fails to load |
| `className` | `string` | - | Root element class name |
| `style` | `CSSProperties` | - | Root element inline styles |
| `classNames` | `ImageClassNames` | - | Semantic class names for image slots |
| `styles` | `ImageStyles` | - | Semantic inline styles for image slots |

#### PreviewConfig

```tsx
interface PreviewConfig {
  open?: boolean                          // Controlled preview open state
  src?: string                            // Custom preview source (e.g., high-resolution)
  onOpenChange?: (open: boolean) => void  // Callback when preview state changes
  minScale?: number                       // Minimum zoom scale (default: 1)
  maxScale?: number                       // Maximum zoom scale (default: 50)
  scaleStep?: number                      // Zoom step multiplier (default: 0.5)
}
```

#### Image.PreviewGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `(string \| { src: string; alt?: string })[]` | - | Declarative image array (alternative to children) |
| `preview` | `boolean \| PreviewGroupConfig` | `true` | Group preview configuration. `false` to disable |
| `children` | `ReactNode` | - | Image components to include in gallery |

#### PreviewGroupConfig

```tsx
interface PreviewGroupConfig extends PreviewConfig {
  current?: number                                      // Controlled current image index
  onChange?: (current: number, prev: number) => void    // Callback when image changes
  countRender?: (current: number, total: number) => ReactNode // Custom counter renderer
}
```

#### Preview Features

The preview overlay includes:
- **Zoom**: Mouse wheel, keyboard (+/-), or toolbar buttons
- **Pan**: Drag to pan when zoomed in
- **Rotate**: 90° left/right rotation
- **Flip**: Horizontal and vertical flipping
- **Reset**: Reset all transformations
- **Navigation** (groups): Prev/next with arrows or keyboard (←/→)
- **Keyboard**: Escape to close, arrow keys for navigation

#### Semantic DOM

The Image component uses semantic class names and styles for customization:

```tsx
type ImageSemanticSlot = 'root' | 'image' | 'mask'

interface ImageClassNames {
  root?: string
  image?: string
  mask?: string   // Preview hover mask
}

interface ImageStyles {
  root?: CSSProperties
  image?: CSSProperties
  mask?: CSSProperties
}
```

#### Examples

**Basic image:**

```tsx
<Image
  src="https://via.placeholder.com/400x300"
  alt="Placeholder"
/>
```

**With dimensions:**

```tsx
<Image
  src="https://via.placeholder.com/400x300"
  alt="Fixed size"
  width={400}
  height={300}
/>
```

**Fallback image:**

```tsx
<Image
  src="https://broken-url.example/image.jpg"
  fallback="https://via.placeholder.com/400x300?text=Fallback"
  alt="With fallback"
  width={400}
  height={300}
/>
```

**Custom placeholder:**

```tsx
<Image
  src="https://via.placeholder.com/400x300"
  placeholder={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}
  width={400}
  height={300}
/>
```

**Built-in shimmer placeholder:**

```tsx
<Image
  src="https://via.placeholder.com/400x300"
  placeholder={true}
  width={400}
  height={300}
/>
```

**Disable preview:**

```tsx
<Image
  src="https://via.placeholder.com/400x300"
  preview={false}
  width={400}
  height={300}
/>
```

**Controlled preview:**

```tsx
const [open, setOpen] = useState(false)

<div>
  <Button onClick={() => setOpen(true)}>Open Preview</Button>
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

**Custom preview source (high-res):**

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

**Custom zoom settings:**

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

**Preview group with items:**

```tsx
<Image.PreviewGroup
  items={[
    "https://via.placeholder.com/800x600/FF6B6B/FFFFFF?text=Image+1",
    "https://via.placeholder.com/800x600/4ECDC4/FFFFFF?text=Image+2",
    "https://via.placeholder.com/800x600/45B7D1/FFFFFF?text=Image+3",
    { src: "https://via.placeholder.com/800x600/FFA07A/FFFFFF?text=Image+4", alt: "Fourth image" }
  ]}
/>
```

**Preview group with children:**

```tsx
<Image.PreviewGroup>
  <Image src="https://via.placeholder.com/300x200/FF6B6B" width={300} height={200} />
  <Image src="https://via.placeholder.com/300x200/4ECDC4" width={300} height={200} />
  <Image src="https://via.placeholder.com/300x200/45B7D1" width={300} height={200} />
  <Image src="https://via.placeholder.com/300x200/FFA07A" width={300} height={200} />
</Image.PreviewGroup>
```

**Controlled group navigation:**

```tsx
const [current, setCurrent] = useState(0)

<Image.PreviewGroup
  preview={{
    current,
    onChange: (curr, prev) => {
      console.log(`Changed from ${prev} to ${curr}`)
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

**Custom counter render:**

```tsx
<Image.PreviewGroup
  preview={{
    countRender: (current, total) => (
      <span style={{ fontWeight: 'bold' }}>
        {current} of {total}
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

**Mixed group with different sources:**

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
<summary><strong>InputNumber</strong> - Numeric input with step controls</summary>

### InputNumber

A numeric input component with increment/decrement controls, keyboard navigation, and advanced formatting options.

#### Import

```tsx
import { InputNumber } from '@juanitte/inoui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number \| string \| null` | — | Controlled value |
| `defaultValue` | `number \| string \| null` | — | Initial uncontrolled value |
| `onChange` | `(value: number \| string \| null) => void` | — | Value change callback |
| `onStep` | `(value: number, info: { offset: number; type: 'up' \| 'down' }) => void` | — | Step callback (on increment/decrement) |
| `onPressEnter` | `(e: KeyboardEvent) => void` | — | Enter key callback |
| `onFocus` | `(e: FocusEvent) => void` | — | Focus callback |
| `onBlur` | `(e: FocusEvent) => void` | — | Blur callback |
| `min` | `number` | `-Infinity` | Minimum value |
| `max` | `number` | `Infinity` | Maximum value |
| `step` | `number` | `1` | Step increment/decrement value |
| `precision` | `number` | — | Decimal precision (auto-inferred from step if not specified) |
| `formatter` | `(value: string \| number, info: { userTyping: boolean; input: string }) => string` | — | Custom value formatter for display |
| `parser` | `(displayValue: string) => number \| string` | — | Parser to convert display value back to numeric |
| `controls` | `boolean \| { upIcon?: ReactNode; downIcon?: ReactNode }` | `true` | Show step controls (up/down buttons) |
| `keyboard` | `boolean` | `true` | Enable keyboard navigation (arrow keys) |
| `changeOnWheel` | `boolean` | `false` | Enable mouse wheel to change value when focused |
| `changeOnBlur` | `boolean` | `true` | Commit value onChange blur (vs. onChange keystroke) |
| `stringMode` | `boolean` | `false` | Return value as string with exact precision |
| `decimalSeparator` | `string` | — | Custom decimal separator (e.g., ',') |
| `placeholder` | `string` | — | Placeholder text |
| `disabled` | `boolean` | `false` | Disable input |
| `readOnly` | `boolean` | `false` | Make input read-only |
| `id` | `string` | — | HTML id attribute |
| `autoFocus` | `boolean` | `false` | Auto-focus on mount |
| `name` | `string` | — | HTML name attribute |
| `tabIndex` | `number` | — | Tab index |
| `size` | `'small' \| 'middle' \| 'large'` | `'middle'` | Input size |
| `variant` | `'outlined' \| 'filled' \| 'borderless' \| 'underlined'` | `'outlined'` | Visual style variant |
| `status` | `'error' \| 'warning'` | — | Validation status |
| `prefix` | `ReactNode` | — | Content before input text |
| `suffix` | `ReactNode` | — | Content after input text (before controls) |
| `addonBefore` | `ReactNode` | — | Content before input wrapper |
| `addonAfter` | `ReactNode` | — | Content after input wrapper |
| `classNames` | `SemanticClassNames<'root' \| 'input' \| 'prefix' \| 'suffix' \| 'handler' \| 'handlerUp' \| 'handlerDown' \| 'addon'>` | — | Semantic class names |
| `styles` | `SemanticStyles<'root' \| 'input' \| 'prefix' \| 'suffix' \| 'handler' \| 'handlerUp' \| 'handlerDown' \| 'addon'>` | — | Semantic inline styles |

#### InputNumberRef

| Method | Description |
|--------|-------------|
| `focus(options?)` | Focus the input. Options: `{ preventScroll?: boolean; cursor?: 'start' \| 'end' \| 'all' }` |
| `blur()` | Remove focus from input |
| `input` | Reference to the native input element |
| `nativeElement` | Reference to the root element |

#### Size Configuration

| Size | Height | Font Size |
|------|--------|-----------|
| `small` | 1.5rem (24px) | 0.75rem (12px) |
| `middle` | 2rem (32px) | 0.875rem (14px) |
| `large` | 2.5rem (40px) | 1rem (16px) |

#### Variant Styles

- **outlined** - Default border style
- **filled** - Filled background with subtle border
- **borderless** - No border or background
- **underlined** - Bottom border only

#### Semantic DOM

| Slot | Description |
|------|-------------|
| `root` | Outer container element |
| `input` | Input wrapper with border/background |
| `prefix` | Prefix content container |
| `suffix` | Suffix content container |
| `handler` | Step controls wrapper |
| `handlerUp` | Increment button |
| `handlerDown` | Decrement button |
| `addon` | Addon (before/after) container |

#### Examples

```tsx
// Basic
<InputNumber placeholder="Enter number" />

// Controlled
const [value, setValue] = useState<number | null>(0)
<InputNumber value={value} onChange={setValue} />

// Min/max/step
<InputNumber min={0} max={100} step={5} defaultValue={10} />
<InputNumber min={0} max={1} step={0.1} defaultValue={0.5} />

// Precision
<InputNumber precision={2} defaultValue={3.14159} />
<InputNumber step={0.01} defaultValue={1.5} /> // Auto precision from step

// Different sizes
<InputNumber size="small" placeholder="Small" />
<InputNumber size="middle" placeholder="Middle (default)" />
<InputNumber size="large" placeholder="Large" />

// Variants
<InputNumber variant="outlined" placeholder="Outlined (default)" />
<InputNumber variant="filled" placeholder="Filled" />
<InputNumber variant="borderless" placeholder="Borderless" />
<InputNumber variant="underlined" placeholder="Underlined" />

// Status
<InputNumber status="error" placeholder="Error state" />
<InputNumber status="warning" placeholder="Warning state" />

// With prefix/suffix
<InputNumber prefix="$" placeholder="Price" />
<InputNumber suffix="kg" placeholder="Weight" />
<InputNumber prefix="$" suffix="USD" defaultValue={100} />

// With addons
<InputNumber addonBefore="Price" addonAfter="USD" />
<InputNumber addonBefore="$" addonAfter=".00" />

// No controls
<InputNumber controls={false} placeholder="No buttons" />

// Custom control icons
<InputNumber
  controls={{
    upIcon: <PlusIcon />,
    downIcon: <MinusIcon />,
  }}
/>

// Keyboard navigation
<InputNumber keyboard placeholder="Use arrow keys" />

// Mouse wheel (when focused)
<InputNumber changeOnWheel placeholder="Focus and scroll" />

// Change on blur vs on input
<InputNumber changeOnBlur={false} placeholder="Updates on keystroke" />

// String mode (for exact precision)
<InputNumber
  stringMode
  precision={10}
  onChange={(val) => console.log(typeof val)} // "string"
/>

// Custom decimal separator
<InputNumber decimalSeparator="," placeholder="European format" />

// Custom formatter/parser (e.g., currency)
<InputNumber
  formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
  defaultValue={1000000}
/>

// Percentage
<InputNumber
  min={0}
  max={100}
  formatter={(value) => `${value}%`}
  parser={(value) => value.replace('%', '')}
  defaultValue={50}
/>

// Disabled and readonly
<InputNumber disabled defaultValue={42} />
<InputNumber readOnly value={42} />

// With ref (focus management)
const inputRef = useRef<InputNumberRef>(null)
<InputNumber ref={inputRef} />
// Later: inputRef.current?.focus({ cursor: 'end' })

// Step callback
<InputNumber
  onStep={(value, info) => {
    console.log(`New value: ${value}, offset: ${info.offset}, type: ${info.type}`)
  }}
/>

// Semantic styling
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
<summary><strong>Flex</strong> - Flexbox container for layout</summary>

### Flex

A flexible box layout component for arranging elements with CSS Flexbox.

#### Import

```tsx
import { Flex } from '@juanitte/inoui'
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
import { Grid, Row, Col } from '@juanitte/inoui'
// or
import { Grid } from '@juanitte/inoui'
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

`Grid` uses the shared `Breakpoint` type from [Utils](#utils). See [Breakpoint Utilities](#breakpoint-utilities) for type definitions and importable constants.

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
import { Layout } from '@juanitte/inoui'
// Use as Layout, Layout.Header, Layout.Sider, Layout.Content, Layout.Footer

// Or import individually
import { Layout, Header, Footer, Content, Sider } from '@juanitte/inoui'
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
import { useSider } from '@juanitte/inoui'

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
import { Menu } from '@juanitte/inoui'
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
<summary><strong>Mention</strong> - Textarea with @mention autocomplete</summary>

### Mention

A textarea component with mention detection and autocomplete dropdown. Detects mention triggers (like @, #) and shows filterable suggestions.

#### Import

```tsx
import { Mention } from '@juanitte/inoui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Controlled value |
| `defaultValue` | `string` | `''` | Initial uncontrolled value |
| `onChange` | `(text: string) => void` | — | Value change callback |
| `onSelect` | `(option: MentionOption, prefix: string) => void` | — | Callback when option is selected |
| `onSearch` | `(text: string, prefix: string) => void` | — | Search callback (triggered on mention detection) |
| `onFocus` | `(e: FocusEvent) => void` | — | Focus callback |
| `onBlur` | `(e: FocusEvent) => void` | — | Blur callback |
| `onPopupScroll` | `(e: UIEvent) => void` | — | Dropdown scroll callback |
| `options` | `MentionOption[]` | `[]` | Available mention options |
| `prefix` | `string \| string[]` | `'@'` | Mention trigger character(s) |
| `split` | `string` | `' '` | Split character after mention |
| `filterOption` | `false \| ((input: string, option: MentionOption) => boolean)` | `true` | Filter function or false to disable filtering |
| `validateSearch` | `(text: string, props: MentionProps) => boolean` | — | Validate search text before showing dropdown |
| `notFoundContent` | `ReactNode` | `'No matches'` | Content when no options match (null to hide) |
| `placement` | `'top' \| 'bottom'` | `'bottom'` | Dropdown placement (auto-flips when needed) |
| `allowClear` | `boolean` | `false` | Show clear button |
| `placeholder` | `string` | — | Placeholder text |
| `disabled` | `boolean` | `false` | Disable input |
| `readOnly` | `boolean` | `false` | Make input read-only |
| `id` | `string` | — | HTML id attribute |
| `autoFocus` | `boolean` | `false` | Auto-focus on mount |
| `rows` | `number` | `1` | Initial number of rows |
| `autoSize` | `boolean \| { minRows?: number; maxRows?: number }` | `false` | Auto-resize based on content |
| `resize` | `boolean` | `false` | Allow manual resize (when autoSize is false) |
| `size` | `'small' \| 'middle' \| 'large'` | `'middle'` | Input size |
| `variant` | `'outlined' \| 'filled' \| 'borderless' \| 'underlined'` | `'outlined'` | Visual style variant |
| `status` | `'error' \| 'warning'` | — | Validation status |
| `classNames` | `SemanticClassNames<'root' \| 'textarea' \| 'dropdown' \| 'option'>` | — | Semantic class names |
| `styles` | `SemanticStyles<'root' \| 'textarea' \| 'dropdown' \| 'option'>` | — | Semantic inline styles |

#### MentionOption

| Property | Type | Description |
|----------|------|-------------|
| `value` | `string` | Option value (inserted into text) |
| `label` | `ReactNode` | Display label (defaults to value) |
| `disabled` | `boolean` | Disable this option |

#### MentionRef

| Method | Description |
|--------|-------------|
| `focus(options?)` | Focus the textarea. Options: `{ preventScroll?: boolean; cursor?: 'start' \| 'end' \| 'all' }` |
| `blur()` | Remove focus from textarea |
| `textarea` | Reference to the native textarea element |
| `nativeElement` | Reference to the root element |

#### Size Configuration

| Size | Height | Font Size | Line Height |
|------|--------|-----------|-------------|
| `small` | 1.5rem (24px) | 0.75rem (12px) | 1.125rem |
| `middle` | 2rem (32px) | 0.875rem (14px) | 1.375rem |
| `large` | 2.5rem (40px) | 1rem (16px) | 1.5rem |

#### Variant Styles

- **outlined** - Default border style
- **filled** - Filled background with subtle border
- **borderless** - No border or background
- **underlined** - Bottom border only

#### Semantic DOM

| Slot | Description |
|------|-------------|
| `root` | Outer container element |
| `textarea` | Native textarea element |
| `dropdown` | Dropdown container |
| `option` | Individual option element |

#### Examples

```tsx
// Basic usage
const options = [
  { value: 'alice', label: 'Alice Johnson' },
  { value: 'bob', label: 'Bob Smith' },
  { value: 'charlie', label: 'Charlie Davis' },
]
<Mention options={options} placeholder="Type @ to mention someone" />

// Controlled
const [value, setValue] = useState('')
<Mention value={value} onChange={setValue} options={options} />

// Multiple prefixes (@ for users, # for tags)
const userOptions = [
  { value: 'alice', label: '@Alice' },
  { value: 'bob', label: '@Bob' },
]
const tagOptions = [
  { value: 'urgent', label: '#urgent' },
  { value: 'important', label: '#important' },
]
<Mention
  prefix={['@', '#']}
  options={[...userOptions, ...tagOptions]}
  onSearch={(text, prefix) => {
    if (prefix === '@') loadUsers(text)
    if (prefix === '#') loadTags(text)
  }}
/>

// Custom split character
<Mention
  options={options}
  prefix="@"
  split=" "  // Default: space after mention
/>

// Custom filtering
<Mention
  options={options}
  filterOption={(input, option) => {
    return option.value.toLowerCase().startsWith(input.toLowerCase())
  }}
/>

// Disable filtering (manual control)
<Mention
  options={filteredOptions}
  filterOption={false}
  onSearch={(text) => setFilteredOptions(customFilter(text))}
/>

// Validate search (minimum length, regex, etc.)
<Mention
  options={options}
  validateSearch={(text) => text.length >= 2}
  placeholder="Type @ + at least 2 chars"
/>

// Different sizes
<Mention size="small" options={options} />
<Mention size="middle" options={options} />
<Mention size="large" options={options} />

// Variants
<Mention variant="outlined" options={options} />
<Mention variant="filled" options={options} />
<Mention variant="borderless" options={options} />
<Mention variant="underlined" options={options} />

// Status
<Mention status="error" options={options} />
<Mention status="warning" options={options} />

// AutoSize
<Mention autoSize options={options} placeholder="Auto-resize" />
<Mention autoSize={{ minRows: 2, maxRows: 6 }} options={options} />

// Fixed rows with manual resize
<Mention rows={4} resize options={options} />

// Allow clear
<Mention allowClear options={options} />

// Placement
<Mention placement="top" options={options} />
<Mention placement="bottom" options={options} /> // auto-flips if no space

// Custom not found content
<Mention notFoundContent="No users found" options={options} />
<Mention notFoundContent={null} options={options} /> // hide when no matches

// Disabled and readonly
<Mention disabled options={options} defaultValue="Can't edit" />
<Mention readOnly options={options} value="Read only" />

// On select callback
<Mention
  options={options}
  onSelect={(option, prefix) => {
    console.log(`Selected ${prefix}${option.value}`)
  }}
/>

// With ref
const mentionRef = useRef<MentionRef>(null)
<Mention ref={mentionRef} options={options} />
// Later: mentionRef.current?.focus({ cursor: 'end' })

// Rich options with custom labels
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

// Async loading
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

// Semantic styling
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
<summary><strong>Modal</strong> - Dialog overlay with header, footer, confirm dialogs, and useModal hook</summary>

### Modal

`Modal` is a dialog component that renders in a portal on `document.body`. It supports a header with title, a scrollable body, a flexible footer (default Cancel + OK buttons, custom `ReactNode`, render function, or `null` to hide), ESC key dismissal, mask click to close, optional mask blur, `centered` vertical alignment, async `onOk` with `confirmLoading` spinner, a body loading skeleton, `modalRender` for custom wrappers (e.g. draggable), and `destroyOnClose`. The `useModal()` hook provides programmatic confirm/info/success/warning/error dialogs with `destroy` and `update` control.

```tsx
import { Modal, useModal } from '@juanitte/inoui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Whether the modal is visible |
| `onClose` | `(e: MouseEvent \| KeyboardEvent) => void` | — | Called when the user closes the modal (X button, mask click, or ESC) |
| `onOk` | `(e: MouseEvent) => void` | — | Called when the OK button is clicked |
| `afterOpenChange` | `(open: boolean) => void` | — | Called after the open/close animation completes |
| `title` | `ReactNode` | — | Header title |
| `footer` | `ReactNode \| null \| ((params) => ReactNode)` | `undefined` | `undefined` = Cancel + OK; `null` = no footer; `ReactNode` = custom content; function = render with `{ OkBtn, CancelBtn }` |
| `children` | `ReactNode` | — | Modal body content |
| `closable` | `boolean` | `true` | Show the close button (×) in the top-right corner |
| `closeIcon` | `ReactNode` | — | Custom close icon |
| `maskClosable` | `boolean` | `true` | Close the modal when clicking the mask |
| `keyboard` | `boolean` | `true` | Close the modal on ESC key press |
| `width` | `number \| string` | `'32rem'` | Dialog width |
| `centered` | `boolean` | `false` | Vertically center the dialog |
| `okText` | `ReactNode` | `'OK'` | OK button label |
| `cancelText` | `ReactNode` | `'Cancel'` | Cancel button label |
| `okButtonProps` | `Record<string, unknown>` | — | Extra props spread onto the OK `<button>` (e.g. `style`, `disabled`) |
| `cancelButtonProps` | `Record<string, unknown>` | — | Extra props spread onto the Cancel `<button>` |
| `confirmLoading` | `boolean` | `false` | Show a spinning icon on the OK button and disable it |
| `loading` | `boolean` | `false` | Show an animated skeleton in the body instead of children |
| `destroyOnClose` | `boolean` | `false` | Unmount body content when the modal closes |
| `mask` | `boolean \| ModalMaskConfig` | `true` | Show backdrop; `{ blur: true }` enables a frosted-glass blur effect |
| `zIndex` | `number` | `1000` | z-index for the overlay |
| `modalRender` | `(node: ReactNode) => ReactNode` | — | Custom wrapper for the dialog panel (e.g. to make it draggable) |
| `className` | `string` | — | CSS class on the dialog panel |
| `style` | `CSSProperties` | — | Inline style on the dialog panel |
| `classNames` | `ModalClassNames` | — | Semantic class names per slot |
| `styles` | `ModalStyles` | — | Semantic inline styles per slot |

#### ModalMaskConfig

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `blur` | `boolean` | `false` | Apply `backdrop-filter: blur(6px)` to the mask (frosted glass) |

#### Types

```ts
type ModalSemanticSlot = 'root' | 'mask' | 'header' | 'body' | 'footer' | 'closeBtn' | 'content'
type ModalClassNames   = SemanticClassNames<ModalSemanticSlot>
type ModalStyles       = SemanticStyles<ModalSemanticSlot>
```

#### Footer render function

When `footer` is a function, it receives `{ OkBtn, CancelBtn }` — the pre-configured button components — so you can reorder them or add custom elements alongside:

```tsx
footer={({ OkBtn, CancelBtn }) => (
  <>
    <span style={{ flex: 1 }}>Step 1 of 3</span>
    <CancelBtn />
    <OkBtn />
  </>
)}
```

#### Animation

- **Open:** double `requestAnimationFrame` triggers `scale(1)` + `opacity: 1` on the dialog panel (250 ms ease); mask fades in simultaneously (300 ms ease).
- **Close:** panel scales back to `0.85` and fades out; after the transition ends `afterOpenChange(false)` fires and the portal unmounts.
- Body `overflow: hidden` is applied while mounted to prevent background scrolling.

#### useModal hook

```ts
const [modal, contextHolder] = useModal()
```

Place `contextHolder` in your JSX tree. Then call methods on `modal`:

> **Tip:** If you use [`<App>`](#app) as your root provider you never need to call `useModal()` or place `contextHolder` manually — call `App.useApp()` instead to get the same `modal` API from context.

| Method | Returns | Description |
|--------|---------|-------------|
| `modal.confirm(config)` | `ModalInstance` | Two-button confirm dialog |
| `modal.info(config)` | `ModalInstance` | One-button info dialog |
| `modal.success(config)` | `ModalInstance` | One-button success dialog |
| `modal.warning(config)` | `ModalInstance` | One-button warning dialog |
| `modal.error(config)` | `ModalInstance` | One-button error dialog |
| `modal.destroyAll()` | `void` | Close all open confirm dialogs |

Each method returns a `ModalInstance`:

| Member | Type | Description |
|--------|------|-------------|
| `destroy` | `() => void` | Programmatically close the dialog |
| `update` | `(config: Partial<ModalConfirmConfig>) => void` | Update title, content, or other config live |

#### ModalConfirmConfig

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `title` | `ReactNode` | — | Dialog title |
| `content` | `ReactNode` | — | Dialog body text |
| `icon` | `ReactNode` | type icon | Custom icon |
| `okText` | `ReactNode` | `'OK'` | OK button label |
| `cancelText` | `ReactNode` | `'Cancel'` | Cancel button label (confirm only) |
| `onOk` | `() => void \| Promise<void>` | — | OK handler; returning a Promise enables async loading state |
| `onCancel` | `() => void` | — | Cancel handler |
| `bordered` | `boolean` | `true` (non-confirm) | Show a colored border matching the dialog type |
| `closable` | `boolean` | `false` | Show a close button |
| `centered` | `boolean` | — | Vertically center the dialog |
| `width` | `number \| string` | `'26rem'` | Dialog width |
| `maskClosable` | `boolean` | `false` | Close on mask click |
| `keyboard` | `boolean` | `true` | Close on ESC |
| `zIndex` | `number` | `1000` | z-index |
| `className` | `string` | — | CSS class |
| `style` | `CSSProperties` | — | Inline style |

#### Examples

**1. Basic modal**
```tsx
import { useState } from 'react'
import { Modal, Button } from '@juanitte/inoui'

function App() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal
        title="Basic Modal"
        open={open}
        onClose={() => setOpen(false)}
        onOk={() => setOpen(false)}
      >
        <p>Modal body content goes here.</p>
      </Modal>
    </>
  )
}
```

**2. Centered**
```tsx
<Modal title="Centered" centered open={open} onClose={close} onOk={close}>
  <p>Vertically centered on the viewport.</p>
</Modal>
```

**3. Custom width**
```tsx
<Modal title="Wide" width={800} open={open} onClose={close} onOk={close}>
  <p>800 px wide dialog.</p>
</Modal>
```

**4. No footer**
```tsx
<Modal title="No Footer" footer={null} open={open} onClose={close}>
  <p>This modal has no footer at all.</p>
</Modal>
```

**5. Custom footer with render function**
```tsx
<Modal
  title="Custom Footer"
  open={open}
  onClose={close}
  onOk={save}
  footer={({ OkBtn, CancelBtn }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <Button variant="danger" onClick={handleDelete}>Delete</Button>
      <div style={{ display: 'flex', gap: 8 }}>
        <CancelBtn />
        <OkBtn />
      </div>
    </div>
  )}
>
  <p>Footer with a danger action on the left.</p>
</Modal>
```

**6. Custom footer as ReactNode**
```tsx
<Modal
  title="ReactNode Footer"
  footer={<Button onClick={close}>Got it</Button>}
  open={open}
  onClose={close}
>
  <p>Single acknowledgement button.</p>
</Modal>
```

**7. Async OK with confirmLoading**
```tsx
const [loading, setLoading] = useState(false)

const handleOk = async () => {
  setLoading(true)
  await submitForm()
  setLoading(false)
  setOpen(false)
}

<Modal
  title="Submit Form"
  open={open}
  onClose={() => setOpen(false)}
  onOk={handleOk}
  confirmLoading={loading}
>
  <p>Click OK to submit.</p>
</Modal>
```

**8. Loading skeleton**
```tsx
<Modal title="Loading Data" loading={loading} open={open} onClose={close} onOk={close}>
  <p>This is hidden while loading.</p>
</Modal>
```

**9. Frosted-glass mask**
```tsx
<Modal title="Blur Backdrop" mask={{ blur: true }} open={open} onClose={close} onOk={close}>
  <p>The background is blurred behind the modal.</p>
</Modal>
```

**10. No mask**
```tsx
<Modal title="No Mask" mask={false} open={open} onClose={close} onOk={close}>
  <p>The background remains fully interactive.</p>
</Modal>
```

**11. Mask not closable, no ESC**
```tsx
<Modal title="Sticky" maskClosable={false} keyboard={false} open={open} onClose={close} onOk={close}>
  <p>Can only be closed with the × button or footer buttons.</p>
</Modal>
```

**12. No close button**
```tsx
<Modal title="No Close Button" closable={false} open={open} onClose={close} onOk={close}>
  <p>Use the footer buttons to dismiss.</p>
</Modal>
```

**13. Custom close icon**
```tsx
<Modal title="Custom Icon" closeIcon={<span>✕</span>} open={open} onClose={close} onOk={close}>
  <p>Custom × icon.</p>
</Modal>
```

**14. Custom OK/Cancel text**
```tsx
<Modal
  title="Confirm Deletion"
  okText="Yes, delete"
  cancelText="Keep it"
  open={open}
  onClose={() => setOpen(false)}
  onOk={handleDelete}
>
  <p>Are you sure you want to delete this item?</p>
</Modal>
```

**15. Destroy on close**
```tsx
<Modal title="Fresh State" destroyOnClose open={open} onClose={close} onOk={close}>
  <input placeholder="Reset on next open" />
</Modal>
```

**16. modalRender (draggable)**
```tsx
import Draggable from 'react-draggable'

<Modal
  title="Drag me"
  open={open}
  onClose={close}
  onOk={close}
  modalRender={(node) => <Draggable>{node as React.ReactElement}</Draggable>}
>
  <p>You can drag this dialog around.</p>
</Modal>
```

**17. Semantic styles**
```tsx
<Modal
  title="Styled Modal"
  open={open}
  onClose={close}
  onOk={close}
  styles={{
    mask: { backgroundColor: 'rgba(0,0,0,0.7)' },
    header: { backgroundColor: '#f0f4ff', borderBottom: '2px solid #1677ff' },
    body: { padding: '2rem' },
    footer: { backgroundColor: '#f0f4ff', borderTop: '2px solid #1677ff' },
  }}
>
  <p>Custom styled sections.</p>
</Modal>
```

**18. useModal — confirm dialog**
```tsx
import { useModal, Button } from '@juanitte/inoui'

function App() {
  const [modal, contextHolder] = useModal()

  const handleDelete = () => {
    modal.confirm({
      title: 'Delete item?',
      content: 'This action cannot be undone.',
      okText: 'Delete',
      cancelText: 'Keep',
      onOk: async () => {
        await deleteItem()
      },
      onCancel: () => console.log('Cancelled'),
    })
  }

  return (
    <>
      {contextHolder}
      <Button onClick={handleDelete}>Delete</Button>
    </>
  )
}
```

**19. useModal — info / success / warning / error**
```tsx
modal.info({    title: 'Update available',  content: 'Refresh to get the latest version.' })
modal.success({ title: 'Payment received',  content: 'Your invoice has been updated.' })
modal.warning({ title: 'Low disk space',    content: 'Free up space to continue.' })
modal.error({   title: 'Upload failed',     content: 'Please check your connection.' })
```

**20. useModal — destroy and update**
```tsx
const instance = modal.confirm({
  title: 'Processing…',
  content: 'Please wait.',
  onOk: async () => { await longTask() },
})

// Update while open
instance.update({ title: 'Almost done…' })

// Or close it programmatically
instance.destroy()

// Close all at once
modal.destroyAll()
```

**21. Full form modal**
```tsx
import { useState } from 'react'
import { Modal, Button } from '@juanitte/inoui'

interface UserForm { name: string; email: string }

function EditUserModal({ user, onSave, onCancel }: {
  user: UserForm
  onSave: (u: UserForm) => Promise<void>
  onCancel: () => void
}) {
  const [form, setForm]     = useState(user)
  const [saving, setSaving] = useState(false)

  const handleOk = async () => {
    setSaving(true)
    try { await onSave(form) }
    finally { setSaving(false) }
  }

  return (
    <Modal
      title="Edit User"
      open
      onClose={onCancel}
      onOk={handleOk}
      confirmLoading={saving}
      okText="Save"
      centered
      destroyOnClose
      width="28rem"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label>
          Name
          <input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
        </label>
        <label>
          Email
          <input value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
        </label>
      </div>
    </Modal>
  )
}
```

</details>

---

<details>
<summary><strong>NestedSelect</strong> - Cascading hierarchical selection with search and multiple mode</summary>

### NestedSelect

A cascading selection component for hierarchical data (e.g., province/city/district). Supports single and multiple selection with checkboxes, search with highlighting, lazy loading, custom field names, display render, tag management, expand-on-hover, and an inline panel variant (`NestedSelect.Panel`).

#### Import

```tsx
import { NestedSelect } from '@juanitte/inoui'
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

> **Locale:** the page-size suffix (e.g. `"/ page"`) and jump-to prefix (e.g. `"Go to"`) come from [`ConfigProvider`](#configprovider) `locale.Pagination`.

#### Import

```tsx
import { Pagination } from '@juanitte/inoui'
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
<summary><strong>PopAlert</strong> - Floating toast notifications via hook API</summary>

### PopAlert

`PopAlert` is a hook-based toast notification system. Call `usePopAlert()` to get an `api` object and a `contextHolder` node. Place `contextHolder` anywhere in your JSX to mount the portal, then call `api.success()`, `api.error()`, etc. from anywhere in the component tree. Notifications appear as floating pill cards at any of 8 screen positions, animate in/out, auto-dismiss after a configurable duration, pause on hover, support a shrinking progress bar, optional secondary description text, and allow update-in-place via a stable `key`.

```tsx
import { usePopAlert } from '@juanitte/inoui'
```

#### usePopAlert(config?)

> **Tip:** If you use [`<App>`](#app) as your root provider you never need to call `usePopAlert()` or place `contextHolder` manually — call `App.useApp()` instead to get the same `notification` API from context.

```ts
const [api, contextHolder] = usePopAlert(hookConfig?: PopAlertHookConfig)
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `placement` | `PopAlertPlacement` | `'top'` | Where notifications appear on screen |
| `offset` | `number \| string` | `'0.5rem'` | Distance from the screen edge |
| `size` | `PopAlertSize` | `'md'` | Default pill size for all notifications |
| `duration` | `number` | `3` | Default auto-close time in seconds (`0` = never) |
| `maxCount` | `number` | `Infinity` | Maximum number of simultaneous notifications (oldest exits when exceeded) |

#### PopAlertApi

| Method | Signature | Description |
|--------|-----------|-------------|
| `api.success` | `(content, duration?) => void` | Show a success notification |
| `api.error` | `(content, duration?) => void` | Show an error notification |
| `api.info` | `(content, duration?) => void` | Show an info notification |
| `api.warning` | `(content, duration?) => void` | Show a warning notification |
| `api.loading` | `(content, duration?) => void` | Show a loading notification (spinning icon) |
| `api.open` | `(config: PopAlertConfig) => void` | Full control — pass a complete config object |
| `api.destroy` | `(key?) => void` | Dismiss one notification by key, or all if no key given |

#### PopAlertConfig (api.open)

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `content` | `ReactNode` | — | **Required.** Notification message |
| `description` | `ReactNode` | — | Secondary text shown below `content` in a smaller, muted style |
| `type` | `PopAlertType` | — | **Required** for `api.open`. Severity level |
| `duration` | `number` | hook default | Auto-close in seconds; `0` = never |
| `key` | `string` | auto | Unique key — pass the same key to update an existing notification in-place |
| `icon` | `ReactNode` | — | Custom icon replacing the default type icon |
| `closable` | `boolean` | `false` | Show a manual close button |
| `showProgress` | `boolean` | `false` | Show a shrinking progress bar for the remaining time |
| `pauseOnHover` | `boolean` | `true` | Pause the auto-close timer while the cursor is on the notification |
| `size` | `PopAlertSize` | hook default | Override pill size for this notification |
| `onClose` | `() => void` | — | Called after the exit animation completes |
| `className` | `string` | — | CSS class on the card |
| `style` | `CSSProperties` | — | Inline style on the card |
| `classNames` | `PopAlertClassNames` | — | Semantic class names per slot |
| `styles` | `PopAlertStyles` | — | Semantic inline styles per slot |

#### Types

```ts
type PopAlertType      = 'success' | 'info' | 'warning' | 'error' | 'loading'
type PopAlertPlacement = 'top' | 'topLeft' | 'topRight' | 'right' | 'bottomRight' | 'bottom' | 'bottomLeft' | 'left'
type PopAlertSize      = 'sm' | 'md' | 'lg'

type PopAlertSemanticSlot = 'root' | 'icon' | 'content' | 'description'
type PopAlertClassNames   = SemanticClassNames<PopAlertSemanticSlot>
type PopAlertStyles       = SemanticStyles<PopAlertSemanticSlot>
```

#### Animation

- **Enter:** slides in from the edge + fades in (`max-height`, `opacity`, `transform` — 300 ms). Enter direction mirrors the placement edge.
- **Exit:** slides out halfway toward the edge + fades out + collapses height (300 ms). The gap left by the removed card collapses smoothly with `margin-bottom: 0`.
- **Update-in-place:** when `api.open` is called with an existing `key`, the card plays a brief scale+fade pulse (300 ms) and the progress bar resets.
- **Pause on hover:** `animationPlayState: paused` on the progress bar; elapsed time is tracked in a ref so the timer resumes correctly.

#### Examples

**1. Basic usage**
```tsx
import { usePopAlert } from '@juanitte/inoui'

function App() {
  const [api, contextHolder] = usePopAlert()

  return (
    <>
      {contextHolder}
      <button onClick={() => api.success('Changes saved!')}>Success</button>
      <button onClick={() => api.error('Something went wrong.')}>Error</button>
      <button onClick={() => api.info('New version available.')}>Info</button>
      <button onClick={() => api.warning('Disk space low.')}>Warning</button>
    </>
  )
}
```

**2. Custom duration**
```tsx
api.success('Auto-closes in 8 seconds', 8)
api.error('Stays until dismissed', 0)
```

**3. Loading then success (update-in-place)**
```tsx
api.open({ type: 'loading', content: 'Saving…', key: 'save', duration: 0 })

await saveData()

api.open({ type: 'success', content: 'Saved!', key: 'save', duration: 3 })
```

**4. Placement options**
```tsx
const [api, contextHolder] = usePopAlert({ placement: 'bottomRight' })
// All notifications appear at the bottom-right corner
```

**5. Limit simultaneous notifications**
```tsx
const [api, contextHolder] = usePopAlert({ maxCount: 3 })
// Oldest notification exits automatically when a 4th is added
```

**6. Closable with progress bar**
```tsx
api.open({
  type: 'info',
  content: 'Auto-closing in 5 seconds',
  duration: 5,
  closable: true,
  showProgress: true,
})
```

**7. Disable hover pause**
```tsx
api.open({
  type: 'warning',
  content: 'Timer continues on hover',
  duration: 4,
  pauseOnHover: false,
})
```

**8. Custom icon**
```tsx
api.open({
  type: 'info',
  content: 'Maintenance scheduled tonight',
  icon: <span>🔧</span>,
})
```

**9. Destroy all**
```tsx
<button onClick={() => api.destroy()}>Clear all</button>
```

**10. Destroy specific**
```tsx
api.open({ type: 'loading', content: 'Processing…', key: 'job-1', duration: 0 })
// later:
api.destroy('job-1')
```

**11. Large size with onClose callback**
```tsx
api.open({
  type: 'success',
  content: 'File uploaded successfully',
  size: 'lg',
  duration: 4,
  onClose: () => console.log('Toast gone'),
})
```

**12. Hook-level defaults**
```tsx
const [api, contextHolder] = usePopAlert({
  placement: 'topRight',
  offset: '1rem',
  size: 'sm',
  duration: 5,
  maxCount: 5,
})
```

**13. Notification with description**
```tsx
api.open({
  type: 'info',
  content: 'File ready to download',
  description: 'report-q1-2026.pdf · 2.4 MB',
  duration: 6,
  closable: true,
})
```

**14. Semantic styles**
```tsx
api.open({
  type: 'info',
  content: 'Custom styled notification',
  description: 'Additional detail text',
  styles: {
    root: { borderRadius: 24, fontWeight: 600 },
    icon: { color: '#722ed1' },
    description: { fontStyle: 'italic' },
  },
})
```

**15. Full workflow example**
```tsx
import { useState } from 'react'
import { usePopAlert, Button } from '@juanitte/inoui'

export function UploadButton() {
  const [api, contextHolder] = usePopAlert({
    placement: 'topRight',
    maxCount: 4,
  })
  const [uploading, setUploading] = useState(false)

  const handleUpload = async () => {
    setUploading(true)
    api.open({
      type: 'loading',
      content: 'Uploading file…',
      key: 'upload',
      duration: 0,
    })
    try {
      await fakeUpload()
      api.open({
        type: 'success',
        content: 'File uploaded!',
        key: 'upload',
        duration: 4,
        showProgress: true,
        closable: true,
      })
    } catch {
      api.open({
        type: 'error',
        content: 'Upload failed. Try again.',
        key: 'upload',
        duration: 6,
        closable: true,
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      {contextHolder}
      <Button loading={uploading} onClick={handleUpload}>Upload</Button>
    </>
  )
}

function fakeUpload() {
  return new Promise<void>((resolve, reject) =>
    setTimeout(() => (Math.random() > 0.3 ? resolve() : reject()), 2000)
  )
}
```

</details>

---

<details>
<summary><strong>PopConfirm</strong> - Confirmation popover with OK / Cancel actions</summary>

### PopConfirm

`PopConfirm` displays a lightweight confirmation popover next to a trigger element. It renders a warning icon, a required title, an optional description, and OK / Cancel action buttons. If `onConfirm` returns a Promise the OK button shows a loading spinner until the promise settles. Built on top of `Popover` — all placement, trigger, and delay options from `Popover` are available.

```tsx
import { PopConfirm } from '@juanitte/inoui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | — | **Required.** Main question text shown in the popover |
| `description` | `ReactNode` | — | Optional secondary descriptive text below the title |
| `icon` | `ReactNode \| null` | warning icon | Icon before the title. Pass `null` to hide it |
| `onConfirm` | `() => void \| Promise<void>` | — | Called on OK click. Returning a Promise activates loading state until it settles |
| `onCancel` | `() => void` | — | Called on Cancel click |
| `okText` | `ReactNode` | `'OK'` | Label for the OK button |
| `cancelText` | `ReactNode` | `'Cancel'` | Label for the Cancel button |
| `okButtonProps` | `Record<string, unknown>` | — | Extra props spread onto the OK `<button>` element |
| `cancelButtonProps` | `Record<string, unknown>` | — | Extra props spread onto the Cancel `<button>` element |
| `showCancel` | `boolean` | `true` | Whether to render the Cancel button |
| `disabled` | `boolean` | `false` | Prevent the popover from opening |
| `children` | `ReactNode` | — | **Required.** Trigger element |
| `placement` | `PopoverPlacement` | `'top'` | Popover position relative to the trigger |
| `trigger` | `PopoverTrigger \| PopoverTrigger[]` | `'click'` | Interaction that opens the popover |
| `open` | `boolean` | — | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | — | Called when open state changes |
| `arrow` | `boolean` | `true` | Show the arrow indicator |
| `mouseEnterDelay` | `number` | — | Delay in ms before showing on hover |
| `mouseLeaveDelay` | `number` | — | Delay in ms before hiding on mouse leave |
| `className` | `string` | — | CSS class on the popover panel |
| `style` | `CSSProperties` | — | Inline style on the popover panel |
| `classNames` | `PopConfirmClassNames` | — | Semantic class names per slot |
| `styles` | `PopConfirmStyles` | — | Semantic inline styles per slot |

#### Types

```ts
type PopConfirmSemanticSlot = 'root' | 'icon' | 'title' | 'description' | 'buttons'
type PopConfirmClassNames   = SemanticClassNames<PopConfirmSemanticSlot>
type PopConfirmStyles       = SemanticStyles<PopConfirmSemanticSlot>

// Inherited from Popover:
type PopoverPlacement = 'top' | 'topLeft' | 'topRight' | 'right' | 'rightTop' | 'rightBottom'
                      | 'bottom' | 'bottomLeft' | 'bottomRight' | 'left' | 'leftTop' | 'leftBottom'
type PopoverTrigger   = 'hover' | 'click' | 'focus' | 'contextMenu'
```

#### Behavior

- **Async confirm:** when `onConfirm` returns a `Promise`, the OK button becomes disabled and shows a spinning indicator. If the promise resolves the popover closes; if it rejects the popover stays open so the user can retry.
- **Controlled / uncontrolled:** omit `open` for uncontrolled mode (the component manages visibility internally); provide `open` + `onOpenChange` for controlled mode.
- **Disabled:** when `disabled={true}` the trigger click is ignored and the popover never opens.

#### Examples

**1. Basic delete confirmation**
```tsx
import { PopConfirm, Button } from '@juanitte/inoui'

<PopConfirm
  title="Delete this record?"
  onConfirm={() => deleteRecord(id)}
>
  <Button variant="danger">Delete</Button>
</PopConfirm>
```

**2. With description**
```tsx
<PopConfirm
  title="Delete this record?"
  description="This action cannot be undone."
  onConfirm={() => deleteRecord(id)}
>
  <Button variant="danger">Delete</Button>
</PopConfirm>
```

**3. Async confirm with loading state**
```tsx
<PopConfirm
  title="Submit for review?"
  onConfirm={async () => {
    await submitToServer()
    // popover closes automatically on resolve
  }}
>
  <Button>Submit</Button>
</PopConfirm>
```

**4. Custom button labels**
```tsx
<PopConfirm
  title="Log out of all devices?"
  okText="Yes, log out"
  cancelText="No, keep me in"
  onConfirm={handleLogoutAll}
>
  <Button>Log out everywhere</Button>
</PopConfirm>
```

**5. No icon, no cancel button**
```tsx
<PopConfirm
  title="Mark all as read?"
  icon={null}
  showCancel={false}
  onConfirm={markAllRead}
>
  <Button>Mark read</Button>
</PopConfirm>
```

**6. Different placement**
```tsx
<PopConfirm
  title="Are you sure?"
  placement="bottomRight"
  onConfirm={handleConfirm}
>
  <Button>Action</Button>
</PopConfirm>
```

**7. Disabled**
```tsx
<PopConfirm
  title="Are you sure?"
  disabled={!hasPermission}
  onConfirm={handleDelete}
>
  <Button disabled={!hasPermission}>Delete</Button>
</PopConfirm>
```

**8. Controlled open state**
```tsx
const [open, setOpen] = useState(false)

<PopConfirm
  title="Save changes?"
  open={open}
  onOpenChange={setOpen}
  onConfirm={handleSave}
  onCancel={() => setOpen(false)}
>
  <Button onClick={() => setOpen(true)}>Save</Button>
</PopConfirm>
```

**9. Semantic styles**
```tsx
<PopConfirm
  title="Proceed?"
  styles={{
    root:  { minWidth: 240 },
    icon:  { color: '#1677ff' },
    title: { fontSize: '1rem' },
    description: { color: '#888' },
    buttons: { justifyContent: 'flex-start' },
  }}
  onConfirm={handleConfirm}
>
  <Button>Go</Button>
</PopConfirm>
```

</details>

---

<details>
<summary><strong>Popover</strong> - Floating card with title and content</summary>

### Popover

`Popover` displays a floating card with title and content next to a trigger element. Supports 12 placements, multiple trigger modes (hover, click, focus, context menu), auto-flip when overflowing viewport, configurable delays, and arrow indicator.

#### Import

```tsx
import { Popover } from '@juanitte/inoui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode \| () => ReactNode` | - | Title content of the popover card |
| `content` | `ReactNode \| () => ReactNode` | - | Body content of the popover card |
| `children` | `ReactNode` | - | Trigger element (required) |
| `placement` | `PopoverPlacement` | `'top'` | Popover position relative to trigger |
| `trigger` | `PopoverTrigger \| PopoverTrigger[]` | `'hover'` | Trigger mode(s) to open popover |
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `arrow` | `boolean` | `true` | Show arrow pointing to trigger |
| `mouseEnterDelay` | `number` | `100` | Delay in ms before showing on hover |
| `mouseLeaveDelay` | `number` | `100` | Delay in ms before hiding on mouse leave |
| `disabled` | `boolean` | `false` | Disable the popover |
| `className` | `string` | - | Root element class name |
| `style` | `CSSProperties` | - | Root element inline styles |
| `classNames` | `PopoverClassNames` | - | Semantic class names for popover slots |
| `styles` | `PopoverStyles` | - | Semantic inline styles for popover slots |

#### PopoverPlacement

```tsx
type PopoverPlacement =
  | 'top'    | 'topLeft'    | 'topRight'
  | 'bottom' | 'bottomLeft' | 'bottomRight'
  | 'left'   | 'leftTop'    | 'leftBottom'
  | 'right'  | 'rightTop'   | 'rightBottom'
```

#### PopoverTrigger

```tsx
type PopoverTrigger = 'hover' | 'click' | 'focus' | 'contextMenu'
```

#### Semantic DOM

The Popover component uses semantic class names and styles for customization:

```tsx
type PopoverSemanticSlot = 'root' | 'popup' | 'title' | 'content' | 'arrow'

interface PopoverClassNames {
  root?: string
  popup?: string
  title?: string
  content?: string
  arrow?: string
}

interface PopoverStyles {
  root?: CSSProperties
  popup?: CSSProperties
  title?: CSSProperties
  content?: CSSProperties
  arrow?: CSSProperties
}
```

#### Examples

**Basic popover (hover):**

```tsx
<Popover title="Popover Title" content="This is the popover content.">
  <Button>Hover me</Button>
</Popover>
```

**Click trigger:**

```tsx
<Popover
  title="Click Popover"
  content="Click outside to close."
  trigger="click"
>
  <Button>Click me</Button>
</Popover>
```

**Focus trigger:**

```tsx
<Popover
  title="Focus Popover"
  content="Triggered on focus."
  trigger="focus"
>
  <Input placeholder="Focus me" />
</Popover>
```

**Context menu trigger:**

```tsx
<Popover
  title="Context Menu"
  content="Right-click triggered popover."
  trigger="contextMenu"
>
  <div style={{ padding: '2rem', border: '1px dashed #ccc', textAlign: 'center' }}>
    Right-click this area
  </div>
</Popover>
```

**Multiple triggers:**

```tsx
<Popover
  title="Multi Trigger"
  content="Opens on hover or click."
  trigger={['hover', 'click']}
>
  <Button>Hover or Click</Button>
</Popover>
```

**Placement variations:**

```tsx
<Popover title="Bottom" content="Placed at bottom." placement="bottom">
  <Button>Bottom</Button>
</Popover>

<Popover title="Left" content="Placed at left." placement="left">
  <Button>Left</Button>
</Popover>

<Popover title="Right" content="Placed at right." placement="right">
  <Button>Right</Button>
</Popover>

<Popover title="Top Left" content="Placed at top-left." placement="topLeft">
  <Button>Top Left</Button>
</Popover>
```

**Without arrow:**

```tsx
<Popover
  title="No Arrow"
  content="Popover without an arrow indicator."
  arrow={false}
>
  <Button>No Arrow</Button>
</Popover>
```

**Content only (no title):**

```tsx
<Popover content="Simple tooltip-like popover without a title.">
  <Button>Content Only</Button>
</Popover>
```

**Title only (no content):**

```tsx
<Popover title="Just a title">
  <Button>Title Only</Button>
</Popover>
```

**Controlled popover:**

```tsx
const [open, setOpen] = useState(false)

<div>
  <Button onClick={() => setOpen(!open)}>Toggle Popover</Button>
  <Popover
    title="Controlled"
    content="This popover is controlled externally."
    open={open}
    onOpenChange={setOpen}
    trigger="click"
  >
    <Button>Target</Button>
  </Popover>
</div>
```

**Function content (lazy rendering):**

```tsx
<Popover
  title={() => <strong>Dynamic Title</strong>}
  content={() => (
    <div>
      <p>Content rendered lazily as a function.</p>
      <p>Current time: {new Date().toLocaleTimeString()}</p>
    </div>
  )}
>
  <Button>Lazy Content</Button>
</Popover>
```

**Custom delays:**

```tsx
<Popover
  title="Slow Popover"
  content="Appears after 500ms, hides after 300ms."
  mouseEnterDelay={500}
  mouseLeaveDelay={300}
>
  <Button>Slow Hover</Button>
</Popover>
```

**Disabled popover:**

```tsx
<Popover
  title="Disabled"
  content="This popover won't open."
  disabled
>
  <Button>Disabled Popover</Button>
</Popover>
```

**Rich content with actions:**

```tsx
<Popover
  title="User Profile"
  content={
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <p style={{ margin: 0 }}>John Doe - Admin</p>
      <p style={{ margin: 0, color: '#888' }}>john@example.com</p>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <Button size="sm">Profile</Button>
        <Button size="sm" color="error">Logout</Button>
      </div>
    </div>
  }
  trigger="click"
>
  <Avatar>JD</Avatar>
</Popover>
```

</details>

---

<details>
<summary><strong>Progress</strong> - Line, circle, and dashboard progress indicators</summary>

### Progress

`Progress` visualises completion as a line bar, a circular ring, or a dashboard (open-bottom arc). All three variants support gradient stroke colors, a secondary success segment, segmented (steps) mode, custom text formatting, and the full semantic-DOM slot system.

```tsx
import { Progress } from '@juanitte/inoui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `percent` | `number` | `0` | Completion percentage (clamped to 0–100) |
| `type` | `ProgressType` | `'line'` | Visual variant: `'line'`, `'circle'`, or `'dashboard'` |
| `status` | `ProgressStatus` | auto | Override status. Auto-resolves to `'success'` at 100 %, otherwise `'normal'` |
| `showInfo` | `boolean` | `true` | Show the percentage text or status icon |
| `format` | `(percent, successPercent?) => ReactNode` | — | Custom info renderer. Return `null` or `false` to hide |
| `strokeColor` | `ProgressStrokeColor` | — | Fill color — solid, per-step array, or gradient (see Types) |
| `trailColor` | `string` | — | Color of the unfilled track |
| `strokeLinecap` | `ProgressLinecap` | `'round'` | Cap style: `'round'`, `'butt'`, or `'square'` |
| `strokeWidth` | `number` | `8` (line) / `6` (circle) | Track thickness in px (line) or % of diameter (circle/dashboard) |
| `size` | `ProgressSize` | `'default'` | Preset or custom size (see Types) |
| `success` | `ProgressSuccessConfig` | — | Overlay a filled success segment on top of the main stroke |
| `steps` | `number` | — | Split the bar into N discrete segments |
| `percentPosition` | `ProgressPercentPosition` | — | **Line only.** Where to render the info text (see Types) |
| `width` | `number` | `120` | **Circle / dashboard only.** SVG canvas size in px |
| `gapDegree` | `number` | `75` | **Dashboard only.** Arc gap angle in degrees (0–295) |
| `gapPosition` | `ProgressGapPosition` | `'bottom'` | **Dashboard only.** Where the gap sits |
| `className` | `string` | — | CSS class on the root element |
| `style` | `CSSProperties` | — | Inline style on the root element |
| `classNames` | `ProgressClassNames` | — | Semantic class names per slot |
| `styles` | `ProgressStyles` | — | Semantic inline styles per slot |

#### Types

```ts
type ProgressType        = 'line' | 'circle' | 'dashboard'
type ProgressStatus      = 'normal' | 'active' | 'success' | 'exception'
type ProgressLinecap     = 'round' | 'butt' | 'square'
type ProgressGapPosition = 'top' | 'bottom' | 'left' | 'right'

// Size:
//   'small'          → strokeHeight 6 px, circle canvas 80 px
//   'default'        → strokeHeight 8 px, circle canvas 120 px
//   number (line)    → explicit strokeHeight
//   number (circle)  → explicit canvas size
//   [width, height]  → line only: explicit track width + stroke height
type ProgressSize = 'small' | 'default' | number | [number, number]

// strokeColor variants:
//   string                        → solid CSS color
//   string[]                      → per-step colors (steps mode)
//   { from, to, direction? }      → linear-gradient shorthand (line only)
//   Record<string, string>        → gradient stops, e.g. { '0%': '#f00', '100%': '#0f0' }
type ProgressStrokeColor =
  | string
  | string[]
  | { from: string; to: string; direction?: string }
  | Record<string, string>

interface ProgressSuccessConfig {
  percent?:     number  // Success segment size (0-100)
  strokeColor?: string  // Success segment color (default: colorSuccess)
}

interface ProgressPercentPosition {
  type?:  'inner' | 'outer'           // default 'outer'
  align?: 'start' | 'center' | 'end'  // default 'end'
}

type ProgressSemanticSlot = 'root' | 'trail' | 'stroke' | 'text'
type ProgressClassNames   = SemanticClassNames<ProgressSemanticSlot>
type ProgressStyles       = SemanticStyles<ProgressSemanticSlot>
```

#### Status & Info

| Status | Color | Info shown |
|--------|-------|-----------|
| `normal` | primary | `"X%"` |
| `active` | primary + shimmer | `"X%"` |
| `success` | success | ✓ check icon |
| `exception` | error | × close icon |

- **Line** renders outline icons (`CheckCircleIcon` / `CloseCircleIcon`).
- **Circle / dashboard** renders minimal stroke icons (`CheckIcon` / `CloseIcon`).
- When `width ≤ 20` px the info text moves into a `Tooltip` instead of rendering inside the SVG.

#### Examples

**1. Basic line**
```tsx
<Progress percent={60} />
```

**2. Status variants**
```tsx
<Progress percent={60} status="active" />
<Progress percent={100} />           {/* auto → success */}
<Progress percent={40} status="exception" />
```

**3. Small size**
```tsx
<Progress percent={50} size="small" />
```

**4. Fixed width bar**
```tsx
<Progress percent={75} size={[300, 10]} />
```

**5. Custom stroke color**
```tsx
<Progress percent={70} strokeColor="#722ed1" />
```

**6. Gradient stroke**
```tsx
<Progress percent={80} strokeColor={{ from: '#108ee9', to: '#87d068' }} />
```

**7. Inner text position**
```tsx
<Progress
  percent={65}
  strokeWidth={20}
  percentPosition={{ type: 'inner', align: 'center' }}
/>
```

**8. Segmented steps**
```tsx
<Progress percent={60} steps={5} />
```

**9. Steps with per-step colors**
```tsx
<Progress
  percent={80}
  steps={5}
  strokeColor={['#f5222d', '#fa8c16', '#fadb14', '#52c41a', '#1677ff']}
/>
```

**10. Success segment overlay**
```tsx
<Progress percent={70} success={{ percent: 30 }} />
```

**11. Circle**
```tsx
<Progress type="circle" percent={75} />
```

**12. Circle with gradient stops**
```tsx
<Progress
  type="circle"
  percent={80}
  strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
/>
```

**13. Circle segmented**
```tsx
<Progress type="circle" percent={60} steps={6} width={100} />
```

**14. Dashboard**
```tsx
<Progress type="dashboard" percent={75} />
```

**15. Dashboard with custom gap**
```tsx
<Progress type="dashboard" percent={60} gapDegree={120} gapPosition="bottom" />
```

**16. Hide info text**
```tsx
<Progress percent={50} showInfo={false} />
```

**17. Custom formatter**
```tsx
<Progress
  percent={75}
  format={(pct) => <strong>{pct} / 100</strong>}
/>
```

**18. Semantic styles**
```tsx
<Progress
  percent={60}
  styles={{
    trail:  { backgroundColor: '#f0f0f0' },
    stroke: { background: '#722ed1' },
    text:   { color: '#722ed1', fontWeight: 700 },
  }}
/>
```

</details>

---

<details>
<summary><strong>QRCode</strong> - QR code generator component</summary>

### QRCode

A component that generates QR codes from any text or URL. Supports canvas and SVG rendering, embedded logos, four error correction levels, and status overlays (loading, expired, scanned) with full theme awareness.

#### Import

```tsx
import { QRCode } from '@juanitte/inoui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | **Required.** Text or URL to encode |
| `type` | `'canvas' \| 'svg'` | `'canvas'` | Render method |
| `icon` | `string` | — | URL of logo/image to embed at center |
| `size` | `number` | `160` | QR code size in pixels |
| `iconSize` | `number \| { width: number; height: number }` | `40` | Icon dimensions |
| `color` | `string` | `tokens.colorText` | Module (dot) color — supports CSS variables |
| `bgColor` | `string` | `'transparent'` | Background color |
| `marginSize` | `number` | `0` | Quiet zone in modules |
| `bordered` | `boolean` | `true` | Adds padding, border, and background |
| `errorLevel` | `'L' \| 'M' \| 'Q' \| 'H'` | `'M'` | Error correction level |
| `status` | `QRCodeStatus` | `'active'` | Current display status |
| `statusRender` | `(info: StatusRenderInfo) => ReactNode` | — | Custom status overlay renderer |
| `onRefresh` | `() => void` | — | Called when Refresh button is clicked (expired status) |
| `className` | `string` | — | Root CSS class |
| `style` | `CSSProperties` | — | Root inline style |
| `classNames` | `QRCodeClassNames` | — | Semantic class names per slot |
| `styles` | `QRCodeStyles` | — | Semantic inline styles per slot |

#### Type Definitions

```ts
type QRCodeType     = 'canvas' | 'svg'
type QRCodeStatus   = 'active' | 'expired' | 'loading' | 'scanned'
type QRCodeErrorLevel = 'L' | 'M' | 'Q' | 'H'

interface StatusRenderInfo {
  status: QRCodeStatus
  locale: { expired: string; loading: string; scanned: string }
  onRefresh?: () => void
}

type QRCodeSemanticSlot = 'root' | 'canvas' | 'mask'
type QRCodeClassNames   = SemanticClassNames<QRCodeSemanticSlot>
type QRCodeStyles       = SemanticStyles<QRCodeSemanticSlot>
```

#### Error Correction Levels

| Level | Data Recovery | Typical Use |
|-------|--------------|-------------|
| `'L'` | ~7% | Clean, controlled environments |
| `'M'` | ~15% | General use (default) |
| `'Q'` | ~25% | Slightly damaged surfaces |
| `'H'` | ~30% | Logo overlay, high-damage risk |

#### Semantic DOM

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<div>` | Outer wrapper (border, padding when `bordered`) |
| `canvas` | `<canvas>` or `<svg>` | The QR code render surface |
| `mask` | `<div>` | Status overlay (loading / expired / scanned) |

#### Examples

**1. Basic URL**

```tsx
<QRCode value="https://example.com" />
```

---

**2. SVG render mode**

```tsx
<QRCode value="https://example.com" type="svg" />
```

---

**3. Custom size**

```tsx
<QRCode value="https://example.com" size={200} />
```

---

**4. Custom colors**

```tsx
<QRCode
  value="https://example.com"
  color="#1677ff"
  bgColor="#f0f5ff"
/>
```

---

**5. With embedded logo**

Use `errorLevel="H"` when embedding a logo to ensure the QR remains readable even with the center covered.

```tsx
<QRCode
  value="https://example.com"
  icon="/logo.png"
  iconSize={40}
  errorLevel="H"
/>
```

---

**6. Icon with custom dimensions**

```tsx
<QRCode
  value="https://example.com"
  icon="/logo.png"
  iconSize={{ width: 60, height: 30 }}
  errorLevel="H"
/>
```

---

**7. Without border**

```tsx
<QRCode value="https://example.com" bordered={false} />
```

---

**8. Quiet zone (margin)**

```tsx
<QRCode value="https://example.com" marginSize={2} />
```

---

**9. Loading status**

```tsx
<QRCode value="https://example.com" status="loading" />
```

---

**10. Expired status with refresh**

```tsx
<QRCode
  value="https://example.com"
  status="expired"
  onRefresh={() => console.log('refresh!')}
/>
```

---

**11. Scanned status**

```tsx
<QRCode value="https://example.com" status="scanned" />
```

---

**12. Custom status overlay**

```tsx
<QRCode
  value="https://example.com"
  status="expired"
  statusRender={({ onRefresh }) => (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <p style={{ marginBottom: '0.5rem' }}>Session expired</p>
      <button onClick={onRefresh}>Regenerate</button>
    </div>
  )}
/>
```

---

**13. Semantic style customization**

```tsx
<QRCode
  value="https://example.com"
  styles={{
    root: { borderRadius: '1rem', padding: '1.5rem' },
    mask: { borderRadius: '1rem', backgroundColor: 'rgba(0,0,0,0.7)' },
  }}
/>
```

---

**14. Complete state flow in an app**

This example shows how to wire all four statuses together — useful for one-time payment QR codes, session tokens, or any time-limited code.

```tsx
import { useState, useEffect, useRef } from 'react'
import { QRCode } from '@juanitte/inoui'

const EXPIRY_SECONDS = 60          // QR valid for 60 s
const LOADING_DURATION_MS = 1500   // Simulate server round-trip

function PaymentQR() {
  type Status = 'active' | 'loading' | 'expired' | 'scanned'

  const [status, setStatus] = useState<Status>('active')
  const [qrValue, setQrValue] = useState(() => generateToken())
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /** Create a fresh signed token (call your API here) */
  function generateToken() {
    return `https://pay.example.com/checkout?token=${crypto.randomUUID()}`
  }

  /** Start expiry countdown */
  function startExpiry() {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setStatus('expired')
    }, EXPIRY_SECONDS * 1000)
  }

  /** User clicked Refresh — fetch a new token */
  function handleRefresh() {
    setStatus('loading')
    setTimeout(() => {
      setQrValue(generateToken())
      setStatus('active')
      startExpiry()
    }, LOADING_DURATION_MS)
  }

  /** Simulate a webhook / WebSocket that notifies when scanned */
  useEffect(() => {
    if (status !== 'active') return

    // Replace with a real WebSocket or polling call:
    // const ws = new WebSocket('wss://api.example.com/qr-events')
    // ws.onmessage = (e) => { if (JSON.parse(e.data).event === 'scanned') setStatus('scanned') }
    // return () => ws.close()

    // Demo: mark as scanned after 8 s
    const demo = setTimeout(() => setStatus('scanned'), 8000)
    return () => clearTimeout(demo)
  }, [status, qrValue])

  /** Start countdown on mount and after each refresh */
  useEffect(() => {
    if (status === 'active') startExpiry()
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [status, qrValue])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <QRCode
        value={qrValue}
        size={200}
        errorLevel="H"
        status={status}
        onRefresh={handleRefresh}
      />
      <p style={{ fontSize: '0.875rem', color: '#666' }}>
        {status === 'active'  && 'Scan to pay — expires in 60 s'}
        {status === 'loading' && 'Generating new code…'}
        {status === 'expired' && 'Code expired. Tap Refresh to get a new one.'}
        {status === 'scanned' && 'Payment received!'}
      </p>
    </div>
  )
}
```

**Status transition diagram**

```
         mount / refresh complete
               │
               ▼
           ┌────────┐   60 s timeout    ┌─────────┐
           │ active │ ────────────────► │ expired │
           └────────┘                   └────────-┘
               │                             │
      WebSocket │ scanned               User │ clicks Refresh
               ▼                             ▼
           ┌─────────┐              ┌─────────┐
           │ scanned │              │ loading │ ──► (fetch) ──► active
           └─────────┘              └─────────┘
```

</details>

---

<details>
<summary><strong>Radio</strong> - Single selection from options</summary>

### Radio

A radio button component for single selection. Includes Radio.Group for managing multiple radios and Radio.Button for button-style toggle options.

#### Import

```tsx
import { Radio } from '@juanitte/inoui'
```

#### Radio Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | — | Controlled checked state |
| `defaultChecked` | `boolean` | `false` | Initial checked state (uncontrolled) |
| `disabled` | `boolean` | `false` | Disable the radio |
| `autoFocus` | `boolean` | `false` | Auto-focus on mount |
| `value` | `string \| number` | — | Radio value (used by Radio.Group) |
| `onChange` | `(e: RadioChangeEvent) => void` | — | Change callback |
| `children` | `ReactNode` | — | Label content |
| `id` | `string` | — | HTML id attribute |
| `name` | `string` | — | HTML name attribute (for grouping) |
| `tabIndex` | `number` | — | Tab index |
| `classNames` | `SemanticClassNames<'root' \| 'radio' \| 'indicator' \| 'label'>` | — | Semantic class names |
| `styles` | `SemanticStyles<'root' \| 'radio' \| 'indicator' \| 'label'>` | — | Semantic inline styles |

#### Radio.Group Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| number` | — | Controlled selected value |
| `defaultValue` | `string \| number` | — | Initial selected value (uncontrolled) |
| `onChange` | `(e: RadioChangeEvent) => void` | — | Change callback |
| `disabled` | `boolean` | `false` | Disable all radios in group |
| `name` | `string` | — | HTML name attribute for all radios |
| `options` | `(string \| number \| RadioOptionType)[]` | — | Options array for auto-generation |
| `optionType` | `'default' \| 'button'` | `'default'` | Render as radio circles or buttons |
| `buttonStyle` | `'outline' \| 'solid'` | `'outline'` | Button style (when optionType is 'button') |
| `size` | `'small' \| 'middle' \| 'large'` | `'middle'` | Button size (when optionType is 'button') |
| `children` | `ReactNode` | — | Manual Radio/Radio.Button children |
| `classNames` | `SemanticClassNames<'root'>` | — | Semantic class names |
| `styles` | `SemanticStyles<'root'>` | — | Semantic inline styles |

#### RadioOptionType

| Property | Type | Description |
|----------|------|-------------|
| `label` | `ReactNode` | Display label |
| `value` | `string \| number` | Option value |
| `disabled` | `boolean` | Disable this option |
| `style` | `CSSProperties` | Inline style for this option |
| `className` | `string` | CSS class for this option |

#### RadioChangeEvent

| Property | Type | Description |
|----------|------|-------------|
| `target.checked` | `boolean` | Whether radio is checked |
| `target.value` | `string \| number` | Radio value |
| `nativeEvent` | `Event` | Native DOM event |

#### Button Size Configuration (Radio.Button)

| Size | Height | Font Size | Padding (H) |
|------|--------|-----------|-------------|
| `small` | 1.5rem (24px) | 0.75rem (12px) | 0.5rem |
| `middle` | 2rem (32px) | 0.875rem (14px) | 0.75rem |
| `large` | 2.5rem (40px) | 1rem (16px) | 1rem |

#### Button Styles

- **outline** - Border and text color change when selected (default)
- **solid** - Background fills when selected

#### Semantic DOM

##### Radio

| Slot | Description |
|------|-------------|
| `root` | Outer label element |
| `radio` | Radio circle container |
| `indicator` | Inner filled circle (when checked) |
| `label` | Label text container |

##### Radio.Group

| Slot | Description |
|------|-------------|
| `root` | Group container element |

#### Examples

```tsx
// Basic radio
<Radio>Option A</Radio>

// Controlled
const [value, setValue] = useState('a')
<Radio checked={value === 'a'} onChange={() => setValue('a')}>
  Option A
</Radio>

// Radio.Group (recommended for multiple radios)
const [value, setValue] = useState('a')
<Radio.Group value={value} onChange={(e) => setValue(e.target.value)}>
  <Radio value="a">Option A</Radio>
  <Radio value="b">Option B</Radio>
  <Radio value="c">Option C</Radio>
</Radio.Group>

// Radio.Group with options array
<Radio.Group
  options={['Apple', 'Banana', 'Orange']}
  defaultValue="Apple"
/>

// Options with custom labels and values
<Radio.Group
  options={[
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3 (disabled)', value: 3, disabled: true },
  ]}
  defaultValue={1}
/>

// Radio.Button (button-style radios)
<Radio.Group optionType="button" defaultValue="a">
  <Radio.Button value="a">Option A</Radio.Button>
  <Radio.Button value="b">Option B</Radio.Button>
  <Radio.Button value="c">Option C</Radio.Button>
</Radio.Group>

// Button with options array
<Radio.Group
  optionType="button"
  options={['React', 'Vue', 'Angular']}
  defaultValue="React"
/>

// Solid button style
<Radio.Group
  optionType="button"
  buttonStyle="solid"
  defaultValue="a"
  options={[
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c' },
  ]}
/>

// Button sizes
<Radio.Group optionType="button" size="small" options={['S', 'M', 'L']} />
<Radio.Group optionType="button" size="middle" options={['S', 'M', 'L']} />
<Radio.Group optionType="button" size="large" options={['S', 'M', 'L']} />

// Disabled group
<Radio.Group disabled options={['A', 'B', 'C']} defaultValue="A" />

// Disabled individual option
<Radio.Group defaultValue="a">
  <Radio value="a">Enabled</Radio>
  <Radio value="b" disabled>Disabled</Radio>
  <Radio value="c">Enabled</Radio>
</Radio.Group>

// With name attribute (for form submission)
<Radio.Group name="preference" defaultValue="option1">
  <Radio value="option1">Option 1</Radio>
  <Radio value="option2">Option 2</Radio>
</Radio.Group>

// Vertical layout (using Flex or Space)
<Flex vertical>
  <Radio.Group defaultValue="a">
    <Radio value="a">Option A</Radio>
    <Radio value="b">Option B</Radio>
    <Radio value="c">Option C</Radio>
  </Radio.Group>
</Flex>

// onChange callback
<Radio.Group
  onChange={(e) => {
    console.log('Selected:', e.target.value)
    console.log('Checked:', e.target.checked)
  }}
  options={['A', 'B', 'C']}
/>

// Semantic styling (Radio)
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
  Custom Styled
</Radio>

// Semantic styling (Radio.Group)
<Radio.Group
  classNames={{ root: 'custom-group' }}
  styles={{ root: { gap: '1rem' } }}
  options={['A', 'B', 'C']}
/>
```

</details>

---

<details>
<summary><strong>Rate</strong> - Star rating component with half-star support</summary>

### Rate

A star rating component for collecting user feedback. Supports customizable star count, half-star selection, tooltips, keyboard navigation, and custom characters.

#### Import

```tsx
import { Rate } from '@juanitte/inoui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `allowClear` | `boolean` | `true` | Allow clearing by clicking the same value again |
| `allowHalf` | `boolean` | `false` | Allow half-star selection |
| `autoFocus` | `boolean` | `false` | Auto focus on mount |
| `character` | `ReactNode \| ((index: number) => ReactNode)` | Star SVG | Custom character to render for each star |
| `count` | `number` | `5` | Total number of stars |
| `defaultValue` | `number` | `0` | Default value for uncontrolled mode |
| `disabled` | `boolean` | `false` | Disable interaction (read-only display) |
| `size` | `'small' \| 'middle' \| 'large'` | `'middle'` | Size of the stars |
| `tooltips` | `string[]` | - | Tooltip text for each star (array index corresponds to star index) |
| `value` | `number` | - | Current value (controlled mode) |
| `style` | `CSSProperties` | - | Root inline styles |
| `className` | `string` | - | Root CSS class |
| `classNames` | `RateClassNames` | - | Semantic slot classes |
| `styles` | `RateStyles` | - | Semantic slot styles |
| `onBlur` | `() => void` | - | Blur callback |
| `onChange` | `(value: number) => void` | - | Value change callback |
| `onFocus` | `() => void` | - | Focus callback |
| `onHoverChange` | `(value: number) => void` | - | Hover value change callback (called with `0` on mouse leave) |
| `onKeyDown` | `(event: KeyboardEvent) => void` | - | Keydown callback |

#### RateRef

| Method | Description |
|--------|-------------|
| `focus()` | Focus the rate component |
| `blur()` | Blur the rate component |

#### Size Configuration

| Size | Font Size | Gap |
|------|-----------|-----|
| `small` | 0.875rem (14px) | 0.25rem (4px) |
| `middle` | 1.25rem (20px) | 0.5rem (8px) |
| `large` | 2rem (32px) | 0.625rem (10px) |

#### Semantic DOM

| Slot | Description |
|------|-------------|
| `root` | The container element with `role="radiogroup"` |
| `star` | Each star wrapper (multiple elements) |
| `character` | The character element inside each star (both background and foreground layers) |

#### Examples

**Basic usage:**
```tsx
const [value, setValue] = useState(0)

<Rate value={value} onChange={setValue} />
```

**Half-star support:**
```tsx
<Rate allowHalf defaultValue={2.5} />
```

**Custom star count:**
```tsx
<Rate count={10} defaultValue={7} />
```

**Sizes:**
```tsx
<Rate size="small" defaultValue={3} />
<Rate size="middle" defaultValue={3} />
<Rate size="large" defaultValue={3} />
```

**With tooltips:**
```tsx
<Rate
  tooltips={['Terrible', 'Bad', 'Normal', 'Good', 'Excellent']}
  defaultValue={3}
/>
```

**Custom character:**
```tsx
<Rate character="❤️" defaultValue={3} />

// Or dynamic character per star
<Rate
  character={(index) => index + 1} // Shows numbers 1-5
  defaultValue={3}
/>
```

**Disabled (read-only):**
```tsx
<Rate disabled value={3.5} allowHalf />
```

**Keyboard navigation:**
Rate component supports keyboard navigation when focused:
- Arrow Right / Arrow Up: Increase rating by 1 (or 0.5 if `allowHalf` is enabled)
- Arrow Left / Arrow Down: Decrease rating by 1 (or 0.5 if `allowHalf` is enabled)

**Controlled with clear prevention:**
```tsx
const [value, setValue] = useState(4)

<Rate
  value={value}
  onChange={setValue}
  allowClear={false} // Prevent clearing once set
/>
```

**Custom styling:**
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
<summary><strong>Result</strong> - Full-page feedback state display</summary>

### Result

`Result` displays a centred feedback screen for operation outcomes. It supports four semantic statuses (`success`, `error`, `warning`, `info`) with matching SVG icons, three HTTP-error statuses (`403`, `404`, `500`) with illustrated scenes, an optional title, subtitle, action area, and extra content panel.

```tsx
import { Result } from '@juanitte/inoui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `ResultStatus` | `'info'` | Visual preset — semantic or HTTP error code |
| `icon` | `ReactNode` | — | Custom icon/illustration. Overrides the status icon |
| `title` | `ReactNode` | — | Large heading text |
| `subTitle` | `ReactNode` | — | Smaller descriptive text below the title |
| `extra` | `ReactNode` | — | Action area (buttons, links). Rendered as a centred flex row |
| `children` | `ReactNode` | — | Additional content rendered below `extra` in a left-aligned panel with a subtle background |
| `className` | `string` | — | CSS class on the root element |
| `style` | `CSSProperties` | — | Inline style on the root element |
| `classNames` | `ResultClassNames` | — | Semantic class names per slot |
| `styles` | `ResultStyles` | — | Semantic inline styles per slot |

#### Types

```ts
// Semantic statuses use a coloured SVG icon:
//   'success' → colorSuccess  ✓ filled circle
//   'error'   → colorError    × filled circle
//   'warning' → colorWarning  ⚠ filled triangle
//   'info'    → colorPrimary  ℹ filled circle  (default)
//
// HTTP error statuses render an illustrated SVG scene:
//   403 → colorWarning  shield + padlock (forbidden)
//   404 → colorPrimary  torn page + magnifying glass (not found)
//   500 → colorError    server rack + warning triangle (server error)
type ResultStatus = 'success' | 'error' | 'info' | 'warning' | 403 | 404 | 500

type ResultSemanticSlot = 'root' | 'icon' | 'title' | 'subtitle' | 'extra' | 'content'
type ResultClassNames   = SemanticClassNames<ResultSemanticSlot>
type ResultStyles       = SemanticStyles<ResultSemanticSlot>
```

#### Layout

The root is centred (`text-align: center`, `padding: 3rem 2rem`). Slots render top-to-bottom:

1. **icon** — semantic icons at `4.5rem` font-size; HTTP illustrations at natural SVG size (250 × 200)
2. **title** — `1.5rem`, weight 600
3. **subtitle** — `0.875rem`, muted colour
4. **extra** — centred flex row with `0.5rem` gap
5. **content** (children) — left-aligned block with subtle background, `1.5rem` padding, rounded corners

#### Examples

**1. Success**
```tsx
<Result
  status="success"
  title="Payment complete"
  subTitle="Order #20250304 has been processed."
  extra={<Button>View order</Button>}
/>
```

**2. Error**
```tsx
<Result
  status="error"
  title="Submission failed"
  subTitle="Please check the form and try again."
  extra={<Button>Go back</Button>}
/>
```

**3. Warning**
```tsx
<Result
  status="warning"
  title="Pending approval"
  subTitle="Your request is awaiting review."
/>
```

**4. Info (default)**
```tsx
<Result
  title="Coming soon"
  subTitle="This feature is under construction."
/>
```

**5. 403 — Forbidden**
```tsx
<Result
  status={403}
  title="403"
  subTitle="You do not have permission to access this page."
  extra={<Button onClick={() => navigate('/')}>Back home</Button>}
/>
```

**6. 404 — Not found**
```tsx
<Result
  status={404}
  title="404"
  subTitle="The page you visited does not exist."
  extra={<Button onClick={() => navigate('/')}>Back home</Button>}
/>
```

**7. 500 — Server error**
```tsx
<Result
  status={500}
  title="500"
  subTitle="Sorry, something went wrong on our end."
  extra={<Button onClick={() => window.location.reload()}>Retry</Button>}
/>
```

**8. Custom icon**
```tsx
<Result
  icon={<span style={{ fontSize: '4rem' }}>🎉</span>}
  title="You're all set!"
  subTitle="Your account is ready to use."
  extra={<Button>Get started</Button>}
/>
```

**9. With extra content panel**
```tsx
<Result
  status="error"
  title="Upload failed"
  subTitle="The following files could not be processed:"
  extra={<Button>Try again</Button>}
>
  <ul>
    <li>photo.heic — unsupported format</li>
    <li>report.exe — blocked file type</li>
  </ul>
</Result>
```

**10. Semantic styles**
```tsx
<Result
  status="success"
  title="Done!"
  styles={{
    root:     { padding: '2rem' },
    title:    { color: '#52c41a', fontSize: '2rem' },
    subtitle: { fontSize: '1rem' },
    extra:    { marginTop: '2rem' },
  }}
/>
```

</details>

---

<details>
<summary><strong>Select</strong> - Dropdown selection component with search, tags, and virtual scrolling</summary>

### Select

A powerful dropdown select component supporting single selection, multiple selection, tags mode, search/filter, virtual scrolling for large datasets, option groups, and extensive customization.

#### Import

```tsx
import { Select } from '@juanitte/inoui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `(SelectOption \| SelectOptionGroup)[]` | `[]` | Array of options or option groups |
| `fieldNames` | `SelectFieldNames` | `{ label: 'label', value: 'value', options: 'options' }` | Custom field names for option properties |
| `value` | `string \| number \| (string \| number)[]` | - | Current value (controlled) |
| `defaultValue` | `string \| number \| (string \| number)[]` | - | Default value (uncontrolled) |
| `mode` | `'multiple' \| 'tags'` | - | Selection mode: `multiple` for multi-select, `tags` for free-form tag creation |
| `labelInValue` | `boolean` | `false` | Whether to return `{ value, label }` objects in onChange instead of just values |
| `placeholder` | `string` | `'Select...'` | Placeholder text |
| `showSearch` | `boolean` | - | Enable search/filter (auto-enabled in tags mode) |
| `size` | `'large' \| 'middle' \| 'small'` | `'middle'` | Size of the select input |
| `variant` | `'outlined' \| 'filled' \| 'borderless'` | `'outlined'` | Visual style variant |
| `status` | `'error' \| 'warning'` | - | Validation status |
| `placement` | `'bottomLeft' \| 'bottomRight' \| 'topLeft' \| 'topRight'` | `'bottomLeft'` | Initial dropdown placement (auto-flips if overflows) |
| `allowClear` | `boolean` | `false` | Show clear button to reset selection |
| `disabled` | `boolean` | `false` | Disable the select |
| `loading` | `boolean` | `false` | Show loading indicator |
| `autoFocus` | `boolean` | `false` | Auto focus on mount |
| `virtual` | `boolean` | `true` | Enable virtual scrolling for large lists (threshold: 32 items) |
| `popupMatchSelectWidth` | `boolean \| number` | `true` | Match dropdown width to select, or set custom width in pixels |
| `maxTagCount` | `number` | - | Maximum number of tags to show in multiple mode (rest shown in `+N`) |
| `maxTagPlaceholder` | `ReactNode \| ((omitted: (string \| number)[]) => ReactNode)` | `+N` | Custom placeholder for omitted tags |
| `maxCount` | `number` | - | Maximum number of items that can be selected in multiple mode |
| `defaultActiveFirstOption` | `boolean` | `true` | Auto-highlight first option on dropdown open |
| `optionFilterProp` | `string` | - | Property name to filter on (uses searchable text by default) |
| `filterOption` | `boolean \| ((input: string, option: SelectOption) => boolean)` | `true` | Filter function or `false` to disable filtering |
| `filterSort` | `(a: SelectOption, b: SelectOption) => number` | - | Sort filtered options |
| `tokenSeparators` | `string[]` | - | Characters that trigger tag creation in tags mode (e.g., `[',', ' ']`) |
| `open` | `boolean` | - | Control dropdown visibility (controlled) |
| `dropdownRender` | `(menu: ReactNode) => ReactNode` | - | Customize dropdown content (wrap the menu) |
| `tagRender` | `(props: SelectTagRenderProps) => ReactNode` | - | Custom tag renderer in multiple mode |
| `labelRender` | `(props: SelectLabelRenderProps) => ReactNode` | - | Custom label renderer for selected value |
| `notFoundContent` | `ReactNode` | `'No data'` | Content shown when no options match (set to `null` to hide) |
| `suffix` | `ReactNode` | Chevron icon | Custom suffix icon (replaces chevron) |
| `removeIcon` | `ReactNode` | Close icon | Custom icon for removing tags |
| `clearIcon` | `ReactNode` | Clear icon | Custom icon for clear button |
| `prefix` | `ReactNode` | - | Prefix element inside the select |
| `optionRender` | `(option: SelectOption, info: { index: number }) => ReactNode` | - | Custom option renderer |
| `onChange` | `(value: any, option: any) => void` | - | Callback when value changes |
| `onSelect` | `(value: string \| number, option: SelectOption) => void` | - | Callback when an option is selected |
| `onDeselect` | `(value: string \| number, option: SelectOption) => void` | - | Callback when an option is deselected (multiple mode) |
| `onSearch` | `(value: string) => void` | - | Callback when search input changes |
| `onClear` | `() => void` | - | Callback when clear button is clicked |
| `onFocus` | `() => void` | - | Focus callback |
| `onBlur` | `() => void` | - | Blur callback |
| `onDropdownVisibleChange` | `(open: boolean) => void` | - | Callback when dropdown visibility changes |
| `onKeyDown` | `(e: KeyboardEvent) => void` | - | Keydown callback |
| `className` | `string` | - | Root CSS class |
| `style` | `CSSProperties` | - | Root inline styles |
| `classNames` | `SelectClassNames` | - | Semantic slot classes |
| `styles` | `SelectStyles` | - | Semantic slot styles |

#### SelectOption

```typescript
interface SelectOption {
  value: string | number
  label?: ReactNode
  disabled?: boolean
  title?: string // Used for search if provided
  [key: string]: unknown // Additional custom fields
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
  label?: string    // Default: 'label'
  value?: string    // Default: 'value'
  options?: string  // Default: 'options' (for groups)
}
```

#### Size Configuration

| Size | Height | Font Size |
|------|--------|-----------|
| `large` | 2.5rem (40px) | 1rem (16px) |
| `middle` | 2.25rem (36px) | 0.875rem (14px) |
| `small` | 1.75rem (28px) | 0.875rem (14px) |

#### Semantic DOM

| Slot | Description |
|------|-------------|
| `root` | The outermost container |
| `selector` | The clickable select box with selected value(s) |
| `search` | The search input element (when `showSearch` is enabled) |
| `dropdown` | The dropdown menu container |
| `option` | Each option element in the dropdown (multiple elements) |
| `tag` | Each tag element in multiple mode (multiple elements) |

#### Examples

**Basic usage:**
```tsx
const [value, setValue] = useState('apple')

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
]

<Select options={options} value={value} onChange={setValue} />
```

**With search:**
```tsx
<Select
  options={options}
  showSearch
  placeholder="Search and select..."
  onChange={setValue}
/>
```

**Multiple selection:**
```tsx
const [values, setValues] = useState<string[]>([])

<Select
  mode="multiple"
  options={options}
  value={values}
  onChange={setValues}
  placeholder="Select multiple items"
  maxTagCount={3}
/>
```

**Tags mode (create custom tags):**
```tsx
<Select
  mode="tags"
  value={tags}
  onChange={setTags}
  placeholder="Type and press Enter to create tags"
  tokenSeparators={[',', ' ']}
/>
```

**Option groups:**
```tsx
const groupedOptions = [
  {
    label: 'Fruits',
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
    ],
  },
  {
    label: 'Vegetables',
    options: [
      { value: 'carrot', label: 'Carrot' },
      { value: 'potato', label: 'Potato' },
    ],
  },
]

<Select options={groupedOptions} />
```

**Sizes and variants:**
```tsx
<Select size="small" variant="outlined" options={options} />
<Select size="middle" variant="filled" options={options} />
<Select size="large" variant="borderless" options={options} />
```

**With status:**
```tsx
<Select status="error" options={options} />
<Select status="warning" options={options} />
```

**Custom field names:**
```tsx
const customOptions = [
  { id: 1, name: 'Option 1' },
  { id: 2, name: 'Option 2' },
]

<Select
  options={customOptions}
  fieldNames={{ label: 'name', value: 'id' }}
  onChange={(value) => console.log(value)}
/>
```

**labelInValue mode:**
```tsx
<Select
  options={options}
  labelInValue
  onChange={(obj) => console.log(obj.value, obj.label)}
/>
```

**Virtual scrolling:**
Virtual scrolling is enabled by default for lists with more than 32 items. It significantly improves performance with large datasets.

```tsx
const largeOptions = Array.from({ length: 1000 }, (_, i) => ({
  value: i,
  label: `Option ${i + 1}`,
}))

<Select
  options={largeOptions}
  virtual // true by default
  showSearch
/>
```

**Custom dropdown render:**
```tsx
<Select
  options={options}
  dropdownRender={(menu) => (
    <>
      {menu}
      <div style={{ padding: '0.5rem', borderTop: '1px solid #ddd' }}>
        <button onClick={handleAddNew}>+ Add New Item</button>
      </div>
    </>
  )}
/>
```

**Custom option render:**
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

**Keyboard navigation:**
- Arrow Down: Open dropdown / Navigate down
- Arrow Up: Navigate up
- Enter: Select highlighted option / Create tag (in tags mode)
- Escape: Close dropdown
- Backspace: Remove last tag (in multiple mode when search is empty)

**Loading state:**
```tsx
<Select loading options={options} placeholder="Loading..." />
```

**Max count (limit selections):**
```tsx
<Select
  mode="multiple"
  maxCount={3}
  options={options}
  placeholder="Select up to 3 items"
/>
```

</details>

---

<details>
<summary><strong>Slider</strong> - Range slider with tooltips, marks, and editable handles</summary>

### Slider

A versatile range slider component supporting single values, multi-handle ranges, editable ranges (add/remove handles dynamically), marks with custom labels, draggable tracks, vertical/horizontal orientation, and keyboard navigation.

#### Import

```tsx
import { Slider } from '@juanitte/inoui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultValue` | `number \| number[]` | `min` or `[min, min]` | Default value (uncontrolled) |
| `value` | `number \| number[]` | - | Current value (controlled) |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number \| null` | `1` | Step size (`null` means snap to marks only) |
| `marks` | `SliderMarks` | - | Mark labels at specific values (Record<number, label>) |
| `dots` | `boolean` | `false` | Show dots at each step position |
| `included` | `boolean` | `true` | Highlight track between handles (or from min to handle in single mode) |
| `range` | `boolean \| SliderRangeConfig` | `false` | Enable range mode with multiple handles |
| `vertical` | `boolean` | `false` | Vertical orientation |
| `reverse` | `boolean` | `false` | Reverse the direction (right-to-left or bottom-to-top) |
| `disabled` | `boolean` | `false` | Disable interaction |
| `keyboard` | `boolean` | `true` | Enable keyboard navigation |
| `tooltip` | `SliderTooltipConfig` | - | Tooltip configuration (placement, formatter, visibility) |
| `draggableTrack` | `boolean` | `false` | Allow dragging the entire track to move all handles together (range mode only) |
| `onChange` | `(value: number \| number[]) => void` | - | Callback on value change (fires during drag) |
| `onChangeComplete` | `(value: number \| number[]) => void` | - | Callback when drag completes or keyboard adjustment finishes |
| `style` | `CSSProperties` | - | Root inline styles |
| `className` | `string` | - | Root CSS class |
| `classNames` | `SliderClassNames` | - | Semantic slot classes |
| `styles` | `SliderStyles` | - | Semantic slot styles |

#### SliderRangeConfig

```typescript
interface SliderRangeConfig {
  editable?: boolean          // Allow adding/removing handles dynamically
  minCount?: number           // Minimum number of handles (default: editable ? 1 : 2)
  maxCount?: number           // Maximum number of handles (default: Infinity)
  draggableTrack?: boolean    // Allow dragging the entire track
}
```

#### SliderTooltipConfig

```typescript
interface SliderTooltipConfig {
  open?: boolean                              // Force show (true) or hide (false) tooltips
  placement?: 'top' | 'bottom' | 'left' | 'right'  // Tooltip placement (default: 'top' for horizontal, 'right' for vertical)
  formatter?: ((value: number) => ReactNode) | null  // Custom formatter (null to hide tooltips)
}
```

#### SliderMarks

```typescript
type SliderMarkLabel = ReactNode | { style?: CSSProperties; label: ReactNode }
type SliderMarks = Record<number, SliderMarkLabel>

// Example:
const marks = {
  0: 'Min',
  50: { label: '50%', style: { color: 'blue' } },
  100: 'Max',
}
```

#### SliderRef

| Method | Description |
|--------|-------------|
| `focus()` | Focus the slider (enables keyboard navigation) |
| `blur()` | Blur the slider |

#### Semantic DOM

| Slot | Description |
|------|-------------|
| `root` | The outermost container with keyboard event handling |
| `rail` | The background track (full slider length) |
| `track` | The highlighted track segment(s) between handles (multiple elements in range mode) |
| `handle` | The draggable handle(s) (multiple elements in range mode) |
| `mark` | Mark labels at specific positions (multiple elements) |
| `dot` | Small dots at step/mark positions (multiple elements) |
| `tooltip` | Tooltip shown on hover/drag for each handle (multiple elements) |

#### Examples

**Basic usage:**
```tsx
const [value, setValue] = useState(30)

<Slider value={value} onChange={setValue} />
```

**Range mode (two handles):**
```tsx
const [range, setRange] = useState([20, 60])

<Slider range value={range} onChange={setRange} />
```

**With marks:**
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

**With custom mark styles:**
```tsx
<Slider
  marks={{
    0: 'Min',
    50: {
      label: '⭐ Recommended',
      style: { color: '#faad14', fontWeight: 600 }
    },
    100: 'Max',
  }}
/>
```

**With dots:**
```tsx
<Slider defaultValue={30} step={10} dots />
```

**Step null (snap to marks only):**
```tsx
<Slider
  defaultValue={25}
  step={null}
  marks={{ 0: '0', 25: '25', 50: '50', 75: '75', 100: '100' }}
/>
```

**Editable range (add/remove handles):**
```tsx
<Slider
  range={{ editable: true, minCount: 1, maxCount: 5 }}
  defaultValue={[20, 50, 80]}
/>
```

To use editable range:
- **Add handles:** Click anywhere on the rail
- **Remove handles:** Drag a handle far away (60px) from the rail, or press Delete/Backspace when focused
- **Keyboard:** Tab to switch between handles, Delete/Backspace to remove active handle

**Draggable track:**
```tsx
<Slider
  range
  defaultValue={[20, 60]}
  draggableTrack
/>
```

Click and drag the highlighted track to move both handles together.

**Vertical slider:**
```tsx
<div style={{ height: '300px' }}>
  <Slider vertical defaultValue={50} />
</div>
```

**Reverse direction:**
```tsx
<Slider reverse defaultValue={30} />
```

**Disabled:**
```tsx
<Slider disabled value={50} />
```

**Custom tooltip:**
```tsx
<Slider
  defaultValue={30}
  tooltip={{
    open: true,  // Always visible
    placement: 'bottom',
    formatter: (value) => `${value}%`,
  }}
/>
```

**Hide tooltip:**
```tsx
<Slider
  defaultValue={50}
  tooltip={{ formatter: null }}
/>
```

**Keyboard navigation:**
Slider supports full keyboard navigation when focused:
- **Arrow Right / Arrow Up:** Increase value by step (respects `reverse`)
- **Arrow Left / Arrow Down:** Decrease value by step (respects `reverse`)
- **Home:** Jump to minimum value
- **End:** Jump to maximum value
- **Tab / Shift+Tab:** Switch between handles (in range mode)
- **Delete / Backspace:** Remove active handle (in editable range mode)

**Custom styling:**
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

**Included vs not included:**
```tsx
// Included (default): highlights track from min to handle
<Slider defaultValue={30} included />

// Not included: no track highlight
<Slider defaultValue={30} included={false} />

// Range with included: highlights between handles
<Slider range defaultValue={[20, 60]} included />
```

**Controlled with change complete:**
```tsx
const [value, setValue] = useState(50)

<Slider
  value={value}
  onChange={(v) => console.log('Changing:', v)}  // Fires during drag
  onChangeComplete={(v) => {
    console.log('Final:', v)  // Fires when drag completes
    setValue(v)
  }}
/>
```

</details>

---

<details>
<summary><strong>Space</strong> - Spacing and compact grouping for inline elements</summary>

### Space

A component for setting spacing between inline elements. Supports horizontal/vertical direction, custom sizes, split separators, and a `Space.Compact` subcomponent for grouping elements without gaps.

#### Import

```tsx
import { Space } from '@juanitte/inoui'
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
<summary><strong>Spinner</strong> - Loading indicator with 7 animation styles</summary>

### Spinner

`Spinner` is a flexible loading indicator with seven animation variants, three sizes, optional tip text, delay support, progress mode, fullscreen overlay, and content-wrapping mode. It operates in three rendering modes depending on whether children and `fullscreen` are provided.

```tsx
import { Spinner } from '@juanitte/inoui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `spinning` | `boolean` | `true` | Whether the spinner is active |
| `type` | `SpinnerType` | `'gradient'` | Animation style |
| `size` | `SpinnerSize` | `'default'` | Spinner size |
| `delay` | `number` | — | Milliseconds to wait before showing (avoids flicker on fast operations) |
| `indicator` | `ReactNode` | — | Fully custom indicator element. Replaces the `type` animation |
| `tip` | `ReactNode` | — | Text shown below the spinner. For the `pulse` type it becomes the pulsing text itself (defaults to `'Loading...'`) |
| `fullscreen` | `boolean` | `false` | Cover the entire viewport with a dark overlay |
| `percent` | `number \| 'auto'` | — | Switch to progress-circle mode. `'auto'` = indeterminate arc; `0–100` = deterministic fill (turns green at 100) |
| `children` | `ReactNode` | — | Content to overlay while loading |
| `className` | `string` | — | CSS class on the root element |
| `style` | `CSSProperties` | — | Inline style on the root element |
| `classNames` | `SpinnerClassNames` | — | Semantic class names per slot |
| `styles` | `SpinnerStyles` | — | Semantic inline styles per slot |

#### Types

```ts
// 7 animation styles:
//   'gradient' — rotating conic-gradient comet arc (default)
//   'ring'     — rotating SVG ring with 25 % visible arc
//   'classic'  — 4 orbiting corner dots (Ant Design style)
//   'dots'     — 3 bouncing dots in a row
//   'bars'     — 8 iOS-style radiating bars with fade
//   'pulse'    — pulsing text (tip prop or "Loading..."); no separate tip shown
//   'dash'     — Material-style morphing SVG dash
type SpinnerType = 'gradient' | 'ring' | 'classic' | 'dots' | 'bars' | 'pulse' | 'dash'

// Sizes:
//   'small'   — 1 rem  (16 px) indicator, 0.75 rem tip
//   'default' — 1.5 rem (24 px) indicator, 0.875 rem tip
//   'large'   — 2.5 rem (40 px) indicator, 1 rem tip
type SpinnerSize = 'small' | 'default' | 'large'

type SpinnerSemanticSlot = 'root' | 'indicator' | 'tip' | 'overlay' | 'content'
type SpinnerClassNames   = SemanticClassNames<SpinnerSemanticSlot>
type SpinnerStyles       = SemanticStyles<SpinnerSemanticSlot>
```

#### Rendering modes

| Condition | Mode | Behaviour |
|-----------|------|-----------|
| No `children`, no `fullscreen` | **Standalone** | Renders an `inline-flex` spinner; hidden when `spinning` is false |
| Has `children` | **Container** | Wraps children; when spinning, applies `opacity 0.5` + `blur(1px)` + disables pointer events; spinner centred in an absolute overlay |
| `fullscreen={true}` | **Fullscreen** | Fixed `inset-0` dark overlay (`rgba(0,0,0,0.45)`) with spinner centred; hidden when `spinning` is false |

#### Examples

**1. Standalone**
```tsx
<Spinner />
```

**2. Animation types**
```tsx
<Spinner type="gradient" />
<Spinner type="ring" />
<Spinner type="classic" />
<Spinner type="dots" />
<Spinner type="bars" />
<Spinner type="pulse" />
<Spinner type="dash" />
```

**3. Sizes**
```tsx
<Spinner size="small" />
<Spinner size="default" />
<Spinner size="large" />
```

**4. With tip text**
```tsx
<Spinner tip="Loading data…" />
```

**5. Pulse with custom text**
```tsx
<Spinner type="pulse" tip="Please wait…" />
```

**6. Delay (avoids flicker)**
```tsx
<Spinner delay={500} />
```

**7. Controlled visibility**
```tsx
<Spinner spinning={isLoading} />
```

**8. Progress circle — determinate**
```tsx
<Spinner percent={65} />
```

**9. Progress circle — indeterminate**
```tsx
<Spinner percent="auto" />
```

**10. Content overlay**
```tsx
<Spinner spinning={isLoading} tip="Saving…">
  <form>…</form>
</Spinner>
```

**11. Fullscreen overlay**
```tsx
<Spinner fullscreen spinning={isSubmitting} tip="Submitting…" />
```

**12. Custom indicator**
```tsx
<Spinner indicator={<img src="/logo.gif" width={32} />} tip="Brewing…" />
```

**13. Semantic styles**
```tsx
<Spinner
  tip="Loading…"
  styles={{
    indicator: { gap: '0.75rem' },
    tip:       { color: '#722ed1', fontWeight: 600 },
  }}
/>
```

</details>

---

<details>
<summary><strong>Splitter</strong> - Resizable split panels</summary>

### Splitter

A component for creating resizable split panels. Supports horizontal/vertical orientation, collapsible panels, min/max constraints, controlled sizes, and lazy resize mode.

#### Import

```tsx
import { Splitter } from '@juanitte/inoui'
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
import { Steps } from '@juanitte/inoui'
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
<summary><strong>Statistic</strong> - Formatted numeric display and live countdown timer</summary>

### Statistic

A display component for formatted numbers, metrics, and KPIs. Includes `Statistic.Countdown` for live countdown timers with a flexible format string. Both variants share the same semantic slots and styling API.

#### Import

```tsx
import { Statistic } from '@juanitte/inoui'
```

#### Props — `Statistic`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | — | Label rendered above the value |
| `value` | `string \| number` | `0` | Numeric or string value to display |
| `precision` | `number` | — | Number of decimal places |
| `decimalSeparator` | `string` | `'.'` | Character used to separate the decimal part |
| `groupSeparator` | `string` | `','` | Character used to group thousands |
| `prefix` | `ReactNode` | — | Content rendered before the value |
| `suffix` | `ReactNode` | — | Content rendered after the value |
| `formatter` | `(value: string \| number) => ReactNode` | — | Custom formatter — overrides built-in number formatting |
| `loading` | `boolean` | `false` | Show an animated placeholder instead of the value |
| `loadingWidth` | `string` | `'7rem'` | Width of the loading placeholder |
| `className` | `string` | — | Root CSS class |
| `style` | `CSSProperties` | — | Root inline style |
| `classNames` | `StatisticClassNames` | — | Semantic class names per slot |
| `styles` | `StatisticStyles` | — | Semantic inline styles per slot |

#### Props — `Statistic.Countdown`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | — | **Required.** Target timestamp in milliseconds (`Date.now()` based) |
| `title` | `ReactNode` | — | Label rendered above the countdown |
| `format` | `string` | `'HH:mm:ss'` | Display format string (see tokens below) |
| `prefix` | `ReactNode` | — | Content rendered before the countdown |
| `suffix` | `ReactNode` | — | Content rendered after the countdown |
| `onFinish` | `() => void` | — | Called once when the countdown reaches zero |
| `onChange` | `(value: number) => void` | — | Called on every tick with remaining milliseconds |
| `className` | `string` | — | Root CSS class |
| `style` | `CSSProperties` | — | Root inline style |
| `classNames` | `CountdownClassNames` | — | Semantic class names per slot |
| `styles` | `CountdownStyles` | — | Semantic inline styles per slot |

#### Countdown Format Tokens

| Token | Output | Example |
|-------|--------|---------|
| `D` | Days (no padding) | `3` |
| `DD` | Days (zero-padded to 2) | `03` |
| `H` | Hours (no padding) | `9` |
| `HH` | Hours (zero-padded to 2) | `09` |
| `m` | Minutes (no padding) | `5` |
| `mm` | Minutes (zero-padded to 2) | `05` |
| `s` | Seconds (no padding) | `4` |
| `ss` | Seconds (zero-padded to 2) | `04` |
| `SSS` | Milliseconds (3 digits) | `347` |
| `[text]` | Literal string (escaped) | `[days]` → `days` |
| `[singular\|plural]` | Inflected literal based on preceding number | `[day\|days]` |

> When `SSS` is included in the format, the timer ticks at ~30 fps (33 ms interval) instead of 1 s for smooth millisecond display.

#### Type Definitions

```ts
type StatisticSemanticSlot = 'root' | 'title' | 'content' | 'prefix' | 'suffix'
type StatisticClassNames   = SemanticClassNames<StatisticSemanticSlot>
type StatisticStyles       = SemanticStyles<StatisticSemanticSlot>

// Countdown shares the same slot types:
type CountdownSemanticSlot = StatisticSemanticSlot
type CountdownClassNames   = SemanticClassNames<CountdownSemanticSlot>
type CountdownStyles       = SemanticStyles<CountdownSemanticSlot>
```

#### Semantic DOM

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<div>` | Outer wrapper |
| `title` | `<div>` | Label above the value |
| `content` | `<div>` | Row containing prefix + value + suffix |
| `prefix` | `<span>` | Content before the value |
| `suffix` | `<span>` | Content after the value |

#### Examples

**1. Simple number**

```tsx
<Statistic title="Downloads" value={93120} />
```

---

**2. Currency with prefix**

```tsx
<Statistic
  title="Revenue"
  value={9280.5}
  precision={2}
  prefix="$"
/>
```

---

**3. Custom separators**

```tsx
<Statistic
  title="Visitors"
  value={1234567}
  groupSeparator="."
  decimalSeparator=","
/>
```

---

**4. Suffix unit**

```tsx
<Statistic title="CPU Usage" value={72.4} precision={1} suffix="%" />
```

---

**5. Trend with colored suffix**

```tsx
<Statistic
  title="Weekly Growth"
  value={12.5}
  precision={1}
  suffix={<span style={{ color: tokens.colorSuccess, fontSize: '1rem' }}>▲</span>}
/>
```

---

**6. Icon prefix**

```tsx
import { UserIcon } from '@juanitte/inoui/icons'

<Statistic
  title="Active Users"
  value={4890}
  prefix={<UserIcon style={{ fontSize: '1.25rem', color: tokens.colorPrimary }} />}
/>
```

---

**7. Custom formatter**

```tsx
<Statistic
  title="Score"
  value={0.856}
  formatter={(v) => `${(Number(v) * 100).toFixed(1)}%`}
/>
```

---

**8. Loading state**

```tsx
<Statistic title="Total Orders" loading />
```

---

**9. Loading with custom placeholder width**

```tsx
<Statistic title="Revenue" loading loadingWidth="10rem" />
```

---

**10. Basic countdown (HH:mm:ss)**

```tsx
<Statistic.Countdown
  title="Sale ends in"
  value={Date.now() + 2 * 60 * 60 * 1000}  // 2 hours from now
/>
```

---

**11. Countdown with days**

```tsx
<Statistic.Countdown
  title="Event starts in"
  value={Date.now() + 3 * 24 * 60 * 60 * 1000}
  format="D[d] HH:mm:ss"
/>
```

---

**12. Countdown with inflected day label**

```tsx
<Statistic.Countdown
  title="Time left"
  value={Date.now() + 2 * 24 * 60 * 60 * 1000}
  format="D [day|days] HH:mm:ss"
/>
// Renders: "2 days 00:00:00" → "1 day 00:00:00"
```

---

**13. Millisecond countdown**

```tsx
<Statistic.Countdown
  title="Reaction time"
  value={Date.now() + 10000}
  format="ss.SSS"
/>
```

---

**14. onFinish callback**

```tsx
<Statistic.Countdown
  title="Session expires"
  value={Date.now() + 30 * 1000}
  onFinish={() => alert('Session expired!')}
/>
```

---

**15. onChange progress bar**

```tsx
function CountdownWithBar() {
  const DURATION = 60 * 1000
  const target = useRef(Date.now() + DURATION)
  const [pct, setPct] = useState(100)

  return (
    <div>
      <Statistic.Countdown
        title="Time remaining"
        value={target.current}
        onChange={(ms) => setPct(Math.round((ms / DURATION) * 100))}
      />
      <div style={{ height: 4, background: tokens.colorBgMuted, borderRadius: 2, marginTop: 8 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: tokens.colorPrimary, borderRadius: 2, transition: 'width 1s linear' }} />
      </div>
    </div>
  )
}
```

---

**16. KPI dashboard row**

```tsx
<div style={{ display: 'flex', gap: '2rem' }}>
  <Statistic title="Total Users"   value={128430} />
  <Statistic title="Monthly Revenue" value={54200}  precision={2} prefix="$" />
  <Statistic title="Conversion"    value={3.7}    precision={1} suffix="%" />
  <Statistic title="Uptime"        value={99.98}  precision={2} suffix="%" />
</div>
```

---

**17. Semantic style customization**

```tsx
<Statistic
  title="Net Profit"
  value={18500}
  precision={2}
  prefix="$"
  styles={{
    title:   { color: tokens.colorTextSubtle, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
    content: { color: tokens.colorSuccess, fontSize: '2rem' },
  }}
/>
```

</details>

---

<details>
<summary><strong>Switch</strong> - Toggle switch for on/off states with loading support</summary>

### Switch

A toggle switch component for binary on/off states. Supports two sizes, loading state with spinner, custom text labels for checked/unchecked states, and keyboard accessibility.

#### Import

```tsx
import { Switch } from '@juanitte/inoui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `autoFocus` | `boolean` | `false` | Auto focus on mount |
| `checked` | `boolean` | - | Current checked state (controlled) |
| `checkedChildren` | `ReactNode` | - | Content shown inside the switch when checked (e.g., "ON") |
| `defaultChecked` | `boolean` | `false` | Default checked state (uncontrolled) |
| `defaultValue` | `boolean` | `false` | Alias for `defaultChecked` |
| `disabled` | `boolean` | `false` | Disable the switch |
| `loading` | `boolean` | `false` | Show loading spinner (also disables interaction) |
| `size` | `'default' \| 'small'` | `'default'` | Size of the switch |
| `unCheckedChildren` | `ReactNode` | - | Content shown inside the switch when unchecked (e.g., "OFF") |
| `value` | `boolean` | - | Alias for `checked` |
| `onChange` | `(checked: boolean, event: MouseEvent) => void` | - | Callback when checked state changes |
| `onClick` | `(checked: boolean, event: MouseEvent) => void` | - | Click callback (fires after onChange) |
| `className` | `string` | - | Root CSS class |
| `style` | `CSSProperties` | - | Root inline styles |
| `classNames` | `SwitchClassNames` | - | Semantic slot classes |
| `styles` | `SwitchStyles` | - | Semantic slot styles |
| `tabIndex` | `number` | - | Custom tab index |
| `id` | `string` | - | HTML id attribute |

#### SwitchRef

| Method | Description |
|--------|-------------|
| `focus()` | Focus the switch |
| `blur()` | Blur the switch |

#### Size Configuration

| Size | Track Height | Track Min Width | Thumb Size |
|------|--------------|-----------------|------------|
| `default` | 1.375rem (22px) | 2.75rem (44px) | 1.125rem (18px) |
| `small` | 1rem (16px) | 1.75rem (28px) | 0.75rem (12px) |

#### Semantic DOM

| Slot | Description |
|------|-------------|
| `root` | The button element (outer container) |
| `track` | The background track that changes color |
| `thumb` | The circular sliding thumb |
| `inner` | The text content container (for checkedChildren/unCheckedChildren) |

#### Examples

**Basic usage:**
```tsx
const [checked, setChecked] = useState(false)

<Switch checked={checked} onChange={setChecked} />
```

**Uncontrolled:**
```tsx
<Switch defaultChecked />
```

**With text labels:**
```tsx
<Switch
  checkedChildren="ON"
  unCheckedChildren="OFF"
  defaultChecked
/>
```

**Small size:**
```tsx
<Switch size="small" defaultChecked />
<Switch size="small" checkedChildren="✓" unCheckedChildren="✗" />
```

**Disabled:**
```tsx
<Switch disabled />
<Switch disabled checked />
```

**Loading state:**
```tsx
<Switch loading />
<Switch loading checked />
```

**With onChange handler:**
```tsx
const [checked, setChecked] = useState(false)

<Switch
  checked={checked}
  onChange={(checked) => {
    console.log('Switch is now:', checked)
    setChecked(checked)
  }}
/>
```

**Custom styling:**
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

**Keyboard accessibility:**
The Switch component is fully keyboard accessible:
- **Space / Enter:** Toggle the switch
- Supports standard focus management with focus ring on keyboard navigation

**With icons as labels:**
```tsx
<Switch
  checkedChildren={<CheckOutlined />}
  unCheckedChildren={<CloseOutlined />}
  defaultChecked
/>
```

**Using value/defaultValue aliases:**
```tsx
// These are equivalent to checked/defaultChecked
<Switch value={isEnabled} onChange={setEnabled} />
<Switch defaultValue={true} />
```

</details>

---

<details>
<summary><strong>Table</strong> - Full-featured data table with sorting, filtering, pagination, and more</summary>

### Table

A feature-rich data table supporting client-side and server-side scenarios. Includes column sorting (single and multi-column), filter dropdowns, row selection (checkbox and radio), expandable rows with animation, tree data, fixed header and columns, pagination, column groups, and full semantic slot customization.

#### Import

```tsx
import { Table } from '@juanitte/inoui'
```

#### Props — `TableProps<T>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dataSource` | `T[]` | — | Array of data records |
| `columns` | `ColumnType<T>[]` | — | Column definitions |
| `rowKey` | `string \| ((record: T) => string \| number)` | `'key'` | Unique row identifier |
| `bordered` | `boolean` | `false` | Show cell borders |
| `size` | `'large' \| 'middle' \| 'small'` | `'large'` | Cell padding variant |
| `showHeader` | `boolean` | `true` | Show the table header |
| `loading` | `boolean` | `false` | Overlay a loading spinner |
| `pagination` | `TablePaginationConfig \| false` | — | Pagination config; `false` disables it |
| `rowSelection` | `TableRowSelection<T>` | — | Row selection config |
| `scroll` | `{ x?: number \| string; y?: number \| string }` | — | `y` fixes header height; `x` sets min-width for horizontal scroll |
| `expandable` | `TableExpandable<T>` | — | Expandable row config |
| `sortDirections` | `SortDirection[]` | — | Global sort direction cycle for all sortable columns |
| `rowHoverable` | `boolean` | `true` | Highlight rows on hover |
| `title` | `(currentPageData: T[]) => ReactNode` | — | Content rendered above the table body |
| `footer` | `(currentPageData: T[]) => ReactNode` | — | Content rendered below the table body |
| `childrenColumnName` | `string` | `'children'` | Field name for tree data children |
| `indentSize` | `number` | `15` | Tree indent in px per level |
| `keepPreviousData` | `boolean` | `false` | Keep showing previous data while `loading` (useful for server-side pagination) |
| `onChange` | `(pagination, sorter, filters) => void` | — | Called when pagination, sort, or filters change |
| `onRow` | `(record: T, index: number) => HTMLAttributes<HTMLTableRowElement>` | — | Custom HTML attributes per row |
| `tableLayout` | `'auto' \| 'fixed'` | auto-detected | HTML table-layout property |
| `locale` | `{ emptyText?: ReactNode }` | — | Localization — empty state text |
| `className` | `string` | — | Root CSS class |
| `style` | `CSSProperties` | — | Root inline style |
| `classNames` | `TableClassNames` | — | Semantic class names per slot |
| `styles` | `TableStyles` | — | Semantic inline styles per slot |

#### `ColumnType<T>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | — | Column header content |
| `dataIndex` | `string \| string[]` | — | Field path in the record; use `string[]` for nested access |
| `key` | `string` | — | Unique column key (falls back to `dataIndex`) |
| `render` | `(value, record, index) => ReactNode` | — | Custom cell renderer |
| `align` | `'left' \| 'right' \| 'center'` | `'left'` | Cell text alignment |
| `width` | `string \| number` | — | Column width |
| `ellipsis` | `boolean` | `false` | Truncate overflowing text with `…` |
| `sorter` | `fn \| boolean \| { compare: fn; multiple?: number }` | — | Sort comparator; `true` = default value comparison; `multiple` enables multi-sort with priority |
| `sortOrder` | `'ascend' \| 'descend' \| null` | — | Controlled sort order |
| `defaultSortOrder` | `'ascend' \| 'descend' \| null` | — | Initial sort order (uncontrolled) |
| `sortDirections` | `SortDirection[]` | — | Direction cycle for this column |
| `filters` | `ColumnFilterItem[]` | — | Filter menu items |
| `onFilter` | `(value, record) => boolean` | — | Filter predicate |
| `filterMultiple` | `boolean` | `true` | Allow multiple filter selections |
| `filteredValue` | `(string \| number \| boolean)[]` | — | Controlled filter values |
| `defaultFilteredValue` | `(string \| number \| boolean)[]` | — | Initial filter values (uncontrolled) |
| `filterSearch` | `boolean \| fn` | — | Enable search in filter dropdown |
| `filterDropdown` | `ReactNode \| ((props: FilterDropdownProps) => ReactNode)` | — | Custom filter dropdown |
| `filterIcon` | `ReactNode \| ((filtered: boolean) => ReactNode)` | — | Custom filter icon |
| `filterOnClose` | `boolean` | `true` | Apply filter when dropdown closes |
| `hidden` | `boolean` | `false` | Hide this column |
| `className` | `string` | — | Extra CSS class for all cells in this column |
| `fixed` | `'left' \| 'right' \| boolean` | — | Fix column position; `true` = `'left'` |
| `children` | `ColumnType<T>[]` | — | Nested columns for grouped headers |
| `onCell` | `(record, index) => HTMLAttributes<td>` | — | Custom attributes per data cell (supports `colSpan`/`rowSpan`) |
| `onHeaderCell` | `(column) => HTMLAttributes<th>` | — | Custom attributes per header cell |

#### `TableRowSelection<T>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'checkbox' \| 'radio'` | `'checkbox'` | Selection input type |
| `selectedRowKeys` | `(string \| number)[]` | — | Controlled selected keys |
| `onChange` | `(keys, rows) => void` | — | Called on selection change |
| `onSelect` | `(record, selected, selectedRows) => void` | — | Called on single row toggle |
| `getCheckboxProps` | `(record) => Partial<CheckboxProps>` | — | Customize checkbox/radio props per row (e.g. `disabled`) |
| `columnWidth` | `string \| number` | `'2.5rem'` | Width of the selection column |
| `hideSelectAll` | `boolean` | `false` | Hide the header select-all checkbox |
| `preserveSelectedRowKeys` | `boolean` | `false` | Keep selection when `dataSource` changes |

#### `TableExpandable<T>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `expandedRowRender` | `(record, index, indent, expanded) => ReactNode` | — | Render expanded row content |
| `expandedRowKeys` | `(string \| number)[]` | — | Controlled expanded keys |
| `defaultExpandedRowKeys` | `(string \| number)[]` | `[]` | Initial expanded keys |
| `defaultExpandAllRows` | `boolean` | `false` | Expand all rows by default |
| `onExpand` | `(expanded, record) => void` | — | Called when a row is expanded/collapsed |
| `onExpandedRowsChange` | `(keys) => void` | — | Called when expanded keys change |
| `rowExpandable` | `(record) => boolean` | — | Determine if a row can be expanded |
| `expandRowByClick` | `boolean` | `false` | Clicking the row toggles expansion |
| `columnWidth` | `string \| number` | `'2.5rem'` | Width of the expand icon column |
| `showExpandColumn` | `boolean` | `true` | Show the expand icon column |

#### `TablePaginationConfig`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `total` | `number` | — | Total record count (required for server-side pagination) |
| `current` | `number` | — | Controlled current page |
| `pageSize` | `number` | — | Controlled page size |
| `defaultCurrent` | `number` | `1` | Initial page |
| `defaultPageSize` | `number` | `10` | Initial page size |
| `size` | `PaginationSize` | — | Pagination component size |
| `showSizeChanger` | `boolean` | — | Show page size selector |
| `showQuickJumper` | `boolean` | — | Show page number input |
| `showTotal` | `(total, range) => ReactNode` | — | Total count renderer |
| `simple` | `boolean` | — | Simple pagination mode |
| `hideOnSinglePage` | `boolean` | — | Hide when only one page |
| `disabled` | `boolean` | — | Disable all pagination controls |
| `position` | `('topLeft' \| 'topCenter' \| 'topRight' \| 'bottomLeft' \| 'bottomCenter' \| 'bottomRight')[]` | `['bottomRight']` | Pagination placement |
| `onChange` | `(page, pageSize) => void` | — | Direct pagination callback |

#### `FilterDropdownProps`

```ts
interface FilterDropdownProps {
  selectedKeys: (string | number | boolean)[]
  setSelectedKeys: (keys: (string | number | boolean)[]) => void
  confirm: () => void      // Apply + close
  clearFilters: () => void // Clear + apply
  close: () => void        // Close without applying
}
```

#### Size Config

| Size | V-Padding | H-Padding | Font size |
|------|-----------|-----------|-----------|
| `'large'` | 1 rem | 1 rem | 0.875 rem |
| `'middle'` | 0.625 rem | 0.75 rem | 0.875 rem |
| `'small'` | 0.375 rem | 0.5 rem | 0.8125 rem |

#### Semantic DOM

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<div>` | Outermost container |
| `header` | `<thead>` | Table header element |
| `headerRow` | `<tr>` | Header row(s) |
| `headerCell` | `<th>` | Header cells |
| `body` | `<tbody>` | Table body element |
| `row` | `<tr>` | Data rows |
| `cell` | `<td>` | Data cells |
| `expandedRow` | `<tr>` | Expanded content row |
| `pagination` | `<div>` | Pagination wrapper |
| `empty` | `<td>` | Empty state cell |
| `loading` | `<div>` | Loading overlay |
| `title` | `<div>` | Table title bar |
| `footer` | `<div>` | Table footer bar |
| `filterDropdown` | — | Reserved for custom filter dropdown styling |

#### Examples

**1. Basic table**

```tsx
interface User { key: string; name: string; age: number; email: string }

const data: User[] = [
  { key: '1', name: 'Alice', age: 28, email: 'alice@example.com' },
  { key: '2', name: 'Bob',   age: 34, email: 'bob@example.com'   },
  { key: '3', name: 'Carol', age: 22, email: 'carol@example.com' },
]

const columns: ColumnType<User>[] = [
  { title: 'Name',  dataIndex: 'name',  key: 'name' },
  { title: 'Age',   dataIndex: 'age',   key: 'age'  },
  { title: 'Email', dataIndex: 'email', key: 'email' },
]

<Table dataSource={data} columns={columns} />
```

---

**2. Custom cell renderer**

```tsx
const columns: ColumnType<User>[] = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age',  dataIndex: 'age',  key: 'age'  },
  {
    title: 'Actions',
    key: 'actions',
    align: 'right',
    render: (_, record) => (
      <button onClick={() => console.log('edit', record.key)}>Edit</button>
    ),
  },
]
```

---

**3. Nested dataIndex**

```tsx
interface Order { key: string; customer: { name: string; city: string }; total: number }

const columns: ColumnType<Order>[] = [
  { title: 'Customer', dataIndex: ['customer', 'name'], key: 'name' },
  { title: 'City',     dataIndex: ['customer', 'city'], key: 'city' },
  { title: 'Total',    dataIndex: 'total',              key: 'total' },
]
```

---

**4. Sorting — single column**

```tsx
const columns: ColumnType<User>[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
    defaultSortOrder: 'ascend',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    sorter: (a, b) => a.age - b.age,
  },
]
```

---

**5. Multi-column sort**

Use `sorter.multiple` to assign priority — lower number = higher priority.

```tsx
const columns: ColumnType<User>[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: { compare: (a, b) => a.name.localeCompare(b.name), multiple: 2 },
  },
  {
    title: 'Age',
    dataIndex: 'age',
    sorter: { compare: (a, b) => a.age - b.age, multiple: 1 },
  },
]
```

---

**6. Column filters**

```tsx
const columns: ColumnType<User>[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    filters: [
      { text: 'Alice', value: 'Alice' },
      { text: 'Bob',   value: 'Bob'   },
    ],
    onFilter: (value, record) => record.name === value,
  },
]
```

---

**7. Filter with search**

```tsx
{
  title: 'City',
  dataIndex: 'city',
  filterSearch: true,
  filters: cities.map(c => ({ text: c, value: c })),
  onFilter: (value, record) => record.city === value,
}
```

---

**8. Custom filter dropdown**

```tsx
{
  title: 'Age',
  dataIndex: 'age',
  filterDropdown: ({ selectedKeys, setSelectedKeys, confirm, clearFilters }) => (
    <div style={{ padding: '0.5rem' }}>
      <input
        value={selectedKeys[0] as string ?? ''}
        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        placeholder="Min age"
        style={{ marginBottom: '0.5rem', display: 'block' }}
      />
      <button onClick={() => confirm()}>OK</button>
      <button onClick={clearFilters}>Reset</button>
    </div>
  ),
  onFilter: (value, record) => record.age >= Number(value),
}
```

---

**9. Checkbox row selection**

```tsx
const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([])

<Table
  dataSource={data}
  columns={columns}
  rowSelection={{
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  }}
/>
```

---

**10. Radio row selection**

```tsx
<Table
  dataSource={data}
  columns={columns}
  rowSelection={{ type: 'radio', onChange: (keys, rows) => console.log(keys, rows) }}
/>
```

---

**11. Disable selection on specific rows**

```tsx
rowSelection={{
  getCheckboxProps: (record) => ({ disabled: record.age < 18 }),
}}
```

---

**12. Expandable rows**

```tsx
<Table
  dataSource={data}
  columns={columns}
  expandable={{
    expandedRowRender: (record) => (
      <p style={{ margin: 0 }}>Details for {record.name}: {record.email}</p>
    ),
    rowExpandable: (record) => record.age >= 18,
  }}
/>
```

---

**13. Expand row by clicking**

```tsx
expandable={{
  expandedRowRender: (record) => <p>{record.email}</p>,
  expandRowByClick: true,
}}
```

---

**14. Tree data**

Tree data is auto-detected when records have a `children` field containing nested records. No extra configuration needed.

```tsx
interface Employee { key: string; name: string; role: string; children?: Employee[] }

const treeData: Employee[] = [
  {
    key: '1', name: 'Alice', role: 'Manager',
    children: [
      { key: '1-1', name: 'Bob',   role: 'Engineer' },
      { key: '1-2', name: 'Carol', role: 'Designer'  },
    ],
  },
  { key: '2', name: 'Dave', role: 'Director' },
]

<Table dataSource={treeData} columns={columns} rowKey="key" />
```

---

**15. Fixed header (vertical scroll)**

```tsx
<Table
  dataSource={data}
  columns={columns}
  scroll={{ y: 300 }}
/>
```

---

**16. Fixed columns (horizontal scroll)**

Fixed columns require explicit `width` on each column and a `scroll.x` wide enough to cause scrolling.

```tsx
const columns: ColumnType<User>[] = [
  { title: 'Name',  dataIndex: 'name',  key: 'name',  width: 150, fixed: 'left'  },
  { title: 'Age',   dataIndex: 'age',   key: 'age',   width: 80  },
  { title: 'Email', dataIndex: 'email', key: 'email', width: 200 },
  { title: 'City',  dataIndex: 'city',  key: 'city',  width: 150 },
  { title: 'Phone', dataIndex: 'phone', key: 'phone', width: 150 },
  { title: 'Action',key: 'action',       width: 100, fixed: 'right',
    render: () => <button>Edit</button> },
]

<Table dataSource={data} columns={columns} scroll={{ x: 800 }} />
```

---

**17. Column groups**

Use `children` in a column to span multiple sub-columns under one header.

```tsx
const columns: ColumnType<any>[] = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  {
    title: 'Contact',
    children: [
      { title: 'Email', dataIndex: 'email', key: 'email' },
      { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    ],
  },
  {
    title: 'Address',
    children: [
      { title: 'City',    dataIndex: 'city',    key: 'city'    },
      { title: 'Country', dataIndex: 'country', key: 'country' },
    ],
  },
]
```

---

**18. Pagination**

```tsx
<Table
  dataSource={data}
  columns={columns}
  pagination={{
    defaultPageSize: 10,
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}–${range[1]} of ${total} items`,
    position: ['bottomCenter'],
  }}
/>
```

---

**19. Server-side pagination + sorting + filtering**

When `pagination.total` exceeds `dataSource.length`, the Table switches to server-side mode — it passes the current page state to `onChange` and skips client-side slicing.

```tsx
const [data, setData] = useState<User[]>([])
const [loading, setLoading] = useState(false)
const [total, setTotal] = useState(0)

async function fetchData(page: number, pageSize: number, sorter: SorterResult<User>, filters: Record<string, any>) {
  setLoading(true)
  const res = await api.getUsers({ page, pageSize, sorter, filters })
  setData(res.rows)
  setTotal(res.total)
  setLoading(false)
}

useEffect(() => { fetchData(1, 10, {}, {}) }, [])

<Table
  dataSource={data}
  columns={columns}
  loading={loading}
  keepPreviousData
  pagination={{ total, showSizeChanger: true }}
  onChange={(pagination, sorter, filters) => {
    fetchData(pagination.current, pagination.pageSize, sorter as SorterResult<User>, filters)
  }}
/>
```

---

**20. Cell merging with onCell**

Return `colSpan: 0` from `onCell` on cells that should be hidden when a sibling spans them.

```tsx
const columns: ColumnType<any>[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    onCell: (record) => ({
      colSpan: record.isGroupHeader ? 4 : 1,
    }),
  },
  {
    title: 'Age',
    dataIndex: 'age',
    onCell: (record) => ({ colSpan: record.isGroupHeader ? 0 : 1 }),
  },
  // ...
]
```

---

**21. Row click + custom row attributes**

```tsx
<Table
  dataSource={data}
  columns={columns}
  onRow={(record) => ({
    onClick: () => console.log('clicked', record.key),
    style: { cursor: 'pointer' },
  })}
/>
```

---

**22. Size + bordered**

```tsx
<Table dataSource={data} columns={columns} size="small" bordered />
```

---

**23. Semantic style customization**

```tsx
<Table
  dataSource={data}
  columns={columns}
  styles={{
    headerCell: { backgroundColor: tokens.colorPrimary, color: '#fff' },
    row: { fontFamily: 'monospace' },
    cell: { fontSize: '0.75rem' },
  }}
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
import { Tabs } from '@juanitte/inoui'
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
<summary><strong>Tag</strong> - Compact label with color presets, variants, close, and checkable mode</summary>

### Tag

A compact label component for categorization, status display, and filtering. Supports 19 preset colors (6 semantic + 13 decorative), 3 variants (outlined / filled / solid), closable behavior with exit animation, icon prefix, link mode, and a `Tag.CheckableTag` sub-component for toggle-style filter chips.

#### Import

```tsx
import { Tag } from '@juanitte/inoui'
```

#### Props — `Tag`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Tag label content |
| `color` | `TagPresetColor \| string` | — | Preset name or any CSS color string |
| `variant` | `'outlined' \| 'filled' \| 'solid'` | `'outlined'` | Visual variant |
| `closable` | `boolean` | `false` | Show close button |
| `closeIcon` | `ReactNode` | — | Custom close icon (replaces default ×) |
| `onClose` | `(e: MouseEvent) => void` | — | Called when close is clicked; call `e.preventDefault()` to cancel removal |
| `icon` | `ReactNode` | — | Leading icon |
| `bordered` | `boolean` | `true` | Show border |
| `href` | `string` | — | Renders the tag as an `<a>` link |
| `target` | `string` | — | Link target (e.g. `'_blank'`) |
| `disabled` | `boolean` | `false` | Disables interaction and reduces opacity |
| `onClick` | `(e: MouseEvent) => void` | — | Click handler |
| `className` | `string` | — | Root CSS class |
| `style` | `CSSProperties` | — | Root inline style |
| `classNames` | `TagClassNames` | — | Semantic class names per slot |
| `styles` | `TagStyles` | — | Semantic inline styles per slot |

#### Props — `Tag.CheckableTag`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Label content |
| `checked` | `boolean` | `false` | Controlled checked state |
| `onChange` | `(checked: boolean) => void` | — | Called when toggled |
| `color` | `TagPresetColor \| string` | `'primary'` | Checked background color |
| `disabled` | `boolean` | `false` | Disables interaction |
| `className` | `string` | — | Root CSS class |
| `style` | `CSSProperties` | — | Root inline style |
| `classNames` | `CheckableTagClassNames` | — | Semantic class names per slot |
| `styles` | `CheckableTagStyles` | — | Semantic inline styles per slot |

#### Type Definitions

```ts
type TagPresetColor =
  // Semantic
  | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  // Decorative
  | 'pink' | 'red' | 'yellow' | 'orange' | 'cyan' | 'green'
  | 'blue' | 'purple' | 'geekblue' | 'magenta' | 'volcano' | 'gold' | 'lime'

type TagVariant = 'outlined' | 'filled' | 'solid'

type TagSemanticSlot         = 'root' | 'icon' | 'content' | 'closeIcon'
type TagClassNames           = SemanticClassNames<TagSemanticSlot>
type TagStyles               = SemanticStyles<TagSemanticSlot>

type CheckableTagSemanticSlot = 'root' | 'content'
type CheckableTagClassNames   = SemanticClassNames<CheckableTagSemanticSlot>
type CheckableTagStyles       = SemanticStyles<CheckableTagSemanticSlot>
```

#### Color × Variant Matrix

| Variant | No color | Semantic (`success` etc.) | Decorative / custom |
|---------|----------|--------------------------|---------------------|
| `outlined` | border + text in `colorBorder`/`colorText` | colored border + text | colored border (45% opacity) + text |
| `filled` | subtle `colorBgMuted` fill, no border | 25% color-mix fill, colored text | 25% hex fill, colored text |
| `solid` | solid `colorTextMuted` bg, white text | solid semantic color, white text | solid hex bg, white text |

#### Semantic DOM

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<span>` or `<a>` | Outer wrapper (switches to `<a>` when `href` is set) |
| `icon` | `<span>` | Leading icon wrapper |
| `content` | `<span>` | Text/children wrapper |
| `closeIcon` | `<span>` | Close button wrapper |

#### Examples

**1. Plain tag**

```tsx
<Tag>Default</Tag>
```

---

**2. Semantic preset colors**

```tsx
<Tag color="primary">Primary</Tag>
<Tag color="success">Success</Tag>
<Tag color="warning">Warning</Tag>
<Tag color="error">Error</Tag>
<Tag color="info">Info</Tag>
<Tag color="secondary">Secondary</Tag>
```

---

**3. Decorative preset colors**

```tsx
<Tag color="magenta">Magenta</Tag>
<Tag color="volcano">Volcano</Tag>
<Tag color="orange">Orange</Tag>
<Tag color="gold">Gold</Tag>
<Tag color="lime">Lime</Tag>
<Tag color="green">Green</Tag>
<Tag color="cyan">Cyan</Tag>
<Tag color="blue">Blue</Tag>
<Tag color="geekblue">Geekblue</Tag>
<Tag color="purple">Purple</Tag>
```

---

**4. Custom hex / CSS color**

```tsx
<Tag color="#f50">Custom #f50</Tag>
<Tag color="hsl(270 60% 50%)">Custom HSL</Tag>
```

---

**5. Variants**

```tsx
<Tag color="primary" variant="outlined">Outlined</Tag>
<Tag color="primary" variant="filled">Filled</Tag>
<Tag color="primary" variant="solid">Solid</Tag>
```

---

**6. No border**

```tsx
<Tag color="success" bordered={false}>No border</Tag>
```

---

**7. Closable tag**

Clicking × triggers `onClose`. Call `e.preventDefault()` to keep the tag visible.

```tsx
<Tag
  closable
  onClose={(e) => {
    console.log('closed')
    // e.preventDefault() // call this to cancel removal
  }}
>
  Closable
</Tag>
```

---

**8. Custom close icon**

```tsx
<Tag closable closeIcon={<span>✕</span>} color="error">
  Custom close
</Tag>
```

---

**9. With leading icon**

```tsx
import { StarIcon } from '@juanitte/inoui/icons'

<Tag icon={<StarIcon />} color="gold">
  Featured
</Tag>
```

---

**10. Spinner icon (loading state)**

`Tag.SpinnerIcon` is exported for use as a leading icon in async scenarios.

```tsx
<Tag icon={<Tag.SpinnerIcon />} color="primary">
  Processing…
</Tag>
```

---

**11. Link tag**

Renders as `<a>` when `href` is set.

```tsx
<Tag href="https://example.com" target="_blank" color="blue">
  Visit site
</Tag>
```

---

**12. Disabled**

```tsx
<Tag color="primary" disabled>Disabled</Tag>
```

---

**13. Clickable tag**

```tsx
<Tag
  color="info"
  variant="filled"
  onClick={() => console.log('tag clicked')}
>
  Clickable
</Tag>
```

---

**14. Dynamic tag list with close**

```tsx
function TagList() {
  const [tags, setTags] = useState(['React', 'TypeScript', 'Vite'])

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {tags.map((tag) => (
        <Tag
          key={tag}
          closable
          color="primary"
          variant="filled"
          onClose={() => setTags((prev) => prev.filter((t) => t !== tag))}
        >
          {tag}
        </Tag>
      ))}
    </div>
  )
}
```

---

**15. Tag.CheckableTag — single**

```tsx
const [checked, setChecked] = useState(false)

<Tag.CheckableTag checked={checked} onChange={setChecked} color="primary">
  Featured
</Tag.CheckableTag>
```

---

**16. CheckableTag — filter group**

```tsx
const CATEGORIES = ['Design', 'Engineering', 'Marketing', 'Sales']

function CategoryFilter() {
  const [active, setActive] = useState<string[]>([])

  const toggle = (cat: string) =>
    setActive((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    )

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {CATEGORIES.map((cat) => (
        <Tag.CheckableTag
          key={cat}
          checked={active.includes(cat)}
          onChange={() => toggle(cat)}
          color="primary"
        >
          {cat}
        </Tag.CheckableTag>
      ))}
    </div>
  )
}
```

---

**17. Semantic style customization**

```tsx
<Tag
  color="primary"
  styles={{
    root:      { borderRadius: '9999px', padding: '0 0.75rem' },
    content:   { fontWeight: 700, letterSpacing: '0.05em' },
    closeIcon: { color: 'red' },
  }}
  closable
>
  Pill tag
</Tag>
```

</details>

---

<details>
<summary><strong>Text</strong> - Typography with formatting and copy-to-clipboard</summary>

### Text

A typography component for displaying text with various styles, formatting options, and utility features like copy-to-clipboard and text truncation.

#### Import

```tsx
import { Text } from '@juanitte/inoui'
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
<summary><strong>TimePicker</strong> - Time selection with analog clock and range support</summary>

### TimePicker

A time selection component with digital columns or analog clock view. Supports 12/24-hour formats, custom time steps, disabled times, and range selection via `TimePicker.RangePicker`.

#### Import

```tsx
import { TimePicker } from '@juanitte/inoui'
```

#### TimePicker Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date \| null` | - | Current time value (controlled) |
| `defaultValue` | `Date \| null` | `null` | Default time value (uncontrolled) |
| `onChange` | `(time: Date \| null, timeString: string) => void` | - | Callback when time changes |
| `onCalendarChange` | `(time: Date \| null, timeString: string) => void` | - | Callback when user selects time (before confirm) |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when dropdown visibility changes |
| `open` | `boolean` | - | Control dropdown visibility (controlled) |
| `defaultOpen` | `boolean` | `false` | Default dropdown visibility (uncontrolled) |
| `format` | `string` | `'HH:mm'` or `'hh:mm A'` | Time format string (e.g., `'HH:mm:ss'`, `'hh:mm A'`) |
| `use12Hours` | `boolean` | `false` | Use 12-hour format with AM/PM |
| `hourStep` | `number` | `1` | Hour step size for column options |
| `minuteStep` | `number` | `1` | Minute step size |
| `secondStep` | `number` | `1` | Second step size |
| `disabled` | `boolean` | `false` | Disable the picker |
| `allowClear` | `boolean` | `true` | Show clear button |
| `placeholder` | `string` | `'Select time'` | Input placeholder |
| `placement` | `'bottomLeft' \| 'bottomRight' \| 'topLeft' \| 'topRight'` | `'bottomLeft'` | Dropdown placement (auto-flips if overflows) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the picker |
| `variant` | `'outlined' \| 'borderless' \| 'filled'` | `'outlined'` | Visual style variant |
| `status` | `'error' \| 'warning'` | - | Validation status |
| `needConfirm` | `boolean` | `true` | Show OK button (requires confirmation to apply) |
| `showNow` | `boolean` | `true` | Show "Now" button in footer |
| `prefix` | `ReactNode` | - | Prefix element in input |
| `suffix` | `ReactNode` | Clock icon | Suffix element in input |
| `addon` | `ReactNode` | - | Extra content in dropdown footer |
| `changeOnScroll` | `boolean` | `false` | Select value by scrolling columns instead of clicking |
| `showAnalog` | `boolean` | `false` | Show analog clock instead of digital columns |
| `inputReadOnly` | `boolean` | `false` | Make input read-only (disable manual typing) |
| `disabledTime` | `() => DisabledTimeConfig` | - | Function to disable specific times |
| `className` | `string` | - | Root CSS class |
| `style` | `CSSProperties` | - | Root inline styles |
| `classNames` | `TimePickerClassNames` | - | Semantic slot classes |
| `styles` | `TimePickerStyles` | - | Semantic slot styles |
| `id` | `string` | - | HTML id attribute |
| `autoFocus` | `boolean` | `false` | Auto focus on mount |

#### TimePicker.RangePicker Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `[Date \| null, Date \| null]` | - | Current time range (controlled) |
| `defaultValue` | `[Date \| null, Date \| null]` | `[null, null]` | Default time range (uncontrolled) |
| `onChange` | `(times: [Date \| null, Date \| null] \| null, timeStrings: [string, string]) => void` | - | Callback when range changes |
| `onCalendarChange` | `(times: [Date \| null, Date \| null], timeStrings: [string, string], info: { range: 'start' \| 'end' }) => void` | - | Callback when user selects time (before confirm) |
| `disabled` | `boolean \| [boolean, boolean]` | `false` | Disable picker or disable start/end separately |
| `placeholder` | `[string, string]` | `['Start time', 'End time']` | Placeholder for start and end inputs |
| `separator` | `ReactNode` | Arrow icon | Separator between start and end inputs |
| `order` | `boolean` | `true` | Auto-swap start and end if start > end |
| `disabledTime` | `(type: 'start' \| 'end') => DisabledTimeConfig` | - | Function to disable times for start/end |
| *(other props)* | Same as TimePicker | | Most TimePicker props are supported |

#### DisabledTimeConfig

```typescript
interface DisabledTimeConfig {
  disabledHours?: () => number[]
  disabledMinutes?: (hour: number) => number[]
  disabledSeconds?: (hour: number, minute: number) => number[]
}
```

#### Size Configuration

| Size | Height |
|------|--------|
| `sm` | 1.75rem (28px) |
| `md` | 2.25rem (36px) |
| `lg` | 2.75rem (40px) |

#### Semantic DOM

| Slot | Description |
|------|-------------|
| `root` | The outermost container |
| `input` | The clickable input wrapper |
| `popup` | The dropdown panel |
| `column` | Time column containers (Hour/Minute/Second/AM-PM) |
| `footer` | The footer section with Now/OK buttons |

#### Examples

**Basic usage:**
```tsx
const [time, setTime] = useState<Date | null>(null)

<TimePicker value={time} onChange={setTime} />
```

**12-hour format:**
```tsx
<TimePicker use12Hours format="hh:mm A" />
```

**With seconds:**
```tsx
<TimePicker format="HH:mm:ss" />
```

**Custom steps:**
```tsx
<TimePicker hourStep={2} minuteStep={15} secondStep={10} />
```

**Sizes and variants:**
```tsx
<TimePicker size="sm" variant="outlined" />
<TimePicker size="md" variant="filled" />
<TimePicker size="lg" variant="borderless" />
```

**Without confirmation:**
```tsx
<TimePicker needConfirm={false} />
```

**Analog clock view:**
```tsx
<TimePicker showAnalog />
<TimePicker showAnalog use12Hours />
```

**Change on scroll:**
```tsx
<TimePicker changeOnScroll />
```

**Disabled times:**
```tsx
<TimePicker
  disabledTime={() => ({
    disabledHours: () => [0, 1, 2, 3, 4, 5, 22, 23],
    disabledMinutes: (hour) => hour === 12 ? [0, 15, 30, 45] : [],
  })}
/>
```

**With addon (custom footer):**
```tsx
<TimePicker
  addon={
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <button onClick={() => setTime(new Date())}>Now</button>
      <button onClick={() => setTime(null)}>Clear</button>
    </div>
  }
/>
```

**Range picker:**
```tsx
const [range, setRange] = useState<[Date | null, Date | null]>([null, null])

<TimePicker.RangePicker
  value={range}
  onChange={setRange}
  format="HH:mm"
/>
```

**Range with 12-hour format:**
```tsx
<TimePicker.RangePicker use12Hours format="hh:mm A" />
```

**Range with disabled end:**
```tsx
<TimePicker.RangePicker
  disabled={[false, true]} // Start enabled, end disabled
  placeholder={['Select start', 'End disabled']}
/>
```

**Range with custom separator:**
```tsx
<TimePicker.RangePicker separator="→" />
<TimePicker.RangePicker separator={<span>to</span>} />
```

**Range without auto-ordering:**
```tsx
<TimePicker.RangePicker order={false} />
```

**Format strings:**
- `HH:mm` - 24-hour format, e.g., "14:30"
- `hh:mm A` - 12-hour format with AM/PM, e.g., "02:30 PM"
- `HH:mm:ss` - 24-hour with seconds, e.g., "14:30:45"
- `h:mm A` - 12-hour without leading zero, e.g., "2:30 PM"
- Custom combinations using: `HH`/`H` (24h), `hh`/`h` (12h), `mm`/`m` (min), `ss`/`s` (sec), `A`/`a` (AM/PM)

**Validation status:**
```tsx
<TimePicker status="error" />
<TimePicker status="warning" />
```

**Read-only input:**
```tsx
<TimePicker inputReadOnly /> {/* User must use picker, cannot type */}
```

**With prefix:**
```tsx
<TimePicker prefix={<ClockCircleOutlined />} />
```

</details>

---

<details>
<summary><strong>Timeline</strong> - Vertical and horizontal event sequence display</summary>

### Timeline

A component for displaying a sequence of events in chronological order. Supports vertical and horizontal layouts, left/right/alternate content modes, two dot variants (outlined/solid), custom dot nodes, per-item labels, a pending spinner item, and reverse order.

#### Import

```tsx
import { Timeline } from '@juanitte/inoui'
```

#### Props — `TimelineProps`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `TimelineItemType[]` | `[]` | Array of timeline events |
| `mode` | `'left' \| 'right' \| 'alternate'` | `'left'` | Content placement relative to the axis |
| `variant` | `'outlined' \| 'solid'` | `'outlined'` | Dot style — ring with bg or filled circle |
| `horizontal` | `boolean` | `false` | Render the timeline horizontally |
| `titleSpan` | `number` | — | Label column width as a 24-column fraction (e.g. `6` = 25%). Only applies in `alternate`/label mode |
| `pending` | `boolean \| ReactNode` | — | Append a spinning pending item; pass `ReactNode` for custom pending text |
| `pendingDot` | `ReactNode` | — | Custom dot for the pending item (replaces the default spinner) |
| `reverse` | `boolean` | `false` | Reverse the item order |
| `className` | `string` | — | Root CSS class |
| `style` | `CSSProperties` | — | Root inline style |
| `classNames` | `TimelineClassNames` | — | Semantic class names per slot |
| `styles` | `TimelineStyles` | — | Semantic inline styles per slot |

#### `TimelineItemType`

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Event content |
| `color` | `string` | Dot color — preset name or any CSS color |
| `dot` | `ReactNode` | Custom dot node (replaces the default circle) |
| `label` | `ReactNode` | Secondary label rendered on the opposite side of the axis |
| `position` | `'left' \| 'right'` | Override `mode` for this specific item |

#### Preset Dot Colors

| Name | Resolves to |
|------|-------------|
| `'blue'` / `'primary'` | `tokens.colorPrimary` |
| `'green'` / `'success'` | `tokens.colorSuccess` |
| `'red'` / `'error'` | `tokens.colorError` |
| `'gray'` | `tokens.colorTextMuted` |
| `'secondary'` | `tokens.colorSecondary` |
| `'warning'` | `tokens.colorWarning` |
| `'info'` | `tokens.colorInfo` |
| Any other string | Used as-is (hex, rgb, hsl…) |

#### Layout Details

| Mode | Layout | Three-column grid? |
|------|--------|--------------------|
| `'left'` (default) | Content on the right of the axis | No |
| `'right'` | Content on the left of the axis | No |
| `'alternate'` | Even items right, odd items left | Yes |
| Any mode + `label` present | Label opposite to content | Yes |
| `horizontal: true` | Items side-by-side with horizontal rail | — |

In three-column mode, `titleSpan` controls the label column width as a fraction of 24 units (same convention as CSS Grid / Ant Design).

#### Semantic DOM

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<div>` | Outer flex container |
| `item` | `<div>` | Per-event wrapper |
| `dot` | `<div>` | Dot or custom node |
| `tail` | `<div>` | Connecting line segment between dots |
| `content` | `<div>` | Main event content |
| `label` | `<div>` | Secondary label (opposite side) |

#### Examples

**1. Basic vertical (left mode)**

```tsx
<Timeline
  items={[
    { children: 'Create account' },
    { children: 'Verify email' },
    { children: 'Complete profile' },
    { children: 'Start using the app' },
  ]}
/>
```

---

**2. Semantic dot colors**

```tsx
<Timeline
  items={[
    { children: 'Deployed to production',    color: 'success' },
    { children: 'Failed smoke test',         color: 'error'   },
    { children: 'Waiting for review',        color: 'warning' },
    { children: 'PR opened',                 color: 'primary' },
  ]}
/>
```

---

**3. Custom hex color**

```tsx
<Timeline
  items={[
    { children: 'Design handoff', color: '#722ed1' },
    { children: 'Sprint kickoff', color: '#13c2c2' },
    { children: 'Retrospective',  color: '#fa8c16' },
  ]}
/>
```

---

**4. Solid variant**

```tsx
<Timeline
  variant="solid"
  items={[
    { children: 'Order placed',    color: 'primary' },
    { children: 'Payment confirmed', color: 'success' },
    { children: 'Shipped',         color: 'info'    },
  ]}
/>
```

---

**5. Custom dot node**

```tsx
import { ClockIcon, CheckIcon } from '@juanitte/inoui/icons'

<Timeline
  items={[
    { children: 'Scheduled',  dot: <ClockIcon style={{ color: tokens.colorWarning }} /> },
    { children: 'Completed',  dot: <CheckIcon style={{ color: tokens.colorSuccess }} /> },
    { children: 'In progress' },
  ]}
/>
```

---

**6. Right mode**

Content appears on the left of the axis.

```tsx
<Timeline
  mode="right"
  items={[
    { children: 'Step one' },
    { children: 'Step two' },
    { children: 'Step three' },
  ]}
/>
```

---

**7. Alternate mode**

```tsx
<Timeline
  mode="alternate"
  items={[
    { children: 'Event A — 9:00 am' },
    { children: 'Event B — 10:30 am' },
    { children: 'Event C — 12:00 pm' },
    { children: 'Event D — 2:00 pm' },
  ]}
/>
```

---

**8. Labels (timestamp opposite content)**

```tsx
<Timeline
  items={[
    { label: '09:00', children: 'Stand-up meeting' },
    { label: '11:30', children: 'Design review' },
    { label: '14:00', children: 'Sprint planning' },
    { label: '16:30', children: 'Code review' },
  ]}
/>
```

---

**9. Labels with `titleSpan`**

`titleSpan` accepts a value from 1–24. `6` gives the label column 25% of the width.

```tsx
<Timeline
  titleSpan={6}
  items={[
    { label: 'Jan 2023', children: 'Founded the company' },
    { label: 'Jun 2023', children: 'Closed seed round' },
    { label: 'Dec 2023', children: 'Launched v1.0' },
    { label: 'Mar 2024', children: 'Reached 10 k users' },
  ]}
/>
```

---

**10. Per-item position override**

```tsx
<Timeline
  mode="alternate"
  items={[
    { children: 'Normal alternate (right)' },
    { children: 'Normal alternate (left)' },
    { children: 'Forced right', position: 'right' },
    { children: 'Normal alternate (left)' },
  ]}
/>
```

---

**11. Pending item**

```tsx
<Timeline
  pending="Waiting for approval…"
  items={[
    { children: 'Submitted request',  color: 'success' },
    { children: 'Manager notified',   color: 'success' },
  ]}
/>
```

---

**12. Pending with custom dot**

```tsx
import { HourglassIcon } from '@juanitte/inoui/icons'

<Timeline
  pending="Processing…"
  pendingDot={<HourglassIcon style={{ color: tokens.colorWarning }} />}
  items={[
    { children: 'Payment received' },
    { children: 'Order queued' },
  ]}
/>
```

---

**13. Reverse order**

```tsx
<Timeline
  reverse
  items={[
    { children: 'Oldest event', color: 'gray' },
    { children: 'Middle event' },
    { children: 'Latest event', color: 'success' },
  ]}
/>
```

---

**14. Horizontal layout**

```tsx
<Timeline
  horizontal
  items={[
    { children: 'Order placed',   label: 'Day 1',  color: 'primary' },
    { children: 'Shipped',        label: 'Day 2',  color: 'info'    },
    { children: 'Out for delivery', label: 'Day 3', color: 'warning' },
    { children: 'Delivered',      label: 'Day 4',  color: 'success' },
  ]}
/>
```

---

**15. Rich content per item**

```tsx
<Timeline
  items={[
    {
      color: 'primary',
      children: (
        <div>
          <strong>Pull request merged</strong>
          <p style={{ margin: '0.25rem 0 0', color: tokens.colorTextMuted }}>
            feat: add Timeline component — by @alice
          </p>
        </div>
      ),
    },
    {
      color: 'success',
      children: (
        <div>
          <strong>CI passed</strong>
          <p style={{ margin: '0.25rem 0 0', color: tokens.colorTextMuted }}>
            All 142 tests green in 38 s
          </p>
        </div>
      ),
    },
    {
      color: 'info',
      children: (
        <div>
          <strong>Deployed to production</strong>
          <p style={{ margin: '0.25rem 0 0', color: tokens.colorTextMuted }}>
            v2.4.0 — 3 minutes ago
          </p>
        </div>
      ),
    },
  ]}
/>
```

---

**16. Semantic style customization**

```tsx
<Timeline
  items={[
    { children: 'Alpha', color: 'primary' },
    { children: 'Beta',  color: 'success' },
    { children: 'GA',    color: 'info'    },
  ]}
  styles={{
    tail:    { width: 3, backgroundColor: tokens.colorBorderHover },
    content: { fontWeight: 500 },
    label:   { fontStyle: 'italic' },
  }}
/>
```

</details>

---

<details>
<summary><strong>Toggle</strong> - Segmented control for exclusive option selection</summary>

### Toggle

A segmented control (also known as a segmented button or tab bar) that lets users pick one option from a set. The selected segment is indicated by a smoothly animated sliding thumb. Supports icons, disabled items, vertical layout, block mode, and full keyboard navigation.

#### Import

```tsx
import { Toggle } from '@juanitte/inoui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `(string \| number \| ToggleItemType)[]` | — | **Required.** Array of segments |
| `value` | `string \| number` | — | Controlled selected value |
| `defaultValue` | `string \| number` | first option | Uncontrolled initial value |
| `onChange` | `(value: string \| number) => void` | — | Called when selection changes |
| `disabled` | `boolean` | `false` | Disable all segments |
| `block` | `boolean` | `false` | Expand to full container width |
| `vertical` | `boolean` | `false` | Stack segments vertically |
| `size` | `'large' \| 'middle' \| 'small'` | `'middle'` | Size variant |
| `name` | `string` | — | HTML radio group name — enables native radio semantics and arrow key navigation |
| `className` | `string` | — | Root CSS class |
| `style` | `CSSProperties` | — | Root inline style |
| `classNames` | `ToggleClassNames` | — | Semantic class names per slot |
| `styles` | `ToggleStyles` | — | Semantic inline styles per slot |

#### Type Definitions

```ts
type ToggleSize = 'large' | 'middle' | 'small'

interface ToggleItemType {
  value: string | number
  label?: ReactNode       // Defaults to String(value) when no icon
  icon?: ReactNode        // Optional leading icon
  disabled?: boolean      // Disable this segment individually
  className?: string      // Per-item CSS class
}

type ToggleSemanticSlot = 'root' | 'item' | 'thumb'
type ToggleClassNames   = SemanticClassNames<ToggleSemanticSlot>
type ToggleStyles       = SemanticStyles<ToggleSemanticSlot>
```

#### Size Config

| Size | Height | Font size | H-Padding |
|------|--------|-----------|-----------|
| `'small'` | 1.5 rem | 0.75 rem | 0.4375 rem |
| `'middle'` | 2 rem | 0.875 rem | 0.6875 rem |
| `'large'` | 2.5 rem | 1 rem | 0.75 rem |

#### Keyboard Navigation

| Key | Action |
|-----|--------|
| `←` / `↑` | Move to previous enabled segment |
| `→` / `↓` | Move to next enabled segment |
| `Enter` / `Space` | Select focused segment |

Arrow direction adapts to the `vertical` prop: `↑`/`↓` for vertical, `←`/`→` for horizontal.

#### Semantic DOM

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<div>` | Track background and outer wrapper |
| `item` | `<div>` | Each individual segment |
| `thumb` | `<div>` | Animated sliding indicator behind selected segment |

#### Examples

**1. String shortcuts**

```tsx
<Toggle options={['Day', 'Week', 'Month']} />
```

---

**2. Number options**

```tsx
<Toggle options={[1, 7, 30]} defaultValue={7} />
```

---

**3. Controlled mode**

```tsx
const [period, setPeriod] = useState<string>('Week')

<Toggle
  options={['Day', 'Week', 'Month']}
  value={period}
  onChange={(v) => setPeriod(String(v))}
/>
```

---

**4. ToggleItemType objects**

```tsx
<Toggle
  options={[
    { value: 'day',   label: 'Day' },
    { value: 'week',  label: 'Week' },
    { value: 'month', label: 'Month' },
  ]}
  defaultValue="week"
/>
```

---

**5. With icons**

```tsx
import { ListIcon, GridIcon, MapIcon } from '@juanitte/inoui/icons'

<Toggle
  options={[
    { value: 'list', icon: <ListIcon />, label: 'List' },
    { value: 'grid', icon: <GridIcon />, label: 'Grid' },
    { value: 'map',  icon: <MapIcon />,  label: 'Map'  },
  ]}
  defaultValue="list"
/>
```

---

**6. Icon-only segments**

Omit `label` (and provide no fallback icon) to render icon-only buttons.

```tsx
<Toggle
  options={[
    { value: 'list', icon: <ListIcon /> },
    { value: 'grid', icon: <GridIcon /> },
    { value: 'map',  icon: <MapIcon />  },
  ]}
  defaultValue="list"
/>
```

---

**7. Size variants**

```tsx
<Toggle options={['A', 'B', 'C']} size="small"  />
<Toggle options={['A', 'B', 'C']} size="middle" />
<Toggle options={['A', 'B', 'C']} size="large"  />
```

---

**8. Block (full-width)**

```tsx
<Toggle
  options={['Left', 'Center', 'Right']}
  block
  defaultValue="Center"
/>
```

---

**9. Vertical layout**

```tsx
<Toggle
  options={['Top', 'Middle', 'Bottom']}
  vertical
  defaultValue="Middle"
/>
```

---

**10. Disabled — all segments**

```tsx
<Toggle options={['A', 'B', 'C']} disabled defaultValue="A" />
```

---

**11. Disabled — individual segments**

```tsx
<Toggle
  options={[
    { value: 'free',  label: 'Free' },
    { value: 'pro',   label: 'Pro' },
    { value: 'enterprise', label: 'Enterprise', disabled: true },
  ]}
  defaultValue="free"
/>
```

---

**12. Native form with `name`**

`name` wires a hidden `<input type="radio">` per segment, making the Toggle submittable inside a `<form>`.

```tsx
<form onSubmit={(e) => { e.preventDefault(); console.log(new FormData(e.currentTarget).get('view')) }}>
  <Toggle
    options={['Grid', 'List', 'Card']}
    name="view"
    defaultValue="Grid"
  />
  <button type="submit">Submit</button>
</form>
```

---

**13. Semantic style customization**

```tsx
<Toggle
  options={['Monthly', 'Annual']}
  defaultValue="Annual"
  styles={{
    root:  { backgroundColor: '#f0f5ff', borderRadius: '2rem' },
    item:  { fontWeight: 500 },
    thumb: { backgroundColor: '#1677ff', borderRadius: '2rem' },
  }}
/>
```

---

**14. Per-item className**

```tsx
<Toggle
  options={[
    { value: 'a', label: 'Alpha',   className: 'segment-alpha' },
    { value: 'b', label: 'Beta',    className: 'segment-beta'  },
    { value: 'c', label: 'Gamma',   className: 'segment-gamma' },
  ]}
  defaultValue="a"
/>
```

---

**15. View mode switcher — complete example**

```tsx
import { useState } from 'react'
import { Toggle } from '@juanitte/inoui'

type View = 'grid' | 'list' | 'map'

const VIEW_OPTIONS = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
  { value: 'map',  label: 'Map'  },
]

function ProductCatalog() {
  const [view, setView] = useState<View>('grid')

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <Toggle
          options={VIEW_OPTIONS}
          value={view}
          onChange={(v) => setView(v as View)}
        />
      </div>

      {view === 'grid' && <GridView />}
      {view === 'list' && <ListView />}
      {view === 'map'  && <MapView />}
    </div>
  )
}
```

</details>

---

<details>
<summary><strong>Tour</strong> - Step-by-step guided walkthrough with spotlight overlay</summary>

### Tour

`Tour` is a guided walkthrough component that highlights UI elements one by one using an SVG spotlight mask. It is ideal for onboarding flows, feature discovery, and interactive product demos. The popup card follows the highlighted element with 13 placement options, supports two visual themes, and offers full control over step navigation, indicators, and action buttons.

```tsx
import { Tour } from '@juanitte/inoui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `TourStepConfig[]` | — | Array of step configurations |
| `open` | `boolean` | — | Whether the tour is visible (controlled) |
| `current` | `number` | — | Active step index (controlled) |
| `onChange` | `(current: number) => void` | — | Called on step change |
| `onClose` | `() => void` | — | Called when the tour closes |
| `onFinish` | `() => void` | — | Called when the last step's Next button is clicked |
| `mask` | `boolean` | `true` | Show SVG spotlight mask |
| `arrow` | `boolean` | `true` | Show arrow pointing at the target |
| `type` | `TourType` | `'default'` | Card visual theme |
| `placement` | `TourPlacement` | `'bottom'` | Default popup placement (overridden per step) |
| `gap` | `{ offset?: number; radius?: number }` | `{ offset: 6, radius: 2 }` | Spotlight padding (px) and corner radius (px) |
| `closeIcon` | `ReactNode \| false` | — | Custom close icon; `false` hides it entirely |
| `disabledInteraction` | `boolean` | — | Block pointer events on the highlighted element |
| `scrollIntoViewOptions` | `boolean \| ScrollIntoViewOptions` | `true` | Auto-scroll target into view; `true` uses `{ block: 'center', behavior: 'instant' }` |
| `indicatorsRender` | `(current: number, total: number) => ReactNode` | — | Custom step indicator renderer |
| `actionsRender` | `(actions: ReactNode, info: ActionsInfo) => ReactNode` | — | Custom action buttons renderer (replaces footer buttons) |
| `zIndex` | `number` | `1001` | z-index for overlay and popup |
| `className` | `string` | — | CSS class on the popup card |
| `style` | `CSSProperties` | — | Inline style on the popup card |
| `classNames` | `TourClassNames` | — | Semantic class names per slot |
| `styles` | `TourStyles` | — | Semantic inline styles per slot |

#### TourStepConfig

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `target` | `HTMLElement \| (() => HTMLElement \| null) \| null` | — | Element to highlight; `null` centers the popup |
| `title` | `ReactNode` | — | Step title |
| `description` | `ReactNode` | — | Step body text |
| `cover` | `ReactNode` | — | Media content above the title (e.g. an image) |
| `placement` | `TourPlacement` | inherited | Override placement for this step |
| `arrow` | `boolean` | inherited | Override arrow visibility for this step |
| `mask` | `boolean` | inherited | Override mask visibility for this step |
| `type` | `TourType` | inherited | Override card theme for this step |
| `nextButtonProps` | `{ children?: ReactNode; onClick?: () => void }` | — | Customize the Next / Finish button |
| `prevButtonProps` | `{ children?: ReactNode; onClick?: () => void }` | — | Customize the Previous button |
| `scrollIntoViewOptions` | `boolean \| ScrollIntoViewOptions` | inherited | Override scroll behavior for this step |

#### Types

```ts
type TourPlacement =
  | 'center'
  | 'top' | 'topLeft' | 'topRight'
  | 'bottom' | 'bottomLeft' | 'bottomRight'
  | 'left' | 'leftTop' | 'leftBottom'
  | 'right' | 'rightTop' | 'rightBottom'

type TourType = 'default' | 'primary'

// actionsRender info argument
interface ActionsInfo {
  current: number
  total: number
  goTo: (step: number) => void
  close: () => void
}

// Semantic slots
type TourSemanticSlot =
  | 'root' | 'mask' | 'popup' | 'header'
  | 'title' | 'description' | 'footer'
  | 'arrow' | 'close' | 'cover' | 'indicators'

type TourClassNames = SemanticClassNames<TourSemanticSlot>
type TourStyles     = SemanticStyles<TourSemanticSlot>
```

#### Examples

**1. Basic guided tour**
```tsx
import { useRef, useState } from 'react'
import { Tour } from '@juanitte/inoui'

function App() {
  const btnRef  = useRef<HTMLButtonElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const steps = [
    {
      target: () => btnRef.current,
      title: 'Create a new item',
      description: 'Click here to start creating a new entry.',
    },
    {
      target: () => cardRef.current,
      title: 'Your results appear here',
      description: 'This card shows the output of your actions.',
      placement: 'right' as const,
    },
  ]

  return (
    <>
      <button ref={btnRef} onClick={() => {}}>New item</button>
      <div ref={cardRef} style={{ marginTop: 24 }}>Result card</div>
      <button onClick={() => setOpen(true)}>Start Tour</button>

      <Tour
        steps={steps}
        open={open}
        onClose={() => setOpen(false)}
        onFinish={() => setOpen(false)}
      />
    </>
  )
}
```

**2. Primary theme**
```tsx
<Tour
  steps={steps}
  open={open}
  type="primary"
  onClose={() => setOpen(false)}
  onFinish={() => setOpen(false)}
/>
```

**3. No mask (transparent overlay)**
```tsx
<Tour steps={steps} open={open} mask={false} onClose={() => setOpen(false)} onFinish={() => setOpen(false)} />
```

**4. Center placement — no target element**
```tsx
const steps = [
  {
    target: null,           // null → popup centers on the viewport
    title: 'Welcome to the App',
    description: 'This quick tour will walk you through the key features.',
    placement: 'center' as const,
  },
]
```

**5. Per-step overrides**
```tsx
const steps = [
  {
    target: () => step1Ref.current,
    title: 'Step 1 — Default',
    description: 'Uses the global type and mask settings.',
  },
  {
    target: () => step2Ref.current,
    title: 'Step 2 — Primary',
    description: 'This step overrides the card theme.',
    type: 'primary' as const,
    mask: false,
    arrow: false,
  },
]

<Tour steps={steps} open={open} type="default" mask onClose={close} onFinish={close} />
```

**6. Custom button labels per step**
```tsx
const steps = [
  {
    target: () => ref1.current,
    title: 'Introduction',
    nextButtonProps: { children: 'Get Started →' },
  },
  {
    target: () => ref2.current,
    title: 'Final Step',
    nextButtonProps: { children: 'Done ✓' },
    prevButtonProps: { children: '← Back' },
  },
]
```

**7. Custom step indicators**
```tsx
<Tour
  steps={steps}
  open={open}
  onClose={close}
  onFinish={close}
  indicatorsRender={(current, total) => (
    <span style={{ fontSize: 12, color: '#888' }}>
      Step {current + 1} of {total}
    </span>
  )}
/>
```

**8. Custom action buttons (actionsRender)**
```tsx
<Tour
  steps={steps}
  open={open}
  onClose={close}
  onFinish={close}
  actionsRender={(_actions, { current, total, goTo, close }) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {current > 0 && (
        <button onClick={() => goTo(current - 1)}>Back</button>
      )}
      <span>{current + 1} / {total}</span>
      {current < total - 1
        ? <button onClick={() => goTo(current + 1)}>Continue</button>
        : <button onClick={close}>Finish</button>
      }
    </div>
  )}
/>
```

**9. Disable interaction with highlighted element**
```tsx
// Prevents the user from clicking the highlighted button while the tour is active
<Tour
  steps={steps}
  open={open}
  disabledInteraction
  onClose={close}
  onFinish={close}
/>
```

**10. Cover image**
```tsx
const steps = [
  {
    target: () => featureRef.current,
    cover: <img src="/tour-preview.png" alt="Feature preview" style={{ width: '100%', borderRadius: 8 }} />,
    title: 'New Dashboard',
    description: 'Get a bird's-eye view of all your metrics.',
  },
]
```

**11. Hide close button**
```tsx
<Tour steps={steps} open={open} closeIcon={false} onFinish={close} />
```

**12. Controlled step navigation**
```tsx
const [open, setOpen]       = useState(false)
const [current, setCurrent] = useState(0)

<Tour
  steps={steps}
  open={open}
  current={current}
  onChange={setCurrent}
  onClose={() => { setOpen(false); setCurrent(0) }}
  onFinish={() => { setOpen(false); setCurrent(0) }}
/>
```

**13. Wider spotlight gap with rounded corners**
```tsx
<Tour
  steps={steps}
  open={open}
  gap={{ offset: 12, radius: 8 }}
  onClose={close}
  onFinish={close}
/>
```

**14. Custom scroll behavior**
```tsx
<Tour
  steps={steps}
  open={open}
  scrollIntoViewOptions={{ block: 'start', behavior: 'smooth' }}
  onClose={close}
  onFinish={close}
/>
```

**15. Full onboarding walkthrough**
```tsx
import { useRef, useState } from 'react'
import { Tour, Button } from '@juanitte/inoui'

export function OnboardingTour() {
  const navRef     = useRef<HTMLElement>(null)
  const searchRef  = useRef<HTMLInputElement>(null)
  const tableRef   = useRef<HTMLTableElement>(null)
  const settingRef = useRef<HTMLButtonElement>(null)

  const [open, setOpen]       = useState(false)
  const [current, setCurrent] = useState(0)

  const steps = [
    {
      target: () => navRef.current,
      title: 'Navigation',
      description: 'Use the sidebar to switch between sections.',
      placement: 'right' as const,
    },
    {
      target: () => searchRef.current,
      title: 'Global Search',
      description: 'Search across all records instantly.',
      type: 'primary' as const,
    },
    {
      target: () => tableRef.current,
      title: 'Data Table',
      description: 'Sort, filter, and paginate your data here.',
      placement: 'top' as const,
      nextButtonProps: { children: 'Almost done!' },
    },
    {
      target: () => settingRef.current,
      title: 'Settings',
      description: 'Customize your workspace from here.',
      nextButtonProps: { children: 'Finish Tour' },
    },
  ]

  const close = () => { setOpen(false); setCurrent(0) }

  return (
    <>
      <nav ref={navRef}>Sidebar</nav>
      <input ref={searchRef} placeholder="Search…" />
      <table ref={tableRef}><tbody><tr><td>Data</td></tr></tbody></table>
      <button ref={settingRef}>⚙ Settings</button>

      <Button onClick={() => { setCurrent(0); setOpen(true) }}>
        Start Onboarding
      </Button>

      <Tour
        steps={steps}
        open={open}
        current={current}
        onChange={setCurrent}
        onClose={close}
        onFinish={close}
        gap={{ offset: 8, radius: 4 }}
        scrollIntoViewOptions={{ block: 'center', behavior: 'smooth' }}
      />
    </>
  )
}
```

</details>

---

<details>
<summary><strong>Transfer</strong> - Dual-list item transfer</summary>

### Transfer

`Transfer` is a dual-list component that allows users to move items between two lists (source and target). It's commonly used for selecting multiple items from a large set, managing permissions, or organizing data between categories.

**Import:**
```tsx
import { Transfer } from '@juanitte/inoui';
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dataSource` | `TransferItem[]` | *required* | Complete data source for all items |
| `targetKeys` | `string[]` | `undefined` | Controlled keys of items in target list |
| `defaultTargetKeys` | `string[]` | `[]` | Initial keys of items in target list (uncontrolled mode) |
| `selectedKeys` | `string[]` | `undefined` | Controlled keys of currently selected items |
| `defaultSelectedKeys` | `string[]` | `[]` | Initial selected keys (uncontrolled mode) |
| `onChange` | `(targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => void` | `undefined` | Callback when items are transferred |
| `onSelectChange` | `(sourceSelectedKeys: string[], targetSelectedKeys: string[]) => void` | `undefined` | Callback when selection changes |
| `onSearch` | `(direction: TransferDirection, value: string) => void` | `undefined` | Callback when search input changes |
| `render` | `(record: TransferItem) => ReactNode` | `undefined` | Custom render function for items (defaults to `item.title`) |
| `disabled` | `boolean` | `false` | Whether the transfer is disabled |
| `showSearch` | `boolean` | `false` | Whether to show search boxes in both lists |
| `filterOption` | `(inputValue: string, item: TransferItem) => boolean` | Case-insensitive title match | Custom filter function for search |
| `titles` | `[ReactNode, ReactNode]` | `['Source', 'Target']` | Titles for source and target lists |
| `operations` | `[string, string]` | `undefined` | Custom text for operation buttons (defaults to arrow icons) |
| `showSelectAll` | `boolean` | `true` | Whether to show "select all" checkbox in headers |
| `oneWay` | `boolean` | `false` | One-way transfer mode (shows remove icons instead of left arrow) |
| `status` | `'error' \| 'warning'` | `undefined` | Validation status affecting border color |
| `footer` | `ReactNode \| ((props: { direction: TransferDirection }) => ReactNode)` | `undefined` | Footer content for lists (can be direction-specific function) |
| `pagination` | `boolean \| { pageSize?: number }` | `false` | Enable pagination (default pageSize: 10) |
| `listStyle` | `CSSProperties \| ((direction: TransferDirection) => CSSProperties)` | `undefined` | Custom styles for list panels (can be direction-specific function) |
| `className` | `string` | `undefined` | Root element class name |
| `style` | `CSSProperties` | `undefined` | Root element inline styles |
| `classNames` | `SemanticClassNames<TransferSemanticSlot>` | `undefined` | Semantic class names for component slots |
| `styles` | `SemanticStyles<TransferSemanticSlot>` | `undefined` | Semantic inline styles for component slots |

#### TransferItem Interface

```typescript
interface TransferItem {
  key: string;           // Unique identifier
  title: string;         // Display title (used for default rendering and search)
  description?: string;  // Optional description
  disabled?: boolean;    // Whether the item is disabled
  [key: string]: unknown; // Additional custom properties
}
```

#### TransferDirection Type

```typescript
type TransferDirection = 'left' | 'right';
```

#### Default Dimensions

- **List panel width**: 12rem (192px)
- **List panel height**: 18rem (288px)
- **Default pagination page size**: 10 items

#### Semantic DOM Slots

| Slot | Description |
|------|-------------|
| `root` | The root container wrapping both lists and operations |
| `list` | Individual list panel (applied to both source and target) |
| `header` | List header containing checkbox, title, and count |
| `search` | Search input container |
| `item` | Individual transfer item row |
| `operation` | Operation buttons container (transfer arrows) |

#### Examples

**Basic usage:**
```tsx
import { Transfer } from '@juanitte/inoui';

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

**With search:**
```tsx
<Transfer
  dataSource={dataSource}
  targetKeys={targetKeys}
  onChange={setTargetKeys}
  showSearch
  onSearch={(direction, value) => {
    console.log(`Searching ${direction} list:`, value);
  }}
/>
```

**Custom titles and operations:**
```tsx
<Transfer
  dataSource={dataSource}
  targetKeys={targetKeys}
  onChange={setTargetKeys}
  titles={['Available', 'Selected']}
  operations={['Add', 'Remove']}
/>
```

**Custom item rendering:**
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

**One-way transfer (with remove icons):**
```tsx
<Transfer
  dataSource={dataSource}
  targetKeys={targetKeys}
  onChange={setTargetKeys}
  oneWay
  titles={['All Items', 'My Selection']}
/>
```

**With pagination:**
```tsx
<Transfer
  dataSource={largeDataSource} // 100+ items
  targetKeys={targetKeys}
  onChange={setTargetKeys}
  pagination={{ pageSize: 15 }}
  showSearch
/>
```

**With custom filter:**
```tsx
<Transfer
  dataSource={dataSource}
  targetKeys={targetKeys}
  onChange={setTargetKeys}
  showSearch
  filterOption={(inputValue, item) => {
    // Custom search: check title and description
    const search = inputValue.toLowerCase();
    return (
      item.title.toLowerCase().includes(search) ||
      item.description?.toLowerCase().includes(search) ||
      false
    );
  }}
/>
```

**With footer:**
```tsx
<Transfer
  dataSource={dataSource}
  targetKeys={targetKeys}
  onChange={setTargetKeys}
  footer={(props) => (
    <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
      {props.direction === 'left' ? 'Select items to transfer' : 'Selected items'}
    </div>
  )}
/>
```

**With validation status:**
```tsx
<Transfer
  dataSource={dataSource}
  targetKeys={targetKeys}
  onChange={setTargetKeys}
  status={targetKeys.length === 0 ? 'error' : undefined}
/>
```

**Controlled selection:**
```tsx
const [targetKeys, setTargetKeys] = useState<string[]>([]);
const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

<Transfer
  dataSource={dataSource}
  targetKeys={targetKeys}
  selectedKeys={selectedKeys}
  onChange={(newTargetKeys, direction, moveKeys) => {
    console.log('Moved:', moveKeys, 'to', direction);
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
<summary><strong>Tree</strong> - Hierarchical tree view with selection, checkboxes, and drag-and-drop</summary>

### Tree

`Tree` is a hierarchical tree component for displaying and interacting with nested data. It supports node selection, checkbox checking with cascade propagation, expand/collapse with animations, `showLine` guides, custom icons, async data loading, drag-and-drop reordering, virtual scrolling for large datasets, and full keyboard navigation. The compound `Tree.DirectoryTree` variant is preconfigured with folder/file icons and click-to-expand behavior.

```tsx
import { Tree } from '@juanitte/inoui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `treeData` | `TreeData[]` | `[]` | Hierarchical data array |
| `fieldNames` | `TreeFieldNames` | — | Remap `key`, `title`, `children` field names |
| `checkable` | `boolean` | `false` | Show checkboxes on each node |
| `checkedKeys` | `(string \| number)[] \| TreeCheckedKeys` | — | Controlled checked keys |
| `defaultCheckedKeys` | `(string \| number)[]` | — | Initial checked keys (uncontrolled) |
| `checkStrictly` | `boolean` | `false` | Disable cascade check propagation to parents/children |
| `selectable` | `boolean` | `true` | Allow node selection |
| `selectedKeys` | `(string \| number)[]` | — | Controlled selected keys |
| `defaultSelectedKeys` | `(string \| number)[]` | — | Initial selected keys (uncontrolled) |
| `multiple` | `boolean` | `false` | Allow selecting multiple nodes simultaneously |
| `expandedKeys` | `(string \| number)[]` | — | Controlled expanded keys |
| `defaultExpandedKeys` | `(string \| number)[]` | — | Initial expanded keys (uncontrolled) |
| `defaultExpandAll` | `boolean` | `false` | Expand all nodes on mount |
| `autoExpandParent` | `boolean` | `false` | Auto-expand parent nodes of the initially expanded/selected keys |
| `showLine` | `boolean \| { showLeafIcon?: ReactNode }` | `false` | Show indent guide lines; optionally show a custom leaf icon |
| `showIcon` | `boolean` | `false` | Show node icons |
| `icon` | `ReactNode \| ((props) => ReactNode)` | — | Global icon for all nodes (overridden per-node by `TreeData.icon`) |
| `switcherIcon` | `ReactNode \| ((props) => ReactNode)` | — | Custom expand/collapse icon |
| `disabled` | `boolean` | `false` | Disable all nodes globally |
| `height` | `number` | — | Enable virtual scrolling with a fixed container height (px) |
| `titleRender` | `(node: TreeData) => ReactNode` | — | Custom renderer for node titles |
| `filterTreeNode` | `(node: TreeData) => boolean` | — | Highlight matching nodes (non-matching are dimmed) |
| `loadData` | `(node: TreeData) => Promise<void>` | — | Async child loader; called when expanding a non-leaf node |
| `draggable` | `boolean \| ((node) => boolean) \| { icon?, nodeDraggable? }` | `false` | Enable drag-and-drop; selectively enable per node |
| `onSelect` | `(keys, info: TreeSelectInfo) => void` | — | Called when a node is selected |
| `onCheck` | `(keys, info: TreeCheckInfo) => void` | — | Called when a checkbox is toggled |
| `onExpand` | `(keys, info: TreeExpandInfo) => void` | — | Called when a node is expanded or collapsed |
| `onDragStart` | `(info: TreeDragInfo) => void` | — | Drag start event |
| `onDragEnter` | `(info: TreeDragInfo) => void` | — | Drag enter event |
| `onDragOver` | `(info: TreeDragInfo) => void` | — | Drag over event |
| `onDragLeave` | `(info: TreeDragInfo) => void` | — | Drag leave event |
| `onDragEnd` | `(info: TreeDragInfo) => void` | — | Drag end event |
| `onDrop` | `(info: TreeDropInfo) => void` | — | Drop event |
| `onRightClick` | `(info: TreeRightClickInfo) => void` | — | Right-click / context menu on a node |
| `onLoad` | `(loadedKeys, info) => void` | — | Called after async data loading completes |
| `className` | `string` | — | CSS class on the root element |
| `style` | `CSSProperties` | — | Inline style on the root element |
| `classNames` | `TreeClassNames` | — | Semantic class names per slot |
| `styles` | `TreeStyles` | — | Semantic inline styles per slot |

#### TreeData

| Field | Type | Description |
|-------|------|-------------|
| `key` | `string \| number` | **Required.** Unique node identifier |
| `title` | `ReactNode` | Node label |
| `children` | `TreeData[]` | Child nodes |
| `disabled` | `boolean` | Disable selection and checking for this node |
| `disableCheckbox` | `boolean` | Disable checkbox only (node remains selectable) |
| `selectable` | `boolean` | Override selectability for this node |
| `checkable` | `boolean` | Override checkbox visibility for this node |
| `isLeaf` | `boolean` | Force leaf status (prevents async load trigger) |
| `icon` | `ReactNode \| ((props) => ReactNode)` | Per-node icon (overrides global `icon`) |

#### Callback types

```ts
interface TreeSelectInfo {
  selected: boolean
  selectedNodes: TreeData[]
  node: TreeData
  event: React.MouseEvent
}

interface TreeCheckInfo {
  checked: boolean
  checkedNodes: TreeData[]
  node: TreeData
  event: React.MouseEvent
  halfCheckedKeys: (string | number)[]
}

interface TreeExpandInfo {
  expanded: boolean
  node: TreeData
}

interface TreeDropInfo {
  event: React.DragEvent
  node: TreeData        // drop target
  dragNode: TreeData    // dragged node
  dropPosition: -1 | 0 | 1  // -1 = before, 0 = inside, 1 = after
  dropToGap: boolean    // true when dropPosition !== 0
}
```

#### Tree.DirectoryTree

`Tree.DirectoryTree` extends `Tree` with directory-style defaults: folder/file icons enabled, click-to-expand, and multi-selection on by default.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `expandAction` | `'click' \| 'doubleClick' \| false` | `'click'` | What triggers expand/collapse |

#### Semantic slots

```ts
type TreeSemanticSlot = 'root' | 'node' | 'nodeContent' | 'switcher' | 'checkbox' | 'title' | 'icon'
type TreeClassNames   = SemanticClassNames<TreeSemanticSlot>
type TreeStyles       = SemanticStyles<TreeSemanticSlot>
```

#### Keyboard navigation

| Key | Action |
|-----|--------|
| `↑` / `↓` | Move focus between visible nodes |
| `→` | Expand node, or move to first child if already expanded |
| `←` | Collapse node, or move to parent if already collapsed |
| `Enter` / `Space` | Toggle check (if `checkable`) or select the focused node |
| `Home` | Focus the first visible node |
| `End` | Focus the last visible node |

#### Examples

**1. Basic tree**
```tsx
import { Tree } from '@juanitte/inoui'

const data = [
  {
    key: '1',
    title: 'Animals',
    children: [
      { key: '1-1', title: 'Mammals', children: [
        { key: '1-1-1', title: 'Dog' },
        { key: '1-1-2', title: 'Cat' },
      ]},
      { key: '1-2', title: 'Birds', children: [
        { key: '1-2-1', title: 'Eagle' },
      ]},
    ],
  },
  {
    key: '2',
    title: 'Plants',
    children: [
      { key: '2-1', title: 'Flowers' },
      { key: '2-2', title: 'Trees' },
    ],
  },
]

<Tree treeData={data} defaultExpandedKeys={['1']} />
```

**2. Checkable with cascade propagation**
```tsx
const [checkedKeys, setCheckedKeys] = useState<string[]>([])

<Tree
  treeData={data}
  checkable
  checkedKeys={checkedKeys}
  onCheck={(keys) => setCheckedKeys(keys as string[])}
/>
```

**3. Multiple selection**
```tsx
<Tree treeData={data} multiple defaultExpandAll />
```

**4. Show guide lines**
```tsx
<Tree treeData={data} showLine defaultExpandAll />
```

**5. Show lines with custom leaf icon**
```tsx
import { FileOutlined } from 'some-icons'

<Tree
  treeData={data}
  showLine={{ showLeafIcon: <FileOutlined /> }}
  defaultExpandAll
/>
```

**6. Custom switcher icon**
```tsx
<Tree
  treeData={data}
  switcherIcon={({ expanded }) => (
    <span style={{ fontSize: 10 }}>{expanded ? '▼' : '▶'}</span>
  )}
/>
```

**7. Node icons**
```tsx
<Tree
  treeData={data}
  showIcon
  icon={({ isLeaf }) => isLeaf ? '📄' : '📁'}
/>
```

**8. Custom title renderer (with search highlight)**
```tsx
const [search, setSearch] = useState('')

<Tree
  treeData={data}
  titleRender={(node) => {
    const title = String(node.title)
    if (!search || !title.toLowerCase().includes(search.toLowerCase())) return title
    const idx = title.toLowerCase().indexOf(search.toLowerCase())
    return (
      <>
        {title.slice(0, idx)}
        <mark style={{ backgroundColor: '#ffe58f', padding: 0 }}>{title.slice(idx, idx + search.length)}</mark>
        {title.slice(idx + search.length)}
      </>
    )
  }}
  filterTreeNode={(node) =>
    String(node.title).toLowerCase().includes(search.toLowerCase())
  }
/>
```

**9. Disabled nodes**
```tsx
const data = [
  { key: '1', title: 'Enabled' },
  { key: '2', title: 'Disabled', disabled: true },
  { key: '3', title: 'Checkbox disabled', disableCheckbox: true },
]

<Tree treeData={data} checkable />
```

**10. Async data loading**
```tsx
const [treeData, setTreeData] = useState([
  { key: '1', title: 'Load children on expand' },
])

async function loadData(node: TreeData) {
  await new Promise(r => setTimeout(r, 1000))
  setTreeData(prev => [...prev].map(n =>
    n.key === node.key
      ? { ...n, children: [
          { key: `${node.key}-1`, title: `${node.title} - Child 1` },
          { key: `${node.key}-2`, title: `${node.title} - Child 2` },
        ]}
      : n,
  ))
}

<Tree treeData={treeData} loadData={loadData} />
```

**11. Virtual scrolling (large datasets)**
```tsx
const bigData = Array.from({ length: 1000 }, (_, i) => ({
  key: String(i),
  title: `Node ${i}`,
}))

<Tree treeData={bigData} height={400} />
```

**12. Drag-and-drop reorder**
```tsx
const [treeData, setTreeData] = useState(initialData)

function onDrop({ node, dragNode, dropPosition, dropToGap }: TreeDropInfo) {
  // Simple flat reorder for illustration
  const dragKey = dragNode.key
  const dropKey = node.key

  const flatten = (nodes: TreeData[]): TreeData[] =>
    nodes.flatMap(n => [n, ...flatten(n.children ?? [])])

  const flat = flatten(treeData)
  const dragIdx = flat.findIndex(n => n.key === dragKey)
  const dropIdx = flat.findIndex(n => n.key === dropKey)

  if (dragIdx === -1 || dropIdx === -1) return

  const newData = [...treeData]
  // Full reorder logic depends on your data structure
  console.log('Drop', dragKey, dropToGap ? 'gap' : 'into', dropKey, 'position', dropPosition)
}

<Tree treeData={treeData} draggable onDrop={onDrop} />
```

**13. Right-click context menu**
```tsx
const [menuNode, setMenuNode] = useState<TreeData | null>(null)

<Tree
  treeData={data}
  onRightClick={({ event, node }) => {
    event.preventDefault()
    setMenuNode(node)
  }}
/>
{menuNode && (
  <div style={{ position: 'fixed', background: '#fff', border: '1px solid #ccc', padding: '0.5rem' }}>
    <div>Rename {String(menuNode.title)}</div>
    <div>Delete</div>
  </div>
)}
```

**14. Custom field names**
```tsx
const data = [
  { id: 'a', label: 'Root', items: [
    { id: 'b', label: 'Child' },
  ]},
]

<Tree
  treeData={data as any}
  fieldNames={{ key: 'id', title: 'label', children: 'items' }}
/>
```

**15. Directory tree**
```tsx
import { Tree } from '@juanitte/inoui'

const files = [
  {
    key: 'src',
    title: 'src',
    children: [
      { key: 'src/components', title: 'components', children: [
        { key: 'src/components/Button.tsx', title: 'Button.tsx', isLeaf: true },
        { key: 'src/components/Input.tsx',  title: 'Input.tsx',  isLeaf: true },
      ]},
      { key: 'src/index.ts', title: 'index.ts', isLeaf: true },
    ],
  },
  { key: 'package.json', title: 'package.json', isLeaf: true },
]

<Tree.DirectoryTree treeData={files} defaultExpandAll />
```

**16. DirectoryTree with double-click to expand**
```tsx
<Tree.DirectoryTree
  treeData={files}
  expandAction="doubleClick"
  onSelect={(keys, { node }) => console.log('Selected:', node.title)}
/>
```

**17. Strictly independent checkboxes (no cascade)**
```tsx
const [checked, setChecked] = useState<string[]>([])

<Tree
  treeData={data}
  checkable
  checkStrictly
  checkedKeys={checked}
  onCheck={(keys) => {
    // keys is TreeCheckedKeys when checkStrictly=true
    const { checked: c } = keys as { checked: string[]; halfChecked: string[] }
    setChecked(c)
  }}
/>
```

**18. Semantic styles customization**
```tsx
<Tree
  treeData={data}
  styles={{
    root: { backgroundColor: '#fafafa', borderRadius: 8, padding: '0.5rem' },
    node: { borderRadius: 6 },
  }}
  defaultExpandAll
/>
```

</details>

---

<details>
<summary><strong>TreeSelect</strong> - Hierarchical tree selection</summary>

### TreeSelect

`TreeSelect` is a hierarchical tree selector component that allows users to select values from a tree structure. It supports single and multiple selection modes, checkboxes with cascading behavior, search filtering, lazy loading, and tree line visualization.

**Import:**
```tsx
import { TreeSelect } from '@juanitte/inoui';
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `treeData` | `TreeSelectTreeData[]` | `[]` | Hierarchical tree data source |
| `fieldNames` | `TreeSelectFieldNames` | `{ label: 'title', value: 'value', children: 'children' }` | Custom field name mapping |
| `value` | `string \| number \| (string \| number)[]` | `undefined` | Controlled value |
| `defaultValue` | `string \| number \| (string \| number)[]` | `''` or `[]` | Initial value (uncontrolled mode) |
| `onChange` | `(value: any, labelList: ReactNode[], extra: { triggerValue }) => void` | `undefined` | Callback when selection changes |
| `multiple` | `boolean` | `false` | Allow multiple selection (without checkboxes) |
| `treeCheckable` | `boolean` | `false` | Show checkboxes for selection |
| `treeCheckStrictly` | `boolean` | `false` | Independent checkbox selection (no cascading) |
| `showCheckedStrategy` | `'SHOW_ALL' \| 'SHOW_PARENT' \| 'SHOW_CHILD'` | `'SHOW_ALL'` | Strategy for displaying checked values |
| `treeDefaultExpandAll` | `boolean` | `false` | Expand all tree nodes by default |
| `treeDefaultExpandedKeys` | `(string \| number)[]` | `[]` | Default expanded node keys (uncontrolled) |
| `treeExpandedKeys` | `(string \| number)[]` | `undefined` | Controlled expanded node keys |
| `onTreeExpand` | `(expandedKeys: (string \| number)[]) => void` | `undefined` | Callback when tree expansion changes |
| `loadData` | `(node: TreeSelectTreeData) => Promise<void>` | `undefined` | Async load data for a node |
| `treeLine` | `boolean` | `false` | Show tree lines connecting nodes |
| `switcherIcon` | `ReactNode` | `undefined` | Custom expand/collapse icon |
| `showSearch` | `boolean` | `false` | Enable search input |
| `filterTreeNode` | `boolean \| ((inputValue: string, treeNode: TreeSelectTreeData) => boolean)` | `true` | Filter function for search (false disables) |
| `treeNodeFilterProp` | `string` | `'title'` | Property name to filter on |
| `allowClear` | `boolean` | `false` | Show clear button |
| `placeholder` | `string` | `undefined` | Placeholder text when empty |
| `disabled` | `boolean` | `false` | Whether the TreeSelect is disabled |
| `size` | `'large' \| 'middle' \| 'small'` | `'middle'` | Size of the selector |
| `variant` | `'outlined' \| 'filled' \| 'borderless' \| 'underlined'` | `'outlined'` | Visual variant |
| `status` | `'error' \| 'warning'` | `undefined` | Validation status |
| `placement` | `'bottomLeft' \| 'bottomRight' \| 'topLeft' \| 'topRight'` | `'bottomLeft'` | Dropdown placement |
| `maxCount` | `number` | `undefined` | Maximum number of selected items |
| `maxTagCount` | `number` | `undefined` | Maximum number of tags to display |
| `maxTagPlaceholder` | `ReactNode \| ((omittedValues) => ReactNode)` | `'+N'` | Placeholder for hidden tags |
| `tagRender` | `(props: TreeSelectTagRenderProps) => ReactNode` | `undefined` | Custom tag renderer |
| `notFoundContent` | `ReactNode` | `'No data'` | Content when no results found |
| `listHeight` | `number` | `256` | Dropdown max height in pixels |
| `popupMatchSelectWidth` | `boolean \| number` | `true` | Match dropdown width to selector |
| `dropdownRender` | `(menu: ReactNode) => ReactNode` | `undefined` | Custom dropdown content wrapper |
| `suffixIcon` | `ReactNode` | `<ChevronDownIcon />` | Custom suffix icon |
| `prefix` | `ReactNode` | `undefined` | Prefix element |
| `onSearch` | `(value: string) => void` | `undefined` | Callback when search input changes |
| `onDropdownVisibleChange` | `(open: boolean) => void` | `undefined` | Callback when dropdown visibility changes |
| `onClear` | `() => void` | `undefined` | Callback when clear button is clicked |
| `open` | `boolean` | `undefined` | Controlled dropdown open state |
| `className` | `string` | `undefined` | Root element class name |
| `style` | `CSSProperties` | `undefined` | Root element inline styles |
| `classNames` | `SemanticClassNames<TreeSelectSemanticSlot>` | `undefined` | Semantic class names |
| `styles` | `SemanticStyles<TreeSelectSemanticSlot>` | `undefined` | Semantic inline styles |

#### TreeSelectTreeData Interface

```typescript
interface TreeSelectTreeData {
  value: string | number;          // Unique node value
  title?: ReactNode;               // Display label
  children?: TreeSelectTreeData[]; // Child nodes
  disabled?: boolean;              // Disable entire node
  disableCheckbox?: boolean;       // Disable only checkbox
  selectable?: boolean;            // Whether node is selectable
  isLeaf?: boolean;                // Mark as leaf (for lazy loading)
  [key: string]: unknown;          // Additional custom properties
}
```

#### TreeSelectFieldNames Interface

```typescript
interface TreeSelectFieldNames {
  label?: string;    // Field name for display label (default: 'title')
  value?: string;    // Field name for value (default: 'value')
  children?: string; // Field name for children array (default: 'children')
}
```

#### TreeSelectTagRenderProps Interface

```typescript
interface TreeSelectTagRenderProps {
  label: ReactNode;
  value: string | number;
  closable: boolean;
  onClose: () => void;
}
```

#### Show Checked Strategy

- **`SHOW_ALL`**: Display all checked nodes (including parents and children)
- **`SHOW_PARENT`**: Only show parent nodes if all children are selected
- **`SHOW_CHILD`**: Only show leaf nodes (child nodes without children)

#### Size Configuration

| Size | Height | Font Size | Tag Height |
|------|--------|-----------|------------|
| `large` | 2.5rem (40px) | 1rem (16px) | 1.75rem |
| `middle` | 2.25rem (36px) | 0.875rem (14px) | 1.5rem |
| `small` | 1.75rem (28px) | 0.875rem (14px) | 1rem |

#### Semantic DOM Slots

| Slot | Description |
|------|-------------|
| `root` | The root container element |
| `selector` | The selector/input area where values are displayed |
| `dropdown` | The dropdown panel containing the tree |
| `tree` | The tree container |
| `node` | Individual tree node row |
| `tag` | Tag element (for multiple mode) |

#### Keyboard Navigation

- **Arrow Down/Up**: Navigate through visible tree nodes
- **Arrow Right**: Expand focused node
- **Arrow Left**: Collapse focused node
- **Enter**: Select/check focused node
- **Escape**: Close dropdown and clear search
- **Backspace**: Remove last tag (in multiple mode when search is empty)

#### Examples

**Basic usage:**
```tsx
import { TreeSelect } from '@juanitte/inoui';

const treeData = [
  {
    value: 'parent1',
    title: 'Parent 1',
    children: [
      { value: 'child1', title: 'Child 1' },
      { value: 'child2', title: 'Child 2' },
    ],
  },
  { value: 'parent2', title: 'Parent 2' },
];

<TreeSelect
  treeData={treeData}
  placeholder="Select node"
  onChange={(value, labels) => console.log('Selected:', value, labels)}
/>
```

**With checkboxes (cascading):**
```tsx
<TreeSelect
  treeData={treeData}
  treeCheckable
  placeholder="Select items"
  onChange={(values) => console.log('Checked:', values)}
/>
```

**Independent checkboxes (no cascading):**
```tsx
<TreeSelect
  treeData={treeData}
  treeCheckable
  treeCheckStrictly
  showCheckedStrategy={TreeSelect.SHOW_ALL}
/>
```

**Show only parent nodes:**
```tsx
<TreeSelect
  treeData={treeData}
  treeCheckable
  showCheckedStrategy={TreeSelect.SHOW_PARENT}
  placeholder="Select categories"
/>
```

**Show only leaf nodes:**
```tsx
<TreeSelect
  treeData={treeData}
  treeCheckable
  showCheckedStrategy={TreeSelect.SHOW_CHILD}
  placeholder="Select items"
/>
```

**With search:**
```tsx
<TreeSelect
  treeData={treeData}
  showSearch
  placeholder="Search and select"
  onSearch={(value) => console.log('Searching:', value)}
/>
```

**Custom search filter:**
```tsx
<TreeSelect
  treeData={treeData}
  showSearch
  filterTreeNode={(input, node) => {
    return node.title?.toString().toLowerCase().includes(input.toLowerCase()) || false;
  }}
/>
```

**With tree lines:**
```tsx
<TreeSelect
  treeData={treeData}
  treeLine
  treeDefaultExpandAll
  placeholder="Select with tree lines"
/>
```

**Lazy loading:**
```tsx
const [treeData, setTreeData] = useState([
  { value: '0', title: 'Node 0', isLeaf: false },
]);

const loadData = async (node) => {
  // Simulate async load
  await new Promise(resolve => setTimeout(resolve, 1000));

  const children = [
    { value: `${node.value}-0`, title: `Child ${node.value}-0`, isLeaf: true },
    { value: `${node.value}-1`, title: `Child ${node.value}-1`, isLeaf: true },
  ];

  // Update treeData to add children to this node
  setTreeData(prev => updateTreeData(prev, node.value, children));
};

<TreeSelect
  treeData={treeData}
  loadData={loadData}
  placeholder="Lazy load nodes"
/>
```

**Multiple selection without checkboxes:**
```tsx
<TreeSelect
  treeData={treeData}
  multiple
  placeholder="Select multiple"
  maxTagCount={3}
  maxTagPlaceholder={(omitted) => `+${omitted.length} more`}
/>
```

**Custom field names:**
```tsx
const customData = [
  {
    id: '1',
    name: 'Parent',
    items: [
      { id: '1-1', name: 'Child 1' },
      { id: '1-2', name: 'Child 2' },
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

**With custom tag render:**
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

**Disabled nodes:**
```tsx
const dataWithDisabled = [
  {
    value: 'parent1',
    title: 'Parent 1',
    children: [
      { value: 'child1', title: 'Child 1' },
      { value: 'child2', title: 'Child 2 (disabled)', disabled: true },
    ],
  },
];

<TreeSelect treeData={dataWithDisabled} />
```

**With validation status:**
```tsx
<TreeSelect
  treeData={treeData}
  status="error"
  placeholder="Select required field"
/>
```

</details>

---

<details>
<summary><strong>Upload</strong> - File upload</summary>

### Upload

`Upload` is a file upload component that supports multiple file selection, drag-and-drop, progress tracking, preview, and custom upload requests. It provides different display modes including text lists, picture thumbnails, and card layouts.

**Import:**
```tsx
import { Upload } from '@juanitte/inoui';
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `accept` | `string` | `undefined` | Accepted file types (e.g., `'image/*'`, `'.pdf,.doc'`) |
| `action` | `string \| ((file: UploadFile) => Promise<string>)` | `undefined` | Upload URL or async function returning URL |
| `beforeUpload` | `(file: File, fileList: File[]) => boolean \| string \| Promise<File \| boolean \| void> \| void` | `undefined` | Pre-upload validation hook |
| `customRequest` | `(options: UploadRequestOption) => { abort: () => void } \| void` | Built-in XMLHttpRequest | Custom upload implementation |
| `data` | `Record<string, unknown> \| ((file: UploadFile) => Record<string, unknown> \| Promise<...>)` | `undefined` | Additional data to send with upload |
| `defaultFileList` | `UploadFile[]` | `[]` | Initial file list (uncontrolled mode) |
| `fileList` | `UploadFile[]` | `undefined` | Controlled file list |
| `directory` | `boolean` | `false` | Enable folder/directory upload |
| `disabled` | `boolean` | `false` | Whether upload is disabled |
| `headers` | `Record<string, string>` | `undefined` | Custom HTTP headers for upload request |
| `listType` | `'text' \| 'picture' \| 'picture-card' \| 'picture-circle'` | `'text'` | Display style of file list |
| `maxCount` | `number` | `undefined` | Maximum number of files allowed |
| `method` | `string` | `'post'` | HTTP method for upload |
| `multiple` | `boolean` | `false` | Allow multiple file selection |
| `name` | `string` | `'file'` | Name of file parameter sent to backend |
| `openFileDialogOnClick` | `boolean` | `true` | Open file dialog when clicking trigger |
| `showUploadList` | `ShowUploadListConfig` | `true` | Show/configure file list display |
| `withCredentials` | `boolean` | `false` | Include credentials in CORS requests |
| `progress` | `UploadProgressConfig` | `undefined` | Progress bar configuration |
| `itemRender` | `(originNode, file, fileList, actions) => ReactNode` | `undefined` | Custom file list item renderer |
| `onChange` | `(info: UploadChangeParam) => void` | `undefined` | Callback when upload state changes |
| `onPreview` | `(file: UploadFile) => void` | `undefined` | Callback when preview icon is clicked |
| `onDownload` | `(file: UploadFile) => void` | `undefined` | Callback when download icon is clicked |
| `onRemove` | `(file: UploadFile) => boolean \| Promise<boolean> \| void` | `undefined` | Callback before file removal (return false to prevent) |
| `onDrop` | `(event: DragEvent) => void` | `undefined` | Callback when files are dropped |
| `children` | `ReactNode` | `undefined` | Custom trigger element |
| `className` | `string` | `undefined` | Root element class name |
| `style` | `CSSProperties` | `undefined` | Root element inline styles |
| `classNames` | `SemanticClassNames<UploadSemanticSlot>` | `undefined` | Semantic class names |
| `styles` | `SemanticStyles<UploadSemanticSlot>` | `undefined` | Semantic inline styles |

#### UploadFile Interface

```typescript
interface UploadFile<T = any> {
  uid: string;                 // Unique identifier
  name: string;                // File name
  status?: UploadFileStatus;   // 'uploading' | 'done' | 'error' | 'removed'
  percent?: number;            // Upload progress (0-100)
  thumbUrl?: string;           // Thumbnail URL
  url?: string;                // File URL after upload
  type?: string;               // MIME type
  size?: number;               // File size in bytes
  originFileObj?: File;        // Original File object
  response?: T;                // Server response
  error?: any;                 // Error object if upload failed
  crossOrigin?: '' | 'anonymous' | 'use-credentials';
  preview?: string;            // Base64 preview for images
}
```

#### ShowUploadListConfig Type

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

#### UploadProgressConfig Interface

```typescript
interface UploadProgressConfig {
  strokeColor?: string;
  strokeWidth?: number;
  format?: (percent: number, file: UploadFile) => ReactNode;
}
```

#### UploadRef Interface

```typescript
interface UploadRef {
  upload: (file?: UploadFile) => void;  // Manually trigger upload
  nativeElement: HTMLDivElement | null;
}
```

#### Semantic DOM Slots

| Slot | Description |
|------|-------------|
| `root` | The root container element |
| `trigger` | The clickable trigger element |
| `dragger` | Drag-and-drop area (Upload.Dragger) |
| `list` | File list container |
| `item` | Individual file list item |
| `itemActions` | Action buttons container for each item |
| `thumbnail` | Thumbnail image or icon |

#### beforeUpload Return Values

- `false`: Prevent upload but add file to list
- `Upload.LIST_IGNORE`: Don't add file to list at all
- `Promise<File>`: Transform file before upload
- `Promise<false>`: Async validation to prevent upload

#### Examples

**Basic usage:**
```tsx
import { Upload, Button } from '@juanitte/inoui';

<Upload
  action="/api/upload"
  onChange={(info) => {
    if (info.file.status === 'done') {
      console.log('Upload success:', info.file.response);
    } else if (info.file.status === 'error') {
      console.log('Upload failed:', info.file.error);
    }
  }}
>
  <Button>Click to Upload</Button>
</Upload>
```

**Picture list:**
```tsx
<Upload
  action="/api/upload"
  listType="picture"
  defaultFileList={[
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://example.com/image.png',
    },
  ]}
>
  <Button>Upload Image</Button>
</Upload>
```

**Picture card (grid layout):**
```tsx
<Upload
  action="/api/upload"
  listType="picture-card"
  maxCount={4}
>
  <div>
    <PlusIcon />
    <div>Upload</div>
  </div>
</Upload>
```

**Drag and drop:**
```tsx
<Upload.Dragger
  action="/api/upload"
  multiple
  onChange={(info) => console.log('Files:', info.fileList)}
>
  <p>Click or drag files to this area to upload</p>
  <p>Support for single or bulk upload</p>
</Upload.Dragger>
```

**With file type restriction:**
```tsx
<Upload
  action="/api/upload"
  accept="image/*"
  beforeUpload={(file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      console.error('You can only upload JPG/PNG files!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      console.error('Image must be smaller than 2MB!');
      return false;
    }
    return true;
  }}
>
  <Button>Upload Image (JPG/PNG, max 2MB)</Button>
</Upload>
```

**Controlled file list:**
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
  <Button>Upload</Button>
</Upload>
```

**Manual upload trigger:**
```tsx
const uploadRef = useRef<UploadRef>(null);
const [fileList, setFileList] = useState<UploadFile[]>([]);

<>
  <Upload
    ref={uploadRef}
    action="/api/upload"
    fileList={fileList}
    onChange={({ fileList }) => setFileList(fileList)}
    beforeUpload={() => false} // Prevent auto-upload
  >
    <Button>Select File</Button>
  </Upload>
  <Button
    onClick={() => uploadRef.current?.upload()}
    disabled={fileList.length === 0}
  >
    Start Upload
  </Button>
</>
```

**Custom request:**
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
  <Button>Upload with Custom Request</Button>
</Upload>
```

**With custom progress display:**
```tsx
<Upload
  action="/api/upload"
  progress={{
    strokeWidth: 3,
    strokeColor: '#52c41a',
    format: (percent) => `${Math.round(percent)}% uploaded`,
  }}
>
  <Button>Upload with Custom Progress</Button>
</Upload>
```

**Dynamic upload URL:**
```tsx
<Upload
  action={async (file) => {
    // Get presigned URL from server
    const response = await fetch('/api/get-upload-url', {
      method: 'POST',
      body: JSON.stringify({ filename: file.name }),
    });
    const { url } = await response.json();
    return url;
  }}
>
  <Button>Upload to Dynamic URL</Button>
</Upload>
```

**With preview modal:**
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
    <div>Upload</div>
  </Upload>
  {previewVisible && (
    <Modal open onClose={() => setPreviewVisible(false)}>
      <img src={previewUrl} alt="preview" style={{ width: '100%' }} />
    </Modal>
  )}
</>
```

**Directory upload:**
```tsx
<Upload
  action="/api/upload"
  directory
  multiple
  onChange={(info) => {
    console.log('Uploaded directory files:', info.fileList);
  }}
>
  <Button>Upload Folder</Button>
</Upload>
```

**Transform file before upload:**
```tsx
<Upload
  action="/api/upload"
  beforeUpload={async (file) => {
    // Compress image before upload
    if (file.type.startsWith('image/')) {
      const compressed = await compressImage(file);
      return compressed;
    }
    return file;
  }}
>
  <Button>Upload (Auto-compress images)</Button>
</Upload>
```

</details>

---

<details>
<summary><strong>Waterfall</strong> - Masonry/Pinterest-style grid layout</summary>

### Waterfall

A masonry-style layout component that distributes items into columns based on available height, creating a Pinterest-like waterfall effect.

#### Import

```tsx
import { Waterfall } from '@juanitte/inoui'
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

`Waterfall` uses the shared `Breakpoint` type from [Utils](#utils). See [Breakpoint Utilities](#breakpoint-utilities) for type definitions and importable constants.

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
<summary><strong>Watermark</strong> - Tiled text or image watermark overlay</summary>

### Watermark

`Watermark` renders a repeating, non-interactive overlay on top of its children. The watermark tile is generated on an offscreen `<canvas>` (DPR-aware) and applied as a CSS `background-image` repeat pattern. Supports text (single or multi-line) and image sources, rotation, tile spacing, and font customisation.

```tsx
import { Watermark } from '@juanitte/inoui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string \| string[]` | — | Text watermark. Pass an array for multi-line text |
| `image` | `string` | — | Image URL. Takes priority over `content` when provided |
| `rotate` | `number` | `-22` | Rotation angle in degrees |
| `width` | `number` | `120` | Content area width of each tile in px |
| `height` | `number` | `64` | Content area height of each tile in px |
| `gap` | `[number, number]` | `[100, 100]` | `[gapX, gapY]` — spacing between tiles in px |
| `offset` | `[number, number]` | `[0, 0]` | `[offsetX, offsetY]` — `background-position` shift in px |
| `zIndex` | `number` | `9` | z-index of the watermark overlay |
| `font` | `WatermarkFont` | — | Font options for text watermarks |
| `children` | `ReactNode` | — | Content rendered underneath the watermark |
| `className` | `string` | — | CSS class on the root wrapper |
| `style` | `CSSProperties` | — | Inline style on the root wrapper |
| `classNames` | `WatermarkClassNames` | — | Semantic class names per slot |
| `styles` | `WatermarkStyles` | — | Semantic inline styles per slot |

#### WatermarkFont

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `color` | `string` | theme `colorText` at 15 % opacity | Text color. Accepts any CSS color or `rgba()`. When the resolved color has no alpha channel, `globalAlpha = 0.15` is applied automatically |
| `fontSize` | `number` | `16` | Font size in px |
| `fontWeight` | `'normal' \| 'lighter' \| 'bold' \| 'bolder' \| number` | `'normal'` | Font weight |
| `fontStyle` | `'none' \| 'normal' \| 'italic' \| 'oblique'` | `'normal'` | Font style |
| `fontFamily` | `string` | `'sans-serif'` | Font family |

#### Types

```ts
interface WatermarkFont {
  color?:      string
  fontSize?:   number
  fontWeight?: 'normal' | 'lighter' | 'bold' | 'bolder' | number
  fontStyle?:  'none' | 'normal' | 'italic' | 'oblique'
  fontFamily?: string
}

type WatermarkSemanticSlot = 'root' | 'watermark'
type WatermarkClassNames   = SemanticClassNames<WatermarkSemanticSlot>
type WatermarkStyles       = SemanticStyles<WatermarkSemanticSlot>
```

#### Behaviour

- The root wrapper is `position: relative`; the watermark overlay is `position: absolute; inset: 0; pointer-events: none` so it never blocks clicks or selection.
- The canvas tile size is `(width + gapX) × (height + gapY)`. Content is drawn centred inside the tile, then rotated at the tile centre.
- **Image mode:** loaded with `crossOrigin="anonymous"`. If the image fails to load, no watermark is shown.
- **CSS variables:** if `font.color` is a CSS variable (e.g. `var(--j-color-text)`), it is resolved to its computed RGB value before drawing on the canvas.
- The canvas is scaled by `window.devicePixelRatio` for crisp rendering on high-DPI displays.
- The watermark re-generates whenever any relevant prop changes.

#### Examples

**1. Text watermark**
```tsx
<Watermark content="Confidential">
  <div style={{ height: 300, background: '#fafafa' }} />
</Watermark>
```

**2. Multi-line text**
```tsx
<Watermark content={['ACME Corp', 'Internal use only']}>
  <div style={{ height: 300 }} />
</Watermark>
```

**3. Image watermark**
```tsx
<Watermark image="/logo.png" width={80} height={40}>
  <div style={{ height: 300 }} />
</Watermark>
```

**4. Custom rotation**
```tsx
<Watermark content="Draft" rotate={-45}>
  <div style={{ height: 300 }} />
</Watermark>
```

**5. Custom font**
```tsx
<Watermark
  content="Confidential"
  font={{
    color: 'rgba(220, 0, 0, 0.2)',
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontFamily: 'Georgia, serif',
  }}
>
  <div style={{ height: 300 }} />
</Watermark>
```

**6. Tile spacing**
```tsx
<Watermark content="Draft" gap={[60, 60]}>
  <div style={{ height: 300 }} />
</Watermark>
```

**7. Tile size**
```tsx
<Watermark content="Internal" width={160} height={80}>
  <div style={{ height: 300 }} />
</Watermark>
```

**8. z-index control**
```tsx
<Watermark content="Preview" zIndex={100}>
  <div style={{ height: 300 }} />
</Watermark>
```

**9. Wrapping real content**
```tsx
<Watermark content="Confidential">
  <article>
    <h2>Annual Report 2025</h2>
    <p>Financial summary…</p>
  </article>
</Watermark>
```

**10. Semantic styles**
```tsx
<Watermark
  content="Draft"
  styles={{
    root:      { borderRadius: 8, overflow: 'hidden' },
    watermark: { opacity: 0.5 },
  }}
>
  <div style={{ height: 300 }} />
</Watermark>
```

</details>

---

<details>
<summary><strong>Tooltip</strong> - Lightweight hover tooltips with 12 placements and color presets</summary>

### Tooltip

A lightweight tooltip component for displaying additional information on hover or focus. Renders into a portal (`document.body`), supports 12 placements, auto-flip on viewport overflow, an optional arrow with `pointAtCenter` mode, and colorful presets.

#### Import

```tsx
import { Tooltip } from '@juanitte/inoui'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `ReactNode` | — | **Required.** Tooltip content |
| `children` | `ReactNode` | — | **Required.** Trigger element |
| `placement` | `TooltipPlacement` | `'top'` | Preferred placement — 12 options |
| `position` | `TooltipPlacement` | — | **Deprecated.** Use `placement` instead |
| `arrow` | `boolean \| { pointAtCenter: boolean }` | `true` | Show arrow; pass `{ pointAtCenter: true }` to center it on corner placements |
| `color` | `string` | — | Preset color name or any CSS color — colorizes the tooltip background |
| `autoAdjustOverflow` | `boolean` | `true` | Flip to the opposite side when the tooltip overflows the viewport |
| `delay` | `number` | `200` | Delay before showing (ms) |
| `disabled` | `boolean` | `false` | Disable tooltip |
| `className` | `string` | — | Root CSS class |
| `style` | `CSSProperties` | — | Root inline style |
| `classNames` | `TooltipClassNames` | — | Semantic class names per slot |
| `styles` | `TooltipStyles` | — | Semantic inline styles per slot |

#### Type Definitions

```ts
type TooltipPlacement =
  | 'top' | 'topLeft' | 'topRight'
  | 'bottom' | 'bottomLeft' | 'bottomRight'
  | 'left' | 'leftTop' | 'leftBottom'
  | 'right' | 'rightTop' | 'rightBottom'

type TooltipSemanticSlot = 'root' | 'popup' | 'arrow'
type TooltipClassNames   = SemanticClassNames<TooltipSemanticSlot>
type TooltipStyles       = SemanticStyles<TooltipSemanticSlot>
```

#### Placements

All 12 placements relative to the trigger element:

```
         topLeft   top   topRight
  leftTop  ┌─────────────────┐  rightTop
  left     │    trigger      │  right
  leftBottom └─────────────────┘  rightBottom
       bottomLeft  bottom  bottomRight
```

#### Preset Colors

| Name | Hex |
|------|-----|
| `'blue'` | `#1677ff` |
| `'geekblue'` | `#2f54eb` |
| `'purple'` | `#722ed1` |
| `'cyan'` | `#13c2c2` |
| `'green'` | `#52c41a` |
| `'lime'` | `#a0d911` |
| `'yellow'` | `#fadb14` |
| `'gold'` | `#faad14` |
| `'orange'` | `#fa8c16` |
| `'volcano'` | `#fa541c` |
| `'red'` | `#f5222d` |
| `'pink'` / `'magenta'` | `#eb2f96` |

Any other string is used as-is (hex, rgb, hsl…).

#### Semantic DOM

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<div>` | Inline wrapper around the trigger element |
| `popup` | `<div>` | Tooltip popup — portaled to `document.body` |
| `arrow` | `<div>` | Arrow pointing at the trigger |

#### Examples

**1. Basic**

```tsx
<Tooltip content="This is a tooltip">
  <Button>Hover me</Button>
</Tooltip>
```

---

**2. All 12 placements**

```tsx
<Tooltip content="Top center"       placement="top">          <Button>top</Button>          </Tooltip>
<Tooltip content="Top left"         placement="topLeft">      <Button>topLeft</Button>      </Tooltip>
<Tooltip content="Top right"        placement="topRight">     <Button>topRight</Button>     </Tooltip>
<Tooltip content="Bottom center"    placement="bottom">       <Button>bottom</Button>       </Tooltip>
<Tooltip content="Bottom left"      placement="bottomLeft">   <Button>bottomLeft</Button>   </Tooltip>
<Tooltip content="Bottom right"     placement="bottomRight">  <Button>bottomRight</Button>  </Tooltip>
<Tooltip content="Left center"      placement="left">         <Button>left</Button>         </Tooltip>
<Tooltip content="Left top"         placement="leftTop">      <Button>leftTop</Button>      </Tooltip>
<Tooltip content="Left bottom"      placement="leftBottom">   <Button>leftBottom</Button>   </Tooltip>
<Tooltip content="Right center"     placement="right">        <Button>right</Button>        </Tooltip>
<Tooltip content="Right top"        placement="rightTop">     <Button>rightTop</Button>     </Tooltip>
<Tooltip content="Right bottom"     placement="rightBottom">  <Button>rightBottom</Button>  </Tooltip>
```

---

**3. No arrow**

```tsx
<Tooltip content="No arrow" arrow={false}>
  <Button>Hover</Button>
</Tooltip>
```

---

**4. Arrow pointing at center (corner placements)**

```tsx
<Tooltip content="Centered arrow" placement="topLeft" arrow={{ pointAtCenter: true }}>
  <Button>topLeft + pointAtCenter</Button>
</Tooltip>
```

---

**5. Preset color**

```tsx
<Tooltip content="Success action" color="green">
  <Button>Green</Button>
</Tooltip>

<Tooltip content="Danger zone" color="red">
  <Button>Red</Button>
</Tooltip>

<Tooltip content="Information" color="blue">
  <Button>Blue</Button>
</Tooltip>
```

---

**6. Custom CSS color**

```tsx
<Tooltip content="Brand tooltip" color="#722ed1">
  <Button>Custom purple</Button>
</Tooltip>
```

---

**7. Disable auto-flip**

```tsx
<Tooltip content="Always on top" placement="top" autoAdjustOverflow={false}>
  <Button>No flip</Button>
</Tooltip>
```

---

**8. Custom delay**

```tsx
<Tooltip content="Instant" delay={0}>
  <Button>No delay</Button>
</Tooltip>

<Tooltip content="Slow reveal" delay={800}>
  <Button>800 ms delay</Button>
</Tooltip>
```

---

**9. Disabled**

```tsx
<Tooltip content="Won't show" disabled>
  <Button>Disabled tooltip</Button>
</Tooltip>
```

---

**10. Rich content**

```tsx
<Tooltip
  content={
    <div>
      <strong>Keyboard shortcut</strong>
      <p style={{ margin: '0.25rem 0 0', opacity: 0.85 }}>⌘ + K to open command palette</p>
    </div>
  }
  placement="bottom"
>
  <Button>Hover for shortcut</Button>
</Tooltip>
```

---

**11. Semantic style customization**

```tsx
<Tooltip
  content="Styled tooltip"
  styles={{
    popup: { borderRadius: '0.75rem', fontSize: '0.75rem', padding: '0.375rem 0.625rem' },
  }}
>
  <Button>Custom style</Button>
</Tooltip>
```

---

**12. Wrapping a disabled element**

Disabled elements do not fire mouse events. Wrap them in a `<span>` so the Tooltip trigger receives events correctly.

```tsx
<Tooltip content="Button is disabled">
  <span style={{ display: 'inline-flex' }}>
    <Button disabled>Submit</Button>
  </span>
</Tooltip>
```

#### Accessibility

- Shows on `mouseenter` and `focus`
- Hides on `mouseleave` and `blur`
- Popup has `role="tooltip"`
- Repositions on scroll and window resize while visible

</details>

---

## License

MIT License - see [LICENSE](./LICENSE) for details.
