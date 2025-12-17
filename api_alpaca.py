import yfinance as yf
import pandas as pd
symbol = "AAPL"
df = yf.download(["AAPL"], period="1d", interval="5m", group_by="ticker")
df.columns = ['_'.join(col).strip() for col in df.columns.values]

previous_high = float("-inf")
previous_low = float("inf")

print(df.columns)
for index, row in df.iterrows():
    if row["AAPL_High"] > previous_high:
        previous_high = row["AAPL_High"]
    if row["AAPL_Low"] < previous_low:
        previous_low = row["AAPL_Low"]

print(previous_high, previous_low)










if __name__ == '__main__':
    x = 2

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
