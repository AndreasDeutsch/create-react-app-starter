import React, { useState, useEffect } from 'react';
import { Slider } from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';
import './App.css';


function App() {

  const [data, setData] = useState({});
  const [ratings, setRatings] = useState([]); 

  const updateRange = (newValue, index) => {
    const updatedRatings = [...ratings];
    updatedRatings[index] = newValue;
    setRatings(updatedRatings);
  };

  useEffect(() => {
    fetch('/api/send_score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ scores: ratings, userid: "123" }),
    }).then((response) => {
      if (response.ok) {
        console.log('Scores sent successfully');
      } else {
        console.error('Failed to send scores');
      }
    });
  }, [ratings]);

  useEffect(() => {
    fetch('/api/teams')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setRatings(new Array(data.teams.length).fill(50));
      });
  }, []);

  return (
    <div className="container">
      <header>Performance Rating</header>

      {typeof data.teams === 'undefined' ? (
        <p className="loading-text">Loading...</p>
      ) : (
        data.teams.map((team, index) => (
          <div key={index}>
            <p className="performance-text">
              Rate the performance of <b>{team}</b> from 0 to 100
            </p>
            <div className="slider-container">
              <p className="slider-label">Performance Score: {ratings[index]}</p>
              <Slider
                value={ratings[index]}
                onChange={(e, newValue) => updateRange(newValue, index)}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
