import React, { useState,useEffect  } from 'react';
import Modal from 'react-modal';
import './css/createrecipe.css';

Modal.setAppElement('#root');

// The foods that will display:
const foods = [
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

function CreateRecipe() {

    const handleRecipeCreation = (queryName) => {
        fetch("/api/aiRecipe/"+queryName, {
            credentials: "same-origin",
        })
        .then((res) => res.json())
        .then((data) => {
            sessionStorage.setItem('currentQuery',data.detail);
            window.location.href = 'showRecipe'
        })
        .catch((err) => {
            console.log(err);
        });
    }

    const temp = foods.map((item,index) => (
        <div key={index} className="item">
            <img src={'Storage/RecipeImages/'+item.picture} alt={item.picture} />
            <span>{item.name}</span>
            <div className="item-buttons">
                <button onClick={() => handleRecipeCreation(item.queryName)}>Create</button>
            </div>
        </div>
    ));

    return (
        <>
            <main>
                <h2>What's would you like to make?</h2>
                <div className="pantry-grid">
                    {temp}
                </div>
            </main>
        </>
    );
}

export default CreateRecipe;
