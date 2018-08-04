const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');
const dateFilter = require('nunjucks-date-filter');
const pdf = require('html-pdf');
const resume = require('./resume.json');

const OUT_FILE = path.resolve(__dirname, '..', 'dist', 'resume.pdf');

const theme = {
  styles: [path.resolve(__dirname, 'style.css')],
};

const env = nunjucks.configure(path.resolve(__dirname, 'templates'));
env.addFilter('date', dateFilter);
env.addGlobal('includeFile', src => fs.readFileSync(src));

const html = env.render('index.html', { ...resume, theme });
fs.writeFileSync(path.resolve(__dirname, '..', 'dist', 'resume.html'), html);
console.log(html);
pdf.create(html, {
  format: 'Letter',
}).toFile(OUT_FILE, (err) => {
  if (err) {
    console.error(err);
  }
});
