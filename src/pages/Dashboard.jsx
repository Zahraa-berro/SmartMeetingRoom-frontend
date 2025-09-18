import React, { useState, useCallback, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ButtonGroup, Navbar, Alert, Badge } from 'react-bootstrap';
import { FaCalendarAlt, FaVideo, FaFileAlt, FaArrowRight, FaClock, FaUserCircle, FaCog, FaUsers, FaChartLine } from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import RoomAvailabilityChart from '../components/Dashboard/RoomAvailabilityChart';
import '../App.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContexts'; // Import AuthContext

const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  const [activeView, setActiveView] = useState('day');
  const [showDebug, setShowDebug] = useState(false); // For toggling debug info
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  const { user, hasRole, isAuthenticated } = useAuth(); // Get auth info
  const navigate = useNavigate();

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

  // Debug function to check role access
  const checkRoleAccess = () => {
    console.log('=== ROLE DEBUG INFORMATION ===');
    console.log('User Object:', user);
    console.log('Role Type:', user?.role?.type);
    console.log('Is Admin:', hasRole('admin'));
    console.log('Is guest:', hasRole('guest'));
    console.log('Is Employee:', hasRole('employee'));
    console.log('LocalStorage User:', localStorage.getItem('user_data'));
    console.log('==============================');
  };

  // Call debug on component mount
  useEffect(() => {
    checkRoleAccess();
  }, []);

  const bookingNavigate = useCallback(() => {
    navigate('/BookingPage');
  }, [navigate]);

  const minutesNavigate = useCallback(() => {
    navigate('/minutes');
  }, [navigate]);

  const profileNavigate = useCallback(() => {
    navigate('/manageprofile');
  }, [navigate]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <Container fluid className="dashboard-container">
      {/* Header Section */}
      <Row className="mb-4">
        <Col>
          <Navbar className="dashboard-header" expand="lg">
            <Navbar.Brand>
              <h1 className="greeting">Smart Meeting Room</h1>
              <Badge bg="info" className="ms-2">
                Role: {user?.role?.type || 'Unknown'}
              </Badge>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <div className="d-flex gap-2 align-items-center">
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => setShowDebug(!showDebug)}
                  title="Toggle debug information"
                >
                  <FaCog /> role
                </Button>
                <Button 
                  variant="outline-primary" 
                  className="profile-btn"
                  onClick={profileNavigate}
                >
                  <FaUserCircle className="me-2" size={24} />
                  {user?.firstName} {user?.lastName}
                </Button>
              </div>
            </Navbar.Collapse>
          </Navbar>
          <p className="date-display">{currentDate}</p>
        </Col>
      </Row>

      {/* Debug Information */}
      {showDebug && (
        <Row className="mb-3">
          <Col>
            <Alert variant="info" className="p-3">
              <h6>🛠️ Role Information</h6>
              <div className="small">
                <strong>User Role:</strong> {user?.role?.type || 'Not set'}<br/>
                <strong>Has Admin Role:</strong> {hasRole('admin') ? '✅ YES' : '❌ NO'}<br/>
                <strong>Has guest Role:</strong> {hasRole('guest') ? '✅ YES' : '❌ NO'}<br/>
                <strong>Has Employee Role:</strong> {hasRole('employee') ? '✅ YES' : '❌ NO'}<br/>
                <strong>User ID:</strong> {user?.id}<br/>
                <strong>Email:</strong> {user?.email}
              </div>
              <Button 
                variant="outline-info" 
                size="sm" 
                className="mt-2"
                onClick={checkRoleAccess}
              >
                Refresh role Info
              </Button>
            </Alert>
          </Col>
        </Row>
      )}

      {/* Quick Actions - Role Based */}
      <Row className="mb-4">
        <Col>
          <div className="quick-actions">
            <Button variant="primary" className="action-btn" onClick={bookingNavigate}>
              <FaCalendarAlt className="me-2" />
              Book Meeting
            </Button>
            
            <Button variant="info" className="action-btn" onClick={minutesNavigate}>
              <FaFileAlt className="me-2" />
              View Minutes
            </Button>

            {/* Admin Only Actions */}
            {hasRole('admin') && (
              <Button variant="warning" className="action-btn">
                <FaUsers className="me-2" />
                Manage Users
              </Button>
            )}

            {/* Manager and Admin Actions */}
            {(hasRole('employee') || hasRole('admin')) && (
              <Button variant="success" className="action-btn">
                <FaChartLine className="me-2" />
                Analytics
              </Button>
            )}
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

              {/* Admin/Manager Only Section */}
              {(hasRole('admin') || hasRole('manager')) && (
                <div className="mt-4 p-3 bg-light rounded">
                  <h6>📊 Management Overview</h6>
                  <div className="small">
                    <div>Total Rooms: 12</div>
                    <div>Occupancy Rate: 78%</div>
                    <div>Upcoming Reservations: 24</div>
                    {hasRole('admin') && <div>System Health: Optimal</div>}
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Role-based Footer Section */}
      <Row className="mt-4">
        <Col>
          {hasRole('admin') && (
            <Alert variant="warning" className="text-center">
              <strong>Admin Mode Active</strong> - You have full system access
            </Alert>
          )}
          {hasRole('guest') && (
            <Alert variant="info" className="text-center">
              <strong>guest Mode Active</strong> - You have only view access
            </Alert>
          )}
          {hasRole('employee') && (
            <Alert variant="success" className="text-center">
              <strong>Employee Mode Active</strong> - You have standard employee access
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;