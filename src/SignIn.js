import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import './SignIn.css';

const SignIn = ({ onSuccess, onError }) => {
  return (
    <div className='container-body'>
      <div className="container">
       
          <div className="card">
            <div className="card-body">
              <h1 className="animated-heading">Welcome to Dock App!</h1>
       

              <GoogleLogin
                
                onSuccess={onSuccess}
                onError={onError}
                render={renderProps => (
                  <button 
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                   
                    
                  >
                    Sign in with Google
                  </button>
                )}
              />

              </div>
            
        
        
        </div>
      </div>
    </div>
  );
};

export default SignIn;
