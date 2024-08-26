import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";


function AddIngredients({cookies}) {
    const [ingredientName, setIngredientName] = useState("");
    const [picture, setPicture] = useState("");
    const [describe, setDescribe] = useState("");
    const [amount, setAmount] = useState("");
    const [liquid, setLiquid] = useState(false);

    const navigate = useNavigate();

    function handleBack() {
        navigate("/");
    }

    const checkHandler = () => {
        setLiquid(!liquid)
    }

    function createIngredients() {
        event.preventDefault();
        fetch("/api/createIngredient/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": cookies.get("csrftoken"),
            },
            credentials: "same-origin",
            body: JSON.stringify({ ingredientName: ingredientName, picture: picture,describe:describe,amount:amount,liquid:liquid })
        })
        .catch((err) => {
            console.log(err);
            app.setState({ error: err.message });
        });
        setIngredientName("")
        setPicture("")
        setDescribe("")
        setAmount("")
        setLiquid("")
    }

    return(
        <div class="add-ingredients-container">
            <h1>Add Ingredients</h1>
            <form onSubmit={createIngredients}>
                <label for="ingredientName">Name:</label>
                <input type="text" id="ingredientName" name="ingredientName" required value={ingredientName} onChange={e => setIngredientName(e.target.value)}/>

                <label for="picture">Picture:</label>
                <input type="file" id="picture" name="picture" accept="image/*" value={picture} onChange={e => setPicture(e.target.value)}/>

                <label for="describe">Describe:</label>
                <input type="text" id="describe" name="describe" value={describe} onChange={e => setDescribe(e.target.value)}/>

                <label for="amount">Amount (g/mL):</label>
                <input type="number" id="amount" name="amount" required min="0" value={amount} onChange={e => setAmount(e.target.value)}/>

                <label for="liquid">Liquid:</label>
                <input type="checkbox" id="liquid" name="liquid" value={liquid} onChange={checkHandler}/>

                <button type="submit">Add Ingredient</button>
            </form>
            <button type="button" onClick={handleBack}>Back</button>
        </div>
    );
}

export default AddIngredients;
