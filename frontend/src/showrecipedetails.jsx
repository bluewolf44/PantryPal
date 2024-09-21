import Modal from 'react-modal';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import './css/showrecipe.css';
import AddRecipeModal from "./modals/AddRecipeModal";
import { formatRecipeText } from './showrecipe';

Modal.setAppElement('#root');

function ShowRecipeDetails() {
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  /* This will contain the recipe instructions */
  const query = '';


    return (
        <>
            <h2>Recipe Details</h2>
            <div className="recipe-content" dangerouslySetInnerHTML={formatRecipeText(query)}></div>
            <button onClick={() => window.location.href = '/recipes'}>Back</button>
            <AddRecipeModal
                isOpen={isRecipeModalOpen}
                onClose={() => setIsRecipeModalOpen(false)}
                onSubmit={saveRecipe}
                contentLabel="Add Recipe Modal"
                defaultRecipe={query}
            />
        </>
    );
}

export default ShowRecipeDetails;
