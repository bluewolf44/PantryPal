import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from "axios";

import './css/saverecipe.css';  // Assuming your CSS is adapted for React

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;


Modal.setAppElement('#root');  // Assuming your root div has an ID of 'root'

function RecipesGrid() {
    const [recipes, setRecipes] = useState([]);

    useEffect (() => {
        getRecipes();
    }, []);


    const getRecipes = async () => {
        try {
            const response = await axios.get('/api/getRecipes');

            setRecipes(JSON.parse(response.data))
        } catch (error) {
            console.log("Error in getting recipes from backend: ", error)
        }
    };

    return (
        <>
            <main>
                <h2> My Saved Recipes: </h2>
                {recipes.length != 0 ? (
                recipes.map((recipe) => (
                    <div key={recipe.pk} className="recipes">
                        <img src={'Storage/' + recipe.fields.picture} alt={recipe.fields.recipeName} />
                        <span>{recipe.fields.recipeName}</span>
                        <span>{recipe.fields.recipe}</span>
                        <div className="recipes-buttons">
                            <button onClick={() => handleOpenEditModal(recipe)}>Edit</button>
                            <button onClick={() => deleteRecipe(recipe.pk)}>Delete</button>
                        </div>
                    </div>
                ))
            ): (
                    <p>No Recipes Found</p>
                )
                };
                
            </main>
        </>
    );
}

export default RecipesGrid;
