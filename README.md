# Multi-Tool Productivity Suite

A comprehensive Vue 3 web application built with the Composition API, featuring multiple productivity tools including a dynamic form designer, calculator, unit converter, notes, money manager, and more.

## 🚀 Features

### Core Tools

1. **Calculator**
   - Basic arithmetic operations
   - Scientific calculator with trigonometric functions
   - Calculation history
   - Memory functions
   - Keyboard support

2. **Dynamic Form Designer**
   - Drag-and-drop form builder
   - 20+ form components
   - Property editor
   - Live preview
   - Form schema management

3. **Form Models Dashboard**
   - Manage form templates
   - View submissions
   - Export/import forms
   - Data management

4. **Unit Converter**
   - Distance, weight, temperature, volume
   - Currency conversion
   - Conversion history
   - Favorites

5. **Notes**
   - Rich text editing
   - Organization with notebooks
   - Tags and search
   - Star favorites

6. **Money Manager**
   - Expense tracking
   - Budget planning
   - Category management
   - Reports and analytics

7. **To-Do List**
   - Task management
   - Priorities and due dates
   - Lists and categories
   - Progress tracking

8. **File Converter**
   - Document conversions
   - Image format conversion
   - Batch processing
   - Progress tracking

9. **Document Viewer**
   - PDF viewing
   - Image viewing
   - Office document preview
   - Text file viewing

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **UI Library**: Element Plus
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Styling**: Tailwind CSS
- **Animations**: Animate.css
- **File Processing**: pdf-lib, xlsx, mammoth, jszip
- **Mathematics**: mathjs
- **Drag & Drop**: vuedraggable, sortablejs

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue tones (#3B82F6)
- **Accent**: Purple/Pink gradients
- **Success**: Green (#10B981)
- **Warning**: Amber (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Display Font**: Space Grotesk
- **Body Font**: DM Sans
- **Monospace**: JetBrains Mono

### Key Features

#### Parallax Effects
- Hero section with layered parallax
- Floating animated elements
- Scroll-triggered animations
- Performance-optimized with CSS transforms

#### Theme System
- Light and dark modes
- Automatic theme detection
- Persistent theme preference
- Smooth transitions

#### Responsive Design
- Mobile-first approach
- Tablet optimizations
- Desktop enhancements
- Touch-friendly interfaces

## 📁 Project Structure

```
src/
├── components/
│   ├── common/              # Shared components
│   │   ├── MainLayout.vue
│   │   ├── FeatureCard.vue
│   │   └── CalculatorWidget.vue
│   └── features/            # Feature-specific components
│       ├── Calculator/
│       ├── DynamicFormDesigner/
│       ├── UnitConverter/
│       ├── Notes/
│       ├── MoneyManager/
│       ├── TodoList/
│       ├── FileConverter/
│       └── DocumentViewer/
├── stores/                  # Pinia stores
│   ├── useAppSettingsStore.js
│   ├── useCalculatorStore.js
│   ├── useFormModelsStore.js
│   ├── useFormDataStore.js
│   ├── useNotesStore.js
│   ├── useTodoStore.js
│   ├── useMoneyStore.js
│   ├── useUnitConverterStore.js
│   ├── useFileConverterStore.js
│   └── useUserStore.js
├── router/                  # Vue Router configuration
├── composables/             # Reusable composition functions
├── utils/                   # Utility functions
├── assets/                  # Static assets
│   └── styles/
│       └── main.css        # Global styles
├── views/                   # Page components
│   └── Dashboard.vue
├── App.vue                  # Root component
└── main.js                  # Application entry point
```

## 🔑 Key Components

### Stores (Pinia)

All stores use localStorage for persistence and provide:
- CRUD operations
- Search and filtering
- Export/import capabilities
- State synchronization

### MainLayout

Provides:
- Responsive sidebar navigation
- Header with breadcrumbs
- Theme toggle
- Recent features tracking

### Dashboard

Features:
- Parallax hero section
- Animated statistics
- Feature cards grid
- Calculator widget
- Recent features list

### Calculator

Modes:
- Basic: Standard arithmetic
- Scientific: Advanced functions
- History panel with timestamps
- Copy to clipboard

## 💾 Data Persistence

All user data is stored in browser localStorage:
- Form models and submissions
- Notes and notebooks
- Tasks and lists
- Transactions and budgets
- Calculator history
- Conversion history
- User preferences

## 🎯 Performance Optimizations

- Code splitting with dynamic imports
- Lazy loading of routes
- Virtual scrolling for large lists
- Debounced input handlers
- Cached calculations
- Optimized animations with CSS transforms
- Service worker ready

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 PWA Support

The application is PWA-ready with:
- Manifest file for installability
- Service worker for offline support
- Responsive design for all devices
- Touch-optimized interfaces

## 🔒 Security

- Client-side only (no server dependencies)
- No data transmission
- localStorage encryption for sensitive data
- XSS protection
- CSRF protection

## 🚧 Development Guidelines

### Adding New Features

1. Create feature components in `src/components/features/`
2. Add Pinia store in `src/stores/`
3. Add route in `src/router/index.js`
4. Update Dashboard with feature card
5. Add navigation item to MainLayout

### Code Style

- Use Composition API with `<script setup>`
- Follow Vue 3 best practices
- Use TypeScript-like JSDoc comments
- Implement proper error handling
- Add loading states
- Include empty states

## 🎨 Customization

### Changing Theme Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: { /* your colors */ },
      accent: { /* your colors */ }
    }
  }
}
```

### Adding Custom Fonts

1. Add font link to `index.html`
2. Update `tailwind.config.js` fontFamily
3. Use in components

## 🐛 Troubleshooting

### Common Issues

**Build fails:**
- Clear `node_modules` and reinstall
- Check Node.js version (v16+)

**Dark mode not working:**
- Check localStorage for 'theme' key
- Verify Tailwind dark mode class

**Forms not saving:**
- Check localStorage quota
- Clear old data if needed

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues or questions:
- Create an issue in the repository
- Check existing documentation
- Review component source code

## 🎉 Acknowledgments

- Vue.js team for the amazing framework
- Element Plus for the UI components
- Tailwind CSS for the utility-first CSS
- All contributors and users

## 🔮 Future Enhancements

Planned features:
- Cloud synchronization
- Real-time collaboration
- Advanced analytics
- Plugin system
- Mobile apps
- AI-powered features
- Export to various formats
- Advanced data visualization

---

Built with ❤️ using Vue 3, Element Plus, and Tailwind CSS
