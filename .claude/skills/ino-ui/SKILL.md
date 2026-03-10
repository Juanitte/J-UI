---
name: ino-ui
description: Guide for building UIs with the Ino-UI React component library (@juanitte/inoui). Use when creating pages, forms, layouts, or any UI work with Ino-UI components.
---

# Ino-UI — React Component Library

**Package:** `@juanitte/inoui` | **React 18/19** | **TypeScript** | **60+ components**

## Setup

```tsx
// 1. Import CSS once in app entry
import '@juanitte/inoui/styles.css'

// 2. Wrap app with ThemeProvider
import { ThemeProvider } from '@juanitte/inoui'

function App() {
  return (
    <ThemeProvider config={{ defaultMode: 'light', colors: { primary: '#8c75d1' } }}>
      <YourApp />
    </ThemeProvider>
  )
}

// 3. Import components as needed
import { Button, Input, Modal, Table, Form, Select } from '@juanitte/inoui'
```

## Theme System

### ThemeProvider config

```ts
interface ThemeConfig {
  defaultMode?: 'light' | 'dark'
  colors?: {
    primary?: string    // '#8c75d1'
    secondary?: string  // '#78808b'
    success?: string    // '#79bc58'
    warning?: string    // '#d5ac59'
    error?: string      // '#d7595b'
    info?: string       // '#6591c7'
  }
}
```

### useTheme hook

```tsx
const { mode, setMode, toggleMode } = useTheme()
```

### CSS Variables (auto-generated per color)

```css
var(--j-primary)           /* base */
var(--j-primary-50)...(--j-primary-900)  /* 10 shades */
var(--j-primary-hover)     var(--j-primary-border)
var(--j-primary-light)     var(--j-primary-dark)
var(--j-primary-contrast)
/* Neutrals (adapt to light/dark): */
var(--j-bg)  var(--j-bgSubtle)  var(--j-bgMuted)
var(--j-text) var(--j-textMuted) var(--j-textSubtle)
var(--j-border) var(--j-borderHover)
var(--j-shadowSm) var(--j-shadowMd) var(--j-shadowLg)
```

### Tokens (typed JS references to CSS vars)

```tsx
import { tokens } from '@juanitte/inoui'
// tokens.colorPrimary → 'var(--j-primary)'
// tokens.colorBg, tokens.colorText, tokens.shadowMd, etc.
```

## Global Patterns (apply to most components)

### Semantic color prop

```tsx
color="primary" | "secondary" | "success" | "warning" | "error" | "info"
```

### Size prop (varies per component)

```tsx
size="sm" | "md" | "lg"           // Button, Bubble, ColorPicker, DatePicker, Tag
size="small" | "middle" | "large" // Input, Select, Table, Form, Collapse, DataDisplay, Menu, Pagination
size="default" | "small"          // Badge, Card, Pagination
```

### Variant prop

```tsx
variant="outlined" | "filled" | "borderless"              // Select, AutoComplete, NestedSelect
variant="outlined" | "filled" | "borderless" | "underlined" // Input, InputNumber, Mention
variant="primary" | "secondary" | "outline" | "dashed" | "ghost" | "link" // Button
variant="outlined" | "borderless"                          // Card
```

### Validation status

```tsx
status="error" | "warning"  // Input, Select, AutoComplete, DatePicker, InputNumber, Mention
```

### Controlled / Uncontrolled

Most components support both patterns:
```tsx
// Uncontrolled
<Input defaultValue="hello" />
// Controlled
<Input value={val} onChange={(e) => setVal(e.target.value)} />
```

### classNames & styles (Semantic DOM Styling)

Most components expose `classNames` and `styles` props to target internal slots:

```tsx
<Button
  classNames={{ root: 'my-btn', icon: 'my-icon' }}
  styles={{ icon: { color: 'red' }, content: { fontWeight: 'bold' } }}
/>
<Tooltip classNames={{ popup: 'my-popup' }} content="Hi"><Button>Hover</Button></Tooltip>
```

### BEM CSS Classes

