import { useState, useRef } from 'react'
import { Button, Tour, Text, tokens } from '../../index'
import type { TourStepConfig } from '../../index'
import { Section } from './shared'

// ─── 1. Basic ────────────────────────────────────────────────────────────────────

function BasicDemo() {
  const [open, setOpen] = useState(false)
  const ref1 = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)
  const ref3 = useRef<HTMLDivElement>(null)

  const steps: TourStepConfig[] = [
    {
      target: () => ref1.current,
      title: 'Upload File',
      description: 'Put your files here to start uploading.',
    },
    {
      target: () => ref2.current,
      title: 'Save Changes',
      description: 'Save your current progress before continuing.',
    },
    {
      target: () => ref3.current,
      title: 'Additional Actions',
      description: 'Click here for more options and settings.',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <Button onClick={() => setOpen(true)} variant="primary">Start Tour</Button>
      <div style={{ display: 'flex', gap: 12 }}>
        <div ref={ref1}><Button variant="outline">Upload</Button></div>
        <div ref={ref2}><Button variant="outline">Save</Button></div>
        <div ref={ref3}><Button variant="outline">More...</Button></div>
      </div>
      <Tour
        open={open}
        steps={steps}
        onClose={() => setOpen(false)}
        onFinish={() => setOpen(false)}
      />
    </div>
  )
}

// ─── 2. Placement ───────────────────────────────────────────────────────────────

