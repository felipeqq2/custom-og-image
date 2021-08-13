export type FileType = 'png' | 'jpeg'
export type Theme = 'light' | 'dark'
export type Background = {
	url: string
	brightness: number
}

export interface ParsedRequest {
	fileType: FileType
	text: string
	theme: Theme
	md: boolean
	fontSize: string
	images: string[]
	widths: string[]
	heights: string[]
	font: string
	bg: Background
	line: string
}
