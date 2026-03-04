import { useState, useRef, useCallback } from 'react'
import { Modal, useModal, Text, Button, Input, tokens } from '../../index'
import { Section } from './shared'

// ─── 1. Basic ────────────────────────────────────────────────────────────────────

function BasicDemo() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal
        title="Basic Modal"
        open={open}
        onOk={() => setOpen(false)}
        onClose={() => setOpen(false)}
      >
        <p style={{ margin: 0 }}>Some contents...</p>
        <p style={{ margin: '0.5rem 0 0' }}>Some contents...</p>
        <p style={{ margin: '0.5rem 0 0' }}>Some contents...</p>
      </Modal>
    </div>
  )
}

// ─── 2. Footer ───────────────────────────────────────────────────────────────────

function FooterDemo() {
  const [openCustom, setOpenCustom] = useState(false)
  const [openNone, setOpenNone] = useState(false)
  const [openRender, setOpenRender] = useState(false)

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Button onClick={() => setOpenCustom(true)}>Custom Footer</Button>
      <Button onClick={() => setOpenNone(true)}>No Footer</Button>
      <Button onClick={() => setOpenRender(true)}>Render Function</Button>

      <Modal
        title="Custom Footer"
        open={openCustom}
        onClose={() => setOpenCustom(false)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button onClick={() => setOpenCustom(false)}>Got it</Button>
          </div>
        }
      >
        <p style={{ margin: 0 }}>This modal has a single centered button as footer.</p>
      </Modal>

      <Modal
        title="No Footer"
        open={openNone}
        onClose={() => setOpenNone(false)}
        footer={null}
      >
        <p style={{ margin: 0 }}>This modal has no footer at all.</p>
      </Modal>

      <Modal
        title="Render Function Footer"
        open={openRender}
        onOk={() => setOpenRender(false)}
        onClose={() => setOpenRender(false)}
        footer={({ OkBtn, CancelBtn }) => (
          <div style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'space-between' }}>
            <CancelBtn />
            <OkBtn />
          </div>
        )}
      >
        <p style={{ margin: 0 }}>Footer rendered via function — buttons are spread apart.</p>
      </Modal>
    </div>
  )
}

// ─── 3. Confirm Loading ──────────────────────────────────────────────────────────

function ConfirmLoadingDemo() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleOk = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setOpen(false)
    }, 2000)
  }

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Modal with async OK</Button>
      <Modal
        title="Confirm Loading"
        open={open}
        confirmLoading={loading}
        onOk={handleOk}
        onClose={() => setOpen(false)}
      >
        <p style={{ margin: 0 }}>Click OK and the button will show a spinner for 2 seconds.</p>
      </Modal>
    </div>
  )
}

// ─── 4. Position ─────────────────────────────────────────────────────────────────

function PositionDemo() {
  const [openDefault, setOpenDefault] = useState(false)
  const [openCentered, setOpenCentered] = useState(false)
  const [openCustom, setOpenCustom] = useState(false)

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Button onClick={() => setOpenDefault(true)}>Default (top)</Button>
      <Button onClick={() => setOpenCentered(true)}>Centered</Button>
      <Button onClick={() => setOpenCustom(true)}>Custom (top: 2rem)</Button>

      <Modal
        title="Default Position"
        open={openDefault}
        onOk={() => setOpenDefault(false)}
        onClose={() => setOpenDefault(false)}
      >
        <p style={{ margin: 0 }}>This modal appears near the top of the viewport (6rem margin).</p>
      </Modal>

      <Modal
        title="Centered Modal"
        open={openCentered}
        centered
        onOk={() => setOpenCentered(false)}
        onClose={() => setOpenCentered(false)}
      >
        <p style={{ margin: 0 }}>This modal is vertically centered on screen.</p>
      </Modal>

      <Modal
        title="Custom Top Position"
        open={openCustom}
        style={{ marginTop: '2rem' }}
        onOk={() => setOpenCustom(false)}
        onClose={() => setOpenCustom(false)}
      >
        <p style={{ margin: 0 }}>This modal is positioned with a custom 2rem margin from top.</p>
      </Modal>
    </div>
  )
}

// ─── 5. Closable ─────────────────────────────────────────────────────────────────

function ClosableDemo() {
  const [openCustom, setOpenCustom] = useState(false)
  const [openNone, setOpenNone] = useState(false)

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Button onClick={() => setOpenCustom(true)}>Custom Close Icon</Button>
      <Button onClick={() => setOpenNone(true)}>No Close Button</Button>

      <Modal
        title="Custom Close Icon"
        open={openCustom}
        onOk={() => setOpenCustom(false)}
        onClose={() => setOpenCustom(false)}
        closeIcon={<span style={{ fontSize: '1rem', lineHeight: 1 }}>✕</span>}
      >
        <p style={{ margin: 0 }}>This modal uses a custom close icon.</p>
      </Modal>

      <Modal
        title="No Close Button"
        open={openNone}
        closable={false}
        onOk={() => setOpenNone(false)}
        onClose={() => setOpenNone(false)}
      >
        <p style={{ margin: 0 }}>No X button — click the mask or use Cancel to close.</p>
      </Modal>
    </div>
  )
}

