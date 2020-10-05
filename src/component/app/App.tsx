import React from 'react';
import logo from './logo.svg';
import './App.css';
import { EventList } from '../eventlist';


function App() {
  const eventList = [{}];

  return (
    <div className="App">
      <EventList eventList={eventList} />
    </div>
  );
}

export default App;
