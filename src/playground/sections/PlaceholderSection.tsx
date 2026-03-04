import { useState } from 'react'
import { Placeholder, Text, Button, Switch, Space, tokens } from '../../index'
import { Section } from './shared'

// ─── 1. Basic ────────────────────────────────────────────────────────────────────

function BasicDemo() {
  return (
    <div style={{ width: '100%', maxWidth: 500 }}>
      <Placeholder />
    </div>
  )
}

// ─── 2. Active Animation ─────────────────────────────────────────────────────────

function ActiveDemo() {
  return (
    <div style={{ width: '100%', maxWidth: 500 }}>
      <Placeholder active />
    </div>
  )
}

// ─── 3. With Avatar ──────────────────────────────────────────────────────────────

function AvatarDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', maxWidth: 500 }}>
      <Placeholder avatar active />
      <Placeholder avatar={{ shape: 'square', size: 'large' }} active />
    </div>
  )
}

// ─── 4. Sizes ────────────────────────────────────────────────────────────────────

function SizesDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Text weight="bold">Avatar</Text>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Placeholder.Avatar active size="small" />
        <Placeholder.Avatar active size="default" />
        <Placeholder.Avatar active size="large" />
        <Placeholder.Avatar active size={64} />
      </div>

      <Text weight="bold">Button</Text>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <Placeholder.Button active size="small" />
        <Placeholder.Button active size="default" />
        <Placeholder.Button active size="large" />
      </div>

      <Text weight="bold">Input</Text>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 300 }}>
        <Placeholder.Input active size="small" />
        <Placeholder.Input active size="default" />
        <Placeholder.Input active size="large" />
      </div>
    </div>
  )
}

// ─── 5. Loading State ────────────────────────────────────────────────────────────

function LoadingDemo() {
  const [loading, setLoading] = useState(true)

  return (
    <div style={{ width: '100%', maxWidth: 500 }}>
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Switch checked={loading} onChange={setLoading} size="small" />
        <Text type="secondary">Loading</Text>
      </div>
      <Placeholder loading={loading} avatar active>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div
            style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              backgroundColor: tokens.colorPrimary,
              flexShrink: 0,
            }}
          />
          <div>
            <Text weight="bold" style={{ display: 'block', marginBottom: '0.25rem' }}>
              John Doe
            </Text>
            <Text type="secondary">
              Software engineer building great user interfaces. Passionate about design systems
              and component libraries.
            </Text>
          </div>
        </div>
      </Placeholder>
    </div>
  )
}

// ─── 6. Button Shapes ────────────────────────────────────────────────────────────

function ButtonShapesDemo() {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <Placeholder.Button active shape="default" />
      <Placeholder.Button active shape="round" />
      <Placeholder.Button active shape="circle" />
      <Placeholder.Button active shape="square" />
      <Placeholder.Button active block style={{ maxWidth: 300 }} />
    </div>
  )
}

// ─── 7. Image ────────────────────────────────────────────────────────────────────

function ImageDemo() {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <div style={{ width: 200, height: 150 }}>
        <Placeholder.Image />
      </div>
      <div style={{ width: 200, height: 150 }}>
        <Placeholder.Image active />
      </div>
    </div>
  )
}

// ─── 8. Custom Node ──────────────────────────────────────────────────────────────

