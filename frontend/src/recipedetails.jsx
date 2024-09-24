import React,{ useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';
import axios from "axios";
import './css/showrecipe.css';
import { useNavigate } from "react-router-dom";
import formatRecipeText from "./formatRecipeText"
import ShareRecipeModal from './modals/ShareRecipeModal';

Modal.setAppElement('#root');

function RecipeDetails() {
  const [isShareRecipeModalOpen, setIsShareRecipeModalOpen] = useState(false)
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


  /* Basically retrieves 'selectedUsers' user ids array from modal to share recipe */
  const shareRecipe = (userIdsForSharing) => {
    const data = [userIdsForSharing, recipe]
    console.log("List of id's to share to: ", userIdsForSharing, recipe)
  }

  return (
    <>
      <h2>Recipe Details</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : recipe ? (
        <>
          <div className="recipe-content" dangerouslySetInnerHTML={formatRecipeText(recipe.fields.recipe)}></div>
          <button onClick={() => navigate('/recipes')}>Back</button>

          <div className="button-container">
              <button onClick = {() => navigate('/markAsCreated/'+id)}>Mark as created</button>
              <button onClick={() => setIsShareRecipeModalOpen(true)} style={{ cursor: 'pointer' }}>Share Recipe</button>
          </div>
        </>
      ) : (
        <p>No recipe found.</p>
      )}
      <ShareRecipeModal
          isOpen={isShareRecipeModalOpen}
          onClose={() => setIsShareRecipeModalOpen(false)}
          onSubmit={shareRecipe}
          contentLabel="Share Recipe Modal"
      />
    </>
  );
}

export default RecipeDetails;
