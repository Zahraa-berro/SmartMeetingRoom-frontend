import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContexts';
import axios from 'axios';

const MeetingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchMeeting();
    } else {
      setError('No meeting ID provided in the URL');
      setLoading(false);
    }
  }, [id]);

  const fetchMeeting = async () => {
    try {
      setLoading(true);
      setError('');
      
      const authToken = localStorage.getItem('auth_token');
      
      const response = await fetch(`http://localhost:8000/api/getmeetings/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': authToken ? `Bearer ${authToken}` : '',
        }
      });

      if (response.status === 401) {
        setError('Please login to view meeting details');
        setLoading(false);
        return;
      }

      if (response.status === 404) {
        setError('Meeting not found');
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.success) {
        setMeeting(data.data);
      } else {
        setError(data.message || 'Failed to fetch meeting');
      }
    } catch (err) {
      setError('Network error. Please try again. Make sure the backend is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeeting = async () => {
    if (!window.confirm('Are you sure you want to delete this meeting? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      
      // Get CSRF cookie first (same pattern as RoomAvailabilityChecker)
      await axios.get('http://localhost:8000/sanctum/csrf-cookie');
      
      const authToken = localStorage.getItem('auth_token');
      
      const response = await fetch(`http://localhost:8000/api/deletemeeting/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': authToken ? `Bearer ${authToken}` : '',
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 401) {
        setError('Please login to delete meetings');
        setDeleting(false);
        return;
      }

      const data = await response.json();

      if (data.success) {
        alert('Meeting deleted successfully!');
        navigate('/BookingPage');
      } else {
        setError(data.message || 'Failed to delete meeting');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleAddMoM = () => {
    navigate(`/mom/${id}`);
  };

  const handleRefresh = () => {
    fetchMeeting();
  };

  const handleBackToBooking = () => {
    navigate('/BookingPage');
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '800px',
      margin: '20px',
      backdropFilter: 'blur(10px)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '30px',
      flexWrap: 'wrap',
      gap: '20px',
    },
    title: {
      color: '#2d3748',
      fontSize: '2.5rem',
      fontWeight: '700',
      margin: '0',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    actions: {
      display: 'flex',
      gap: '15px',
      flexWrap: 'wrap',
    },
    button: {
      padding: '12px 24px',
      border: 'none',
      borderRadius: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    buttonPrimary: {
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      color: 'white',
    },
    buttonDanger: {
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
      color: 'white',
    },
    buttonSecondary: {
      background: '#e2e8f0',
      color: '#4a5568',
    },
    buttonHover: {
      transform: 'translateY(-2px)',
    },
    buttonDisabled: {
      opacity: '0.6',
      cursor: 'not-allowed',
    },
    detailSection: {
      marginBottom: '30px',
      padding: '20px',
      background: '#f7fafc',
      borderRadius: '15px',
      borderLeft: '4px solid #667eea',
    },
    sectionTitle: {
      color: '##2d3748',
      margin: '0 0 15px 0',
      fontSize: '1.3rem',
    },
    detailGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '15px',
    },
    detailItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
    },
    detailLabel: {
      fontWeight: '600',
      color: '#4a5568',
      fontSize: '0.9rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    detailValue: {
      color: '#2d3748',
      fontSize: '1.1rem',
    },
    agendaContent: {
      background: 'white',
      padding: '20px',
      borderRadius: '10px',
      border: '1px solid #e2e8f0',
    },
    noContent: {
      color: '#a0aec0',
      fontStyle: 'italic',
    },
    attendeesList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
    },
    attendeeTag: {
      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      padding: '8px 16px',
      borderRadius: '20px',
      color: '#2d3748',
      fontWeight: '500',
      fontSize: '0.9rem',
      border: '1px solid #e2e8f0',
    },
    footer: {
      marginTop: '30px',
      textAlign: 'center',
    },
    loadingSpinner: {
      width: '50px',
      height: '50px',
      border: '4px solid #e2e8f0',
      borderTop: '4px solid #667eea',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 20px',
    },
    errorContainer: {
      textAlign: 'center',
      padding: '40px',
      background: 'white',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    },
    errorTitle: {
      color: '#e53e3e',
      marginBottom: '15px',
    }
  };

  const getButtonStyle = (type, isDisabled) => {
    const baseStyle = { ...styles.button };
    const hoverStyle = isDisabled ? {} : { ...styles.buttonHover };
    
    switch (type) {
      case 'primary':
        return {
          ...baseStyle,
          ...styles.buttonPrimary,
          ...hoverStyle,
          ...(isDisabled && styles.buttonDisabled)
        };
      case 'danger':
        return {
          ...baseStyle,
          ...styles.buttonDanger,
          ...hoverStyle,
          ...(isDisabled && styles.buttonDisabled)
        };
      case 'secondary':
        return {
          ...baseStyle,
          ...styles.buttonSecondary,
          ...hoverStyle,
          ...(isDisabled && styles.buttonDisabled)
        };
      default:
        return baseStyle;
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.loadingSpinner}></div>
          <p style={{ textAlign: 'center' }}>Loading meeting details...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h2 style={styles.errorTitle}>Error</h2>
          <p>{error}</p>
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button 
              onClick={handleRefresh} 
              style={getButtonStyle('primary', false)}
            >
              🔄 Try Again
            </button>
            <button 
              onClick={handleBackToBooking}
              style={getButtonStyle('secondary', false)}
            >
              Back to Booking
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h2 style={styles.errorTitle}>Meeting Not Found</h2>
          <p>The requested meeting could not be found.</p>
          <button 
            onClick={handleBackToBooking}
            style={getButtonStyle('secondary', false)}
          >
            Back to Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>{meeting.title}</h1>
            <p style={{ fontSize: '0.9rem', color: '#666', margin: '5px 0 0 0' }}>
              Meeting ID: {meeting.id}
            </p>
          </div>
          <div style={styles.actions}>
            <button 
              onClick={handleAddMoM} 
              style={getButtonStyle('primary', deleting)}
              disabled={deleting}
            >
              📝 Add MoM
            </button>
            <button 
              onClick={handleDeleteMeeting} 
              style={getButtonStyle('danger', deleting)}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : '🗑️ Delete Meeting'}
            </button>
            <button 
              onClick={handleRefresh} 
              style={getButtonStyle('secondary', false)}
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        <div>
          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>📅 Meeting Details</h3>
            <div style={styles.detailGrid}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Date:</span>
                <span style={styles.detailValue}>{formatDate(meeting.date)}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Time:</span>
                <span style={styles.detailValue}>{formatTime(meeting.time)}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Duration:</span>
                <span style={styles.detailValue}>{meeting.duration} minutes</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Room:</span>
                <span style={styles.detailValue}>{meeting.room_name || 'No room assigned'}</span>
              </div>
            </div>
          </div>

          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>📋 Agenda</h3>
            <div style={styles.agendaContent}>
              {meeting.agenda ? (
                <p>{meeting.agenda}</p>
              ) : (
                <p style={styles.noContent}>No agenda provided for this meeting.</p>
              )}
            </div>
          </div>

          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>👥 Attendees</h3>
            <div style={styles.attendeesList}>
              {meeting.attendees ? (
                meeting.attendees.split(',').map((attendee, index) => (
                  <span key={index} style={styles.attendeeTag}>
                    {attendee.trim()}
                  </span>
                ))
              ) : (
                <p style={styles.noContent}>No attendees listed.</p>
              )}
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <button 
            onClick={handleBackToBooking}
            style={getButtonStyle('secondary', false)}
          >
            ← Back to Booking
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .meeting-container {
            padding: 10px;
          }
          
          .meeting-card {
            padding: 20px;
            margin: 10px;
          }
          
          .meeting-header {
            flex-direction: column;
            align-items: stretch;
          }
          
          .meeting-title {
            font-size: 2rem;
            text-align: center;
          }
          
          .meeting-actions {
            justify-content: center;
          }
          
          .detail-grid {
            grid-template-columns: 1fr;
          }
          
          .btn {
            width: 100%;
            justify-content: center;
          }
        }

        button:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        button:hover:not(:disabled).btn-primary {
          box-shadow: 0 8px 20px rgba(79, 172, 254, 0.3);
        }

        button:hover:not(:disabled).btn-danger {
          box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
        }
      `}</style>
    </div>
  );
};

export default MeetingPage;