function NodeDemo() {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Placeholder.Node active>
        <div style={{ width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="3rem" height="3rem" viewBox="0 0 24 24" fill={tokens.colorTextSubtle} stroke="none">
            <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z" />
          </svg>
        </div>
      </Placeholder.Node>
      <Placeholder.Node style={{ width: 120, height: 120 }} />
    </div>
  )
}

// ─── 9. Complex Combination ──────────────────────────────────────────────────────

function ComplexDemo() {
  const [loading, setLoading] = useState(true)

  return (
    <div style={{ width: '100%', maxWidth: 500 }}>
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Switch checked={loading} onChange={setLoading} size="small" />
        <Text type="secondary">Loading</Text>
      </div>
      <div
        style={{
          border: `1px solid ${tokens.colorBorder}`,
          borderRadius: '0.5rem',
          padding: '1.5rem',
        }}
      >
        <Placeholder loading={loading} avatar active paragraph={{ rows: 4, width: ['100%', '100%', '80%', '50%'] }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                backgroundColor: tokens.colorSuccess,
                flexShrink: 0,
              }}
            />
            <div>
              <Text weight="bold" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Project Update
              </Text>
              <Text type="secondary" style={{ display: 'block', marginBottom: '0.75rem' }}>
                The latest deployment has been completed successfully. All services are running
                as expected. Performance metrics show a 15% improvement in response times
                across all endpoints.
              </Text>
              <Space size="small">
                <Button variant="primary" size="sm">View Details</Button>
                <Button size="sm">Dismiss</Button>
              </Space>
            </div>
          </div>
        </Placeholder>
      </div>
    </div>
  )
}

// ─── 10. Paragraph Configuration ────────────────────────────────────────────────

function ParagraphDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', maxWidth: 500 }}>
      <div>
        <Text type="secondary" style={{ display: 'block', marginBottom: '0.5rem' }}>1 row</Text>
        <Placeholder active title={false} paragraph={{ rows: 1 }} />
      </div>
      <div>
        <Text type="secondary" style={{ display: 'block', marginBottom: '0.5rem' }}>5 rows, custom widths</Text>
        <Placeholder active title={false} paragraph={{ rows: 5, width: ['100%', '90%', '80%', '70%', '40%'] }} />
      </div>
      <div>
        <Text type="secondary" style={{ display: 'block', marginBottom: '0.5rem' }}>Round corners</Text>
        <Placeholder active round />
      </div>
    </div>
  )
}

// ─── 11. Custom Semantic Styling ─────────────────────────────────────────────────

function SemanticStylingDemo() {
  return (
    <div style={{ width: '100%', maxWidth: 500 }}>
      <Placeholder
        active
        avatar={{ shape: 'square', size: 'large' }}
        paragraph={{ rows: 4 }}
        styles={{
          root: {
            border: `2px dashed ${tokens.colorPrimary}`,
            borderRadius: '1rem',
            padding: '1.5rem',
            background: `linear-gradient(135deg, ${tokens.colorPrimary50} 0%, ${tokens.colorBgSubtle} 100%)`,
          },
          avatar: {
            background: `linear-gradient(135deg, ${tokens.colorPrimary} 0%, ${tokens.colorInfo} 100%)`,
            borderRadius: '1rem',
            width: '3.5rem',
            height: '3.5rem',
          },
          title: {
            backgroundColor: tokens.colorPrimary,
            opacity: 0.3,
            height: '1.25rem',
            borderRadius: '999px',
          },
          paragraph: {
            gap: '0.625rem',
          },
        }}
      />
    </div>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────────

export function PlaceholderSection() {
  return (
    <div>
      <Text size="xl" weight="bold" style={{ display: 'block', marginBottom: 24 }}>Placeholder</Text>

      <Section title="Basic" align="start">
        <BasicDemo />
      </Section>

      <Section title="Active Animation" align="start">
        <ActiveDemo />
      </Section>

      <Section title="With Avatar" align="start">
        <AvatarDemo />
      </Section>

      <Section title="Sizes">
        <SizesDemo />
      </Section>

      <Section title="Loading State" align="start">
        <LoadingDemo />
      </Section>

      <Section title="Button Shapes">
        <ButtonShapesDemo />
      </Section>

      <Section title="Image">
        <ImageDemo />
      </Section>

      <Section title="Custom Node">
        <NodeDemo />
      </Section>

      <Section title="Paragraph Configuration" align="start">
        <ParagraphDemo />
      </Section>

      <Section title="Complex Combination" align="start">
        <ComplexDemo />
      </Section>

      <Section title="Custom Semantic Styling" align="start">
        <SemanticStylingDemo />
      </Section>
    </div>
  )
}
