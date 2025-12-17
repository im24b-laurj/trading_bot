import yfinance as yf
import pandas as pd

symbol = "AAPL"
df = yf.download(symbol, period="7d", interval="5m")
print(df.tail())










if __name__ == '__main__':
    x = 2

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
