const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

const formFiles = [
    'SportsInfo.tsx',
    'PersonalInfo.tsx',
    'ContactInfo.tsx',
    'PassportInfo.tsx',
    'BankInfo.tsx',
    'TrainingBackpack.tsx',
    'Registration.tsx'
];

formFiles.forEach(file => {
    const filePath = path.join(pagesDir, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');

    content = content.replace(/<div style=\{\{ marginTop: '(20px|30px)', marginBottom: '20px' \}\}>/g, '<div className="sticky-bottom-btn-container">');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed ${file}`);
});
