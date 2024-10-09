import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import RecipeDetailsModal from "./modals/RecipeDetailsModal";
import AddRecipeModal from "./modals/AddRecipeModal";
import { useNavigate } from "react-router-dom";
import Alert from "./modals/alert";

import "./css/saverecipe.css"; // Assuming your CSS is adapted for React

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

Modal.setAppElement("#root"); // Assuming your root div has an ID of 'root'

function RecipesGrid() {
  const [recipes, setRecipes] = useState([]);
  const [recipe, setRecipe] = useState(null);
  const [isAddRecipeModalOpen, setIsAddRecipeModalOpen] = useState(false);
  const [isRecipeDetailsModalOpen, setIsRecipeDetailsModalOpen] =
    useState(false);
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    getRecipes();
  }, []);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://thecrites.com/sites/all/modules/cookbook/theme/images/default-recipe-big.png";
  };

  const getRecipes = async () => {
    try {
      const response = await axios.get("/api/getRecipes");

      setRecipes(JSON.parse(response.data));
    } catch (error) {
      console.log("Error in getting recipes from backend: ", error);
    }
  };

  const deleteRecipe = async (recipeId) => {
    try {
      await axios.delete(`/api/deleteRecipe/${recipeId}`);
      getRecipes();
      console.log(`Deleted ingredient id: ${recipeId} successfully`);
      triggerAlert("Recipe deleted successfully!");
    } catch (error) {
      console.log("Error in deleting recipe: ", error);
    }
  };

  const createRecipe = async (data) => {
    try {
      console.log(data);
      await axios.post("/api/createRecipe/", data);
      triggerAlert("Recipe created successfully!");
      getRecipes();
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  };

  const handleOpenRecipeDetailsModal = (recipe) => {
    setRecipe(recipe);
    setIsRecipeDetailsModalOpen(true);
  };

  const gotoRecipeDetails = (recipe) => {
    navigate(`/recipes/${recipe.pk}`);
  };

  const handleRecipeUpdate = async (formData) => {
    try {
      const response = await axios.post(`/api/updateRecipe/${recipe.pk}/`, formData, {  // Add the trailing slash here
        headers: {
          'Content-Type': 'multipart/form-data', // This is for handling files
        },
      });
      console.log('Recipe updated successfully:', response.data);
      getRecipes();  // Optionally refresh your recipe list
      triggerAlert("Recipe updated successfully!");
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  };

  const triggerAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };
  

  return (
    <>
      <main>
        <h2> My Saved Recipes: </h2>
        <div
          className="item add-recipe" 
          onClick={() => setIsAddRecipeModalOpen(true)}
          style={{ cursor: "pointer" }}
        >
          <h4>Create your own Recipe</h4>
        </div>
        
        <div className="recipes-grid">
          {recipes.length != 0 ? (
            recipes.map((recipe) => (
              <div key={recipe.pk} className="recipes">
                <img
                  src={"Storage/" + recipe.fields.picture}
                  alt={recipe.fields.recipeName}
                  onError={handleImageError}
              />
                <span>{recipe.fields.recipeName}</span>
                {/* <span>{recipe.fields.recipe}</span> */}
                <div className="recipes-buttons">
                  <button
                    onClick={() => gotoRecipeDetails(recipe)}
                  >View Details</button>
                  <button
                    onClick={() => handleOpenRecipeDetailsModal(recipe)}
                  >Edit</button>
                  <button onClick={() => deleteRecipe(recipe.pk)}>Delete</button>
                </div>
                
              </div>
          ))
        ) : (
          <p>No Recipes Found</p>
        )}
        </div>

        {showAlert && (
          <Alert message={alertMessage} onClose={() => setShowAlert(false)} />
        )}

      </main>
      <RecipeDetailsModal
        isOpen={isRecipeDetailsModalOpen}
        onClose={() => setIsRecipeDetailsModalOpen(false)}
        onSubmit={handleRecipeUpdate}  // Ensure this function is passed correctly
        recipe={recipe}
      />
      <AddRecipeModal
        isOpen={isAddRecipeModalOpen}
        onClose={() => setIsAddRecipeModalOpen(false)}
        onSubmit={createRecipe}
        contentLabel="Add Recipe Modal"
      />
    </>
  );
}

export default RecipesGrid;
