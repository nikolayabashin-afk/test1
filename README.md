# MedTech Systems demo website

Compact static website inspired by the structure and professional rhythm of nmtg.ru, but with rewritten demo content, different styling, generated visual elements, and no copied branding/assets.

## Files
- `index.html` — homepage
- `catalog.html` — catalog with localStorage selection basket
- `about.html` — company/process page
- `projects.html` — projects/map-style page
- `contacts.html` — demo contact/quote form
- `styles.css` — all styles
- `script.js` — navigation, animations, catalog filters, basket, form demo logic
- `data.js` — replaceable content data
- `IMAGE_SOURCES.md` — asset/source notes
- `assets/` — placeholder folders for future local images/videos

## Run locally
Open `index.html` directly in a browser. No build step is required.

## Upload to GitHub
Upload the contents of this folder to the root of your repository.

## Deploy on Vercel
Because this is a plain static site:
- Framework preset: Other / Static
- Build command: leave empty
- Output directory: leave empty or `/`

If Vercel asks for a root directory, keep the repository root unless you uploaded the site inside a subfolder.

## Replace before publishing
- Company name and contacts in `data.js`
- Product/service cards in `data.js`
- Project cards in `data.js`
- Legal information, privacy policy, cookies, real certifications, client names
- Form backend in `contacts.html` / `script.js`
