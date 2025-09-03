# 🔥 Spicy Chicken Nugs - Graston Event Dashboard

## A deliciously efficient, production-ready Graston Event Dashboard

### 🚀 Overview

This React-based dashboard provides comprehensive event intelligence for Graston training programs. Built with modern web technologies, it offers real-time enrollment tracking, interactive analytics, robust error handling, and comprehensive testing coverage.

### ✨ Features

- 📊 **Enhanced Event Dashboard** - Real-time event monitoring with analytics
- 🎯 **Interactive Analytics** - Charts and data visualization with Recharts
- 👥 **Enrollment Tracking** - Live capacity metrics and student counts
- 🛡️ **Robust Error Handling** - Global error boundaries with retry functionality
- 🧪 **Comprehensive Testing** - Full test coverage with Jest and React Testing Library
- 📱 **Responsive Design** - Modern UI with Tailwind CSS
- 🔄 **Loading States** - Smooth user experience with loading indicators
- 📤 **Export Tools** - Data export functionality
- 🔔 **Notification System** - Real-time alerts and updates

### 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Testing**: Jest, React Testing Library, @testing-library/user-event
- **Build Tool**: Vite
- **Package Manager**: npm

### 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/spicy-chicken-nugs.git
cd spicy-chicken-nugs

# Install dependencies
npm install

# Start development server
npm run dev
```

### 🚀 Scripts

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run preview       # Preview production build
npm run cleanup       # Kill ports (5173, 5175)
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate test coverage report
```

### 🏗️ Project Structure

```text
src/
├── components/
│   ├── __tests__/                    # Test files
│   │   ├── ErrorBoundary.test.jsx
│   │   ├── LoadingSpinner.test.jsx
│   │   ├── ErrorMessage.test.jsx
│   │   └── EnhancedEventDashboard.test.jsx
│   ├── EnhancedEventDashboard.jsx    # Main dashboard component
│   ├── ErrorBoundary.jsx             # Global error handling
│   ├── LoadingSpinner.jsx            # Loading states
│   ├── ErrorMessage.jsx              # Error display component
│   ├── EventAnalytics.jsx            # Analytics charts
│   ├── ExportTools.jsx               # Data export functionality
│   └── NotificationSystem.jsx        # Real-time notifications
├── main.jsx                          # Application entry point
├── setupTests.js                     # Test configuration
└── index.css                         # Global styles

config/
├── jest.config.cjs                   # Jest configuration
├── babel.config.cjs                  # Babel configuration
├── tailwind.config.js                # Tailwind CSS configuration
└── vite.config.js                    # Vite configuration

public/
└── index.html                        # HTML template
```

### 🧪 Testing

The project includes comprehensive test coverage with Jest and React Testing Library:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

#### Test Coverage
- **ErrorBoundary**: Error catching, retry functionality, UI fallbacks
- **LoadingSpinner**: Different sizes, fullscreen mode, custom messages  
- **ErrorMessage**: Error types, retry/dismiss actions, custom styling
- **EnhancedEventDashboard**: Loading states, view toggling, filtering

### 🛡️ Error Handling

The application includes robust error handling at multiple levels:

#### Global Error Boundary
- Catches JavaScript errors anywhere in the component tree
- Displays user-friendly error messages
- Provides retry functionality
- Logs errors for debugging

#### Component-Level Error Handling
- Loading states for async operations
- Error messages with contextual information
- Retry mechanisms for failed operations
- Graceful degradation for missing data

### 🎨 Styling

This project uses Tailwind CSS for styling. The design features:

- Clean, modern interface
- Color-coded status indicators
- Responsive grid layouts
- Interactive hover effects

### 🔌 API Integration

The dashboard integrates with:

- **Graston Guide Connection API** - Event data
- **LearnDash API** - Student enrollment
- **WooCommerce API** - Order data (fallback)

### 📊 Dashboard Features

#### Event Cards

Each event displays:

- Training type classification
- Enrollment metrics (current/capacity)
- Percentage capacity with color coding
- Student count and data sources
- Danger zone status

#### Capacity Status Colors

- 🟢 **Available** (< 70% capacity)
- 🟡 **Filling** (70-89% capacity)
- 🔴 **Full** (≥ 90% capacity)

### 🚀 Development

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### 📝 License

This project is licensed under the MIT License.

### 🙏 Acknowledgments

- Built for Graston training event management
- Powered by React and modern web technologies
- Named with love for spicy chicken nugs 🔥🍗

---

## Made with ❤️ and a craving for spicy chicken nugs
