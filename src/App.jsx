import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Dashboard from './components/Dashboard'
import './App.css'

const API_BASE_URL = 'http://localhost:8000'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Trading Bot Dashboard</h1>
      </header>
      <Dashboard apiBaseUrl={API_BASE_URL} />
    </div>
  )
}

export default App