// ─── 6. Loading ──────────────────────────────────────────────────────────────────

function LoadingDemo() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const handleOpen = () => {
    setLoading(true)
    setOpen(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div>
      <Button onClick={handleOpen}>Open with Loading</Button>
      <Modal
        title="Loading Modal"
        open={open}
        loading={loading}
        onOk={() => setOpen(false)}
        onClose={() => setOpen(false)}
      >
        <p style={{ margin: 0 }}>This content loaded after a 2-second delay.</p>
        <p style={{ margin: '0.5rem 0 0' }}>The skeleton was shown while waiting.</p>
      </Modal>
    </div>
  )
}

// ─── 7. Destroy on Close ─────────────────────────────────────────────────────────

function DestroyOnCloseDemo() {
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState(0)

  const handleOpen = () => {
    setCount((c) => c + 1)
    setOpen(true)
  }

  return (
    <div>
      <Button onClick={handleOpen}>Open (destroyOnClose)</Button>
      <Modal
        title="Destroy on Close"
        open={open}
        destroyOnClose
        onOk={() => setOpen(false)}
        onClose={() => setOpen(false)}
      >
        <p style={{ margin: 0 }}>Type something in the input, close, and reopen — it resets.</p>
        <div style={{ marginTop: '0.75rem' }}>
          <Input placeholder="Type here..." />
        </div>
        <p style={{ margin: '0.75rem 0 0', fontSize: '0.8125rem', color: tokens.colorTextMuted }}>
          Opened {count} time(s) — content is remounted each time.
        </p>
      </Modal>
    </div>
  )
}

// ─── 8. Width ────────────────────────────────────────────────────────────────────

function WidthDemo() {
  const [open, setOpen] = useState(false)
  const [w, setW] = useState<string>('32rem')

  const openWith = (width: string) => {
    setW(width)
    setOpen(true)
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Button onClick={() => openWith('20rem')}>Small (20rem)</Button>
      <Button onClick={() => openWith('32rem')}>Default (32rem)</Button>
      <Button onClick={() => openWith('48rem')}>Wide (48rem)</Button>

      <Modal
        title={`Width: ${w}`}
        open={open}
        width={w}
        onOk={() => setOpen(false)}
        onClose={() => setOpen(false)}
      >
        <p style={{ margin: 0 }}>This modal has a width of {w}.</p>
      </Modal>
    </div>
  )
}

// ─── 9. Mask ─────────────────────────────────────────────────────────────────────

function MaskDemo() {
  const [openDefault, setOpenDefault] = useState(false)
  const [openBlur, setOpenBlur] = useState(false)
  const [openNoMask, setOpenNoMask] = useState(false)

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Button onClick={() => setOpenDefault(true)}>Default Mask</Button>
      <Button onClick={() => setOpenBlur(true)}>Blur Mask</Button>
      <Button onClick={() => setOpenNoMask(true)}>No Mask</Button>

      <Modal
        title="Default Mask"
        open={openDefault}
        onOk={() => setOpenDefault(false)}
        onClose={() => setOpenDefault(false)}
      >
        <p style={{ margin: 0 }}>Standard dark overlay mask.</p>
      </Modal>

      <Modal
        title="Blur Mask"
        open={openBlur}
        mask={{ blur: true }}
        onOk={() => setOpenBlur(false)}
        onClose={() => setOpenBlur(false)}
      >
        <p style={{ margin: 0 }}>The background content is blurred behind this modal.</p>
      </Modal>

      <Modal
        title="No Mask"
        open={openNoMask}
        mask={false}
        onOk={() => setOpenNoMask(false)}
        onClose={() => setOpenNoMask(false)}
      >
        <p style={{ margin: 0 }}>No mask behind this modal — the page is fully visible.</p>
      </Modal>
    </div>
  )
}

// ─── 10. Button Props & i18n ─────────────────────────────────────────────────────

