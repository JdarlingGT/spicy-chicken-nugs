# 🔥 Spicy Chicken Nugs

## A deliciously efficient Graston Event Dashboard

### 🚀 Overview

This React-based dashboard provides comprehensive event intelligence for Graston training programs. Built with modern web technologies, it offers real-time enrollment tracking, training type categorization, and capacity management.

### ✨ Features

- 📊 **Event Intelligence Dashboard** - Real-time event monitoring
- 🎯 **Training Type Classification** - Automatic categorization (Essential, Advanced, Virtual, Specialty)
- 👥 **Enrollment Tracking** - Live capacity metrics and student counts
- ⚠️ **Danger Zone Status** - Event risk assessment
- 📱 **Responsive Design** - Modern UI with Tailwind CSS
- 🔄 **Multi-Source Data** - LearnDash and WooCommerce integration

### 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
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
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run cleanup  # Kill ports (5173, 5175)
```

### 🏗️ Project Structure

```text
src/
├── EventPreviewDashboard.jsx    # Main dashboard component
├── utils/
│   └── gtu-helpers.js          # Helper functions and utilities
├── main.jsx                    # Application entry point
└── index.css                   # Tailwind CSS imports

public/
└── index.html                  # HTML template
```

### 🔧 Helper Functions

The `gtu-helpers.js` module provides essential utilities:

- `normalizeTrainingType()` - Categorizes training programs
- `getEnrolledStudents()` - Fetches enrollment data
- `calculateCapacityMetrics()` - Computes capacity analytics
- `getDangerZoneStatus()` - Retrieves event risk status
- `summarizeInstruments()` - Analyzes equipment orders
- `formatEventDate()` - Formats dates for display

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

**Made with ❤️ and a craving for spicy chicken nugs**
