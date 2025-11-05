const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors());
app.use(express.json());


app.get('/api/weather', async (req, res) => {
  try {
    const { city = 'Hyderabad' } = req.query;
    const apiKey = process.env.WEATHER_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Weather API key not configured' });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&units=metric&appid=${apiKey}`
    );

    const weatherData = {
      temperature: Math.round(response.data.main.temp),
      condition: response.data.weather[0].description,
      location: response.data.name + ', IN',
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      feelsLike: Math.round(response.data.main.feels_like),
      pressure: response.data.main.pressure
    };

    res.json(weatherData);
    
  } catch (error) {
    console.error('Weather API error:', error);
    
    if (error.response?.status === 401) {
      res.status(500).json({ error: 'Invalid Weather API key' });
    } else if (error.response?.status === 404) {
      res.status(404).json({ error: 'City not found' });
    } else {
      res.status(500).json({ error: 'Failed to fetch weather data' });
    }
  }
});

app.get('/api/currency', async (req, res) => {
  try {
    const { amount = 100 } = req.query;
    const amountNum = parseFloat(amount);
    
    if (isNaN(amountNum) || amountNum < 0) {
      return res.status(400).json({ error: 'Invalid amount provided' });
    }

    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Currency API key not configured' });
    }

    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/INR`
    );

    const rates = response.data.conversion_rates;
    const conversion = {
      inr: amountNum,
      usd: (amountNum * rates.USD).toFixed(2),
      eur: (amountNum * rates.EUR).toFixed(2),
      rateUSD: rates.USD,
      rateEUR: rates.EUR,
      source: 'live-rates',
      lastUpdated: response.data.time_last_update_utc
    };

    res.json(conversion);
    
  } catch (error) {
    console.error('Currency API error:', error);
    
    // Fallback to fixed rates if API fails
    const exchangeRates = {
      usd: 0.012,
      eur: 0.011
    };
    
    const amountNum = parseFloat(req.query.amount || 100);
    const conversion = {
      inr: amountNum,
      usd: (amountNum * exchangeRates.usd).toFixed(2),
      eur: (amountNum * exchangeRates.eur).toFixed(2),
      rateUSD: exchangeRates.usd,
      rateEUR: exchangeRates.eur,
      source: 'fallback-fixed-rates'
    };
    
    res.json(conversion);
  }
});

// Quotes API endpoint - Using REAL Quotable API (No key needed)
app.get('/api/quote', async (req, res) => {
  try {
    const response = await axios.get('https://api.quotable.io/random');
    
    const quoteData = {
      text: response.data.content,
      author: response.data.author,
      tags: response.data.tags
    };

    res.json(quoteData);
    
  } catch (error) {
    console.error('Quotes API error:', error);
    
    // Fallback to mock quotes if API fails
    const mockQuotes = [
      { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
      { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
      { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
      { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
      { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" }
    ];
    
    const randomQuote = mockQuotes[Math.floor(Math.random() * mockQuotes.length)];
    res.json(randomQuote);
  }
});


app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'InfoHub API is running with REAL external APIs',
    services: {
      weather: 'OpenWeatherMap (Real)',
      currency: 'ExchangeRate-API (Real)', 
      quotes: 'Quotable API (Real)'
    },
    timestamp: new Date().toISOString()
  });
});


app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to ByteXL InfoHub Backend',
    version: '1.0.0',
    endpoints: {
      weather: '/api/weather?city=Hyderabad',
      currency: '/api/currency?amount=100',
      quotes: '/api/quote',
      health: '/api/health'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('✅ Using REAL external APIs:');
  console.log('   🌤️  Weather: OpenWeatherMap');
  console.log('   💰 Currency: ExchangeRate-API');
  console.log('   💬 Quotes: Quotable API');
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});
