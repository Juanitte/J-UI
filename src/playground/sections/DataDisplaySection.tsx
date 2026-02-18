import { DataDisplay, Text, tokens } from '../../index'
import { Section } from './shared'

// ─── Sample data ─────────────────────────────────────────────────────────────

const basicItems = [
  { key: '1', label: 'Product', children: 'Cloud Database' },
  { key: '2', label: 'Billing Mode', children: 'Prepaid' },
  { key: '3', label: 'Automatic Renewal', children: 'YES' },
  { key: '4', label: 'Order time', children: '2024-04-24 18:00:00' },
  { key: '5', label: 'Usage Time', children: '2024-04-24 18:00:00 — 2025-04-24 18:00:00' },
  { key: '6', label: 'Status', children: 'Running' },
]

// ─── 1. Basic ────────────────────────────────────────────────────────────────

function BasicDemo() {
  return (
    <div style={{ maxWidth: 700 }}>
      <DataDisplay title="User Info" items={basicItems} />
    </div>
  )
}

// ─── 2. Bordered ─────────────────────────────────────────────────────────────

function BorderedDemo() {
  return (
    <div style={{ maxWidth: 700 }}>
      <DataDisplay
        title="User Info"
        bordered
        items={[
          { key: '1', label: 'Product', children: 'Cloud Database' },
          { key: '2', label: 'Billing Mode', children: 'Prepaid' },
          { key: '3', label: 'Automatic Renewal', children: 'YES' },
          { key: '4', label: 'Order time', children: '2024-04-24 18:00:00' },
          { key: '5', label: 'Usage Time', children: '2024-04-24 18:00:00 — 2025-04-24 18:00:00', span: 2 },
          { key: '6', label: 'Status', children: 'Running' },
          { key: '7', label: 'Negotiated Amount', children: '$80.00' },
          { key: '8', label: 'Discount', children: '$20.00' },
          { key: '9', label: 'Official Receipts', children: '$60.00' },
          { key: '10', label: 'Config Info', children: 'Data disk type: MongoDB / Database version: 3.4 / Package: dds.mongo.mid', span: 3 },
        ]}
      />
    </div>
  )
}

// ─── 3. Size ─────────────────────────────────────────────────────────────────

function SizeDemo() {
  const items = [
    { key: '1', label: 'Product', children: 'Cloud Database' },
    { key: '2', label: 'Billing', children: 'Prepaid' },
    { key: '3', label: 'Time', children: '18:00:00' },
    { key: '4', label: 'Amount', children: '$80.00' },
    { key: '5', label: 'Discount', children: '$20.00' },
    { key: '6', label: 'Status', children: 'Running' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Large</Text>
        <div style={{ maxWidth: 700 }}>
          <DataDisplay title="Large" size="large" bordered items={items} />
        </div>
      </div>
      <div>
        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Middle (default)</Text>
        <div style={{ maxWidth: 700 }}>
          <DataDisplay title="Middle" size="middle" bordered items={items} />
        </div>
      </div>
      <div>
        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Small</Text>
        <div style={{ maxWidth: 700 }}>
          <DataDisplay title="Small" size="small" bordered items={items} />
        </div>
      </div>
    </div>
  )
}

// ─── 4. Vertical Layout ─────────────────────────────────────────────────────

function VerticalDemo() {
  return (
    <div style={{ maxWidth: 700 }}>
      <DataDisplay title="User Info" layout="vertical" items={basicItems} />
    </div>
  )
}

// ─── 5. Vertical Bordered ───────────────────────────────────────────────────

function VerticalBorderedDemo() {
  return (
    <div style={{ maxWidth: 700 }}>
      <DataDisplay
        title="User Info"
        layout="vertical"
        bordered
        items={[
          { key: '1', label: 'Product', children: 'Cloud Database' },
          { key: '2', label: 'Billing Mode', children: 'Prepaid' },
          { key: '3', label: 'Automatic Renewal', children: 'YES' },
          { key: '4', label: 'Order time', children: '2024-04-24 18:00:00' },
          { key: '5', label: 'Usage Time', children: '2024-04-24 18:00:00 — 2025-04-24 18:00:00', span: 2 },
          { key: '6', label: 'Status', children: 'Running' },
          { key: '7', label: 'Amount', children: '$80.00' },
          { key: '8', label: 'Config Info', children: 'Data disk type: MongoDB / Database version: 3.4', span: 2 },
        ]}
      />
    </div>
  )
}

// ─── 6. Custom Span ─────────────────────────────────────────────────────────

function SpanDemo() {
  return (
    <div style={{ maxWidth: 700 }}>
      <DataDisplay
        title="Custom Span"
        bordered
        items={[
          { key: '1', label: 'Product', children: 'Cloud Database' },
          { key: '2', label: 'Billing Mode', children: 'Prepaid' },
          { key: '3', label: 'Automatic Renewal', children: 'YES' },
          { key: '4', label: 'Full Width Item', children: 'This item spans the entire row with span=3.', span: 3 },
          { key: '5', label: 'Half Width', children: 'span=2', span: 2 },
          { key: '6', label: 'Normal', children: 'span=1' },
        ]}
      />
    </div>
  )
}

// ─── 7. Responsive ──────────────────────────────────────────────────────────

function ResponsiveDemo() {
  return (
    <div style={{ maxWidth: 900 }}>
      <DataDisplay
        title="Responsive"
        bordered
        column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
        items={[
          { key: '1', label: 'Product', children: 'Cloud Database' },
          { key: '2', label: 'Billing', children: 'Prepaid' },
          { key: '3', label: 'Time', children: '18:00:00' },
          { key: '4', label: 'Amount', children: '$80.00' },
          {
            key: '5',
            label: 'Discount',
            children: '$20.00',
            span: { xs: 1, sm: 2, md: 1, lg: 1, xl: 2, xxl: 2 },
          },
          { key: '6', label: 'Status', children: 'Running' },
        ]}
      />
      <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: '0.8125rem' }}>
        Resize the window to see columns and spans adjust responsively.
      </Text>
    </div>
  )
}

