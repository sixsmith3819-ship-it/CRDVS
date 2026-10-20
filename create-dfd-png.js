#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Try using canvas library or svg2img
try {
  const svg2img = require('svg2img');
  
  const svgPath = path.join(__dirname, 'DFD_CRDVS_DETAILED.svg');
  const pngPath = path.join(__dirname, 'DFD_CRDVS_DETAILED.png');
  
  svg2img(svgPath, (error, buffer) => {
    if (error) {
      console.error('✗ svg2img error:', error);
      process.exit(1);
    }
    
    fs.writeFileSync(pngPath, buffer);
    console.log(`✓ Successfully created: ${pngPath}`);
    console.log(`  File size: ${(fs.statSync(pngPath).size / 1024).toFixed(2)} KB`);
  });
} catch (e) {
  console.error('✗ svg2img not available:', e.message);
  
  // Try sharp with SVG support
  try {
    const sharp = require('sharp');
    const svgPath = path.join(__dirname, 'DFD_CRDVS_DETAILED.svg');
    const pngPath = path.join(__dirname, 'DFD_CRDVS_DETAILED.png');
    
    const svgBuffer = fs.readFileSync(svgPath);
    
    sharp(svgBuffer, { density: 300 })
      .png()
      .toFile(pngPath)
      .then(info => {
        console.log(`✓ Successfully created: ${pngPath}`);
        console.log(`  Dimensions: ${info.width}x${info.height}`);
        console.log(`  File size: ${(info.size / 1024).toFixed(2)} KB`);
      })
      .catch(err => {
        console.error('✗ Sharp error:', err.message);
        process.exit(1);
      });
  } catch (err2) {
    console.error('✗ Neither svg2img nor sharp available');
    console.log('\nTo fix, install one of:');
    console.log('  npm install svg2img');
    console.log('  npm install sharp');
    process.exit(1);
  }
}
