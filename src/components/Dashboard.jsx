import React, { useState, useEffect } from 'react'
import axios from 'axios'
import BotSelector from './BotSelector'
import BotMetrics from './BotMetrics'
import EquityCurve from './EquityCurve'
import BotInfo from './BotInfo'
import './Dashboard.css'

const Dashboard = ({ apiBaseUrl }) => {
  const [bots, setBots] = useState([])
  const [selectedBotId, setSelectedBotId] = useState(null)
  const [botData, setBotData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Fetch list of bots
    axios.get(`${apiBaseUrl}/api/bots`)
      .then(response => {
        setBots(response.data)
        if (response.data.length > 0) {
          setSelectedBotId(response.data[0].id)
        }
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to load bots. Make sure the API server is running.')
        setLoading(false)
        console.error('Error fetching bots:', err)
      })
  }, [apiBaseUrl])

  useEffect(() => {
    if (selectedBotId) {
      // Fetch detailed bot data
      axios.get(`${apiBaseUrl}/api/bots/${selectedBotId}`)
        .then(response => {
          setBotData(response.data)
        })
        .catch(err => {
          setError('Failed to load bot data.')
          console.error('Error fetching bot data:', err)
        })
    }
  }, [selectedBotId, apiBaseUrl])

  const handleBotChange = (botId) => {
    setSelectedBotId(botId)
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading trading bots...</p>
      </div>
    )
  }

  if (error && !botData) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
        <p className="error-hint">Start the API server with: python -m uvicorn app:app --reload</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <BotSelector
          bots={bots}
          selectedBotId={selectedBotId}
          onBotChange={handleBotChange}
        />

        {botData && (
          <>
            <BotMetrics botData={botData} />
            <div className="dashboard-grid">
              <EquityCurve equityCurve={botData.equity_curve} />
              <BotInfo botData={botData} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard

