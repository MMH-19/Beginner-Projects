// This script demonstrates how to generate a favicon PNG programmatically if needed.
// It uses the Canvas API to draw a simple hourglass icon and can be run in a browser console.

function generateFaviconPNG() {
  // Create a canvas element
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');

  // Draw background circle
  ctx.beginPath();
  ctx.arc(16, 16, 15, 0, Math.PI * 2);
  ctx.fillStyle = '#4361ee';
  ctx.fill();

  // Draw hourglass
  ctx.fillStyle = 'white';
  // Top half
  ctx.beginPath();
  ctx.moveTo(8, 8);
  ctx.lineTo(24, 8);
  ctx.lineTo(20, 16);
  ctx.lineTo(12, 16);
  ctx.closePath();
  ctx.fill();
  
  // Bottom half
  ctx.beginPath();
  ctx.moveTo(8, 24);
  ctx.lineTo(24, 24);
  ctx.lineTo(20, 16);
  ctx.lineTo(12, 16);
  ctx.closePath();
  ctx.fill();
  
  // Draw sand
  ctx.fillStyle = '#f72585';
  // Sand in bottom
  ctx.beginPath();
  ctx.moveTo(11, 18);
  ctx.lineTo(21, 18);
  ctx.lineTo(22, 23);
  ctx.lineTo(10, 23);
  ctx.closePath();
  ctx.fill();

  // Convert to data URL
  return canvas.toDataURL('image/png');
}

// To use this function, you would call it and set the favicon:
/*
const faviconURL = generateFaviconPNG();
const link = document.createElement('link');
link.type = 'image/png';
link.rel = 'icon';
link.href = faviconURL;
document.head.appendChild(link);
*/

// Alternatively, save the output as a .png file 