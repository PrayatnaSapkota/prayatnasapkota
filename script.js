(() => {
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  const currentPage = currentFile === 'journal.html' ? 'journal' : currentFile === 'projects.html' ? 'projects' : 'home';
  document.querySelectorAll('[data-nav]').forEach((link) => {
    if (link.dataset.nav === currentPage) link.setAttribute('aria-current', 'page');
  });
  document.querySelectorAll('.menu-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const nav = document.getElementById(button.getAttribute('aria-controls'));
      const open = nav.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
      button.textContent = open ? '×' : '☰';
    });
  });
  if (currentPage !== 'journal') return;
  const cards = Array.from(document.querySelectorAll('.journal-card'));
  const search = document.getElementById('journal-search');
  const resultCount = document.getElementById('result-count');
  const resultLabel = document.getElementById('result-label');
  const emptyState = document.getElementById('empty-state');
  const pinnedCount = document.getElementById('pinned-count');
  const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
  const backTop = document.getElementById('back-top');
  let activeFilter = 'all';
  let pinned = [];
  try { pinned = JSON.parse(localStorage.getItem('journalPinnedPosts') || '[]'); } catch (_) { pinned = []; }
  function savePins() { localStorage.setItem('journalPinnedPosts', JSON.stringify(pinned)); }
  function updatePinUi() {
    pinnedCount.textContent = String(pinned.length);
    cards.forEach((card) => {
      const isPinned = pinned.includes(card.id);
      card.classList.toggle('is-pinned', isPinned);
      card.querySelector('.pin-badge').classList.toggle('is-visible', isPinned);
      const button = card.querySelector('.pin-button');
      button.textContent = isPinned ? '★ Pinned' : '☆ Pin';
      button.classList.toggle('is-selected', isPinned);
    });
  }
  function render() {
    const query = (search.value || '').trim().toLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      const matchesQuery = !query || card.textContent.toLowerCase().includes(query);
      const matchesFilter = activeFilter === 'all' || (activeFilter === 'pinned' && pinned.includes(card.id)) || activeFilter === card.dataset.kind || (activeFilter === 'video' && false);
      const show = matchesQuery && matchesFilter;
      card.hidden = !show;
      if (show) visible += 1;
    });
    resultCount.textContent = visible + (visible === 1 ? ' entry in view' : ' entries in view');
    resultLabel.textContent = activeFilter === 'all' ? 'Newest first' : 'Filtered: ' + activeFilter;
    emptyState.hidden = visible !== 0;
  }
  filterButtons.forEach((button) => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('is-active', item === button));
    render();
  }));
  search.addEventListener('input', render);
  cards.forEach((card) => {
    card.querySelector('.read-button').addEventListener('click', (event) => {
      const expanded = card.classList.toggle('is-expanded');
      event.currentTarget.textContent = expanded ? 'Show less' : 'Read more';
    });
    card.querySelector('.pin-button').addEventListener('click', () => {
      pinned = pinned.includes(card.id) ? pinned.filter((id) => id !== card.id) : [card.id, ...pinned];
      savePins(); updatePinUi(); render();
    });
    card.querySelector('.share-button').addEventListener('click', async (event) => {
      const url = window.location.href.split('#')[0] + '#' + card.id;
      try { await navigator.clipboard.writeText(url); } catch (_) { window.prompt('Copy this journal link', url); }
      event.currentTarget.textContent = '✓ Copied';
      window.setTimeout(() => { event.currentTarget.textContent = '↗ Copy link'; }, 1800);
    });
  });
  if (window.location.hash) window.setTimeout(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  window.addEventListener('scroll', () => backTop.classList.toggle('is-visible', window.scrollY > 480), { passive: true });
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  updatePinUi(); render();
})();
