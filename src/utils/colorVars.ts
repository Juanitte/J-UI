/**
 * Maps a semantic color name to scoped CSS custom properties.
 * Components set these as inline style, and CSS classes reference
 * var(--_base), var(--_hover), etc. for their variant styles.
 *
 * This avoids generating variant × color combinatorial CSS classes.
 */
export function getColorVars(color: string): Record<string, string> {
  return {
    '--_base': `var(--j-${color})`,
    '--_hover': `var(--j-${color}-hover)`,
    '--_light': `var(--j-${color}-light)`,
    '--_dark': `var(--j-${color}-dark)`,
    '--_contrast': `var(--j-${color}-contrast)`,
    '--_border': `var(--j-${color}-border)`,
    '--_200': `var(--j-${color}-200)`,
    '--_300': `var(--j-${color}-300)`,
    '--_400': `var(--j-${color}-400)`,
    '--_600': `var(--j-${color}-600)`,
  }
}
