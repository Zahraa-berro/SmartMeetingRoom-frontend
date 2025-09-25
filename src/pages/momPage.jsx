import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MomPage = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    expectation: '',
    discussions: '',
    actionItems: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [meetingDetails, setMeetingDetails] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (meetingId) {
      fetchMeetingDetails();
    } else {
      setError('No meeting ID provided in the URL');
    }
  }, [meetingId]);

  const fetchMeetingDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      const authToken = localStorage.getItem('auth_token');
      
      const response = await fetch(`http://localhost:8000/api/getmeetings/${meetingId}`, {
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
        setMeetingDetails(data.data);
      } else {
        setError(data.message || 'Failed to fetch meeting');
      }
    } catch (err) {
      setError('Network error. Please try again. Make sure the backend is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    setError('');

    try {
      // Get CSRF cookie first (same pattern as MeetingPage)
      await axios.get('http://localhost:8000/sanctum/csrf-cookie');
      
      const authToken = localStorage.getItem('auth_token');
      
      const response = await fetch('http://localhost:8000/api/moms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': authToken ? `Bearer ${authToken}` : '',
        },
        body: JSON.stringify({
          ...formData,
          meeting_id: parseInt(meetingId)
        })
      });

      if (response.status === 401) {
        setMessage({ type: 'error', text: 'Please login to create MOM records' });
        setLoading(false);
        return;
      }

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage({ type: 'success', text: 'MOM record created successfully!' });
        setFormData({
          expectation: '',
          discussions: '',
          actionItems: ''
        });
        
        // Redirect after success
        setTimeout(() => {
          navigate(`/meetings/${meetingId}`);
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to create MOM record' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again. Make sure the backend is running on port 8000.' });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToMeeting = () => {
    navigate(`/meetings/${meetingId}`);
  };

  const handleRefresh = () => {
    fetchMeetingDetails();
  };

  if (!meetingId) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h2 style={styles.errorTitle}>Error</h2>
          <p>No meeting ID provided in the URL.</p>
          <button 
            onClick={() => navigate('/BookingPage')}
            style={getButtonStyle('secondary', false)}
          >
            Back to Booking
          </button>
        </div>
      </div>
    );
  }

  if (loading && !meetingDetails) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.loadingSpinner}></div>
          <p style={{ textAlign: 'center' }}>Loading meeting details...</p>
        </div>
      </div>
    );
  }

  if (error && !meetingDetails) {
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
              onClick={() => navigate('/BookingPage')}
              style={getButtonStyle('secondary', false)}
            >
              Back to Booking
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Add Minutes of Meeting</h1>
            {meetingDetails && (
              <p style={styles.meetingInfo}>
                For: {meetingDetails.title || `Meeting #${meetingId}`}
              </p>
            )}
          </div>
          <div style={styles.actions}>
            <button 
              onClick={handleBackToMeeting}
              style={getButtonStyle('secondary', loading)}
              disabled={loading}
            >
              ← Back to Meeting
            </button>
            <button 
              onClick={handleRefresh} 
              style={getButtonStyle('secondary', loading)}
              disabled={loading}
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {message.text && (
          <div style={{
            ...styles.message,
            backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
            color: message.type === 'success' ? '#166534' : '#dc2626',
            borderColor: message.type === 'success' ? '#bbf7d0' : '#fecaca'
          }}>
            {message.type === 'success' ? '✅' : '⚠️'} {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Expectations Field */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Expectations *</label>
            <textarea
              name="expectation"
              value={formData.expectation}
              onChange={handleInputChange}
              required
              rows={4}
              style={styles.textarea}
              placeholder="Enter the meeting expectations and objectives..."
              disabled={loading}
            />
          </div>

          {/* Discussions Field */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Discussions *</label>
            <textarea
              name="discussions"
              value={formData.discussions}
              onChange={handleInputChange}
              required
              rows={6}
              style={styles.textarea}
              placeholder="Enter the main points discussed during the meeting..."
              disabled={loading}
            />
          </div>

          {/* Action Items Field */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Action Items *</label>
            <textarea
              name="actionItems"
              value={formData.actionItems}
              onChange={handleInputChange}
              required
              rows={4}
              style={styles.textarea}
              placeholder="Enter the action items, responsibilities, and deadlines..."
              disabled={loading}
            />
            <p style={styles.helpText}>
              List each action item on a separate line or use bullet points
            </p>
          </div>

          {/* Buttons */}
          <div style={styles.formButtons}>
            <button
              type="button"
              onClick={handleBackToMeeting}
              style={getButtonStyle('secondary', loading)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={getButtonStyle('primary', loading)}
            >
              {loading ? (
                <>
                  <div style={styles.buttonSpinner}></div>
                  Creating...
                </>
              ) : (
                'Create MOM Record'
              )}
            </button>
          </div>
        </form>

      
      </div>
    </div>
  );
};

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
  meetingInfo: {
    fontSize: '1.1rem',
    color: '#666',
    margin: '5px 0 0 0',
  },
  actions: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
  },
  form: {
    width: '100%',
  },
  formGroup: {
    marginBottom: '25px',
  },
  label: {
    display: 'block',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '8px',
    fontSize: '1rem',
  },
  textarea: {
    width: '100%',
    padding: '15px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '120px',
    transition: 'border-color 0.3s ease',
    backgroundColor: 'white',
  },
  helpText: {
    fontSize: '0.9rem',
    color: '#718096',
    marginTop: '5px',
    fontStyle: 'italic',
  },
  formButtons: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'flex-end',
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #e2e8f0',
  },
  message: {
    padding: '15px 20px',
    borderRadius: '10px',
    border: '1px solid',
    marginBottom: '25px',
    fontWeight: '500',
    textAlign: 'center',
  },
  helpSection: {
    marginTop: '30px',
    padding: '20px',
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    borderRadius: '15px',
    borderLeft: '4px solid #667eea',
  },
  helpTitle: {
    color: '#2d3748',
    margin: '0 0 15px 0',
    fontSize: '1.2rem',
    fontWeight: '600',
  },
  helpList: {
    color: '#2d3748',
    margin: '0',
    paddingLeft: '20px',
    lineHeight: '1.6',
  },
  loadingSpinner: {
    width: '20px',
    height: '20px',
    border: '2px solid transparent',
    borderTop: '2px solid currentColor',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    display: 'inline-block',
  },
  buttonSpinner: {
    width: '16px',
    height: '16px',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '40px',
    background: 'white',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
    margin: '50px auto',
  },
  errorTitle: {
    color: '#e53e3e',
    marginBottom: '15px',
    fontSize: '1.5rem',
  }
};

const getButtonStyle = (type, isDisabled) => {
  const baseStyle = {
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
  };

  const hoverStyle = isDisabled ? {} : {
    transform: 'translateY(-2px)',
  };

  switch (type) {
    case 'primary':
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        color: 'white',
        ...hoverStyle,
        ...(isDisabled && { opacity: '0.6', cursor: 'not-allowed' })
      };
    case 'secondary':
      return {
        ...baseStyle,
        background: '#e2e8f0',
        color: '#4a5568',
        ...hoverStyle,
        ...(isDisabled && { opacity: '0.6', cursor: 'not-allowed' })
      };
    default:
      return baseStyle;
  }
};

export default MomPage;