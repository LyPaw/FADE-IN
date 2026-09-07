/* ============================================
   LYPAW_ PROMPT GALLERY - App Logic
   ============================================ */

(function () {
  'use strict';

  const CREDIT = 'Creador del Prompt: @lypaw_';

  let allPrompts = [];
  let filteredPrompts = [];
  let activeStyle = null;
  let activeTheme = null;
  let searchQuery = '';

  // Modal state
  let modalImages = [];
  let modalIndex = 0;
  let modalPromptRef = null;

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
      filteredPrompts = [...allPrompts];

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

  function applyFilters() {
    const q = searchQuery.toLowerCase().trim();

    filteredPrompts = allPrompts.filter(p => {
      const matchStyle = !activeStyle || p.style === activeStyle;
      const matchTheme = !activeTheme || p.theme === activeTheme;
      const matchSearch = !q ||
        p.title.toLowerCase().includes(q) ||
        p.prompt.toLowerCase().includes(q) ||
        p.style.toLowerCase().includes(q) ||
        p.theme.toLowerCase().includes(q);
      return matchStyle && matchTheme && matchSearch;
    });

    renderGallery();
  }

  // --- Gallery ---
  function renderGallery() {
    $gallery.innerHTML = '';

    if (filteredPrompts.length === 0) {
      $galleryEmpty.style.display = 'block';
      $resultCount.textContent = '';
      return;
    }

    $galleryEmpty.style.display = 'none';

    let totalImages = 0;
    filteredPrompts.forEach(p => {
      p.images.forEach((img, idx) => {
        totalImages++;
        const item = createGalleryItem(p, img, idx);
        $gallery.appendChild(item);
      });
    });

    $resultCount.textContent = `${totalImages} obra${totalImages !== 1 ? 's' : ''} · ${filteredPrompts.length} prompt${filteredPrompts.length !== 1 ? 's' : ''}`;

    observeItems();
  }

  function createGalleryItem(prompt, img, imgIdx) {
    const item = document.createElement('div');
    item.className = 'gallery__item';
    item.dataset.promptId = prompt.id;
    item.dataset.imgIdx = imgIdx;

    item.innerHTML = `
      <img
        class="gallery__item-img"
        src="${img.src}"
        alt="${img.alt}"
        loading="lazy"
        onerror="this.parentElement.style.display='none'"
      >
      <div class="gallery__item-overlay">
        <div class="gallery__item-title">${prompt.title}</div>
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
  function openModal(prompt, imgIdx) {
    modalImages = prompt.images;
    modalIndex = imgIdx;
    modalPromptRef = prompt;

    updateModalContent(prompt);
    $modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function updateModalContent(prompt) {
    const img = modalImages[modalIndex];
    $modalImage.src = img.src;
    $modalImage.alt = img.alt;
    $modalTitle.textContent = prompt.title;
    $modalPrompt.textContent = prompt.prompt;

    $modalTags.innerHTML = `
      <span class="modal__tag">${formatLabel(prompt.style)}</span>
      <span class="modal__tag">${formatLabel(prompt.theme)}</span>
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

    // Store current prompt for copy
    $modalCopy.dataset.prompt = prompt.prompt;
  }

  function closeModal() {
    $modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function copyPrompt() {
    const prompt = $modalCopy.dataset.prompt;
    const fullText = prompt + '\n\n' + CREDIT;

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

  // Start
  init();
})();
