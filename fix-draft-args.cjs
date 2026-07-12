const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
    const filePath = path.join(pagesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove third arg from useFormDraft calls
    const before = content;
    content = content.replace(/useFormDraft\(('[\w]+')\s*,\s*methods\s*,\s*isDataLoaded\)/g, "useFormDraft($1, methods)");
    
    // Also remove isDataLoaded variable declarations that are no longer needed
    content = content.replace(/\n\s*const isDataLoaded = [^\n]+;\n/g, '\n');
    
    if (content !== before) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${file}`);
    }
});
