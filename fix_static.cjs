const fs = require('fs');
const path = require('path');

const mapHtml = `
<div id="mapModal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.6); z-index: 1000; justify-content: center; align-items: center; padding: 15px;" onclick="closeMapModal()">
    <div class="modal-content" onclick="event.stopPropagation()" style="background: var(--surface); padding: 20px; border-radius: 12px; width: 100%; max-width: 500px; display: flex; flex-direction: column; gap: 15px; box-shadow: var(--shadow-lg);">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; font-size: 1.1rem;"><i class="fa fa-map-marker text-danger"></i> انتخاب موقعیت روی نقشه</h3>
            <button type="button" onclick="closeMapModal()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-dark);">&times;</button>
        </div>
        <div style="display: flex; gap: 8px;">
            <input type="text" id="mapSearchInput" placeholder="جستجوی شهر، خیابان (مثلا: Isfahan)" style="flex: 1; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color);" onkeydown="if(event.key === 'Enter') { searchMap(); event.preventDefault(); }">
            <button type="button" onclick="searchMap()" class="btn-app-secondary" style="padding: 0 15px; border-radius: 8px;"><i class="fa fa-search"></i></button>
        </div>
        <div style="height: 300px; width: 100%; border-radius: 10px; overflow: hidden; position: relative;">
            <div id="map" style="height: 100%; width: 100%; z-index: 1;"></div>
        </div>
        <div style="padding: 12px; background: var(--background); border-radius: 8px; border: 1px solid var(--border-color); font-size: 0.9rem; min-height: 60px; display: flex; align-items: center; justify-content: center; text-align: center;">
            <span id="mapAddressText" style="font-weight: bold;">نقشه را کلیک کنید یا نشانگر را جابجا کنید</span>
        </div>
        <div style="display: flex; gap: 10px; margin-top: 5px;">
            <button type="button" onclick="closeMapModal()" class="btn-app-secondary" style="flex: 1;">انصراف</button>
            <button type="button" onclick="confirmMapSelection()" class="btn-app-primary" style="flex: 1;">تایید موقعیت</button>
        </div>
    </div>
</div>
`;

const dir = 'raw-html-version';
const files = fs.readdirSync(dir);

for (const file of files) {
    if (!file.endsWith('.html')) continue;
    const p = path.join(dir, file);
    let content = fs.readFileSync(p, 'utf8');

    // Fix paths
    content = content.replace(/href="\/assets\//g, 'href="./assets/');
    content = content.replace(/src="\/assets\//g, 'src="./assets/');

    // Insert leaflet.js before main.js if map modal exists in this file (or just generically for files with maps)
    if (file.includes('contact-info') || file.includes('club-info')) {
        if (!content.includes('leaflet.js')) {
            content = content.replace('<script src="./assets/main.js"', '<script src="./assets/leaflet/leaflet.js"></script>\n<script src="./assets/main.js"');
        }
        if (!content.includes('id="mapModal"')) {
            content = content.replace('</body>', mapHtml + '\n</body>');
        }
    }

    fs.writeFileSync(p, content, 'utf8');
}

console.log('Fixed HTML files successfully!');
