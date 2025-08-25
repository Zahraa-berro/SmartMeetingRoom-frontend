import React, { useState, useEffect, useRef } from 'react';
import '../../App.css';

const Transcription = ({ isMeetingActive, onTranscriptionToggle }) => {
  const [transcriptionEnabled, setTranscriptionEnabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [transcriptionLines, setTranscriptionLines] = useState([
    { speaker: "John Doe", text: "Welcome everyone to our quarterly planning meeting.", timestamp: "00:01:15" },
    { speaker: "Alice Smith", text: "Thanks John. I've prepared the presentation for our upcoming projects.", timestamp: "00:02:30" },
    { speaker: "Robert Johnson", text: "Looking forward to seeing the roadmap for next quarter.", timestamp: "00:03:45" }
  ]);
  
  const transcriptionEndRef = useRef(null);

  const toggleTranscription = () => {
    const newState = !transcriptionEnabled;
    setTranscriptionEnabled(newState);
    if (onTranscriptionToggle) {
      onTranscriptionToggle(newState);
    }
  };

  const scrollToBottom = () => {
    transcriptionEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [transcriptionLines]);

  // Simulate live transcription when meeting is active
  useEffect(() => {
    if (isMeetingActive && transcriptionEnabled) {
      const interval = setInterval(() => {
        const participants = ['John Doe', 'Alice Smith', 'Robert Johnson', 'Emma Wilson', 'Michael Brown', 'Sarah Davis'];
        const messages = [
          'I think we should consider the market trends before making a decision.',
          'The analytics from last quarter show a 15% growth in our key metrics.',
          'We need to allocate more resources to the marketing campaign.',
          'What\'s the timeline for the product launch?',
          'I\'ll prepare a detailed report on that by next week.',
          'Let\'s schedule a follow-up meeting to discuss this further.'
        ];
        
        if (Math.random() > 0.7) {
          const participant = participants[Math.floor(Math.random() * participants.length)];
          const message = messages[Math.floor(Math.random() * messages.length)];
          const hours = Math.floor(Math.random() * 2);
          const minutes = Math.floor(Math.random() * 60);
          const seconds = Math.floor(Math.random() * 60);
          const timestamp = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
          
          setTranscriptionLines(prev => [
            ...prev,
            { speaker: participant, text: message, timestamp }
          ]);
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isMeetingActive, transcriptionEnabled]);

  const handleEdit = (index) => {
    setIsEditing(true);
    setEditIndex(index);
    setEditText(transcriptionLines[index].text);
  };

  const handleSaveEdit = () => {
    if (editIndex !== null) {
      const updatedLines = [...transcriptionLines];
      updatedLines[editIndex] = {
        ...updatedLines[editIndex],
        text: editText
      };
      setTranscriptionLines(updatedLines);
      cancelEdit();
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditIndex(null);
    setEditText('');
  };

  const handleDelete = (index) => {
    const updatedLines = transcriptionLines.filter((_, i) => i !== index);
    setTranscriptionLines(updatedLines);
  };

  const exportTranscription = () => {
    const content = transcriptionLines.map(line => 
      `[${line.timestamp}] ${line.speaker}: ${line.text}`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meeting-transcription.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="transcription-section">
      <div className="transcription-header">
        <div className="transcription-title">
          <i className="fas fa-microphone"></i>
          <span>Live Transcription</span>
        </div>
        <div className="transcription-controls">
          <button 
            className="transcription-button export-button"
            onClick={exportTranscription}
            disabled={transcriptionLines.length === 0}
          >
            <i className="fas fa-download"></i>
            Export
          </button>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={transcriptionEnabled}
              onChange={toggleTranscription}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div className="transcription-status">
        <span className={`status-indicator ${transcriptionEnabled ? 'active' : 'inactive'}`}>
          {transcriptionEnabled ? 'Live' : 'Paused'}
        </span>
        <span className="transcription-count">
          {transcriptionLines.length} lines transcribed
        </span>
      </div>

      {transcriptionEnabled ? (
        <div className="transcription-text">
          {transcriptionLines.map((line, index) => (
            <div key={index} className="transcription-line">
              <div className="line-header">
                <span className="speaker-name">{line.speaker}</span>
                <span className="timestamp">{line.timestamp}</span>
                <div className="line-actions">
                  <button 
                    className="action-button edit-button"
                    onClick={() => handleEdit(index)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="action-button delete-button"
                    onClick={() => handleDelete(index)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              
              {isEditing && editIndex === index ? (
                <div className="edit-container">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="edit-textarea"
                    rows="3"
                  />
                  <div className="edit-actions">
                    <button className="save-button" onClick={handleSaveEdit}>
                      Save
                    </button>
                    <button className="cancel-button" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="line-text">{line.text}</div>
              )}
            </div>
          ))}
          <div ref={transcriptionEndRef} />
        </div>
      ) : (
        <div className="transcription-paused">
          <i className="fas fa-pause-circle"></i>
          <p>Transcription is paused</p>
          <button className="resume-button" onClick={toggleTranscription}>
            Resume Transcription
          </button>
        </div>
      )}
    </div>
  );
};

export default Transcription;