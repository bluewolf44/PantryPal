import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from "axios";
import RecipeDetailsModal from './modals/RecipeDetailsModal';

import './css/saverecipe.css';  // Assuming your CSS is adapted for React

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;


Modal.setAppElement('#root');  // Assuming your root div has an ID of 'root'

function RecipesGrid() {
    const [recipes, setRecipes] = useState([]);
    const [recipe, setRecipe] = useState(null);
    const [isRecipeDetailsModalOpen, setIsRecipeDetailsModalOpen] = useState(false)

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

    const deleteRecipe = async (recipeId) => {
        try {
            await axios.delete(`/api/deleteRecipe/${recipeId}`);
            getRecipes();
            console.log(`Deleted ingredient id: ${recipeId} successfully`)
        } catch (error) {
            console.log("Error in deleting recipe: ", error)
        }
    }

    const handleOpenRecipeDetailsModal = (recipe) => {
        setRecipe(recipe);
        setIsRecipeDetailsModalOpen(true);
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
                        {/* <span>{recipe.fields.recipe}</span> */}
                        <div className="recipes-buttons">
                            <button onClick={() => handleOpenRecipeDetailsModal(recipe)}>View</button>
                            <button onClick={() => deleteRecipe(recipe.pk)}>Delete</button>
                        </div>
                    </div>
                ))
            ): (
                    <p>No Recipes Found</p>
                )
                }
                
            </main>
            <RecipeDetailsModal
                isOpen={isRecipeDetailsModalOpen}
                onClose={() => setIsRecipeDetailsModalOpen(false)}
                // onSubmit={editIngredient}
                recipe={recipe}
            />
        </>
    );
}

export default RecipesGrid;
