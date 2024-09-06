import React, { useState,useEffect  } from 'react';
import Modal from 'react-modal';
import './css/pantrypage.css';  // Assuming your CSS is adapted for React
import logo from "./images/pantrypal-logo.png";
import axios from "axios";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

Modal.setAppElement('#root');  // Assuming your root div has an ID of 'root'


function CreateRecipe() {
    





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
                <h2>Create Recipe page</h2>
                
            </main>
            <div id="side-menu" className="side-nav" style={{ width: menuVisible ? '250px' : '0' }}>
                <a href="javascript:void(0)" className="closebtn" onClick={closeMenu}>&times;</a>
                <a href="/pantrypage" className="active">Pantry</a>
                <a href="/createrecipe">Create Recipes</a>
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
