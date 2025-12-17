import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import './EquityCurve.css'

const EquityCurve = ({ equityCurve }) => {
  // Format data for chart
  const chartData = equityCurve.map(point => ({
    date: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    equity: point.equity,
    fullDate: point.date
  }))

  // Calculate initial equity for reference line
  const initialEquity = equityCurve[0]?.equity || 10000
  const currentEquity = equityCurve[equityCurve.length - 1]?.equity || initialEquity
  const profit = currentEquity - initialEquity
  const profitPercentage = ((profit / initialEquity) * 100).toFixed(1)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{data.fullDate}</p>
          <p className="tooltip-value">
            Equity: ${data.equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="equity-curve">
      <h2>Equity Curve</h2>
      <div className="equity-summary">
        <div className="summary-item">
          <span className="summary-label">Initial:</span>
          <span className="summary-value">${initialEquity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Current:</span>
          <span className="summary-value">${currentEquity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Return:</span>
          <span className={`summary-value ${profit >= 0 ? 'positive' : 'negative'}`}>
            {profit >= 0 ? '+' : ''}{profitPercentage}%
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis 
            dataKey="date" 
            stroke="#fff"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#fff' }}
          />
          <YAxis 
            stroke="#fff"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#fff' }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine 
            y={initialEquity} 
            stroke="#888" 
            strokeDasharray="5 5" 
            label={{ value: "Initial Equity", position: "insideTopRight", fill: "#888" }}
          />
          <Line 
            type="monotone" 
            dataKey="equity" 
            stroke="#4CAF50" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default EquityCurve

