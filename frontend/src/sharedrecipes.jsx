import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import RecipeDetailsModal from "./modals/RecipeDetailsModal";
import { useNavigate, useLocation } from "react-router-dom";

import "./css/saverecipe.css"; // Assuming your CSS is adapted for React

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

Modal.setAppElement("#root"); // Assuming your root div has an ID of 'root'

function SharedRecipesGrid() {
  const [recipesReceived, setRecipesReceived] = useState([])
  const [recipesShared, setRecipesShared] = useState([])
  const [recipe, setRecipe] = useState(null)

  useEffect(() => {
    // This fetch will contain a custom json including recipeOwner, userShared, recipe, and feedback
    const getRecipesReceived = async () => {
      try {
        const response = await axios.get("/api/getRecipesReceived/");
        setRecipesReceived(response.data);
        console.log("Recipes Received: ", recipesReceived)
        console.log("response.data: ", response.data)
        console.log("test: ", response.data[0].recipeName)
        console.log("test: ", response.data[0].recipeName.recipeName)

      } catch (error) {
        console.log("Error in getting recipes from backend: ", error);
      }
    };
    getRecipesReceived();
  }, [useLocation()])

  const saveToMyRecipes = async (recipe_id) => {
    try {
      const response = await axios.post(`/api/saveToMyRecipes/${recipe_id}/`)
      console.log("saveToMyRecipes: ", response.data)
    } catch (error) {
      console.log("Error in saving shared recipes from backend: ", error);
    }
  }

  // useEffect(() => {
  //   const getRecipesShared = async () => {
  //     try {
  //       const response = await axios.get("/api/getRecipesShared/");
  //       setRecipesShared(response.data);
  //       console.log("response.data: ", response.data)
  //     } catch (error) {
  //       console.log("Error in getting recipes shared from backend: ", error);
  //     }
  //   };
  //   getRecipesShared();
  // }, [useLocation()])

  return (
    <>
      <h2> Recipes Received: </h2>
      <div className="recipes-grid">
        {recipesReceived.length != 0 ? (
          recipesReceived.map((shared) => (
            <div key={shared.pk} className="recipes">
              <img
                src={"Storage/" + shared.recipeName.picture}
                alt={shared.recipeName.recipeName}
            />
              <span>{shared.recipeName.recipeName}</span>
              <span>{"Shared by " + shared.recipeOwner.username}</span>
              {/* <span>{recipe.fields.recipe}</span> */}
              <div className="recipes-buttons">
                <button onClick={() => saveToMyRecipes(shared.recipeName.id) }>Add to your recipes</button>
                <button>Give Feedback</button>
                <button>Delete</button>
              </div>

            </div>
        ))
      ) : (
        <p>No Recipes Found</p>
      )}
      </div>
    </>
  );
}

export default SharedRecipesGrid;
