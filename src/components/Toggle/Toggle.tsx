import {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useCallback,
  type ReactNode,
  type CSSProperties,
} from 'react'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { classNames as cx } from '../../utils/classNames'

// ─── Types ──────────────────────────────────────────────────────────────────────

export type ToggleSize = 'large' | 'middle' | 'small'

export type ToggleSemanticSlot = 'root' | 'item' | 'thumb'
export type ToggleClassNames = SemanticClassNames<ToggleSemanticSlot>
export type ToggleStyles = SemanticStyles<ToggleSemanticSlot>

export interface ToggleItemType {
  value: string | number
  label?: ReactNode
  icon?: ReactNode
  disabled?: boolean
  className?: string
}

export interface ToggleProps {
  /** Array of segment options */
  options: (string | number | ToggleItemType)[]
  /** Currently selected value (controlled) */
  value?: string | number
  /** Default selected value (uncontrolled) */
  defaultValue?: string | number
  /** Callback when selection changes */
  onChange?: (value: string | number) => void
  /** Disable all segments */
  disabled?: boolean
  /** Fit to full width of container */
  block?: boolean
  /** Vertical layout */
  vertical?: boolean
  /** Size variant */
  size?: ToggleSize
  /** Form input name (enables native radio group behavior + arrow key navigation) */
  name?: string
  /** Root CSS class */
  className?: string
  /** Root inline style */
  style?: CSSProperties
  /** Semantic class names */
  classNames?: ToggleClassNames
  /** Semantic styles */
  styles?: ToggleStyles
}

// ─── Size Config (for thumb radius/padding) ──────────────────────────────────

const sizeConfig: Record<ToggleSize, {
  thumbRadius: string
  thumbPadding: string
}> = {
  small:  { thumbRadius: '0.25rem', thumbPadding: '0.125rem' },
  middle: { thumbRadius: '0.375rem', thumbPadding: '0.125rem' },
  large:  { thumbRadius: '0.375rem', thumbPadding: '0.125rem' },
}

const SIZE_KEY: Record<ToggleSize, string> = {
  small: 'sm',
  middle: 'md',
  large: 'lg',
}

// ─── Toggle Component ───────────────────────────────────────────────────────────