All components use `ino-` prefixed BEM:
- Block: `ino-btn`, `ino-input`, `ino-modal`
- Modifier: `ino-btn--primary`, `ino-btn--sm`
- Element: `ino-btn__icon`, `ino-modal__header`

Override in CSS: `.ino-btn--primary { border-radius: 999px; }`

## Component Reference

### Layout

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| **Flex** | Flexbox container | `vertical`, `wrap`, `justify`, `align`, `gap="small"\|"middle"\|"large"\|number\|[h,v]`, `component` |
| **Grid** (Row/Col) | 24-column grid | Row: `gutter`, `align`, `justify`. Col: `span` (1-24), `offset`, `xs/sm/md/lg/xl/xxl` |
| **Layout** | Page layout | `Layout`, `Layout.Header`, `Layout.Footer`, `Layout.Content`, `Layout.Sider` (collapsible, breakpoint) |
| **Space** | Inline spacing | `direction`, `size`, `wrap`, `align`, `separator` |
| **Splitter** | Resizable panels | `layout="horizontal"\|"vertical"`, `Splitter.Panel` with `size`, `min`, `max`, `collapsible`, `resizable` |
| **Waterfall** | Masonry layout | `columns` (responsive), `gutter`, `Waterfall.Item` |

### Navigation

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| **Anchor** | Scroll-tracking links | `items=[{key,href,title,children?}]`, `direction="vertical"\|"horizontal"`, `offsetTop` |
| **Breadcrumb** | Path trail | `items=[{title,href?,icon?,menu?}]`, `separator`, `itemRender` |
| **Dropdown** | Context menu | `menu={items,onClick}`, `trigger=["hover"\|"click"\|"contextMenu"]`, `placement`, `arrow`. `Dropdown.Button` for split button |
| **Menu** | Nav menu | `items`, `mode="vertical"\|"horizontal"\|"inline"`, `selectedKeys`, `openKeys`, `multiple`, `inlineCollapsed` |
| **Pagination** | Page nav | `total`, `current`, `pageSize`, `showSizeChanger`, `showQuickJumper`, `showTotal`, `simple` |
| **Steps** | Step indicator | `items=[{title,description,icon?,status?}]`, `current`, `direction`, `size`, `type="default"\|"navigation"\|"inline"\|"dot"`, `percent` |
| **Tabs** | Tab panels | `items=[{key,label,children,closable?,icon?}]`, `activeKey`, `type="line"\|"card"\|"editable-card"`, `tabPosition` |

