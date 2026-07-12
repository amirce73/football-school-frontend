const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

const htmlContent = fs.readFileSync('footballit-sepahan2.html', 'utf-8');
const $ = cheerio.load(htmlContent);

// 1. Extract CSS
let cssContent = $('style').text();
cssContent += `\n#root { display: contents; }\n`;
fs.writeFileSync('src/index.css', cssContent, 'utf-8');

// Function to clean HTML for JSX
function toJSX(htmlStr) {
    if (!htmlStr) return '<div></div>';
    let jsx = htmlStr
        .replace(/class=/g, 'className=')
        .replace(/for=/g, 'htmlFor=')
        .replace(/<!--(.*?)-->/gs, '{/* $1 */}');

    // Close self-closing tags first! (Before adding arrow functions with '>')
    const selfClosingTags = ['img', 'br', 'hr', 'input'];
    selfClosingTags.forEach(tag => {
        const regex = new RegExp(`<${tag}([^>]*?)(?<!/)>`, 'gi');
        jsx = jsx.replace(regex, `<${tag}$1 />`);
    });

    // Fix onclick to use navigate
    jsx = jsx.replace(/onclick="switchTab\('([^']+)'\)"/g, "onClick={() => navigate('/$1')}");
    // Fix other onclicks
    jsx = jsx.replace(/onclick="([^"]*)"/g, (match, p1) => {
        if (p1.includes('switchTab')) return match; // Already handled
        if (p1.includes('toggleProfileMenu')) return `onClick={(e) => { e.stopPropagation(); document.getElementById('profileMenu')?.classList.toggle('show'); }}`;
        if (p1.includes('alert')) return `onClick={() => { ${p1} }}`;
        return `onClick={() => {}}`;
    });

    // Fix onError
    jsx = jsx.replace(/onerror="this\.src='([^']*)'"/g, "onError={(e) => { e.currentTarget.src='$1'; }}");

    // Convert inline styles to objects
    jsx = jsx.replace(/style="([^"]*)"/g, (match, p1) => {
        const styleRules = p1.split(';').filter(s => s.trim());
        const styleObj = {};
        styleRules.forEach(rule => {
            const [key, value] = rule.split(':').map(s => s.trim());
            if (key && value) {
                const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
                styleObj[camelKey] = value;
            }
        });
        return `style={${JSON.stringify(styleObj)}}`;
    });

    return jsx;
}

// Ensure directory exists
function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

ensureDir('src/components/Layout');
ensureDir('src/pages');

// Extract Layout Components
const topNav = toJSX($('nav.top-navbar').prop('outerHTML') || '');
const sidebar = toJSX($('aside.desktop-sidebar').prop('outerHTML') || '');
const bottomNav = toJSX($('nav.bottom-nav').prop('outerHTML') || '');

const layoutImports = `import React from 'react';\nimport { useNavigate, NavLink } from 'react-router-dom';\n`;

// Helper for NavLink mapping
function applyNavLinks(jsx) {
    // Replaces the <div className="dnav-item..."> with NavLink
    let newJsx = jsx.replace(/<div className="(dnav-item|bnav-item)[^"]*" onClick=\{\(\) => navigate\('([^']+)'\)\}>([\s\S]*?)<\/div>/g,
        `<NavLink to="$2" className={({isActive}) => isActive ? "$1 active" : "$1"}>$3</NavLink>`);
    return newJsx;
}

fs.writeFileSync('src/components/Layout/Topbar.tsx', `${layoutImports}\nexport default function Topbar() {\n  const navigate = useNavigate();\n  return (\n    ${topNav}\n  );\n}\n`);
fs.writeFileSync('src/components/Layout/Sidebar.tsx', `${layoutImports}\nexport default function Sidebar() {\n  const navigate = useNavigate();\n  return (\n    ${applyNavLinks(sidebar)}\n  );\n}\n`);
fs.writeFileSync('src/components/Layout/BottomNav.tsx', `${layoutImports}\nexport default function BottomNav() {\n  const navigate = useNavigate();\n  return (\n    ${applyNavLinks(bottomNav)}\n  );\n}\n`);

// Extract Pages
const pages = [];
$('.view-section').each((i, el) => {
    const id = $(el).attr('id');
    if (!id) return;

    const pageId = id.replace('view-', '');
    const componentName = pageId.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');

    const pageHtml = $(el).prop('outerHTML').replace(/class="view-section hidden fade-in"/g, 'class="view-section fade-in"');
    const pageJSX = toJSX(pageHtml);

    fs.writeFileSync(`src/pages/${componentName}.tsx`, `import React from 'react';\nimport { useNavigate } from 'react-router-dom';\n\nexport default function ${componentName}() {\n  const navigate = useNavigate();\n  return (\n    ${pageJSX}\n  );\n}\n`);

    pages.push({ path: pageId, component: componentName });
});

// App.tsx
const appTsx = `import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Topbar from './components/Layout/Topbar';
import Sidebar from './components/Layout/Sidebar';
import BottomNav from './components/Layout/BottomNav';
import './index.css';

${pages.map(p => `import ${p.component} from './pages/${p.component}';`).join('\n')}

export default function App() {
  return (
    <BrowserRouter>
      <Topbar />
      <Sidebar />
      <main className="main-wrapper">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          ${pages.map(p => `<Route path="/${p.path}" element={<${p.component} />} />`).join('\n          ')}
        </Routes>
      </main>
      <BottomNav />
    </BrowserRouter>
  );
}
`;
fs.writeFileSync('src/App.tsx', appTsx);

console.log('Migration complete!');
