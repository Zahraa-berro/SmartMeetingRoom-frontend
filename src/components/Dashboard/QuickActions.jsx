import React from 'react';
import { Button } from 'react-bootstrap';
import { 
  FaCalendarPlus, 
  FaVideo, 
  FaFileAlt,
  FaUserPlus
} from 'react-icons/fa';

const QuickActions = () => {
  const actions = [
    { icon: <FaCalendarPlus className="icon" />, label: 'Schedule Meeting' },
    { icon: <FaVideo className="icon" />, label: 'Join Now' },
    { icon: <FaFileAlt className="icon" />, label: 'View Minutes' },
    { icon: <FaUserPlus className="icon" />, label: 'Add Member' }
  ];

  return (
    <div className="quick-actions">
      <h3>Quick Actions</h3>
      <div className="quick-actions-grid">
        {actions.map((action, index) => (
          <Button 
            key={index} 
            variant="light" 
            className="action-btn"
          >
            {action.icon}
            <span>{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;