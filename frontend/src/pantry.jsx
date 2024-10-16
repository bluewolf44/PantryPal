import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './css/pantrypage.css';  // Assuming your CSS is adapted for React
import axios from "axios";
import AddModal from "./modals/AddModal";
import EditModal from "./modals/EditModal";
import AddRecipeModal from "./modals/AddRecipeModal";
import Alert from './modals/alert';
import { useLocation } from 'react-router-dom';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

Modal.setAppElement('#root');  // Assuming your root div has an ID of 'root'

function PantryGrid() {
    const [ingredients, setIngredients] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [ingredientToEdit, setIngredientToEdit] = useState(null);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false); // State to manage delete alert visibility
    const [showEditAlert, setShowEditAlert] = useState(false); // State for the edit alert
    const location = useLocation();
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);


    useEffect(() => {
        get_ingredients();
        if (location.state && location.state.message) {
            setAlertMessage(location.state.message);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 2000);
        }
    }, [location]);

    // Function to fetch ingredients
    const get_ingredients = () => {
        fetch("/api/getIngredients/", {
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "same-origin",
        })
            .then((res) => res.json()) //// Parse the response as JSON
            .then((data) => {
                let objects = JSON.parse(data);
                let temp = objects.map((item) => (
                    <div key={item.pk} className="item">
                        <img src={'Storage/' + item.fields.picture} alt={item.fields.ingredientName} />
                        <span>{item.fields.ingredientName}</span>
                        <span>{item.fields.amount}{item.fields.liquid ? 'ml' : 'g'}</span>
                        <div className="item-buttons">
                            <button onClick={() => handleOpenEditModal(item)}>Edit</button>
                            <button onClick={() => deleteIngredient(item.pk)}>Delete</button>
                        </div>
                    </div>
                ));
                setIngredients(temp);
            })
            .catch((err) => {
                console.log(err);
            });
    };



// Function to edit ingredient
    const editIngredient = async (newIngredient) => {
        try {
            await axios.post(`/api/editIngredient/${ingredientToEdit.pk}`, newIngredient);
            get_ingredients();
            setShowEditAlert(true); // Show the edit success alert
            setTimeout(() => setShowEditAlert(false), 3000); // Hide alert after 5 seconds
        } catch (error) {
            console.log("Error editing ingredient: ", error);
        }
    };

// Function to delete ingredient
    const deleteIngredient = async (ingredientId) => {
        try {
            await axios.delete(`/api/deleteIngredient/${ingredientId}`);
            get_ingredients();
            console.log(`Deleted ingredient with id: ${ingredientId} successfully`);
            setShowDeleteAlert(true); // Show the delete alert
            setTimeout(() => setShowDeleteAlert(false), 3000); // Hide alert after 5 seconds
        } catch (error) {
            console.log("Error in deleting ingredient: ", error);
        }
    };

    const handleOpenEditModal = (ingredient) => {
        setIngredientToEdit(ingredient);
        setIsEditModalOpen(true);
    };

    // Function to create ingredients
    const createIngredients = async (data) => {
        try {
            console.log(data);
            await axios.post("/api/createIngredient/", data);
            get_ingredients();
        } catch (error) {
            console.error("Error creating ingredient:", error);
        }
    };

    const createRecipe = async (data) => {
        try{
            console.log(data);
            await axios.post("/api/createRecipe/", data);
            } catch (error) {
                console.error("Error creating recipe:", error);
            }
        };

    return (
        <>
            <main>
                <h2>What's in your pantry?</h2>
                <div className="item add-ingredient-btn" onClick={() => setIsAddModalOpen(true)} style={{ cursor: 'pointer' }}>
                        <h4>Add Ingredient</h4>
                </div>
                
                <div className="pantry-grid">
                    {ingredients}
                </div>

                {showDeleteAlert && (
                    <Alert message="Ingredient deleted successfully!" onClose={() => setShowDeleteAlert(false)} />
                )}
                {showEditAlert && (
                    <Alert message="Ingredient edited successfully!" onClose={() => setShowEditAlert(false)} />
                )}
                {showAlert && (
                    <Alert message={alertMessage} onClose={() => setShowAlert(false)} />
                )}



                {/* Container to hold the modal and button */}
                <div className="modal-container">
                <AddModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={createIngredients}
                    contentLabel="Add Ingredient Modal"
                />
                <EditModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={editIngredient}
                    ingredient={ingredientToEdit}
                />
                <AddRecipeModal
                    isOpen={isRecipeModalOpen}
                    onClose={() => setIsRecipeModalOpen(false)}
                    onSubmit={createRecipe}
                    contentLabel="Add Recipe Modal"
                />
                <div className={`button-container ${isAddModalOpen || isEditModalOpen || isRecipeModalOpen ? 'hidden' : ''}`}>
                    <button onClick={() => window.location.href = 'createRecipe'}>Let's Get Baking!</button>
                </div>
                </div>
            </main>
        </>
    );
}

export default PantryGrid;
