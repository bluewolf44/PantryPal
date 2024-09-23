import React from 'react';
import './modal.css';

const RecipeDetailsModal = ({isOpen, onClose, onSubmit, recipe}) => {
  if (!isOpen) return null
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevents infinite loop if fallback image also fails
    e.target.src = "https://thecrites.com/sites/all/modules/cookbook/theme/images/default-recipe-big.png";
  };

  // This function checks if the user clicked outside the modal (on the overlay)
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('overlay')) {
      onClose(); // Close the modal when clicking outside of the modal
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target); // Gather form data
    if (onSubmit) {
      onSubmit(formData);  // Ensure onSubmit is called if it's passed
    } else {
      console.error("onSubmit function is not defined!");
    }
    onClose();
  };



  return (
      <div className="overlay" onClick={handleOverlayClick}>
        <div className="modal">
          <h2>Recipe Details lol</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="recipeName">Name:</label>
            <input type="text" id="recipeName" name="recipeName" defaultValue={recipe.fields.recipeName} required/>
            <img src={'Storage/' + recipe.fields.picture} onError={handleImageError}></img>
            <label htmlFor="recipe">Recipe Instructions:</label>
            <textarea type="text" rows="10" id="recipe" name="recipe" required defaultValue={recipe.fields.recipe}/>


             <button type="submit">Confirm Edits</button> 
            <button type="button" onClick={onClose}>Close</button>
          </form>
        </div>
      </div>
  );
}

export default RecipeDetailsModal;
