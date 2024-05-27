import React, { useState } from 'react';
import axios from 'axios';


const ENDPOINT = "http://localhost:5000";

function VehicleForm() {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [source, setSource] = useState('');
  const [unloadingTime, setUnloadingTime] = useState('');
  const [is3PL, setIs3PL] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(`${ENDPOINT}/api/assign-dock`, {
      vehicleNumber,
      source,
      unloadingTime,
      is3PL
    });
   
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-5">
      <div className="form-group">
        <label>Vehicle Number:</label>
        <input
          type="text"
          className="form-control"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Source:</label>
        <input
          type="text"
          className="form-control"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Unloading Time (min):</label>
        <input
          type="number"
          className="form-control"
          value={unloadingTime}
          onChange={(e) => setUnloadingTime(e.target.value)}
          required
        />
      </div>
      <div className="form-group form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="is3PL"
          checked={is3PL}
          onChange={(e) => setIs3PL(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="is3PL">3PL Vehicle</label>
      </div>
      <button type="submit" className="btn btn-primary">Assign Dock</button>
    </form>
  );
}

export default VehicleForm;
