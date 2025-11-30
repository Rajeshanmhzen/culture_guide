# Cultural Guide Frontend

React application built with Vite for exploring cultural heritage locations with modern UI/UX and state management.

## 🚀 Features

- Responsive React application
- Redux Toolkit for state management
- React Router for navigation
- User authentication flow
- Location browsing and search
- Admin panel for location management
- User profile management

## 📁 Project Structure

```
frontend/
├── public/           # Static assets
├── src/
│   ├── assets/       # Images and icons
│   ├── components/   # Reusable components
│   ├── pages/        # Page components
│   ├── route/        # Route configuration
│   ├── store/        # Redux store and slices
│   ├── utils/        # Helper functions
│   ├── App.jsx       # Main app component
│   └── main.jsx      # Entry point
├── package.json
└── vite.config.js
```

## 🛠️ Installation

```bash
cd frontend
npm install
```

## ⚙️ Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_MAIN_BACKEND_URL=http://localhost:8081
```

## 🚀 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🧩 Components

### Core Components
- `Header.jsx` - Navigation and user menu
- `Footer.jsx` - Site footer
- `SearchBar.jsx` - Location search functionality
- `LocationList.jsx` - Display location cards

### Pages
- `Home.jsx` - Landing page
- `Login.jsx` - User authentication
- `register.jsx` - User registration
- `AllLocations.jsx` - Browse all locations
- `LocationDetail.jsx` - Individual location view
- `About.jsx` - About page

### Profile Pages
- `profile.jsx` - User profile management
- `AddLocation.jsx` - Add new locations
- `ChangePassword.jsx` - Password update

### Admin Pages
- `Location.jsx` - Admin location management
- `UpdateLocation.jsx` - Edit existing locations

## 🗂️ State Management

Redux Toolkit slices:
- `userSlice.js` - User authentication state
- `locationSlice.js` - Location data management
- `store.js` - Store configuration

## 🛣️ Routing

React Router configuration in `route/index.jsx`:
- Public routes (Home, Login, Register)
- Protected routes (Profile, Add Location)
- Admin routes (Location Management)

## 🎨 Styling

- CSS modules for component styling
- Responsive design principles
- Modern UI/UX patterns

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build
```

## 📱 Features Overview

### User Features
- Browse cultural heritage locations
- Search and filter locations
- View detailed location information
- User registration and authentication
- Profile management

### Admin Features
- Add new heritage locations
- Update existing locations
- Manage location images
- User management

## 🌐 API Integration

The frontend communicates with the backend API for:
- User authentication
- Location data fetching
- Image uploads
- Search functionality

Base API URL configured in `utils/constant.js`

## 🔨 Build Configuration

Vite configuration includes:
- React plugin
- Development server settings
- Build optimization
- Asset handling