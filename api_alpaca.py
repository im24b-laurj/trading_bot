import yfinance as yf
import pandas as pd

symbol = "AAPL"
df = yf.download(symbol, period="1d", interval="5m")
print(df)
print(df.tail())
previous_high = 0
previous_low = 0
current_high = 0
current_low = 0

for i in df.intertuples:
    if i.high > previous_high:
        previous_high = i
    if i.Close < previous_low:
        previous_low = i

print(previous_high, previous_low)










if __name__ == '__main__':
    x = 2

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
