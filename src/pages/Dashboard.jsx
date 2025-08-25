import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, ButtonGroup } from 'react-bootstrap';
import { FaCalendarAlt, FaVideo, FaFileAlt, FaArrowRight, FaClock } from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import RoomAvailabilityChart from '../components/Dashboard/RoomAvailabilityChart';
import '../App.css';

const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  const [activeView, setActiveView] = useState('day');
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  // Sample data
  const upcomingMeetings = [
    { id: 1, title: 'Project Kickoff', time: '10:00 AM - 11:30 AM', room: 'Conference A' },
    { id: 2, title: 'Client Review', time: '2:00 PM - 3:00 PM', room: 'Meeting Room 3' },
    { id: 3, title: 'Team Sync', time: '4:30 PM - 5:00 PM', room: 'Zoom Room' }
  ];

  const roomUsageData = [
    { name: 'Conference A', usage: 12, available: true },
    { name: 'Meeting Room 1', usage: 18, available: false },
    { name: 'Meeting Room 2', usage: 8, available: true },
    { name: 'Board Room', usage: 15, available: false },
    { name: 'Conference B', usage: 6, available: true },
    { name: 'Zoom Room', usage: 20, available: true }
  ];

  return (
    <Container fluid className="dashboard-container">
      {/* Header Section */}
      <Row className="dashboard-header mb-4">
        <Col>
          <h1 className="greeting">Good Evening! John,</h1>
          <p className="date-display">{currentDate}</p>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <div className="quick-actions">
            <Button variant="primary" className="action-btn">
              <FaCalendarAlt className="me-2" />
              Schedule Meeting
            </Button>
            <Button variant="success" className="action-btn">
              <FaVideo className="me-2" />
              Join Now
            </Button>
            <Button variant="info" className="action-btn">
              <FaFileAlt className="me-2" />
              View Minutes
            </Button>
          </div>
        </Col>
      </Row>

      {/* Main Content */}
      <Row className="dashboard-main">
        {/* Left Column - Calendar & Rooms */}
        <Col lg={8} className="pe-lg-3">
          <Card className="calendar-card mb-4">
            <Card.Body>
              <div className="calendar-header">
                <h2>Room Availability</h2>
                <ButtonGroup className="view-toggle">
                  <Button 
                    variant={activeView === 'day' ? 'primary' : 'outline-primary'} 
                    size="sm"
                    onClick={() => setActiveView('day')}
                  >
                    Day
                  </Button>
                  <Button 
                    variant={activeView === 'week' ? 'primary' : 'outline-primary'} 
                    size="sm"
                    onClick={() => setActiveView('week')}
                  >
                    Week
                  </Button>
                </ButtonGroup>
              </div>
              
              <Calendar 
                onChange={setDate} 
                value={date} 
                view={activeView === 'week' ? 'month' : 'week'}
                className="meeting-calendar"
              />

              <div className="room-analytics-header mt-4">
                <h3>Room Usage Analytics</h3>
                <Button variant="link" className="view-all ps-0">
                  View Detailed Analytics <FaArrowRight className="ms-1" />
                </Button>
              </div>
              
              <RoomAvailabilityChart data={roomUsageData} />
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column - Upcoming Meetings */}
        <Col lg={4} className="ps-lg-3">
          <Card className="schedule-card">
            <Card.Body>
              <div className="section-header">
                <h2>Upcoming Meetings</h2>
                <Button variant="link" className="view-all ps-0">
                  View All <FaArrowRight className="ms-1" />
                </Button>
              </div>
              
              <div className="meetings-list">
                {upcomingMeetings.map(meeting => (
                  <div key={meeting.id} className="meeting-item">
                    <div className="meeting-time">
                      <FaClock className="me-2" />
                      {meeting.time}
                    </div>
                    <h4 className="meeting-title">{meeting.title}</h4>
                    <div className="meeting-meta">
                      <span className="meeting-room">
                        {meeting.room}
                      </span>
                      <Button variant="outline-primary" size="sm">
                        <FaVideo className="me-1" />
                        Join
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;