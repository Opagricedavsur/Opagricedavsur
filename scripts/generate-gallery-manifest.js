// scripts/generate-gallery-manifest.js
const fs = require('fs');
const path = require('path');

const GALLERY_ROOT = '../gallery';

// Ensure gallery folder exists
if (!fs.existsSync(GALLERY_ROOT)) {
  console.error('❌ gallery/ folder not found!');
  process.exit(1);
}

// Read all immediate subfolders in /gallery
const folders = fs.readdirSync(GALLERY_ROOT, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

const manifest = [];

folders.forEach(folderName => {
  const folderPath = path.join(GALLERY_ROOT, folderName);
  const files = fs.readdirSync(folderPath)
    .filter(file => /\.(jpe?g|png|gif|webp)$/i.test(file))
    .sort(); // Optional: sort alphabetically

  if (files.length > 0) {
    // Convert folder name to human-readable title
    // Example: "2025-davao-workshop" → "2025 Davao Workshop"
    const title = folderName
      .replace(/-/g, ' ')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());

    manifest.push({
      folder: folderName,
      title: title,
      images: files
    });
  }
});

// Write manifest to gallery/gallery-manifest.json
const manifestPath = path.join(GALLERY_ROOT, 'gallery-manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log(`✅ Successfully generated ${manifestPath}`);
console.log(`   Found ${manifest.length} event(s) with ${manifest.reduce((sum, sec) => sum + sec.images.length, 0)} photo(s).`);
