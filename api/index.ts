import { IncomingMessage, ServerResponse } from 'http'
import { parseRequest } from './lib/parser'
import { getScreenshot } from './lib/chromium'
import { getHtml } from './lib/template'
import { BadRequest } from './lib/error'

const isDev = !process.env.AWS_REGION
const isHtmlDebug = process.env.OG_HTML_DEBUG === '1'

export default async function handler(
	req: IncomingMessage,
	res: ServerResponse
) {
	try {
		if (req.url === '/favicon.ico') {
			res.statusCode = 404
			res.setHeader('Content-Type', 'text/html')
			res.end('<p>Not found</p>')
			return
		}
		const parsedReq = parseRequest(req)
		const html = getHtml(parsedReq)
		if (isHtmlDebug) {
			res.setHeader('Content-Type', 'text/html')
			res.end(html)
			return
		}
		const { fileType } = parsedReq
		const file = await getScreenshot(html, fileType, isDev)
		res.statusCode = 200
		res.setHeader('Content-Type', `image/${fileType}`)
		res.setHeader(
			'Cache-Control',
			`public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
		)
		res.end(file)
	} catch (e) {
		res.statusCode = 500
		if (e instanceof BadRequest) res.statusCode = 400

		res.setHeader('Content-Type', 'text/html')
		res.end(
			`<h1>Internal Error</h1><p>Sorry, there was a problem: <br />${e}</p>`
		)
		console.error(e)
	}
}
