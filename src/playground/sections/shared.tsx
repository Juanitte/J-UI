import { Children, type ReactNode } from 'react'
import { Text, tokens } from '../../index'

export function Section({ title, children, align = 'center' }: { title: string; children: ReactNode; align?: 'center' | 'start' | 'end' }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <Text size="md" weight="extrabold" type="secondary" style={{ display: 'block', marginBottom: 12, textTransform: 'uppercase' }}>
        {title}
      </Text>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: align === 'center' ? 'center' : align === 'start' ? 'flex-start' : 'flex-end' }}>
        {Children.map(children, child => (
          <div style={{ minWidth: 0, maxWidth: '100%' }}>{child}</div>
        ))}
      </div>
    </div>
  )
}

export function NavItem({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <li>
      <button
        onClick={onClick}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: 'none',
          borderRadius: 4,
          backgroundColor: active ? tokens.colorPrimary : 'transparent',
          color: active ? tokens.colorPrimaryContrast : tokens.colorText,
          textAlign: 'left',
          cursor: 'pointer',
          fontSize: 14,
        }}
      >
        {label}
      </button>
    </li>
  )
}
