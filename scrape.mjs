import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const routes = [
  '/',
  '/dashboard',
  '/profile-hub',
  '/financial-hub',
  '/specialized-hub',
  '/registration',
  '/store',
  '/gallery',
  '/training-backpack',
  '/financial-timeline',
  '/verification',
  '/registration-history',
  '/personal-info',
  '/contact-info',
  '/passport-info',
  '/bank-info',
  '/sports-info',
  '/club-info',
  '/clothing-info',
  '/documents',
  '/password',
  '/attendance',
  '/talent',
  '/insurance',
  '/insurance-status',
  '/certificate',
  '/bulletin'
];

const outDir = path.join(process.cwd(), 'raw-html-version');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}
// create assets folder
const assetsDir = path.join(outDir, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir);
}

// Copy CSS from dist if exists
const distAssets = path.join(process.cwd(), 'dist', 'assets');
if (fs.existsSync(distAssets)) {
  const files = fs.readdirSync(distAssets);
  for (const file of files) {
    if (file.endsWith('.css') || file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.svg') || file.endsWith('.ttf') || file.endsWith('.woff') || file.endsWith('.woff2')) {
      fs.copyFileSync(path.join(distAssets, file), path.join(assetsDir, file));
    }
  }
}

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set viewport to a standard laptop
  await page.setViewport({ width: 1280, height: 800 });

  for (const route of routes) {
    console.log(`Scraping ${route}...`);
    try {
      await page.goto(`http://localhost:5173${route}`, { waitUntil: 'load', timeout: 60000 });
      // Wait an extra second for animations/data
      await new Promise(r => setTimeout(r, 2000));
      
      // Click buttons to trigger modals so they exist in the DOM
      if (route === '/dashboard') {
        await page.evaluate(() => {
          const btn = document.querySelector('.beautiful-modal-btn');
          if (btn) btn.click();
        });
        await new Promise(r => setTimeout(r, 500));
      } else if (route === '/profile-hub') {
        await page.evaluate(() => {
          const btn = document.querySelector('.profile-header-card button');
          if (btn) btn.click();
        });
        await new Promise(r => setTimeout(r, 500));
      }

      let html = await page.evaluate(() => {
        // Remove Vite/React dev scripts
        const scripts = document.querySelectorAll('script');
        scripts.forEach(s => s.remove());
        return document.documentElement.outerHTML;
      });
      
      // Inject the production CSS link (find the css file in assets)
      const cssFiles = fs.readdirSync(assetsDir).filter(f => f.endsWith('.css'));
      if (cssFiles.length > 0) {
        html = html.replace('</head>', `<link rel="stylesheet" href="./assets/${cssFiles[0]}"></head>`);
      }
      
      // Fix image paths
      html = html.replace(/\/src\/images\//g, './assets/images/');
      html = html.replace(/\/src\/assets\//g, './assets/');

      // Inject main.js
      html = html.replace('</body>', '<script src="./assets/main.js"></script></body>');
      
      let filename = route === '/' ? 'index' : route.replace('/', '');
      fs.writeFileSync(path.join(outDir, `${filename}.html`), '<!DOCTYPE html>\n' + html);
      console.log(`Saved ${filename}.html`);
    } catch (e) {
      console.error(`Error scraping ${route}:`, e);
    }
  }

  await browser.close();
  console.log('Scraping complete!');
})();
