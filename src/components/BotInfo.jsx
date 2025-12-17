import React from 'react'
import './BotInfo.css'

const BotInfo = ({ botData }) => {
  return (
    <div className="bot-info">
      <h2>Strategy Information</h2>
      <div className="info-card">
        <div className="info-section">
          <h3>{botData.name}</h3>
          <div className="strategy-badge">{botData.strategy.replace('_', ' ').toUpperCase()}</div>
        </div>
        
        <div className="info-section">
          <h4>Strategy Explanation</h4>
          <p className="strategy-explanation">{botData.strategy_explanation}</p>
        </div>

        <div className="info-section">
          <h4>Performance Overview</h4>
          <div className="performance-details">
            <div className="detail-item">
              <span className="detail-label">Strategy Type:</span>
              <span className="detail-value">{botData.strategy.replace('_', ' ')}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Total Trades:</span>
              <span className="detail-value">{botData.total_trades}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Win Rate:</span>
              <span className="detail-value">{botData.win_rate.toFixed(1)}%</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Risk-Adjusted Return (Sharpe):</span>
              <span className="detail-value">{botData.sharpe_ratio.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BotInfo

