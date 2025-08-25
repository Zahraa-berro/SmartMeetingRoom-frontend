import React, { useState } from 'react';
import '../../App.css';
const MeetingListItem = ({ 
  meeting, 
  onEdit, 
  onExport, 
  onShare 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(meeting.id);
  };

  const handleExport = (e, format) => {
    e.stopPropagation();
    onExport(meeting.id, format);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    onShare(meeting.id);
  };

  return (
    <div className="meeting-item" onClick={toggleExpand}>
      <div className="meeting-header">
        <div className="meeting-title-section">
          <h3 className="meeting-title">{meeting.title}</h3>
          <span className="meeting-date">{formatDate(meeting.date)}</span>
        </div>
        
        <div className="action-badges">
          {meeting.actionItems.filter(item => item.status === 'pending').length > 0 && (
            <span className="badge pending">
              {meeting.actionItems.filter(item => item.status === 'pending').length} Pending
            </span>
          )}
          {meeting.actionItems.filter(item => item.status === 'completed').length > 0 && (
            <span className="badge completed">
              {meeting.actionItems.filter(item => item.status === 'completed').length} Completed
            </span>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="meeting-details">
          <div className="attendees-section">
            <h4>Attendees</h4>
            <div className="attendees-list">
              {meeting.attendees.map((attendee, index) => (
                <span key={index} className="attendee-tag">{attendee}</span>
              ))}
            </div>
          </div>

          <div className="minutes-section">
            <h4>Minutes Summary</h4>
            <p className="minutes-text">{meeting.minutes}</p>
          </div>

          <div className="action-items-section">
            <h4>Action Items</h4>
            <div className="action-items-list">
              {meeting.actionItems.map((item, index) => (
                <div key={index} className={`action-item ${item.status}`}>
                  <div className="action-content">
                    <span className="action-text">{item.task}</span>
                    <span className="assignee">{item.assignee}</span>
                  </div>
                  <span className={`status ${item.status}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="meeting-actions">
            <button className="btn btn-edit" onClick={handleEdit}>
              Edit
            </button>
            <div className="export-buttons">
              <button 
                className="btn btn-export" 
                onClick={(e) => handleExport(e, 'PDF')}
              >
                Export PDF
              </button>
              <button 
                className="btn btn-export" 
                onClick={(e) => handleExport(e, 'DOC')}
              >
                Export DOC
              </button>
            </div>
            <button className="btn btn-share" onClick={handleShare}>
              Share
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingListItem;