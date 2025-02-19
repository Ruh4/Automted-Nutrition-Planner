import React from 'react';
import './MealPlan.css';

const sampleMealPlan = [
  {
    id: 1,
    name: "Grilled Chicken Salad",
    image: "/images/grilledchicken.jpg",
    servings: 2,
    calories: 350,
    section: "Lunch"
  },
  {
    id: 2,
    name: "Quinoa Bowl",
    image: "/images/quinoa.jpg",
    servings: 1,
    calories: 250,
    section: "Breakfast"
  },
  {
    id: 3,
    name: "Spaghetti Bolognese",
    image: "/images/spaghetti.jpg",
    servings: 3,
    calories: 600,
    section: "Dinner"
  },
  {
    id: 4,
    name: "Veggie Stir-Fry",
    image: "/images/vegetable-stir-fry.jpg",
    servings: 2,
    calories: 300,
    section: "Lunch"
  },
  {
    id: 5,
    name: "Chicken Tacos",
    image: "/images/tacos.jpg",
    servings: 2,
    calories: 400,
    section: "Dinner"
  },
  {
    id: 6,
    name: "Lentil Soup",
    image: "/images/lentilsoup.jpg",
    servings: 4,
    calories: 150,
    section: "Lunch"
  },
  {
    id: 7,
    name: "Caprese Salad",
    image: "/images/capresesalad.jpg",
    servings: 1,
    calories: 150,
    section: "Breakfast"
  },
  {
    id: 8,
    name: "Chicken Curry",
    image: "/images/chickencurry.jpg",
    servings: 2,
    calories: 450,
    section: "Dinner"
  }
];

const MealPlan = () => {
  const sections = ["Breakfast", "Lunch", "Dinner"];
  
  return (
    <div className="mealplan-container">
      <h2>Weekly Meal Plan</h2>
      {sections.map((section) => (
        <div key={section} className="meal-section">
          <h3>{section}</h3>
          <div className="meal-grid">
            {sampleMealPlan
              .filter((meal) => meal.section === section)
              .map((meal) => (
                <div className="meal-card" key={meal.id}>
                  <img src={meal.image} alt={meal.name} className="meal-image" />
                  <div className="meal-details">
                    <h4>{meal.name}</h4>
                    <p><strong>Servings:</strong> {meal.servings}</p>
                    <p><strong>Calories:</strong> {meal.calories}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MealPlan;
