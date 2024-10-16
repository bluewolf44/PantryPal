import React, { useState } from 'react';
import './css/createaccount.css';
import logo from "./images/pantrypal-logo.png";

function CreateAccount({cookies}) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch('api/createAccount/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": cookies.get("csrftoken"),
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            if (response.status === 201) {
                setSuccess('Account created successfully!');
                window.location.href = "/"
            } else {
                const data = await response.json();
                setError(data.detail || 'Failed to create account');
            }
        } catch (error) {
            console.log(error);
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="account-form-container">
            <img src={logo} alt="PantryPal Logo" style={{ width: '300px', marginBottom: '20px' }} />
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <button type="submit">Create Account</button>
            </form>
            <p>Already have an account? <span className="create-account-link" onClick={() => window.location.href = '/'}>Login.</span></p>
        </div>
    );
}

export default CreateAccount;
