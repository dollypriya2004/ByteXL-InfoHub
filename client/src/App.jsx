import React, { useState } from 'react';
import WeatherModule from './components/WeatherModule';
import CurrencyConverter from './components/CurrencyConverter';
import QuoteGenerator from './components/QuoteGenerator.jsx';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('weather');

  const tabs = [
    { id: 'weather', label: 'Weather', icon: '☀️' },
    { id: 'currency', label: 'Currency', icon: '💱' },
    { id: 'quote', label: 'Motivation', icon: '💪' }
  ];

  return (
    <div className="app">
      <header className="app-header">
        <h1> ByteXL InfoHub</h1>
        <p>Your daily utilities in one place</p>
      </header>

      <nav className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="main-content">
        {activeTab === 'weather' && <WeatherModule />}
        {activeTab === 'currency' && <CurrencyConverter />}
        {activeTab === 'quote' && <QuoteGenerator />}
      </main>

      <footer className="app-footer">
        <p>Built for ByteXL Coding Challenge</p>
      </footer>
    </div>
  );
}

export default App;