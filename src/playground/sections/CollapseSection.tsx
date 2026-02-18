import { Collapse, Text, tokens } from '../../index'
import { Section } from './shared'

// ─── 1. Basic ────────────────────────────────────────────────────────────────

function BasicDemo() {
  return (
    <div style={{ width: 600 }}>
      <Collapse
        defaultActiveKey={['1']}
        items={[
          { key: '1', label: 'This is panel header 1', children: <p style={{ margin: 0 }}>A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.</p> },
          { key: '2', label: 'This is panel header 2', children: <p style={{ margin: 0 }}>A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.</p> },
          { key: '3', label: 'This is panel header 3', children: <p style={{ margin: 0 }}>A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.</p> },
        ]}
      />
    </div>
  )
}

// ─── 2. Size ─────────────────────────────────────────────────────────────────

function SizeDemo() {
  const items = [
    { key: '1', label: 'This is panel header 1', children: <p style={{ margin: 0 }}>Content of panel 1</p> },
    { key: '2', label: 'This is panel header 2', children: <p style={{ margin: 0 }}>Content of panel 2</p> },
    { key: '3', label: 'This is panel header 3', children: <p style={{ margin: 0 }}>Content of panel 3</p> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Large</Text>
        <div style={{ width: 600 }}>
          <Collapse size="large" defaultActiveKey={['1']} items={items} />
        </div>
      </div>
      <div>
        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Middle (default)</Text>
        <div style={{ width: 600 }}>
          <Collapse size="middle" defaultActiveKey={['1']} items={items} />
        </div>
      </div>
      <div>
        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Small</Text>
        <div style={{ width: 600 }}>
          <Collapse size="small" defaultActiveKey={['1']} items={items} />
        </div>
      </div>
    </div>
  )
}

// ─── 3. Accordion ────────────────────────────────────────────────────────────

function AccordionDemo() {
  return (
    <div style={{ width: 600 }}>
      <Collapse
        accordion
        defaultActiveKey={['1']}
        items={[
          { key: '1', label: 'This is panel header 1', children: <p style={{ margin: 0 }}>Content of panel 1. Only one panel can be open at a time in accordion mode.</p> },
          { key: '2', label: 'This is panel header 2', children: <p style={{ margin: 0 }}>Content of panel 2. Opening this will close the other panel.</p> },
          { key: '3', label: 'This is panel header 3', children: <p style={{ margin: 0 }}>Content of panel 3. Try clicking different headers.</p> },
        ]}
      />
    </div>
  )
}

// ─── 4. Nested ───────────────────────────────────────────────────────────────

function NestedDemo() {
  return (
    <div style={{ width: 600 }}>
      <Collapse
        defaultActiveKey={['1']}
        items={[
          {
            key: '1',
            label: 'This is panel with nested collapse',
            children: (
              <Collapse
                defaultActiveKey={['a']}
                items={[
                  { key: 'a', label: 'Nested panel A', children: <p style={{ margin: 0 }}>Content of nested panel A</p> },
                  { key: 'b', label: 'Nested panel B', children: <p style={{ margin: 0 }}>Content of nested panel B</p> },
                ]}
              />
            ),
          },
          { key: '2', label: 'This is panel header 2', children: <p style={{ margin: 0 }}>Content of panel 2</p> },
        ]}
      />
    </div>
  )
}

// ─── 5. Borderless ───────────────────────────────────────────────────────────

function BorderlessDemo() {
  return (
    <div style={{ width: 600, backgroundColor: tokens.colorBgSubtle, padding: 24, borderRadius: 8 }}>
      <Collapse
        bordered={false}
        defaultActiveKey={['1']}
        items={[
          { key: '1', label: 'This is panel header 1', children: <p style={{ margin: 0 }}>Content rendered without an outer border.</p> },
          { key: '2', label: 'This is panel header 2', children: <p style={{ margin: 0 }}>Content rendered without an outer border.</p> },
          { key: '3', label: 'This is panel header 3', children: <p style={{ margin: 0 }}>Content rendered without an outer border.</p> },
        ]}
      />
    </div>
  )
}

// ─── 6. Ghost ────────────────────────────────────────────────────────────────

function GhostDemo() {
  return (
    <div style={{ width: 600, backgroundColor: tokens.colorBgSubtle, padding: 24, borderRadius: 8 }}>
      <Collapse
        ghost
        defaultActiveKey={['1']}
        items={[
          { key: '1', label: 'This is panel header 1', children: <p style={{ margin: 0 }}>Ghost mode has no border or background styling.</p> },
          { key: '2', label: 'This is panel header 2', children: <p style={{ margin: 0 }}>Ghost mode has no border or background styling.</p> },
          { key: '3', label: 'This is panel header 3', children: <p style={{ margin: 0 }}>Ghost mode has no border or background styling.</p> },
        ]}
      />
    </div>
  )
}

// ─── 7. Custom Expand Icon ───────────────────────────────────────────────────

function CustomIconDemo() {
  return (
    <div style={{ width: 600 }}>
      <Collapse
        defaultActiveKey={['1']}
        expandIcon={({ isActive }) => (
          <span style={{
            display: 'inline-flex',
            transform: isActive ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 200ms ease',
            fontSize: '0.75rem',
          }}>
            {isActive ? '▼' : '▶'}
          </span>
        )}
        items={[
          { key: '1', label: 'Custom icon panel 1', children: <p style={{ margin: 0 }}>Panel with a custom expand icon.</p> },
          { key: '2', label: 'Custom icon panel 2', children: <p style={{ margin: 0 }}>Panel with a custom expand icon.</p> },
          { key: '3', label: 'No arrow panel', showArrow: false, children: <p style={{ margin: 0 }}>This panel has showArrow=false.</p> },
        ]}
      />
    </div>
  )
}

// ─── 8. Icon Position ────────────────────────────────────────────────────────

function IconPositionDemo() {
  return (
    <div style={{ width: 600 }}>
      <Collapse
        expandIconPlacement="end"
        defaultActiveKey={['1']}
        items={[
          { key: '1', label: 'Expand icon on the right', children: <p style={{ margin: 0 }}>The expand icon is placed at the end of the header.</p> },
          { key: '2', label: 'Another panel', children: <p style={{ margin: 0 }}>The expand icon is placed at the end of the header.</p> },
          { key: '3', label: 'Third panel', children: <p style={{ margin: 0 }}>The expand icon is placed at the end of the header.</p> },
        ]}
      />
    </div>
  )
}

// ─── 9. Extra Node ───────────────────────────────────────────────────────────

function ExtraNodeDemo() {
  return (
    <div style={{ width: 600 }}>
      <Collapse
        defaultActiveKey={['1']}
        items={[
          {
            key: '1',
            label: 'Panel with extra',
            extra: <span onClick={e => e.stopPropagation()} style={{ color: tokens.colorPrimary, cursor: 'pointer', fontSize: '0.8125rem' }}>Settings</span>,
            children: <p style={{ margin: 0 }}>This panel has an extra element in the header.</p>,
          },
          {
            key: '2',
            label: 'Panel with badge',
            extra: <span style={{ backgroundColor: tokens.colorError, color: '#fff', borderRadius: '1rem', padding: '0.125rem 0.5rem', fontSize: '0.75rem' }}>3</span>,
            children: <p style={{ margin: 0 }}>This panel has a badge-like extra element.</p>,
          },
          {
            key: '3',
            label: 'No extra',
            children: <p style={{ margin: 0 }}>This panel has no extra element.</p>,
          },
        ]}
      />
    </div>
  )
}

// ─── 10. Collapsible ─────────────────────────────────────────────────────────

function CollapsibleDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          Collapsible = "header" (default, full header clickable)
        </Text>
        <div style={{ width: 600 }}>
          <Collapse
            collapsible="header"
            defaultActiveKey={['1']}
            items={[
              { key: '1', label: 'Click anywhere on the header', children: <p style={{ margin: 0 }}>This panel toggles when clicking anywhere on the header.</p> },
            ]}
          />
        </div>
      </div>
      <div>
        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          Collapsible = "icon" (only icon clickable)
        </Text>
        <div style={{ width: 600 }}>
          <Collapse
            collapsible="icon"
            defaultActiveKey={['1']}
            items={[
              { key: '1', label: 'Only the arrow icon is clickable', children: <p style={{ margin: 0 }}>This panel toggles only when clicking the arrow icon.</p> },
            ]}
          />
        </div>
      </div>
      <div>
        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          Collapsible = "disabled" (cannot toggle)
        </Text>
        <div style={{ width: 600 }}>
          <Collapse
            collapsible="disabled"
            defaultActiveKey={['1']}
            items={[
              { key: '1', label: 'This panel cannot be toggled', children: <p style={{ margin: 0 }}>This panel is permanently open and cannot be collapsed.</p> },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

// ─── 11. Semantic Styles ─────────────────────────────────────────────────────

function SemanticStylesDemo() {
  return (
    <div style={{ width: 600 }}>
      <Collapse
        defaultActiveKey={['1']}
        styles={{
          header: { backgroundColor: tokens.colorPrimaryBg, color: tokens.colorPrimary },
          content: { backgroundColor: tokens.colorBgSubtle },
        }}
        items={[
          { key: '1', label: 'Styled panel header', children: <p style={{ margin: 0 }}>This panel uses custom semantic styles for header and content.</p> },
          { key: '2', label: 'Another styled panel', children: <p style={{ margin: 0 }}>Consistent styling across panels via the styles prop.</p> },
        ]}
      />
    </div>
  )
}

// ─── 12. Custom Panel ────────────────────────────────────────────────────────

function CustomPanelDemo() {
  return (
    <div style={{ width: 600 }}>
      <Collapse
        bordered={false}
        defaultActiveKey={['1']}
        items={[
          {
            key: '1',
            label: 'Custom styled panel',
            children: <p style={{ margin: 0 }}>Each panel can have its own background, border, and margin styles.</p>,
            style: { marginBottom: 12, borderRadius: '0.5rem', border: `1px solid ${tokens.colorPrimary}`, overflow: 'hidden' },
          },
          {
            key: '2',
            label: 'Success panel',
            children: <p style={{ margin: 0 }}>This panel has a success-colored border.</p>,
            style: { marginBottom: 12, borderRadius: '0.5rem', border: `1px solid ${tokens.colorSuccess}`, overflow: 'hidden' },
          },
          {
            key: '3',
            label: 'Warning panel',
            children: <p style={{ margin: 0 }}>This panel has a warning-colored border.</p>,
            style: { borderRadius: '0.5rem', border: `1px solid ${tokens.colorWarning}`, overflow: 'hidden' },
          },
        ]}
      />
    </div>
  )
}

// ─── 13. Collapse.Panel (Legacy API) ─────────────────────────────────────────

function PanelDemo() {
  return (
    <div style={{ width: 600 }}>
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel panelKey="1" header="Panel 1 (Collapse.Panel)">
          <p style={{ margin: 0 }}>This panel uses the Collapse.Panel compound component API.</p>
        </Collapse.Panel>
        <Collapse.Panel panelKey="2" header="Panel 2 (Collapse.Panel)">
          <p style={{ margin: 0 }}>An alternative to the items prop for defining panels.</p>
        </Collapse.Panel>
        <Collapse.Panel panelKey="3" header="Panel 3 (Collapse.Panel)" extra={<span style={{ color: tokens.colorPrimary, fontSize: '0.8125rem' }}>Extra</span>}>
          <p style={{ margin: 0 }}>Supports extra, showArrow, and other props.</p>
        </Collapse.Panel>
      </Collapse>
    </div>
  )
}

// ─── Main Section ────────────────────────────────────────────────────────────

export function CollapseSection() {
  return (
    <div>
      <Text size="xl" weight="bold" style={{ display: 'block' }}>Collapse</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 32 }}>
        A content area which can be collapsed and expanded, showing only the header when collapsed.
      </Text>

      <Section title="Basic" align="start">
        <BasicDemo />
      </Section>

      <Section title="Size" align="start">
        <SizeDemo />
      </Section>

      <Section title="Accordion" align="start">
        <AccordionDemo />
      </Section>

      <Section title="Nested" align="start">
        <NestedDemo />
      </Section>

      <Section title="Borderless" align="start">
        <BorderlessDemo />
      </Section>

      <Section title="Ghost" align="start">
        <GhostDemo />
      </Section>

      <Section title="Custom Expand Icon" align="start">
        <CustomIconDemo />
      </Section>

      <Section title="Icon Position" align="start">
        <IconPositionDemo />
      </Section>

      <Section title="Extra Node" align="start">
        <ExtraNodeDemo />
      </Section>

      <Section title="Collapsible" align="start">
        <CollapsibleDemo />
      </Section>

      <Section title="Semantic Styles" align="start">
        <SemanticStylesDemo />
      </Section>

      <Section title="Custom Panel" align="start">
        <CustomPanelDemo />
      </Section>

      <Section title="Collapse.Panel" align="start">
        <PanelDemo />
      </Section>
    </div>
  )
}
