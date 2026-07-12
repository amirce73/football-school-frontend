const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src/pages');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
let changed = 0;

files.forEach(f => {
    const fullPath = path.join(dir, f);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Match any text after the arrow-right icon inside a button
    const regex = /(<button[^>]*btn-back-top[^>]*>[\s\S]*?<i className="fa fa-arrow-right"><\/i>)\s*[^<]+(<\/button>)/g;
    
    if (regex.test(content)) {
        content = content.replace(regex, '$1 بازگشت$2');
        fs.writeFileSync(fullPath, content);
        changed++;
    }
});

console.log(`Updated ${changed} files.`);
