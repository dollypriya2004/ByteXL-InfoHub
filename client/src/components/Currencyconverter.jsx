import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(100);
  const [conversion, setConversion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const API_BASE_URL = 'https://bytexl-infohub.onrender.com';

  useEffect(() => {
    convertCurrency();
  }, []);

  const convertCurrency = async () => {
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_BASE_URL}/api/currency?amount=${amount}`);
      setConversion(response.data);
    } catch (err) {
      setError('Failed to convert currency. Please check if the server is running.');
      console.error('Currency conversion error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || (!isNaN(value) && value >= 0)) {
      setAmount(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    convertCurrency();
  };

  return (
    <div className="module-container currency-module">  {/* ← CHANGE THIS LINE */}
      <div className="module-header">
        <h2>Currency Converter</h2>
      </div>

      <form onSubmit={handleSubmit} className="converter-form">
        <div className="input-group">
          <label htmlFor="amount">Indian Rupees (INR):</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount in INR"
            min="0"
            step="0.01"
          />
        </div>
        
        <button type="submit" disabled={loading} className="convert-btn">
          {loading ? 'Converting...' : 'Convert Currency'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {conversion && !loading && (
        <div className="conversion-results">
          <h3>Conversion Results:</h3>
          <div className="result-card">
            <div className="currency-row">
              <span className="currency-flag">🇮🇳</span>
              <span className="currency-amount">{conversion.inr} INR</span>
            </div>
            
            <div className="conversion-arrow">↓</div>
            
            <div className="currency-results">
              <div className="currency-result">
                <span className="currency-flag">🇺🇸</span>
                <span className="currency-amount">{conversion.usd} USD</span>
                <span className="exchange-rate">(1 INR = {conversion.rateUSD} USD)</span>
              </div>
              
              <div className="currency-result">
                <span className="currency-flag">🇪🇺</span>
                <span className="currency-amount">{conversion.eur} EUR</span>
                <span className="exchange-rate">(1 INR = {conversion.rateEUR} EUR)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;
