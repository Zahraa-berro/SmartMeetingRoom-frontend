import React, { useState } from 'react';
import { Container, Row, Col, Card, ListGroup, Button, Tabs, Tab } from 'react-bootstrap';
import MeetingControls from '../components/Meeting/MeetingControls';
import Transcription from '../components/Meeting/Transcription';
import MeetingsList from '../components/Meeting/MeetingsList'; // Import the MeetingsList component
import '../App.css';

const MeetingPage = () => {
  const [meeting, setMeeting] = useState({
    id: 1,
    title: 'Project Kickoff Meeting',
    time: '10:00 AM - 11:00 AM',
    date: '2023-06-15',
    attendees: ['John Doe', 'Jane Smith', 'Mike Johnson'],
    isActive: true,
    transcription: false,
    minutes: "Discussed project goals and timelines. Action items: John to prepare requirements document, Jane to set up development environment.",
    actionItems: [
      { task: "Prepare requirements document", assignee: "John Doe", status: "pending" },
      { task: "Set up development environment", assignee: "Jane Smith", status: "completed" }
    ]
  });

  // State for meetings list filters
  const [dateFilter, setDateFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('current'); // 'current' or 'past'

  // Sample past meetings data
  const pastMeetings = [
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

  const toggleTranscription = () => {
    setMeeting({...meeting, transcription: !meeting.transcription});
  };

  const handleEditMeeting = (meetingId) => {
    alert(`Edit meeting with ID: ${meetingId}`);
  };

  const handleExportMeeting = (meetingId, format) => {
    alert(`Export meeting ${meetingId} as ${format}`);
  };

  const handleShareMeeting = (meetingId) => {
    alert(`Share meeting with ID: ${meetingId}`);
  };

  return (
    <Container className="meeting-container">
      <Row className="mb-4">
        <Col>
          <h2>Meetings</h2>
          <p className="text-muted">Manage current and past meetings</p>
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
        id="meeting-tabs"
      >
        <Tab eventKey="current" title="Current Meeting">
          <Row>
            <Col md={8}>
              <Card className="mb-4">
                <Card.Body>
                  <h4>{meeting.title}</h4>
                  <p className="text-muted">{meeting.time} | {new Date(meeting.date).toLocaleDateString()}</p>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Attendees:</strong> {meeting.attendees.join(', ')}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>

              <Card className="mb-4">
                <Card.Body>
                  <MeetingControls 
                    meeting={meeting} 
                    setMeeting={setMeeting}
                    toggleTranscription={toggleTranscription}
                  />
                </Card.Body>
              </Card>

              {meeting.transcription && (
                <Card>
                  <Card.Body>
                    <Transcription />
                  </Card.Body>
                </Card>
              )}
            </Col>

            <Col md={4}>
              <Card>
                <Card.Body>
                  <h5>Quick Actions</h5>
                  <Button variant="outline-primary" className="w-100 mb-2">
                    Take Notes
                  </Button>
                  <Button variant="outline-primary" className="w-100 mb-2">
                    Share Screen
                  </Button>
                  <Button variant="outline-primary" className="w-100 mb-2">
                    Invite Participant
                  </Button>
                  <Button variant="outline-success" className="w-100">
                    Join via Zoom
                  </Button>
                </Card.Body>
              </Card>

              {/* Action Items Summary */}
              <Card className="mt-4">
                <Card.Body>
                  <h5>Action Items</h5>
                  {meeting.actionItems.map((item, index) => (
                    <div key={index} className={`d-flex justify-content-between align-items-center mb-2 p-2 rounded ${item.status === 'completed' ? 'bg-light' : 'bg-warning bg-opacity-10'}`}>
                      <div>
                        <div className="fw-medium">{item.task}</div>
                        <small className="text-muted">Assigned to: {item.assignee}</small>
                      </div>
                      <span className={`badge ${item.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="past" title="Past Meetings">
          <MeetingsList 
            meetings={pastMeetings}
            dateFilter={dateFilter}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onEditMeeting={handleEditMeeting}
            onExportMeeting={handleExportMeeting}
            onShareMeeting={handleShareMeeting}
            onSetDateFilter={setDateFilter}
            onSetSearchTerm={setSearchTerm}
            onSetStatusFilter={setStatusFilter}
          />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default MeetingPage;