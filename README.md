# MedCore Engineering — premium static website demo

This is a compact static website package inspired by the structure of a medical equipment B2B reference site and by modern UI/UX design-system principles. It does not copy the reference site's text, logos, images, trademarks, or proprietary design details.

## Pages

- `index.html` — home page
- `catalog.html` — product/service catalog with filters and quote basket
- `projects.html` — project geography and case cards
- `about.html` — company profile and timeline
- `contacts.html` — contact/request form

## Main files

- `assets/css/styles.css` — all styles and responsive behavior
- `assets/js/data.js` — replaceable products, categories, projects, partners, news
- `assets/js/app.js` — navigation, scroll animations, counters, filters, basket, form prefill
- `assets/img/` — local SVG logo and visual placeholders
- `IMAGE_SOURCES.md` — source notes for visuals

## How to run locally

Open `index.html` directly in a browser.

No build step is required.

## How to upload to GitHub

1. Unzip the archive.
2. Upload the contents of the unzipped folder to a GitHub repository.
3. Make sure `index.html` is in the root of the repository.

## How to deploy on Vercel

1. Import the GitHub repository into Vercel.
2. Choose framework preset: **Other / Static**.
3. Build command: leave empty.
4. Output directory: leave empty or use `.`.
5. Deploy.

## Editing content

Most repeated content is in:

```text
assets/js/data.js
```

Edit arrays:

- `categories`
- `products`
- `projects`
- `news`
- `partners`

## Contact form limitation

The form is a frontend demo. It does not send messages yet. To make it functional, connect one of these:

- Formspree
- Netlify Forms
- Google Forms embed
- Vercel serverless function
- custom backend / CRM / Telegram bot

## Notes

- All contact details, legal details, company name, partner names, product names, and project descriptions are placeholders.
- The floating quote basket uses `localStorage`.
- Selected products are automatically inserted into the message field on `contacts.html`.
- The project is plain HTML/CSS/JS, so it is easy to host on GitHub Pages, Vercel, Netlify, or any static hosting.
