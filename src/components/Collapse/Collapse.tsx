import {
  type CSSProperties,
  type ReactNode,
  useState,
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  Children,
  isValidElement,
} from 'react'
import { tokens } from '../../theme/tokens'
import {
  type SemanticClassNames,
  type SemanticStyles,
  mergeSemanticClassName,
  mergeSemanticStyle,
} from '../../utils/semanticDom'

// ─── Types ──────────────────────────────────────────────────────────────────────

export type CollapseSize = 'large' | 'middle' | 'small'
export type CollapseCollapsible = 'header' | 'icon' | 'disabled'
export type CollapseSemanticSlot = 'root' | 'header' | 'content' | 'arrow'
export type CollapseClassNames = SemanticClassNames<CollapseSemanticSlot>
export type CollapseStyles = SemanticStyles<CollapseSemanticSlot>

export interface CollapseItem {
  key: string
  label?: ReactNode
  children?: ReactNode
  extra?: ReactNode
  showArrow?: boolean
  collapsible?: CollapseCollapsible
  forceRender?: boolean
  className?: string
  style?: CSSProperties
}

export interface CollapsePanelProps {
  panelKey: string
  header?: ReactNode
  children?: ReactNode
  extra?: ReactNode
  showArrow?: boolean
  collapsible?: CollapseCollapsible
  forceRender?: boolean
  className?: string
  style?: CSSProperties
}

export interface CollapseProps {
  items?: CollapseItem[]
  accordion?: boolean
  activeKey?: string | string[]
  defaultActiveKey?: string | string[]
  bordered?: boolean
  ghost?: boolean
  size?: CollapseSize
  collapsible?: CollapseCollapsible
  expandIcon?: (props: { isActive: boolean }) => ReactNode
  expandIconPlacement?: 'start' | 'end'
  destroyOnHidden?: boolean
  onChange?: (key: string | string[]) => void
  children?: ReactNode
  className?: string
  style?: CSSProperties
  classNames?: CollapseClassNames
  styles?: CollapseStyles
}

// ─── Size config ────────────────────────────────────────────────────────────────

const SIZE_CONFIG: Record<CollapseSize, { headerPadding: string; contentPadding: string; fontSize: string }> = {
  small:  { headerPadding: '0.375rem 0.75rem',  contentPadding: '0.75rem',  fontSize: '0.8125rem' },
  middle: { headerPadding: '0.75rem 1rem',      contentPadding: '1rem',     fontSize: '0.875rem'  },
  large:  { headerPadding: '1rem 1.25rem',       contentPadding: '1.25rem',  fontSize: '1rem'      },
}

// ─── Default expand icon ────────────────────────────────────────────────────────

function ChevronRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 2.5L8 6L4.5 9.5" />
    </svg>
  )
}

// ─── Internal panel component ───────────────────────────────────────────────────

interface InternalPanelProps {
  panelKey: string
  label?: ReactNode
  children?: ReactNode
  extra?: ReactNode
  showArrow: boolean
  isActive: boolean
  collapsible: CollapseCollapsible | undefined
  expandIcon?: (props: { isActive: boolean }) => ReactNode
  expandIconPlacement: 'start' | 'end'
  destroyOnHidden: boolean
  forceRender: boolean
  size: CollapseSize
  ghost: boolean
  isFirst: boolean
  panelClassName?: string
  panelStyle?: CSSProperties
  onToggle: (key: string) => void
  classNames?: CollapseClassNames
  styles?: CollapseStyles
}

