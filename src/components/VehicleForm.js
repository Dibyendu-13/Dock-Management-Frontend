import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css';


const ENDPOINT = "https://secret-castle-75015-b0147fa6ddd8.herokuapp.com";

// const ENDPOINT = "http://localhost:5000";

function VehicleForm() {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [source, setSource] = useState('');
  const [unloadingTime, setUnloadingTime] = useState('');
  const [is3PL, setIs3PL] = useState(false);
  // const [successMessage, setSuccessMessage] = useState(null);
  // const [showError, setShowError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate if unloading time is negative
    if (parseInt(unloadingTime) < 0) {
        toast.error("Unloading Time Cannot be Negative!");
        return; // Return to exit the function if unloading time is negative
    }

    try {
        const response = await axios.post(`${ENDPOINT}/api/assign-dock`, {
            vehicleNumber,
            source,
            unloadingTime,
            is3PL
        });

        const { message } = response.data;
        // console.log(message);

        // Show different toast messages based on the server response
        if (message.includes('assigned to vehicle')) {
            toast.success(`Vehicle ${vehicleNumber} Docked Successfully!`,{
              closeButton: false // Disable the close button
            });
        } else if (message.includes('added to waiting list')) {
            toast.info(`Vehicle ${vehicleNumber} added to waiting list.`,{
              closeButton: false // Disable the close button
            });
        } else {
            toast.warning(`Unexpected response: ${message}`,{
              closeButton: false // Disable the close button
            });
        }

        // Reset form state after successful submission
        setVehicleNumber('');
        setSource('');
        setUnloadingTime('');
        setIs3PL(false);
    } catch (error) {
        console.error("Error in assigning dock", error);
        toast.error("An error occurred while assigning the dock. Please try again.",{
          closeButton: false // Disable the close button
        });
    }
};


  return (
    <>

      <form onSubmit={handleSubmit} className="container mt-5">
        <div className="row">
          <div className="col-12 col-md-3">
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
          </div>
          <div className="col-12 col-md-3">
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
          </div>
          <div className="col-12 col-md-3">
            <div className="form-group">
              <label>Unloading Time(min):</label>
              <input
                type="number"
                className="form-control"
                min="0"
                value={unloadingTime}
                onChange={(e) => setUnloadingTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="col-12 col-md-2">
    <div style={{marginLeft:'50px'}} className="form-group d-flex flex-column align-items-start">
        <label className="mb-2">3PL</label>
        <div style={{marginLeft:'5px'}} className="form-check">
            <input 
                type="checkbox"
                className="form-check-input"
                id="is3PL"
                checked={is3PL}
                onChange={(e) => setIs3PL(e.target.checked)}
            />
        </div>
    </div>
</div>

<div className="col-12 col-md-1 align-self-end"> {/* Adjusted column width */}
    <button type="submit" className="btn btn-primary mt-3">Assign</button>
</div>
        </div>
      </form>

  
    </>
  );
}

export default VehicleForm;
