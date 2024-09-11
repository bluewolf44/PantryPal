import React from 'react';
import './modal.css';

const AddModal = ({isOpen, onClose, onSubmit}) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit(formData);
    onClose();
  }

  return (
      <div className="overlay">
        <div className="modal">
          <h2>Add Ingredient</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="ingredientName">Name:</label>
            <input type="text" id="ingredientName" name="ingredientName" required/>

            <label htmlFor="picture">Picture:</label>
            <input type="file" id="picture" name="picture" accept="image/*" required/>

            <label htmlFor="describe">Describe:</label>
            <input type="text" id="describe" name="describe"/>

            <label htmlFor="amount">Amount (g/mL):</label>
            <input type="number" id="amount" name="amount" required min="0"/>

            <label htmlFor="liquid">Liquid:</label>
            <input type="checkbox" id="liquid" name="liquid"/>

            <button type="submit">Add Ingredient</button>
            <button type="button" onClick={onClose}>Close</button>
          </form>
        </div>
      </div>
  );
}

export default AddModal;
