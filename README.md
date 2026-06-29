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


## Medical procurement UX update

- Removed the previous 21st.dev-style medical bento/dashboard section from the homepage.
- Replaced it with a clearer procurement workflow section:
  1. choose direction
  2. select article numbers
  3. build the basket
  4. send quote request
- Added a medical B2B trust section covering documents, configuration check, delivery coordination, and service support.
- Added an FAQ section for quote requests, article lists, alternatives, documents, and mixed equipment/consumables.
- Upgraded category cards with stronger visual hierarchy, product/article counts, and clearer “open section” CTA.
- Improved basket drawer:
  - grouped selected items by category
  - shows article, note, quantity
  - added “Copy request” action
  - improved generated request text with category and document checklist.


## Personal data consent update

- Added `personal-data.html`.
- Added a required checkbox to the contact/request form.
- The submit button is disabled until the user confirms consent.
- Added client-side validation with a toast message if consent is missing.
- Added a personal data notice block on the contacts page.
- Added a footer link to the personal data consent page.
- Added bilingual RU/EN consent text in `script.js`.

Important: the consent text contains placeholder operator details. Before publication, replace:
- legal entity name
- legal address
- OGRN
- INN
- contact email
- storage period / internal processing details
with the real company information and have the text checked by a lawyer if this will be used commercially.
