// minutesform.jsx
import React, { useState, useEffect } from 'react';
import '../../App.css';
const MinutesForm = ({ meetingData, onSave }) => {
  // State for form data
  const [formData, setFormData] = useState({
    attendees: [],
    agendaItems: [],
    decisions: [],
    actionItems: [],
    attachments: []
  });
  
  // State for UI
  const [isEditingAttendee, setIsEditingAttendee] = useState(false);
  const [newAttendee, setNewAttendee] = useState('');
  const [newDecision, setNewDecision] = useState({ text: '', assignee: '' });
  const [newActionItem, setNewActionItem] = useState({ text: '', assignee: '', dueDate: '' });

  // Initialize form with meeting data
  useEffect(() => {
    if (meetingData) {
      setFormData({
        attendees: meetingData.attendees || [],
        agendaItems: meetingData.agendaItems || [],
        decisions: [],
        actionItems: [],
        attachments: []
      });
    }
  }, [meetingData]);

  // Handle attendee changes
  const handleAddAttendee = () => {
    if (newAttendee.trim()) {
      setFormData({
        ...formData,
        attendees: [...formData.attendees, newAttendee.trim()]
      });
      setNewAttendee('');
      setIsEditingAttendee(false);
    }
  };

  const handleRemoveAttendee = (index) => {
    const updatedAttendees = [...formData.attendees];
    updatedAttendees.splice(index, 1);
    setFormData({ ...formData, attendees: updatedAttendees });
  };

  // Handle decision changes
  const handleAddDecision = () => {
    if (newDecision.text.trim()) {
      setFormData({
        ...formData,
        decisions: [...formData.decisions, { ...newDecision, id: Date.now() }]
      });
      setNewDecision({ text: '', assignee: '' });
    }
  };

  const handleRemoveDecision = (id) => {
    setFormData({
      ...formData,
      decisions: formData.decisions.filter(decision => decision.id !== id)
    });
  };

  // Handle action item changes
  const handleAddActionItem = () => {
    if (newActionItem.text.trim()) {
      setFormData({
        ...formData,
        actionItems: [...formData.actionItems, { ...newActionItem, id: Date.now() }]
      });
      setNewActionItem({ text: '', assignee: '', dueDate: '' });
    }
  };

  const handleRemoveActionItem = (id) => {
    setFormData({
      ...formData,
      actionItems: formData.actionItems.filter(item => item.id !== id)
    });
  };

  // Handle file uploads
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      attachments: [...formData.attachments, ...files]
    });
  };

  const handleRemoveAttachment = (index) => {
    const updatedAttachments = [...formData.attachments];
    updatedAttachments.splice(index, 1);
    setFormData({ ...formData, attachments: updatedAttachments });
  };

  // Save handlers
  const handleSaveDraft = () => {
    onSave({ ...formData, status: 'draft' });
  };

  const handleFinalize = () => {
    onSave({ ...formData, status: 'finalized' });
  };

  return (
    <div className="minutes-form">
      <h2>Meeting Minutes</h2>
      
      {/* Attendees Section */}
      <div className="form-section">
        <h3>Attendees</h3>
        <div className="attendees-list">
          {formData.attendees.map((attendee, index) => (
            <div key={index} className="attendee-item">
              <span>{attendee}</span>
              <button 
                type="button" 
                onClick={() => handleRemoveAttendee(index)}
                className="remove-btn"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        {isEditingAttendee ? (
          <div className="add-attendee">
            <input
              type="text"
              value={newAttendee}
              onChange={(e) => setNewAttendee(e.target.value)}
              placeholder="Enter attendee name"
            />
            <button type="button" onClick={handleAddAttendee}>Add</button>
            <button type="button" onClick={() => setIsEditingAttendee(false)}>Cancel</button>
          </div>
        ) : (
          <button 
            type="button" 
            onClick={() => setIsEditingAttendee(true)}
            className="add-btn"
          >
            + Add Attendee
          </button>
        )}
      </div>
      
      {/* Agenda Items Section */}
      <div className="form-section">
        <h3>Agenda Items</h3>
        <ul className="agenda-list">
          {formData.agendaItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      
      {/* Decisions Section */}
      <div className="form-section">
        <h3>Decisions</h3>
        <div className="decisions-list">
          {formData.decisions.map((decision) => (
            <div key={decision.id} className="decision-item">
              <div>
                <strong>{decision.text}</strong>
                {decision.assignee && <span> - Assigned to: {decision.assignee}</span>}
              </div>
              <button 
                type="button" 
                onClick={() => handleRemoveDecision(decision.id)}
                className="remove-btn"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        <div className="add-decision">
          <input
            type="text"
            value={newDecision.text}
            onChange={(e) => setNewDecision({ ...newDecision, text: e.target.value })}
            placeholder="Decision description"
          />
          <input
            type="text"
            value={newDecision.assignee}
            onChange={(e) => setNewDecision({ ...newDecision, assignee: e.target.value })}
            placeholder="Assignee"
          />
          <button type="button" onClick={handleAddDecision}>Add Decision</button>
        </div>
      </div>
      
      {/* Action Items Section */}
      <div className="form-section">
        <h3>Action Items</h3>
        <div className="action-items-list">
          {formData.actionItems.map((item) => (
            <div key={item.id} className="action-item">
              <div>
                <strong>{item.text}</strong>
                <div>
                  {item.assignee && <span>Assigned to: {item.assignee}</span>}
                  {item.dueDate && <span>Due: {item.dueDate}</span>}
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => handleRemoveActionItem(item.id)}
                className="remove-btn"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        <div className="add-action-item">
          <input
            type="text"
            value={newActionItem.text}
            onChange={(e) => setNewActionItem({ ...newActionItem, text: e.target.value })}
            placeholder="Action description"
          />
          <input
            type="text"
            value={newActionItem.assignee}
            onChange={(e) => setNewActionItem({ ...newActionItem, assignee: e.target.value })}
            placeholder="Assignee"
          />
          <input
            type="date"
            value={newActionItem.dueDate}
            onChange={(e) => setNewActionItem({ ...newActionItem, dueDate: e.target.value })}
            placeholder="Due date"
          />
          <button type="button" onClick={handleAddActionItem}>Add Action Item</button>
        </div>
      </div>
      
      {/* Attachments Section */}
      <div className="form-section">
        <h3>Attachments</h3>
        <div className="attachments-list">
          {formData.attachments.map((file, index) => (
            <div key={index} className="attachment-item">
              <span>{file.name}</span>
              <button 
                type="button" 
                onClick={() => handleRemoveAttachment(index)}
                className="remove-btn"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        <input
          type="file"
          id="file-upload"
          multiple
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <button 
          type="button"
          onClick={() => document.getElementById('file-upload').click()}
          className="add-btn"
        >
          + Add Attachment
        </button>
      </div>
      
      {/* Save Options */}
      <div className="form-actions">
        <button type="button" onClick={handleSaveDraft} className="save-draft-btn">
          Save Draft
        </button>
        <button type="button" onClick={handleFinalize} className="finalize-btn">
          Finalize & Share
        </button>
      </div>
    </div>
  );
};

export default MinutesForm;