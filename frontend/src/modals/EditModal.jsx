import React from 'react';
import './modal.css';
import PropTypes from 'prop-types';

const EditModal = ({isOpen, onClose, ingredient, onSubmit}) => {
  if (!isOpen) return null;

  // This function checks if the user clicked outside the modal (on the overlay)
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('overlay')) {
      onClose(); // Close the modal when clicking outside of the modal
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    //const data = Object.fromEntries(formData.entries());
    //data.liquid = data.liquid === 'on';  // Convert 'on' to true, undefined to false
    onSubmit(formData);
    onClose();
  }

  return (
      <div className="overlay" onClick={handleOverlayClick}>
        <div className="modal">
          <h2>Edit Ingredient</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="ingredientName">Name:</label>
            <input type="text" id="ingredientName" name="ingredientName" defaultValue={ingredient.fields.ingredientName} required/>

            <label htmlFor="picture">Picture:</label>
            <input type="file" id="picture" name="picture" accept="image/*" />

            <label htmlFor="describe">Describe:</label>
            <input type="text" id="describe" name="describe" required defaultValue={ingredient.fields.describe}  />

            <label htmlFor="amount">Amount (g/mL):</label>
            <input type="number" id="amount" name="amount" required min="0" defaultValue={ingredient.fields.amount}/>

            <label htmlFor="liquid">Liquid:</label>
            <input type="checkbox" id="liquid" name="liquid" defaultChecked={ingredient.fields.liquid} />

            <button type="submit">Confirm Edits</button>
            <button type="button" onClick={onClose}>Close</button>
          </form>
        </div>
      </div>
  );
}

EditModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  ingredient:PropTypes.object,
};

export default EditModal;
