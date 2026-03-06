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
import type {
  SemanticClassNames,
  SemanticStyles,
} from '../../utils/semanticDom'
import { classNames as cx } from '../../utils/classNames'
import './Collapse.css'

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

const SIZE_ABBR: Record<CollapseSize, string> = {
  small: 'sm',
  middle: 'md',
  large: 'lg',
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
  const [hasEverExpanded, setHasEverExpanded] = useState(isActive || forceRender)
  const animatingRef = useRef(false)
  const mountedRef = useRef(false)
  const sizeAbbr = SIZE_ABBR[size]

  // Track whether the panel has ever been expanded (for lazy rendering)
  useEffect(() => {
    if (isActive && !hasEverExpanded) setHasEverExpanded(true)
  }, [isActive, hasEverExpanded])

  // ── Animation ──
  useLayoutEffect(() => {
    const wrapper = contentWrapperRef.current
    if (!wrapper) return

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
      animatingRef.current = true
      const body = contentBodyRef.current
      if (body) {
        const h = body.scrollHeight
        wrapper.style.transition = 'none'
        wrapper.style.maxHeight = '0px'
        wrapper.style.opacity = '0'
        void wrapper.offsetHeight
        wrapper.style.transition = 'max-height 300ms ease, opacity 200ms ease'
        wrapper.style.maxHeight = h + 'px'
        wrapper.style.opacity = '1'
      }
    } else {
      const body = contentBodyRef.current
      if (body) {
        const h = body.scrollHeight
        wrapper.style.transition = 'none'
        wrapper.style.maxHeight = h + 'px'
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

  // ── Arrow icon ──
  const arrowNode = showArrow ? (
    <span
      onClick={isIconOnly ? handleIconClick : undefined}
      className={cx(
        'ino-collapse__arrow',
        {
          'ino-collapse__arrow--active': isActive,
          'ino-collapse__arrow--disabled': isDisabled,
          'ino-collapse__arrow--enabled': !isDisabled,
          'ino-collapse__arrow--icon-clickable': isIconOnly && !isDisabled,
        },
        classNames?.arrow,
      )}
      style={styles?.arrow}
    >
      {expandIcon ? expandIcon({ isActive }) : <ChevronRightIcon />}
    </span>
  ) : null

  // ── Header class ──
  const headerClass = cx(
    'ino-collapse__header',
    `ino-collapse__header--${sizeAbbr}`,
    ghost ? 'ino-collapse__header--ghost' : 'ino-collapse__header--default',
    {
      'ino-collapse__header--disabled': isDisabled,
      'ino-collapse__header--clickable': !isDisabled && !isIconOnly,
      'ino-collapse__header--icon-only': isIconOnly && !isDisabled,
      'ino-collapse__header--not-first': !isFirst,
    },
    classNames?.header,
  )

  // ── Content wrapper style ──
  const contentWrapperStyle: CSSProperties = {
    maxHeight: isActive ? undefined : 0,
    opacity: isActive ? 1 : 0,
  }

  // Determine whether to render content
  const shouldRender = isActive || hasEverExpanded || forceRender
  const shouldDestroy = destroyOnHidden && !isActive && !animatingRef.current

  return (
    <div className={panelClassName} style={panelStyle}>
      {/* Header */}
      <div
        onClick={handleHeaderClick}
        className={headerClass}
        style={{
          color: isDisabled ? undefined : 'var(--j-text)',
          ...styles?.header,
        }}
      >
        {expandIconPlacement === 'start' && arrowNode}
        <span className="ino-collapse__label">{label}</span>
        {extra && <span className="ino-collapse__extra">{extra}</span>}
        {expandIconPlacement === 'end' && arrowNode}
      </div>

      {/* Content */}
      <div
        ref={contentWrapperRef}
        className="ino-collapse__content-wrapper"
        style={contentWrapperStyle}
        onTransitionEnd={handleTransitionEnd}
      >
        {shouldRender && !shouldDestroy && (
          <div
            ref={contentBodyRef}
            className={cx(
              'ino-collapse__content',
              `ino-collapse__content--${sizeAbbr}`,
              classNames?.content,
            )}
            style={styles?.content}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Collapse.Panel compound component (thin wrapper) ───────────────────────────

function CollapsePanelCompound(_props: CollapsePanelProps & { children?: ReactNode }) {
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

  // ── Root class ──
  const rootClass = cx(
    'ino-collapse',
    ghost
      ? 'ino-collapse--ghost'
      : bordered
        ? 'ino-collapse--bordered'
        : 'ino-collapse--borderless',
    className,
    classNames?.root,
  )

  return (
    <div
      className={rootClass}
      style={{ ...styles?.root, ...style }}
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
