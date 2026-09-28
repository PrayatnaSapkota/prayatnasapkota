# Prayatna Sapkota — Static Personal Site

This folder is ready for GitHub Pages or any static hosting service.

## Files

- `index.html` — homepage and bio
- `journal.html` — all journal entries; edit or add entries directly here
- `projects.html` — projects and research page
- `styles.css` — shared dark theme and responsive layout
- `script.js` — mobile navigation plus journal search, filters, pinning, sharing, and back-to-top behavior
- `assets/` — supplied images and favicon

## Updating the journal

Each post is one `<article class="journal-card">` in `journal.html`. Copy an existing article, give it a new unique `id`, update its title/date/content, and set `data-kind` to `text` or `photo`. Keep the article action buttons so the search, filters, pinning, and copy-link features continue to work.

Upload all files and the `assets` folder together. The homepage file must remain named `index.html` for GitHub Pages.
