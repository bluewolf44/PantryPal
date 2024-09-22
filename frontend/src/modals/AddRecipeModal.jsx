import React from 'react';
import './modal.css';

const AddRecipeModal = ({isOpen, onClose, onSubmit,defaultRecipe}) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit(formData);
    onClose();
  };
  // This function checks if the user clicked outside the modal (on the overlay)
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('overlay')) {
      onClose(); // Close the modal when clicking outside of the modal
    }
  };

  return (
      <div className="overlay" onClick={handleOverlayClick}>
        <div className="modal">
          <h2>Add Recipe</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="recipeName">Name:</label>
            <input type="text" id="recipeName" name="recipeName" required/>

            <label htmlFor="picture">Picture:</label>
            <input type="file" id="picture" name="picture" accept="image/*" required/>

            <label htmlFor="recipe">Recipe:</label>
            <textarea type="text" rows="10" id="recipe" name="recipe" required defaultValue={defaultRecipe}/>

            <button type="submit">Add Recipe</button>
            <button type="button" onClick={onClose}>Close</button>
          </form>
        </div>
      </div>
  );
}

export default AddRecipeModal;
