import React, { useState } from 'react';
import './Substitution.css';

const substituteOptions = [
  { recipeId: '1', ingredients: 'Milk', substitute: 'Almond Milk' },
  { recipeId: '2', ingredients: 'Butter', substitute: 'Margarine' },
  { recipeId: '3', ingredients: 'Eggs', substitute: 'Applesauce' },
  { recipeId: '4', ingredients: 'Flour', substitute: 'Gluten-Free Flour' },
  { recipeId: '5', ingredients: 'Sugar', substitute: 'Stevia' },
  { recipeId: '6', ingredients: 'Sour Cream', substitute: 'Greek Yogurt' },
  { recipeId: '7', ingredients: 'Bread Crumbs', substitute: 'Oats' },
  { recipeId: '8', ingredients: 'Cream', substitute: 'Coconut Cream' },
];

const Substitution = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="substitution-container">
      <h2 className="centered-heading">Substitution</h2>
      <div className="button-container">
        {substituteOptions.map((option, index) => (
          <button key={index} onClick={() => handleSelectOption(option)}>
            {selectedOption === option ? (
              <>
                Recipe ID: {option.recipeId} <br />
                Ingredients: {option.ingredients} <br />
                Substitute: {option.substitute}
              </>
            ) : (
              `SUBSTITUTE ${option.ingredients.toUpperCase()}`
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Substitution;
