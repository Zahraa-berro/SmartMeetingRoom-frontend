import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContexts';

const RoomAvailabilityChecker = () => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const { hasRole } = useAuth();

  const handleManageRoom = () => {
    if (hasRole('admin')) {
      navigate('/admin');
    } else {
      setError('Access denied. Admin privileges required.');
    }
  };

  const handleCheckAvailability = async (e) => {
    if (e) e.preventDefault();
    
    if (!date || !startTime || !duration) {
        setError('Please fill all fields');
        return;
    }

    setLoading(true);
    setError('');
    setAvailableRooms([]);
    
    try {
        await axios.get('http://localhost:8000/sanctum/csrf-cookie');
        
        const token = localStorage.getItem('auth_token');
        
        const response = await fetch('http://localhost:8000/api/rooms/check-availability', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({
                date: date,
                start_time: startTime,
                duration: parseInt(duration)
            })
        });

        if (response.status === 401) {
            setError('Please login to check room availability');
            setLoading(false);
            return;
        }

        const data = await response.json();
        console.log('Backend response:', data);

        if (data.success) {
            setAvailableRooms(data.data.available_rooms || []);
            if (data.data.available_rooms.length === 0) {
                setError('No rooms available for the selected time slot');
            }
        } else {
            setError(data.message || 'Failed to check room availability');
        }
    } catch (error) {
        console.error('API call failed:', error);
        setError('Cannot connect to server. Make sure the backend is running on port 8000.');
    } finally {
        setLoading(false);
    }
  };

  const clearResults = () => {
    setAvailableRooms([]);
    setError('');
  };

  const handleRoomSelect = (room) => {
    navigate('/BookingPage', {
      state: {
        selectedRoom: room,
        formData: {
          date: date,
          time: startTime,
          duration: duration,
          room: room.name
        }
      }
    });
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Room Availability Checker</h1>
        <p style={styles.description}>Find available rooms for your meeting</p>
        
        <div style={styles.headerButtons}>
          <button onClick={clearResults} style={styles.headerButton}>
            Clear Results
          </button>

          {hasRole('admin') && (
            <button 
              onClick={handleManageRoom} 
              style={styles.manageButton}
              title="Manage rooms"
            >
              Manage Rooms
            </button>
          )}
        </div>
      </header>

      <section style={styles.searchPanel}>
        <form onSubmit={handleCheckAvailability} style={styles.searchForm}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Date</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                style={styles.input} 
                required 
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Start Time</label>
              <input 
                type="time" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)} 
                style={styles.input} 
                required 
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Duration (minutes)</label>
              <input 
                type="number" 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)} 
                style={styles.input} 
                min="1"
                max="480"
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            style={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Checking Availability...' : 'Check Availability'}
          </button>
        </form>

        {error && (
          <div style={styles.error}>
            ⚠️ {error}
          </div>
        )}
      </section>

      <section style={styles.resultsContainer}>
        {loading && (
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            Checking room availability...
          </div>
        )}

        {!loading && availableRooms.length > 0 && (
          <>
            <h2 style={styles.resultsTitle}>
              Available Rooms ({availableRooms.length})
            </h2>
            <div style={styles.roomsGrid}>
              {availableRooms.map(room => (
                <div key={room.id} style={styles.roomCard}>
                  <div style={styles.roomHeader}>
                    <h3 style={styles.roomName}>{room.name}</h3>
                    <span style={styles.roomCapacity}>{room.capacity} people</span>
                  </div>
                  
                  <div style={styles.roomDetails}>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Location:</span>
                      <span>{room.location}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Status:</span>
                      <span style={styles.statusAvailable}>Available</span>
                    </div>
                  </div>

                  {room.features && room.features.length > 0 && (
                    <div style={styles.featuresSection}>
                      <h4 style={styles.featuresTitle}>Features:</h4>
                      <div style={styles.featuresList}>
                        {room.features.map((feature, index) => (
                          <span key={index} style={styles.featureTag}>
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    style={styles.selectButton}
                    onClick={() => handleRoomSelect(room)}
                  >
                    Select Room
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && availableRooms.length === 0 && !error && (
          <div style={styles.placeholder}>
            <div style={styles.placeholderIcon}>🏢</div>
            <p>Enter meeting details to check room availability</p>
            <p style={styles.placeholderSub}>Select date, time, and duration above</p>
          </div>
        )}
      </section>
    </div>
  );
};

const styles = {
  container: { 
    maxWidth: 1200,
    margin: '20px auto', 
    backgroundColor: 'white',
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  header: { 
    background: 'linear-gradient(135deg, #4a6fa5, #2c5282)',
    color: 'white', 
    padding: '30px',
    textAlign: 'center'
  },
  title: { 
    fontSize: '2.2rem', 
    marginBottom: 10,
    fontWeight: 'bold'
  },
  description: { 
    fontSize: '1.1rem',
    opacity: 0.9,
    marginBottom: 20
  },
  headerButtons: {
    display: 'flex',
    gap: 10,
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  headerButton: {
    background: 'rgba(255,255,255,0.15)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.3)',
    padding: '8px 16px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background 0.2s',
    '&:hover': {
      background: 'rgba(255,255,255,0.25)'
    }
  },
  manageButton: {
    background: 'rgba(255,255,255,0.15)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.3)',
    padding: '8px 16px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
    fontWeight: '500',
    '&:hover': {
      background: 'rgba(255,255,255,0.25)'
    }
  },
  searchPanel: { 
    padding: 30,
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0'
  },
  searchForm: {
    maxWidth: 600,
    margin: '0 auto'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 20,
    marginBottom: 25
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: { 
    fontWeight: 600, 
    marginBottom: 8,
    color: '#374151',
    fontSize: '0.9rem'
  },
  input: { 
    padding: '12px 16px',
    borderRadius: 8,
    border: '2px solid #e5e7eb',
    fontSize: '1rem',
    backgroundColor: 'white',
    transition: 'border-color 0.2s',
    '&:focus': {
      outline: 'none',
      borderColor: '#4a6fa5'
    }
  },
  submitButton: {
    width: '100%',
    padding: '15px',
    background: 'linear-gradient(135deg, #4a6fa5, #2c5282)',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.1s',
    '&:hover': {
      transform: 'translateY(-1px)'
    },
    '&:disabled': {
      opacity: 0.7,
      cursor: 'not-allowed',
      transform: 'none'
    }
  },
  error: {
    marginTop: 20,
    padding: '15px',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    borderRadius: 8,
    border: '1px solid #fecaca',
    textAlign: 'center'
  },
  resultsContainer: {
    padding: 30,
    minHeight: 300
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    color: '#64748b'
  },
  spinner: {
    width: 40,
    height: 40,
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #4a6fa5',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: 15
  },
  resultsTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 25,
    textAlign: 'center'
  },
  roomsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 20
  },
  roomCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 15px rgba(0,0,0,0.12)'
    }
  },
  roomHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: 15
  },
  roomName: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0,
    flex: 1
  },
  roomCapacity: {
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    padding: '4px 8px',
    borderRadius: 12,
    fontSize: '0.8rem',
    fontWeight: '500',
    marginLeft: 10
  },
  roomDetails: {
    marginBottom: 15
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #f3f4f6'
  },
  detailLabel: {
    fontWeight: '500',
    color: '#6b7280',
    fontSize: '0.9rem'
  },
  statusAvailable: {
    color: '#059669',
    fontWeight: '600',
    fontSize: '0.9rem'
  },
  featuresSection: {
    marginBottom: 20,
    padding: '12px 0',
    borderTop: '1px solid #f3f4f6',
    borderBottom: '1px solid #f3f4f6'
  },
  featuresTitle: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#374151',
    margin: '0 0 10px 0'
  },
  featuresList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px'
  },
  featureTag: {
    backgroundColor: '#f0f9ff',
    color: '#0369a1',
    padding: '4px 8px',
    borderRadius: 12,
    fontSize: '0.75rem',
    fontWeight: '500',
    border: '1px solid #bae6fd'
  },
  selectButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#059669',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginTop: 'auto',
    '&:hover': {
      backgroundColor: '#047857'
    }
  },
  placeholder: {
    textAlign: 'center',
    padding: 60,
    color: '#6b7280'
  },
  placeholderIcon: {
    fontSize: '3rem',
    marginBottom: 15,
    opacity: 0.5
  },
  placeholderSub: {
    fontSize: '0.9rem',
    marginTop: 5,
    color: '#9ca3af'
  }
};

// Add CSS animation for the spinner
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);

export default RoomAvailabilityChecker;