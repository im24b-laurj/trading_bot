import React from 'react'
import './BotMetrics.css'

const BotMetrics = ({ botData }) => {
  const formatRuntime = () => {
    if (botData.runtime_days >= 1) {
      return `${botData.runtime_days} days (${botData.runtime_hours} hours)`
    }
    return `${botData.runtime_hours} hours`
  }

  const formatProfit = () => {
    const sign = botData.profit >= 0 ? '+' : ''
    return `${sign}$${botData.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <div className="bot-metrics">
      <div className="metrics-grid">
        <div className="metric-card profit">
          <div className="metric-label">Total Profit</div>
          <div className="metric-value profit-value">
            {formatProfit()}
          </div>
          <div className="metric-percentage">
            {botData.profit_percentage >= 0 ? '+' : ''}{botData.profit_percentage.toFixed(1)}%
          </div>
        </div>

        <div className="metric-card runtime">
          <div className="metric-label">Runtime</div>
          <div className="metric-value">{formatRuntime()}</div>
        </div>

        <div className="metric-card win-rate">
          <div className="metric-label">Win Rate</div>
          <div className="metric-value">{botData.win_rate.toFixed(1)}%</div>
          <div className="metric-subtext">{botData.total_trades} total trades</div>
        </div>

        <div className="metric-card sharpe">
          <div className="metric-label">Sharpe Ratio</div>
          <div className="metric-value">{botData.sharpe_ratio.toFixed(2)}</div>
        </div>

        <div className="metric-card drawdown">
          <div className="metric-label">Max Drawdown</div>
          <div className="metric-value drawdown-value">
            {botData.max_drawdown.toFixed(1)}%
          </div>
        </div>

        <div className="metric-card status">
          <div className="metric-label">Status</div>
          <div className={`metric-value status-badge ${botData.status}`}>
            {botData.status.charAt(0).toUpperCase() + botData.status.slice(1)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BotMetrics

