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

    // Assuming lines meant to be list items start with an asterisk (*)
    const formatRecipeText = (text) => {
        const boldTextRegex = /\*\*(.*?)\*\*/g;
        const listItemRegex = /^\* (.*?)(?=\n|$)/gm; // Matches lines starting with '* '

        const formattedText = text
            .replace(boldTextRegex, '<strong>$1</strong>') // Apply bold formatting
            .replace(listItemRegex, '<li>$1</li>'); // Convert lines starting with '* ' to list items

        return { __html: '<ul>' + formattedText + '</ul>' }; // Wrap with <ul> if not every line is a list item
    };

    return (
        <>
            <h2>Recipe Details</h2>
            <div className="recipe-content" dangerouslySetInnerHTML={formatRecipeText(query)}></div>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => window.location.href = '/createRecipe'}>Back</button>
        </>
    );
}

export default ShowRecipe;