function InternalPanel({
  panelKey,
  label,
  children,
  extra,
  showArrow,
  isActive,
  collapsible,
  expandIcon,
  expandIconPlacement,
  destroyOnHidden,
  forceRender,
  size,
  ghost,
  isFirst,
  panelClassName,
  panelStyle,
  onToggle,
  classNames,
  styles,
}: InternalPanelProps) {
  const contentWrapperRef = useRef<HTMLDivElement>(null)
  const contentBodyRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<HTMLSpanElement>(null)
  const [hasEverExpanded, setHasEverExpanded] = useState(isActive || forceRender)
  const animatingRef = useRef(false)
  const mountedRef = useRef(false)
  const sizeConf = SIZE_CONFIG[size]

  // Track whether the panel has ever been expanded (for lazy rendering)
  useEffect(() => {
    if (isActive && !hasEverExpanded) setHasEverExpanded(true)
  }, [isActive, hasEverExpanded])

  // ── Animation ──
  // useLayoutEffect prevents flash: runs before paint so we can set maxHeight: 0
  // before the browser renders the content at full height
  useLayoutEffect(() => {
    const wrapper = contentWrapperRef.current
    if (!wrapper) return

    // On mount: just set correct initial state without animation
    if (!mountedRef.current) {
      mountedRef.current = true
      if (isActive) {
        wrapper.style.maxHeight = 'none'
        wrapper.style.opacity = '1'
      } else {
        wrapper.style.maxHeight = '0px'
        wrapper.style.opacity = '0'
      }
      return
    }

    if (isActive) {
      // Expanding
      animatingRef.current = true
      const body = contentBodyRef.current
      if (body) {
        const h = body.scrollHeight
        wrapper.style.transition = 'none'
        wrapper.style.maxHeight = '0px'
        wrapper.style.opacity = '0'
        // Force reflow
        void wrapper.offsetHeight
        wrapper.style.transition = 'max-height 300ms ease, opacity 200ms ease'
        wrapper.style.maxHeight = h + 'px'
        wrapper.style.opacity = '1'
      }
    } else {
      // Collapsing
      const body = contentBodyRef.current
      if (body) {
        const h = body.scrollHeight
        wrapper.style.transition = 'none'
        wrapper.style.maxHeight = h + 'px'
        // Force reflow
        void wrapper.offsetHeight
        wrapper.style.transition = 'max-height 300ms ease, opacity 200ms ease'
        wrapper.style.maxHeight = '0px'
        wrapper.style.opacity = '0'
      }
    }
  }, [isActive])

  const handleTransitionEnd = useCallback((e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== 'max-height') return
    const wrapper = contentWrapperRef.current
    if (!wrapper) return
    if (isActive) {
      // After expanding, set to none so dynamic content works
      wrapper.style.maxHeight = 'none'
    }
    animatingRef.current = false
  }, [isActive])

  // ── Collapsible logic ──
  const isDisabled = collapsible === 'disabled'
  const isIconOnly = collapsible === 'icon'

  const handleHeaderClick = useCallback(() => {
    if (isDisabled || isIconOnly) return
    onToggle(panelKey)
  }, [isDisabled, isIconOnly, onToggle, panelKey])

  const handleIconClick = useCallback((e: React.MouseEvent) => {
    if (isDisabled) return
    if (isIconOnly) {
      e.stopPropagation()
      onToggle(panelKey)
    }
  }, [isDisabled, isIconOnly, onToggle, panelKey])

  // ── Ref-based hover on header ──
  const handleHeaderEnter = useCallback(() => {
    if (isDisabled || !headerRef.current) return
    if (ghost) {
      headerRef.current.style.backgroundColor = tokens.colorBgSubtle
    } else {
      headerRef.current.style.filter = 'brightness(0.97)'
    }
  }, [isDisabled, ghost])

  const handleHeaderLeave = useCallback(() => {
    if (!headerRef.current) return
    if (ghost) {
      headerRef.current.style.backgroundColor = ''
    } else {
      headerRef.current.style.filter = ''
    }
  }, [ghost])

  // ── Arrow icon ──
  const arrowNode = showArrow ? (
    <span
      ref={arrowRef}
      onClick={isIconOnly ? handleIconClick : undefined}
      className={classNames?.arrow}
      style={mergeSemanticStyle(
        {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          width: '1.25rem',
          height: '1.25rem',
          color: isDisabled ? tokens.colorTextSubtle : tokens.colorTextMuted,
          transform: isActive ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 200ms ease',
          cursor: isIconOnly && !isDisabled ? 'pointer' : 'inherit',
        },
        styles?.arrow,
      )}
    >
      {expandIcon ? expandIcon({ isActive }) : <ChevronRightIcon />}
    </span>
  ) : null

  // ── Header style ──
  const headerCursor = isDisabled
    ? 'not-allowed'
    : isIconOnly
      ? 'default'
      : 'pointer'

  const headerStyle = mergeSemanticStyle(
    {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: sizeConf.headerPadding,
      fontSize: sizeConf.fontSize,
      fontWeight: 600,
      color: isDisabled ? tokens.colorTextSubtle : tokens.colorText,
      backgroundColor: ghost ? 'transparent' : tokens.colorBgSubtle,
      cursor: headerCursor,
      userSelect: 'none' as const,
      borderTop: isFirst ? 'none' : `1px solid ${tokens.colorBorder}`,
      transition: 'filter 0.15s ease, background-color 0.15s ease',
    },
    styles?.header,
  )

  // ── Content style ──
  const contentWrapperStyle: CSSProperties = {
    overflow: 'hidden',
    maxHeight: isActive ? undefined : 0,
    opacity: isActive ? 1 : 0,
  }

  const contentBodyStyle = mergeSemanticStyle(
    {
      padding: sizeConf.contentPadding,
      fontSize: sizeConf.fontSize,
      color: tokens.colorText,
      borderTop: `1px solid ${tokens.colorBorder}`,
    },
    styles?.content,
  )

  // Determine whether to render content
  // Include isActive so content is in the DOM when the animation layout effect runs
  const shouldRender = isActive || hasEverExpanded || forceRender
  const shouldDestroy = destroyOnHidden && !isActive && !animatingRef.current

  return (
    <div className={panelClassName} style={panelStyle}>
      {/* Header */}
      <div
        ref={headerRef}
        onClick={handleHeaderClick}
        onMouseEnter={handleHeaderEnter}
        onMouseLeave={handleHeaderLeave}
        className={classNames?.header}
        style={headerStyle}
      >
        {expandIconPlacement === 'start' && arrowNode}
        <span style={{ flex: 1, minWidth: 0 }}>{label}</span>
        {extra && <span style={{ flexShrink: 0, marginLeft: 'auto' }}>{extra}</span>}
        {expandIconPlacement === 'end' && arrowNode}
      </div>

      {/* Content */}
      <div
        ref={contentWrapperRef}
        style={contentWrapperStyle}
        onTransitionEnd={handleTransitionEnd}
      >
        {shouldRender && !shouldDestroy && (
          <div ref={contentBodyRef} className={classNames?.content} style={contentBodyStyle}>
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Collapse.Panel compound component (thin wrapper) ───────────────────────────

function CollapsePanelCompound(_props: CollapsePanelProps & { children?: ReactNode }) {
  // This component is never rendered directly — its props are extracted
  // by the parent Collapse component to build the panel list.
  return null
}

// ─── Main Collapse component ────────────────────────────────────────────────────

function normalizeKeys(val: string | string[] | undefined): string[] {
  if (val === undefined) return []
  return Array.isArray(val) ? val : [val]
}

function CollapseComponent({
  items,
  accordion = false,
  activeKey: activeKeyProp,
  defaultActiveKey,
  bordered = true,
  ghost = false,
  size = 'middle',
  collapsible,
  expandIcon,
  expandIconPlacement = 'start',
  destroyOnHidden = false,
  onChange,
  children,
  className,
  style,
  classNames,
  styles,
}: CollapseProps) {
  // ── Normalize panels from items or children ──
  const panels: CollapseItem[] = items ?? (() => {
    const result: CollapseItem[] = []
    Children.forEach(children, (child) => {
      if (!isValidElement(child)) return
      const props = child.props as CollapsePanelProps & { children?: ReactNode }
      if (props.panelKey !== undefined) {
        result.push({
          key: props.panelKey,
          label: props.header,
          children: props.children,
          extra: props.extra,
          showArrow: props.showArrow,
          collapsible: props.collapsible,
          forceRender: props.forceRender,
          className: props.className,
          style: props.style,
        })
      }
    })
    return result
  })()

  // ── State ──
  const isControlled = activeKeyProp !== undefined
  const [internalKeys, setInternalKeys] = useState<string[]>(() => normalizeKeys(defaultActiveKey))
  const activeKeys = isControlled ? normalizeKeys(activeKeyProp) : internalKeys

  const handleToggle = useCallback((key: string) => {
    let newKeys: string[]
    if (accordion) {
      newKeys = activeKeys.includes(key) ? [] : [key]
    } else {
      newKeys = activeKeys.includes(key)
        ? activeKeys.filter(k => k !== key)
        : [...activeKeys, key]
    }

    if (!isControlled) {
      setInternalKeys(newKeys)
    }
    onChange?.(accordion ? (newKeys[0] ?? '') : newKeys)
  }, [accordion, activeKeys, isControlled, onChange])

  // ── Root style ──
  const rootStyle = mergeSemanticStyle(
    {
      border: ghost ? 'none' : bordered ? `1px solid ${tokens.colorBorder}` : 'none',
      borderRadius: ghost ? 0 : '0.5rem',
      overflow: 'hidden',
      backgroundColor: ghost ? 'transparent' : tokens.colorBg,
    },
    styles?.root,
    style,
  )

  return (
    <div
      className={mergeSemanticClassName(className, classNames?.root)}
      style={rootStyle}
    >
      {panels.map((panel, index) => (
        <InternalPanel
          key={panel.key}
          panelKey={panel.key}
          label={panel.label}
          extra={panel.extra}
          showArrow={panel.showArrow ?? true}
          isActive={activeKeys.includes(panel.key)}
          collapsible={panel.collapsible ?? collapsible}
          expandIcon={expandIcon}
          expandIconPlacement={expandIconPlacement}
          destroyOnHidden={destroyOnHidden}
          forceRender={panel.forceRender ?? false}
          size={size}
          ghost={ghost}
          isFirst={index === 0}
          panelClassName={panel.className}
          panelStyle={panel.style}
          onToggle={handleToggle}
          classNames={classNames}
          styles={styles}
        >
          {panel.children}
        </InternalPanel>
      ))}
    </div>
  )
}

// ─── Compound export ────────────────────────────────────────────────────────────

export const Collapse = Object.assign(CollapseComponent, {
  Panel: CollapsePanelCompound,
})
