import yfinance as yf
import pandas as pd
import time

symbol = "BTC-USD"

cash = 10_000
position = 0       # 1 = long, -1 = short, 0 = flat
qty = 1
entry_price = 0

stop_loss = 50
take_profit = 200
window = 15  # minutes

while True:
    df = yf.download(symbol, period="7d", interval="1m")
    df.index = pd.to_datetime(df.index)
    print(df.columns)
    df.columns = ['_'.join(col).strip() for col in df.columns.values]
    print(df.columns)
    # Rolling highs/lows (last 15 minutes)
    df['prev_high'] = df['High_BTC-USD'].rolling(window).max().shift(1)
    df['prev_low'] = df['Low_BTC-USD'].rolling(window).min().shift(1)

    row = df.iloc[-1]
    price = row['Close_BTC-USD']
    prev_high = row['prev_high']
    prev_low = row['prev_low']

    # --- ENTRY LOGIC ---
    if position == 0:
        if price > prev_high:
            position = -1
            entry_price = price
            print(f"ENTER SHORT @ {price}")

        elif price < prev_low:
            position = 1
            entry_price = price
            print(f"ENTER LONG @ {price}")

    # --- EXIT LOGIC ---
    if position == 1:  # LONG
        if price <= entry_price - stop_loss:
            pnl = (price - entry_price) * qty
            cash += pnl
            print(f"LONG STOP @ {price} | PnL: {pnl:.2f} | Cash: {cash:.2f}")
            position = 0

        elif price >= entry_price + take_profit:
            pnl = (price - entry_price) * qty
            cash += pnl
            print(f"LONG TP @ {price} | PnL: {pnl:.2f} | Cash: {cash:.2f}")
            position = 0

    elif position == -1:  # SHORT
        if price >= entry_price + stop_loss:
            pnl = (entry_price - price) * qty
            cash += pnl
            print(f"SHORT STOP @ {price} | PnL: {pnl:.2f} | Cash: {cash:.2f}")
            position = 0

        elif price <= entry_price - take_profit:
            pnl = (entry_price - price) * qty
            cash += pnl
            print(f"SHORT TP @ {price} | PnL: {pnl:.2f} | Cash: {cash:.2f}")
            position = 0
    print(f"Current Price: {price}")
    print(f"High/Low: {prev_high, prev_low}")
    time.sleep(10)
