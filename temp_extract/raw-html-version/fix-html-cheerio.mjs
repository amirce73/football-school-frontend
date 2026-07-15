import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

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
            const content = fs.readFileSync(filePath, 'utf8');
            const $ = cheerio.load(content);
            
            // Fix a[href]
            $('a').each((i, el) => {
                let href = $(el).attr('href');
                if (href && href.startsWith('/')) {
                    if (href === '/') {
                        $(el).attr('href', 'login.html');
                    } else {
                        let base = href.substring(1).split('?')[0]; // Remove / and any query params just in case
                        $(el).attr('href', base + '.html');
                    }
                }
            });

            // Map class selectors to destination html
            const classMapping = {
                '.school-registration-card': 'registration.html',
                '.card-store': 'store.html',
                '.card-gallery': 'gallery.html',
                '.card-backpack': 'training-backpack.html',
                '.news-card': 'bulletin.html',
                '.btn-verify-action': 'verification.html',
            };

            for (const [selector, dest] of Object.entries(classMapping)) {
                $(selector).each((i, el) => {
                    $(el).attr('onclick', `window.location.href='${dest}'`);
                    $(el).css('cursor', 'pointer');
                });
            }

            // Map element texts to destination html
            const textMapping = [
                // Dashboard stats
                { selector: '.school-stat-card', text: 'حضور در تمرین', dest: 'attendance.html' },
                { selector: '.school-stat-card', text: 'شاخص BMI', dest: 'bmi-history.html' },
                { selector: '.school-stat-card', text: 'استعدادیابی', dest: 'talent.html' },
                { selector: '.school-stat-card', text: 'اعتبار بیمه', dest: 'insurance-status.html' },
                // Dashboard action
                { selector: '.btn-mini', text: 'تکمیل اطلاعات', dest: 'profile-hub.html' },
                // ProfileHub items
                { selector: '.frame-item', text: 'اطلاعات شخصی', dest: 'personal-info.html' },
                { selector: '.frame-item', text: 'اطلاعات تماس', dest: 'contact-info.html' },
                { selector: '.frame-item', text: 'سایر (گذرنامه)', dest: 'passport-info.html' },
                { selector: '.frame-item', text: 'مشخصات ورزشی', dest: 'sports-info.html' },
                { selector: '.frame-item', text: 'اطلاعات باشگاهی', dest: 'club-info.html' },
                { selector: '.frame-item', text: 'کارت ملی', dest: 'documents.html' },
                { selector: '.frame-item', text: 'شناسنامه', dest: 'documents.html' },
                { selector: '.frame-item', text: 'مجوز ورزشی', dest: 'documents.html' },
                { selector: '.frame-item', text: 'مدارک و سایر', dest: 'documents.html' },
                { selector: '.frame-item', text: 'تغییر رمز عبور', dest: 'password.html' }
            ];

            textMapping.forEach(({ selector, text, dest }) => {
                $(selector).each((i, el) => {
                    if ($(el).text().includes(text)) {
                        $(el).attr('onclick', `window.location.href='${dest}'`);
                        $(el).css('cursor', 'pointer');
                    }
                });
            });

            // Back button
            $('.btn-back-top').each((i, el) => {
                $(el).attr('onclick', `window.history.back()`);
                $(el).css('cursor', 'pointer');
            });

            // Hide modals initially (since Puppeteer opened them)
            $('.modal-overlay').each((i, el) => {
                $(el).css('display', 'none');
                // Ensure onclick is removed so it doesn't navigate
                $(el).removeAttr('onclick');
            });

            fs.writeFileSync(filePath, $.html(), 'utf8');
            console.log(`Fixed routes in ${file}`);
        }
    });
});
