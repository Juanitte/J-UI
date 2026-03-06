// DOM
export { getScrollBarSize } from './getScrollBarSize'
export { scrollTo } from './scrollTo'
export type { ScrollToOptions } from './scrollTo'
export { canUseDom } from './canUseDom'

// Object
export { omit } from './omit'
export { classNames } from './classNames'
export type { ClassValue } from './classNames'

// Breakpoints
export { BREAKPOINT_VALUES, BREAKPOINT_ORDER, getResponsiveValue } from './breakpoints'
export type { Breakpoint, ResponsiveValue } from './breakpoints'

// Hooks
export { useEvent } from './hooks/useEvent'
export { useMergedState } from './hooks/useMergedState'
export type { UseMergedStateOptions } from './hooks/useMergedState'
export { useWindowWidth } from './hooks/useWindowWidth'
export { useBreakpoint } from './hooks/useBreakpoint'

// Semantic DOM (source of truth lives here)
export { mergeSemanticClassName, mergeSemanticStyle } from './semanticDom'
export type { SemanticClassNames, SemanticStyles } from './semanticDom'

// Color bridge for CSS custom properties
export { getColorVars } from './colorVars'
