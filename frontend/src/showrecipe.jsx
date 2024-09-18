import Modal from 'react-modal';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import './css/showrecipe.css'; 

Modal.setAppElement('#root');

function ShowRecipe() {

    const query = sessionStorage.getItem('currentQuery');

     
    const handleSave = async () => {
         try {
             await axios.post(`/api/saveRecipe/`, { recipe: query });
             console.log("Recipe saved successfully");
         } catch (error) {
             console.error("Error saving recipe:", error);
         }
     };


    // Enhanced function to format text with numbered and bullet list items and headers
    const formatRecipeText = (text) => {
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
            <div className="recipe-content" dangerouslySetInnerHTML={formatRecipeText(query)}></div>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => window.location.href = '/createRecipe'}>Back</button>
        </>
    );
}

export default ShowRecipe;