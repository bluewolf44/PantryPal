import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './css/loginUI.css'
import logo from "./images/pantrypal-logo.png";

function Login({app,cookies}) {

    const isResponseOk = (response) => {
        if (response.status >= 200 && response.status <= 299) {
            return response.json();
        } else {
            throw Error(response.statusText);
        }
    };

    const handlePasswordChange = (event) => {
        app.setState({password: event.target.value})
    }
    const handleUserNameChange = (event) => {
        app.setState({username: event.target.value})
    }

    //Login Method
    const login = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        // Make a POST request to the "/api/login/" URL with the form data
        fetch("/api/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": cookies.get("csrftoken"),
            },
            credentials: "same-origin",
            body: JSON.stringify({username: app.state.username, password: app.state.password}),
        })
        .then(isResponseOk)
        .then((data) => {
            console.log(data);
            app.setState({isAuthenticated: true, username: "", password: "", error: ""});
        })
        .catch((err) => {
            console.log(err);
            app.setState({error: "Wrong username or password."});
        });
    };

    return (
        <div>
            <img src={logo} alt="PantryPal Logo" style={{ width: '300px', marginBottom: '20px' }} />

            <h1>Login</h1>
            <form onSubmit={login}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={app.state.username}
                        onChange = {handleUserNameChange}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={app.state.password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <button type="submit">Log In</button>
                
                
            </form>
        </div>
    );
}

// ReactDOM.render(<Login />, document.getElementById('login-root'));
export default Login;