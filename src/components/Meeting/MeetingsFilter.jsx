// MeetingsFilter.jsx
import React, { useState, useMemo } from 'react';
import '../../App.css';
const MeetingsFilter = () => {
  // Sample meeting data
  const initialMeetings = [
    {
      id: 1,
      title: "Q2 Product Strategy",
      date: "2023-06-15",
      attendees: ["John Doe", "Jane Smith", "Robert Johnson"],
      minutes: "Discussed new product features for Q2. Action items: John to research market trends, Jane to prepare budget estimates.",
      actionItems: [
        { task: "Research market trends", assignee: "John Doe", status: "pending" },
        { task: "Prepare budget estimates", assignee: "Jane Smith", status: "completed" }
      ]
    },
    {
      id: 2,
      title: "Marketing Campaign Review",
      date: "2023-06-10",
      attendees: ["Jane Smith", "Michael Brown", "Sarah Wilson"],
      minutes: "Reviewed Q2 marketing performance. Action items: Michael to update campaign visuals, Sarah to analyze competitor strategies.",
      actionItems: [
        { task: "Update campaign visuals", assignee: "Michael Brown", status: "pending" },
        { task: "Analyze competitor strategies", assignee: "Sarah Wilson", status: "pending" }
      ]
    },
    {
      id: 3,
      title: "Team Weekly Sync",
      date: "2023-06-08",
      attendees: ["John Doe", "Robert Johnson", "Emily Davis"],
      minutes: "Weekly progress updates. Action items: Robert to finalize client proposal, Emily to schedule training session.",
      actionItems: [
        { task: "Finalize client proposal", assignee: "Robert Johnson", status: "completed" },
        { task: "Schedule training session", assignee: "Emily Davis", status: "completed" }
      ]
    }
  ];

  // State hooks
  const [meetings, setMeetings] = useState(initialMeetings);
  const [dateFilter, setDateFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Filter meetings based on date, search term, and status
  const filteredMeetings = useMemo(() => {
    return meetings.filter(meeting => {
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
      const matchesStatus = selectedStatus === "all" || 
        meeting.actionItems.some(item => 
          selectedStatus === "pending" ? item.status === "pending" : item.status === "completed"
        );
      
      return matchesDate && matchesSearch && matchesStatus;
    });
  }, [meetings, dateFilter, searchTerm, selectedStatus]);

  // Handle editing minutes
  const handleEdit = (meetingId) => {
    // In a real app, this would open an edit form/modal
    alert(`Edit meeting with ID: ${meetingId}`);
  };

  // Handle exporting minutes
  const handleExport = (meetingId, format) => {
    // In a real app, this would generate a PDF/DOC file
    alert(`Export meeting ${meetingId} as ${format}`);
  };

  // Handle sharing minutes
  const handleShare = (meetingId) => {
    // In a real app, this would open a share dialog
    alert(`Share meeting with ID: ${meetingId}`);
  };

  return (
    <div className="meetings-filter">
      <h2>Post-Meeting Minutes Review</h2>
      
      {/* Filters Section */}
      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="date-filter">Filter by Date:</label>
          <input
            id="date-filter"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="search-bar">Search:</label>
          <input
            id="search-bar"
            type="text"
            placeholder="Search by keyword or attendee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending Actions</option>
            <option value="completed">Completed Actions</option>
          </select>
        </div>
      </div>
      
      {/* Meetings List */}
      <div className="meetings-list">
        <h3>Past Meetings</h3>
        
        {filteredMeetings.length === 0 ? (
          <p className="no-results">No meetings match your filters.</p>
        ) : (
          filteredMeetings.map(meeting => (
            <div key={meeting.id} className="meeting-card">
              <div className="meeting-header">
                <h4>{meeting.title}</h4>
                <span className="meeting-date">
                  {new Date(meeting.date).toLocaleDateString()}
                </span>
              </div>
              
              <div className="meeting-details">
                <div className="attendees">
                  <strong>Attendees:</strong> {meeting.attendees.join(", ")}
                </div>
                
                <div className="minutes-summary">
                  <strong>Summary:</strong> {meeting.minutes}
                </div>
                
                <div className="action-items">
                  <strong>Action Items:</strong>
                  <ul>
                    {meeting.actionItems.map((item, index) => (
                      <li 
                        key={index} 
                        className={`action-item ${item.status}`}
                      >
                        <span className="task">{item.task}</span>
                        <span className="assignee">({item.assignee})</span>
                        <span className={`status-badge ${item.status}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="meeting-actions">
                <button 
                  className="btn-edit"
                  onClick={() => handleEdit(meeting.id)}
                >
                  Edit
                </button>
                <div className="export-options">
                  <button 
                    className="btn-export"
                    onClick={() => handleExport(meeting.id, "PDF")}
                  >
                    Export PDF
                  </button>
                  <button 
                    className="btn-export"
                    onClick={() => handleExport(meeting.id, "DOC")}
                  >
                    Export DOC
                  </button>
                </div>
                <button 
                  className="btn-share"
                  onClick={() => handleShare(meeting.id)}
                >
                  Share
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MeetingsFilter;