### Data Entry

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| **AutoComplete** | Input + suggestions | `options`, `value`, `filterOption`, `backfill`, `variant`, `status`, `prefix`, `suffix`, `allowClear` |
| **Checkbox** | Boolean toggle | `checked`, `indeterminate`, `onChange`. `Checkbox.Group`: `options`, `value` |
| **ColorPicker** | Color selection | `value`, `mode="single"\|"gradient"`, `format="hex"\|"rgb"\|"hsb"`, `presets`, `showText`, `size`, `disabledAlpha` |
| **DatePicker** | Date selection | `picker="date"\|"week"\|"month"\|"quarter"\|"year"`, `showTime`, `format`, `disabledDate`, `presets`, `multiple`, `mask`. `DatePicker.RangePicker` for ranges |
| **Form** | Validation + layout | `form` (useForm), `layout="horizontal"\|"vertical"\|"inline"`, `initialValues`, `onFinish`. `Form.Item`: `name`, `label`, `rules=[{required,type,min,max,pattern,validator}]`. `Form.List` for dynamic arrays. Hooks: `useForm`, `useWatch`, `useFormInstance` |
| **Input** | Text input | `variant`, `size`, `status`, `prefix`, `suffix`, `addonBefore`, `addonAfter`, `allowClear`, `showCount`, `maxLength`. Sub: `Input.TextArea` (autoSize), `Input.Search` (enterButton,onSearch), `Input.Password` (visibilityToggle), `Input.OTP` (length,mask) |
| **InputNumber** | Numeric input | `min`, `max`, `step`, `precision`, `formatter`, `parser`, `controls`, `prefix`, `suffix`, `stringMode` |
| **Mention** | @mention textarea | `options=[{value,label}]`, `prefix="@"\|["@","#"]`, `filterOption`, `autoSize`, `variant` |
| **NestedSelect** | Cascading select | `options` (hierarchical), `multiple`, `showSearch`, `changeOnSelect`, `expandTrigger`, `loadData`. `NestedSelect.Panel` for inline |
| **Radio** | Single choice | `Radio.Group`: `options`, `value`, `optionType="default"\|"button"`, `buttonStyle="outline"\|"solid"` |
| **Rate** | Star rating | `count`, `value`, `allowHalf`, `character`, `tooltips` |
| **Select** | Dropdown select | `options`, `mode="multiple"\|"tags"`, `showSearch`, `virtual` (auto for 32+), `maxTagCount`, `maxCount`, `filterOption`, `labelInValue`, `fieldNames`, `optionRender`, `dropdownRender`, `tokenSeparators` |
| **Slider** | Range slider | `min`, `max`, `step`, `range`, `marks`, `vertical`, `tooltip`, `editable`, `draggableTrack` |
| **Switch** | On/off toggle | `checked`, `checkedChildren`, `unCheckedChildren`, `size="default"\|"small"`, `loading` |
| **TimePicker** | Time selection | `format`, `hourStep`, `minuteStep`, `secondStep`, `use12Hours`, `showNow`. `TimePicker.RangePicker` for ranges |
| **Toggle** | Toggle buttons | `Toggle.Group`: `options`, `value`, `multiple`, `size`, `variant="outline"\|"solid"` |
| **Transfer** | Dual list select | `dataSource`, `targetKeys`, `selectedKeys`, `render`, `showSearch`, `pagination`, `oneWay` |
| **TreeSelect** | Tree dropdown | `treeData`, `value`, `multiple`, `treeCheckable`, `showSearch`, `treeDefaultExpandAll`, `loadData` |
| **Upload** | File upload | `action`, `fileList`, `listType="text"\|"picture"\|"picture-card"\|"picture-circle"`, `multiple`, `directory`, `drag`, `maxCount`, `beforeUpload`, `customRequest`. `Upload.Dragger` for drag area |

