import React from 'react';
import MeetingListItem from './MeetingListItem';
import '../../App.css';

const MeetingsList = ({ 
  meetings, 
  dateFilter, 
  searchTerm, 
  statusFilter, 
  onEditMeeting, 
  onExportMeeting, 
  onShareMeeting,
  onSetDateFilter,
  onSetSearchTerm,
  onSetStatusFilter
}) => {
  
  // Filter meetings based on current filters
  const filteredMeetings = meetings.filter(meeting => {
    // Date filter
    const matchesDate = !dateFilter || meeting.date === dateFilter;
    
    // Search term filter (search in title, attendees, minutes)
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      meeting.title.toLowerCase().includes(searchLower) ||
      meeting.attendees.some(attendee => 
        attendee.toLowerCase().includes(searchLower)) ||
      meeting.minutes.toLowerCase().includes(searchLower);
    
    // Status filter
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      if (statusFilter === 'pending') {
        matchesStatus = meeting.actionItems.some(item => item.status === 'pending');
      } else if (statusFilter === 'completed') {
        matchesStatus = meeting.actionItems.some(item => item.status === 'completed');
      }
    }
    
    return matchesDate && matchesSearch && matchesStatus;
  });

  // Sort meetings by date (newest first)
  const sortedMeetings = [...filteredMeetings].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="meetings-list">
      <div className="meetings-header">
        <h2>Post-Meeting Minutes Review</h2>
        <p>Review past meetings, action items, and minutes</p>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="date-filter">Filter by Date:</label>
          <input
            id="date-filter"
            type="date"
            value={dateFilter}
            onChange={(e) => onSetDateFilter(e.target.value)}
          />
          {dateFilter && (
            <button 
              className="clear-filter"
              onClick={() => onSetDateFilter('')}
            >
              Clear
            </button>
          )}
        </div>
        
        <div className="filter-group">
          <label htmlFor="search-bar">Search:</label>
          <input
            id="search-bar"
            type="text"
            placeholder="Search by keyword or attendee..."
            value={searchTerm}
            onChange={(e) => onSetSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="clear-filter"
              onClick={() => onSetSearchTerm('')}
            >
              Clear
            </button>
          )}
        </div>
        
        <div className="filter-group">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => onSetStatusFilter(e.target.value)}
          >
            <option value="all">All Meetings</option>
            <option value="pending">Pending Actions</option>
            <option value="completed">Completed Actions</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-info">
        <p>
          Showing {sortedMeetings.length} of {meetings.length} meetings
          {(dateFilter || searchTerm || statusFilter !== 'all') && (
            <button 
              className="clear-all-filters"
              onClick={() => {
                onSetDateFilter('');
                onSetSearchTerm('');
                onSetStatusFilter('all');
              }}
            >
              Clear all filters
            </button>
          )}
        </p>
      </div>

      {/* Meetings List */}
      <div className="meetings-container">
        {sortedMeetings.length === 0 ? (
          <div className="no-meetings">
            <h3>No meetings found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        ) : (
          sortedMeetings.map(meeting => (
            <MeetingListItem
              key={meeting.id}
              meeting={meeting}
              onEdit={onEditMeeting}
              onExport={onExportMeeting}
              onShare={onShareMeeting}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MeetingsList;