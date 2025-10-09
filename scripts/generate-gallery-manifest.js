// scripts/generate-gallery-manifest.js
const fs = require('fs');
const path = require('path');

const GALLERY_ROOT = './gallery';

if (!fs.existsSync(GALLERY_ROOT)) {
  console.error('❌ gallery/ folder not found!');
  process.exit(1);
}

const manifest = {};

// Get all top-level folders in /gallery (these are your categories)
const categories = fs.readdirSync(GALLERY_ROOT, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

categories.forEach(category => {
  const categoryPath = path.join(GALLERY_ROOT, category);
  const folders = fs.readdirSync(categoryPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const albums = [];

  folders.forEach(folderName => {
    const folderPath = path.join(categoryPath, folderName);
    const files = fs.readdirSync(folderPath)
      .filter(file => /\.(jpe?g|png|gif|webp)$/i.test(file))
      .sort();

    if (files.length > 0) {
      // Clean title: "August-05-2025-Field-Inspection" → "August 05 2025 Field Inspection"
      const title = folderName
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

      // Parse date for sorting (e.g., "August-05-2025")
      let date = new Date(0); // Fallback to oldest
      try {
        const parts = folderName.split('-');
        if (parts.length >= 3) {
          const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
          const month = monthNames.indexOf(parts[0]);
          const day = parseInt(parts[1], 10);
          const year = parseInt(parts[2], 10);

          if (!isNaN(year) && month !== -1 && !isNaN(day)) {
            date = new Date(year, month, day);
          }
        }
      } catch (e) {
        console.warn(`⚠️ Failed to parse date from: ${folderName}`);
      }

      albums.push({
        folder: folderName,
        title: title,
        images: files,
        date: date
      });
    }
  });

  // Sort albums by date (newest first)
  albums.sort((a, b) => b.date - a.date);
  manifest[category] = albums;
});

// Write manifest
const manifestPath = path.join(GALLERY_ROOT, 'gallery-manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log(`✅ Generated ${manifestPath} with ${Object.keys(manifest).length} categories.`);