export function Toggle({
  options,
  value,
  defaultValue,
  onChange,
  disabled = false,
  block = false,
  vertical = false,
  size = 'middle',
  name,
  className,
  style,
  classNames: classNamesProp,
  styles,
}: ToggleProps) {
  const sc = sizeConfig[size]

  // ─── Normalize options ──────────────────────────────────

  const normalizedOptions: ToggleItemType[] = options.map(opt => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { value: opt, label: String(opt) }
    }
    return { ...opt, label: opt.label ?? (opt.icon ? undefined : String(opt.value)) }
  })

  // ─── Controlled / uncontrolled ──────────────────────────

  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState<string | number | undefined>(
    defaultValue ?? normalizedOptions[0]?.value,
  )
  const currentValue = isControlled ? value : internalValue

  const handleSelect = useCallback((itemValue: string | number) => {
    if (!isControlled) setInternalValue(itemValue)
    onChange?.(itemValue)
  }, [isControlled, onChange])

  // ─── Refs ───────────────────────────────────────────────

  const trackRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Map<string | number, HTMLDivElement>>(new Map())
  const isFirstRender = useRef(true)

  const setItemRef = useCallback((val: string | number) => (el: HTMLDivElement | null) => {
    if (el) itemRefs.current.set(val, el)
    else itemRefs.current.delete(val)
  }, [])

  // ─── Thumb measurement ─────────────────────────────────

  const [thumbStyle, setThumbStyle] = useState<CSSProperties>({ opacity: 0 })

  const updateThumb = useCallback(() => {
    const trackEl = trackRef.current
    if (!trackEl) return

    const selectedEl = currentValue !== undefined ? itemRefs.current.get(currentValue) : undefined
    if (!selectedEl) {
      setThumbStyle(prev => prev.opacity === 0 ? prev : { opacity: 0 })
      return
    }

    const left = selectedEl.offsetLeft
    const top = selectedEl.offsetTop
    const width = selectedEl.offsetWidth
    const height = selectedEl.offsetHeight

    const transitionProps = vertical
      ? 'top 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), height 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)'
      : 'left 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)'

    setThumbStyle({
      top: vertical ? top : sc.thumbPadding,
      left: vertical ? sc.thumbPadding : left,
      width: vertical ? `calc(100% - 2 * ${sc.thumbPadding})` : width,
      height: vertical ? height : `calc(100% - 2 * ${sc.thumbPadding})`,
      transition: isFirstRender.current ? 'none' : transitionProps,
      opacity: 1,
    })

    if (isFirstRender.current) {
      requestAnimationFrame(() => { isFirstRender.current = false })
    }
  }, [currentValue, sc.thumbPadding, vertical])

  useLayoutEffect(() => {
    updateThumb()
  }, [updateThumb])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const ro = new ResizeObserver(() => updateThumb())
    ro.observe(track)

    return () => ro.disconnect()
  }, [updateThumb])

  // ─── Arrow key navigation ──────────────────────────────

  const handleKeyDown = useCallback((e: React.KeyboardEvent, itemValue: string | number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      const item = normalizedOptions.find(o => o.value === itemValue)
      if (item && !item.disabled && itemValue !== currentValue) handleSelect(itemValue)
      return
    }

    const prevKeys = vertical ? ['ArrowUp'] : ['ArrowLeft']
    const nextKeys = vertical ? ['ArrowDown'] : ['ArrowRight']

    if (!prevKeys.includes(e.key) && !nextKeys.includes(e.key)) return
    e.preventDefault()

    const currentIdx = normalizedOptions.findIndex(o => o.value === itemValue)
    const dir = nextKeys.includes(e.key) ? 1 : -1
    const len = normalizedOptions.length

    // Find next non-disabled option
    for (let i = 1; i < len; i++) {
      const idx = (currentIdx + dir * i + len) % len
      const opt = normalizedOptions[idx]
      if (!opt.disabled) {
        handleSelect(opt.value)
        itemRefs.current.get(opt.value)?.focus()
        return
      }
    }
  }, [normalizedOptions, currentValue, handleSelect, vertical])

  // ─── BEM classes ────────────────────────────────────────

  const rootClass = cx(
    'ino-toggle',
    `ino-toggle--${SIZE_KEY[size]}`,
    {
      'ino-toggle--block': block,
      'ino-toggle--vertical': vertical,
      'ino-toggle--disabled': disabled,
    },
    className,
    classNamesProp?.root,
  )

  // ─── Render ─────────────────────────────────────────────

  return (
    <div
      ref={trackRef}
      role="radiogroup"
      className={rootClass}
      style={{ ...styles?.root, ...style }}
    >
      <div
        className={cx('ino-toggle__thumb', classNamesProp?.thumb)}
        style={{ ...thumbStyle, ...styles?.thumb }}
      />

      {normalizedOptions.map(item => {
        const isSelected = item.value === currentValue
        const isItemDisabled = !!(item.disabled || disabled)

        const itemClass = cx(
          'ino-toggle__item',
          {
            'ino-toggle__item--selected': isSelected,
            'ino-toggle__item--disabled': isItemDisabled && !disabled,
          },
          item.className,
          classNamesProp?.item,
        )

        return (
          <div
            key={String(item.value)}
            ref={setItemRef(item.value)}
            role="radio"
            aria-checked={isSelected}
            aria-disabled={isItemDisabled || undefined}
            tabIndex={isSelected ? 0 : -1}
            className={itemClass}
            style={styles?.item}
            onClick={() => {
              if (!isItemDisabled && item.value !== currentValue) handleSelect(item.value)
            }}
            onKeyDown={e => handleKeyDown(e, item.value)}
          >
            {name && (
              <input
                type="radio"
                name={name}
                value={String(item.value)}
                checked={isSelected}
                disabled={isItemDisabled}
                onChange={() => handleSelect(item.value)}
                className="ino-toggle__radio"
              />
            )}
            {item.icon && <span className="ino-toggle__icon">{item.icon}</span>}
            {item.label && <span>{item.label}</span>}
          </div>
        )
      })}
    </div>
  )
}
