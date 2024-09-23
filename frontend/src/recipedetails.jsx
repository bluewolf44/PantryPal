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
  const [users, setUsers] = useState([])
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

useEffect(() => {
  const getAllUsers = async () => {
    try {
      const response = await axios.get("/api/getAllUsers/")
      console.log(response.data)
      setUsers(response.data)
    } catch (error) {
    console.log("Error occured in obtaining all users: ", error)
    }
  }

  getAllUsers()
}, [isShareRecipeModalOpen])

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
          onSubmit={() => setIsShareRecipeModalOpen(false)}
          users={ users }
          contentLabel="Share Recipe Modal"
      />
    </>
  );
}

export default RecipeDetails;
