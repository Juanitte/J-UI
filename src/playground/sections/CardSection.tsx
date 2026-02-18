import { useState } from 'react'
import { Card, Avatar, Text, tokens } from '../../index'
import { Section } from './shared'

// ─── SVG Icons for actions ───────────────────────────────────────────────────

function HeartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 14s-5.5-3.5-5.5-7A3.5 3.5 0 0 1 8 4.5 3.5 3.5 0 0 1 13.5 7C13.5 10.5 8 14 8 14z" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z" />
    </svg>
  )
}

function EllipsisIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="4" cy="8" r="1.25" />
      <circle cx="8" cy="8" r="1.25" />
      <circle cx="12" cy="8" r="1.25" />
    </svg>
  )
}

// ─── 1. Basic ────────────────────────────────────────────────────────────────

function BasicDemo() {
  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      <Card title="Card title" extra={<a href="#" onClick={e => e.preventDefault()} style={{ color: tokens.colorPrimary }}>More</a>} style={{ width: 300 }}>
        <p style={{ margin: 0 }}>Card content</p>
        <p style={{ margin: '0.5rem 0 0' }}>Card content</p>
        <p style={{ margin: '0.5rem 0 0' }}>Card content</p>
      </Card>
      <Card title="Card title" extra={<a href="#" onClick={e => e.preventDefault()} style={{ color: tokens.colorPrimary }}>More</a>} size="small" style={{ width: 300 }}>
        <p style={{ margin: 0 }}>Card content</p>
        <p style={{ margin: '0.5rem 0 0' }}>Card content</p>
        <p style={{ margin: '0.5rem 0 0' }}>Card content</p>
      </Card>
    </div>
  )
}

// ─── 2. Simple Card ──────────────────────────────────────────────────────────

function SimpleDemo() {
  return (
    <Card style={{ width: 300 }}>
      <p style={{ margin: 0 }}>Simple card content</p>
      <p style={{ margin: '0.5rem 0 0' }}>Simple card content</p>
      <p style={{ margin: '0.5rem 0 0' }}>Simple card content</p>
    </Card>
  )
}

// ─── 3. No Border ────────────────────────────────────────────────────────────

function NoBorderDemo() {
  return (
    <div style={{ backgroundColor: tokens.colorBgSubtle, padding: 24, borderRadius: 8 }}>
      <Card title="Card title" variant="borderless" style={{ width: 300 }}>
        <p style={{ margin: 0 }}>Card content</p>
        <p style={{ margin: '0.5rem 0 0' }}>Card content</p>
      </Card>
    </div>
  )
}

// ─── 4. Card in Column ───────────────────────────────────────────────────────

function CardInColumnDemo() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      <Card title="Card 1" hoverable>
        <p style={{ margin: 0 }}>Card content</p>
      </Card>
      <Card title="Card 2" hoverable>
        <p style={{ margin: 0 }}>Card content</p>
      </Card>
      <Card title="Card 3" hoverable>
        <p style={{ margin: 0 }}>Card content</p>
      </Card>
    </div>
  )
}

// ─── 5. Card.Meta ────────────────────────────────────────────────────────────

function MetaDemo() {
  return (
    <Card style={{ width: 300 }}>
      <Card.Meta
        avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />}
        title="Card Meta title"
        description="This is the description"
      />
    </Card>
  )
}

// ─── 5. Cover ────────────────────────────────────────────────────────────────

function CoverDemo() {
  return (
    <Card
      style={{ width: 300 }}
      cover={
        <img
          alt="example"
          src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          style={{ width: '100%', display: 'block' }}
        />
      }
      actions={[<HeartIcon key="heart" />, <EditIcon key="edit" />, <EllipsisIcon key="ellipsis" />]}
    >
      <Card.Meta
        avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
        title="Card title"
        description="This is the description"
      />
    </Card>
  )
}

// ─── 6. Loading ──────────────────────────────────────────────────────────────

function LoadingDemo() {
  const [loading, setLoading] = useState(true)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <button
        onClick={() => setLoading(v => !v)}
        style={{
          padding: '4px 12px',
          border: `1px solid ${tokens.colorBorder}`,
          borderRadius: 4,
          backgroundColor: tokens.colorBg,
          color: tokens.colorText,
          cursor: 'pointer',
          fontSize: 13,
        }}
      >
        Toggle loading
      </button>
      <Card title="Card title" loading={loading} style={{ width: 300 }}>
        <Card.Meta
          avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />}
          title="Card title"
          description="This is the description"
        />
      </Card>
    </div>
  )
}

// ─── 7. Hoverable ────────────────────────────────────────────────────────────

