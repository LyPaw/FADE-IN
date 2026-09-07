/* ============================================
   LYPAW_ PROMPT GALLERY - App Logic
   ============================================ */

(function () {
  'use strict';

  const CREDIT = 'Creador del Prompt: @lypaw_';

  let allPrompts = [];
  let allImages = [];
  let filteredImages = [];
  let activeStyle = null;
  let activeTheme = null;
  let searchQuery = '';

  // Modal state
  let modalImages = [];
  let modalIndex = 0;
  let modalPromptRef = null;
  let modalPromptText = '';

  // DOM refs
  const $gallery = document.getElementById('gallery');
  const $galleryEmpty = document.getElementById('galleryEmpty');
  const $resultCount = document.getElementById('resultCount');
  const $searchInput = document.getElementById('searchInput');
  const $styleFilters = document.getElementById('styleFilters');
  const $themeFilters = document.getElementById('themeFilters');
  const $modal = document.getElementById('modal');
  const $modalOverlay = document.getElementById('modalOverlay');
  const $modalClose = document.getElementById('modalClose');
  const $modalImage = document.getElementById('modalImage');
  const $modalTitle = document.getElementById('modalTitle');
  const $modalTags = document.getElementById('modalTags');
  const $modalPrompt = document.getElementById('modalPrompt');
  const $modalCopy = document.getElementById('modalCopy');
  const $modalPrev = document.getElementById('modalPrev');
  const $modalNext = document.getElementById('modalNext');
  const $modalCounter = document.getElementById('modalCounter');

  // --- Init ---
  async function init() {
    try {
      const res = await fetch('data/prompts.json');
      const data = await res.json();
      allPrompts = data.prompts;
      allImages = [];
      allPrompts.forEach(p => {
        p.images.forEach((img, idx) => {
          allImages.push({ prompt: p, image: img, imgIdx: idx });
        });
      });
      shuffle(allImages);
      filteredImages = [...allImages];

      renderFilters(data.styles, data.themes);
      renderGallery();
      setupEvents();
    } catch (err) {
      console.error('Error loading prompts:', err);
      $galleryEmpty.querySelector('p').textContent = 'Error al cargar los datos.';
      $galleryEmpty.style.display = 'block';
    }
  }

  // --- Filters ---
  function renderFilters(styles, themes) {
    $styleFilters.innerHTML = '';
    $themeFilters.innerHTML = '';

    styles.forEach(s => {
      const btn = document.createElement('button');
      btn.className = 'filter-chip';
      btn.textContent = formatLabel(s);
      btn.dataset.value = s;
      btn.addEventListener('click', () => toggleFilter('style', s, btn));
      $styleFilters.appendChild(btn);
    });

    themes.forEach(t => {
      const btn = document.createElement('button');
      btn.className = 'filter-chip';
      btn.textContent = formatLabel(t);
      btn.dataset.value = t;
      btn.addEventListener('click', () => toggleFilter('theme', t, btn));
      $themeFilters.appendChild(btn);
    });
  }

  function toggleFilter(type, value, btn) {
    if (type === 'style') {
      if (activeStyle === value) {
        activeStyle = null;
        btn.classList.remove('active');
      } else {
        $styleFilters.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        activeStyle = value;
        btn.classList.add('active');
      }
    } else {
      if (activeTheme === value) {
        activeTheme = null;
        btn.classList.remove('active');
      } else {
        $themeFilters.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        activeTheme = value;
        btn.classList.add('active');
      }
    }
    applyFilters();
  }

  function imageTheme(prompt, image) {
    return image.theme || prompt.theme;
  }

  function applyFilters() {
    const q = searchQuery.toLowerCase().trim();

    filteredImages = allImages.filter(({ prompt, image }) => {
      const matchStyle = !activeStyle || prompt.style === activeStyle;
      const matchTheme = !activeTheme || imageTheme(prompt, image) === activeTheme;
      if (!matchStyle || !matchTheme) return false;

      if (!q) return true;

      const titleText = (prompt.title || '').toLowerCase();
      const promptText = (prompt.prompt || '').toLowerCase();
      const styleText = (prompt.style || '').toLowerCase();
      const themeText = (prompt.theme || '').toLowerCase();
      const imageThemeText = (image.theme || '').toLowerCase();
      const altText = (image.alt || '').toLowerCase();
      const tagsText = (image.tags || []).join(' ').toLowerCase();

      return (
        titleText.includes(q) ||
        promptText.includes(q) ||
        styleText.includes(q) ||
        themeText.includes(q) ||
        imageThemeText.includes(q) ||
        altText.includes(q) ||
        tagsText.includes(q)
      );
    });

    renderGallery();
  }

  // --- Gallery ---
  function renderGallery() {
    $gallery.innerHTML = '';

    if (filteredImages.length === 0) {
      $galleryEmpty.style.display = 'block';
      $resultCount.textContent = '';
      return;
    }

    $galleryEmpty.style.display = 'none';

    const totalImages = filteredImages.length;
    const totalPrompts = new Set(filteredImages.map(x => x.prompt.id)).size;

    filteredImages.forEach(item => {
      const el = createGalleryItem(item.prompt, item.image, item.imgIdx);
      $gallery.appendChild(el);
    });

    $resultCount.textContent = `${totalImages} obra${totalImages !== 1 ? 's' : ''} · ${totalPrompts} prompt${totalPrompts !== 1 ? 's' : ''}`;

    observeItems();
  }

  function createGalleryItem(prompt, img, imgIdx) {
    const item = document.createElement('div');
    item.className = 'gallery__item';
    item.dataset.promptId = prompt.id;
    item.dataset.imgIdx = imgIdx;

    const titleHtml = prompt.title
      ? `<div class="gallery__item-title">${prompt.title}</div>`
      : '';

    item.innerHTML = `
      <img
        class="gallery__item-img"
        src="${img.src}"
        alt="${img.alt}"
        loading="lazy"
        onerror="this.parentElement.style.display='none'"
      >
      <div class="gallery__item-overlay">
        ${titleHtml}
        <div class="gallery__item-style">${formatLabel(prompt.style)}</div>
      </div>
    `;

    item.addEventListener('click', () => openModal(prompt, imgIdx));
    return item;
  }

  // --- Scroll Animation ---
  function observeItems() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 60);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.gallery__item').forEach(item => {
      observer.observe(item);
    });
  }

  // --- Modal ---
  async function openModal(prompt, imgIdx) {
    modalImages = prompt.images;
    modalIndex = imgIdx;
    modalPromptRef = prompt;

    await loadPromptContent(prompt);
    updateModalContent(prompt);
    $modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  async function loadPromptContent(prompt) {
    if (prompt.promptFile) {
      try {
        const res = await fetch(prompt.promptFile);
        if (!res.ok) throw new Error();
        modalPromptText = await res.text();
      } catch {
        modalPromptText = prompt.prompt || '';
      }
    } else {
      modalPromptText = prompt.prompt || '';
    }
  }

  function updateModalContent(prompt) {
    const img = modalImages[modalIndex];
    $modalImage.src = img.src;
    $modalImage.alt = img.alt;
    $modalTitle.textContent = prompt.title || formatLabel(prompt.style);

    $modalTags.innerHTML = `
      <span class="modal__tag">${formatLabel(prompt.style)}</span>
      <span class="modal__tag">${formatLabel(imageTheme(prompt, img))}</span>
    `;

    $modalCounter.textContent = `${modalIndex + 1} / ${modalImages.length}`;

    $modalPrev.style.display = modalImages.length > 1 ? 'flex' : 'none';
    $modalNext.style.display = modalImages.length > 1 ? 'flex' : 'none';

    $modalCopy.classList.remove('copied');
    $modalCopy.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
      </svg>
      Copiar Prompt
    `;
  }

  function closeModal() {
    $modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function copyPrompt() {
    const promptText = modalPromptText;
    const fullText = promptText ? promptText + '\n\n' + CREDIT : CREDIT;

    navigator.clipboard.writeText(fullText).then(() => {
      $modalCopy.classList.add('copied');
      $modalCopy.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        ¡Copiado!
      `;
      setTimeout(() => {
        $modalCopy.classList.remove('copied');
        $modalCopy.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg>
          Copiar Prompt
        `;
      }, 2000);
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = fullText;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);

      $modalCopy.classList.add('copied');
      $modalCopy.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        ¡Copiado!
      `;
      setTimeout(() => {
        $modalCopy.classList.remove('copied');
        $modalCopy.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg>
          Copiar Prompt
        `;
      }, 2000);
    });
  }

  function navigateModal(dir) {
    modalIndex = (modalIndex + dir + modalImages.length) % modalImages.length;
    if (modalPromptRef) updateModalContent(modalPromptRef);
  }

  // --- Events ---
  function setupEvents() {
    let debounceTimer;
    $searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        searchQuery = e.target.value;
        applyFilters();
      }, 200);
    });

    $modalOverlay.addEventListener('click', closeModal);
    $modalClose.addEventListener('click', closeModal);
    $modalCopy.addEventListener('click', copyPrompt);
    $modalPrev.addEventListener('click', () => navigateModal(-1));
    $modalNext.addEventListener('click', () => navigateModal(1));

    document.addEventListener('keydown', (e) => {
      if (!$modal.classList.contains('open')) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') navigateModal(-1);
      if (e.key === 'ArrowRight') navigateModal(1);
    });
  }

  // --- Utils ---
  function formatLabel(str) {
    return str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  // Start
  init();
})();
