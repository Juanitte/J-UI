import {
  type ReactNode,
  type CSSProperties,
  type KeyboardEvent,
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'

// ============================================================================
// Types
// ============================================================================

export type SliderSemanticSlot = 'root' | 'rail' | 'track' | 'handle' | 'mark' | 'dot' | 'tooltip'
export type SliderClassNames = SemanticClassNames<SliderSemanticSlot>
export type SliderStyles = SemanticStyles<SliderSemanticSlot>

export type SliderMarkLabel = ReactNode | { style?: CSSProperties; label: ReactNode }
export type SliderMarks = Record<number, SliderMarkLabel>

export interface SliderTooltipConfig {
  open?: boolean
  placement?: 'top' | 'bottom' | 'left' | 'right'
  formatter?: ((value: number) => ReactNode) | null
}

export interface SliderRangeConfig {
  editable?: boolean
  minCount?: number
  maxCount?: number
  draggableTrack?: boolean
}

export interface SliderRef {
  focus: () => void
  blur: () => void
}

export interface SliderProps {
  defaultValue?: number | number[]
  value?: number | number[]
  min?: number
  max?: number
  step?: number | null
  marks?: SliderMarks
  dots?: boolean
  included?: boolean
  range?: boolean | SliderRangeConfig
  vertical?: boolean
  reverse?: boolean
  disabled?: boolean
  keyboard?: boolean
  tooltip?: SliderTooltipConfig
  draggableTrack?: boolean
  onChange?: (value: number | number[]) => void
  onChangeComplete?: (value: number | number[]) => void
  style?: CSSProperties
  className?: string
  classNames?: SliderClassNames
  styles?: SliderStyles
}

// ============================================================================
// Helpers
// ============================================================================

function clamp(val: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, val))
}

function getPercent(value: number, min: number, max: number): number {
  if (max === min) return 0
  return ((value - min) / (max - min)) * 100
}

function snapToStep(
  value: number,
  min: number,
  max: number,
  step: number | null,
  marks?: SliderMarks,
): number {
  if (step === null) {
    // Snap to nearest mark
    if (!marks) return clamp(value, min, max)
    const markValues = Object.keys(marks).map(Number)
    if (markValues.length === 0) return clamp(value, min, max)
    return markValues.reduce((closest, mv) =>
      Math.abs(mv - value) < Math.abs(closest - value) ? mv : closest,
    markValues[0])
  }
  const rounded = Math.round((value - min) / step) * step + min
  return clamp(parseFloat(rounded.toFixed(10)), min, max)
}

function isMarkLabel(label: SliderMarkLabel): label is { style?: CSSProperties; label: ReactNode } {
  return typeof label === 'object' && label !== null && 'label' in label
}

// ============================================================================
// Drag state type
// ============================================================================

interface DragState {
  handleIndex: number
  containerRect: DOMRect
  isDraggingTrack: boolean
  trackStartValues?: number[]
  trackStartPercent?: number
}

// ============================================================================
// Slider Component
// ============================================================================

