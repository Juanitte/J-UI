import { useRef, useState } from 'react'
import { Carousel, Text, tokens } from '../../index'
import type { CarouselRef } from '../../index'
import { Section } from './shared'

// ─── Shared slide style ──────────────────────────────────────────────────────

const COLORS = [tokens.colorPrimary, tokens.colorSuccess, tokens.colorWarning, tokens.colorError]

function SlideBox({ index }: { index: number }) {
  return (
    <div style={{
      height: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS[index % COLORS.length],
      color: '#fff',
      fontSize: '1.5rem',
      fontWeight: 700,
      borderRadius: '0.25rem',
    }}>
      Slide {index + 1}
    </div>
  )
}

// ─── 1. Basic ────────────────────────────────────────────────────────────────

function BasicDemo() {
  return (
    <div style={{ width: 500 }}>
      <Carousel>
        <SlideBox index={0} />
        <SlideBox index={1} />
        <SlideBox index={2} />
        <SlideBox index={3} />
      </Carousel>
    </div>
  )
}

// ─── 2. Fade Effect ──────────────────────────────────────────────────────────

function FadeDemo() {
  return (
    <div style={{ width: 500 }}>
      <Carousel effect="fade" autoplay>
        <SlideBox index={0} />
        <SlideBox index={1} />
        <SlideBox index={2} />
        <SlideBox index={3} />
      </Carousel>
    </div>
  )
}

// ─── 3. Autoplay ─────────────────────────────────────────────────────────────

function AutoplayDemo() {
  return (
    <div style={{ width: 500 }}>
      <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
        Hover to pause autoplay
      </Text>
      <Carousel autoplay autoplaySpeed={2000}>
        <SlideBox index={0} />
        <SlideBox index={1} />
        <SlideBox index={2} />
        <SlideBox index={3} />
      </Carousel>
    </div>
  )
}

// ─── 3b. Dot Progress ────────────────────────────────────────────────────────

function DotProgressDemo() {
  return (
    <div style={{ width: 500 }}>
      <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
        Active dot shows progress until next slide. Hover to pause.
      </Text>
      <Carousel autoplay autoplaySpeed={3000} dotProgress>
        <SlideBox index={0} />
        <SlideBox index={1} />
        <SlideBox index={2} />
        <SlideBox index={3} />
      </Carousel>
    </div>
  )
}

// ─── 4. Arrows ───────────────────────────────────────────────────────────────

function ArrowsDemo() {
  return (
    <div style={{ width: 500 }}>
      <Carousel arrows>
        <SlideBox index={0} />
        <SlideBox index={1} />
        <SlideBox index={2} />
        <SlideBox index={3} />
      </Carousel>
    </div>
  )
}

// ─── 5. Dot Placement ────────────────────────────────────────────────────────

function DotPlacementDemo() {
  const [placement, setPlacement] = useState<'top' | 'bottom' | 'left' | 'right'>('bottom')

  return (
    <div style={{ width: 500 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {(['top', 'bottom', 'left', 'right'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPlacement(p)}
            style={{
              padding: '4px 12px',
              border: `1px solid ${placement === p ? tokens.colorPrimary : tokens.colorBorder}`,
              borderRadius: 4,
              backgroundColor: placement === p ? tokens.colorPrimaryBg : tokens.colorBg,
              color: placement === p ? tokens.colorPrimary : tokens.colorText,
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            {p}
          </button>
        ))}
      </div>
      <div style={{ height: 250 }}>
        <Carousel dotPlacement={placement} arrows style={{ height: '100%' }}>
          <SlideBox index={0} />
          <SlideBox index={1} />
          <SlideBox index={2} />
          <SlideBox index={3} />
        </Carousel>
      </div>
    </div>
  )
}

// ─── 6. Draggable ────────────────────────────────────────────────────────────

function DraggableDemo() {
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <div style={{ width: 500 }}>
        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          Free drag — skip multiple slides
        </Text>
        <Carousel draggable>
          <SlideBox index={0} />
          <SlideBox index={1} />
          <SlideBox index={2} />
          <SlideBox index={3} />
        </Carousel>
      </div>
      <div style={{ width: 500 }}>
        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          Clamped drag — max 1 slide per gesture
        </Text>
        <Carousel draggable dragClamp>
          <SlideBox index={0} />
          <SlideBox index={1} />
          <SlideBox index={2} />
          <SlideBox index={3} />
        </Carousel>
      </div>
    </div>
  )
}

// ─── 7. Ref Methods ──────────────────────────────────────────────────────────

function RefMethodsDemo() {
  const carouselRef = useRef<CarouselRef>(null)

  return (
    <div style={{ width: 500 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button
          onClick={() => carouselRef.current?.prev()}
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
          Prev
        </button>
        <button
          onClick={() => carouselRef.current?.next()}
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
          Next
        </button>
        {[0, 1, 2, 3].map(i => (
          <button
            key={i}
            onClick={() => carouselRef.current?.goTo(i)}
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
            Go to {i + 1}
          </button>
        ))}
      </div>
      <Carousel ref={carouselRef} dots={false}>
        <SlideBox index={0} />
        <SlideBox index={1} />
        <SlideBox index={2} />
        <SlideBox index={3} />
      </Carousel>
    </div>
  )
}

// ─── 8. Semantic Styles ──────────────────────────────────────────────────────

function SemanticStylesDemo() {
  return (
    <div style={{ width: 500 }}>
      <Carousel
        arrows
        styles={{
          root: { borderRadius: '0.75rem', overflow: 'hidden', border: `2px solid ${tokens.colorPrimary}` },
          dots: { padding: '0.5rem 0' },
        }}
      >
        <SlideBox index={0} />
        <SlideBox index={1} />
        <SlideBox index={2} />
        <SlideBox index={3} />
      </Carousel>
    </div>
  )
}

// ─── Main Section ────────────────────────────────────────────────────────────

export function CarouselSection() {
  return (
    <div>
      <Text size="xl" weight="bold" style={{ display: 'block' }}>Carousel</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 32 }}>
        A slideshow component for cycling through slides with autoplay, navigation, and transitions.
      </Text>

      <Section title="Basic" align="start">
        <BasicDemo />
      </Section>

      <Section title="Fade Effect" align="start">
        <FadeDemo />
      </Section>

      <Section title="Autoplay" align="start">
        <AutoplayDemo />
      </Section>

      <Section title="Dot Progress" align="start">
        <DotProgressDemo />
      </Section>

      <Section title="Arrows" align="start">
        <ArrowsDemo />
      </Section>

      <Section title="Dot Placement" align="start">
        <DotPlacementDemo />
      </Section>

      <Section title="Draggable" align="start">
        <DraggableDemo />
      </Section>

      <Section title="Ref Methods" align="start">
        <RefMethodsDemo />
      </Section>

      <Section title="Semantic Styles" align="start">
        <SemanticStylesDemo />
      </Section>
    </div>
  )
}
