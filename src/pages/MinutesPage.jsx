import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import MinutesForm from '../components/Minutes/MinutesForm';
import MinutesList from '../components/Minutes/MinutesList';
import MinutesReview from '../components/Minutes/MinutesReview';
import '../App.css';

const MinutesPage = () => {
  const [activeView, setActiveView] = useState('list'); // 'list', 'create', 'edit', 'review'
  const [minutes, setMinutes] = useState([
    { 
      id: 1, 
      title: 'Project Kickoff', 
      date: '2023-05-15', 
      status: 'finalized',
      attendees: ['John Doe', 'Jane Smith', 'Robert Johnson'],
      agendaItems: [
        'Project overview',
        'Team introductions',
        'Timeline discussion'
      ],
      decisions: [
        { text: 'Approved project timeline', assignee: 'Jane Smith' }
      ],
      actionItems: [
        { text: 'Prepare requirements document', assignee: 'Robert Johnson', dueDate: '2023-05-22' }
      ],
      attachments: []
    },
    { 
      id: 2, 
      title: 'Client Review', 
      date: '2023-05-10', 
      status: 'draft',
      attendees: ['John Doe', 'Client Representative'],
      agendaItems: [
        'Presentation of initial design',
        'Feedback collection',
        'Next steps'
      ],
      decisions: [],
      actionItems: [
        { text: 'Revise design based on feedback', assignee: 'John Doe', dueDate: '2023-05-17' }
      ],
      attachments: []
    },
  ]);
  const [selectedMinute, setSelectedMinute] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  };

  const handleCreateNew = () => {
    setSelectedMinute(null);
    setActiveView('create');
  };

  const handleViewMinute = (minute) => {
    setSelectedMinute(minute);
    setActiveView('review');
  };

  const handleEditMinute = (minute) => {
    setSelectedMinute(minute);
    setActiveView('edit');
  };

  const handleDeleteMinute = (id) => {
    if (window.confirm('Are you sure you want to delete these minutes?')) {
      setMinutes(minutes.filter(m => m.id !== id));
      showAlert('Minutes deleted successfully');
    }
  };

  const handleShareMinute = (minute, email = '') => {
    console.log(`Sharing minute ${minute.id} with ${email}`);
    showAlert(`Minutes shared with ${email || 'team members'}`);
  };

  const handleExportMinute = (minute, format) => {
    console.log(`Exporting minute ${minute.id} as ${format}`);
    showAlert(`Minutes exported as ${format.toUpperCase()}`);
  };

  const handleSaveMinutes = (minuteData, isDraft = false) => {
    if (minuteData.id) {
      setMinutes(minutes.map(m => m.id === minuteData.id ? minuteData : m));
      showAlert(`Minutes ${isDraft ? 'saved as draft' : 'finalized'} successfully`);
    } else {
      // Create new minute
      const newMinute = {
        ...minuteData,
        id: Math.max(...minutes.map(m => m.id), 0) + 1,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setMinutes([...minutes, newMinute]);
      showAlert('New minutes created successfully');
    }
    setActiveView('list');
  };

  const handleBackToList = () => {
    setActiveView('list');
    setSelectedMinute(null);
  };

  return (
    <Container className="minutes-container">
      <Row className="mb-4">
        <Col>
          <h2>Meeting Minutes</h2>
          <p className="text-muted">Create, manage, and review your meeting minutes</p>
        </Col>
        <Col className="text-end">
          {activeView === 'list' && (
            <Button variant="primary" onClick={handleCreateNew}>
              + Create New Minutes
            </Button>
          )}
          {(activeView === 'create' || activeView === 'edit' || activeView === 'review') && (
            <Button variant="outline-secondary" onClick={handleBackToList}>
              ← Back to List
            </Button>
          )}
        </Col>
      </Row>

      {alert.show && (
        <Alert variant={alert.variant} dismissible onClose={() => setAlert({ show: false, message: '', variant: 'success' })}>
          {alert.message}
        </Alert>
      )}

      <Row>
        <Col>
          {activeView === 'list' && (
            <Card>
              <Card.Body>
                <MinutesList 
                  minutes={minutes}
                  onView={handleViewMinute}
                  onEdit={handleEditMinute}
                  onDelete={handleDeleteMinute}
                  onShare={handleShareMinute}
                />
              </Card.Body>
            </Card>
          )}
          
          {(activeView === 'create' || activeView === 'edit') && (
            <Card>
              <Card.Body>
                <MinutesForm 
                  minute={selectedMinute}
                  onSave={handleSaveMinutes}
                  onCancel={handleBackToList}
                />
              </Card.Body>
            </Card>
          )}
          
          {activeView === 'review' && (
            <Card>
              <Card.Body>
                <MinutesReview 
                  minute={selectedMinute}
                  onBack={handleBackToList}
                  onEdit={handleEditMinute}
                  onExport={handleExportMinute}
                  onShare={handleShareMinute}
                />
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MinutesPage;