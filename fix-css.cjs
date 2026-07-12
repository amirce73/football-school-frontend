const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

css = css.replace(/\.sticky-bottom-btn-container\s*\{[^}]+\}/, 
`.sticky-bottom-btn-container {
    position: fixed;
    bottom: 65px;
    left: 0;
    right: 0;
    padding: 15px 20px;
    background: var(--surface, #ffffff);
    z-index: 900;
    border-top: 1px solid rgba(0,0,0,0.05);
    box-shadow: 0 -4px 10px rgba(0,0,0,0.03);
}`);

// Add padding to forms so they don't get covered by the fixed button
if (!css.includes('.form-grid {')) {
   // Assuming there's a form-grid, wait there is one.
}
css = css.replace(/\.form-grid\s*\{([^}]+)\}/, (match, inner) => {
    if (!inner.includes('padding-bottom')) {
        return `.form-grid {${inner}\n    padding-bottom: 80px;\n}`;
    }
    return match;
});

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Fixed CSS');
