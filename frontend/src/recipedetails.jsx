import Modal from 'react-modal';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import './css/showrecipe.css';
import AddRecipeModal from "./modals/AddRecipeModal";
import { formatRecipeText } from './showrecipe';

Modal.setAppElement('#root');

function RecipeDetails() {
  const [recipe, setRecipe] = useState(null)
  /* This obtains the recipe id from the url */
  const { id } = useParams();

  useEffect(() => {
    getRecipeById();
  });

  const getRecipeById = async () => {
    try {
      console.log(id)
      const response = await axios.get(`/api/getRecipes/${id}`)
      setRecipe(response.data)
    } catch (error) {
      console.log("Error in getting recipe by id: ", error);
    }
  }


    return (
        <>
            <h2>Recipe Details</h2>
        <h2>{ recipe }</h2>
        </>
    );
}

export default RecipeDetails;
