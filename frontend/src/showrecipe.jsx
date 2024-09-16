import Modal from 'react-modal';
import React, { useState, useEffect } from 'react';
import './css/showrecipe.css'; 

Modal.setAppElement('#root');

function ShowRecipe() {

    const query = sessionStorage.getItem('currentQuery');

     
    const handleSave = () => {
        console.log('Recipe saved');
        // Implementation to save the recipe
    };

    const handleBack = () => {
        console.log('Going back');
        // Implementation to go back, possibly using history or redirect
    };

    // Enhance text formatting by converting lists into HTML lists
    const formatRecipeText = (text) => {
        const boldTextRegex = /\*\*(.*?)\*\*/g;
        const formattedText = text
            .replace(boldTextRegex, '<strong>$1</strong>') // Bold formatting
            .replace(/(?:\r\n|\r|\n)\*/g, '</li><li>'); // Convert * to list items
        return { __html: '<ul><li>' + formattedText.substring(4) + '</li></ul>' }; // Assuming the text starts with a *
    };

    return (
        <>
            <h2>Recipe Details</h2>
            <div className="recipe-content" dangerouslySetInnerHTML={formatRecipeText(query)}></div>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleBack}>Back</button>
        </>
    );
}

export default ShowRecipe;