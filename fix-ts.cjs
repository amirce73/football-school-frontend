const fs = require('fs');
const path = require('path');

const files = [
  'BankInfo.tsx',
  'ContactInfo.tsx',
  'PassportInfo.tsx',
  'PersonalInfo.tsx',
  'SportsInfo.tsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, 'src', 'pages', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix errors.xxx.message -> String(errors.xxx.message)
    content = content.replace(/\{errors\.([a-zA-Z0-9_]+)\.message\}/g, '{String(errors.$1.message)}');
    
    // Fix hasNationalTeamExperience -> hasNationalTeam
    if (file === 'SportsInfo.tsx') {
      content = content.replace(/hasNationalTeamExperience/g, 'hasNationalTeam');
    }
    
    fs.writeFileSync(filePath, content);
    console.log('Fixed', file);
  }
});
