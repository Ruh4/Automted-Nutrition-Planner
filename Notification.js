import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBell } from 'react-icons/fa';
import './Notification.css';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:3030/api/notification/notifications', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  // Default messages
  const defaultMessages = [
    { id: 'default1', message: 'Welcome to your notification center!', createdAt: new Date() },
    { id: 'default2', message: 'Check out the latest updates and alerts.', createdAt: new Date() }
  ];

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      <button onClick={toggleVisibility} className="notification-toggle">
        <FaBell />
      </button>
      <div className={`notification-sidebar ${isVisible ? 'visible' : ''}`}>
        <h2>Notifications</h2>
        <div className="notification-grid">
          {defaultMessages.map((notification) => (
            <div className="notification-card" key={notification.id}>
              <p>{notification.message}</p>
            </div>
          ))}
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div className="notification-card" key={notification.id}>
                <p>{notification.message}</p>
                <small>{new Date(notification.createdAt).toLocaleString()}</small>
              </div>
            ))
          ) : (
            <p>No new notifications </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
