# OldTech Compact Latest Catalog

Compact version of the latest catalog with biopsy forceps table included.

## Structure
- `index.html`
- `catalog.html`
- `about.html`
- `contacts.html`
- `styles.css`
- `script.js`
- `products-data.js`
- `assets/img/...`

## Counts
- Categories: 11
- Product cards: 269
- Article / variant rows: 657
- Biopsy forceps source rows from Excel: 565
- Grouped biopsy forceps product cards: 181

## What changed
- The old hundreds of product HTML pages were replaced by one dynamic product page.
- Product URLs now look like:
  - `catalog.html?cat=category-biopsy-forceps`
  - `catalog.html?product=forceps-...`
- Real external images are used for biopsy forceps demo cards instead of SVG-only illustrations.
- SVG fallback remains if an external image fails to load.

## Important
This compact version is much easier to upload to GitHub. It is less SEO-friendly than separate HTML pages for every product, but much better for testing and early deployment.


## MRI scroll animation section

The front-page compact catalog hero card was removed and replaced with a premium scroll-driven MRI animation section.

Implementation:
- Original uploaded MP4 is kept as `assets/video/mri-original.mp4`.
- A reversed MP4 was generated as `assets/video/mri-scroll-reversed.mp4`.
- The original MP4 was not edited.
- The animation is scrubbed by scroll position.
- GSAP ScrollTrigger is loaded from CDN before `script.js`.
- A native scroll fallback is included if GSAP fails to load.
- Reduced-motion accessibility is respected.
- Video is lazy-loaded when approaching the section.


## Modern UI / basket / language update

Latest changes:
- Moved MRI scroll animation to the very top of the home page.
- Re-encoded the reversed MRI video for smoother scroll scrubbing as `assets/video/mri-scroll-smooth.mp4`.
- Kept the original uploaded MP4 and previously reversed version.
- Added GSAP ScrollTrigger pinned scroll section with native fallback.
- Added basket/cart flow with localStorage.
- Selected articles can be sent to `contacts.html?quote=1`, where the message textarea is automatically filled.
- Added RU / EN switch.
- Added English translations for UI, categories, product names, subcategories, filters and article rows.
- Added clickable quick-filter chips on category pages.
- Updated UI/UX with more modern cards, hover effects, cleaner spacing and premium top section.


## MRI hero centering fix

- MRI section is now a full-screen pinned hero.
- The animation is centered and uses `object-fit: contain` to avoid cropping.
- A blurred synchronized background video was added behind the main MRI animation.
- Main text is placed over the animation inside a translucent glass panel so it stays readable.
- Mobile sizing was adjusted to avoid screen breakage.


## New homepage animation update

- Replaced the previous MRI animation with the newly uploaded MP4.
- Generated `assets/video/new-animation-scroll-smooth.mp4` for smoother scroll scrubbing.
- Placed the animation below the main title instead of overlaying the title on top of the product.
- Removed the extra homepage block about the compact/new catalog dashboard.
- Kept the animation centered with `object-fit: contain` to avoid cropping.
- Kept the blurred background animation as a subtle visual layer.


## Forceps category scroll animation

- Added the uploaded forceps MP4 to the top of the biopsy forceps category page.
- Generated `assets/video/forceps-scroll-smooth.mp4` for smoother scroll scrubbing.
- Added a pinned GSAP ScrollTrigger section for `catalog.html?cat=category-biopsy-forceps`.
- The animation plays forward as the user scrolls down and reverses when scrolling up.
- Added blurred synchronized background layer and centered main video with `object-fit: contain`.


## Final animation fix

- Replaced the home animation with the new uploaded `mri.mp4`.
- Replaced the biopsy forceps category animation with the new uploaded `Видеопроект 1.mp4`.
- Removed the older animation video files from the ZIP to avoid broken/mismatched references.
- Rebuilt both animations as all-intra scrub-friendly MP4 files:
  - `assets/video/mri-new-scrub.mp4`
  - `assets/video/forceps-new-scrub.mp4`
- Both animation sections were enlarged significantly and now use a single main video instead of double synced video layers, to reduce conflicts and improve reliability.
- Both sections use GSAP ScrollTrigger with native fallback.


## Simplified animation stability fix

- Removed GSAP dependency for the two scroll videos.
- The animation sections now use native CSS `position: sticky` plus a small scroll-to-video controller.
- This avoids CDN / ScrollTrigger / pinning conflicts.
- Homepage uses `assets/video/mri-new-scrub.mp4`.
- Biopsy forceps category uses a cropped scrub video: `assets/video/forceps-new-cropped-scrub.mp4`.
- The cropped forceps video removes the black sidebars from the uploaded MP4.
- Old unused video files were removed from the ZIP.


## 21st.dev-inspired medical bento section

- Added a premium medical dashboard/bento section to the homepage.
- Inspiration source: 21st.dev component categories such as Features, Cards, Sections, and dashboard-style UI blocks.
- The implementation is custom HTML/CSS inside the existing static site, not copied React code.
- The section is bilingual RU/EN and adapts to the existing language switch.
- It appears after the top scroll animation and before the category catalog.