function ButtonPropsDemo() {
  const [open, setOpen] = useState(false)
  const [openI18n, setOpenI18n] = useState(false)

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Button onClick={() => setOpen(true)}>Disabled OK Button</Button>
      <Button onClick={() => setOpenI18n(true)}>Custom Button Text (i18n)</Button>

      <Modal
        title="Disabled OK"
        open={open}
        onOk={() => setOpen(false)}
        onClose={() => setOpen(false)}
        okButtonProps={{ disabled: true, style: { opacity: 0.5, pointerEvents: 'none' as const } }}
      >
        <p style={{ margin: 0 }}>The OK button is disabled via <code style={{ backgroundColor: tokens.colorBgMuted, padding: '0.125rem 0.375rem', borderRadius: '0.25rem', fontSize: '0.8125rem' }}>okButtonProps</code>.</p>
      </Modal>

      <Modal
        title="Internationalization"
        open={openI18n}
        okText="Aceptar"
        cancelText="Cancelar"
        onOk={() => setOpenI18n(false)}
        onClose={() => setOpenI18n(false)}
      >
        <p style={{ margin: 0 }}>Custom button text via <code style={{ backgroundColor: tokens.colorBgMuted, padding: '0.125rem 0.375rem', borderRadius: '0.25rem', fontSize: '0.8125rem' }}>okText</code> and <code style={{ backgroundColor: tokens.colorBgMuted, padding: '0.125rem 0.375rem', borderRadius: '0.25rem', fontSize: '0.8125rem' }}>cancelText</code>.</p>
      </Modal>
    </div>
  )
}

// ─── 11. Custom Render (Draggable) ───────────────────────────────────────────────

function DraggableDemo() {
  const [open, setOpen] = useState(false)
  const dragRef = useRef({ dragging: false, startX: 0, startY: 0, dx: 0, dy: 0 })
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    // Only start drag from the header area
    if (!target.closest('[data-drag-handle]')) return
    const state = dragRef.current
    state.dragging = true
    state.startX = e.clientX - state.dx
    state.startY = e.clientY - state.dy

    const onMove = (ev: MouseEvent) => {
      if (!state.dragging || !wrapperRef.current) return
      state.dx = ev.clientX - state.startX
      state.dy = ev.clientY - state.startY
      wrapperRef.current.style.transform = `translate(${state.dx}px, ${state.dy}px)`
    }
    const onUp = () => {
      state.dragging = false
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [])

  const handleOpen = () => {
    dragRef.current = { dragging: false, startX: 0, startY: 0, dx: 0, dy: 0 }
    if (wrapperRef.current) wrapperRef.current.style.transform = ''
    setOpen(true)
  }

  return (
    <div>
      <Button onClick={handleOpen}>Open Draggable Modal</Button>
      <Modal
        title={<span data-drag-handle style={{ cursor: 'move', userSelect: 'none', display: 'block' }}>Draggable Modal (drag me)</span>}
        open={open}
        onOk={() => setOpen(false)}
        onClose={() => setOpen(false)}
        modalRender={(node) => (
          <div
            ref={wrapperRef}
            onMouseDown={handleMouseDown}
          >
            {node}
          </div>
        )}
      >
        <p style={{ margin: 0 }}>Drag the title bar to move this modal.</p>
        <p style={{ margin: '0.5rem 0 0' }}>
          Uses <code style={{ backgroundColor: tokens.colorBgMuted, padding: '0.125rem 0.375rem', borderRadius: '0.25rem', fontSize: '0.8125rem' }}>modalRender</code> to wrap the dialog in a draggable container.
        </p>
      </Modal>
    </div>
  )
}

// ─── 12. Semantic Styling ────────────────────────────────────────────────────────

function SemanticStylingDemo() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Styled Modal</Button>
      <Modal
        title="Custom Styled"
        open={open}
        onOk={() => setOpen(false)}
        onClose={() => setOpen(false)}
        styles={{
          header: {
            background: `linear-gradient(135deg, ${tokens.colorPrimary}, ${tokens.colorInfo})`,
            color: '#fff',
            borderBottom: 'none',
          },
          body: {
            backgroundColor: tokens.colorBgSubtle,
          },
          footer: {
            borderTop: `2px dashed ${tokens.colorPrimary}`,
          },
          closeBtn: {
            color: '#fff',
          },
        }}
      >
        <p style={{ margin: 0 }}>Each semantic slot is styled independently.</p>
        <p style={{ margin: '0.5rem 0 0' }}>Header has a gradient, body has subtle background, footer has dashed border.</p>
      </Modal>
    </div>
  )
}

// ─── 13. Nested Modal ────────────────────────────────────────────────────────────

function NestedModalDemo() {
  const [open1, setOpen1] = useState(false)
  const [open2, setOpen2] = useState(false)

  return (
    <div>
      <Button onClick={() => setOpen1(true)}>Open First Modal</Button>
      <Modal
        title="First Modal"
        open={open1}
        onOk={() => setOpen1(false)}
        onClose={() => setOpen1(false)}
      >
        <p style={{ margin: '0 0 0.75rem' }}>This is the first modal. Click below to open a second one on top.</p>
        <Button onClick={() => setOpen2(true)}>Open Second Modal</Button>

        <Modal
          title="Second Modal (nested)"
          open={open2}
          centered
          width="24rem"
          zIndex={1010}
          onOk={() => setOpen2(false)}
          onClose={() => setOpen2(false)}
        >
          <p style={{ margin: 0 }}>This nested modal renders on top of the first one.</p>
        </Modal>
      </Modal>
    </div>
  )
}

