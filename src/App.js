import React, { useEffect, useState } from 'react';

import Header from './components/Header';

import WeatherDisplay from './components/WeatherDisplay';

import ForecastDisplay from './components/ForecastDisplay';

import useWeather from './hooks/useWeather';

import './App.css'; // Assuming you have some global CSS
 
function App() {

  const [location, setLocation] = useState('London'); // Default location

  const { weatherData, loading, error, fetchWeather } = useWeather();
 
  // --- Adobe Target / AEP Web SDK Integration ---

  useEffect(() => {

    // Ensure alloy is loaded before attempting to call it

    if (window.alloy) {

      console.log('alloy is available, sending initial event...');

      window.alloy("sendEvent", {

        "xdm": {

          "eventType": "web.webpagedetails.pageViews",

          "web": {

            "webPageDetails": {

              "pageViews": { "value": 1 },

              "name": "Homepage/WeatherApp", // A descriptive name for the page

              "URL": window.location.href,

              "siteSection": "weather-app" // Example custom classification

            }

          }

        },

        // Define decisionScopes for global areas you want to personalize

        "decisionScopes": ["global-promo-banner", "app-header-greeting"], // Example scopes

        "renderDecisions": true // Let the SDK auto-render HTML offers from Target

      })

      .then(result => {

        console.log("Adobe Target initial personalization successful:", result);

        // You can inspect result.propositions here if renderDecisions was false or for JSON offers

      })

      .catch(error => {

        console.error("Adobe Target initial personalization failed:", error);

      });

    } else {

      console.warn('Adobe Experience Platform Web SDK (alloy) not loaded yet.');

      // You might add a fallback or retry mechanism here if alloy is critical for initial load.

    }

  }, []); // Run once on component mount
 
  // --- End Adobe Target Integration ---
 
  const handleSearch = (newLocation) => {

    setLocation(newLocation);

    fetchWeather(newLocation);

  };
 
  useEffect(() => {

    fetchWeather(location);

  }, [location, fetchWeather]); // Fetch weather when location changes
 
  return (
<div className="App">

      {/* Target personalization for a global promo banner */}
<div id="global-promo-banner" className="promo-banner-default">

        {/* Default content for global promo */}
<p>Get accurate weather forecasts daily!</p>
</div>
 
      <Header onSearch={handleSearch} />
 
      {/* Target personalization for header greeting */}
<div id="app-header-greeting" className="header-greeting-default">

         {/* Default content for app header greeting */}
<h1>Welcome to The Weather App</h1>
</div>
 
      <main>

        {loading && <p>Loading weather data...</p>}

        {error && <p className="error">Error: {error}</p>}

        {weatherData && (
<>
<WeatherDisplay data={weatherData.current} location={location} />
<ForecastDisplay data={weatherData.forecast} />
</>

        )}
</main>
</div>

  );

}
 
export default App;

 
