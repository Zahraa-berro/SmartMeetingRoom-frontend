import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContexts';

const AdminPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [availableFeatures, setAvailableFeatures] = useState([
    { id: 1, name: 'Projector' },
    { id: 2, name: 'Whiteboard' },
    { id: 3, name: 'Video Conferencing' },
    { id: 4, name: 'Teleconference' },
    { id: 5, name: 'Wheelchair Access' },
    { id: 6, name: 'Coffee Machine' }
  ]);
  const navigate = useNavigate();
  
  const { hasRole } = useAuth();

  // Form state for adding/editing rooms
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    status: 'available',
    floor: '',
    features: []
  });

  // Fetch all rooms on component mount
  useEffect(() => {
    fetchAllRooms();
  }, []);

  const fetchAllRooms = async () => {
    setLoading(true);
    setError('');
    
    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie');
      
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch('http://localhost:8000/api/rooms', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        }
      });

      if (response.status === 401) {
        setError('Please login to access admin page');
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log('Backend response:', data);

      if (data.success) {
        setRooms(data.data.rooms || []);
      } else {
        setError(data.message || 'Failed to fetch rooms');
      }
    } catch (error) {
      console.error('API call failed:', error);
      setError('Cannot connect to server. Make sure the backend is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = () => {
    setShowAddForm(true);
    setEditingRoom(null);
    setFormData({
      name: '',
      capacity: '',
      status: 'available',
      floor: '',
      features: []
    });
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setShowAddForm(true);
    setFormData({
      name: room.name,
      capacity: room.capacity,
      status: room.status || 'available',
      floor: room.floor || '',
      features: room.feature_ids || room.features.map(f => typeof f === 'object' ? f.id : f) || []
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureChange = (e) => {
    const options = e.target.options;
    const selectedFeatures = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedFeatures.push(parseInt(options[i].value));
      }
    }
    setFormData(prev => ({
      ...prev,
      features: selectedFeatures
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    
    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie');
      
      const token = localStorage.getItem('auth_token');
      
      // Prepare data for API - convert features to array of IDs and capacity to integer
      const apiData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        features: formData.features.map(id => parseInt(id))
      };
      
      const response = await fetch('http://localhost:8000/api/create-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(apiData)
      });

      const data = await response.json();

      if (data.success) {
        setShowAddForm(false);
        setEditingRoom(null);
        fetchAllRooms(); // Refresh the room list
      } else {
        setError(data.message || 'Failed to add room');
      }
    } catch (error) {
      console.error('API call failed:', error);
      setError('Cannot connect to server. Make sure the backend is running on port 8000.');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie');
      
      const token = localStorage.getItem('auth_token');
      
      // Prepare data for API - convert features to array of IDs and capacity to integer
      const apiData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        features: formData.features.map(id => parseInt(id))
      };
      
      const response = await fetch(`http://localhost:8000/api/update-room/${editingRoom.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(apiData)
      });

      const data = await response.json();

      if (data.success) {
        setShowAddForm(false);
        setEditingRoom(null);
        fetchAllRooms(); // Refresh the room list
      } else {
        setError(data.message || 'Failed to update room');
      }
    } catch (error) {
      console.error('API call failed:', error);
      setError('Cannot connect to server. Make sure the backend is running on port 8000.');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) {
      return;
    }
    
    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie');
      
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`http://localhost:8000/api/delete-room/${roomId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        }
      });

      const data = await response.json();

      if (data.success) {
        fetchAllRooms(); // Refresh the room list
      } else {
        setError(data.message || 'Failed to delete room');
      }
    } catch (error) {
      console.error('API call failed:', error);
      setError('Cannot connect to server. Make sure the backend is running on port 8000.');
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingRoom(null);
  };

  if (!hasRole('admin')) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          ⚠️ Access denied. Admin privileges required.
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Room Management</h1>
        <p style={styles.description}>Admin panel for managing rooms</p>
        
        <div style={styles.headerButtons}>
          <button onClick={fetchAllRooms} style={styles.headerButton}>
            Refresh Rooms
          </button>
          
          <button onClick={handleAddRoom} style={styles.addButton}>
            Add New Room
          </button>
        </div>
      </header>

      {error && (
        <div style={styles.error}>
          ⚠️ {error}
        </div>
      )}

      {showAddForm && (
        <section style={styles.formSection}>
          <h2 style={styles.formTitle}>
            {editingRoom ? 'Edit Room' : 'Add New Room'}
          </h2>
          
          <form onSubmit={editingRoom ? handleEdit : handleAdd} style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Room Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name} 
                  onChange={handleFormChange} 
                  style={styles.input} 
                  required 
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Capacity</label>
                <input 
                  type="number" 
                  name="capacity"
                  value={formData.capacity} 
                  onChange={handleFormChange} 
                  style={styles.input} 
                  min="1"
                  required 
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Floor</label>
                <input 
                  type="text" 
                  name="floor"
                  value={formData.floor} 
                  onChange={handleFormChange} 
                  style={styles.input} 
                  required 
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <select 
                  name="status"
                  value={formData.status} 
                  onChange={handleFormChange} 
                  style={styles.input} 
                  required
                >
                  <option value="available">Available</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Features (Hold Ctrl to select multiple)</label>
              <select 
                multiple
                name="features"
                value={formData.features} 
                onChange={handleFeatureChange} 
                style={{...styles.input, height: '100px'}} 
              >
                {availableFeatures.map(feature => (
                  <option key={feature.id} value={feature.id}>
                    {feature.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formButtons}>
              <button type="submit" style={styles.submitButton}>
                {editingRoom ? 'Update Room' : 'Add Room'}
              </button>
              <button type="button" onClick={cancelForm} style={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section style={styles.resultsContainer}>
        {loading && (
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            Loading rooms...
          </div>
        )}

        {!loading && rooms.length > 0 && (
          <>
            <h2 style={styles.resultsTitle}>
              All Rooms ({rooms.length})
            </h2>
            <div style={styles.roomsGrid}>
              {rooms.map(room => (
                <div key={room.id} style={styles.roomCard}>
                  <div style={styles.roomHeader}>
                    <h3 style={styles.roomName}>{room.name}</h3>
                    <span style={{
                      ...styles.roomCapacity,
                      backgroundColor: room.status === 'available' ? '#eff6ff' : 
                                     room.status === 'maintenance' ? '#fffbeb' : '#fef2f2',
                      color: room.status === 'available' ? '#1d4ed8' : 
                            room.status === 'maintenance' ? '#d97706' : '#dc2626'
                    }}>
                      {room.capacity} people • {room.status}
                    </span>
                  </div>
                  
                  <div style={styles.roomDetails}>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Floor:</span>
                      <span>{room.floor}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>ID:</span>
                      <span>{room.id}</span>
                    </div>
                  </div>

                  {room.features && room.features.length > 0 && (
                    <div style={styles.featuresSection}>
                      <h4 style={styles.featuresTitle}>Features:</h4>
                      <div style={styles.featuresList}>
                        {room.features.map((feature, index) => (
                          <span key={index} style={styles.featureTag}>
                            {typeof feature === 'object' ? feature.name : feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={styles.adminButtons}>
                    <button
                      style={styles.editButton}
                      onClick={() => handleEditRoom(room)}
                    >
                      Edit
                    </button>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDeleteRoom(room.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && rooms.length === 0 && !error && (
          <div style={styles.placeholder}>
            <div style={styles.placeholderIcon}>🏢</div>
            <p>No rooms found</p>
            <button onClick={handleAddRoom} style={styles.addButton}>
              Add Your First Room
            </button>
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
  addButton: {
    background: '#059669',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
    fontWeight: '500',
    '&:hover': {
      background: '#047857'
    }
  },
  formSection: {
    padding: 30,
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0'
  },
  formTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 25,
    textAlign: 'center'
  },
  form: {
    maxWidth: 800,
    margin: '0 auto'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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
  formButtons: {
    display: 'flex',
    gap: 10,
    justifyContent: 'center'
  },
  submitButton: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #4a6fa5, #2c5282)',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.1s',
    '&:hover': {
      transform: 'translateY(-1px)'
    }
  },
  cancelButton: {
    padding: '12px 24px',
    background: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.1s',
    '&:hover': {
      transform: 'translateY(-1px)',
      background: '#4b5563'
    }
  },
  error: {
    margin: 20,
    padding: '15px',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    borderRadius: 8,
    border: '1px solid ',
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
  adminButtons: {
    display: 'flex',
    gap: 10,
    marginTop: 'auto'
  },
  editButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#4a6fa5',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#3b5b8d'
    }
  },
  deleteButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#b91c1c'
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
  }
};

// Add CSS animation for the spinner
const styleSheet = document.styleSheets[0];
if (styleSheet) {
  styleSheet.insertRule(`
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `, styleSheet.cssRules.length);
}

export default AdminPage;