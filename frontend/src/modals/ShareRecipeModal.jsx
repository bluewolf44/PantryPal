import React from 'react';
import './modal.css';

const ShareRecipeModal = ({isOpen, onClose, onSubmit}) => {
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
          <h2>Share Recipe:</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="ingredientName">Search for users:</label>
            <input type="text" id="ingredientName" name="ingredientName" required/>


            <button type="submit">Share</button>
            <button type="button" onClick={onClose}>Close</button>
          </form>
        </div>
      </div>
  );
}

export default ShareRecipeModal;
