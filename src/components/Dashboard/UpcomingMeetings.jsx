import React from 'react';

const UpcomingMeetings = () => {
  const meetings = [
    {
      id: 1,
      title: 'Kickoff Meeting',
      time: '01:00 PM to 02:30 PM',
      assignee: 'Phoenix Winters',
      status: 'In Progress',
      notes: 'Landing Page For Website'
    },
    {
      id: 2,
      title: 'Create WordPress website',
      time: '04:00 PM to 02:30 PM',
      assignee: 'Cohen Merritt',
      status: 'Pending',
      notes: 'Fixing icons with dark backgrounds'
    },
    {
      id: 3,
      title: 'Create User flow',
      time: '05:00 PM to 02:30 PM',
      assignee: 'Lukas Juarez',
      status: 'Completed',
      notes: 'Discussion regarding userflow'
    }
  ];

  return (
    <div className="upcoming-meetings">
      <div className="week-days">
        {['Mo 15', 'Tu 16', 'We 17', 'Th 18', 'Fr 19', 'Sa 20', 'Su 14'].map((day) => (
          <span key={day} className="day">{day}</span>
        ))}
      </div>
      
      <div className="meetings-list">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="meeting-item">
            <div className="meeting-time">{meeting.time}</div>
            <div className="meeting-details">
              <h4 className="meeting-title">{meeting.title}</h4>
              <div className="meeting-meta">
                <span className="assignee">{meeting.assignee}</span>
                <span className={`status ${meeting.status.toLowerCase().replace(' ', '-')}`}>
                  {meeting.status}
                </span>
              </div>
              <p className="meeting-notes">{meeting.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingMeetings;