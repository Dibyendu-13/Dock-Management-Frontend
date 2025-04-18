import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css';

const ENDPOINT = "https://secret-castle-75015-b0147fa6ddd8.herokuapp.com";

// const ENDPOINT = "http://localhost:5000";

function DockTable() {
  // Dictionary object to keep track of active timers
  const activeTimers = {};
  const [docks, setDocks] = useState([]);
  const [prevState, setPrevState] = useState({}); // Initialize prevState as an empty object
  const [waitingVehicles, setWaitingVehicles] = useState([]);
  const [etas, setEtas] = useState({});
  const timersRef = useRef({});
  const socketRef = useRef(null);




  useEffect(() => {
    const fetchDockData = async () => {
      try {
        // console.log('Fetching dock data from API');
        const response = await axios.get(`${ENDPOINT}/api/dock-status`);
        const { docks, waitingVehicles } = response.data;
        setDocks(docks);
        setWaitingVehicles(waitingVehicles);
      } catch (error) {
        console.error('Error fetching docks:', error);
        // setError(`Error fetching docks`)
      }
    };

    fetchDockData();

    if (!socketRef.current) {
      socketRef.current = io(ENDPOINT);

      socketRef.current.on('dockStatusUpdate', ({ docks, waitingVehicles }) => {
        // console.log('Received dock status update from server');
        setDocks(docks);
        setWaitingVehicles(waitingVehicles);

        docks.forEach(dock => {
          if (dock.status === 'occupied' && !timersRef.current[dock.id]) {
            startTimer(dock.id, dock.unloadingTime);
          }
          
        });
      });
    }

    return () => {
      if (socketRef.current) {
        // console.log('Cleaning up: Disconnecting socket and clearing timers');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      Object.values(timersRef.current).forEach(clearInterval);
    };
  }, []);



  const dockVehicle = async (dockId) => {
    // console.log(`Docking vehicle at dock ${dockId}`);

    try {
      const response = await axios.post(`${ENDPOINT}/api/assign-dock`, {
        vehicleNumber: '',
        source: '',
        unloadingTime: '',
        is3PL: false,
      });
      // console.log('Vehicle docked successfully', response.data);
    } catch (error) {
     
      console.error('Error docking vehicle:', error);
    }
  };

  const startTimer = (dockId, eta) => {
    // Check if timer is already active for the dockId
    if (timersRef.current[dockId]) {
      // console.log(`Timer already active for dock ${dockId}`);
      return;
    }

    // console.log(`Dock ${dockId} timer has started!`);
    // Set the initial ETA in state
    setEtas(prevEtas => ({
      ...prevEtas,
      [dockId]: eta
    }));

    // Start the timer
    timersRef.current[dockId] = setInterval(() => {
      setEtas(prevEtas => {
        const newEta = prevEtas[dockId] - 1;
        if (newEta <= 0) {
          // console.log(`Dock ${dockId} timer has reached 0 or negative value!`);
          clearInterval(timersRef.current[dockId]);
      
          undockVehicle(dockId);
        }
        return {
          ...prevEtas,
          [dockId]: newEta
        };
      });
    }, 60000); // Update every minute
  };
  





  const undockVehicle = async (dockId) => {
     
    //  let dock=docks.find(dock=>dock.id===dockId)
      
    //  console.log(dockId);
    //  console.log(dock);
   
    try {
      if (timersRef.current[dockId]) {
        
     
        const res = await axios.post(`${ENDPOINT}/api/release-dock`, { dockId });
        

      const data = res.data;

       
      
        // console.log(`Clearing timer for dock ${dockId}`);
        clearInterval(timersRef.current[dockId]);
        delete timersRef.current[dockId];


        toast.success(`Vehicle ${data.vehicleNumber} Undocked Successfully from Dock ${data.dockNumber} `,{
          closeButton: false // Disable the close button
        });
      
        
      
        setDocks(prevDocks => prevDocks.map(d => d.id === dockId ? { ...d, status: 'available', vehicleNumber: '', source: '' } : d));

      }

     

    } catch (error) {
      
     

      console.error('Error undocking vehicle:', error);
    }
  };
  const toggleDockStatus = async (dockId) => {
  

    // console.log(dockId)
    const dock = docks.find(d => d.id === dockId);

    

    if (!dock)
        return;

    console.log(dock.status);
 
 


    if (dock) {
        try {
            let updatedDock;
        
            if (dock.status === 'disabled') {
              if (timersRef.current[dockId]) {
                // console.log(`Clearing timer for dock ${dockId}`);
                clearInterval(timersRef.current[dockId]);
                delete timersRef.current[dockId];
              }
               

              // console.log(dock);
             
              if(dock.source===null)
                dock.status='available';
              else
                 dock.status='occupied';
              
              if(dock.status==='occupied')
                {
                      // console.log("Starting Timer within enable")
                      startTimer(dock.id,dock.unloadingTime)
              }
          
               
                

              const response = await axios.post(`${ENDPOINT}/api/enable-dock`, {dock:dock });
              // console.log(`Dock ${dockId} has been enabled`, response.data);

               
                // Retain original status if it was 'occupied' or 'available'
                updatedDock = { ...dock, status: dock.status };
            } else {
                const response = await axios.post(`${ENDPOINT}/api/disable-dock`, { dockNumber: dock.dockNumber });
                // console.log(`Dock ${dockId} has been disabled`, response.data);
                updatedDock = { ...dock, status: 'disabled' };
            }

            // console.log(updatedDock);
            setDocks(prevDocks => prevDocks.map(d => d.id === dockId ? updatedDock : d));
           
              
           

        } catch (error) {
            console.error(`Error ${dock.status === 'disabled' ? 'enabling' : 'disabling'} dock:`, error);
          
        }
    }
};




  // Group docks by dock number
const groupedDocks = docks.reduce((acc, dock) => {
  if (!dock || !dock.dockNumber) {
    return acc;
  }
  const { dockNumber } = dock;
  if (!acc[dockNumber]) {
    acc[dockNumber] = [];
  }
  acc[dockNumber].push(dock);
  return acc;
}, {});


  return (
    <>


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
         {Object.keys(groupedDocks).map(dockNumber => (
           groupedDocks[dockNumber].map(dock => (
             <tr key={dock.id}>
               <td>{dock.dockNumber}</td>
               <td>{dock.status}</td>

               <td>{dock.source}</td>
               <td>{dock.vehicleNumber}</td>
               <td>  {dock.vehicleNumber ? (  activeTimers[dock.id] ? (   `${etas[dock.id]} min`  ) : (
                   `${etas[dock.id] !== undefined ? etas[dock.id] : dock.unloadingTime} min` )) : ( '')}</td>
               <td>
                 {dock.status === 'occupied' ? (
                   <button
                     style={{ width: '100px' }}
                     className="btn btn-danger btn-block btn-sm btn-md btn-lg"
                     onClick={() => undockVehicle(dock.id)}
                     disabled={dock.source===''}
                   >
                     Undock
                   </button>
                 ) : (
                   <button
                     style={{ width: '100px' }}
                     className="btn btn-success btn-block btn-sm btn-md btn-lg"
                     onClick={() => dockVehicle(dock.id)}
                     disabled={dock.status==='disabled' || dock.status==='available'}
                   >
                     Dock
                   </button>
                 )}
               </td>
               <td>
                 <button
                   style={{ width: '100px' }}
                   className={`btn btn-md btn-block btn-sm btn-md btn-lg ${dock.status === 'disabled' ? 'btn-warning' : 'btn-secondary'}`}
                   onClick={() => toggleDockStatus(dock.id)}
                 >
                   {dock.status === 'disabled' ? 'Enable' : 'Disable'}
                 </button>
               </td>
             </tr>
           ))
         ))}

{waitingVehicles.map((vehicle, index) => (
  <tr key={vehicle.vehicleNumber}>
    <td>{index + 1}</td> {/* Using the index for numbering */}
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

  
    </>
   
  
  
  );
}

export default DockTable;
