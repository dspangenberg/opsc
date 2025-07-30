export function getIdealTextColor(bgColor: string): string {
  const hex = bgColor.replace('#', '')
  const r = Number.parseInt(hex.slice(0, 2), 16)
  const g = Number.parseInt(hex.slice(2, 4), 16)
  const b = Number.parseInt(hex.slice(4, 6), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 125 ? '#000000' : '#FFFFFF'
}

/**
 * Generates a more evenly distributed hash for color selection
 * Uses a better hash algorithm to reduce collisions and improve distribution
 */
export function generateColorHash(input: string): number {
  if (!input) return 0

  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }

  return Math.abs(hash)
}

/**
 * Generates a color from HSL space for better color distribution
 * This ensures more visually distinct colors compared to a fixed palette
 */
export function generateColorFromString(input: string): string {
  if (!input) return '#6B7280' // Default gray color

  const hash = generateColorHash(input)

  // Use golden ratio for better distribution
  const goldenRatio = 0.618033988749
  const hue = (hash * goldenRatio) % 1

  // Use fixed saturation and lightness for consistent appearance
  const saturation = 0.7 // 70% saturation for vibrant colors
  const lightness = 0.5   // 50% lightness for good contrast

  return hslToHex(hue * 360, saturation * 100, lightness * 100)
}

/**
 * Converts HSL to HEX color format
 */
function hslToHex(h: number, s: number, l: number): string {
  h = h % 360
  s = s / 100
  l = l / 100

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = l - c / 2

  let r = 0, g = 0, b = 0

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x
  }

  r = Math.round((r + m) * 255)
  g = Math.round((g + m) * 255)
  b = Math.round((b + m) * 255)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
