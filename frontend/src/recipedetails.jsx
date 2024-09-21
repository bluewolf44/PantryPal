import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import './css/showrecipe.css';

function RecipeDetails() {
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

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

  // Enhanced function to format text with numbered and bullet list items and headers
  const formatRecipeText = (text) => {
      if (text == null)
          return null;
      // Apply strong formatting for bold text
      text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      // Format markdown-style headers
      text = text.replace(/^##\s+(.*)$/gm, '<h3>$1</h3>');

      // Separate the text into lines for individual processing
      const lines = text.split('\n');
      const formattedLines = lines.map(line => {
          if (/^\d+\.\s/.test(line)) { // Matches numbered lines
              return `<li>${line.substring(line.indexOf('.') + 1).trim()}</li>`; // Formats as ordered list items
          } else if (line.trim().startsWith('*')) { // Matches bullet list items
              return `<li>${line.substring(1).trim()}</li>`; // Formats as unordered list items
          }
          return line;
      }).join('\n');

      // Encapsulate list items within <ul> or <ol> tags
      return { __html: formattedLines
          .replace(/<li>(\d+\..*?)<\/li>/gs, '<ol>$&</ol>') // Wrap numbered items in ordered list
          .replace(/<li>(?!<ol>.*<\/ol>).*?<\/li>/gs, '<ul>$&</ul>') // Wrap other list items in unordered list
      };
  };

  return (
    <>
      <h2>Recipe Details</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : recipe ? (
          <div className="recipe-content" dangerouslySetInnerHTML={formatRecipeText(recipe.fields.recipe)}></div>
      ) : (
        <p>No recipe found.</p>
      )}
    </>
  );
}

export default RecipeDetails;
