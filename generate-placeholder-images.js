// This script generates placeholder SVG images for the DNA Testing Service website
// Save it as generate-placeholder-images.js and run with Node.js

const fs = require('fs');
const path = require('path');

// Function to generate a simple SVG with text
function generateSVG(text, width = 800, height = 600, bgColor = '#e2e8f0', textColor = '#4a5568') {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${bgColor}"/>
    <text x="50%" y="50%" font-family="Arial" font-size="24" text-anchor="middle" fill="${textColor}">${text}</text>
    <text x="50%" y="55%" font-family="Arial" font-size="16" text-anchor="middle" fill="${textColor}">Placeholder Image</text>
  </svg>`;
}

// Main image paths needed from your code
const requiredImages = [
  // Home page
  'paternity-testing.jpg',
  'legal-dna.jpg',
  'private-dna.jpg',
  
  // About page
  'lab-background.jpg',
  'lab-equipment.jpg',
  'lab-process.jpg',
  'lab-team.jpg',
  'doctor-1.jpg',
  'doctor-2.jpg',
  'doctor-3.jpg',
  
  // Blog images
  'blog/dna-basics.jpg',
  'blog/paternity-test.jpg',
  'blog/immigration-dna.jpg',
  'blog/dna-privacy.jpg',
  'blog/collection-methods.jpg',
  'blog/dna-myths.jpg'
];

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Create blog directory if it doesn't exist
const blogDir = path.join(imagesDir, 'blog');
if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true });
}

// Generate all the placeholder images
requiredImages.forEach(imagePath => {
  const fullPath = path.join(__dirname, 'public', 'images', imagePath.replace('.jpg', '.svg'));
  const dirPath = path.dirname(fullPath);
  
  // Ensure the directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  // Generate SVG content
  const imageName = path.basename(imagePath, '.jpg');
  const svg = generateSVG(imageName.replace(/-/g, ' '));
  
  // Write the SVG file
  fs.writeFileSync(fullPath, svg);
  console.log(`Created placeholder image: ${fullPath}`);
});

console.log('All placeholder images have been generated!');
