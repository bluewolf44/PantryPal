import React, { useState, useEffect } from 'react';
import './modal.css';
import './userList.css'
import axios from "axios";
import PropTypes from 'prop-types';

const ShareRecipeModal = ({isOpen, onClose, onSubmit, recipe}) => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await axios.get("/api/getAllUsers/")

        console.log(response.data)
        setUsers(response.data)
        setFilteredUsers(response.data)
      } catch (error) {
      console.log("Error occured in obtaining all users: ", error)
      }
    }

    getAllUsers();
  }, [])

  useEffect(() => {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
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
    const formData = new FormData();
    formData.append('user_ids', JSON.stringify(selectedUsers))
    formData.append('recipe_id', recipe.pk)
    onSubmit(formData)
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
                <div key={user.id} className="userItem">
                <div className="profile-picture">
                  <img src={"/Storage/" + user.profile.picture} alt="pfp" />
                </div>
                  <span>{user.username}</span>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleCheckboxChange(user.id)}
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

ShareRecipeModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  recipe:PropTypes.object,
};

export default ShareRecipeModal;
