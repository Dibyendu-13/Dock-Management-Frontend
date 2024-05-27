import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const ENDPOINT = "http://localhost:5000";

function DockTable() {
  const [docks, setDocks] = useState([]);
  const [waitingVehicles, setWaitingVehicles] = useState([]);
  const [disabledDocks, setDisabledDocks] = useState([]);
  const [etas, setEtas] = useState({});
  const undockRef = useRef({});
  const [reRenderTrigger, setReRenderTrigger] = useState(0);

  useEffect(() => {
    // Fetch docks data from the API initially
    axios.get(`${ENDPOINT}/api/dock-status`)
      .then(response => {
        const { docks, waitingVehicles } = response.data;
        setDocks(docks);
        setWaitingVehicles(waitingVehicles);
      })
      .catch(error => {
        console.error('Error fetching docks:', error);
      });

    // Connect to Socket.IO server
    const socket = io(ENDPOINT);

    // Listen for dock status updates from the server
    socket.on('dockStatusUpdate', ({ docks, waitingVehicles }) => {
      setDocks(docks);
      setWaitingVehicles(waitingVehicles);
    });

    // Clean up on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const dockVehicle = (dockId) => {
    axios.post(`${ENDPOINT}/api/assign-dock`, { 
      vehicleNumber: '', 
      source: '', 
      unloadingTime: '', 
      is3PL: false 
    })
      .then(response => {
        
      })
      .catch(error => {
        console.error('Error docking vehicle:', error);
      });
  };

  const startTimer = (dockId, eta) => {
    setEtas((prevEtas) => ({ ...prevEtas, [dockId]: eta }));

    const timer = setInterval(() => {
      setEtas((prevEtas) => {
        if (prevEtas[dockId] === 0) {
          clearInterval(timer);
          undockVehicle(dockId);
          return { ...prevEtas, [dockId]: 0 };
        }
        return { ...prevEtas, [dockId]: prevEtas[dockId] - 1 };
      });
    }, 60000); // Update every minute (60000 ms)
  };

  const undockVehicle = (dockId) => {
    if (undockRef.current[dockId]) {
      return;
    }

    undockRef.current[dockId] = true;

    axios.post(`${ENDPOINT}/api/release-dock`, { dockId })
      .then(response => {
    
       
        setEtas((prevEtas) => {
          const newEtas = { ...prevEtas };
          delete newEtas[dockId];
          return newEtas;
        });
        undockRef.current[dockId] = false;
      })
      .catch(error => {
        console.error('Error undocking vehicle:', error);
      });
  };

  const toggleDockStatus = (dockId) => {
    if (disabledDocks.includes(dockId)) {
      setDisabledDocks(disabledDocks.filter(d => d !== dockId));
    } else {
      setDisabledDocks([...disabledDocks, dockId]);
    }
  };

  useEffect(() => {

   
    setReRenderTrigger(prev => prev + 1);
  }, [waitingVehicles,docks,reRenderTrigger]);

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
                {dock.vehicleNumber ? (
                  <button
                    style={{ width: '100px' }}
                    className='btn btn-danger btn-md btn-block'
                    onClick={() => startTimer(dock.id, dock.unloadingTime)}
                    disabled={disabledDocks.includes(dock.id)}
                  >
                    {etas[dock.id] !== undefined ? `ETA: ${etas[dock.id]} min` : 'Undock'}
                  </button>
                ) : (
                  <button
                    style={{ width: '100px' }}
                    className='btn btn-success btn-md btn-block'
                    onClick={() => dockVehicle(dock.id)}
                    disabled={disabledDocks.includes(dock.id)}
                  >
                    Dock
                  </button>
                )}
              </td>
              <td>
                <button
                  style={{ width: '100px' }}
                  className={`btn btn-md btn-block ${disabledDocks.includes(dock.id) ? 'btn-secondary' : 'btn-warning'}`}
                  onClick={() => toggleDockStatus(dock.id)}
                >
                  {disabledDocks.includes(dock.id) ? 'Enable' : 'Disable'}
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