### Data Display

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| **Avatar** | User avatar | `src`, `icon`, `shape="circle"\|"square"`, `size`, `count`, `dot`. `Avatar.Group`: `max={count}` |
| **Badge** | Count indicator | `count`, `dot`, `status`, `color`, `overflowCount`, `showZero`, `offset`. `Badge.Ribbon`: `text`, `color`, `placement` |
| **Calendar** | Full calendar | `fullscreen`, `mode="month"\|"year"`, `cellRender`, `validRange`, `disabledDate`, `adapter` |
| **Card** | Content container | `title`, `extra`, `cover`, `actions`, `loading`, `hoverable`, `size`, `variant`, `type="inner"`, `tabList`. Sub: `Card.Meta`, `Card.Grid` |
| **Carousel** | Slideshow | `autoplay`, `autoplaySpeed`, `arrows`, `dots`, `effect="scrollx"\|"fade"`, `infinite`, `draggable`, `dotProgress`. Ref: `goTo`, `next`, `prev` |
| **Collapse** | Accordion | `items=[{key,label,children,extra?}]`, `accordion`, `ghost`, `bordered`, `size`, `expandIconPlacement`. `Collapse.Panel` alternative |
| **DataDisplay** | Label-value table | `items=[{key,label,children,span?}]`, `column` (responsive), `layout="horizontal"\|"vertical"`, `bordered`, `size` |
| **Empty** | Empty placeholder | `description`, `image`, `tumbleweed` (animated), `children` (action buttons) |
| **Image** | Image + preview | `src`, `fallback`, `placeholder`, `preview` (zoom/rotate/flip). `Image.PreviewGroup` for galleries |
| **Popover** | Rich tooltip | `content`, `title`, `trigger="hover"\|"click"\|"focus"`, `placement`, `arrow` |
| **QRCode** | QR code | `value`, `size`, `color`, `bgColor`, `bordered`, `errorLevel`, `icon`, `iconSize`, `status` |
| **Statistic** | Number display | `title`, `value`, `prefix`, `suffix`, `precision`, `formatter`, `groupSeparator`. `Statistic.Countdown`: `value` (target timestamp) |
| **Table** | Data table | `dataSource`, `columns=[{title,dataIndex,key,render,sorter,filters,onFilter,fixed,width,ellipsis,children}]`, `rowKey`, `bordered`, `size`, `loading`, `pagination`, `rowSelection={type,selectedRowKeys,onChange}`, `expandable={expandedRowRender}`, `scroll={x,y}`, `onChange` (pagination/sort/filter) |
| **Tag** | Label tag | `color`, `closable`, `bordered`, `icon`. `Tag.CheckableTag`: `checked`, `onChange` |
| **Text** | Typography | `type="secondary"\|"success"\|"warning"\|"danger"`, `size`, `weight`, `italic`, `underline`, `delete`, `mark`, `code`, `keyboard`, `copyable`, `ellipsis` |
| **Timeline** | Event timeline | `items=[{children,color?,dot?,label?,position?}]`, `mode="left"\|"right"\|"alternate"`, `pending`, `reverse` |
| **Tooltip** | Hover tip | `content` (or `title`), `placement`, `trigger`, `arrow`, `color`, `open` |
| **Tour** | Guided tour | `steps=[{target,title,description,placement?,cover?}]`, `open`, `current`, `type="default"\|"primary"`, `mask` |
| **Tree** | Tree view | `treeData=[{key,title,children?}]`, `checkable`, `selectable`, `draggable`, `expandedKeys`, `selectedKeys`, `checkedKeys`, `loadData`, `showLine`, `showIcon`, `virtual` |
| **Watermark** | Background watermark | `content`, `image`, `width`, `height`, `rotate`, `gap`, `offset`, `font` |

### Feedback

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| **Alert** | Message banner | `type="success"\|"info"\|"warning"\|"error"`, `title`, `description`, `showIcon`, `closable`, `banner`, `action`. `Alert.ErrorBoundary` for error catching |
| **Drawer** | Slide-in panel | `open`, `onClose`, `placement="right"\|"left"\|"top"\|"bottom"`, `title`, `extra`, `footer`, `size="default"\|"large"`, `width`, `loading`, `destroyOnClose`, `mask` |
| **Modal** | Dialog | `open`, `onClose`, `onOk`, `title`, `footer` (null/ReactNode/render fn), `centered`, `width`, `confirmLoading`, `loading`, `destroyOnClose`, `mask={blur:true}`, `modalRender`. **useModal hook:** `modal.confirm/info/success/warning/error(config)` → returns `{destroy,update}` |
| **PopAlert** | Toast notifications | **usePopAlert(config?)** → `[api, contextHolder]`. `api.success/error/info/warning/loading(content, duration?)`. `api.open({type,content,description,key,closable,showProgress})`. Config: `placement`, `maxCount`, `duration`, `size` |
| **PopConfirm** | Confirm popover | `title`, `description`, `onConfirm`, `onCancel`, `okText`, `cancelText`, `icon`, `placement` |
| **Progress** | Progress indicator | `percent`, `type="line"\|"circle"\|"dashboard"`, `status`, `showInfo`, `strokeColor`, `steps`, `size` |
| **Result** | Result page | `status="success"\|"error"\|"info"\|"warning"\|"404"\|"403"\|"500"`, `title`, `subTitle`, `extra` (action buttons), `icon` |
| **Spinner** | Loading spinner | `spinning`, `size="small"\|"default"\|"large"`, `tip`, `delay`, `children` (wraps content) |

