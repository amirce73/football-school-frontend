const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src/pages/club');

fs.readdir(directoryPath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    
    files.forEach(function (file) {
        if (file.endsWith('.tsx')) {
            const filePath = path.join(directoryPath, file);
            let content = fs.readFileSync(filePath, 'utf8');
            
            content = content.replace(/from '\.\.\//g, "from '../../");
            content = content.replace(/from "\.\.\//g, 'from "../../');
            content = content.replace(/import '\.\.\//g, "import '../../");
            content = content.replace(/import "\.\.\//g, 'import "../../');
            
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated imports in ${file}`);
        }
    });
});
