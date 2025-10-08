const fs = require('fs');
const path = require('path');

const GALLERY_ROOT = './gallery';

if (!fs.existsSync(GALLERY_ROOT)) {
  console.error('❌ gallery/ folder not found!');
  process.exit(1);
}

const folders = fs.readdirSync(GALLERY_ROOT, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

const manifest = [];

folders.forEach(folderName => {
  const folderPath = path.join(GALLERY_ROOT, folderName);
  const files = fs.readdirSync(folderPath)
    .filter(file => /\.(jpe?g|png|gif|webp)$/i.test(file))
    .sort();

  if (files.length > 0) {
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

const manifestPath = path.join(GALLERY_ROOT, 'gallery-manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log(`✅ Generated ${manifestPath} with ${manifest.length} album(s)`);
