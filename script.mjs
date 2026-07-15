
import fs from 'fs';
import * as cheerio from 'cheerio';
const content = fs.readFileSync('c:\\Users\\amirce73\\Desktop\\??? ????? ??????\\raw-html-version\\specialized-hub.html', 'utf8');
const $ = cheerio.load(content);
.frame-item, button, .card.each((i, el) => {
    const text = .text().trim().replace(/\n/g, ' ').substring(0, 50);
    if(text) console.log(el.tagName + ' ' + .attr('class') + ': ' + text);
});

