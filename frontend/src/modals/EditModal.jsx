import React from 'react';
import './modal.css';

const EditModal = ({isOpen, onClose, onSubmit, ingredient}) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromentries(formData.entries());
    onSubmit(data);
    onClose();
  }

  return (
    <>
    <h2>Add Ingredient</h2>
    <form onSubmit={handleSubmit}>
        <label for="ingredientName">Name:</label>
        <input type="text" id="ingredientName" name="ingredientName" default={ ingredient} required/>
        <label for="picture">Picture:</label>
        <input type="file" id="picture" name="picture" accept="image/*" />

        <label for="describe">Describe:</label>
        <input type="text" id="describe" name="describe"/>

        <label for="amount">Amount (g/mL):</label>
        <input type="number" id="amount" name="amount" required min="0"/>

        <label for="liquid">Liquid:</label>
        <input type="checkbox" id="liquid" name="liquid"/>

        <button type="submit">Add Ingredient</button>
        <button onClick={onClose}>Close</button>
    </form>
    </>
  );
}

export default EditModal;
