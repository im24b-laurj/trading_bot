import React from 'react'
import './BotSelector.css'

const BotSelector = ({ bots, selectedBotId, onBotChange }) => {
  return (
    <div className="bot-selector">
      <label htmlFor="bot-select">Select Trading Bot:</label>
      <select
        id="bot-select"
        value={selectedBotId || ''}
        onChange={(e) => onBotChange(e.target.value)}
        className="bot-select-dropdown"
      >
        {bots.map((bot) => (
          <option key={bot.id} value={bot.id}>
            {bot.name} ({bot.strategy})
          </option>
        ))}
      </select>
    </div>
  )
}

export default BotSelector

