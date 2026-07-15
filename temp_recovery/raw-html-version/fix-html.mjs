import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = __dirname;

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    
    files.forEach((file) => {
        if (file.endsWith('.html')) {
            const filePath = path.join(directoryPath, file);
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Fix href="/..." to href="....html"
            content = content.replace(/href="\/([a-zA-Z0-9-]+)"/g, 'href="$1.html"');
            // Fix href="/" to href="index.html" (or login.html based on your route)
            content = content.replace(/href="\/"/g, 'href="login.html"');

            // Add onclick to known cards in Dashboard and ProfileHub
            // Dashboard
            content = content.replace(/class="(.*?)school-registration-card(.*?)"/g, 'class="$1school-registration-card$2" onclick="window.location.href=\'registration.html\'"');
            content = content.replace(/class="(.*?)card-store(.*?)"/g, 'class="$1card-store$2" onclick="window.location.href=\'store.html\'"');
            content = content.replace(/class="(.*?)card-gallery(.*?)"/g, 'class="$1card-gallery$2" onclick="window.location.href=\'gallery.html\'"');
            content = content.replace(/class="(.*?)card-backpack(.*?)"/g, 'class="$1card-backpack$2" onclick="window.location.href=\'training-backpack.html\'"');
            content = content.replace(/class="(.*?)news-card(.*?)"/g, 'class="$1news-card$2" onclick="window.location.href=\'bulletin.html\'"');
            
            // Dashboard stats
            content = content.replace(/class="(.*?)stat-card(.*?)school-stat-card(.*?)"(.*?)>([\s\S]*?)حضور در تمرین/g, 'class="$1stat-card$2school-stat-card$3" onclick="window.location.href=\'attendance.html\'" $4>$5حضور در تمرین');
            content = content.replace(/class="(.*?)stat-card(.*?)school-stat-card(.*?)school-kpi-bmi(.*?)"/g, 'class="$1stat-card$2school-stat-card$3school-kpi-bmi$4" onclick="window.location.href=\'bmi-history.html\'"');
            content = content.replace(/class="(.*?)stat-card(.*?)school-stat-card(.*?)"(.*?)>([\s\S]*?)استعدادیابی/g, 'class="$1stat-card$2school-stat-card$3" onclick="window.location.href=\'talent.html\'" $4>$5استعدادیابی');
            content = content.replace(/class="(.*?)stat-card(.*?)school-stat-card(.*?)"(.*?)>([\s\S]*?)اعتبار بیمه/g, 'class="$1stat-card$2school-stat-card$3" onclick="window.location.href=\'insurance-status.html\'" $4>$5اعتبار بیمه');

            // Topbar back buttons
            content = content.replace(/class="(.*?)btn-back-top(.*?)"/g, 'class="$1btn-back-top$2" onclick="window.history.back()"');

            // ProfileHub edit buttons
            content = content.replace(/onclick="\(\) => navigate\('([^']+)'\)"/g, 'onclick="window.location.href=\'$1.html\'"'); // if any react code leaked
            
            // Add global back fallback
            content = content.replace(/class="(.*?)btn-mini(.*?)"(.*?)تکمیل اطلاعات/g, 'class="$1btn-mini$2" onclick="window.location.href=\'profile-hub.html\'" $3تکمیل اطلاعات');

            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Fixed routes in ${file}`);
        }
    });
});