function HoverableDemo() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <Card hoverable style={{ width: 200 }}>
        <p style={{ margin: 0, fontWeight: 500 }}>Hoverable card</p>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: tokens.colorTextMuted }}>
          Hover me to see the lift effect
        </p>
      </Card>
      <Card hoverable style={{ width: 200 }}>
        <p style={{ margin: 0, fontWeight: 500 }}>Another card</p>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: tokens.colorTextMuted }}>
          I also lift on hover
        </p>
      </Card>
    </div>
  )
}

// ─── 8. Card.Grid ────────────────────────────────────────────────────────────

function GridDemo() {
  return (
    <Card title="Card Grid">
      {Array.from({ length: 6 }, (_, i) => (
        <Card.Grid key={i} style={{ textAlign: 'center' as const }}>
          Content {i + 1}
        </Card.Grid>
      ))}
    </Card>
  )
}

// ─── 9. Inner Card ───────────────────────────────────────────────────────────

function InnerDemo() {
  return (
    <Card title="Outer Card" style={{ width: 500 }}>
      <Card type="inner" title="Inner Card" extra={<a href="#" onClick={e => e.preventDefault()} style={{ color: tokens.colorPrimary }}>More</a>}>
        <p style={{ margin: 0 }}>Inner card content</p>
      </Card>
      <Card type="inner" title="Another Inner Card" style={{ marginTop: 16 }}>
        <p style={{ margin: 0 }}>Inner card content</p>
      </Card>
    </Card>
  )
}

// ─── 10. Actions ─────────────────────────────────────────────────────────────

function ActionsDemo() {
  return (
    <Card
      title="Card with actions"
      style={{ width: 300 }}
      actions={[<HeartIcon key="heart" />, <EditIcon key="edit" />, <EllipsisIcon key="ellipsis" />]}
    >
      <p style={{ margin: 0 }}>Card content with action icons at the bottom.</p>
    </Card>
  )
}

// ─── 11. With Tabs ───────────────────────────────────────────────────────────

function TabsDemo() {
  const [activeKey, setActiveKey] = useState('tab1')

  const contentMap: Record<string, string> = {
    tab1: 'Content of Tab Pane 1',
    tab2: 'Content of Tab Pane 2',
    tab3: 'Content of Tab Pane 3',
  }

  return (
    <Card
      title="Card with Tabs"
      style={{ width: 500 }}
      tabList={[
        { key: 'tab1', label: 'Tab 1' },
        { key: 'tab2', label: 'Tab 2' },
        { key: 'tab3', label: 'Tab 3' },
      ]}
      activeTabKey={activeKey}
      onTabChange={(key) => setActiveKey(key)}
    >
      <p style={{ margin: 0 }}>{contentMap[activeKey]}</p>
    </Card>
  )
}

// ─── 12. Semantic Styles ─────────────────────────────────────────────────────

function SemanticStylesDemo() {
  return (
    <Card
      title="Styled Card"
      style={{ width: 300 }}
      styles={{
        header: { backgroundColor: tokens.colorPrimaryBg, borderColor: tokens.colorPrimary },
        body: { backgroundColor: tokens.colorBgSubtle },
      }}
    >
      <p style={{ margin: 0 }}>Custom styled header and body.</p>
    </Card>
  )
}

// ─── Main Section ────────────────────────────────────────────────────────────

export function CardSection() {
  return (
    <div>
      <Text size="xl" weight="bold" style={{ display: 'block' }}>Card</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 32 }}>
        A content container for displaying information with header, body, cover, actions, and tabs.
      </Text>

      <Section title="Basic" align="start">
        <BasicDemo />
      </Section>

      <Section title="Simple Card" align="start">
        <SimpleDemo />
      </Section>

      <Section title="No Border" align="start">
        <NoBorderDemo />
      </Section>

      <Section title="Card in Column" align="start">
        <CardInColumnDemo />
      </Section>

      <Section title="Card.Meta" align="start">
        <MetaDemo />
      </Section>

      <Section title="Cover + Actions + Meta" align="start">
        <CoverDemo />
      </Section>

      <Section title="Loading" align="start">
        <LoadingDemo />
      </Section>

      <Section title="Hoverable" align="start">
        <HoverableDemo />
      </Section>

      <Section title="Card.Grid" align="start">
        <GridDemo />
      </Section>

      <Section title="Inner Card" align="start">
        <InnerDemo />
      </Section>

      <Section title="Actions" align="start">
        <ActionsDemo />
      </Section>

      <Section title="With Tabs" align="start">
        <TabsDemo />
      </Section>

      <Section title="Semantic Styles" align="start">
        <SemanticStylesDemo />
      </Section>
    </div>
  )
}
