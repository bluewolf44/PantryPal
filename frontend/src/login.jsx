import React from 'react';
import './css/loginUI.css';
import logo from "./images/pantrypal-logo.png";

function Login({ app, cookies, onLoginSuccess }) {

    const isResponseOk = (response) => {
        if (response.status >= 200 && response.status <= 299) {
            return response.json();
        } else if (response.status === 400) {
            throw new Error("Invalid credentials. Please try again.");
        } else if (response.status === 500) {
            throw new Error("Server error. Please try again later.");
        } else {
            throw new Error("Unexpected error. Please try again.");
        }
    };

    const handlePasswordChange = (event) => {
        app.setState({ password: event.target.value });
    };

    const handleUserNameChange = (event) => {
        app.setState({ username: event.target.value });
    };

    //Login Method
    const login = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        app.setState({ error: "" }); // Clear any previous error messages

        fetch("/api/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": cookies.get("csrftoken"),
            },
            credentials: "same-origin",
            body: JSON.stringify({ username: app.state.username, password: app.state.password }),
        })
            .then(isResponseOk)
            .then((data) => {
                console.log(data);
              app.setState({ isAuthenticated: true, username: "", password: "", error: "" }, () => { onLoginSuccess(); });
            })
            .catch((err) => {
                console.log(err);
                app.setState({ error: err.message });
            });
    };

    return (
        <div className="login-container">
            <img src={logo} alt="PantryPal Logo" style={{ width: '300px', marginBottom: '20px' }} />

            <form onSubmit={login}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" value={app.state.username} onChange={handleUserNameChange} required />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={app.state.password} onChange={handlePasswordChange} required />
                </div>
                {app.state.error && <div className="error-message">{app.state.error}</div>}
                <button type="submit">Log In</button>
                <p>Don't have an account? <span className="create-account-link" onClick={() => window.location.href = 'createAccount'}>Create one.</span></p>
                </form>
        </div>
    );
}

// ReactDOM.render(<Login />, document.getElementById('login-root'));
export default Login;
