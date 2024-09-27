import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
// import './css/pantrypage.css';  // Assuming your CSS is adapted for React
import './css/editprofile.css'
import logo from "./images/pantrypal-logo.png";
import axios from "axios";
import AddModal from "./modals/AddModal";
import EditModal from "./modals/EditModal";
import AddRecipeModal from "./modals/AddRecipeModal";

function EditProfileGrid() {
  const defaultPfp = "Storage/UserImages/DefaultPicture/default.jpg"
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
  }
  useEffect(() => {
    handlePictureChange();
  }, [])

  const handlePictureChange = () => {
    console.log(sessionStorage);
  }

  return (
    <div className="center">
      <div className="edit-profile-container">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="profile-picture-container">
            <img src={defaultPfp} alt="Profile" className="profile-picture" />
            <label htmlFor="profilePicture" className="upload-button">
              Upload Picture
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                accept="image/*"
                onChange={ handlePictureChange }
                style={{display: 'none'}}
              />
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
          </div>

          <div className="form-group">
            <label htmlFor="password">New Password:</label>
            <input type="password" id="password" name="password" placeholder="Leave blank to keep current password" />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password:</label>
            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm new password" />
          </div>

          <div className="button-group">
            <button type="submit" className="submit-button">Save Changes</button>
            <button type="button"  className="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
      </div>
  );
}

export default EditProfileGrid;
