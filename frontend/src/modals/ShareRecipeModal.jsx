import React, { useState, useEffect } from 'react';
import './modal.css';
import axios from "axios";
const ShareRecipeModal = ({isOpen, onClose, onSubmit, users}) => {
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

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
    onSubmit(formData);
    onClose();
  }

  return (
      <div className="overlay" onClick={handleOverlayClick}>
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
