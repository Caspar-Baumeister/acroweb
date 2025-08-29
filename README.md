# AcroWorld Frontend

A modern, responsive web application for the global acro yoga community. Built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui components.

## 🎯 Project Overview

AcroWorld is the central hub for the global acro yoga community, designed to help practitioners discover events, connect with teachers, and manage their acro-related activities. This frontend application provides a clean, modern interface that works seamlessly across all devices.

## ✨ Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI Components**: Built with shadcn/ui for consistent design
- **Type Safety**: Full TypeScript support
- **Testing**: Comprehensive test suite with Jest and React Testing Library
- **Accessibility**: WCAG compliant components and interactions
- **Performance**: Optimized with Next.js 15 and Turbopack

## 🎨 Design System

### Color Palette

- **Primary**: Green (#22C55E) - Represents growth, nature, and community
- **Secondary**: Blue (#3B82F6) - Trust and professionalism
- **Accent**: Green variations for highlights and CTAs
- **Dark Mode**: Full support with automatic theme switching

### Components

- **EventCard**: Multiple variants (default, compact, featured)
- **Button**: Various styles and sizes with consistent behavior
- **Input**: Form inputs with proper validation states
- **Card**: Flexible content containers
- **Badge**: Status and category indicators

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Yarn package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd acroworld_vibe_frontend
```

2. Install dependencies:

```bash
yarn install
```

3. Start the development server:

```bash
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing

### Run Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

### Test Structure

- **Unit Tests**: Component behavior and utilities
- **Integration Tests**: Component interactions
- **Accessibility Tests**: Screen reader and keyboard navigation

## 🏗️ Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── globals.css     # Global styles and CSS variables
│   ├── layout.tsx      # Root layout component
│   └── page.tsx        # Home page
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── badge.tsx
│   ├── EventCard.tsx   # Event display component
│   ├── Header.tsx      # Navigation header
│   ├── Hero.tsx        # Landing page hero section
│   ├── EventsSection.tsx # Events display section
│   └── Footer.tsx      # Site footer
├── lib/                 # Utility functions
│   └── utils.ts        # Common utilities
└── __tests__/          # Test files
```

## 🎯 Component Architecture

### Design Principles

- **Reusability**: Components are designed to be flexible and reusable
- **Responsiveness**: Mobile-first design with progressive enhancement
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Performance**: Optimized rendering and minimal re-renders

### Component Variants

- **EventCard**: `default`, `compact`, `featured`
- **Button**: `default`, `outline`, `ghost`, `destructive`
- **Badge**: `default`, `secondary`, `destructive`, `outline`

## 🎨 Styling

### Tailwind CSS

- Custom color palette with CSS variables
- Responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Utility-first approach for rapid development

### CSS Variables

```css
:root {
  --primary: 142 76% 36%; /* Green */
  --secondary: 210 40% 96%; /* Light blue */
  --accent: 142 76% 36%; /* Green */
  --background: 0 0% 100%; /* White */
  --foreground: 222.2 84% 4.9%; /* Dark text */
}
```

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 640px (default)
- **Small**: 640px - 768px (`sm:`)
- **Medium**: 768px - 1024px (`md:`)
- **Large**: 1024px - 1280px (`lg:`)
- **Extra Large**: > 1280px (`xl:`)

### Mobile-First Approach

- Base styles for mobile devices
- Progressive enhancement for larger screens
- Touch-friendly interactions and sizing

## 🚀 Performance

### Optimizations

- **Next.js 15**: Latest features and performance improvements
- **Turbopack**: Fast development builds
- **Image Optimization**: Automatic image optimization
- **Code Splitting**: Automatic route-based code splitting

### Best Practices

- Lazy loading for non-critical components
- Optimized bundle sizes
- Efficient re-rendering strategies

## 🔧 Development

### Scripts

```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint
yarn test         # Run tests
yarn test:watch   # Run tests in watch mode
```

### Code Quality

- **ESLint**: Code linting and formatting
- **TypeScript**: Type safety and IntelliSense
- **Prettier**: Code formatting (if configured)

## 🌐 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **Progressive Enhancement**: Core functionality works without JavaScript

## 📚 Documentation

- **Component API**: Each component includes TypeScript interfaces
- **Storybook**: Component documentation (if configured)
- **Code Comments**: Inline documentation for complex logic

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **shadcn/ui**: Beautiful, accessible component library
- **Tailwind CSS**: Utility-first CSS framework
- **Next.js**: React framework for production
- **AcroWorld Community**: Inspiration and feedback

---

Built with ❤️ for the acro yoga community
