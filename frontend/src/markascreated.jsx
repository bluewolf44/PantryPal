import {useState, useEffect} from "react";
import {useParams} from 'react-router-dom';
import Modal from 'react-modal';
Modal.setAppElement('#root');
import axios from "axios";
import './css/markascreated.css';

function MarkAsCreated() {
    const [ingredients,setIngredients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        // get the ingredients that the recipe may use
        const getIngredientsByRequired = async () => {
            try {
              setIsLoading(true);
              const response = await axios.get(`/api/getIngredientsByRequired/${id}`);
              const parsedToJson = JSON.parse(response.data);
              setIngredients(parsedToJson);
            } catch (error) {
              console.log("Error in getting recipe by id: ", error);
            } finally {
              setIsLoading(false);
            }
        }
        getIngredientsByRequired();
    },[id]);
    //updates the amount
    const handleChange = (e,ingredient_pk) => {
        e.preventDefault();
        setIngredients(ingredients.map((ingredient) => {
            //check if ingredient is the corrent one and then update the amount
            if (ingredient.pk === ingredient_pk)
                ingredient.fields.amount = e.target.value
                return ingredient
            //just return unChange ingredient
            return ingredient
        }));
    };

    const handleComplete = async () =>
    {
        //Create the json what will be sent
        const data = ingredients.map((ingredient) =>{
            return {
                pk:ingredient.pk,
                amount:ingredient.fields.amount
            }
        })
        const response = await axios.post(`/api/updateIngredientByAmount`,data);
        window.location.href = '/'
    }

    return(
        <>
            {isLoading ?
                (<p>Loading...</p>) : (
                    <>
                       <h2>There some ingredient we think you used:</h2>
                        {ingredients.length != 0 ? (
                            ingredients.map((ingredient) => (
                                <div key={ingredient.pk} className="ingredient">
                                    <spam>{ingredient.fields.ingredientName}</spam>
                                    <img
                                      src={"/Storage/" + ingredient.fields.picture}
                                      alt={ingredient.fields.recipeName}
                                    />
                                    <input type="number" id="amount" name="amount" required min="0" defaultValue={ingredient.fields.amount} onChange={(e) => handleChange(e,ingredient.pk)}/>
                                </div>
                            ))
                        ) : (<p>No Recipes Found</p>)}
                       <button onClick = {handleComplete}>Complete pantry update</button>
                    </>
                )
            }
        </>
    );
}

export default MarkAsCreated;