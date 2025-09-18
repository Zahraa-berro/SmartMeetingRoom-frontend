import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContexts';

const Profile = () => {
  const { user: authUser, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [updateMessage, setUpdateMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    axios.defaults.withCredentials = true;
    getCsrfToken();
  }, []);

  const getCsrfToken = async () => {
    try {
      await axios.get('/sanctum/csrf-cookie');
    } catch (err) {
      console.error('Error getting CSRF token:', err);
    }
  };

  useEffect(() => {
    if (authUser?.id) {
      fetchUserData();
    }
  }, [authUser?.id]);

  const fetchUserData = async () => {
  try {
    setLoading(true);
    const response = await axios.get(`/api/getuser/${authUser?.id}`);
    
    console.log('Backend response:', response.data);
    
    if(response.data.status === 200){
      setEditForm({
        firstName: response.data.data.firstName || '',
        lastName: response.data.data.lastName || '',
        email: response.data.data.email || '',
        password: ''
      });
      setError('');
    }
  } catch (err) {
    setError('Failed to fetch user data');
    console.error('Error fetching user:', err);
  } finally {
    setLoading(false);
  }
};

  const handleEditClick = () => {
    setIsEditing(true);
    setUpdateMessage('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      firstName: authUser.firstName || '',
      lastName: authUser.lastName || '',
      email: authUser.email || '',
      password: ''
    });
    setUpdateMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await getCsrfToken();
    
    // Prepare data for submission
    const submitData = {
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      email: editForm.email,
      password: editForm.password || 'placeholder' // Always send password, even if empty
    };
    
    const response = await axios.put(`/api/update/${authUser?.id}`, submitData);
    
    console.log('Update response:', response.data);
    
    if (response.data.status === 200) {
      setUser(response.data.data);
      setIsEditing(false);
      setUpdateMessage('Profile updated successfully!');
      setTimeout(() => setUpdateMessage(''), 3000);
      setError('');
    } 
  } catch (err) {
    console.error('Error updating user:', err);
    
    if (err.response?.data?.errors) {
      // Handle specific validation errors
      const errors = err.response.data.errors;
      
      if (errors.password && errors.password.includes('required')) {
        setError('Password is required. Please enter a password with at least 6 characters.');
      } else {
        setError('Validation errors: ' + JSON.stringify(errors));
      }
    } else if (err.response?.data?.message) {
      setError(err.response.data.message);
    } else {
      setError('Failed to update profile');
    }
  }
};

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error && !authUser) {
    return (
      <div className="profile-error">
        <div className="error-icon">⚠️</div>
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button onClick={fetchUserData} className="retry-button">Try Again</button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-background">
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
        <div className="bg-shape bg-shape-3"></div>
      </div>
      
      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="user-card">
            <div className="avatar">
              {authUser.firstName?.charAt(0)}{authUser.lastName?.charAt(0)}
            </div>
            <h2>{authUser.firstName} {authUser.lastName}</h2>
            <p>{authUser.email}</p>
            
          </div>
          
          <div className="sidebar-menu">
            <button 
              className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="menu-icon">👤</span>
              Profile
            </button>
           
          </div>
        </div>
        
        <div className="profile-main">
          <div className="profile-header">
            <h1>User Profile</h1>
            <p>Manage your account information and preferences</p>
          </div>
          
          {updateMessage && (
            <div className="success-message">
              <span className="success-icon">✅</span>
              {updateMessage}
            </div>
          )}

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {!isEditing ? (
            <div className="profile-details">
              <div className="detail-section">
                <h2>Personal Information</h2>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>First Name</label>
                    <p>{authUser.firstName}</p>
                  </div>
                  <div className="detail-item">
                    <label>Last Name</label>
                    <p>{authUser.lastName}</p>
                  </div>
                  <div className="detail-item full-width">
                    <label>Email Address</label>
                    <p>{authUser.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h2>Account Status</h2>
                <div className="status-card">
                  
                  <div className="status-item">
                    <span className="status-icon">⭐</span>
                    <div>
                      <h4>Company Member</h4>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleEditClick}
                className="edit-button"
              >
                <span className="button-icon">✏️</span>
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="edit-form">
              <div className="form-section">
                <h2>Edit Personal Information</h2>
                <div className="form-grid">
                  <div className="input-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={editForm.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={editForm.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="input-group full-width">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="input-group full-width">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={editForm.password}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="save-button"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <style jsx>{`
        /* Base Styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .profile-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #6e8efb, #a777e3);
          position: relative;
          overflow: hidden;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .profile-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }
        
        .bg-shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
        }
        
        .bg-shape-1 {
          width: 300px;
          height: 300px;
          top: -100px;
          left: -100px;
        }
        
        .bg-shape-2 {
          width: 500px;
          height: 500px;
          bottom: -150px;
          right: -150px;
        }
        
        .bg-shape-3 {
          width: 200px;
          height: 200px;
          top: 50%;
          left: 70%;
        }
        
        .profile-content {
          display: flex;
          max-width: 1200px;
          width: 100%;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          z-index: 1;
        }
        
        .profile-sidebar {
          width: 300px;
          background: rgba(255, 255, 255, 0.1);
          padding: 25px;
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .user-card {
          text-align: center;
          padding: 20px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          margin-bottom: 20px;
        }
        
        .avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6e8efb, #a777e3);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 15px;
          font-size: 28px;
          font-weight: bold;
          color: white;
        }
        
        .user-card h2 {
          color: white;
          margin-bottom: 5px;
          font-size: 18px;
        }
        
        .user-card p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          margin-bottom: 15px;
        }
        
        .user-stats {
          display: flex;
          justify-content: space-around;
          margin-top: 15px;
        }
        
        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .stat-value {
          color: white;
          font-weight: bold;
          font-size: 16px;
        }
        
        .stat-label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 12px;
        }
        
        .sidebar-menu {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .menu-item {
          display: flex;
          align-items: center;
          padding: 12px 15px;
          background: transparent;
          border: none;
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .menu-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }
        
        .menu-item.active {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }
        
        .menu-icon {
          margin-right: 10px;
          font-size: 18px;
        }
        
        .profile-main {
          flex: 1;
          padding: 30px;
          background: white;
        }
        
        .profile-header {
          margin-bottom: 30px;
        }
        
        .profile-header h1 {
          font-size: 28px;
          color: #333;
          margin-bottom: 5px;
        }
        
        .profile-header p {
          color: #666;
          font-size: 16px;
        }
        
        .success-message {
          background: #d4edda;
          color: #155724;
          padding: 12px 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
        }
        
        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 12px 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
        }
        
        .success-icon, .error-icon {
          margin-right: 10px;
          font-size: 18px;
        }
        
        .profile-details {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }
        
        .detail-section h2 {
          font-size: 20px;
          color: #444;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }
        
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .detail-item {
          margin-bottom: 15px;
        }
        
        .detail-item.full-width {
          grid-column: span 2;
        }
        
        .detail-item label {
          display: block;
          color: #777;
          font-size: 14px;
          margin-bottom: 5px;
        }
        
        .detail-item p {
          color: #333;
          font-size: 16px;
          font-weight: 500;
        }
        
        .status-card {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .status-item {
          display: flex;
          align-items: center;
          padding: 15px;
          background: #f9f9f9;
          border-radius: 10px;
          border-left: 4px solid #ddd;
        }
        
        .status-item.verified {
          border-left-color: #28a745;
        }
        
        .status-icon {
          font-size: 24px;
          margin-right: 15px;
        }
        
        .status-item h4 {
          color: #333;
          margin-bottom: 3px;
          font-size: 16px;
        }
        
        .status-item p {
          color: #666;
          font-size: 14px;
        }
        
        .edit-button {
          background: linear-gradient(135deg, #6e8efb, #a777e3);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 200px;
          margin-top: 10px;
          transition: all 0.3s ease;
        }
        
        .edit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(106, 142, 251, 0.4);
        }
        
        .button-icon {
          margin-right: 8px;
        }
        
        .edit-form {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }
        
        .form-section h2 {
          font-size: 20px;
          color: #444;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .input-group {
          margin-bottom: 15px;
        }
        
        .input-group.full-width {
          grid-column: span 2;
        }
        
        .input-group label {
          display: block;
          color: #333;
          font-size: 14px;
          margin-bottom: 8px;
          font-weight: 500;
        }
        
        .input-group input {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s ease;
        }
        
        .input-group input:focus {
          outline: none;
          border-color: #6e8efb;
          box-shadow: 0 0 0 3px rgba(110, 142, 251, 0.2);
        }
        
        .input-hint {
          color: #777;
          font-size: 13px;
          margin-top: 5px;
        }
        
        .form-actions {
          display: flex;
          gap: 15px;
          margin-top: 10px;
        }
        
        .save-button {
          background: linear-gradient(135deg, #6e8efb, #a777e3);
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .save-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(106, 142, 251, 0.4);
        }
        
        .cancel-button {
          background: #f8f9fa;
          color: #333;
          border: 1px solid #ddd;
          padding: 12px 25px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .cancel-button:hover {
          background: #e9ecef;
        }
        
        .profile-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          color: white;
        }
        
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 20px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .profile-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          color: white;
          text-align: center;
          padding: 20px;
        }
        
        .error-icon {
          font-size: 50px;
          margin-bottom: 20px;
        }
        
        .profile-error h3 {
          margin-bottom: 10px;
          font-size: 24px;
        }
        
        .retry-button {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.5);
          padding: 10px 20px;
          border-radius: 8px;
          margin-top: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .retry-button:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        @media (max-width: 900px) {
          .profile-content {
            flex-direction: column;
          }
          
          .profile-sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .detail-grid, .form-grid {
            grid-template-columns: 1fr;
          }
          
          .detail-item.full-width, .input-group.full-width {
            grid-column: 1;
          }
        }
        
        @media (max-width: 600px) {
          .user-stats {
            flex-direction: column;
            gap: 10px;
          }
          
          .form-actions {
            flex-direction: column;
          }
          
          .save-button, .cancel-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
