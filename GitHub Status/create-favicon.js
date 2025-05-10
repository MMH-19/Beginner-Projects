// Simple script to generate a GitHub-themed favicon for the GitHub Status app
const fs = require('fs');
const path = require('path');

// Create a simple favicon.ico file directly
const faviconData = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <!-- Background -->
  <rect width="64" height="64" fill="#6c5ce7" rx="8" ry="8"/>
  
  <!-- GitHub-like cat silhouette -->
  <circle cx="32" cy="28" r="18" fill="white"/>
  <circle cx="20" cy="18" r="6" fill="white"/>
  <circle cx="44" cy="18" r="6" fill="white"/>
  
  <!-- Status indicator -->
  <circle cx="32" cy="53" r="8" fill="#00b894"/>
  <circle cx="32" cy="53" r="8" fill="none" stroke="white" stroke-width="2"/>
</svg>`;

// Create a data URL that can be used as favicon
console.log('Creating GitHub Status favicon.ico...');

// Simple favicon HTML output that can be used directly
const faviconHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>GitHub Status Favicon</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 20px; background: #f6f8fa; color: #24292e;">
  <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.12);">
    <h2 style="color: #6c5ce7;">GitHub Status Favicon</h2>
    <p>Use this SVG image as your favicon. Copy the code below into your HTML file:</p>
    <pre style="background: #f6f8fa; padding: 15px; border-radius: 6px; overflow: auto;">
&lt;link rel="icon" href="data:image/svg+xml,${encodeURIComponent(faviconData)}" type="image/svg+xml"&gt;
    </pre>
    <div style="margin: 20px 0;">
      <p>Preview:</p>
      <div style="border: 1px solid #e1e4e8; padding: 20px; display: inline-block; border-radius: 8px;">
        ${faviconData}
      </div>
    </div>
    <p>Alternatively, save the SVG content to a file named favicon.svg and use it in your HTML:</p>
    <pre style="background: #f6f8fa; padding: 15px; border-radius: 6px; overflow: auto;">
&lt;link rel="icon" href="favicon.svg" type="image/svg+xml"&gt;
    </pre>
  </div>
</body>
</html>
`;

// Save the HTML helper file
fs.writeFileSync(path.join(__dirname, 'favicon-helper.html'), faviconHTML);

// Also save the SVG file directly
fs.writeFileSync(path.join(__dirname, 'favicon.svg'), faviconData.trim());

console.log('Created favicon.svg and favicon-helper.html');
console.log('To use the SVG favicon, add this to your HTML <head>:');
console.log('<link rel="icon" href="favicon.svg" type="image/svg+xml">');
console.log('Or open favicon-helper.html for more options.'); 