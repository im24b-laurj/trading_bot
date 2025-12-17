from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from typing import List
from pydantic import BaseModel
import random
import math

app = FastAPI(title="Trading Bot API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class EquityPoint(BaseModel):
    date: str
    equity: float

class TradingBot(BaseModel):
    id: str
    name: str
    strategy: str
    strategy_explanation: str
    profit: float
    profit_percentage: float
    runtime_hours: float
    runtime_days: float
    status: str
    equity_curve: List[EquityPoint]
    win_rate: float
    total_trades: int
    sharpe_ratio: float
    max_drawdown: float

# Generate sample equity curve data
def generate_equity_curve(days: int, initial_equity: float = 10000) -> List[EquityPoint]:
    equity_points = []
    current_equity = initial_equity
    start_date = datetime.now() - timedelta(days=days)
    
    for i in range(days):
        # Random walk with slight upward trend
        change = random.gauss(50, 200)  # Mean 50, std 200
        current_equity = max(initial_equity * 0.5, current_equity + change)  # Prevent going below 50% of initial
        date = start_date + timedelta(days=i)
        equity_points.append(EquityPoint(
            date=date.strftime("%Y-%m-%d"),
            equity=round(current_equity, 2)
        ))
    
    return equity_points

# Sample trading bots data
BOTS_DATA = {
    "bot1": {
        "id": "bot1",
        "name": "Momentum Trader",
        "strategy": "momentum",
        "strategy_explanation": "This bot identifies stocks with strong momentum using RSI and moving averages. It enters long positions when RSI crosses above 60 with price above 20-day MA, and exits when RSI drops below 40 or price falls below the moving average.",
        "profit": 3420.50,
        "profit_percentage": 34.2,
        "runtime_hours": 720,
        "runtime_days": 30,
        "status": "active",
        "win_rate": 62.5,
        "total_trades": 128,
        "sharpe_ratio": 1.85,
        "max_drawdown": 8.3
    },
    "bot2": {
        "id": "bot2",
        "name": "Mean Reversion Bot",
        "strategy": "mean_reversion",
        "strategy_explanation": "This bot capitalizes on price deviations from the mean. It uses Bollinger Bands to identify overbought/oversold conditions. When price touches the lower band with RSI < 30, it takes long positions, and exits when price returns to the middle band.",
        "profit": 2180.75,
        "profit_percentage": 21.8,
        "runtime_hours": 1440,
        "runtime_days": 60,
        "status": "active",
        "win_rate": 58.3,
        "total_trades": 240,
        "sharpe_ratio": 1.42,
        "max_drawdown": 12.1
    },
    "bot3": {
        "id": "bot3",
        "name": "Scalping Bot",
        "strategy": "scalping",
        "strategy_explanation": "High-frequency scalping strategy that executes quick trades on small price movements. Uses order flow analysis and level 2 data to enter and exit positions within minutes. Targets 0.1-0.5% gains per trade.",
        "profit": 1250.30,
        "profit_percentage": 12.5,
        "runtime_hours": 216,
        "runtime_days": 9,
        "status": "active",
        "win_rate": 71.2,
        "total_trades": 856,
        "sharpe_ratio": 2.15,
        "max_drawdown": 5.2
    },
    "bot4": {
        "id": "bot4",
        "name": "Trend Following Bot",
        "strategy": "trend_following",
        "strategy_explanation": "Follows the trend using multiple timeframes. Uses MACD crossovers and ADX to confirm trend strength. Enters positions in the direction of the trend and uses trailing stops to protect profits. Holds positions for days to weeks.",
        "profit": 4890.20,
        "profit_percentage": 48.9,
        "runtime_hours": 2160,
        "runtime_days": 90,
        "status": "active",
        "win_rate": 55.8,
        "total_trades": 95,
        "sharpe_ratio": 1.68,
        "max_drawdown": 15.4
    }
}

# Generate equity curves for each bot
for bot_id, bot_data in BOTS_DATA.items():
    initial_equity = 10000
    current_equity = initial_equity + bot_data["profit"]
    days = bot_data["runtime_days"]
    
    # Generate realistic equity curve
    equity_points = generate_equity_curve(int(days), initial_equity)
    # Adjust last point to match current profit
    if equity_points:
        final_profit_ratio = current_equity / initial_equity
        equity_points[-1].equity = current_equity
    
    BOTS_DATA[bot_id]["equity_curve"] = equity_points

@app.get("/")
def root():
    return {"message": "Trading Bot API"}

@app.get("/api/bots")
def get_all_bots() -> List[dict]:
    """Get list of all trading bots"""
    return [{"id": bot["id"], "name": bot["name"], "strategy": bot["strategy"]} for bot in BOTS_DATA.values()]

@app.get("/api/bots/{bot_id}")
def get_bot_details(bot_id: str) -> TradingBot:
    """Get detailed information about a specific trading bot"""
    if bot_id not in BOTS_DATA:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    bot_data = BOTS_DATA[bot_id].copy()
    return TradingBot(**bot_data)