function SliderComponent(
  {
    defaultValue,
    value: controlledValue,
    min = 0,
    max = 100,
    step = 1,
    marks,
    dots = false,
    included = true,
    range = false,
    vertical = false,
    reverse = false,
    disabled = false,
    keyboard = true,
    tooltip,
    draggableTrack = false,
    onChange,
    onChangeComplete,
    style,
    className,
    classNames,
    styles: slotStyles,
  }: SliderProps,
  ref: React.Ref<SliderRef>,
) {
  // ---- Normalize range config ----
  const rangeConfig = (() => {
    if (range === true) {
      return { enabled: true, editable: false, minCount: 2, maxCount: Infinity, draggableTrack: !!draggableTrack }
    }
    if (typeof range === 'object' && range !== null) {
      const editable = !!range.editable
      return {
        enabled: true,
        editable,
        minCount: range.minCount ?? (editable ? 1 : 2),
        maxCount: range.maxCount ?? Infinity,
        draggableTrack: range.draggableTrack ?? !!draggableTrack,
      }
    }
    return { enabled: false, editable: false, minCount: 1, maxCount: 1, draggableTrack: false }
  })()

  // ---- Controlled / uncontrolled ----
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState<number | number[]>(() => {
    if (defaultValue !== undefined) return defaultValue
    return rangeConfig.enabled ? [min, min] : min
  })
  const currentValue = isControlled ? controlledValue! : internalValue

  // ---- Normalize to sorted number[] ----
  const sortedValues: number[] = (() => {
    if (rangeConfig.enabled) {
      const arr = Array.isArray(currentValue) ? [...currentValue] : [currentValue as number]
      arr.sort((a, b) => a - b)
      return arr
    }
    return [typeof currentValue === 'number' ? currentValue : (currentValue as number[])[0] ?? min]
  })()

  const handleValues = sortedValues
  const handleCount = handleValues.length

  // ---- Refs ----
  const rootRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const handleRefs = useRef<(HTMLDivElement | null)[]>([])
  if (handleRefs.current.length !== handleCount) {
    handleRefs.current = Array.from({ length: handleCount }, (_, i) => handleRefs.current[i] ?? null)
  }
  const dragRef = useRef<DragState | null>(null)
  const valueRef = useRef(currentValue)
  valueRef.current = currentValue

  // ---- State ----
  const [dragging, setDragging] = useState(false)
  const [hoverHandle, setHoverHandle] = useState<number | null>(null)
  const [activeHandleIndex, setActiveHandleIndex] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  const [focusSource, setFocusSource] = useState<'mouse' | 'keyboard'>('keyboard')
  const mouseDownRef = useRef(false)
  const [removingHandle, setRemovingHandle] = useState<number | null>(null)
  const removingHandleRef = useRef<number | null>(null)
  removingHandleRef.current = removingHandle

  // ---- useImperativeHandle ----
  useImperativeHandle(ref, () => ({
    focus: () => rootRef.current?.focus(),
    blur: () => rootRef.current?.blur(),
  }))

  // ---- Value update ----
  const updateValue = useCallback((newVal: number | number[]) => {
    if (!isControlled) setInternalValue(newVal)
    onChange?.(newVal)
  }, [isControlled, onChange])

  // ---- Position calculation ----
  const calcValueFromEvent = useCallback((e: MouseEvent) => {
    const rail = railRef.current
    if (!rail) return null
    const rect = rail.getBoundingClientRect()
    let percent: number
    if (vertical) {
      percent = ((rect.bottom - e.clientY) / rect.height) * 100
    } else {
      percent = ((e.clientX - rect.left) / rect.width) * 100
    }
    if (reverse) percent = 100 - percent
    percent = clamp(percent, 0, 100)
    const rawValue = min + (percent / 100) * (max - min)
    return snapToStep(rawValue, min, max, step, marks)
  }, [vertical, reverse, min, max, step, marks])

  // ---- Handle mousedown ----
  const handleMouseDown = useCallback((handleIndex: number) => (e: React.MouseEvent) => {
    if (disabled) return
    e.preventDefault()
    e.stopPropagation()
    const rect = railRef.current?.getBoundingClientRect()
    if (!rect) return
    dragRef.current = { handleIndex, containerRect: rect, isDraggingTrack: false }
    setDragging(true)
    setActiveHandleIndex(handleIndex)
    mouseDownRef.current = true
    setFocusSource('mouse')
    rootRef.current?.focus()
  }, [disabled])

  // ---- Track mousedown (draggableTrack) ----
  const handleTrackMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled || !rangeConfig.enabled || !rangeConfig.draggableTrack) return
    e.preventDefault()
    e.stopPropagation()
    const rect = railRef.current?.getBoundingClientRect()
    if (!rect) return
    let percent: number
    if (vertical) {
      percent = ((rect.bottom - e.clientY) / rect.height) * 100
    } else {
      percent = ((e.clientX - rect.left) / rect.width) * 100
    }
    if (reverse) percent = 100 - percent
    dragRef.current = {
      handleIndex: -1,
      containerRect: rect,
      isDraggingTrack: true,
      trackStartValues: [...sortedValues],
      trackStartPercent: percent,
    }
    setDragging(true)
    mouseDownRef.current = true
    setFocusSource('mouse')
    rootRef.current?.focus()
  }, [disabled, rangeConfig.enabled, rangeConfig.draggableTrack, vertical, reverse, sortedValues])

  // ---- Rail click ----
  const handleRailClick = useCallback((e: React.MouseEvent) => {
    if (disabled || dragging) return
    const rail = railRef.current
    if (!rail) return
    const rect = rail.getBoundingClientRect()
    let percent: number
    if (vertical) {
      percent = ((rect.bottom - e.clientY) / rect.height) * 100
    } else {
      percent = ((e.clientX - rect.left) / rect.width) * 100
    }
    if (reverse) percent = 100 - percent
    percent = clamp(percent, 0, 100)
    const rawValue = min + (percent / 100) * (max - min)
    const snapped = snapToStep(rawValue, min, max, step, marks)

    if (rangeConfig.editable && handleCount < rangeConfig.maxCount) {
      // Editable: add a new handle
      const vals = [...sortedValues, snapped]
      vals.sort((a, b) => a - b)
      const newIndex = vals.indexOf(snapped)
      setActiveHandleIndex(newIndex)
      updateValue(vals)
      onChangeComplete?.(vals)
    } else if (rangeConfig.enabled) {
      // Range: move nearest handle
      const vals = [...sortedValues]
      let nearestIdx = 0
      let nearestDist = Infinity
      for (let i = 0; i < vals.length; i++) {
        const dist = Math.abs(vals[i] - snapped)
        if (dist < nearestDist) {
          nearestDist = dist
          nearestIdx = i
        }
      }
      vals[nearestIdx] = snapped
      vals.sort((a, b) => a - b)
      updateValue(vals)
      setActiveHandleIndex(nearestIdx)
      onChangeComplete?.(vals)
    } else {
      updateValue(snapped)
      onChangeComplete?.(snapped)
    }
  }, [disabled, dragging, vertical, reverse, min, max, step, marks, rangeConfig, sortedValues, handleCount, updateValue, onChangeComplete])

  // ---- Document drag listeners ----
  useEffect(() => {
    if (!dragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const state = dragRef.current
      if (!state) return

      if (state.isDraggingTrack && state.trackStartValues && state.trackStartPercent !== undefined) {
        // Draggable track mode: move all handles
        const rail = railRef.current
        if (!rail) return
        const rect = rail.getBoundingClientRect()
        let percent: number
        if (vertical) {
          percent = ((rect.bottom - e.clientY) / rect.height) * 100
        } else {
          percent = ((e.clientX - rect.left) / rect.width) * 100
        }
        if (reverse) percent = 100 - percent
        const delta = ((percent - state.trackStartPercent) / 100) * (max - min)

        let newVals = state.trackStartValues.map(v => v + delta)
        // Clamp: shift all if any overshoot
        const lo = Math.min(...newVals)
        if (lo < min) newVals = newVals.map(v => v + (min - lo))
        const hi2 = Math.max(...newVals)
        if (hi2 > max) newVals = newVals.map(v => v - (hi2 - max))
        newVals = newVals.map(v => snapToStep(clamp(v, min, max), min, max, step, marks))
        updateValue(newVals)
        return
      }

      const snapped = calcValueFromEvent(e)
      if (snapped === null) return

      if (rangeConfig.enabled) {
        const vals = [...(Array.isArray(valueRef.current) ? valueRef.current : [valueRef.current as number])]
        vals[state.handleIndex] = snapped
        vals.sort((a, b) => a - b)
        updateValue(vals)
      } else {
        updateValue(snapped)
      }

      // Editable: check perpendicular distance for drag-out removal
      if (rangeConfig.editable && !state.isDraggingTrack) {
        const currentCount = Array.isArray(valueRef.current) ? valueRef.current.length : 1
        if (currentCount > rangeConfig.minCount) {
          const rail = railRef.current
          if (rail) {
            const rect = rail.getBoundingClientRect()
            let perpDistance: number
            if (vertical) {
              const railCenterX = rect.left + rect.width / 2
              perpDistance = Math.abs(e.clientX - railCenterX)
            } else {
              const railCenterY = rect.top + rect.height / 2
              perpDistance = Math.abs(e.clientY - railCenterY)
            }
            const REMOVE_THRESHOLD = 60
            if (perpDistance > REMOVE_THRESHOLD) {
              setRemovingHandle(state.handleIndex)
            } else {
              setRemovingHandle(null)
            }
          }
        }
      }
    }

    const handleMouseUp = () => {
      const removing = removingHandleRef.current
      if (removing !== null && rangeConfig.editable) {
        // Remove the handle
        const vals = [...(Array.isArray(valueRef.current) ? valueRef.current : [valueRef.current as number])]
        if (vals.length > rangeConfig.minCount) {
          vals.splice(removing, 1)
          vals.sort((a, b) => a - b)
          const newActiveIndex = Math.min(activeHandleIndex, vals.length - 1)
          setActiveHandleIndex(newActiveIndex)
          updateValue(vals)
          onChangeComplete?.(vals)
        } else {
          onChangeComplete?.(valueRef.current)
        }
      } else {
        onChangeComplete?.(valueRef.current)
      }
      setRemovingHandle(null)
      setDragging(false)
      dragRef.current = null
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging])

  // ---- Keyboard ----
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled || !keyboard) return
    const effectiveStep = step ?? 1
    let handled = true

    const adjust = (delta: number) => {
      if (rangeConfig.enabled) {
        const vals = [...sortedValues]
        vals[activeHandleIndex] = clamp(vals[activeHandleIndex] + delta, min, max)
        vals[activeHandleIndex] = snapToStep(vals[activeHandleIndex], min, max, step, marks)
        vals.sort((a, b) => a - b)
        updateValue(vals)
        onChangeComplete?.(vals)
      } else {
        const newVal = snapToStep(clamp((valueRef.current as number) + delta, min, max), min, max, step, marks)
        updateValue(newVal)
        onChangeComplete?.(newVal)
      }
    }

    const jumpTo = (target: number) => {
      if (rangeConfig.enabled) {
        const vals = [...sortedValues]
        vals[activeHandleIndex] = target
        vals.sort((a, b) => a - b)
        updateValue(vals)
        onChangeComplete?.(vals)
      } else {
        updateValue(target)
        onChangeComplete?.(target)
      }
    }

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        adjust(reverse ? -effectiveStep : effectiveStep)
        break
      case 'ArrowLeft':
      case 'ArrowDown':
        adjust(reverse ? effectiveStep : -effectiveStep)
        break
      case 'Home':
        jumpTo(min)
        break
      case 'End':
        jumpTo(max)
        break
      case 'Tab':
        if (rangeConfig.enabled && handleCount > 1) {
          if (!e.shiftKey) {
            if (activeHandleIndex < handleCount - 1) {
              e.preventDefault()
              setActiveHandleIndex(activeHandleIndex + 1)
            } else {
              handled = false
            }
          } else {
            if (activeHandleIndex > 0) {
              e.preventDefault()
              setActiveHandleIndex(activeHandleIndex - 1)
            } else {
              handled = false
            }
          }
        } else {
          handled = false
        }
        break
      case 'Delete':
      case 'Backspace':
        if (rangeConfig.editable && handleCount > rangeConfig.minCount) {
          const vals = [...sortedValues]
          vals.splice(activeHandleIndex, 1)
          const newActiveIndex = Math.min(activeHandleIndex, vals.length - 1)
          setActiveHandleIndex(newActiveIndex)
          updateValue(vals)
          onChangeComplete?.(vals)
        } else {
          handled = false
        }
        break
      default:
        handled = false
    }

    if (handled) e.preventDefault()
  }, [disabled, keyboard, step, marks, rangeConfig, sortedValues, handleCount, activeHandleIndex, min, max, reverse, updateValue, onChangeComplete])

  // ---- Handle hover (tooltip only — visual hover is CSS-based) ----
  const handleHandleMouseEnter = useCallback((index: number) => () => {
    if (disabled) return
    setHoverHandle(index)
  }, [disabled])

  const handleHandleMouseLeave = useCallback(() => {
    setHoverHandle(null)
  }, [])

  // ---- Mark click ----
  const handleMarkClick = useCallback((markValue: number) => {
    if (disabled) return
    if (rangeConfig.enabled) {
      const vals = [...sortedValues]
      let nearestIdx = 0
      let nearestDist = Infinity
      for (let i = 0; i < vals.length; i++) {
        const dist = Math.abs(vals[i] - markValue)
        if (dist < nearestDist) {
          nearestDist = dist
          nearestIdx = i
        }
      }
      vals[nearestIdx] = markValue
      vals.sort((a, b) => a - b)
      updateValue(vals)
      onChangeComplete?.(vals)
    } else {
      updateValue(markValue)
      onChangeComplete?.(markValue)
    }
  }, [disabled, rangeConfig.enabled, sortedValues, updateValue, onChangeComplete])

  // ---- Tooltip visibility ----
  const tooltipForceOpen = tooltip?.open
  const tooltipHidden = tooltip?.formatter === null
  const tooltipPlacement = tooltip?.placement ?? (vertical ? 'right' : 'top')
  const tooltipFormatter = tooltip?.formatter ?? ((v: number) => v)

  const isTooltipVisible = (index: number): boolean => {
    if (tooltipHidden) return false
    if (tooltipForceOpen === true) return true
    if (tooltipForceOpen === false) return false
    return hoverHandle === index || (dragging && dragRef.current?.handleIndex === index) ||
      (dragging && dragRef.current?.isDraggingTrack === true)
  }

  // ---- Compute positions ----
  const getPos = (value: number): number => {
    const p = getPercent(value, min, max)
    return reverse ? 100 - p : p
  }

  // ---- Track segments ----
  const trackSegments: { start: number; size: number }[] = []
  if (rangeConfig.enabled && included && handleCount >= 2) {
    for (let i = 0; i < handleCount - 1; i++) {
      const lo = getPos(sortedValues[i])
      const hi = getPos(sortedValues[i + 1])
      const start = Math.min(lo, hi)
      const size = Math.abs(hi - lo)
      trackSegments.push({ start, size })
    }
  } else if (!rangeConfig.enabled && included) {
    const lo = getPos(min)
    const hi = getPos(sortedValues[0])
    const start = Math.min(lo, hi)
    const size = Math.abs(hi - lo)
    trackSegments.push({ start, size })
  }

  // Dots positions
  const dotPositions: number[] = []
  if (dots && step !== null && step > 0) {
    for (let v = min; v <= max; v = parseFloat((v + step).toFixed(10))) {
      dotPositions.push(v)
    }
  }
  // Mark dots
  const markEntries = marks ? Object.entries(marks).map(([k, v]) => [Number(k), v] as [number, SliderMarkLabel]) : []

  // ---- Styles ----

  const rootStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    ...(vertical
      ? { flexDirection: 'column', height: '100%', width: '1.875rem', padding: '0 0.375rem' }
      : { width: '100%', height: '1.875rem', padding: '0.375rem 0' }),
    cursor: disabled ? 'default' : 'pointer',
    ...(disabled ? { opacity: 0.5 } : {}),
    outline: 'none',
    boxShadow: isFocused && !disabled && focusSource === 'keyboard'
      ? `0 0 0 2px ${tokens.colorPrimaryLight}`
      : 'none',
    borderRadius: '0.25rem',
    userSelect: 'none',
    touchAction: 'none',
  }

  const railStyle: CSSProperties = {
    position: 'relative',
    ...(vertical
      ? { width: '0.25rem', height: '100%', borderRadius: '0.125rem' }
      : { width: '100%', height: '0.25rem', borderRadius: '0.125rem' }),
    backgroundColor: tokens.colorBgMuted,
  }

  const handleBaseStyle: CSSProperties = {
    position: 'absolute',
    width: '0.875rem',
    height: '0.875rem',
    borderRadius: '50%',
    backgroundColor: tokens.colorBg,
    border: `2px solid ${disabled ? tokens.colorBorder : tokens.colorPrimary}`,
    cursor: disabled ? 'default' : 'grab',
    transition: dragging ? 'none' : 'left 0.15s ease, bottom 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
    zIndex: 1,
    ...(vertical
      ? { left: '50%', transform: 'translate(-50%, 50%)' }
      : { top: '50%', transform: 'translate(-50%, -50%)' }),
  }

  const dotBaseStyle: CSSProperties = {
    position: 'absolute',
    width: '0.5rem',
    height: '0.5rem',
    borderRadius: '50%',
    backgroundColor: tokens.colorBg,
    transition: 'border-color 0.15s ease',
    ...(vertical
      ? { left: '50%', transform: 'translate(-50%, 50%)' }
      : { top: '50%', transform: 'translate(-50%, -50%)' }),
  }

  const markLabelBaseStyle: CSSProperties = {
    position: 'absolute',
    fontSize: '0.75rem',
    whiteSpace: 'nowrap',
    cursor: disabled ? 'default' : 'pointer',
    transition: 'color 0.15s ease',
    ...(vertical
      ? { left: '100%', marginLeft: '0.5rem', transform: 'translateY(50%)' }
      : { top: '100%', marginTop: '0.5rem', transform: 'translateX(-50%)' }),
  }

  const tooltipBaseStyle: CSSProperties = {
    position: 'absolute',
    zIndex: 1050,
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    fontSize: '0.75rem',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    backgroundColor: tokens.colorBgMuted,
    color: tokens.colorText,
    border: `1px solid ${tokens.colorBorder}`,
    boxShadow: tokens.shadowMd,
    pointerEvents: 'none',
    ...(tooltipPlacement === 'top' ? { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '0.375rem' } : {}),
    ...(tooltipPlacement === 'bottom' ? { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '0.375rem' } : {}),
    ...(tooltipPlacement === 'left' ? { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '0.375rem' } : {}),
    ...(tooltipPlacement === 'right' ? { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '0.375rem' } : {}),
  }

  // ---- Check if a value is in an active track range ----
  const isInRange = (value: number): boolean => {
    if (!included) return false
    if (rangeConfig.enabled) {
      for (let i = 0; i < sortedValues.length - 1; i++) {
        if (value >= sortedValues[i] && value <= sortedValues[i + 1]) return true
      }
      return false
    }
    return value >= min && value <= sortedValues[0]
  }

  // ---- Handle custom colors detection (for CSS hover) ----
  const hasCustomHandleColors = !!(slotStyles?.handle && (
    'backgroundColor' in slotStyles.handle || 'borderColor' in slotStyles.handle || 'border' in slotStyles.handle
  ))

  // ---- Render handles ----
  const renderHandle = (value: number, index: number) => {
    const pos = getPos(value)
    const posStyle: CSSProperties = vertical
      ? { bottom: `${pos}%` }
      : { left: `${pos}%` }

    const tooltipContent = tooltipFormatter ? tooltipFormatter(value) : value

    return (
      <div
        key={index}
        ref={(el) => { handleRefs.current[index] = el }}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={handleCount > 1 ? `Handle ${index + 1} of ${handleCount}` : undefined}
        style={mergeSemanticStyle({ ...handleBaseStyle, ...posStyle }, slotStyles?.handle)}
        className={mergeSemanticClassName('j-slider-handle', classNames?.handle)}
        data-disabled={disabled || undefined}
        data-custom-colors={hasCustomHandleColors || undefined}
        data-active={activeHandleIndex === index || undefined}
        data-removing={removingHandle === index || undefined}
        onMouseDown={handleMouseDown(index)}
        onMouseEnter={handleHandleMouseEnter(index)}
        onMouseLeave={handleHandleMouseLeave}
      >
        {isTooltipVisible(index) && (
          <div
            style={mergeSemanticStyle(tooltipBaseStyle, slotStyles?.tooltip)}
            className={classNames?.tooltip}
            role="tooltip"
          >
            {tooltipContent}
          </div>
        )}
      </div>
    )
  }

  // ---- Render dots ----
  const allDotValues = new Set<number>()
  dotPositions.forEach((v) => allDotValues.add(v))
  markEntries.forEach(([v]) => allDotValues.add(v))

  const renderDot = (value: number) => {
    const pos = getPos(value)
    const active = isInRange(value)
    const posStyle: CSSProperties = vertical
      ? { bottom: `${pos}%` }
      : { left: `${pos}%` }

    return (
      <div
        key={`dot-${value}`}
        style={mergeSemanticStyle({
          ...dotBaseStyle,
          ...posStyle,
          border: `2px solid ${active ? tokens.colorPrimary : tokens.colorBorder}`,
        }, slotStyles?.dot)}
        className={classNames?.dot}
      />
    )
  }

  // ---- Render marks ----
  const renderMark = ([markValue, label]: [number, SliderMarkLabel]) => {
    const pos = getPos(markValue)
    const active = isInRange(markValue)
    const posStyle: CSSProperties = vertical
      ? { bottom: `${pos}%` }
      : { left: `${pos}%` }

    const markStyle: CSSProperties = {
      ...markLabelBaseStyle,
      ...posStyle,
      color: active ? tokens.colorText : tokens.colorTextSubtle,
    }

    if (isMarkLabel(label)) {
      return (
        <div
          key={`mark-${markValue}`}
          style={mergeSemanticStyle({ ...markStyle, ...label.style }, slotStyles?.mark)}
          className={classNames?.mark}
          onClick={() => handleMarkClick(markValue)}
        >
          {label.label}
        </div>
      )
    }

    return (
      <div
        key={`mark-${markValue}`}
        style={mergeSemanticStyle(markStyle, slotStyles?.mark)}
        className={classNames?.mark}
        onClick={() => handleMarkClick(markValue)}
      >
        {label}
      </div>
    )
  }

  // ---- Aria ----
  const isMultiHandle = rangeConfig.enabled && handleCount > 1

  return (
    <div
      ref={rootRef}
      role={isMultiHandle ? 'group' : 'slider'}
      tabIndex={disabled ? -1 : 0}
      aria-valuemin={isMultiHandle ? undefined : min}
      aria-valuemax={isMultiHandle ? undefined : max}
      aria-valuenow={isMultiHandle ? undefined : sortedValues[0]}
      aria-valuetext={isMultiHandle ? sortedValues.join(' - ') : undefined}
      aria-label={isMultiHandle ? 'Slider range' : undefined}
      aria-disabled={disabled}
      aria-orientation={vertical ? 'vertical' : 'horizontal'}
      style={mergeSemanticStyle(rootStyle, slotStyles?.root, style)}
      className={mergeSemanticClassName(className, classNames?.root)}
      onKeyDown={handleKeyDown}
      onMouseDown={() => {
        mouseDownRef.current = true
        setFocusSource('mouse')
      }}
      onFocus={() => {
        setFocusSource(mouseDownRef.current ? 'mouse' : 'keyboard')
        mouseDownRef.current = false
        setIsFocused(true)
      }}
      onBlur={() => setIsFocused(false)}
    >
      {/* Handle hover + active + removing via CSS */}
      <style>{`
        .j-slider-handle:not([data-disabled]):not([data-custom-colors]):hover {
          border-color: ${tokens.colorPrimaryHover} !important;
          box-shadow: 0 0 0 4px ${tokens.colorPrimaryLight} !important;
        }
        .j-slider-handle[data-custom-colors]:not([data-disabled]):hover {
          filter: brightness(1.15);
        }
        .j-slider-handle[data-active] {
          z-index: 2 !important;
        }
        .j-slider-handle[data-removing] {
          opacity: 0.4 !important;
          filter: none !important;
          box-shadow: none !important;
        }
      `}</style>

      {/* Cursor overlay during drag */}
      {dragging && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          cursor: 'grabbing',
        }} />
      )}

      {/* Rail */}
      <div
        ref={railRef}
        style={mergeSemanticStyle(railStyle, slotStyles?.rail)}
        className={classNames?.rail}
        onClick={handleRailClick}
      >
        {/* Track segments */}
        {trackSegments.map((seg, idx) => {
          const segStyle: CSSProperties = {
            position: 'absolute',
            borderRadius: '0.125rem',
            backgroundColor: disabled ? tokens.colorBorder : tokens.colorPrimary,
            transition: dragging ? 'none' : 'all 0.15s ease',
            ...(vertical
              ? { width: '100%', bottom: `${seg.start}%`, height: `${seg.size}%`, left: 0 }
              : { height: '100%', left: `${seg.start}%`, width: `${seg.size}%`, top: 0 }),
            ...(rangeConfig.draggableTrack && rangeConfig.enabled && !disabled ? { cursor: 'grab' } : {}),
          }
          return (
            <div
              key={`track-${idx}`}
              style={mergeSemanticStyle(segStyle, slotStyles?.track)}
              className={classNames?.track}
              onMouseDown={rangeConfig.draggableTrack && rangeConfig.enabled ? handleTrackMouseDown : undefined}
            />
          )
        })}

        {/* Dots */}
        {(dots || markEntries.length > 0) && (
          Array.from(allDotValues).map((v) => renderDot(v))
        )}

        {/* Handles */}
        {handleValues.map((val, i) => renderHandle(val, i))}
      </div>

      {/* Mark labels */}
      {markEntries.length > 0 && markEntries.map(renderMark)}
    </div>
  )
}

// ============================================================================
// Export
// ============================================================================

export const Slider = forwardRef<SliderRef, SliderProps>(SliderComponent)
