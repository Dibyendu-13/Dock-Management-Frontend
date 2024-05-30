import React from 'react';
import DockTable from './components/DockTable';
import VehicleForm from './components/VehicleForm';

function App() {
  return (
    <div className="App">
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <h1 style={{ margin: '2px', fontSize: '4vw' }}>Vehicle Dock Management System</h1>
        <VehicleForm />
        <DockTable />
      </div>
    </div>
  );
}

export default App;
