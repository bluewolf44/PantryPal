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

    return (
        <>
            <pre>{query}</pre>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleBack}>Back</button>
        </>
    );
}

export default ShowRecipe;