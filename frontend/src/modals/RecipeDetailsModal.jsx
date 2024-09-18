import React from 'react';
import './modal.css';

const EditModal = ({isOpen, onClose, onSubmit, recipe}) => {
  if (!isOpen) return null;

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     //const data = Object.fromEntries(formData.entries());
//     //data.liquid = data.liquid === 'on';  // Convert 'on' to true, undefined to false
//     onSubmit(formData);
//     onClose();
//   }

  return (
      <div className="overlay">
        <div className="modal">
          <h2>Recipe Details</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="recipeName">Name:</label>
            <input type="text" id="recipeName" name="recipeName" defaultValue={recipe.fields.recipeName} required/>
            <img src={'Storage/' + recipe.fields.picture}></img>
            <label htmlFor="recipe">Recipe Instructions:</label>
            <input type="text" id="recipe" name="recipe" required defaultValue={recipe.fields.recipe}  />


            <button type="submit">Confirm Edits</button>
            <button type="button" onClick={onClose}>Close</button>
          </form>
        </div>
      </div>
  );
}

export default EditModal;
