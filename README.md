# ⚽ Sports News & Stats Website

A comprehensive, dynamic sports news website built with vanilla HTML, CSS, and JavaScript. This project delivers real-time football scores, player statistics, news updates, weather forecasts, and currency exchange rates in a modern, dark-themed interface.

## 🚀 Features

### 1. **Home Page**
   - **Dynamic News Grid**: Categorized news sections (Politics, Sports, Entertainment) with responsive cards.
   - **Live Matches Footer**: Real-time ticker of live match scores and statuses at the bottom of the page.
   - **Hero Section**: Engaging visual introduction to the site.
   - **Wide Layout**: Optimized for desktop viewing with a spacious, immersive design.

### 2. **Players Statistics (`/pages/players.html`)**
   - **Player Cards**: Detailed cards showing player photo, name, team, position, and key stats (Matches, Goals, Assists).
   - **Advanced Details**: Displays Player Number, Age, and active Injury Status badges.
   - **Visual Cues**: Color-coded pills for active Yellow vs Red cards.
   - **Filtering**: Filter players by Position, Team, or Nationality.
   - **Search**: Real-time search by player name.

### 3. **Match Center (`/pages/matches.html`)**
   - **Live Scores**: Real-time updates on match goals and status (Live, HT, FT).
   - **Match Events**: Detailed breakdown of events like goals, cards, and substitutions.

### 4. **League Standings (`/pages/stats.html`)**
   - **Table View**: Comprehensive league table showing Rank, Team, Points, Goal Difference, and Form.
   - **Sorting**: Automatically sorted by points and goal difference.

### 5. **Utilities**
   - **🌤️ Weather Endpoint (`/pages/weather.html`)**: Checks current weather conditions to help fans plan match-day attendance.
   - **💱 Currency Exchange (`/pages/exchange.html`)**: Real-time currency converter for international fans traveling for games.

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: 
    - Custom CSS Variables for Theming (Dark Mode)
    - Flexbox & Grid for Layouts
    - Glassmorphism effects
    - FontAwesome Icons
- **APIs**:
    - **AllSportsAPI**: For Teams, Players, and Live Match data.
    - **OpenWeatherMap**: For weather data.
    - **ExchangeRate-API**: For live currency rates.
    - **NewsAPI** (Simulation): Structure in place for news integration.

## 🔧 Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AHMEDABDELMAGED22/sports-website.git
   cd sports-website
   ```

2. **Open the project**
   - Simply open `index.html` in your web browser.
   - OR use a local development server (e.g., Live Server in VS Code) for the best experience.

## 📁 Project Structure

```
sports-website/
├── index.html          # Main Home Page
├── pages/
│   ├── players.html    # Player filtering & stats
│   ├── matches.html    # Live scores & fixtures
│   ├── stats.html      # League table/standings
│   ├── weather.html    # Weather forecast
│   └── exchange.html   # Currency converter
├── styles/
│   ├── style.css       # Global styles & layout variables
│   ├── players.css     # Player card specific styles
│   ├── matches.css     # Match list styling
│   ├── weather.css     # Weather widget styling
│   └── exchange.css    # Exchange rate utility styling
├── scripts/
│   ├── main.js         # Core logic for Home page
│   ├── players.js      # Player fetching, filtering & rendering
│   ├── matches.js      # Live score polling logic
│   ├── weather.js      # Weather API integration
│   └── exchange.js     # Currency logic
└── imgs/               # Static assets & logos
```

## 🔑 API Configuration

The project uses the following APIs. Keys are currently configured in the respective JavaScript files:

- **Football Data**: `scripts/players.js`, `scripts/main.js` (AllSportsAPI)
- **Weather**: `scripts/weather.js` (OpenWeatherMap)
- **Currency**: `scripts/exchange.js` (ExchangeRate-API)

> **Note**: For production environments, ensure API keys are secured and not exposed in client-side code.

## 🎨 Design System

The website features a **"Professional Dark"** theme:
- **Primary Background**: `#111827` (Deep Blue-Grey)
- **Card Background**: `#1f2937` (Lighter Blue-Grey)
- **Accent Color**: `#00d4ff` (Cyan) and `#4CAF50` (Green)
- **Text**: White for primary headers, Light Grey (`#9ca3af`) for secondary text.

---
Developed by Ahmed Abdelmaged
