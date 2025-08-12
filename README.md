# GlowCosmetics — Demo E‑commerce (HTML, CSS, JS, Bootstrap)

A lightweight cosmetics store built with vanilla HTML/CSS/JS and Bootstrap 5. No build tools or frameworks needed.

## Features
- Responsive layout with Bootstrap 5
- Product catalog rendered from `js/products.js`
- Search, filter by category, and sort
- Cart with add/remove/update, persisted in `localStorage`
- Reusable navbar with cart count badge

## Run locally
Use any static server. Example with Python:

```bash
python3 -m http.server 8000 --directory /workspace
```

Then open `http://localhost:8000/index.html`. 

## Structure
- `index.html` — Landing page with hero, categories, featured products
- `products.html` — Shop with filters and sorting
- `cart.html` — Cart with quantities and totals
- `css/styles.css` — Small custom styles
- `js/products.js` — Demo product data
- `js/app.js` — Rendering and cart logic

## Notes
- Images use Unsplash and may require internet access.
- This is a demo checkout; integrate your provider (Stripe, etc.) for real payments. 

