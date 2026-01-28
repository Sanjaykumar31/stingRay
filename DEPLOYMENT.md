# Vue Multi-Tool App - Setup & Deployment Guide

## Quick Start

### Prerequisites
- Node.js 16.x or higher
- npm 7.x or higher

### Installation

```bash
# 1. Navigate to project directory
cd vue-multi-tool-app

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# The app will open automatically at http://localhost:3000
```

## Project Structure Overview

```
vue-multi-tool-app/
├── public/                    # Static assets
├── src/
│   ├── assets/               # Images, styles, fonts
│   │   └── styles/
│   │       └── main.css     # Global CSS with Tailwind
│   ├── components/
│   │   ├── common/          # Shared components
│   │   │   ├── MainLayout.vue
│   │   │   ├── FeatureCard.vue
│   │   │   └── CalculatorWidget.vue
│   │   └── features/        # Feature-specific components
│   │       ├── Calculator/
│   │       ├── FormModels/
│   │       ├── DynamicFormDesigner/
│   │       ├── UnitConverter/
│   │       ├── Notes/
│   │       ├── MoneyManager/
│   │       ├── TodoList/
│   │       ├── FileConverter/
│   │       └── DocumentViewer/
│   ├── stores/              # Pinia state management
│   │   ├── useAppSettingsStore.js
│   │   ├── useCalculatorStore.js
│   │   ├── useFormModelsStore.js
│   │   ├── useFormDataStore.js
│   │   ├── useNotesStore.js
│   │   ├── useTodoStore.js
│   │   ├── useMoneyStore.js
│   │   ├── useUnitConverterStore.js
│   │   ├── useFileConverterStore.js
│   │   └── useUserStore.js
│   ├── router/              # Vue Router
│   │   └── index.js
│   ├── views/               # Page components
│   │   └── Dashboard.vue
│   ├── App.vue             # Root component
│   └── main.js             # Entry point
├── index.html              # HTML template
├── package.json            # Dependencies
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── README.md              # Documentation
```

## Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint and fix files
npm run lint

# Format code with Prettier
npm run format
```

### Development Server

The development server runs on `http://localhost:3000` by default. It features:
- Hot Module Replacement (HMR)
- Fast refresh for Vue components
- Source maps for debugging
- Auto-open browser

## Building for Production

```bash
# Create optimized production build
npm run build

# The build artifacts will be in the `dist/` directory
```

### Build Optimizations

The production build includes:
- Code splitting for optimal loading
- Minification with Terser
- CSS extraction and minification
- Asset optimization
- Tree shaking for unused code removal
- Gzip compression ready

### Build Output

```
dist/
├── assets/
│   ├── index-[hash].js      # Main bundle
│   ├── vendor-[hash].js     # Vendor libraries
│   ├── index-[hash].css     # Styles
│   └── [various chunks]     # Code-split chunks
└── index.html               # Entry HTML
```

## Deployment

### Static Hosting (Recommended)

#### Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build and deploy:
```bash
npm run build
netlify deploy --prod --dir=dist
```

#### Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel --prod
```

#### GitHub Pages

1. Add to `vite.config.js`:
```javascript
base: '/your-repo-name/'
```

2. Build and deploy:
```bash
npm run build
# Push dist folder to gh-pages branch
```

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Upload the `dist/` folder contents to your web server

3. Configure server for SPA routing (redirect all requests to index.html)

### Server Configuration

#### Nginx

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

#### Apache

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Features Implementation Status

### ✅ Completed
- Project setup and configuration
- Main layout with responsive sidebar
- Dashboard with parallax effects
- Calculator (Basic & Scientific modes)
- Calculator history
- Theme switching (Light/Dark)
- LocalStorage persistence
- All Pinia stores
- Router configuration
- Form Models infrastructure
- Feature card components

### 🚧 In Progress
- Form Designer (drag-and-drop builder)
- Unit Converter (full implementation)
- Notes feature
- Money Manager
- To-Do List
- File Converter
- Document Viewer

### 📋 Planned
- PWA support
- Offline functionality
- Export/Import all data
- Cloud sync (optional)
- More calculator modes
- Advanced analytics

## Customization

### Changing Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your primary color shades
        500: '#your-color',
      },
      accent: {
        // Your accent color shades
        500: '#your-color',
      }
    }
  }
}
```

### Adding Custom Fonts

1. Add font link to `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font&display=swap" rel="stylesheet">
```

2. Update `tailwind.config.js`:
```javascript
fontFamily: {
  display: ['"Your Font"', 'sans-serif'],
}
```

### Modifying Layout

Edit `src/components/common/MainLayout.vue` to customize:
- Sidebar width
- Header height
- Navigation items
- Color scheme

## Troubleshooting

### Common Issues

**Build fails with module not found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Hot reload not working:**
- Check if you're editing files inside `src/`
- Restart the dev server

**Dark mode not applying:**
- Clear localStorage
- Check browser console for errors
- Verify Tailwind dark mode is configured

**LocalStorage quota exceeded:**
- Clear browser data
- Implement data cleanup in stores
- Consider using IndexedDB for large datasets

### Performance Issues

If the app is slow:
1. Enable production build: `npm run build`
2. Check bundle size: Enable source map analysis
3. Lazy load heavy components
4. Implement virtual scrolling for lists
5. Optimize images and assets

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Mobile

## Security Considerations

- All data stored locally (no server transmission)
- XSS protection via Vue's template escaping
- Input validation on all forms
- CSP headers recommended for production
- Regular dependency updates

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- Check this documentation
- Review component source code
- Create an issue in the repository
- Contact the development team

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Changelog

### Version 1.0.0 (Current)
- Initial release
- Core infrastructure
- Calculator feature
- Dashboard with parallax effects
- Theme switching
- LocalStorage persistence

### Upcoming
- Complete all feature implementations
- PWA support
- Advanced data visualization
- Export/import functionality
- Performance optimizations

---

**Built with ❤️ using Vue 3, Vite, Element Plus, and Tailwind CSS**
