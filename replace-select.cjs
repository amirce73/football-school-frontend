const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
    const filePath = path.join(pagesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes('<select ') || content.includes('<select>')) {
        // Replace <select ...> with <CustomSelect ...>
        content = content.replace(/<select\b/g, '<CustomSelect');
        // Replace </select> with </CustomSelect>
        content = content.replace(/<\/select>/g, '</CustomSelect>');

        // Add import if not present
        if (!content.includes('import CustomSelect')) {
            // Find the last import
            const importMatches = [...content.matchAll(/^import .* from '.*';/gm)];
            if (importMatches.length > 0) {
                const lastImport = importMatches[importMatches.length - 1];
                const lastImportEnd = lastImport.index + lastImport[0].length;
                content = content.slice(0, lastImportEnd) + '\nimport CustomSelect from \'../components/CustomSelect\';' + content.slice(lastImportEnd);
            } else {
                content = 'import CustomSelect from \'../components/CustomSelect\';\n' + content;
            }
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated ' + file);
    }
}
