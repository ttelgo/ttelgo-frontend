# Quick Start Guide

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open browser:**
   Navigate to `http://localhost:5173`

## Available Pages

- `/` - Home page
- `/about` - About us
- `/shop` - Shop eSIM plans
- `/help` - Help centre (FAQ)
- `/download` - Download app (coming soon)
- `/login` - Login page
- `/signup` - Sign up page
- `/my-esim` - My eSIM dashboard

## Features

✅ Dark mode toggle (top right in navbar)
✅ Responsive design (mobile, tablet, desktop)
✅ Form validation
✅ Smooth animations
✅ Mock data for eSIM plans and FAQs

## Build for Production

```bash
npm run build
```

## Project Structure

- `src/pages/` - All page components
- `src/components/` - Reusable components
- `src/utils/` - Utilities and mock data
- `src/types/` - TypeScript type definitions

## Notes

- All data is mocked (no backend)
- Forms show alerts/console logs on submit
- Dark mode preference is saved in localStorage
- QR codes are placeholder images

