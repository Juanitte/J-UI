import { Empty, Text, Button, tokens } from '../../index'
import { Section } from './shared'

// ─── 1. Basic ────────────────────────────────────────────────────────────────

function BasicDemo() {
  return <Empty />
}

// ─── 2. Custom Description ───────────────────────────────────────────────────

function CustomDescriptionDemo() {
  return (
    <div style={{ display: 'flex', gap: 48 }}>
      <Empty description="No results found" />
      <Empty description={<Text type="secondary">Custom <strong>ReactNode</strong> description</Text>} />
      <Empty description={false} />
    </div>
  )
}

// ─── 3. Custom Image ─────────────────────────────────────────────────────────

function CustomImageDemo() {
  return (
    <div style={{ display: 'flex', gap: 48 }}>
      <Empty
        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        imageStyle={{ height: 80 }}
        description="Custom image URL"
      />
      <Empty
        image={
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="36" stroke={tokens.colorBorder} strokeWidth="2" strokeDasharray="6 4" />
            <text x="40" y="44" textAnchor="middle" fill={tokens.colorTextSubtle} fontSize="12">?</text>
          </svg>
        }
        description="Custom SVG"
      />
    </div>
  )
}

// ─── 4. With Action ──────────────────────────────────────────────────────────

function WithActionDemo() {
  return (
    <Empty description="No items yet">
      <Button variant="primary" size="sm">Create Now</Button>
    </Empty>
  )
}

// ─── 5. Semantic Styles ──────────────────────────────────────────────────────

function SemanticStylesDemo() {
  return (
    <div style={{ display: 'flex', gap: 48 }}>
      <Empty
        styles={{
          root: { backgroundColor: tokens.colorBgSubtle, borderRadius: '0.5rem', padding: '2rem' },
          description: { color: tokens.colorPrimary, fontWeight: 600 },
        }}
        description="Styled empty state"
      />
      <Empty
        styles={{
          root: { border: `1px dashed ${tokens.colorBorder}`, borderRadius: '0.5rem', padding: '2rem' },
          description: { fontStyle: 'italic' },
        }}
        description="Dashed border variant"
      />
    </div>
  )
}

// ─── 6. Custom Colors ────────────────────────────────────────────────────────

function CustomColorsDemo() {
  return (
    <div style={{ display: 'flex', gap: 48 }}>
      <Empty
        iconColor={tokens.colorPrimary}
        description="Custom icon color"
      />
      <Empty
        iconColor={tokens.colorError}
        description="Error tinted icon"
      />
      <div style={{ width: '100%', maxWidth: 350, border: `1px solid ${tokens.colorBorder}`, borderRadius: '0.5rem' }}>
        <Empty
          tumbleweed
          tumbleweedColor={tokens.colorWarning}
          windColor={tokens.colorInfo}
          shadowColor={tokens.colorWarning800}
          description="Custom tumbleweed colors"
        />
      </div>
    </div>
  )
}

// ─── 7. Tumbleweed ───────────────────────────────────────────────────────────

function TumbleweedDemo() {
  return (
    <div style={{ width: '100%', maxWidth: 500, border: `1px solid ${tokens.colorBorder}`, borderRadius: '0.5rem' }}>
      <Empty
        description="Nothing here but tumbleweeds..."
        tumbleweed
      />
    </div>
  )
}

// ─── Main Section ────────────────────────────────────────────────────────────

export function EmptySection() {
  return (
    <div>
      <Text size="xl" weight="bold" style={{ display: 'block' }}>Empty</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 32 }}>
        Empty state placeholder. Used when there is no data or content to display.
      </Text>

      <Section title="Basic">
        <BasicDemo />
      </Section>

      <Section title="Custom Description">
        <CustomDescriptionDemo />
      </Section>

      <Section title="Custom Image">
        <CustomImageDemo />
      </Section>

      <Section title="With Action">
        <WithActionDemo />
      </Section>

      <Section title="Semantic Styles">
        <SemanticStylesDemo />
      </Section>

      <Section title="Custom Colors">
        <CustomColorsDemo />
      </Section>

      <Section title="Tumbleweed">
        <TumbleweedDemo />
      </Section>
    </div>
  )
}
