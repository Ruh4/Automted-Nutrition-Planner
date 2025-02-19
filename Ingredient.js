import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Ingredient.css';

const Ingredient = () => {
  const [recipes, setRecipes] = useState([]);
  const [storageTips] = useState([
    "Keep fruits and vegetables in separate drawers to prevent ripening gases from affecting other produce.",
    "Store pantry items in airtight containers to keep them fresh and prevent pests.",
    "Refrigerate perishable items promptly to maintain freshness and prevent spoilage."
  ]);

  useEffect(() => {
    const fetchLeftovers = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:3030/api/ingredient/leftovers', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setRecipes(response.data.recipeSuggestions);
      } catch (error) {
        console.error('Error fetching leftovers:', error);
      }
    };

    fetchLeftovers();
  }, []);

  const ingredients = [
    { id: 1, name: 'Tomatoes' },
    { id: 2, name: 'Pasta' },
    { id: 3, name: 'Olive Oil' },
    { id: 4, name: 'Bell Peppers' }
  ];

  return (
    <div className="ingredient-container">
      <div className="leftover-ingredients">
        <h2> Leftover Ingredients</h2>
        <div className="ingredients-list">
          {ingredients.map((ingredient) => (
            <p key={ingredient.id}>{ingredient.name}</p>
          ))}
        </div>
      </div>

      <div className="recipe-suggestions">
        <h2>Recipe Suggestions</h2>
        <div className="recipes-list">
          {recipes.length > 0 ? (
            recipes.map((recipe, index) => (
              <div key={index}>
                <h3>{recipe.recipe}</h3>
                <p><strong>Required Ingredients:</strong> {recipe.requiredIngredients.join(', ')}</p>
              </div>
            ))
          ) : (
            <p>No recipes available</p>
          )}
        </div>
      </div>

      <div className="storage-tips">
        <h2>Storage Tips</h2>
        <ul className="storage-tips-list">
          {storageTips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Ingredient;
