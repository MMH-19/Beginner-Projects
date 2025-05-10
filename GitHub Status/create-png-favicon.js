// Script to generate a PNG version of the favicon

/**
 * Note: This script requires the 'canvas' npm package
 * You can install it with: npm install canvas
 * 
 * If you don't have the canvas package installed, you can use the
 * favicon.svg file directly, or use an online converter to create 
 * a PNG version.
 */

try {
  const { createCanvas } = require('canvas');
  const fs = require('fs');
  
  // Create a canvas with the favicon dimensions
  const canvas = createCanvas(64, 64);
  const ctx = canvas.getContext('2d');
  
  console.log('Creating PNG favicon...');
  
  // Draw the GitHub-style favicon
  // Background
  ctx.fillStyle = '#6c5ce7';
  ctx.beginPath();
  ctx.roundRect(0, 0, 64, 64, 8);
  ctx.fill();
  
  // GitHub-like cat silhouette
  ctx.fillStyle = 'white';
  
  // Head circle
  ctx.beginPath();
  ctx.arc(32, 28, 18, 0, Math.PI * 2);
  ctx.fill();
  
  // Left ear
  ctx.beginPath();
  ctx.arc(20, 18, 6, 0, Math.PI * 2);
  ctx.fill();
  
  // Right ear
  ctx.beginPath();
  ctx.arc(44, 18, 6, 0, Math.PI * 2);
  ctx.fill();
  
  // Status indicator
  ctx.fillStyle = '#00b894';
  ctx.beginPath();
  ctx.arc(32, 53, 8, 0, Math.PI * 2);
  ctx.fill();
  
  // White outline for status indicator
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(32, 53, 8, 0, Math.PI * 2);
  ctx.stroke();
  
  // Save to PNG file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('favicon.png', buffer);
  
  console.log('Created favicon.png');
  console.log('To use both SVG and PNG favicon for maximum compatibility:');
  console.log('<link rel="icon" href="favicon.svg" type="image/svg+xml">');
  console.log('<link rel="alternate icon" href="favicon.png" type="image/png">');
} catch (err) {
  console.error('Error: Could not create PNG favicon.');
  console.error('This script requires the canvas package. Install with: npm install canvas');
  console.error('Alternatively, you can use the SVG favicon directly or convert it online.');
  console.error('Technical error:', err.message);
  
  // Create an alternative message file
  const message = `
To create a PNG favicon from the SVG:

1. Install required packages:
   npm install canvas

2. Run this script again:
   node create-png-favicon.js

Alternatively, you can use an online SVG to PNG converter:
1. Upload the favicon.svg file
2. Download the PNG version
3. Save it as favicon.png in your project directory

You can also use the SVG favicon directly:
<link rel="icon" href="favicon.svg" type="image/svg+xml">
`;

  fs.writeFileSync('favicon-png-instructions.txt', message);
  console.log('Created favicon-png-instructions.txt with alternative methods.');
} 