import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherModule = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

 

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/weather');
      setWeather(response.data);
    } catch (err) {
      setError('Failed to fetch weather data. Please check if the server is running.');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };



  const getWeatherIcon = (condition) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('cloud')) return '☁️';
    if (conditionLower.includes('rain')) return '🌧️';
    if (conditionLower.includes('sun')) return '☀️';
    if (conditionLower.includes('clear')) return '☀️';
    return '🌤️';
  };

  if (loading) {
    return (
      <div className="module-container weather-module">
        <div className="module-header">
          <h2>Weather Information</h2>
          <button onClick={fetchWeather} className="refresh-btn">🔄</button>
        </div>
        <div className="loading">Loading weather data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="module-container weather-module">
        <div className="module-header">
          <h2>Weather Information</h2>
          <button onClick={fetchWeather} className="refresh-btn">🔄</button>
        </div>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="module-container weather-module">
      <div className="module-header">
        <h2>Weather Information</h2>
        <button onClick={fetchWeather} className="refresh-btn">🔄</button>
      </div>
      
      <div className="weather-card">
        <div className="weather-main">
          <div className="weather-icon">
            {getWeatherIcon(weather.condition)}
          </div>
          <div className="weather-temp">
            {weather.temperature}°C
          </div>
        </div>
        
        <div className="weather-details">
          <div className="weather-location">{weather.location}</div>
          <div className="weather-condition">{weather.condition}</div>
          
          <div className="weather-stats">
            <div className="stat">
              <span className="stat-label">Humidity:</span>
              <span className="stat-value">{weather.humidity}%</span>
            </div>
            <div className="stat">
              <span className="stat-label">Wind Speed:</span>
              <span className="stat-value">{weather.windSpeed} km/h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherModule;