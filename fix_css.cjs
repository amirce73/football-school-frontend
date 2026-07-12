const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');

// 1. Remove .online-reg-card block around 2541-2557
css = css.replace(/\.online-reg-card\s*\{[\s\S]*?\}\s*\.online-reg-card:hover\s*\{[\s\S]*?\}/g, '');

// 2. Remove other .online-reg-card styles
css = css.replace(/\.online-reg-card h3\s*\{[\s\S]*?\}\s*\.online-reg-card p\s*\{[\s\S]*?\}/g, '');
css = css.replace(/\.online-reg-card\s*\{\s*display:\s*flex\s*!important;[\s\S]*?padding:\s*12px\s*8px\s*!important;\s*\}/g, '');
css = css.replace(/\.online-reg-card\s*\{\s*display:\s*flex\s*!important;[\s\S]*?border-radius:\s*var\(--radius-lg\);\s*\}/g, '');
css = css.replace(/\.online-reg-card \.reg-icon-circle\s*\{[\s\S]*?\}\s*\.online-reg-card h3\s*\{[\s\S]*?\}/g, '');

// 3. Remove .specialized-top-grid .stats-grid to .spec-grid
css = css.replace(/\.specialized-top-grid \.stats-grid\s*\{[\s\S]*?\}\s*\.specialized-top-grid \.stat-card\s*\{[\s\S]*?\}\s*\.specialized-top-grid \.stat-icon\s*\{[\s\S]*?\}\s*\.specialized-top-grid \.stat-label\s*\{[\s\S]*?\}\s*\.specialized-top-grid \.stat-val\s*\{[\s\S]*?\}/g, '');

// 4. Update .dashboard-top-row at ~2528
css = css.replace(/(@media\s*\(min-width:\s*1024px\)\s*\{\s*\.dashboard-top-row\s*\{[\s\S]*?grid-template-columns:\s*repeat\()4(,\s*1fr\);\s*grid-column:\s*span\s*)3(;\s*\})/, '$13$23$3');

// 5. Update .stats-grid in min-width: 1024px (around line 1967)
css = css.replace(/(\.stats-grid\s*\{\s*gap:\s*)24px(;\s*grid-template-columns:\s*repeat\()4(,\s*1fr\);\s*grid-template-rows:\s*auto;\s*height:\s*auto;\s*\})/, '$116px$25$3');

// 6. Update .stat-card padding
css = css.replace(/(\.stat-card\s*\{\s*padding:\s*)24px(;\s*border-radius:\s*var\(--radius-lg\);\s*\})/, '$116px$2');

// 7. Update .stat-icon size
css = css.replace(/(\.stat-icon\s*\{\s*width:\s*)55px(;\s*height:\s*)55px(;\s*font-size:\s*)1\.6rem(;\s*\})/, '$144px$244px$31.4rem$4');

// 8. Update .stat-label font size
css = css.replace(/(\.stat-label\s*\{\s*font-size:\s*)0\.85rem(;\s*margin-bottom:\s*4px;\s*white-space:\s*normal;\s*\})/, '$10.75rem$2');

// 9. Update .stat-val font size
css = css.replace(/(\.stat-val\s*\{\s*font-size:\s*)1\.15rem(;\s*\})/, '$11rem$2');

// 10. Update min-width: 1023px and max-width: 1120px dashboard-top-row
css = css.replace(/(\.dashboard-top-row\s*\{\s*grid-template-columns:\s*repeat\()6(,\s*1fr\)\s*!important;)/, '$15$2');
css = css.replace(/(\.club-intro-card\s*\{\s*grid-column:\s*)1 \/ 5( !important;\s*\/\*\s*Force to the right \(columns 1 to 4\)\s*\*\/\s*grid-row:\s*1 \/ 3;\s*height:\s*100%;\s*\})/, '$11 / 4$2');

// 11. Update min-width: 560px and max-width: 1024px dashboard-top-row
// Wait, for 1023-1120 we need to fix debt card span
// And for 560-1024 we already have repeat(5, 1fr) and club-intro 1/4. We just need to update debt-card for both.
// Let's manually replace the debt card in both queries if it exists. Currently, debt-card is NOT explicitly mentioned inside those media queries in index.css? Let's check.

fs.writeFileSync('src/index.css', css, 'utf8');
console.log('Done');
