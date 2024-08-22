import React, { useState } from 'react';
import 'css/createaccount.css'; 

function CreateAccount() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Implement your account creation logic here
        console.log("Creating account for:", username, email, password);
        // Redirect or handle account creation response
    };

    return (
        <div className="account-form-container">
            <h1>Create Account</h1>
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

                <button type="submit">Create Account</button>
            </form>
        </div>
    );
}

export default CreateAccount;
