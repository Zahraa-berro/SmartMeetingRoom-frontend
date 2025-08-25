// minutesreview.jsx
import React, { useState } from 'react';
import '../../App.css';

const MinutesReview = ({ minute, onBack, onEdit, onExport, onShare }) => {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [shareEmail, setShareEmail] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  if (!minute) {
    return (
      <div className="minutes-review">
        <div className="no-minute-selected">
          <p>No meeting minutes selected</p>
          <button onClick={onBack}>Back to List</button>
        </div>
      </div>
    );
  }

  const handleExport = () => {
    onExport(minute, exportFormat);
  };

  const handleShare = () => {
    if (shareEmail.trim() === '') {
      alert('Please enter a valid email address');
      return;
    }
    onShare(minute, shareEmail);
    setShareEmail('');
    setIsSharing(false);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="minutes-review">
      {/* Header */}
      <div className="review-header">
        <button onClick={onBack} className="back-button">
          &larr; Back to List
        </button>
        <div className="header-actions">
          <button onClick={() => onEdit(minute)} className="edit-button">
            Edit
          </button>
          <div className="export-dropdown">
            <select 
              value={exportFormat} 
              onChange={(e) => setExportFormat(e.target.value)}
            >
              <option value="pdf">PDF</option>
              <option value="docx">Word</option>
              <option value="txt">Text</option>
            </select>
            <button onClick={handleExport} className="export-button">
              Export
            </button>
          </div>
          <button 
            onClick={() => setIsSharing(!isSharing)} 
            className="share-button"
          >
            Share
          </button>
        </div>
      </div>

      {/* Share Panel */}
      {isSharing && (
        <div className="share-panel">
          <h3>Share Minutes</h3>
          <div className="share-controls">
            <input
              type="email"
              placeholder="Enter email address"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
            />
            <button onClick={handleShare}>Send</button>
            <button onClick={() => setIsSharing(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Minutes Content */}
      <div className="minutes-content">
        <div className="minutes-meta">
          <h1>{minute.title}</h1>
          <div className="meta-details">
            <div className="meta-item">
              <span className="meta-label">Date:</span>
              <span className="meta-value">{formatDate(minute.date)}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Status:</span>
              <span className={`status-badge ${minute.status}`}>
                {minute.status}
              </span>
            </div>
          </div>
        </div>

        {/* Attendees Section */}
        <section className="review-section">
          <h2>Attendees</h2>
          <div className="attendees-list">
            {minute.attendees.map((attendee, index) => (
              <div key={index} className="attendee-item">
                {attendee}
              </div>
            ))}
          </div>
        </section>

        {/* Agenda Items Section */}
        <section className="review-section">
          <h2>Agenda</h2>
          <ol className="agenda-list">
            {minute.agendaItems.map((item, index) => (
              <li key={index} className="agenda-item">
                {item}
              </li>
            ))}
          </ol>
        </section>

        {/* Decisions Section */}
        <section className="review-section">
          <h2>Decisions</h2>
          {minute.decisions && minute.decisions.length > 0 ? (
            <div className="decisions-list">
              {minute.decisions.map((decision, index) => (
                <div key={index} className="decision-item">
                  <div className="decision-text">{decision.text}</div>
                  {decision.assignee && (
                    <div className="decision-assignee">
                      <strong>Assigned to:</strong> {decision.assignee}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-items">No decisions were recorded.</p>
          )}
        </section>

        {/* Action Items Section */}
        <section className="review-section">
          <h2>Action Items</h2>
          {minute.actionItems && minute.actionItems.length > 0 ? (
            <div className="action-items-list">
              {minute.actionItems.map((item, index) => (
                <div key={index} className="action-item">
                  <div className="action-text">{item.text}</div>
                  <div className="action-details">
                    {item.assignee && (
                      <div className="action-assignee">
                        <strong>Assigned to:</strong> {item.assignee}
                      </div>
                    )}
                    {item.dueDate && (
                      <div className="action-duedate">
                        <strong>Due:</strong> {formatDate(item.dueDate)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-items">No action items were assigned.</p>
          )}
        </section>

        {/* Attachments Section */}
        {minute.attachments && minute.attachments.length > 0 && (
          <section className="review-section">
            <h2>Attachments</h2>
            <div className="attachments-list">
              {minute.attachments.map((attachment, index) => (
                <div key={index} className="attachment-item">
                  <span className="attachment-icon">📎</span>
                  <span className="attachment-name">{attachment.name}</span>
                  <button className="download-button">Download</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <div className="minutes-footer">
          <p>Minutes generated on {formatDate(minute.createdAt || minute.date)}</p>
        </div>
      </div>
    </div>
  );
};

export default MinutesReview;