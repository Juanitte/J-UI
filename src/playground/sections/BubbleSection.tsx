import type { ReactNode } from 'react'
import { Badge, Bubble, BackToTopIcon, ChatIcon, BellIcon, CloseIcon, Text, tokens } from '../../index'
import { Section } from './shared'

function HelpIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function EditIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function ShareIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}

function ArrowUpIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  )
}

function ArrowDownIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function ArrowLeftIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ArrowRightIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function MenuWrapper({ direction, icon }: { direction: 'top' | 'bottom' | 'left' | 'right'; icon: ReactNode }) {
  return (
    <Bubble.Menu
      direction={direction}
      icon={icon}
      openIcon={<CloseIcon />}
      color="secondary"
      style={{ position: 'relative' }}
    >
      <Bubble icon={<ChatIcon />} tooltip="Chat" />
      <Bubble icon={<BellIcon />} tooltip="Notificaciones" />
      <Bubble icon={<ShareIcon />} tooltip="Compartir" />
    </Bubble.Menu>
  )
}

export function BubbleSection() {
  return (
    <div>
      <Text size="xl" weight="bold" style={{ display: 'block' }}>Bubble</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 32 }}>
        Botón flotante con posición fija en la pantalla. Ideal para acciones rápidas como chat, notificaciones o volver arriba.
      </Text>

      <Section title="Posiciones">
        <div style={{ position: 'relative', width: '100%', height: 200, backgroundColor: tokens.colorBgMuted, borderRadius: 8, border: `1px dashed ${tokens.colorBorder}` }}>
          <Bubble position="top-left" icon={<ChatIcon />} tooltip="Top Left" style={{ position: 'absolute' }} offsetX={16} offsetY={16} />
          <Bubble position="top-right" icon={<BellIcon />} tooltip="Top Right" style={{ position: 'absolute' }} offsetX={16} offsetY={16} />
          <Bubble position="bottom-left" icon={<ChatIcon />} tooltip="Bottom Left" style={{ position: 'absolute' }} offsetX={16} offsetY={16} />
          <Bubble position="bottom-right" icon={<BellIcon />} tooltip="Bottom Right" style={{ position: 'absolute' }} offsetX={16} offsetY={16} />
        </div>
        <Text size="sm" type="secondary" style={{ display: 'block', marginTop: 8 }}>
          Nota: Los bubbles en el demo usan position: absolute. En uso real serán position: fixed.
        </Text>
      </Section>

      <Section title="Colores">
        <Bubble color="primary" icon={<ChatIcon />} style={{ position: 'relative' }} />
        <Bubble color="secondary" icon={<ChatIcon />} style={{ position: 'relative' }} />
        <Bubble color="success" icon={<ChatIcon />} style={{ position: 'relative' }} />
        <Bubble color="warning" icon={<ChatIcon />} style={{ position: 'relative' }} />
        <Bubble color="error" icon={<ChatIcon />} style={{ position: 'relative' }} />
        <Bubble color="info" icon={<ChatIcon />} style={{ position: 'relative' }} />
      </Section>

      <Section title="Tamaños">
        <Bubble size="sm" icon={<ChatIcon />} style={{ position: 'relative' }} tooltip="Small" />
        <Bubble size="md" icon={<ChatIcon />} style={{ position: 'relative' }} tooltip="Medium" />
        <Bubble size="lg" icon={<ChatIcon />} style={{ position: 'relative' }} tooltip="Large" />
      </Section>

      <Section title="Formas">
        <Bubble shape="circle" icon={<ChatIcon />} style={{ position: 'relative' }} tooltip="Circle" />
        <Bubble shape="square" icon={<ChatIcon />} style={{ position: 'relative' }} tooltip="Square" />
      </Section>

      <Section title="Con Badge">
        <Badge count={5}><Bubble icon={<BellIcon />} style={{ position: 'relative' }} tooltip="5 notificaciones" /></Badge>
        <Badge count={99}><Bubble icon={<BellIcon />} style={{ position: 'relative' }} tooltip="99 notificaciones" /></Badge>
        <Badge count={150}><Bubble icon={<BellIcon />} style={{ position: 'relative' }} tooltip="99+ notificaciones" /></Badge>
        <Badge dot><Bubble icon={<ChatIcon />} style={{ position: 'relative' }} tooltip="Nuevo mensaje" /></Badge>
      </Section>

      <Section title="Badge con diferentes colores">
        <Badge count={3} color={tokens.colorError as string}><Bubble icon={<BellIcon />} style={{ position: 'relative' }} /></Badge>
        <Badge count={3} color={tokens.colorSuccess as string}><Bubble icon={<BellIcon />} style={{ position: 'relative' }} /></Badge>
        <Badge count={3} color={tokens.colorWarning as string}><Bubble icon={<BellIcon />} style={{ position: 'relative' }} /></Badge>
        <Badge count={3} color={tokens.colorInfo as string}><Bubble icon={<BellIcon />} style={{ position: 'relative' }} /></Badge>
      </Section>

      <Section title="Sin sombra">
        <Bubble icon={<ChatIcon />} shadow={false} style={{ position: 'relative' }} tooltip="Sin sombra" />
        <Bubble icon={<ChatIcon />} shadow="sm" style={{ position: 'relative' }} tooltip="Shadow SM" />
        <Bubble icon={<ChatIcon />} shadow="md" style={{ position: 'relative' }} tooltip="Shadow MD" />
        <Bubble icon={<ChatIcon />} shadow="lg" style={{ position: 'relative' }} tooltip="Shadow LG" />
      </Section>

      <Section title="Con texto">
        <Bubble description="?" style={{ position: 'relative' }} tooltip="Ayuda" />
        <Bubble description="+" style={{ position: 'relative' }} tooltip="Añadir" color="success" />
        <Bubble description="!" style={{ position: 'relative' }} tooltip="Alerta" color="warning" />
      </Section>

      <Section title="Back to Top">
        <Bubble
          icon={<BackToTopIcon />}
          style={{ position: 'relative' }}
          tooltip="Volver arriba"
          color="secondary"
          onBackToTop={() => {}}
        />
        <Text size="sm" type="secondary" style={{ display: 'block' }}>
          Usa <Text code>onBackToTop</Text> para ejecutar scroll al inicio. Combina con <Text code>visibleOnScroll</Text> para mostrar solo tras hacer scroll.
        </Text>
      </Section>

      <Section title="Disabled">
        <Bubble icon={<ChatIcon />} disabled style={{ position: 'relative' }} tooltip="Deshabilitado" />
      </Section>

      <Section title="Tooltip en diferentes posiciones">
        <Bubble icon={<ChatIcon />} tooltip="Arriba" tooltipPosition="top" style={{ position: 'relative' }} />
        <Bubble icon={<ChatIcon />} tooltip="Abajo" tooltipPosition="bottom" style={{ position: 'relative' }} />
        <Bubble icon={<ChatIcon />} tooltip="Izquierda" tooltipPosition="left" style={{ position: 'relative' }} />
        <Bubble icon={<ChatIcon />} tooltip="Derecha" tooltipPosition="right" style={{ position: 'relative' }} />
      </Section>

      <Section title="Bubble.Group (Compacto)">
        <div style={{ position: 'relative', width: '100%', height: 280, backgroundColor: tokens.colorBgMuted, borderRadius: 8, border: `1px dashed ${tokens.colorBorder}` }}>
          <Bubble.Group
            position="bottom-right"
            style={{ position: 'absolute' }}
            offsetX={16}
            offsetY={16}
          >
            <Bubble icon={<HelpIcon />} tooltip="Ayuda" color="secondary" />
            <Bubble icon={<EditIcon />} tooltip="Editar" color="secondary" />
            <Bubble icon={<ShareIcon />} tooltip="Compartir" color="secondary" />
            <Bubble icon={<BackToTopIcon />} tooltip="Arriba" color="secondary" />
          </Bubble.Group>

          <Bubble.Group
            position="bottom-left"
            style={{ position: 'absolute' }}
            offsetX={16}
            offsetY={16}
          >
            <Bubble icon={<ChatIcon />} tooltip="Chat" />
            <Badge count={3}><Bubble icon={<BellIcon />} tooltip="Notificaciones" /></Badge>
          </Bubble.Group>
        </div>
        <Text size="sm" type="secondary" style={{ display: 'block', marginTop: 8 }}>
          Grupo compacto. Los bubbles están pegados formando un bloque.
        </Text>
      </Section>

      <Section title="Bubble.Menu (Direcciones)">
        <div style={{
          width: '100%',
          height: 550,
          backgroundColor: tokens.colorBgMuted,
          borderRadius: 8,
          border: `1px dashed ${tokens.colorBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto auto auto',
            gridTemplateRows: 'auto auto auto',
            gap: 8,
            alignItems: 'center',
            justifyItems: 'center',
          }}>
            <div />
            <MenuWrapper direction="top" icon={<ArrowUpIcon />} />
            <div />

            <MenuWrapper direction="left" icon={<ArrowLeftIcon />} />
            <div style={{ width: 48, height: 48 }} />
            <MenuWrapper direction="right" icon={<ArrowRightIcon />} />

            <div />
            <MenuWrapper direction="bottom" icon={<ArrowDownIcon />} />
            <div />
          </div>
        </div>
        <Text size="sm" type="secondary" style={{ display: 'block', marginTop: 8 }}>
          Con icon + openIcon: la flecha cambia a X al abrir. Sin openIcon: el icono rota 45°.
        </Text>
      </Section>

      <Section title="Bubble.Menu (Trigger: hover)">
        <div style={{ position: 'relative', width: '100%', height: 260, backgroundColor: tokens.colorBgMuted, borderRadius: 8, border: `1px dashed ${tokens.colorBorder}` }}>
          <Bubble.Menu
            position="bottom-right"
            trigger="hover"
            tooltip="Hover me"
            style={{ position: 'absolute' }}
            offsetX={16}
            offsetY={16}
          >
            <Bubble icon={<ChatIcon />} tooltip="Chat" />
            <Bubble icon={<BellIcon />} tooltip="Notificaciones" />
            <Bubble icon={<ShareIcon />} tooltip="Compartir" />
          </Bubble.Menu>

          <Bubble.Menu
            position="bottom-left"
            trigger="hover"
            direction="right"
            tooltip="Hover me"
            color="info"
            style={{ position: 'absolute' }}
            offsetX={16}
            offsetY={16}
          >
            <Bubble icon={<EditIcon />} tooltip="Editar" />
            <Bubble icon={<HelpIcon />} tooltip="Ayuda" />
          </Bubble.Menu>
        </div>
        <Text size="sm" type="secondary" style={{ display: 'block', marginTop: 8 }}>
          Se despliega al pasar el ratón por encima y se cierra al salir.
        </Text>
      </Section>

      <Section title="Semantic DOM Styling (classNames / styles)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
          <Text size="sm" type="secondary" style={{ display: 'block' }}>
            Bubble slots: <Text code>root</Text>, <Text code>icon</Text>, <Text code>badge</Text>, <Text code>tooltip</Text>, <Text code>tooltipArrow</Text>
          </Text>
          <Text size="sm" type="secondary" style={{ display: 'block' }}>
            BubbleMenu slots: <Text code>root</Text>, <Text code>trigger</Text>, <Text code>menu</Text>
          </Text>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <Badge
              count={3}
              styles={{ indicator: { backgroundColor: '#fbbf24', color: '#1f1f1f', border: '2px solid #764ba2' } }}
            >
              <Bubble
                icon={<ChatIcon />}
                tooltip="Personalizado"
                style={{ position: 'relative' }}
                styles={{
                  root: { background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none' },
                  icon: { filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' },
                  tooltip: { backgroundColor: '#764ba2', color: '#fff', borderColor: '#667eea' },
                  tooltipArrow: { backgroundColor: '#764ba2', borderColor: '#667eea' },
                }}
              />
            </Badge>
            <Bubble.Menu
              direction="right"
              icon={<EditIcon />}
              openIcon={<CloseIcon />}
              color="secondary"
              style={{ position: 'relative' }}
              styles={{
                root: { backgroundColor: '#faf5ff', padding: 8, borderRadius: 12, border: '1px dashed #c4b5fd' },
                trigger: { background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', border: 'none' },
              }}
            >
              <Bubble icon={<ChatIcon />} tooltip="Chat" />
              <Bubble icon={<BellIcon />} tooltip="Alertas" />
            </Bubble.Menu>
          </div>
        </div>
      </Section>
    </div>
  )
}
