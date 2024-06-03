import React, { useEffect, useRef } from 'react';
import './Loader.css';

const Loader = () => {
  const opacityRef = useRef(null);

  useEffect(() => {
    // Add the modal-open class when the component mounts
    if (opacityRef.current) {
      opacityRef.current.classList.add('modal-open');
    }
  }, []);

  return (
    <div className="modal" ref={opacityRef}>
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
