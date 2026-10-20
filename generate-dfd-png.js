const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set viewport to match our diagram dimensions
    await page.setViewport({
      width: 1400,
      height: 1200,
      deviceScaleFactor: 2
    });
    
    // Load HTML file
    const htmlPath = path.join(__dirname, 'DFD_CRDVS.html');
    await page.goto(`file://${htmlPath}`, {
      waitUntil: 'networkidle0'
    });
    
    // Get full page height
    const fullPageHeight = await page.evaluate(() => {
      return document.documentElement.scrollHeight;
    });
    
    // Set viewport to full page height
    await page.setViewport({
      width: 1400,
      height: fullPageHeight,
      deviceScaleFactor: 2
    });
    
    // Generate screenshot
    const outputPath = path.join(__dirname, 'DFD_CRDVS.png');
    await page.screenshot({
      path: outputPath,
      fullPage: true,
      type: 'png'
    });
    
    console.log(`✓ DFD PNG generated successfully: ${outputPath}`);
    console.log(`  File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('Error generating DFD PNG:', error.message);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();
