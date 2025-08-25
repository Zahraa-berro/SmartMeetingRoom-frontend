import React, { useState, useEffect } from 'react';
import '../../App.css';

const ActiveMeeting = () => {
  const [isMeetingActive, setIsMeetingActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [transcriptionEnabled, setTranscriptionEnabled] = useState(true);
  const [transcriptionLines, setTranscriptionLines] = useState([
    { speaker: "John Doe", text: "Welcome everyone to our quarterly planning meeting." },
    { speaker: "Alice Smith", text: "Thanks John. I've prepared the presentation for our upcoming projects." },
    { speaker: "Robert Johnson", text: "Looking forward to seeing the roadmap for next quarter." }
  ]);

  // Timer functionality
  useEffect(() => {
    let interval = null;
    if (isMeetingActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isMeetingActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isMeetingActive, seconds]);

  const formatTime = () => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStartMeeting = () => {
    setIsMeetingActive(true);
    if (transcriptionEnabled) {
      setTranscriptionLines(prev => [
        ...prev,
        { speaker: "System", text: "Meeting started." }
      ]);
    }
  };

  const handleEndMeeting = () => {
    setIsMeetingActive(false);
    setSeconds(0);
    if (transcriptionEnabled) {
      setTranscriptionLines(prev => [
        ...prev,
        { speaker: "System", text: "Meeting ended." }
      ]);
    }
    alert('Meeting has ended. Summary is being generated.');
  };

  const handleTakeNotes = () => {
    alert('Opening meeting minutes template...');
  };

  const toggleTranscription = () => {
    setTranscriptionEnabled(!transcriptionEnabled);
  };

  // Simulate live transcription
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
          
          setTranscriptionLines(prev => [
            ...prev,
            { speaker: participant, text: message }
          ]);
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isMeetingActive, transcriptionEnabled]);

  return (
    <div className="meeting-container">
      <div className="meeting-header">
        <div className="meeting-title">Quarterly Planning Meeting</div>
        <div className="meeting-time">
          <i className="far fa-clock"></i>
          <span>10:00 AM - 11:30 AM</span>
        </div>
      </div>

      <div className="meeting-content">
        <div className="attendees-section">
          <div className="section-title">
            <i className="fas fa-users"></i>
            <span>Attendees (6)</span>
          </div>
          <div className="attendees-list">
            <div className="attendee">
              <div className="attendee-avatar">JD</div>
              <div className="attendee-info">
                <div className="attendee-name">John Doe</div>
                <div className="attendee-role">Organizer</div>
              </div>
            </div>
            <div className="attendee">
              <div className="attendee-avatar">AS</div>
              <div className="attendee-info">
                <div className="attendee-name">Alice Smith</div>
                <div className="attendee-role">Presenter</div>
              </div>
            </div>
            <div className="attendee">
              <div className="attendee-avatar">RJ</div>
              <div className="attendee-info">
                <div className="attendee-name">Robert Johnson</div>
                <div className="attendee-role">Participant</div>
              </div>
            </div>
            <div className="attendee">
              <div className="attendee-avatar">EW</div>
              <div className="attendee-info">
                <div className="attendee-name">Emma Wilson</div>
                <div className="attendee-role">Participant</div>
              </div>
            </div>
            <div className="attendee">
              <div className="attendee-avatar">MB</div>
              <div className="attendee-info">
                <div className="attendee-name">Michael Brown</div>
                <div className="attendee-role">Participant</div>
              </div>
            </div>
            <div className="attendee">
              <div className="attendee-avatar">SD</div>
              <div className="attendee-info">
                <div className="attendee-name">Sarah Davis</div>
                <div className="attendee-role">Participant</div>
              </div>
            </div>
          </div>
        </div>

        <div className="controls-section">
          <div className="control-button" onClick={handleTakeNotes}>
            <div className="control-icon">
              <i className="fas fa-sticky-note"></i>
            </div>
            <div className="control-text">Take Notes</div>
          </div>
          <div className="control-button">
            <div className="control-icon">
              <i className="fas fa-share-square"></i>
            </div>
            <div className="control-text">Share Screen</div>
          </div>
          <div className="control-button">
            <div className="control-icon">
              <i className="fas fa-user-plus"></i>
            </div>
            <div className="control-text">Invite Participant</div>
          </div>
          <div className="control-button">
            <div className="control-icon">
              <i className="fas fa-video"></i>
            </div>
            <div className="control-text">Record Meeting</div>
          </div>
        </div>

        <div className="timer-control">
          <div className="timer-display">{formatTime()}</div>
          <button 
            className={`timer-button ${isMeetingActive ? 'pause-button' : ''}`}
            onClick={isMeetingActive ? () => setIsMeetingActive(false) : handleStartMeeting}
          >
            {isMeetingActive ? 'Pause Meeting' : 'Start Meeting'}
          </button>
          <button className="timer-button end-button" onClick={handleEndMeeting}>
            End Meeting
          </button>
        </div>

        <div className="transcription-section">
          <div className="transcription-toggle">
            <span className="section-title">Live Transcription</span>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={transcriptionEnabled}
                onChange={toggleTranscription}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          {transcriptionEnabled && (
            <div className="transcription-text">
              {transcriptionLines.map((line, index) => (
                <div key={index} className="transcription-line">
                  <strong>{line.speaker}:</strong> {line.text}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="integration-section">
          <div className="integration-title">
            <i className="fas fa-link"></i>
            <span>Integration Links</span>
          </div>
          <div className="integration-buttons">
            <div className="integration-button">
              <i className="fas fa-video zoom-icon"></i>
              <span>Join via Zoom</span>
            </div>
            <div className="integration-button">
              <i className="fas fa-video teams-icon"></i>
              <span>Join via Teams</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveMeeting;