import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import { useLocation } from "react-router-dom";

import "./css/sharedrecipe.css"; // Assuming your CSS is adapted for React

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

Modal.setAppElement("#root"); // Assuming your root div has an ID of 'root'

function SharedRecipesGrid() {
  const [recipesReceived, setRecipesReceived] = useState([])
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');  

  useEffect(() => {
    getRecipesReceived();
  }, [useLocation()])

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

  const saveToMyRecipes = async (recipe_id) => {
    try {
      const response = await axios.post(`/api/saveToMyRecipes/${recipe_id}/`)
      console.log("saveToMyRecipes: ", response.data)
      setAlertMessage("Recipe successfully saved to your recipes!");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 5000);  // Dismiss alert after 5 seconds
    } catch (error) {
      console.log("Error in saving shared recipes from backend: ", error);
      setAlertMessage("Failed to save recipe.");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 5000);
    }
  }

  const deleteRecipeReceived = async (shared_id) => {
    try {
      const response = await axios.delete(`/api/deleteRecipeReceived/${shared_id}/`)
      console.log("deleteRecipeReceived: ", response.data)
      getRecipesReceived();
      setAlertMessage("Shared recipe successfully deleted!");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 5000);
    } catch (error) {
      console.log("Error in deleting a shared recipe from backend: ", error);
      setAlertMessage("Failed to delete shared recipe.");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 5000);
    }
  }

  // This will send user to the feedback page to provide feedback on shared recipe with the shared recipe id as a parameter
    const giveFeedback = (recipe_id) => {
        window.location.href = `/feedback/${recipe_id}`
    }


  return (
    <>
      <h2> Recipes Received: </h2>


      {showAlert && (
            <div className="alert">
                {alertMessage}
            </div>
        )}

      <div className="recipes-grid">
        {recipesReceived.length != 0 ? (
          recipesReceived.map((shared) => (
            <div key={shared.pk} className="recipes">
              <img
                src={"Storage/" + shared.recipeName.picture}
                alt={shared.recipeName.recipeName}
            />
              <span>{shared.recipeName.recipeName}</span>

              <div className="sharedby">

              <div className="profile-picture">
                <img src={"/Storage/" + shared.profile.picture} alt="pfp" />
              </div>
              
              <span>{"Shared by " + shared.recipeOwner.username}</span>
              </div>
              {/* <span>{recipe.fields.recipe}</span> */}
              <div className="recipes-buttons">
                <button onClick={() => saveToMyRecipes(shared.recipeName.id) }>Add to your recipes</button>
                <button onClick={() => giveFeedback(shared.id)}>Give Feedback</button>
                <button onClick={() => deleteRecipeReceived(shared.id) }>Delete</button>
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
