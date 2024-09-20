import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process'

import nunjucks from 'nunjucks'
import dateFilter from 'nunjucks-date-filter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const RESUME = path.join(__dirname, './resume.json')
const TEMPLATE_DIR = path.resolve(__dirname, 'templates')
const OUT_DIR = path.resolve(__dirname, '..', 'dist')
const OUT_PDF = path.resolve(OUT_DIR, 'resume.pdf')
const OUT_HTML = path.resolve(OUT_DIR, 'resume.html')

const resume = JSON.parse(fs.readFileSync(RESUME, 'utf8'))

const theme = {
  styles: [path.resolve(__dirname, 'style.css')],
}

const env = nunjucks.configure(TEMPLATE_DIR, { trimBlocks: true })
env.addFilter('date', dateFilter)
env.addGlobal('includeFile', src => fs.readFileSync(src))

const html = env.render('index.html', { ...resume, theme })
fs.mkdirSync(OUT_DIR, { recursive: true })
fs.writeFileSync(OUT_HTML, html)

execFileSync('open', [OUT_HTML])

