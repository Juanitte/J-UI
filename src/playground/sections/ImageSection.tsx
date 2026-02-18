import { useState } from 'react'
import { Image, Text, Button, tokens } from '../../index'
import { Section } from './shared'

const sampleImg = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop'
const sampleImg2 = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop'
const sampleImg3 = 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&h=400&fit=crop'
const sampleImg4 = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop'
const sampleImgHiRes = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&h=1280&fit=crop'

// ─── 1. Basic ────────────────────────────────────────────────────────────────

function BasicDemo() {
  return <Image src={sampleImg} alt="Mountain lake" width={300} height={200} />
}

// ─── 2. Custom Sizes ─────────────────────────────────────────────────────────

function CustomSizesDemo() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <Image src={sampleImg2} alt="Valley" width={120} height={80} style={{ borderRadius: '0.5rem' }} />
      <Image src={sampleImg2} alt="Valley" width={200} height={150} style={{ borderRadius: '0.5rem' }} />
      <Image src={sampleImg2} alt="Valley" width={300} height={200} style={{ borderRadius: '0.5rem' }} />
    </div>
  )
}

// ─── 3. Placeholder ──────────────────────────────────────────────────────────

function PlaceholderDemo() {
  const [key, setKey] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
      <Image
        key={key}
        src={`${sampleImg3}&t=${key}`}
        alt="Forest"
        width={300}
        height={200}
        placeholder
      />
      <Button size="sm" onClick={() => setKey(k => k + 1)}>Reload</Button>
    </div>
  )
}

// ─── 4. Fallback ─────────────────────────────────────────────────────────────

function FallbackDemo() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <div>
        <Image
          src="https://invalid-url-that-does-not-exist.jpg"
          fallback={sampleImg4}
          alt="Fallback image"
          width={200}
          height={140}
        />
        <Text size="xs" type="secondary" style={{ display: 'block', marginTop: 4 }}>With fallback</Text>
      </div>
      <div>
        <Image
          src="https://invalid-url-that-does-not-exist.jpg"
          alt="Broken image"
          width={200}
          height={140}
        />
        <Text size="xs" type="secondary" style={{ display: 'block', marginTop: 4 }}>No fallback</Text>
      </div>
    </div>
  )
}

// ─── 5. Preview Disabled ─────────────────────────────────────────────────────

function PreviewDisabledDemo() {
  return <Image src={sampleImg} alt="No preview" width={200} height={140} preview={false} />
}

// ─── 6. Custom Preview Src ───────────────────────────────────────────────────

function CustomPreviewSrcDemo() {
  return (
    <div>
      <Image
        src={sampleImg}
        alt="Thumbnail → High-res"
        width={200}
        height={140}
        preview={{ src: sampleImgHiRes }}
      />
      <Text size="xs" type="secondary" style={{ display: 'block', marginTop: 4 }}>
        Click to see high-res version
      </Text>
    </div>
  )
}

// ─── 7. Preview Group ────────────────────────────────────────────────────────

function PreviewGroupDemo() {
  return (
    <Image.PreviewGroup>
      <div style={{ display: 'flex', gap: 12 }}>
        <Image src={sampleImg} alt="Image 1" width={150} height={100} />
        <Image src={sampleImg2} alt="Image 2" width={150} height={100} />
        <Image src={sampleImg3} alt="Image 3" width={150} height={100} />
        <Image src={sampleImg4} alt="Image 4" width={150} height={100} />
      </div>
    </Image.PreviewGroup>
  )
}

// ─── 8. Preview Group (items) ────────────────────────────────────────────────

function PreviewGroupItemsDemo() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <Image.PreviewGroup
        items={[
          { src: sampleImg, alt: 'Mountain lake' },
          { src: sampleImg2, alt: 'Valley' },
          { src: sampleImg3, alt: 'Forest' },
          { src: sampleImg4, alt: 'Meadow' },
        ]}
      />
    </div>
  )
}

// ─── 9. Preview from One Image ──────────────────────────────────────────────

function PreviewFromOneDemo() {
  return (
    <Image.PreviewGroup
      items={[
        { src: sampleImg, alt: 'Mountain lake' },
        { src: sampleImg2, alt: 'Valley' },
        { src: sampleImg3, alt: 'Forest' },
        { src: sampleImg4, alt: 'Meadow' },
      ]}
    >
      <Image src={sampleImg} alt="Click to browse gallery" width={200} height={140} />
    </Image.PreviewGroup>
  )
}

// ─── 10. Controlled Preview ──────────────────────────────────────────────────

function ControlledPreviewDemo() {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Image
        src={sampleImg3}
        alt="Forest"
        width={200}
        height={140}
        preview={{ open, onOpenChange: setOpen }}
      />
      <Button size="sm" variant="primary" onClick={() => setOpen(true)}>Open Preview</Button>
    </div>
  )
}

// ─── 11. Semantic Styles ─────────────────────────────────────────────────────

function SemanticStylesDemo() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <Image
        src={sampleImg}
        alt="Rounded"
        width={200}
        height={200}
        styles={{
          root: { borderRadius: '50%', border: `3px solid ${tokens.colorPrimary}` },
          image: { objectFit: 'cover' },
          mask: { borderRadius: '50%' },
        }}
      />
      <Image
        src={sampleImg2}
        alt="Styled"
        width={200}
        height={140}
        styles={{
          root: { borderRadius: '0.75rem', boxShadow: tokens.shadowLg },
          mask: { borderRadius: '0.75rem', backgroundColor: 'rgba(0,0,0,0.6)' },
        }}
      />
    </div>
  )
}

// ─── Main Section ────────────────────────────────────────────────────────────

export function ImageSection() {
  return (
    <div>
      <Text size="xl" weight="bold" style={{ display: 'block' }}>Image</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 32 }}>
        Previewable image component with zoom, rotate, flip, and gallery navigation.
      </Text>

      <Section title="Basic">
        <BasicDemo />
      </Section>

      <Section title="Custom Sizes">
        <CustomSizesDemo />
      </Section>

      <Section title="Placeholder">
        <PlaceholderDemo />
      </Section>

      <Section title="Fallback">
        <FallbackDemo />
      </Section>

      <Section title="Preview Disabled">
        <PreviewDisabledDemo />
      </Section>

      <Section title="Custom Preview Source">
        <CustomPreviewSrcDemo />
      </Section>

      <Section title="Preview Group">
        <PreviewGroupDemo />
      </Section>

      <Section title="Preview Group (items)">
        <PreviewGroupItemsDemo />
      </Section>

      <Section title="Preview from One Image">
        <PreviewFromOneDemo />
      </Section>

      <Section title="Controlled Preview">
        <ControlledPreviewDemo />
      </Section>

      <Section title="Semantic Styles">
        <SemanticStylesDemo />
      </Section>
    </div>
  )
}
