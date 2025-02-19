import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    mealPreferences: '',
    restrictions: '',
    allergies: '',
    prefers: '',
    avoids: '',
    height: '',
    weight: '',
    age: '',
    imageUrl: '/nuts.jpg' // Use the new image URL
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await fetch('http://localhost:3030/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error(await response.text());

        const data = await response.json();
        setProfileData({
          username: data.user.username || '',
          email: data.user.email || '',
          mealPreferences: data.mealPreferences || '',
          restrictions: data.restrictions || '',
          allergies: data.user.allergies || '',
          prefers: data.user.prefers || '',
          avoids: data.user.avoids || '',
          height: data.user.height || '',
          weight: data.user.weight || '',
          age: data.user.age || '',
          imageUrl: data.user.imageUrl || '/nuts.jpg' // Fetch image URL from user data
        });
      } catch (error) {
        console.error('Error fetching profile data:', error.message);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No token found');

      const response = await fetch('http://localhost:3020/api/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData({ ...profileData, imageUrl: data.imageUrl });
        console.log('Image uploaded successfully:', data);
      } else {
        const text = await response.text();
        console.error('Unexpected response format:', text);
      }
    } catch (error) {
      console.error('Error uploading image:', error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No token found');

      const response = await fetch('http://localhost:3020/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData({
          username: data.user.username || '',
          email: data.user.email || '',
          mealPreferences: data.mealPreferences || '',
          restrictions: data.restrictions || '',
          allergies: data.user.allergies || '',
          prefers: data.user.prefers || '',
          avoids: data.user.avoids || '',
          height: data.user.height || '',
          weight: data.user.weight || '',
          age: data.user.age || '',
          imageUrl: data.user.imageUrl || '/nuts.jpg'
        });
        console.log('Profile updated successfully:', data);
      } else {
        const text = await response.text();
        console.error('Unexpected response format:', text);
      }
    } catch (error) {
      console.error('Error updating profile:', error.message);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <label htmlFor="profileImage">
          <div className="profile-image" style={{ backgroundImage: `url(${profileData.imageUrl})` }}></div>
        </label>
        <input type="file" id="profileImage" style={{ display: 'none' }} onChange={handleImageChange} />
        <div className="profile-details">
          <h2>{profileData.username}</h2>
          <p>{profileData.email}</p>
        </div>
      </div>
      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div>
            <label htmlFor="mealPreferences">Meal Preferences:</label>
            <input 
              type="text" 
              id="mealPreferences" 
              name="mealPreferences" 
              value={profileData.mealPreferences} 
              onChange={handleChange} 
            />
          </div>
          <div>
            <label htmlFor="restrictions">Restrictions:</label>
            <input 
              type="text" 
              id="restrictions" 
              name="restrictions" 
              value={profileData.restrictions} 
              onChange={handleChange} 
            />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label htmlFor="allergies">Allergies:</label>
            <input 
              type="text" 
              id="allergies" 
              name="allergies" 
              value={profileData.allergies} 
              onChange={handleChange} 
            />
          </div>
          <div>
            <label htmlFor="prefers">Prefers:</label>
            <input 
              type="text" 
              id="prefers" 
              name="prefers" 
              value={profileData.prefers} 
              onChange={handleChange} 
            />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label htmlFor="avoids">Avoids:</label>
            <input 
              type="text" 
              id="avoids" 
              name="avoids" 
              value={profileData.avoids} 
              onChange={handleChange} 
            />
          </div>
          <div>
            <label htmlFor="height">Height:</label>
            <input 
              type="text" 
              id="height" 
              name="height" 
              value={profileData.height} 
              onChange={handleChange} 
            />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label htmlFor="weight">Weight:</label>
            <input 
              type="text" 
              id="weight" 
              name="weight" 
              value={profileData.weight} 
              onChange={handleChange} 
            />
          </div>
          <div>
            <label htmlFor="age">Age:</label>
            <input 
              type="text" 
              id="age" 
              name="age" 
              value={profileData.age} 
              onChange={handleChange} 
            />
          </div>
        </div>

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;


