import React, { useState, useEffect } from 'react';
import './css/editprofile.css';
import axios from 'axios';
import Alert from './modals/alert'; // Ensure this is the path to your Alert component

function EditProfileGrid() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [showUpdateAlert, setShowUpdateAlert] = useState(false); // State for the update alert

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const response = await axios.get("/api/getCurrentUser/");
      console.log("currentUser: ", response.data);
      setUser(response.data.user);
      setUserProfile(response.data.profile);
    } catch (error) {
      console.log("Error in getting the current signed in user: ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if(selectedPicture) {
      formData.append('picture', selectedPicture);
    }

    try {
      const response = await axios.post("/api/updateUserDetails/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("Profile Updated: ", response.data);
      window.location.href = "/"
      setShowUpdateAlert(true); // Show update success alert
      setTimeout(() => setShowUpdateAlert(false), 5000); // Hide alert after 5 seconds
    } catch (error) {
      console.log("Error in updating user details: ", error);
    }
  };

  const deleteUserAccount = async () => {
    if(window.confirm("Are you sure you want to delete your account?")) {
      try {
        const response = await axios.delete("/api/deleteAccount/");
        console.log("Deleted Account successfully: ", response.data);
        window.location.href = '/';
      } catch (error) {
        console.log("Error in deleting user account: ", error);
      }
    }
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    setSelectedPicture(file);
  };

  if (!user || !userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="center">
      <div className="edit-profile-container">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="profile-picture-container">
            <img src={userProfile.picture} alt="Profile" className="profile-picture1" />
            <label htmlFor="profilePicture" className="upload-button">
              Upload Picture
              <input type="file" id="profilePicture" name="profilePicture" accept="image/*" onChange={handlePictureChange} style={{display: 'none'}}/>
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" defaultValue={user.username} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" defaultValue={user.email} required />
          </div>

          <div className="form-group">
            <label htmlFor="password">New Password:</label>
            <input type="password" id="password" name="password" placeholder="Leave blank to keep current password" />
          </div>

          <div className="button-group">
            <button type="submit" className="submit-button">Save Changes</button>
            <button type="button" onClick={deleteUserAccount} className="submit-button">Delete Account</button>
          </div>
        </form>
        {showUpdateAlert && (
          <Alert message="Profile updated successfully!" onClose={() => handleSubmit } />
        )}
      </div>
    </div>
  );
}

export default EditProfileGrid;
