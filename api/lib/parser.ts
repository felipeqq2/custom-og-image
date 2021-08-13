import { IncomingMessage } from 'http'
import { ParsedRequest, Theme } from './types'
import { BadRequest } from './error'

export function parseRequest(req: IncomingMessage) {
	console.log('HTTP ' + req.url)
	const { pathname, searchParams } = new URL(
		req.url || '/',
		'http://' + process.env.VERCEL_URL
	)

	let query: Record<string, string | string[]> = {}
	searchParams.forEach((v, k) => {
		if (query[k]) {
			const current = query[k]

			if (Array.isArray(current)) query[k] = [...current, v]
			else query[k] = [current, v]
		} else query[k] = v
	})

	console.log(query)

	var { fontSize, images, widths, heights, theme, md, font, bg, brightness } =
		query

	if (Array.isArray(fontSize)) {
		throw new BadRequest('Expected a single fontSize')
	}
	if (Array.isArray(theme)) {
		throw new BadRequest('Expected a single theme')
	}
	if (Array.isArray(font)) {
		throw new BadRequest('Expected a single font')
	}
	if (Array.isArray(md)) {
		throw new BadRequest('Expected a single "md" parameter')
	}
	if (Array.isArray(bg)) {
		throw new BadRequest('Expected a single background')
	}
	if (Array.isArray(brightness)) {
		throw new BadRequest('Expected a single "brightness" parameter')
	}

	const arr = (pathname || '/').slice(1).split('.')
	let extension = ''
	let text = ''
	if (arr.length === 1) {
		text = arr[0]
	} else if (arr.length !== 0) {
		extension = arr.pop() as string
		text = arr.join('.')
		if (extension !== 'jpeg' && extension !== 'png') {
			text += '.' + extension
		}
	}

	if (font)
		font = decodeURIComponent(font).replace(/(^\w|\s\w)/g, (m: string) =>
			m.toUpperCase()
		)

	const parsedRequest: ParsedRequest = {
		fileType: extension === 'jpeg' ? extension : 'png',
		text: decodeURIComponent(text),
		theme: bg || theme === 'dark' ? 'dark' : 'light',
		md: md === '1' || md === 'true',
		fontSize: fontSize || '96px',
		images: getArray(images),
		widths: getArray(widths),
		heights: getArray(heights),
		font: font || 'Inter',
		bg: { url: bg ? `url(${bg})` : 'none', brightness: +brightness || 5 }
	}
	parsedRequest.images = getDefaultImages(
		parsedRequest.images,
		parsedRequest.theme
	)
	return parsedRequest
}

function getArray(stringOrArray: string[] | string | undefined): string[] {
	if (typeof stringOrArray === 'undefined') {
		return []
	} else if (Array.isArray(stringOrArray)) {
		return stringOrArray
	} else {
		return [stringOrArray]
	}
}

function getDefaultImages(images: string[], theme: Theme): string[] {
	const defaultImage =
		theme === 'light'
			? 'https://assets.vercel.com/image/upload/front/assets/design/vercel-triangle-black.svg'
			: 'https://assets.vercel.com/image/upload/front/assets/design/vercel-triangle-white.svg'

	if (!images || !images[0]) {
		return [defaultImage]
	}
	return images
}
