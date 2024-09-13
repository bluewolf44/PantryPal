import React, { useState,useEffect  } from 'react';
import Modal from 'react-modal';
import './css/pantrypage.css';  // Assuming your CSS is adapted for React

Modal.setAppElement('#root');  // Assuming your root div has an ID of 'root'

// The foods that will display:
const recipes = [
    {
        name:"Cake", //Name of item in HTML
        picture:"cake.jpg", // Will be in 'Storage/RecipeImages/''
        queryName:"cake", // The thing that will go to the ai
    },
    {
        name:"Pizza",
        picture:"pizza.jpg",
        queryName:"pizza",
      },];

function SaveRecipe() {

    const handleCreate = (queryName) => {
        console.log(queryName);
    }

    const temp = recipes.map((item,index) => (
        <div key={index} className="item">
            <img src={'Storage/RecipeImages/'+item.picture} alt={item.picture} />
            <span>{item.name}</span>
            <div className="item-buttons">
                <button onClick={() => handleCreate(item.queryName)}>Create</button>
            </div>
        </div>
    ));

    return (
        <>
            <main>
                <h2>My Saved Recipes:</h2>
                <div className="pantry-grid">
                    {temp}
                </div>
            </main>
        </>
    );
}

export default SaveRecipe;
