import React from 'react';
import PalMapChart from './components/Paulista/PalMapChart.jsx';
import PirMapChart from './components/Piratininga/PirMapChart.jsx';
import SantaMapChart from './components/SantaCruz/SantaMapChart.jsx';


function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh' }}>
      <div style={{ flex: 1, border: '1px solid #ccc' }}>
        <p>Paulista</p>
        <PalMapChart />
      </div>
      <div style={{ flex: 1, border: '1px solid #ccc' }}>
        <p>Piratininga</p>
        <PirMapChart />
      </div>
      <div style={{ flex: 1, border: '1px solid #ccc' }}>
        <p>Santa Cruz</p>
        <SantaMapChart />
      </div>
    </div>
  );
}


export default App;
