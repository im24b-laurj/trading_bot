import yfinance as yf
import pandas as pd
import time
from flask import Flask, jsonify, render_template
from threading import Thread

app = Flask(__name__)

# Shared state
trades = []
price_current = 0
prev_high_current = 0
prev_low_current = 0
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/trades")
def get_trades():
    return jsonify(trades)

@app.route("/high_low")
def get_high_low():
    return jsonify({
        "high": prev_high_current,
        "low": prev_low_current
    })

@app.route("/current_price")
def get_current_price():
    return jsonify(price_current)

def trading_bot():
    global price_current, trades, prev_high_current, prev_low_current

    # Choose market symbol:
    # - "BTC-USD" (Bitcoin, trades 24/7 and moves a lot)
    # - "ETH-USD" (Ethereum)
    # - "NQ=F" (Nasdaq 100 futures, only when market is open)
    symbol = "BTC-USD"
    cash = 10_000.0
    position = 0
    qty = 1
    entry_price = 0.0

    stop_loss = 30
    take_profit = 60
    window = 2

    while True:
        try:
            df = yf.download(symbol, period="1d", interval="1m", progress=False, auto_adjust=False)
            if df is None or df.empty:
                time.sleep(10)
                continue

            df.index = pd.to_datetime(df.index)

            # Work with both simple columns ("High") and MultiIndex columns ("High_<SYMBOL>")
            if isinstance(df.columns, pd.MultiIndex):
                df.columns = ['_'.join(col).strip() for col in df.columns.values]

            high_col = f"High_{symbol}" if f"High_{symbol}" in df.columns else "High"
            low_col = f"Low_{symbol}" if f"Low_{symbol}" in df.columns else "Low"
            close_col = f"Close_{symbol}" if f"Close_{symbol}" in df.columns else "Close"

            df["prev_high"] = df[high_col].rolling(window).max().shift(1)
            df["prev_low"] = df[low_col].rolling(window).min().shift(1)


            row = df.iloc[-1]
            candle_time = row.name
            price = float(row[close_col])
            price_current = price
            prev_high = row["prev_high"]
            prev_low = row["prev_low"]
            prev_high_current = prev_high if pd.notna(prev_high) else prev_high_current
            prev_low_current = prev_low if pd.notna(prev_low) else prev_low_current

            # Entry: break of previous rolling high/low (inclusive)
            if position == 0 and pd.notna(prev_high) and pd.notna(prev_low):
                if price >= prev_high:
                    position = -1
                    entry_price = price
                    trades.append({
                        "time": candle_time.strftime("%H:%M:%S"),
                        "entry_price": price,
                        "exit_price": None,
                        "side": "SHORT",
                        "pnl": None
                    })
                elif price <= prev_low:
                    position = 1
                    entry_price = price
                    trades.append({
                        "time": candle_time.strftime("%H:%M:%S"),
                        "entry_price": price,
                        "exit_price": None,
                        "side": "LONG",
                        "pnl": None
                    })

            # Exit
            if position != 0:
                pnl = 0
                exit_trade = False
                if position == 1:
                    if price <= entry_price - stop_loss or price >= entry_price + take_profit:
                        pnl = (price - entry_price) * qty
                        cash += pnl
                        exit_trade = True
                elif position == -1:
                    if price >= entry_price + stop_loss or price <= entry_price - take_profit:
                        pnl = (entry_price - price) * qty
                        cash += pnl
                        exit_trade = True

                if exit_trade:
                    trades[-1]["exit_price"] = price
                    trades[-1]["pnl"] = round(pnl, 2)
                    position = 0

            time.sleep(10)

        except Exception as e:
            print("Bot error:", e)
            time.sleep(10)

if __name__ == "__main__":
    Thread(target=trading_bot, daemon=True).start()
    app.run(port=5000, debug=True, use_reloader=False)
