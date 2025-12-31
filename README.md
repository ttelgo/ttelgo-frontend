# TTelGo - eSIM Services Website

A modern, fully responsive front-end website for TTelGo, an eSIM services provider. Built with React, TypeScript, Tailwind CSS, and React Router.

## Features

- ✨ Modern, clean UI design
- 📱 Fully responsive (mobile-first approach)
- 🎨 Tailwind CSS for styling
- 🔒 Form validation on login and signup
- ⚡ Fast development with Vite
- 🎯 TypeScript for type safety
- 🧩 Component-based architecture
- 🌙 Dark mode support
- 🎭 Smooth animations with Framer Motion
- 🗺️ React Router for navigation

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Framer Motion** - Animation library
- **Vite** - Build tool and dev server

## Pages

1. **Home** - Landing page with hero section, features, and CTAs
2. **About** - Company information, mission, values, and team
3. **Download App** - Coming soon page with email subscription
4. **Help Centre** - Searchable FAQ with collapsible sections
5. **My eSIM** - Dashboard showing eSIM status, QR code, and activation steps
6. **Login** - User login form with validation
7. **Sign Up** - Registration form with email, password, and optional referral code
8. **Shop Plans** - Product listing page with eSIM plans and pricing

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository or extract the project files

2. Install dependencies:
```bash
npm install
```

3. Start the development server:

**Quick Start Options:**
- **Recommended**: Run `npm run dev:open` - Starts server and automatically opens your browser
- **Alternative**: Double-click `start-dev.bat` (Windows) - Starts server and opens browser after 3 seconds
- **PowerShell**: Run `.\start-dev.ps1` - Same as batch file but with PowerShell
- **Manual**: Run `npm run dev` and manually open `http://localhost:5173` in your browser

**Localhost URL:** `http://localhost:5173`
- You can also check `LOCALHOST_URL.txt` file for quick reference

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
telgo-website/
├── src/
│   ├── components/
│   │   └── Layout/
│   │       ├── Navbar.tsx      # Navigation bar with dark mode toggle
│   │       ├── Footer.tsx      # Footer component
│   │       └── Layout.tsx      # Main layout wrapper
│   ├── pages/
│   │   ├── Home.tsx            # Landing page
│   │   ├── About.tsx           # About page
│   │   ├── DownloadApp.tsx     # Download app page
│   │   ├── HelpCentre.tsx      # Help centre with FAQ
│   │   ├── MyeSIM.tsx          # eSIM dashboard
│   │   ├── Login.tsx           # Login page
│   │   ├── SignUp.tsx          # Sign up page
│   │   └── ShopPlans.tsx       # Shop plans page
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── utils/
│   │   └── mockData.ts         # Mock data for eSIM plans and FAQs
│   ├── App.tsx                 # Root app component with router
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── index.html                  # HTML template
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.js          # Tailwind config
└── vite.config.ts              # Vite config
```

## Features in Detail

### Dark Mode
- Toggle dark mode from the navigation bar
- Preference is saved in localStorage
- Smooth transitions between light and dark themes

### Form Validation
- Real-time validation on form inputs
- Error messages displayed for invalid fields
- Email format validation
- Password strength requirements
- Password confirmation matching

### Responsive Design
- Mobile-first approach
- Breakpoints for tablet and desktop
- Optimized layouts for all screen sizes
- Touch-friendly navigation

### Animations
- Smooth page transitions
- Fade-in animations for content
- Hover effects on interactive elements
- Collapsible FAQ sections

## Customization

### Colors

The main brand color is defined in `tailwind.config.js`:

```js
colors: {
  'telgo-red': '#c71f2a',
  'telgo-dark': '#1a1a1a',
  'telgo-gray': '#f5f5f5',
}
```

### Mock Data

Mock data for eSIM plans and FAQs is located in `src/utils/mockData.ts`. Update this file to customize the plans and FAQs.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Notes

- This is a front-end only application with mock data
- No backend integration is included
- All form submissions are mocked (alerts/console logs)
- eSIM QR codes are placeholder images
- The app redirects to My eSIM page after login/signup

## Future Enhancements

- Backend API integration
- User authentication
- Real eSIM purchase flow
- Payment processing
- User account management
- Real-time data usage tracking
- Push notifications
- Multi-language support

