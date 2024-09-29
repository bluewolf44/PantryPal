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
    },
    {
        name:"Cookie",
        picture:"cookie.jpg",
        queryName:"cookie",
    },
    {
        name:"Brownie",
        picture:"brownie.jpg",
        queryName:"brownie",
    }, 
    {
        name:"Crumble",
        picture:"crumble.jpg",
        queryName:"crumble",
    },


];

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
            <img src={'Storage/RecipeDetails/'+item.picture} alt={item.picture} />
            <span>{item.name}</span>
            <div className="item-buttons">
                <button onClick={() => handleRecipeCreation(item.queryName)}>Create</button>
            </div>
        </div>
    ));

    const [query, setQuery] = useState(""); // State to hold the user input

    const handleRecipeCreationSearch = () => {
        if(query.trim() !== "") {
            fetch("/api/aiRecipe/" + query.trim(), {
                credentials: "same-origin",
            })
            .then((res) => res.json())
            .then((data) => {
                sessionStorage.setItem('currentQuery', data.detail);
                window.location.href = '/showRecipe'; // Redirect to show the recipe
            })
            .catch((err) => {
                console.error("Error creating recipe: ", err);
            });
        }
    };

    return (
        <>
            <main>
                <h2>What's would you like to make?</h2>

                <div className="recipe-input-container">
                <input
                    type="text"
                    placeholder="Enter recipe type (e.g., 'pizza', 'cake')"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ marginBottom: '20px', padding: '10px', width: 'calc(100% - 22px)' }}
                />
                <button onClick={handleRecipeCreationSearch} style={{ padding: '10px 20px' }}>
                    Generate Recipe
                </button>
                </div>
                <h2>Suggested Recipes</h2>

                <div className="pantry-grid">
                    {temp}
                </div>
            </main>
        </>
    );
}

export default CreateRecipe;
