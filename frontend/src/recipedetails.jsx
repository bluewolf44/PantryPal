import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import './css/showrecipe.css';
import { useNavigate } from "react-router-dom";
import formatRecipeText from "./formatRecipeText"

function RecipeDetails() {
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getRecipeById = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/getRecipes/${id}`)
        const parsedToJson = JSON.parse(response.data)
        /* The backend seems to return a list of json, but there is only one json in there. */
        setRecipe(parsedToJson[0])
        console.log(parsedToJson)
      } catch (error) {
        console.log("Error in getting recipe by id: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    getRecipeById();
  }, [id]);

  return (
    <>
      <h2>Recipe Details</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : recipe ? (
        <>
          <div className="recipe-content" dangerouslySetInnerHTML={formatRecipeText(recipe.fields.recipe)}></div>
          <button onClick={() => navigate('/recipes')}>Share</button>
          <button onClick={() => navigate('/recipes')}>Back</button>
        </>
      ) : (
        <p>No recipe found.</p>
      )}
    </>
  );
}

export default RecipeDetails;
