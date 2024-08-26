import React from "react";

class addIngredients() extends React.Component{
    render() {
        return(
            <div class="add-ingredients-container">
                <h1>Add Ingredients</h1>
                <form action="/submit-ingredient" method="POST" enctype="multipart/form-data">
                    <label for="ingredient-name">Name:</label>
                    <input type="text" id="ingredient-name" name="ingredient-name" required/>

                    <label for="ingredient-image">Picture:</label>
                    <input type="file" id="ingredient-image" name="ingredient-image" accept="image/*"/>

                    <label for="amount">Amount (grams):</label>
                    <input type="number" id="amount" name="amount" required min="1" placeholder="Enter amount in grams"/>

                    <button type="submit">Add Ingredient</button>
                    <button type="button" onclick="window.location.href='pantrypage.html';">Back</button>
                </form>
            </div>
        );
    }
}

export default addIngredients;
