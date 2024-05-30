import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const ENDPOINT = "https://secret-castle-75015-b0147fa6ddd8.herokuapp.com";

function DockTable() {
  // Dictionary object to keep track of active timers
  const activeTimers = {};
  const [docks, setDocks] = useState([]);
  const [waitingVehicles, setWaitingVehicles] = useState([]);
  const [etas, setEtas] = useState({});
  const timersRef = useRef({});
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchDockData = async () => {
      try {
        console.log('Fetching dock data from API');
        const response = await axios.get(`${ENDPOINT}/api/dock-status`);
        const { docks, waitingVehicles } = response.data;
        setDocks(docks);
        setWaitingVehicles(waitingVehicles);
   
       
       
      } catch (error) {
        console.error('Error fetching docks:', error);
      }
    };

    fetchDockData();

    if (!socketRef.current) {
      socketRef.current = io(ENDPOINT);

      socketRef.current.on('dockStatusUpdate', ({ docks, waitingVehicles }) => {
        console.log('Received dock status update from server');
        setDocks(docks);
        setWaitingVehicles(waitingVehicles);

        docks.forEach(dock => {
          if (dock.status === 'occupied' ) {
            startTimer(dock.id, dock.unloadingTime);
          }
        });
  
      
      });
    }

    return () => {
      if (socketRef.current) {
        console.log('Cleaning up: Disconnecting socket and clearing timers');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      Object.values(timersRef.current).forEach(clearInterval);
    };
  }, []);

  const dockVehicle = async (dockId) => {
    console.log(`Docking vehicle at dock ${dockId}`);
    try {
      const response = await axios.post(`${ENDPOINT}/api/assign-dock`, {
        vehicleNumber: '',
        source: '',
        unloadingTime: '',
        is3PL: false,
      });
      console.log('Vehicle docked successfully', response.data);
    } catch (error) {
      console.error('Error docking vehicle:', error);
    }
  };

  const startTimer = (dockId, eta) => {
    // Check if timer is already active for the dockId
    if (activeTimers[dockId]) {
      console.log(`Timer already active for dock ${dockId}`);
      return;
    }
  
    console.log(`Dock ${dockId} timer has started!`);
    // Start the timer
    activeTimers[dockId] = setTimeout(() => {
      undockVehicle(dockId);
      // Once the timer is finished, remove it from active timers
      delete activeTimers[dockId];
    }, eta * 60000);
  };
  
  

  const undockVehicle = async (dockId) => {
    console.log(`Undocking vehicle from dock ${dockId}`);
    
    try {
      console.log(docks);
  
      const response = await axios.post(`${ENDPOINT}/api/release-dock`, { dockId });
      console.log('Vehicle undocked successfully', response.data);

  
      setDocks(prevDocks => prevDocks.map(d => d.id === dockId ? { ...d, status: 'available', vehicleNumber: '', source: '' } : d));
    } catch (error) {
      console.error('Error undocking vehicle:', error);
    }
  };
  
  const toggleDockStatus = async (dockId) => {
    console.log(`Toggling status of dock ${dockId}`);
    const dock = docks.find(d => d.id === dockId);

    if (dock) {
      try {
        if (dock.status === 'disabled') {
          const response = await axios.post(`${ENDPOINT}/api/enable-dock`, { dockNumber: dock.dockNumber });
          console.log(`Dock ${dockId} has been enabled`, response.data);
        } else {
          const response = await axios.post(`${ENDPOINT}/api/disable-dock`, { dockNumber: dock.dockNumber });
          console.log(`Dock ${dockId} has been disabled`, response.data);
        }
      } catch (error) {
        console.error(`Error ${dock.status === 'disabled' ? 'enabling' : 'disabling'} dock:`, error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Dock Status</h2>
      <table className="table table-striped text-center">
        <thead className="thead-dark">
          <tr>
            <th>Dock Number</th>
            <th>Status</th>
            <th>Vehicle Tag</th>
            <th>Vehicle Number</th>
            <th>ETA</th>
            <th>Dock/Undock</th>
            <th>Enable/Disable</th>
          </tr>
        </thead>
        <tbody>
          {docks.map(dock => (
            <tr key={dock.id}>
              <td>{dock.dockNumber}</td>
              <td>{dock.status}</td>
              <td>{dock.source}</td>
              <td>{dock.vehicleNumber}</td>
              <td>{dock.vehicleNumber ? `${etas[dock.id] !== undefined ? etas[dock.id] : dock.unloadingTime} min` : ''}</td>
              <td>
                {dock.status === 'occupied' ? (
                  <button
                    style={{ width: '100px' }}
                    className='btn btn-danger btn-md btn-block'
                    onClick={() => undockVehicle(dock.id)}
                  >
                    Undock
                  </button>
                ) : (
                  <button
                    style={{ width: '100px' }}
                    className='btn btn-success btn-md btn-block'
                    onClick={() => dockVehicle(dock.id)}
                    disabled={dock.status === 'disabled'}
                  >
                    Dock
                  </button>
                )}
              </td>
              <td>
                <button
                  style={{ width: '100px' }}
                  className={`btn btn-md btn-block ${dock.status === 'disabled' ? 'btn-warning' : 'btn-secondary'}`}
                  onClick={() => toggleDockStatus(dock.id)}
                >
                  {dock.status === 'disabled' ? 'Enable' : 'Disable'}
                </button>
              </td>
            </tr>
          ))}

          {waitingVehicles.map((vehicle) => (
            <tr key={vehicle.vehicleNumber}>
              <td>{vehicle.dockNumber}</td>
              <td>Waiting</td>
              <td>{vehicle.source}</td>
              <td>{vehicle.vehicleNumber}</td>
              <td>{vehicle.unloadingTime} min</td>
              <td>NA</td>
              <td>NA</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DockTable;