function PlacementDemo() {
  const [open, setOpen] = useState(false)
  const [placement, setPlacement] = useState<'top' | 'bottom' | 'left' | 'right'>('bottom')
  const targetRef = useRef<HTMLDivElement>(null)

  const steps: TourStepConfig[] = [
    {
      target: () => targetRef.current,
      title: `Placement: ${placement}`,
      description: `The panel is placed on the ${placement} side of the target.`,
      placement,
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {(['top', 'bottom', 'left', 'right'] as const).map(p => (
          <Button
            key={p}
            size="sm"
            variant={placement === p ? 'primary' : 'outline'}
            onClick={() => setPlacement(p)}
          >
            {p}
          </Button>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
        <div ref={targetRef}>
          <Button variant="outline" onClick={() => setOpen(true)}>
            Click to show Tour ({placement})
          </Button>
        </div>
      </div>
      <Tour
        open={open}
        steps={steps}
        onClose={() => setOpen(false)}
        onFinish={() => setOpen(false)}
      />
    </div>
  )
}

// ─── 3. Non-modal (mask=false) ──────────────────────────────────────────────────

function NonModalDemo() {
  const [open, setOpen] = useState(false)
  const ref1 = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)

  const steps: TourStepConfig[] = [
    {
      target: () => ref1.current,
      title: 'Non-modal Tour',
      description: 'No mask overlay — you can still interact with the page.',
    },
    {
      target: () => ref2.current,
      title: 'Second Step',
      description: 'The tour continues without blocking the UI.',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <Button onClick={() => setOpen(true)} variant="primary" size="sm">Start Non-modal Tour</Button>
      <div style={{ display: 'flex', gap: 12 }}>
        <div ref={ref1}><Button variant="outline">Step 1</Button></div>
        <div ref={ref2}><Button variant="outline">Step 2</Button></div>
      </div>
      <Tour
        open={open}
        steps={steps}
        mask={false}
        onClose={() => setOpen(false)}
        onFinish={() => setOpen(false)}
      />
    </div>
  )
}

// ─── 4. Custom Mask ─────────────────────────────────────────────────────────────

function CustomMaskDemo() {
  const [open, setOpen] = useState(false)
  const targetRef = useRef<HTMLDivElement>(null)

  const steps: TourStepConfig[] = [
    {
      target: () => targetRef.current,
      title: 'Custom Mask Color',
      description: 'This tour has a purple-tinted mask overlay.',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <div ref={targetRef}><Button variant="outline">Target Element</Button></div>
        <Button onClick={() => setOpen(true)} variant="primary" size="sm">Start Tour</Button>
      </div>
      <Tour
        open={open}
        steps={steps}
        mask={{ color: 'rgba(128, 0, 128, 0.4)' }}
        onClose={() => setOpen(false)}
        onFinish={() => setOpen(false)}
      />
    </div>
  )
}

// ─── 5. Primary Type ────────────────────────────────────────────────────────────

function PrimaryDemo() {
  const [open, setOpen] = useState(false)
  const ref1 = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)

  const steps: TourStepConfig[] = [
    {
      target: () => ref1.current,
      title: 'Primary Style',
      description: 'This tour panel uses the primary color scheme.',
    },
    {
      target: () => ref2.current,
      title: 'Second Step',
      description: 'Buttons and indicators are styled for primary type.',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <Button onClick={() => setOpen(true)} variant="primary" size="sm">Start Primary Tour</Button>
      <div style={{ display: 'flex', gap: 12 }}>
        <div ref={ref1}><Button variant="outline">Feature A</Button></div>
        <div ref={ref2}><Button variant="outline">Feature B</Button></div>
      </div>
      <Tour
        open={open}
        steps={steps}
        type="primary"
        onClose={() => setOpen(false)}
        onFinish={() => setOpen(false)}
      />
    </div>
  )
}

// ─── 6. Cover Image ─────────────────────────────────────────────────────────────

function CoverDemo() {
  const [open, setOpen] = useState(false)
  const ref1 = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)

  const coverPlaceholder = (label: string, color: string) => (
    <div
      style={{
        height: 100,
        borderRadius: '0.375rem',
        backgroundColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 600,
        fontSize: '0.875rem',
      }}
    >
      {label}
    </div>
  )

  const steps: TourStepConfig[] = [
    {
      target: () => ref1.current,
      title: 'Upload Feature',
      description: 'Upload your files with drag and drop support.',
      cover: coverPlaceholder('Upload Preview', tokens.colorPrimary),
    },
    {
      target: () => ref2.current,
      title: 'Analytics Dashboard',
      description: 'View detailed analytics and reports.',
      cover: coverPlaceholder('Analytics Preview', tokens.colorSuccess),
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <Button onClick={() => setOpen(true)} variant="primary" size="sm">Start Tour with Covers</Button>
      <div style={{ display: 'flex', gap: 12 }}>
        <div ref={ref1}><Button variant="outline">Upload</Button></div>
        <div ref={ref2}><Button variant="outline">Analytics</Button></div>
      </div>
      <Tour
        open={open}
        steps={steps}
        onClose={() => setOpen(false)}
        onFinish={() => setOpen(false)}
      />
    </div>
  )
}

// ─── 7. Custom Action ───────────────────────────────────────────────────────────

function CustomActionDemo() {
  const [open, setOpen] = useState(false)
  const ref1 = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)
  const ref3 = useRef<HTMLDivElement>(null)

  const steps: TourStepConfig[] = [
    {
      target: () => ref1.current,
      title: 'Upload File',
      description: 'Put your files here.',
    },
    {
      target: () => ref2.current,
      title: 'Save Changes',
      description: 'Save your progress.',
    },
    {
      target: () => ref3.current,
      title: 'More Options',
      description: 'Click for more settings.',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <Button onClick={() => setOpen(true)} variant="primary" size="sm">Start Custom Action Tour</Button>
      <div style={{ display: 'flex', gap: 12 }}>
        <div ref={ref1}><Button variant="outline">Upload</Button></div>
        <div ref={ref2}><Button variant="outline">Save</Button></div>
        <div ref={ref3}><Button variant="outline">More...</Button></div>
      </div>
      <Tour
        open={open}
        steps={steps}
        onClose={() => setOpen(false)}
        onFinish={() => setOpen(false)}
        actionsRender={(_actions, { current, total, goTo, close }) => (
          <>
            {current > 0 && (
              <Button variant="outline" size="sm" onClick={() => goTo(current - 1)}>
                Previous
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={close}>
              Skip
            </Button>
            {current < total - 1 ? (
              <Button variant="primary" size="sm" onClick={() => goTo(current + 1)}>
                Next
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={close}>
                Finish
              </Button>
            )}
          </>
        )}
      />
    </div>
  )
}

// ─── 8. Custom Highlighted Area Style ───────────────────────────────────────────

function HighlightedAreaDemo() {
  const [open, setOpen] = useState<number | false>(false)
  const ref1 = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)
  const ref3 = useRef<HTMLDivElement>(null)

  const steps: TourStepConfig[] = [
    {
      target: () => ref1.current,
      title: 'Default gap',
      description: 'Default offset (6px) and radius (2px).',
    },
    {
      target: () => ref2.current,
      title: 'Larger gap',
      description: 'Offset 12px with radius 8px — more padding around the element.',
    },
    {
      target: () => ref3.current,
      title: 'Asymmetric gap',
      description: 'Horizontal offset 20px, vertical offset 4px — wider highlight.',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <Button onClick={() => setOpen(0)} variant="primary" size="sm">Default (6/2)</Button>
        <Button onClick={() => setOpen(1)} variant="primary" size="sm">Large (12/8)</Button>
        <Button onClick={() => setOpen(2)} variant="primary" size="sm">Asymmetric [20,4]</Button>
      </div>
      <div style={{ display: 'flex', gap: 24 }}>
        <div ref={ref1}>
          <div style={{ padding: '0.75rem 1rem', backgroundColor: tokens.colorBgSubtle, borderRadius: '0.5rem', border: `1px solid ${tokens.colorBorder}` }}>
            Element A
          </div>
        </div>
        <div ref={ref2}>
          <div style={{ padding: '0.75rem 1rem', backgroundColor: tokens.colorBgSubtle, borderRadius: '0.5rem', border: `1px solid ${tokens.colorBorder}` }}>
            Element B
          </div>
        </div>
        <div ref={ref3}>
          <div style={{ padding: '0.75rem 1rem', backgroundColor: tokens.colorBgSubtle, borderRadius: '0.5rem', border: `1px solid ${tokens.colorBorder}` }}>
            Element C
          </div>
        </div>
      </div>
      {open === 0 && (
        <Tour
          open
          steps={[steps[0]]}
          onClose={() => setOpen(false)}
          onFinish={() => setOpen(false)}
        />
      )}
      {open === 1 && (
        <Tour
          open
          steps={[steps[1]]}
          gap={{ offset: 12, radius: 8 }}
          onClose={() => setOpen(false)}
          onFinish={() => setOpen(false)}
        />
      )}
      {open === 2 && (
        <Tour
          open
          steps={[steps[2]]}
          gap={{ offset: [20, 4], radius: 4 }}
          onClose={() => setOpen(false)}
          onFinish={() => setOpen(false)}
        />
      )}
    </div>
  )
}

// ─── 9. Custom Indicators ───────────────────────────────────────────────────────

function CustomIndicatorsDemo() {
  const [open, setOpen] = useState(false)
  const ref1 = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)
  const ref3 = useRef<HTMLDivElement>(null)

  const steps: TourStepConfig[] = [
    {
      target: () => ref1.current,
      title: 'Step One',
      description: 'The first step of the tour.',
    },
    {
      target: () => ref2.current,
      title: 'Step Two',
      description: 'The second step of the tour.',
    },
    {
      target: () => ref3.current,
      title: 'Step Three',
      description: 'The final step of the tour.',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <Button onClick={() => setOpen(true)} variant="primary" size="sm">Start Tour</Button>
      <div style={{ display: 'flex', gap: 12 }}>
        <div ref={ref1}><Button variant="outline">A</Button></div>
        <div ref={ref2}><Button variant="outline">B</Button></div>
        <div ref={ref3}><Button variant="outline">C</Button></div>
      </div>
      <Tour
        open={open}
        steps={steps}
        indicatorsRender={(current, total) => (
          <span style={{ fontSize: '0.75rem', color: tokens.colorTextMuted }}>
            Step {current + 1} of {total}
          </span>
        )}
        onClose={() => setOpen(false)}
        onFinish={() => setOpen(false)}
      />
    </div>
  )
}

// ─── 10. Without Target (Centered) ──────────────────────────────────────────────

function CenteredDemo() {
  const [open, setOpen] = useState(false)

  const steps: TourStepConfig[] = [
    {
      title: 'Welcome!',
      description: 'This tour has no target element — the panel is centered on screen.',
    },
    {
      title: 'Getting Started',
      description: 'You can create steps without targets for introductory messages.',
    },
  ]

  return (
    <div>
      <Button onClick={() => setOpen(true)} variant="primary" size="sm">Show Centered Tour</Button>
      <Tour
        open={open}
        steps={steps}
        onClose={() => setOpen(false)}
        onFinish={() => setOpen(false)}
      />
    </div>
  )
}

// ─── 11. Semantic Styling ───────────────────────────────────────────────────────

function SemanticDemo() {
  const [open, setOpen] = useState(false)
  const targetRef = useRef<HTMLDivElement>(null)

  const steps: TourStepConfig[] = [
    {
      target: () => targetRef.current,
      title: 'Custom Styled Panel',
      description: 'This tour panel is styled using semantic slots.',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <Text size="sm" type="secondary" style={{ display: 'block' }}>
        Slots: <Text code>root</Text>, <Text code>mask</Text>, <Text code>popup</Text>,{' '}
        <Text code>title</Text>, <Text code>description</Text>, <Text code>footer</Text>,{' '}
        <Text code>arrow</Text>, <Text code>close</Text>, <Text code>cover</Text>,{' '}
        <Text code>indicators</Text>
      </Text>
      <div style={{ display: 'flex', gap: 12 }}>
        <div ref={targetRef}><Button variant="outline">Target</Button></div>
        <Button onClick={() => setOpen(true)} variant="primary" size="sm">Start Styled Tour</Button>
      </div>
      <Tour
        open={open}
        steps={steps}
        styles={{
          popup: {
            background: `linear-gradient(135deg, ${tokens.colorPrimary}, #7c3aed)`,
            color: '#fff',
            border: 'none',
            borderRadius: '1rem',
          },
          title: { fontSize: '1rem', color: '#fff' },
          description: { color: 'rgba(255,255,255,0.85)' },
          arrow: { background: tokens.colorPrimary, borderColor: 'transparent' },
        }}
        onClose={() => setOpen(false)}
        onFinish={() => setOpen(false)}
      />
    </div>
  )
}

// ─── Main Section ────────────────────────────────────────────────────────────────

export function TourSection() {
  return (
    <div>
      <Text size="xl" weight="bold" style={{ display: 'block' }}>Tour</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 32 }}>
        A popup component for guiding users through a product. Highlights target elements with a spotlight mask.
      </Text>

      <Section title="Basic">
        <BasicDemo />
      </Section>

      <Section title="Placement">
        <PlacementDemo />
      </Section>

      <Section title="Non-modal (mask=false)">
        <NonModalDemo />
      </Section>

      <Section title="Custom Mask Color">
        <CustomMaskDemo />
      </Section>

      <Section title="Primary Type">
        <PrimaryDemo />
      </Section>

      <Section title="Cover Image">
        <CoverDemo />
      </Section>

      <Section title="Custom Action">
        <CustomActionDemo />
      </Section>

      <Section title="Custom Highlighted Area Style">
        <HighlightedAreaDemo />
      </Section>

      <Section title="Custom Indicators">
        <CustomIndicatorsDemo />
      </Section>

      <Section title="Without Target (Centered)">
        <CenteredDemo />
      </Section>

      <Section title="Semantic Styling">
        <SemanticDemo />
      </Section>
    </div>
  )
}
