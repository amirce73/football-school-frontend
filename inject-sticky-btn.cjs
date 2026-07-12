const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

const formConfigs = {
    'SportsInfo.tsx': { text: 'ثبت اطلاعات', loadingText: 'در حال ثبت...' },
    'PersonalInfo.tsx': { text: 'ثبت اطلاعات', loadingText: 'در حال ثبت...' },
    'ContactInfo.tsx': { text: 'ثبت اطلاعات', loadingText: 'در حال ثبت...' },
    'PassportInfo.tsx': { text: 'ثبت اطلاعات', loadingText: 'در حال ثبت...' },
    'BankInfo.tsx': { text: 'ثبت حساب بانکی', loadingText: 'در حال ثبت...' },
    'TrainingBackpack.tsx': { text: 'ثبت اطلاعات', loadingText: 'در حال ثبت...' },
    'Registration.tsx': { text: 'ثبت نام', loadingText: 'در حال ثبت...' },
};

Object.entries(formConfigs).forEach(([file, config]) => {
    const filePath = path.join(pagesDir, file);
    if (!fs.existsSync(filePath)) {
        console.log(`SKIP: ${file} not found`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');

    // Add StickySubmitButton import if not already present
    if (!content.includes('StickySubmitButton')) {
        // Add import after the last import line
        const lastImportIndex = content.lastIndexOf('import ');
        const nextNewline = content.indexOf('\n', lastImportIndex);
        content = content.slice(0, nextNewline + 1) +
            "import StickySubmitButton from '../components/StickySubmitButton';\n" +
            content.slice(nextNewline + 1);
    }

    // Remove old sticky-bottom-btn-container divs (the whole block)
    const oldBtnRegex = /\s*<div className="sticky-bottom-btn-container">\s*\n\s*<button[^]*?<\/button>\s*\n\s*<\/div>/g;
    content = content.replace(oldBtnRegex, '');

    // Now we need to insert <StickySubmitButton /> just before the closing </form> or before the last closing </div> of the page
    // For forms with <form> tag, insert before </form>
    if (file === 'Registration.tsx') {
        // Registration doesn't use <form>, it uses onClick
        // Insert before the last </div>\n    );\n} pattern
        if (!content.includes('<StickySubmitButton')) {
            content = content.replace(
                /(\s*<\/div>\s*\n\s*\);\s*\n\})/,
                `\n            <StickySubmitButton loading={loading} text="${config.text}" loadingText="${config.loadingText}" type="button" onClick={handleSubmit} />\n$1`
            );
        }
    } else if (content.includes('</form>')) {
        // Insert StickySubmitButton before </form>
        if (!content.includes('<StickySubmitButton')) {
            content = content.replace(
                /(\s*<\/form>)/,
                `\n                <StickySubmitButton loading={loading} text="${config.text}" loadingText="${config.loadingText}" />\n$1`
            );
        }
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`OK: ${file}`);
});
