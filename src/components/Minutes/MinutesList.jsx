// minuteslist.jsx
import React, { useState } from 'react';
import '../../App.css';

const MinutesList = ({ minutes, onView, onEdit, onDelete, onShare }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter minutes based on status and search term
  const filteredMinutes = minutes.filter(minute => {
    const matchesStatus = filterStatus === 'all' || minute.status === filterStatus;
    const matchesSearch = minute.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         minute.attendees.some(attendee => 
                           attendee.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Sort minutes based on selected field and order
  const sortedMinutes = [...filteredMinutes].sort((a, b) => {
    let aValue, bValue;
    
    switch(sortBy) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'date':
        aValue = new Date(a.date);
        bValue = new Date(b.date);
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      default:
        aValue = a[sortBy];
        bValue = b[sortBy];
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Handle sort change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="minutes-list-container">
      <div className="minutes-header">
        <h2>Meeting Minutes</h2>
        <button className="new-minute-btn" onClick={() => onEdit(null)}>
          + New Minutes
        </button>
      </div>

      {/* Controls */}
      <div className="minutes-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search minutes or attendees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-controls">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="finalized">Finalized</option>
          </select>

          <div className="sort-controls">
            <span>Sort by:</span>
            <button 
              className={sortBy === 'date' ? 'active' : ''}
              onClick={() => handleSortChange('date')}
            >
              Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button 
              className={sortBy === 'title' ? 'active' : ''}
              onClick={() => handleSortChange('title')}
            >
              Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>
      </div>

      {/* Minutes List */}
      <div className="minutes-grid">
        {sortedMinutes.length > 0 ? (
          sortedMinutes.map(minute => (
            <div key={minute.id} className="minute-card">
              <div className="minute-card-header">
                <span className={`status-badge ${minute.status}`}>
                  {minute.status}
                </span>
                <div className="minute-actions">
                  <button onClick={() => onView(minute)} title="View">
                    👁️
                  </button>
                  <button onClick={() => onEdit(minute)} title="Edit">
                    ✏️
                  </button>
                  <button onClick={() => onShare(minute)} title="Share">
                    📤
                  </button>
                  <button onClick={() => onDelete(minute.id)} title="Delete">
                    🗑️
                  </button>
                </div>
              </div>
              
              <h3 className="minute-title">{minute.title}</h3>
              <p className="minute-date">{formatDate(minute.date)}</p>
              
              <div className="minute-attendees">
                <span>Attendees:</span>
                <div className="attendee-list">
                  {minute.attendees.slice(0, 3).map((attendee, index) => (
                    <span key={index} className="attendee-tag">
                      {attendee}
                    </span>
                  ))}
                  {minute.attendees.length > 3 && (
                    <span className="more-attendees">
                      +{minute.attendees.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              
              <div className="minute-stats">
                <div className="stat">
                  <span className="stat-number">{minute.decisions?.length || 0}</span>
                  <span className="stat-label">Decisions</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{minute.actionItems?.length || 0}</span>
                  <span className="stat-label">Actions</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{minute.attachments?.length || 0}</span>
                  <span className="stat-label">Files</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-minutes">
            <p>No meeting minutes found.</p>
            <button onClick={() => onEdit(null)}>Create New Minutes</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinutesList;