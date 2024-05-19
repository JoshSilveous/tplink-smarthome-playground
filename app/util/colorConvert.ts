export type HSL = {
	h: number
	s: number
	l: number
}

export function hexToHSL(hex: string): HSL {
	// Remove the hash if present
	hex = hex.replace(/^#/, '')

	// Parse r, g, b values
	let r = parseInt(hex.substring(0, 2), 16) / 255
	let g = parseInt(hex.substring(2, 4), 16) / 255
	let b = parseInt(hex.substring(4, 6), 16) / 255

	// Find the minimum and maximum values to get luminance
	let max = Math.max(r, g, b)
	let min = Math.min(r, g, b)
	let h: number = 0
	let s: number = 0
	let l: number = (max + min) / 2

	if (max === min) {
		h = s = 0 // achromatic
	} else {
		let d = max - min
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0)
				break
			case g:
				h = (b - r) / d + 2
				break
			case b:
				h = (r - g) / d + 4
				break
		}
		h = Math.round(h * 60)
	}

	s = Math.round(s * 100)
	l = Math.round(l * 100)

	return { h, s, l }
}
export function hslToHex(h: number, s: number, l: number): string {
	s /= 100
	l /= 100

	let c = (1 - Math.abs(2 * l - 1)) * s
	let x = c * (1 - Math.abs(((h / 60) % 2) - 1))
	let m = l - c / 2
	let r: number, g: number, b: number

	if (0 <= h && h < 60) {
		r = c
		g = x
		b = 0
	} else if (60 <= h && h < 120) {
		r = x
		g = c
		b = 0
	} else if (120 <= h && h < 180) {
		r = 0
		g = c
		b = x
	} else if (180 <= h && h < 240) {
		r = 0
		g = x
		b = c
	} else if (240 <= h && h < 300) {
		r = x
		g = 0
		b = c
	} else {
		r = c
		g = 0
		b = x
	}

	r = Math.round((r + m) * 255)
	g = Math.round((g + m) * 255)
	b = Math.round((b + m) * 255)

	return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`
}
