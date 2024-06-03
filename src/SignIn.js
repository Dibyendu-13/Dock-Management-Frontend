import React from 'react';
import { signInWithRedirect } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import './SignIn.css';

const SignIn = () => {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
      // Firebase will handle the redirect to the HomePage after successful sign-in
    } catch (error) {
      console.error('Error signing in with Google:', error.message);
    }
  };

  return (
    <div className='container-body'>
        <div  className="container">
     
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h1 className="animated-heading">Welcome to Dock  App!</h1>
              <button
                onClick={handleGoogleSignIn} style={{width:'100%',padding:'8px'}}
                className="btn btn-primary btn-block" 
              
              >
                Sign in with Google
              </button>
            </div>
          </div>
    
      </div>
    </div>

    </div>
    
  );
};

export default SignIn;
