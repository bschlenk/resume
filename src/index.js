const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');
const dateFilter = require('nunjucks-date-filter');
const pdf = require('html-pdf');
const resume = require('./resume.json');

const TEMPLATE_DIR = path.resolve(__dirname, 'templates');
const OUT_DIR = path.resolve(__dirname, '..', 'dist');
const OUT_PDF = path.resolve(OUT_DIR, 'resume.pdf');
const OUT_HTML = path.resolve(OUT_DIR, 'resume.html');

const theme = {
  styles: [path.resolve(__dirname, 'style.css')],
};

const env = nunjucks.configure(TEMPLATE_DIR, { trimBlocks: true });
env.addFilter('date', dateFilter);
env.addGlobal('includeFile', src => fs.readFileSync(src));

const html = env.render('index.html', { ...resume, theme });
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_HTML, html);
pdf.create(html, {
  format: 'Letter',
}).toFile(OUT_PDF, (err) => {
  if (err) {
    console.error(err);
  }
});