// ─── 14. useModal Hook ──────────────────────────────────────────────────────────

function UseModalDemo() {
  const [modal, contextHolder] = useModal()

  const showConfirm = () => {
    modal.confirm({
      title: 'Do you want to delete these items?',
      content: 'When clicked the OK button, this dialog will be closed after 1 second.',
      onOk: () => new Promise<void>((resolve) => setTimeout(resolve, 1000)),
      onCancel: () => {},
    })
  }

  const showInfo = () => {
    modal.info({
      title: 'This is an info message',
      content: 'Some informational details about the operation.',
    })
  }

  const showSuccess = () => {
    modal.success({
      title: 'Successfully completed!',
      content: 'Your changes have been saved.',
    })
  }

  const showWarning = () => {
    modal.warning({
      title: 'Warning',
      content: 'This action may have unintended consequences.',
    })
  }

  const showError = () => {
    modal.error({
      title: 'Error occurred',
      content: 'Something went wrong. Please try again later.',
    })
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Button onClick={showConfirm}>Confirm</Button>
        <Button onClick={showInfo}>Info</Button>
        <Button onClick={showSuccess}>Success</Button>
        <Button onClick={showWarning}>Warning</Button>
        <Button onClick={showError}>Error</Button>
      </div>
      {contextHolder}
    </div>
  )
}

// ─── 15. Update & Destroy ────────────────────────────────────────────────────────

function UpdateDestroyDemo() {
  const [modal, contextHolder] = useModal()
  const instanceRef = useRef<ReturnType<typeof modal.info> | null>(null)

  const showCountdown = () => {
    let remaining = 5
    instanceRef.current = modal.info({
      title: 'This dialog will close in 5 seconds',
      content: `${remaining} seconds remaining...`,
    })

    const timer = setInterval(() => {
      remaining -= 1
      if (remaining <= 0) {
        clearInterval(timer)
        instanceRef.current?.destroy()
        instanceRef.current = null
      } else {
        instanceRef.current?.update({
          title: `This dialog will close in ${remaining} seconds`,
          content: `${remaining} second${remaining > 1 ? 's' : ''} remaining...`,
        })
      }
    }, 1000)
  }

  const showAsync = () => {
    modal.confirm({
      title: 'Async OK with Promise',
      content: 'Clicking OK will trigger an async operation (2s). The button shows a loading spinner until done.',
      onOk: () => new Promise<void>((resolve) => setTimeout(resolve, 2000)),
    })
  }

  const showMultiple = () => {
    modal.info({ title: 'First dialog', content: 'This is dialog #1.' })
    modal.success({ title: 'Second dialog', content: 'This is dialog #2.' })
    modal.warning({ title: 'Third dialog', content: 'This is dialog #3.' })
  }

  const handleDestroyAll = () => {
    modal.destroyAll()
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Button onClick={showCountdown}>Auto-update Countdown</Button>
        <Button onClick={showAsync}>Async OK (Promise)</Button>
        <Button onClick={showMultiple}>Open 3 Dialogs</Button>
        <Button onClick={handleDestroyAll}>Destroy All</Button>
      </div>
      {contextHolder}
    </div>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────────

export function ModalSection() {
  return (
    <div>
      <Text size="xl" weight="bold" style={{ display: 'block', marginBottom: 24 }}>Modal</Text>

      <Section title="Basic">
        <BasicDemo />
      </Section>

      <Section title="Footer">
        <FooterDemo />
      </Section>

      <Section title="Confirm Loading">
        <ConfirmLoadingDemo />
      </Section>

      <Section title="Position">
        <PositionDemo />
      </Section>

      <Section title="Closable">
        <ClosableDemo />
      </Section>

      <Section title="Loading">
        <LoadingDemo />
      </Section>

      <Section title="Destroy on Close">
        <DestroyOnCloseDemo />
      </Section>

      <Section title="Width">
        <WidthDemo />
      </Section>

      <Section title="Mask">
        <MaskDemo />
      </Section>

      <Section title="Button Props & i18n">
        <ButtonPropsDemo />
      </Section>

      <Section title="Custom Render (Draggable)">
        <DraggableDemo />
      </Section>

      <Section title="Semantic Styling">
        <SemanticStylingDemo />
      </Section>

      <Section title="Nested Modal">
        <NestedModalDemo />
      </Section>

      <Section title="useModal Hook">
        <UseModalDemo />
      </Section>

      <Section title="Update & Destroy">
        <UpdateDestroyDemo />
      </Section>
    </div>
  )
}
