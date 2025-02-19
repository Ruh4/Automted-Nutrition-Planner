import React, { useState, useEffect } from 'react';
import './Recipes.css';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        console.log('Fetching recipes from API...');
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/recipes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: JSON.stringify({ query: '' }) // Adjust the query parameter as needed
        });
        console.log('API response status:', response.status);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched Recipes:', data);

        // Combine and deduplicate recipes
        const combinedRecipes = [...data.apiRecipes, ...data.dbRecipes];
        const uniqueRecipes = Array.from(new Set(combinedRecipes.map(r => r.title || r.name)))
          .map(title => {
            return combinedRecipes.find(r => r.title === title || r.name === title);
          });

        // Add placeholder content for recipes missing ingredients or instructions
        const recipesWithPlaceholder = uniqueRecipes.map(recipe => ({
          ...recipe,
          ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : getPlaceholderIngredients(recipe.title || recipe.name),
          instructions: Array.isArray(recipe.instructions) ? recipe.instructions : getPlaceholderInstructions(recipe.title || recipe.name)
        }));

        setRecipes(recipesWithPlaceholder);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setError('Failed to fetch recipes');
      }
    };

    const getPlaceholderIngredients = (title) => {
      switch (title) {
        case 'Red Lentil Soup with Chicken and Turnips':
          return ['Red lentils', 'Chicken', 'Turnips'];
        case 'Asparagus and Pea Soup: Real Convenience Food':
          return ['Asparagus', 'Peas', 'Vegetable broth'];
        case 'Garlicky Kale':
          return ['Kale', 'Garlic', 'Olive oil'];
        case 'Slow Cooker Beef Stew':
          return ['Beef', 'Carrots', 'Potatoes'];
        case 'Red Kidney Bean Jambalaya':
          return ['Red kidney beans', 'Rice', 'Bell peppers'];
        case 'Cauliflower, Brown Rice, and Vegetable Fried Rice':
          return ['Cauliflower', 'Brown rice', 'Mixed vegetables'];
        case 'Quinoa and Chickpea Salad with Sun-Dried Tomatoes and Dried Cherries':
          return ['Quinoa', 'Chickpeas', 'Sun-dried tomatoes'];
        case 'Easy Homemade Rice and Beans':
          return ['Rice', 'Black beans', 'Onions'];
        case 'Tuscan White Bean Soup with Olive Oil and Rosemary':
          return ['White beans', 'Olive oil', 'Rosemary'];
        case 'Crunchy Brussels Sprouts Side Dish':
          return ['Brussels sprouts', 'Olive oil', 'Parmesan cheese'];
        default:
          return ['Ingredients not available.'];
      }
    };

    const getPlaceholderInstructions = (title) => {
      switch (title) {
        case 'Red Lentil Soup with Chicken and Turnips':
          return [
            'Cook red lentils until soft.',
            'Add diced chicken and chopped turnips.',
            'Simmer until chicken is cooked through.'
          ];
        case 'Asparagus and Pea Soup: Real Convenience Food':
          return [
            'Sauté asparagus and peas.',
            'Add vegetable broth and simmer.',
            'Blend until smooth.'
          ];
        case 'Garlicky Kale':
          return [
            'Sauté minced garlic in olive oil.',
            'Add chopped kale and cook until wilted.',
            'Season with salt and pepper.'
          ];
        case 'Slow Cooker Beef Stew':
          return [
            'Place beef, carrots, and potatoes in slow cooker.',
            'Add beef broth and seasonings.',
            'Cook on low for 8 hours.'
          ];
        case 'Red Kidney Bean Jambalaya':
          return [
            'Cook rice with kidney beans.',
            'Sauté bell peppers and add to rice mixture.',
            'Simmer with Cajun seasoning.'
          ];
        case 'Cauliflower, Brown Rice, and Vegetable Fried Rice':
          return [
            'Cook brown rice.',
            'Sauté cauliflower and mixed vegetables.',
            'Combine with rice and soy sauce.'
          ];
        case 'Quinoa and Chickpea Salad with Sun-Dried Tomatoes and Dried Cherries':
          return [
            'Cook quinoa and let cool.',
            'Mix with chickpeas and chopped sun-dried tomatoes.',
            'Toss with dried cherries and vinaigrette.'
          ];
        case 'Easy Homemade Rice and Beans':
          return [
            'Cook rice according to package instructions.',
            'Sauté onions and add black beans.',
            'Combine with cooked rice.'
          ];
        case 'Tuscan White Bean Soup with Olive Oil and Rosemary':
          return [
            'Sauté white beans in olive oil.',
            'Add chopped rosemary and vegetable broth.',
            'Simmer until flavors meld.'
          ];
        case 'Crunchy Brussels Sprouts Side Dish':
          return [
            'Roast Brussels sprouts with olive oil.',
            'Sprinkle with Parmesan cheese before serving.',
            'Season with salt and pepper.'
          ];
        default:
          return ['Instructions not available.'];
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="recipes-container">
      <h2 className="centered-heading">Explore Recipes</h2>
      {error ? (
        <p>{error}</p>
      ) : selectedRecipe ? (
        <div className="recipe-details">
          <button onClick={() => setSelectedRecipe(null)}>Back to Recipes</button>
          <h3>{selectedRecipe.title || selectedRecipe.name}</h3>
          <p><strong>Ingredients:</strong> {selectedRecipe.ingredients.join(', ')}</p>
          <p><strong>Instructions:</strong> {selectedRecipe.instructions.join(' ')}</p>
        </div>
      ) : recipes.length > 0 ? (
        <ul>
          {recipes.map((recipe, index) => (
            <li key={index} onClick={() => setSelectedRecipe(recipe)}>
              <h3>{recipe.title || recipe.name}</h3>
              <p>{`Ingredients: ${recipe.ingredients.join(', ')}`}</p>
              <p>{`Instructions: ${recipe.instructions.join(' ')}`}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recipes available.</p>
      )}
    </div>
  );
};

export default Recipes;
