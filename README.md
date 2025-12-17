# Trading Bot Dashboard

A modern web dashboard for monitoring and displaying trading bot performance metrics, including profit, runtime, strategy details, and equity curves.

## Features

- 📊 **Interactive Dashboard** - View all trading bot metrics in one place
- 📈 **Equity Curve Visualization** - Interactive charts showing performance over time
- 🔄 **Multiple Bot Support** - Switch between different trading bots via dropdown
- 💰 **Performance Metrics** - Track profit, win rate, Sharpe ratio, drawdown, and more
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- 🎨 **Modern UI** - Beautiful gradient design with smooth animations

## Project Structure

```
trading_bot/
├── app.py                 # FastAPI backend server
├── requirements.txt       # Python dependencies
├── package.json          # Node.js dependencies
├── vite.config.js        # Vite configuration
├── index.html            # HTML entry point
└── src/
    ├── main.jsx          # React entry point
    ├── App.jsx           # Main App component
    ├── App.css           # App styles
    ├── index.css         # Global styles
    └── components/
        ├── Dashboard.jsx      # Main dashboard component
        ├── Dashboard.css
        ├── BotSelector.jsx    # Bot selection dropdown
        ├── BotSelector.css
        ├── BotMetrics.jsx     # Metrics display cards
        ├── BotMetrics.css
        ├── EquityCurve.jsx    # Equity curve chart
        ├── EquityCurve.css
        ├── BotInfo.jsx        # Strategy information
        └── BotInfo.css
```

## Setup Instructions

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Install Node.js Dependencies

```bash
npm install
```

### 3. Start the Backend Server

In one terminal, start the FastAPI server:

```bash
python -m uvicorn app:app --reload
```

The API will be available at `http://localhost:8000`

### 4. Start the Frontend Development Server

In another terminal, start the Vite dev server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### `GET /api/bots`
Returns a list of all available trading bots.

**Response:**
```json
[
  {
    "id": "bot1",
    "name": "Momentum Trader",
    "strategy": "momentum"
  },
  ...
]
```

### `GET /api/bots/{bot_id}`
Returns detailed information about a specific trading bot.

**Response:**
```json
{
  "id": "bot1",
  "name": "Momentum Trader",
  "strategy": "momentum",
  "strategy_explanation": "...",
  "profit": 3420.50,
  "profit_percentage": 34.2,
  "runtime_hours": 720,
  "runtime_days": 30,
  "status": "active",
  "win_rate": 62.5,
  "total_trades": 128,
  "sharpe_ratio": 1.85,
  "max_drawdown": 8.3,
  "equity_curve": [
    {
      "date": "2024-01-01",
      "equity": 10000
    },
    ...
  ]
}
```

## Dashboard Features

### Bot Selector
- Dropdown menu to switch between different trading bots
- Displays bot name and strategy type

### Metrics Display
- **Total Profit**: Current profit in dollars and percentage
- **Runtime**: How long the bot has been running (days and hours)
- **Win Rate**: Percentage of profitable trades and total trade count
- **Sharpe Ratio**: Risk-adjusted return measure
- **Max Drawdown**: Maximum peak-to-trough decline
- **Status**: Current bot status (active, paused, etc.)

### Equity Curve
- Interactive line chart showing equity over time
- Tooltips showing exact values on hover
- Summary showing initial equity, current equity, and return percentage
- Reference line showing initial equity

### Strategy Information
- Bot name and strategy type badge
- Detailed strategy explanation
- Performance overview with key statistics

## Customization

### Adding More Bots

Edit the `BOTS_DATA` dictionary in `app.py` to add more trading bots. Each bot should have:
- `id`: Unique identifier
- `name`: Display name
- `strategy`: Strategy type
- `strategy_explanation`: Detailed explanation
- `profit`: Total profit in dollars
- `profit_percentage`: Profit as percentage
- `runtime_hours` and `runtime_days`: Runtime duration
- `status`: Bot status
- `win_rate`: Win percentage
- `total_trades`: Number of trades executed
- `sharpe_ratio`: Sharpe ratio value
- `max_drawdown`: Maximum drawdown percentage
- `equity_curve`: List of equity points (generated automatically)

### Connecting to Real Data

To connect to real trading bot data, modify the endpoints in `app.py` to fetch data from your actual trading bot system instead of using the sample data.

## Technologies Used

- **Backend**: FastAPI (Python)
- **Frontend**: React 18 with Vite
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Styling**: CSS3 with modern features (gradients, backdrop-filter, etc.)

## License

MIT

