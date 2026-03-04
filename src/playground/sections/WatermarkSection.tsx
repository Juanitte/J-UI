import { Watermark, Text, tokens } from '../../index'
import { Section } from './shared'

// ─── Shared card wrapper ──────────────────────────────────────────────────────

function Card({ children, height = 300 }: { children?: React.ReactNode; height?: number }) {
  return (
    <div
      style={{
        height,
        border: `1px solid ${tokens.colorBorder}`,
        borderRadius: '0.5rem',
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'flex-start',
        background: tokens.colorBg,
      }}
    >
      {children}
    </div>
  )
}

// ─── 1. Basic ─────────────────────────────────────────────────────────────────

function BasicDemo() {
  return (
    <div style={{ width: '100%', maxWidth: 500 }}>
      <Watermark content="J-UI">
        <Card>
          <div>
            <Text weight="bold" style={{ display: 'block', marginBottom: '0.5rem' }}>Basic Text Watermark</Text>
            <Text type="secondary">The watermark tiles over the content without blocking interaction.</Text>
          </div>
        </Card>
      </Watermark>
    </div>
  )
}

// ─── 2. Multi-line ────────────────────────────────────────────────────────────

function MultiLineDemo() {
  return (
    <div style={{ width: '100%', maxWidth: 500 }}>
      <Watermark content={['Acme Corp', 'Confidential']}>
        <Card height={300}>
          <div>
            <Text weight="bold" style={{ display: 'block', marginBottom: '0.5rem' }}>Multi-line Watermark</Text>
            <Text type="secondary">Pass an array of strings to render multiple lines.</Text>
          </div>
        </Card>
      </Watermark>
    </div>
  )
}

// ─── 3. Custom Font ───────────────────────────────────────────────────────────

function CustomFontDemo() {
  return (
    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 220px' }}>
        <Text type="secondary" size="sm" style={{ display: 'block', marginBottom: '0.5rem' }}>Large + Red</Text>
        <Watermark
          content="DRAFT"
          font={{ fontSize: 22, color: 'rgba(220,53,69,0.35)', fontWeight: 'bold' }}
        >
          <Card height={300} />
        </Watermark>
      </div>
      <div style={{ flex: '1 1 220px' }}>
        <Text type="secondary" size="sm" style={{ display: 'block', marginBottom: '0.5rem' }}>Italic + Blue</Text>
        <Watermark
          content="J-UI Library"
          font={{ fontStyle: 'italic', color: 'rgba(99,102,241,0.4)', fontSize: 14 }}
        >
          <Card height={300} />
        </Watermark>
      </div>
      <div style={{ flex: '1 1 220px' }}>
        <Text type="secondary" size="sm" style={{ display: 'block', marginBottom: '0.5rem' }}>Small + Light</Text>
        <Watermark
          content="Internal Use Only"
          font={{ fontSize: 11, color: 'rgba(150,150,150,0.5)', fontWeight: 'lighter' }}
        >
          <Card height={300} />
        </Watermark>
      </div>
    </div>
  )
}

// ─── 4. Rotation ──────────────────────────────────────────────────────────────

function RotationDemo() {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {([-45, -22, 0, 22] as const).map((deg) => (
        <div key={deg} style={{ flex: '1 1 140px' }}>
          <Text type="secondary" size="sm" style={{ display: 'block', marginBottom: '0.5rem' }}>{deg}°</Text>
          <Watermark content="J-UI" rotate={deg}>
            <Card height={300} />
          </Watermark>
        </div>
      ))}
    </div>
  )
}

// ─── 5. Gap ───────────────────────────────────────────────────────────────────

