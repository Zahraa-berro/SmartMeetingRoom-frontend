// RoomManagement.jsx 
import React, { useState, useEffect } from 'react';
import './RoomManagement.css';

const RoomManagement = () => {
  // Equipment options (shared with AddEditRoom)
  const equipmentOptions = [
    { id: 'mic', label: 'Microphone' },
    { id: 'projector', label: 'Projector' },
    { id: 'whiteboard', label: 'Whiteboard' },
    { id: 'tv', label: 'TV Screen' },
    { id: 'speakers', label: 'Speakers' },
    { id: 'videoconf', label: 'Video Conferencing' },
    { id: 'computer', label: 'Computer' }
  ];

  // Sample initial data
  const initialRooms = [
    { id: 1, name: 'Conference A', capacity: 10, status: 'Available', equipment: ['mic', 'projector'] },
    { id: 2, name: 'Meeting Room B', capacity: 6, status: 'Booked', equipment: ['projector', 'whiteboard'] },
    { id: 3, name: 'Board Room', capacity: 20, status: 'Maintenance', equipment: ['mic', 'videoconf'] },
    { id: 4, name: 'Training Room', capacity: 15, status: 'Available', equipment: [] },
  ];

  const [rooms, setRooms] = useState(initialRooms);
  const [filteredRooms, setFilteredRooms] = useState(initialRooms);
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [newRoom, setNewRoom] = useState({
    name: '',
    capacity: '',
    status: 'Available',
    equipment: []
  });

  // Filter rooms based on status
  useEffect(() => {
    if (statusFilter === 'All') {
      setFilteredRooms(rooms);
    } else {
      setFilteredRooms(rooms.filter(room => room.status === statusFilter));
    }
  }, [statusFilter, rooms]);

  // Handle equipment checkbox changes
  const handleEquipmentChange = (e) => {
    const { value, checked } = e.target;
    
    if (editingRoom) {
      setEditingRoom(prev => {
        const equipment = checked 
          ? [...prev.equipment, value] 
          : prev.equipment.filter(item => item !== value);
        return { ...prev, equipment };
      });
    } else {
      setNewRoom(prev => {
        const equipment = checked 
          ? [...prev.equipment, value] 
          : prev.equipment.filter(item => item !== value);
        return { ...prev, equipment };
      });
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (editingRoom) {
      setEditingRoom({ ...editingRoom, [name]: value });
    } else {
      setNewRoom({ ...newRoom, [name]: value });
    }
  };

  // Add new room
  const addRoom = () => {
    if (!newRoom.name || !newRoom.capacity) return;
    
    const room = {
      id: rooms.length > 0 ? Math.max(...rooms.map(r => r.id)) + 1 : 1,
      ...newRoom,
      capacity: parseInt(newRoom.capacity)
    };
    
    setRooms([...rooms, room]);
    setNewRoom({
      name: '',
      capacity: '',
      status: 'Available',
      equipment: []
    });
    setShowModal(false);
  };

  // Update existing room
  const updateRoom = () => {
    setRooms(rooms.map(room => room.id === editingRoom.id ? editingRoom : room));
    setEditingRoom(null);
    setShowModal(false);
  };

  // Delete room
  const deleteRoom = (id) => {
    setRooms(rooms.filter(room => room.id !== id));
  };

  // Open modal for editing
  const openEditModal = (room) => {
    setEditingRoom(room);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingRoom(null);
  };

  // Calculate analytics
  const getAnalytics = () => {
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter(room => room.status === 'Available').length;
    const bookedRooms = rooms.filter(room => room.status === 'Booked').length;
    const maintenanceRooms = rooms.filter(room => room.status === 'Maintenance').length;
    
    return {
      totalRooms,
      availableRooms,
      bookedRooms,
      maintenanceRooms,
      usageRate: totalRooms > 0 ? ((bookedRooms / totalRooms) * 100).toFixed(2) : 0
    };
  };

  const analytics = getAnalytics();

  return (
    <div className="room-management">
      <h1>Room Management</h1>
      
      {/* Filters + Add Button */}
      <div className="controls">
        <div className="filters">
          <label>Filter by Status:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Rooms</option>
            <option value="Available">Available</option>
            <option value="Booked">Booked</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
        
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          Add New Room
        </button>
      </div>
      
      {/* Analytics Section */}
      <div className="analytics">
        <h2>Room Usage Analytics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{analytics.totalRooms}</h3>
            <p>Total Rooms</p>
          </div>
          <div className="stat-card">
            <h3>{analytics.availableRooms}</h3>
            <p>Available</p>
          </div>
          <div className="stat-card">
            <h3>{analytics.bookedRooms}</h3>
            <p>Booked</p>
          </div>
          <div className="stat-card">
            <h3>{analytics.maintenanceRooms}</h3>
            <p>Maintenance</p>
          </div>
          <div className="stat-card">
            <h3>{analytics.usageRate}%</h3>
            <p>Usage Rate</p>
          </div>
        </div>
      </div>
      
      {/* Rooms List */}
      <div className="rooms-list">
        <h2>Rooms</h2>
        {filteredRooms.length === 0 ? (
          <p>No rooms found with the selected filter.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Capacity</th>
                <th>Status</th>
                <th>Equipment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map(room => (
                <tr key={room.id}>
                  <td>{room.name}</td>
                  <td>{room.capacity} people</td>
                  <td>
                    <span className={`status-badge status-${room.status.toLowerCase()}`}>
                      {room.status}
                    </span>
                  </td>
                  <td>
                    {room.equipment.length > 0 ? (
                      <ul className="equipment-list">
                        {room.equipment.map(item => (
                          <li key={item}>
                            {equipmentOptions.find(opt => opt.id === item)?.label || item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      'None'
                    )}
                  </td>
                  <td>
                    <button 
                      className="btn btn-edit"
                      onClick={() => openEditModal(room)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-delete"
                      onClick={() => deleteRoom(room.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Modal for Add/Edit Room */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingRoom ? 'Edit Room' : 'Add New Room'}</h2>
            
            <div className="form-group">
              <label>Room Name:</label>
              <input
                type="text"
                name="name"
                value={editingRoom ? editingRoom.name : newRoom.name}
                onChange={handleInputChange}
                placeholder="Enter room name"
              />
            </div>
            
            <div className="form-group">
              <label>Capacity:</label>
              <input
                type="number"
                name="capacity"
                value={editingRoom ? editingRoom.capacity : newRoom.capacity}
                onChange={handleInputChange}
                placeholder="Enter capacity"
                min="1"
              />
            </div>
            
            <div className="form-group">
              <label>Status:</label>
              <select
                name="status"
                value={editingRoom ? editingRoom.status : newRoom.status}
                onChange={handleInputChange}
              >
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Equipment:</label>
              <div className="checkbox-group">
                {equipmentOptions.map(option => (
                  <label key={option.id} className="checkbox-label">
                    <input
                      type="checkbox"
                      value={option.id}
                      checked={
                        editingRoom 
                          ? editingRoom.equipment.includes(option.id)
                          : newRoom.equipment.includes(option.id)
                      }
                      onChange={handleEquipmentChange}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={editingRoom ? updateRoom : addRoom}
              >
                {editingRoom ? 'Update Room' : 'Add Room'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;
