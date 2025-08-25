import React from 'react';
import { FaBell, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const Notifications = ({ items }) => {
  const getIcon = (type) => {
    switch(type) {
      case 'alert':
        return <FaExclamationTriangle className="icon" />;
      default:
        return <FaInfoCircle className="icon" />;
    }
  };

  return (
    <div className="notifications">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Notifications</h3>
        <FaBell className="text-muted" />
      </div>
      <div className="notifications-list">
        {items.map((item) => (
          <div key={item.id} className={`notification-item notification-${item.type}`}>
            <div className="notification-message">
              {getIcon(item.type)}
              <span>{item.message}</span>
            </div>
            <div className="notification-time">Just now</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;