function GapDemo() {
  return (
    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 220px' }}>
        <Text type="secondary" size="sm" style={{ display: 'block', marginBottom: '0.5rem' }}>Tight gap [40, 40]</Text>
        <Watermark content="J-UI" gap={[40, 40]}>
          <Card height={300} />
        </Watermark>
      </div>
      <div style={{ flex: '1 1 220px' }}>
        <Text type="secondary" size="sm" style={{ display: 'block', marginBottom: '0.5rem' }}>Default gap [100, 100]</Text>
        <Watermark content="J-UI">
          <Card height={300} />
        </Watermark>
      </div>
      <div style={{ flex: '1 1 220px' }}>
        <Text type="secondary" size="sm" style={{ display: 'block', marginBottom: '0.5rem' }}>Wide gap [200, 160]</Text>
        <Watermark content="J-UI" gap={[200, 160]}>
          <Card height={300} />
        </Watermark>
      </div>
    </div>
  )
}

// ─── 6. Image ─────────────────────────────────────────────────────────────────

// Inline SVG data URL — a simple shield icon
const SHIELD_SVG = `data:image/svg+xml;base64,${btoa(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(0,0,0,0.15)">
  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
</svg>`)}`

function ImageDemo() {
  return (
    <div style={{ width: '100%', maxWidth: 500 }}>
      <Watermark image={SHIELD_SVG} width={40} height={40} gap={[80, 60]}>
        <Card height={300}>
          <div>
            <Text weight="bold" style={{ display: 'block', marginBottom: '0.5rem' }}>Image Watermark</Text>
            <Text type="secondary">Provide an image URL (or data URL) instead of text content.</Text>
          </div>
        </Card>
      </Watermark>
    </div>
  )
}

// ─── 7. No Children ───────────────────────────────────────────────────────────

function NoChildrenDemo() {
  return (
    <div style={{ width: '100%', maxWidth: 500 }}>
      <Watermark
        content="Background Only"
        style={{
          height: 300,
          border: `1px solid ${tokens.colorBorder}`,
          borderRadius: '0.5rem',
          background: tokens.colorBg,
        }}
      />
    </div>
  )
}

// ─── 8. Custom Semantic Styling ───────────────────────────────────────────────

function SemanticStylingDemo() {
  return (
    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 220px' }}>
        <Text type="secondary" size="sm" style={{ display: 'block', marginBottom: '0.5rem' }}>Higher opacity</Text>
        <Watermark
          content="CONFIDENTIAL"
          font={{ fontSize: 14, color: 'rgba(220,53,69,0.55)', fontWeight: 'bold' }}
          gap={[60, 60]}
          rotate={-30}
        >
          <Card height={300} />
        </Watermark>
      </div>
      <div style={{ flex: '1 1 220px' }}>
        <Text type="secondary" size="sm" style={{ display: 'block', marginBottom: '0.5rem' }}>Clipped to border radius</Text>
        <Watermark
          content="CLIPPED"
          font={{ color: 'rgba(99,102,241,0.5)' }}
          styles={{ root: { borderRadius: '3rem', overflow: 'hidden', background: tokens.colorBgSubtle, border: `1px solid ${tokens.colorBorder}` } }}
        >
          <div style={{ height: 300, padding: '1.5rem' }}>
            <Text weight="bold" style={{ display: 'block' }}>Rounded container</Text>
            <Text type="secondary">The watermark is clipped to the border radius via overflow: hidden on the root slot.</Text>
          </div>
        </Watermark>
      </div>
    </div>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function WatermarkSection() {
  return (
    <div>
      <Text size="xl" weight="bold" style={{ display: 'block', marginBottom: 24 }}>Watermark</Text>

      <Section title="Basic" align="start">
        <BasicDemo />
      </Section>

      <Section title="Multi-line" align="start">
        <MultiLineDemo />
      </Section>

      <Section title="Custom Font" align="start">
        <CustomFontDemo />
      </Section>

      <Section title="Rotation" align="start">
        <RotationDemo />
      </Section>

      <Section title="Gap" align="start">
        <GapDemo />
      </Section>

      <Section title="Image" align="start">
        <ImageDemo />
      </Section>

      <Section title="No Children" align="start">
        <NoChildrenDemo />
      </Section>

      <Section title="Custom Semantic Styling" align="start">
        <SemanticStylingDemo />
      </Section>
    </div>
  )
}