### Other

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| **Affix** | Stick to viewport | `offsetTop`, `offsetBottom`, `target`, `onChange` |
| **App** | Root provider (Modal+PopAlert) | Wrap app → `App.useApp()` returns `{modal, notification}` |
| **Bubble** | Floating action button | `icon`, `position`, `color`, `badge`, `tooltip`, `visibleOnScroll`. `Bubble.Group` (compact bar), `Bubble.Menu` (expandable) |
| **ConfigProvider** | Global defaults | `componentSize`, `componentDisabled`, `locale` (en_US, es_ES). `ConfigProvider.useConfig()` |
| **Divider** | Separator line | `type="horizontal"\|"vertical"`, `orientation="left"\|"center"\|"right"`, `dashed`, `color`, `thickness`, `children` (text) |

## Common Recipes

### App scaffold with theme, modal, and notifications

```tsx
import '@juanitte/inoui/styles.css'
import { ThemeProvider, App, ConfigProvider, es_ES } from '@juanitte/inoui'

function Root() {
  return (
    <ThemeProvider config={{ defaultMode: 'light' }}>
      <ConfigProvider locale={es_ES}>
        <App>
          <MyApp />
        </App>
      </ConfigProvider>
    </ThemeProvider>
  )
}

// Inside any child:
function MyPage() {
  const { modal, notification } = App.useApp()
  // modal.confirm({...}), notification.success('Done!')
}
```

### Form with validation

```tsx
const [form] = Form.useForm()

<Form form={form} layout="vertical" onFinish={(values) => save(values)}>
  <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
    <Input />
  </Form.Item>
  <Form.Item label="Password" name="password" rules={[{ required: true, min: 8 }]}>
    <Input.Password />
  </Form.Item>
  <Form.Item name="remember" valuePropName="checked">
    <Checkbox>Remember me</Checkbox>
  </Form.Item>
  <Button type="submit">Submit</Button>
</Form>
```

### Data table with sort, filter, selection

```tsx
const [selectedKeys, setSelectedKeys] = useState([])

<Table
  dataSource={users}
  rowKey="id"
  rowSelection={{ selectedRowKeys: selectedKeys, onChange: setSelectedKeys }}
  pagination={{ pageSize: 20, showTotal: (t, r) => `${r[0]}-${r[1]} of ${t}` }}
  columns={[
    { title: 'Name', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'Role', dataIndex: 'role', filters: [{text:'Admin',value:'admin'}], onFilter: (v, r) => r.role === v },
    { title: 'Actions', render: (_, record) => <Button size="sm" onClick={() => edit(record)}>Edit</Button> },
  ]}
/>
```

### Page layout

```tsx
<Layout style={{ minHeight: '100vh' }}>
  <Layout.Header>
    <Flex justify="space-between" align="center"><Logo /><Menu mode="horizontal" items={navItems} /></Flex>
  </Layout.Header>
  <Layout hasSider>
    <Layout.Sider collapsible breakpoint="lg">
      <Menu mode="inline" items={sideItems} />
    </Layout.Sider>
    <Layout>
      <Layout.Content><Outlet /></Layout.Content>
      <Layout.Footer>Footer</Layout.Footer>
    </Layout>
  </Layout>
</Layout>
```

### Responsive grid

```tsx
<Row gutter={[16, 16]}>
  <Col xs={24} sm={12} lg={8}><Card title="A">...</Card></Col>
  <Col xs={24} sm={12} lg={8}><Card title="B">...</Card></Col>
  <Col xs={24} sm={24} lg={8}><Card title="C">...</Card></Col>
</Row>
```

## Utilities

```tsx
import {
  tokens, classNames, omit, canUseDom,
  getScrollBarSize, scrollTo,
  useEvent, useMergedState, useWindowWidth, useBreakpoint,
  BREAKPOINT_VALUES, BREAKPOINT_ORDER, getResponsiveValue,
} from '@juanitte/inoui'
// Breakpoints: xs:0, sm:576, md:768, lg:992, xl:1200, xxl:1600
```

## Built-in Locales

```tsx
import { en_US, es_ES } from '@juanitte/inoui'
// Covers: DatePicker, Pagination, Form validation messages
```

## Built-in Icons (for Bubble)

```tsx
import { BackToTopIcon, ChatIcon, BellIcon, CloseIcon } from '@juanitte/inoui'
```
