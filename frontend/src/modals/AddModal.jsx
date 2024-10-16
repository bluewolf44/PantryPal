import React, { useState, useEffect } from 'react';
import './modal.css';
import Alert from './alert'; // Ensure the import is correctly named
import PropTypes from 'prop-types';

const AddModal = ({isOpen, onClose, onSubmit}) => {
  const [showAlert, setShowAlert] = useState(false);

  // When showAlert changes, schedule it to turn off after 5 seconds
  useEffect(() => {
    let timer;
    if (showAlert) {
      timer = setTimeout(() => {
        setShowAlert(false);
         // Close the modal once the alert has finished displaying
      }, 3000);
      onClose();
    }
    return () => clearTimeout(timer);
  }, [showAlert, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit(formData);
    setShowAlert(true); // Show the alert
  };

  if (!isOpen && !showAlert) return null; // Ensure the component stays mounted if alert is visible

  return (
    <>
      {showAlert && (
        <Alert message="Ingredient added successfully!" onClose={() => setShowAlert(false)} />
      )}
      {isOpen && (
        <div className="overlay" onClick={e => e.target.classList.contains('overlay') && onClose()}>
          <div className="modal">
            <h2>Add Ingredient</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="ingredientName">Name:</label>
              <input type="text" id="ingredientName" name="ingredientName" required/>
              <label htmlFor="picture">Picture:</label>
              <input type="file" id="picture" name="picture" accept="image/*"/>
              <label htmlFor="describe">Describe:</label>
              <input type="text" id="describe" name="describe" required/>
              <label htmlFor="amount">Amount (g/mL):</label>
              <input type="number" id="amount" name="amount" required min="0"/>
              <label htmlFor="liquid">Liquid:</label>
              <input type="checkbox" id="liquid" name="liquid"/>
              <button type="submit">Add Ingredient</button>
              <button type="button" onClick={onClose}>Close</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

AddModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default AddModal;
