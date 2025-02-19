import React, { useState } from 'react';
import './App.css';
import Signup from './Signup';
import Login from './Login';
import Profile from './Profile';
import MealPlan from './MealPlan';
import Recipes from './Recipes';
import Substitution from './Substitution';
import ShoppingList from './ShoppingList';
import Feedback from './feedback';
import Notification from './Notification';
import Ingredient from './Ingredient';

const App = () => {
  const [activeComponent, setActiveComponent] = useState('MealPlan'); // Default component
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Corrected useState initialization

  const handleLogin = () => {
    setIsLoggedIn(true);
    setActiveComponent('Profile'); // Default component after login
  };

  const handleRedirectToLogin = () => {
    setActiveComponent('Login');
  };

  return (
    <div className="App">
      <header className="navbar">
        <div className="logo-container">
          <h1 className="website-title">Automated Nutrition Planner</h1>
        </div>
        <nav className="nav-links">
          <button onClick={() => setActiveComponent('MealPlan')}>Meal Plan</button>
          <button onClick={() => setActiveComponent('Recipes')}>Recipes</button>
          <button onClick={() => setActiveComponent('Substitution')}>Substitution</button>
          <button onClick={() => setActiveComponent('ShoppingList')}>Shopping List</button>
          <button onClick={() => setActiveComponent('Profile')}>Profile</button>
          {!isLoggedIn && (
            <>
              <button onClick={() => setActiveComponent('Signup')}>Signup</button>
              <button onClick={() => setActiveComponent('Login')}>Login</button>
            </>
          )}
          {isLoggedIn && (
            <>
              <button onClick={() => setActiveComponent('Feedback')}>Feedback</button>
              <button onClick={() => setActiveComponent('Notification')}>Notification</button>
              <button onClick={() => setActiveComponent('Ingredient')}>Ingredient</button>
            </>
          )}
        </nav>
      </header>

      {activeComponent && !isLoggedIn && (
        <div className="vertical-container">
          {activeComponent === 'Signup' && <Signup onRedirectToLogin={handleRedirectToLogin} />}
          {activeComponent === 'Login' && <Login onLogin={handleLogin} />}
        </div>
      )}

      {isLoggedIn && (
        <>
          {activeComponent === 'Profile' && (
            <div className="main-content">
              <div className="text-box">
                <p>Streamlining your meal planning for a healthier lifestyle.</p>
              </div>
            </div>
          )}
          <div className="vertical-container">
            <div className="content">
              {activeComponent === 'Profile' && <Profile />}
              {activeComponent === 'MealPlan' && <MealPlan />}
              {activeComponent === 'Recipes' && <Recipes />}
              {activeComponent === 'Substitution' && <Substitution />}
              {activeComponent === 'ShoppingList' && <ShoppingList />}
              {activeComponent === 'Feedback' && <Feedback />}
              {activeComponent === 'Notification' && <Notification />}
              {activeComponent === 'Ingredient' && <Ingredient />}
            </div>
          </div>
        </>
      )}

      <div className="footer">
        &copy; 2025 Automated Nutrition Planner. All Rights Reserved.
      </div>
    </div>
  );
};

export default App;
