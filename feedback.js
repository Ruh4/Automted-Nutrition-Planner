import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './feedback.css';

const Feedback = () => {
  const [mealPlanId, setMealPlanId] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState('');
  const [message, setMessage] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  // Handle feedback submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      console.log('Token retrieved from localStorage:', token); // Log the token
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      // Convert mealPlanId and rating to integers
      const mealPlanIdInt = parseInt(mealPlanId, 10);
      const ratingInt = parseInt(rating, 10);
      if (isNaN(mealPlanIdInt) || isNaN(ratingInt)) {
        throw new Error('Invalid mealPlanId or rating');
      }

      const response = await axios.post('http://localhost:3030/api/feedback', {
        mealPlanId: mealPlanIdInt,
        feedback,
        rating: ratingInt
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response && response.data) {
        setMessage(response.data.feedbackEntry ? 'Feedback submitted successfully!' : 'Failed to submit feedback.');
      } else {
        setMessage('Unexpected response structure.');
      }
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.error || error.message || 'An error occurred'}`);
    }
  };

  // Fetch personalized recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem('authToken');
        console.log('Token retrieved from localStorage:', token); // Log the token
        if (!token) {
          throw new Error('Token not found in localStorage');
        }

        const response = await axios.get('http://localhost:3030/api/feedback/personalized', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setRecommendations(response.data.recommendations || []); // Ensure recommendations is an array
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div className="container">
      <div className="recommendations-container">
        <h2>Personalized Recommendations</h2>
        <div className="recommendations-list">
          {recommendations.length > 0 ? (
            recommendations.map((recipe) => (
              <div className="recommendation-item" key={recipe.id}>
                <h3>{recipe.name}</h3>
                <p>{recipe.ingredients}</p>
                <p>{recipe.instructions}</p>
              </div>
            ))
          ) : (
            <p>No recommendations available</p>
          )}
        </div>
      </div>
      <div className="feedback-container">
        <h2>Submit Feedback</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="mealPlanId">Meal Plan ID</label>
            <input
              type="text"
              id="mealPlanId"
              name="mealPlanId"
              value={mealPlanId}
              onChange={(e) => setMealPlanId(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="feedback">Your Feedback</label>
            <textarea
              id="feedback"
              name="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="rating">Rating</label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-submit">Submit</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default Feedback;
