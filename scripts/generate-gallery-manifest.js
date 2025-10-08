<script>
async function loadGalleryFromManifest() {
  try {
    const response = await fetch('../gallery/gallery-manifest.json');
    if (!response.ok) throw new Error('Failed to load gallery manifest');
    
    const sections = await response.json();
    const container = document.getElementById('gallery-container');
    container.innerHTML = '';

    for (const section of sections) {
      // Create section header
      const sectionDiv = document.createElement('div');
      sectionDiv.className = 'gallery-section';
      sectionDiv.innerHTML = `<h3>${section.title}</h3><div class="gallery" id="gallery-${section.folder}"></div>`;
      container.appendChild(sectionDiv);

      const galleryDiv = sectionDiv.querySelector('.gallery');

      // Add images
      section.images.forEach(filename => {
        const caption = filename
          .replace(/\.[^/.]+$/, "")
          .replace(/_/g, " ")
          .replace(/-/g, " ")
          .replace(/\b\w/g, l => l.toUpperCase());

        const figure = document.createElement('figure');
        figure.innerHTML = `
          <a href="../gallery/${section.folder}/${encodeURIComponent(filename)}" 
             data-lightbox="gallery-${section.folder}" 
             data-title="${caption.replace(/"/g, '&quot;')}">
            <img src="../gallery/${section.folder}/${encodeURIComponent(filename)}" 
                 alt="${caption}" 
                 loading="lazy">
          </a>
          <figcaption>${caption}</figcaption>
        `;
        galleryDiv.appendChild(figure);
      });
    }

  } catch (error) {
    console.error('Gallery manifest load error:', error);
    document.getElementById('gallery-container').innerHTML = 
      '<p style="color:red; text-align:center;">⚠️ Failed to load photo gallery.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadGalleryFromManifest);
</script>