// ─── 8. Extra ─────────────────────────────────────────────────────────────────

function ExtraDemo() {
  return (
    <div style={{ maxWidth: 700 }}>
      <DataDisplay
        title="User Info"
        extra={<a href="#" onClick={e => e.preventDefault()} style={{ color: tokens.colorPrimary }}>Edit</a>}
        bordered
        items={[
          { key: '1', label: 'Product', children: 'Cloud Database' },
          { key: '2', label: 'Billing Mode', children: 'Prepaid' },
          { key: '3', label: 'Automatic Renewal', children: 'YES' },
          { key: '4', label: 'Order time', children: '2024-04-24 18:00:00' },
          { key: '5', label: 'Usage Time', children: '2024-04-24 — 2025-04-24', span: 2 },
        ]}
      />
    </div>
  )
}

// ─── 8. Colon ────────────────────────────────────────────────────────────────

function ColonDemo() {
  const items = [
    { key: '1', label: 'Product', children: 'Cloud Database' },
    { key: '2', label: 'Billing', children: 'Prepaid' },
    { key: '3', label: 'Status', children: 'Running' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>With colon (default)</Text>
        <div style={{ maxWidth: 700 }}>
          <DataDisplay colon items={items} />
        </div>
      </div>
      <div>
        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Without colon</Text>
        <div style={{ maxWidth: 700 }}>
          <DataDisplay colon={false} items={items} />
        </div>
      </div>
    </div>
  )
}

// ─── 9. Custom Styles ────────────────────────────────────────────────────────

function CustomStylesDemo() {
  return (
    <div style={{ maxWidth: 700 }}>
      <DataDisplay
        title="Custom Per-Item Styles"
        bordered
        items={[
          { key: '1', label: 'Normal', children: 'Default styling' },
          {
            key: '2',
            label: 'Highlighted',
            children: '$1,200.00',
            contentStyle: { color: tokens.colorSuccess, fontWeight: 600 },
          },
          {
            key: '3',
            label: 'Warning',
            children: 'Expiring soon',
            contentStyle: { color: tokens.colorWarning, fontWeight: 600 },
            labelStyle: { color: tokens.colorWarning },
          },
        ]}
      />
    </div>
  )
}

// ─── 10. Semantic Styles ─────────────────────────────────────────────────────

function SemanticStylesDemo() {
  return (
    <div style={{ maxWidth: 700 }}>
      <DataDisplay
        title="Semantic Styling"
        bordered
        styles={{
          header: { borderBottom: `2px solid ${tokens.colorPrimary}`, paddingBottom: '0.5rem' },
          title: { color: tokens.colorPrimary },
          label: { backgroundColor: tokens.colorPrimaryBg, color: tokens.colorPrimary },
        }}
        items={[
          { key: '1', label: 'Product', children: 'Cloud Database' },
          { key: '2', label: 'Billing', children: 'Prepaid' },
          { key: '3', label: 'Status', children: 'Running' },
        ]}
      />
    </div>
  )
}

// ─── 11. DataDisplay.Item ────────────────────────────────────────────────────

function ItemDemo() {
  return (
    <div style={{ maxWidth: 700 }}>
      <DataDisplay title="DataDisplay.Item API" bordered>
        <DataDisplay.Item itemKey="1" label="Product">Cloud Database</DataDisplay.Item>
        <DataDisplay.Item itemKey="2" label="Billing Mode">Prepaid</DataDisplay.Item>
        <DataDisplay.Item itemKey="3" label="Status">Running</DataDisplay.Item>
        <DataDisplay.Item itemKey="4" label="Full Width" span={3}>
          This item uses the DataDisplay.Item compound component with span=3.
        </DataDisplay.Item>
      </DataDisplay>
    </div>
  )
}

// ─── Main Section ────────────────────────────────────────────────────────────

export function DataDisplaySection() {
  return (
    <div>
      <Text size="xl" weight="bold" style={{ display: 'block' }}>DataDisplay</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 32 }}>
        Display multiple read-only fields in groups, presenting key-value pairs of data in a structured layout.
      </Text>

      <Section title="Basic" align="start">
        <BasicDemo />
      </Section>

      <Section title="Bordered" align="start">
        <BorderedDemo />
      </Section>

      <Section title="Size" align="start">
        <SizeDemo />
      </Section>

      <Section title="Vertical Layout" align="start">
        <VerticalDemo />
      </Section>

      <Section title="Vertical Bordered" align="start">
        <VerticalBorderedDemo />
      </Section>

      <Section title="Custom Span" align="start">
        <SpanDemo />
      </Section>

      <Section title="Responsive" align="start">
        <ResponsiveDemo />
      </Section>

      <Section title="Extra" align="start">
        <ExtraDemo />
      </Section>

      <Section title="Colon" align="start">
        <ColonDemo />
      </Section>

      <Section title="Custom Styles" align="start">
        <CustomStylesDemo />
      </Section>

      <Section title="Semantic Styles" align="start">
        <SemanticStylesDemo />
      </Section>

      <Section title="DataDisplay.Item" align="start">
        <ItemDemo />
      </Section>
    </div>
  )
}
