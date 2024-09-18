import React, { useState,useEffect  } from 'react';
import Modal from 'react-modal';
import './css/saverecipe.css';  // Assuming your CSS is adapted for React

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;


Modal.setAppElement('#root');  // Assuming your root div has an ID of 'root'

function RecipeGrid() {
 

    return (
        <>
            <main>
                <h2> My Saved Recipes: </h2>
                
            </main>
        </>
    );
}

export default SaveRecipe;
