import React, { useState, useEffect } from 'react';
import './modal.css';
import './userList.css'
import axios from "axios";
const ShareRecipeModal = ({isOpen, onClose, onSubmit}) => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await axios.get("/api/getAllUsers/")
        const parsedToJson = JSON.parse(response.data)
        console.log(parsedToJson)
        setUsers(parsedToJson)
        setFilteredUsers(parsedToJson)
      } catch (error) {
      console.log("Error occured in obtaining all users: ", error)
      }
    }

    getAllUsers();
  }, [])

  useEffect(() => {
    const filtered = users.filter(user =>
      user.fields.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleCheckboxChange = (userId) => {
    setSelectedUsers(prevSelectedUsers =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter(id => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  if (!isOpen) return null;

  // This function checks if the user clicked outside the modal (on the overlay)
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('overlay')) {
      onClose(); // Close the modal when clicking outside of the modal
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // const formData = new FormData(e.target);
    onSubmit(selectedUsers);
    onClose();
  }

  return (
    <div className="overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <h2>Share Recipe:</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Search for users..." value={searchTerm} onChange={handleSearchChange} />
          <div className="userList">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <div key={user.pk} className="userItem">
                  <span>{user.fields.username}</span>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.pk)}
                    onChange={() => handleCheckboxChange(user.pk)}
                  />
                </div>
              ))
            ) : (
              <p>No users found.</p>
            )}
          </div>
          <button type="submit">Share</button>
          <button type="button" onClick={onClose}>Close</button>
        </form>
      </div>
    </div>
  );
}

export default ShareRecipeModal;
