import { useRef, useCallback } from 'react'
import { Anchor, Text, tokens } from '../../index'
import { Section } from './shared'

const sectionStyle = {
  height: 600,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
  fontSize: 18,
  fontWeight: 600,
  color: '#fff',
}

const basicItems = [
  { key: 'intro', href: '#anchor-intro', title: 'Introducción' },
  { key: 'install', href: '#anchor-install', title: 'Instalación' },
  { key: 'usage', href: '#anchor-usage', title: 'Uso básico' },
  { key: 'api', href: '#anchor-api', title: 'API' },
  { key: 'faq', href: '#anchor-faq', title: 'FAQ' },
]

const nestedItems = [
  { key: 'getting-started', href: '#anchor-n-start', title: 'Primeros pasos' },
  {
    key: 'components',
    href: '#anchor-n-components',
    title: 'Componentes',
    children: [
      { key: 'button', href: '#anchor-n-button', title: 'Button' },
      { key: 'input', href: '#anchor-n-input', title: 'Input' },
    ],
  },
  { key: 'theming', href: '#anchor-n-theming', title: 'Temas' },
]

const horizontalItems = [
  { key: 'h-overview', href: '#anchor-h-overview', title: 'Overview' },
  { key: 'h-features', href: '#anchor-h-features', title: 'Features' },
  { key: 'h-pricing', href: '#anchor-h-pricing', title: 'Pricing' },
  { key: 'h-contact', href: '#anchor-h-contact', title: 'Contact' },
]

const colors = [tokens.colorPrimary, tokens.colorSuccess, tokens.colorWarning, tokens.colorError, tokens.colorInfo]

export function AnchorSection() {
  const scrollRef1 = useRef<HTMLDivElement>(null)
  const scrollRef2 = useRef<HTMLDivElement>(null)
  const scrollRef3 = useRef<HTMLDivElement>(null)

  const getContainer1 = useCallback(() => scrollRef1.current!, [])
  const getContainer2 = useCallback(() => scrollRef2.current!, [])
  const getContainer3 = useCallback(() => scrollRef3.current!, [])

  return (
    <div>
      <Text size="xl" weight="bold" style={{ display: 'block' }}>Anchor</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 32 }}>
        Navegación de anclas con seguimiento de scroll e indicador animado.
      </Text>

      <Section title="Básico">
        <div style={{ display: 'flex', gap: 24, width: '100%' }}>
          <Anchor
            items={basicItems}
            getContainer={getContainer1}
            style={{ flexShrink: 0, width: 160 }}
          />
          <div
            ref={scrollRef1}
            style={{
              flex: 1,
              height: 400,
              overflow: 'auto',
              border: `1px solid ${tokens.colorBorder}`,
              borderRadius: 8,
              padding: 16,
              width:400,
              scrollbarColor: `${tokens.colorSecondaryHover} transparent`
            }}
          >
            {basicItems.map((item, i) => (
              <div
                key={item.key}
                id={item.href.slice(1)}
                style={{ ...sectionStyle, backgroundColor: colors[i % colors.length], marginBottom: i < basicItems.length - 1 ? 16 : 0 }}
              >
                {item.title}
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Horizontal">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
          <Anchor
            items={horizontalItems}
            direction="horizontal"
            getContainer={getContainer3}
            style={{ borderBottom: `1px solid ${tokens.colorBorder}` }}
          />
          <div
            ref={scrollRef3}
            style={{
              height: 300,
              overflow: 'auto',
              border: `1px solid ${tokens.colorBorder}`,
              borderRadius: 8,
              padding: 16,
              width: 400,
              scrollbarColor: `${tokens.colorSecondaryHover} transparent`
            }}
          >
            {horizontalItems.map((item, i) => (
              <div
                key={item.key}
                id={item.href.slice(1)}
                style={{ ...sectionStyle, backgroundColor: colors[i % colors.length], marginBottom: i < horizontalItems.length - 1 ? 16 : 0 }}
              >
                {item.title}
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Con enlaces anidados">
        <div style={{ display: 'flex', gap: 24, width: '100%' }}>
          <Anchor
            items={nestedItems}
            getContainer={getContainer2}
            style={{ flexShrink: 0, width: 180 }}
          />
          <div
            ref={scrollRef2}
            style={{
              flex: 1,
              height: 400,
              overflow: 'auto',
              border: `1px solid ${tokens.colorBorder}`,
              borderRadius: 8,
              padding: 16,
              width:400,
              scrollbarColor: `${tokens.colorSecondaryHover} transparent`
            }}
          >
            {[
              { id: 'anchor-n-start', label: 'Primeros pasos' },
              { id: 'anchor-n-components', label: 'Componentes' },
              { id: 'anchor-n-button', label: 'Button' },
              { id: 'anchor-n-input', label: 'Input' },
              { id: 'anchor-n-theming', label: 'Temas' },
            ].map((s, i) => (
              <div
                key={s.id}
                id={s.id}
                style={{ ...sectionStyle, backgroundColor: colors[i % colors.length], marginBottom: i < 4 ? 16 : 0 }}
              >
                {s.label}
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Semantic DOM Styling (classNames / styles)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
          <Text size="sm" type="secondary" style={{ display: 'block' }}>
            Slots disponibles: <Text code>root</Text>, <Text code>track</Text>, <Text code>indicator</Text>, <Text code>link</Text>
          </Text>
          <div style={{ display: 'flex', gap: 24, width: '100%' }}>
            <Anchor
              items={basicItems}
              getContainer={getContainer1}
              style={{ flexShrink: 0, width: 180 }}
              styles={{
                root: { backgroundColor: '#faf5ff', padding: 8, borderRadius: 8, border: '1px solid #e9d5ff' },
                track: { backgroundColor: '#e9d5ff', borderRadius: 8 },
                indicator: { backgroundColor: '#8b5cf6', width: 3, borderRadius: 8 },
                link: { color: '#7c3aed', fontWeight: 600 },
              }}
            />
            <Text size="sm" type="secondary" style={{ display: 'block', alignSelf: 'center' }}>
              Scrollea el contenedor de la seccin "Bsico" para ver el indicador violeta
            </Text>
          </div>
        </div>
      </Section>

    </div>
  )
}
