import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './css/pantrypage.css';  // Assuming your CSS is adapted for React
import milk from "./images/milk.jpg";
import flour from "./images/flour.jpg";
import logo from "./images/pantrypal-logo.png";
import axios from "axios";
import AddModal from "./modals/AddModal";
import EditModal from "./modals/EditModal";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

Modal.setAppElement('#root');  // Assuming your root div has an ID of 'root'

function PantryGrid({ logoutProp, deleteAccountProp }) {
    const [menuVisible, setMenuVisible] = useState(false);
    const [ingredients, setIngredients] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [ingredientToEdit, setIngredientToEdit] = useState(null);

    // Get Ingredients
    useEffect(() => {
        get_ingredients();
    }, []);

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

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);  // Toggle visibility state
    };

    const closeMenu = () => {
        setMenuVisible(false);  // Set menu to not visible
    };

    const logout = (event) => {
        event.preventDefault();
        logoutProp();
    };

    const deleteAccount = (event) => {
        event.preventDefault();
        deleteAccountProp();
    };

    const editIngredient = async (newIngredient) => {
        try {
            await axios.post(`/api/editIngredient/${ingredientToEdit.pk}`, newIngredient);
            get_ingredients();
        } catch (error) {
            console.log("Error editing ingredient: ", error);
        }
    };

    const deleteIngredient = async (ingredientId) => {
        try {
            await axios.delete(`/api/deleteIngredient/${ingredientId}`);
            get_ingredients();
            console.log(`Deleted ingredient with id: ${ingredientId} successfully`);
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

    return (
        <>
            <header>
                <nav className="navbar">
                    <div className="menu-button" onClick={toggleMenu}>☰</div>
                    <div className="logo-container">
                        <a href="/"><img src={logo} alt="PantryPal Logo" className="logo" /></a>
                    </div>
                </nav>
            </header>
            <main>
                <h2>What's in your pantry?</h2>
                <div className="item" onClick={() => setIsAddModalOpen(true)} style={{ cursor: 'pointer' }}>
                        <h4>Add Ingredient</h4>
                </div>
                <div className="pantry-grid">
                    {ingredients}
                </div>
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
                <div className="button-container">
                    <button onClick={() => window.location.href = 'createrecipe.html'}>Let's Get Baking!</button>
                </div>
            </main>
            <div id="side-menu" className="side-nav" style={{ width: menuVisible ? '250px' : '0' }}>
                <a href="javascript:void(0)" className="closebtn" onClick={closeMenu}>&times;</a>
                <a href="" className="active">Pantry</a>
                <a href="/createrecipe">Create Recipe</a>
                <a href="/myrecipes">My Recipes</a>
                <div className="nav-bottom">
                    <a href="#" onClick={logout}>Log Out</a>
                    <a href="#" onClick={deleteAccount}>Delete Account</a>
                </div>
            </div>
        </>
    );
}

export default PantryGrid;
