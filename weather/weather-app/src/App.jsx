import {useState} from 'react';

function App() {
  const [city, setCity] = useState('');
  const [days, setDays] = useState(1);
  const [forecast, setForecast] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  const API_KEY = '02e215440ac04bb484771315252011';

  const getWeatherIcon = (condition) => {
    const text = condition.toLowerCase();
    if (text.includes('rain') || text.includes('drizzle')) {
      return <span className="text-5xl">🌧️</span>;
    } else if (text.includes('cloud') || text.includes('overcast')) {
      return <span className="text-5xl">☁️</span>;
    } else if (text.includes('sun') || text.includes('clear')) {
      return <span className="text-5xl">☀️</span>;
    } else if (text.includes('snow')) {
      return <span className="text-5xl">❄️</span>;
    } else if (text.includes('thunder') || text.includes('storm')) {
      return <span className="text-5xl">⛈️</span>;
    }
    return <span className="text-5xl">🌤️</span>;
  };

  const getForecast = async (cityParam = city, daysParam = days) => {
    setError('');

    const daysNum = Number(daysParam) || 1;

    if (!cityParam || !cityParam.trim()) {
      setError('Please enter a city name');
      return;
    }

    if (daysNum < 1 || daysNum > 14) {
      setError('Days must be between 1 and 14');
      return;
    }

    try {
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(cityParam)}&days=${daysNum}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('City not found');
      }

      const data = await response.json();
      setForecast(data);

      setCity(cityParam);

      setHistory(prev => {
        if (prev.includes(cityParam)) return prev;
        return [...prev, cityParam];
      });
    } catch (err) {
      setError('City not found. Please try again.');
      setForecast(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      getForecast();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8 drop-shadow-lg">
          Weather Forecast
        </h1>

        <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">
                City Name
              </label>
              <input 
                type="text"
                placeholder="Enter city name..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Days (1-14)
              </label>
              <input 
                type="number"
                min="1"
                max="14"
                value={days}
                onChange={(e) => setDays(Number(e.target.value) || 1)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={() => getForecast()}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
          >
            Get Weather Forecast
          </button>

          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {forecast && (
          <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Weather Forecast for {forecast.location.name}, {forecast.location.country}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {forecast.forecast.forecastday.map((day, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-lg font-bold text-gray-800">
                        {new Date(day.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(day.date).toLocaleDateString('en-US')}
                      </p>
                    </div>
                    {getWeatherIcon(day.day.condition.text)}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-gray-800">
                        {day.day.avgtemp_c}°C
                      </span>
                      <span className="text-sm text-gray-600">
                        {day.day.mintemp_c}° / {day.day.maxtemp_c}°
                      </span>
                    </div>

                    <p className="text-gray-700 font-medium">
                      {day.day.condition.text}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-blue-200">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-1">💧</span>
                        <span>Rain: {day.day.daily_chance_of_rain}%</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-1">💨</span>
                        <span>{day.day.maxwind_kph} km/h</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 pt-2">
                      Sunrise: {day.astro.sunrise} | Sunset: {day.astro.sunset}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Search History
            </h3>
            <div className="flex flex-wrap gap-2">
              {history.map((item, index) => (
                <button
                  key={index}
                  onClick={() => getForecast(item)}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;