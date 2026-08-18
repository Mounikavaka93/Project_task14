# CraveCart — Food Delivery App UI Kit

Modern, responsive food delivery UI built with **React**, **Vite**, **Tailwind CSS**, and **React Icons**.

## Features

- Home, restaurant listing/details, food details, cart, checkout, and order confirmation
- Reusable components: Navbar, SearchBar, CategoryCard, RestaurantCard, FoodCard, CartItem, OrderSummary, Footer
- Cart state with add / update quantity / remove and live totals (subtotal, delivery, tax)
- Search, category filters, and full checkout → confirmation flow
- Responsive from 320px through 1440px+

## Getting started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Scripts

| Command       | Description              |
| ------------- | ------------------------ |
| `npm run dev` | Start development server |
| `npm run build` | Production build       |
| `npm run preview` | Preview production build |

## Promo codes (checkout)

- `CRAVE50` — 50% off subtotal (max ₹150)
- `FREEDEL` — Waives delivery fee

## Project structure

```
src/
  components/   # Reusable UI
  context/      # CartProvider
  data/         # Mock restaurants & dishes
  pages/        # Route screens
```
