import React, { useEffect, useState } from 'react';
import './alert.css'; // Make sure your CSS positions the alert as needed

const Alert = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true); // Manage visibility state

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false); // Hide after 10 seconds
      onClose(); // Call onClose after the alert is no longer visible
    }, 10000); // Show for 10 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`alert ${!isVisible ? 'alert-hide' : ''}`}>
      {message}
    </div>
  );
};

export default Alert;
