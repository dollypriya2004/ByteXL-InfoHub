import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuoteGenerator = () => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = 'https://bytexl-infohub.onrender.com';

  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_BASE_URL}/api/quote`);
      setQuote(response.data);
    } catch (err) {
      setError('Failed to fetch motivational quote. Please check if the server is running.');
      console.error('Quote fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of your component code remains the same

  if (loading) {
    return (
      <div className="module-container quotes-module">
        <div className="module-header">
          <h2>Motivational Quotes</h2>
          <button onClick={fetchQuote} className="refresh-btn">🔄</button>
        </div>
        <div className="loading">Loading your daily motivation...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="module-container quotes-module">
        <div className="module-header">
          <h2>Motivational Quotes</h2>
          <button onClick={fetchQuote} className="refresh-btn">🔄</button>
        </div>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="module-container quotes-module">
      <div className="module-header">
        <h2>Motivational Quotes</h2>
        <button onClick={fetchQuote} className="refresh-btn">🔄</button>
      </div>

      <div className="quote-card">
        <div className="quote-icon">💪</div>
        <blockquote className="quote-text">
          "{quote.text}"
        </blockquote>
        <cite className="quote-author">— {quote.author}</cite>
        
        <div className="quote-actions">
          <button onClick={fetchQuote} className="new-quote-btn">
            Get New Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteGenerator;
