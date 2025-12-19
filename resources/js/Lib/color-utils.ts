export function getIdealTextColor(bgColor: string): string {
  const hex = bgColor.replace('#', '')
  const r = Number.parseInt(hex.slice(0, 2), 16)
  const g = Number.parseInt(hex.slice(2, 4), 16)
  const b = Number.parseInt(hex.slice(4, 6), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 125 ? '#000000' : '#FFFFFF'
}

export function generateColorHash(input: string): number {
  if (!input) return 0

  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }

  return Math.abs(hash)
}

export function generateColorFromString(input: string): string {
  if (!input) return '#6B7280'

  const hash = generateColorHash(input)

  // Use golden ratio for better distribution
  const goldenRatio = 0.618033988749
  const hue = (hash * goldenRatio) % 1

  const saturation = 0.7
  const lightness = 0.5

  return hslToHex(hue * 360, saturation * 100, lightness * 100)
}

function hslToHex(h: number, s: number, l: number): string {
  const hue = h % 360
  const saturation = s / 100
  const lightness = l / 100

  const c = (1 - Math.abs(2 * lightness - 1)) * saturation
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1))
  const m = lightness - c / 2

  let r = 0
  let g = 0
  let b = 0

  if (0 <= hue && hue < 60) {
    r = c
    g = x
    b = 0
  } else if (60 <= hue && hue < 120) {
    r = x
    g = c
    b = 0
  } else if (120 <= hue && hue < 180) {
    r = 0
    g = c
    b = x
  } else if (180 <= hue && hue < 240) {
    r = 0
    g = x
    b = c
  } else if (240 <= hue && hue < 300) {
    r = x
    g = 0
    b = c
  } else if (300 <= hue && hue < 360) {
    r = c
    g = 0
    b = x
  }

  r = Math.round((r + m) * 255)
  g = Math.round((g + m) * 255)
  b = Math.round((b + m) * 255)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
