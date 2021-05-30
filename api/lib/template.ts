import marked from 'marked'
import { sanitizeHtml } from './sanitizer'
import { ParsedRequest } from './types'
const twemoji = require('twemoji')
const twOptions = { folder: 'svg', ext: '.svg' }
const emojify = (text: string) => twemoji.parse(text, twOptions)

function getCss(theme: string, fontSize: string, font: string) {
	let background = 'white'
	let foreground = 'black'

	if (theme === 'dark') {
		background = 'black'
		foreground = 'white'
	}
	return `
    body {
        background: ${background};
        background-size: 100px 100px;
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
    }

    code {
        font-family: 'Inconsolata', monospace;
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        margin: 0 75px;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .spacer {
        margin: 150px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        font-family: '${font}', 'Inter', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: ${foreground};
        line-height: 1.8;
    }`
}

export function getHtml(parsedReq: ParsedRequest) {
	const { text, theme, md, fontSize, images, widths, heights, font } = parsedReq
	return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@500;700&family=${font}:ital,wght@0,400;0,700;1,400;1,700&family=Inter:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
    <style>
        ${getCss(theme, fontSize, font)}
    </style>
    <body>
        <div>
            <div class="spacer">
            <div class="logo-wrapper">
                ${images
									.map(
										(img, i) =>
											getPlusSign(i) + getImage(img, widths[i], heights[i])
									)
									.join('')}
            </div>
            <div class="spacer">
            <div class="heading">${emojify(
							md ? marked(text) : sanitizeHtml(text)
						)}
            </div>
        </div>
    </body>
</html>`
}

function getImage(src: string, width = 'auto', height = '225') {
	return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`
}

function getPlusSign(i: number) {
	return i === 0 ? '' : '<div class="plus">+</div>'
}
