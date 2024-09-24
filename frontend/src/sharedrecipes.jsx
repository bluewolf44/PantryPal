import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import RecipeDetailsModal from "./modals/RecipeDetailsModal";
import { useNavigate } from "react-router-dom";

import "./css/saverecipe.css"; // Assuming your CSS is adapted for React

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

Modal.setAppElement("#root"); // Assuming your root div has an ID of 'root'

function SharedRecipesGrid() {
  const [recipesReceived, setRecipesReceived] = useState([])

  useEffect(() => {
    const getRecipesReceived = async () => {
      try {
        const response = await axios.get("/api/getRecipesReceived/");
        setRecipesReceived(JSON.parse(response.data));
        console.log("Recipes Received: ", recipesReceived)
      } catch (error) {
        console.log("Error in getting recipes from backend: ", error);
      }
    };
    getRecipesReceived();
  }, [])

  return (
    <>
      <h2> Recipes Received: </h2>
      <div className="recipes-grid">
        {recipesReceived.length != 0 ? (
          recipesReceived.map((recipe) => (
            <div key={recipe.pk} className="recipes">
              <img
                src={"Storage/" + recipe.fields.picture}
                alt={recipe.fields.recipeName}
            />
              <span>{recipe.fields.recipeName}</span>
              {/* <span>{recipe.fields.recipe}</span> */}
              <div className="recipes-buttons">
                <button>View Details</button>
                <button>Edit</button>
                <button>Delete</button>
              </div>

            </div>
        ))
      ) : (
        <p>No Recipes Found</p>
      )}
      </div>
      <h2> Recipes I shared: </h2>
      <div className="recipes-grid">
      </div>
    </>
  );
}

export default SharedRecipesGrid;
