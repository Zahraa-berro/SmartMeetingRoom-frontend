import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, ListGroup, Badge, Alert, Spinner, Card, Accordion } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

const BookingForm = ({ formData, setFormData, onSubmit }) => {
  const navigate = useNavigate();
  const [attendeeInput, setAttendeeInput] = useState('');
  const [attendeeSuggestions, setAttendeeSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState(null);
  const [success, setSuccess] = useState('');
  const [roomSuggestions, setRoomSuggestions] = useState([]);
  const [showRoomSuggestions, setShowRoomSuggestions] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [requestData, setRequestData] = useState(null);
  const [responseData, setResponseData] = useState(null);
  
  // Sample attendee suggestions
  const allAttendees = [
    'john.doe@example.com',
    'jane.smith@example.com',
    'mike.johnson@example.com',
    'sarah.williams@example.com',
    'david.brown@example.com'
  ];

  // Sample room suggestions
  const allRooms = [
    'Conference Room A',
    'Conference Room B',
    'Meeting Room C',
    'Board Room',
    'Training Room',
    'Small Meeting Room',
    'Large Conference Room',
    'Executive Suite',
    'Presentation Room',
    'Collaboration Space'
  ];

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setErrorDetails(null);
    setSuccess('');
    setRequestData(null);
    setResponseData(null);

    try {
      // Get Sanctum token
      const token = localStorage.getItem('auth_token') || document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

      if (!token) {
        throw new Error('Authentication token not found. Please log in.');
      }

      // Validate required fields
      const validationErrors = [];
      if (!formData.title) validationErrors.push('Title is required');
      if (!formData.agenda) validationErrors.push('Agenda is required');
      if (!formData.date) validationErrors.push('Date is required');
      if (!formData.time) validationErrors.push('Time is required');
      if (!formData.duration) validationErrors.push('Duration is required');
      if (!formData.room_name) validationErrors.push('Room name is required');
      if (formData.attendees.length === 0) validationErrors.push('At least one attendee is required');

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Convert duration to HH:MM format
      const durationMap = {
        '30 minutes': '00:30',
        '1 hour': '01:00',
        '1.5 hours': '01:30',
        '2 hours': '02:00',
        '3 hours': '03:00'
      };

      const duration = durationMap[formData.duration] || '01:00';

      // Prepare the request data exactly as the backend expects
      const bookingData = {
        title: formData.title,
        agenda: formData.agenda,
        date: formData.date,
        time: formData.time,
        duration: duration,
        attendees: formData.attendees.join(','), // Convert array to comma-separated string
        room_name: formData.room_name
      };

      setRequestData(bookingData);
      console.log('Sending data to API:', bookingData);

      // Make API call to the correct endpoint
      const response = await axios.post('/api/meetings', bookingData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      setResponseData(response.data);
      console.log('API Response:', response.data);

      // Check if we have an ID in the response, which indicates success
      if (response.data && response.data.id) {
        setSuccess('Meeting booked successfully! Redirecting to meeting page...');
        
        // Call onSubmit callback if provided
        if (onSubmit) {
          onSubmit(response.data);
        }
        
        // Navigate to the meeting page after a short delay
        setTimeout(() => {
          navigate(`/meeting/${response.data.id}`);
        }, 1500);
        
      } else {
        // Check if we have a message in the response
        const errorMsg = response.data.message || 'Failed to book meeting';
        throw new Error(errorMsg);
      }

    } catch (err) {
      console.error('Booking error:', err);
      const errorData = err.response?.data;
      
      if (errorData && errorData.errors) {
        // Format validation errors from backend
        const errorMessages = Object.entries(errorData.errors)
          .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
          .join('\n');
        setError(errorMessages);
        setErrorDetails(errorData.errors);
      } else if (errorData && errorData.message) {
        // Use the message from the server
        setError(errorData.message);
        setErrorDetails(errorData);
      } else {
        const errorMsg = err.message || 'Failed to book meeting. Please try again.';
        setError(errorMsg);
        setErrorDetails({ server: errorMsg });
      }
      setResponseData(errorData || { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Show room suggestions when typing in room_name field
    if (name === 'room_name') {
      if (value.length > 1) {
        const filteredRooms = allRooms.filter(room => 
          room.toLowerCase().includes(value.toLowerCase())
        );
        setRoomSuggestions(filteredRooms);
        setShowRoomSuggestions(true);
      } else {
        setRoomSuggestions([]);
        setShowRoomSuggestions(false);
      }
    }
  };

  const handleAttendeeInput = (e) => {
    const value = e.target.value;
    setAttendeeInput(value);
    
    if (value.length > 2) {
      setAttendeeSuggestions(
        allAttendees.filter(email => 
          email.toLowerCase().includes(value.toLowerCase()) &&
          !formData.attendees.includes(email)
        )
      );
    } else {
      setAttendeeSuggestions([]);
    }
  };

  const addAttendee = (email) => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!formData.attendees.includes(email)) {
      setFormData({
        ...formData,
        attendees: [...formData.attendees, email]
      });
      setAttendeeInput('');
      setAttendeeSuggestions([]);
      setError('');
    }
  };

  const handleAttendeeKeyPress = (e) => {
    if (e.key === 'Enter' && attendeeInput.trim()) {
      e.preventDefault();
      addAttendee(attendeeInput.trim());
    }
  };

  const removeAttendee = (index) => {
    const newAttendees = [...formData.attendees];
    newAttendees.splice(index, 1);
    setFormData({
      ...formData,
      attendees: newAttendees
    });
  };

  const handleDurationChange = (e) => {
    setFormData({
      ...formData,
      duration: e.target.value
    });
  };

  const selectRoomSuggestion = (room) => {
    setFormData({
      ...formData,
      room_name: room
    });
    setShowRoomSuggestions(false);
  };

  // Get current date and time for minimum values
  const now = new Date();
  const minDate = now.toISOString().split('T')[0];
  const minTime = now.toTimeString().substring(0, 5);

  // Field validation indicators
  const isTitleValid = formData.title.length > 0;
  const isAgendaValid = formData.agenda.length > 0;
  const isDateValid = formData.date.length > 0;
  const isTimeValid = formData.time.length > 0;
  const isDurationValid = formData.duration.length > 0;
  const isRoomValid = formData.room_name.length > 0;
  const hasAttendees = formData.attendees.length > 0;

  return (
    <div>
      <Form onSubmit={handleBooking}>
        {error && (
          <Alert variant="danger" className="mb-3">
            <Alert.Heading>Booking Failed!</Alert.Heading>
            <strong>Error:</strong><br />
            {error.split('\n').map((line, index) => (
              <div key={index}>{line}</div>
            ))}
            <div className="mt-2">
              <Button variant="outline-danger" size="sm" onClick={() => setDebugMode(!debugMode)}>
                {debugMode ? 'Hide' : 'Show'} Debug Details
              </Button>
            </div>
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" className="mb-3">
            {success}
          </Alert>
        )}

        {debugMode && (
          <Card className="mb-3">
            <Card.Header>
              <strong>Debug Information</strong>
            </Card.Header>
            <Card.Body>
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Request Data</Accordion.Header>
                  <Accordion.Body>
                    <pre>{JSON.stringify(requestData, null, 2)}</pre>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Response Data</Accordion.Header>
                  <Accordion.Body>
                    <pre>{responseData ? JSON.stringify(responseData, null, 2) : 'No response received yet'}</pre>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Validation Status</Accordion.Header>
                  <Accordion.Body>
                    <ul>
                      <li>Title: {isTitleValid ? '✓ Valid' : '✗ Missing'}</li>
                      <li>Agenda: {isAgendaValid ? '✓ Valid' : '✗ Missing'}</li>
                      <li>Date: {isDateValid ? '✓ Valid' : '✗ Missing'}</li>
                      <li>Time: {isTimeValid ? '✓ Valid' : '✗ Missing'}</li>
                      <li>Duration: {isDurationValid ? '✓ Valid' : '✗ Missing'}</li>
                      <li>Room: {isRoomValid ? '✓ Valid' : '✗ Missing'}</li>
                      <li>Attendees: {hasAttendees ? '✓ Valid' : '✗ Missing'}</li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
          </Card>
        )}

        <Form.Group as={Row} className="mb-3" controlId="title">
          <Form.Label column sm={3}>
            Title <span className="text-danger">*</span>
            {formData.title && (
              <Badge bg={isTitleValid ? "success" : "danger"} className="ms-2">
                {isTitleValid ? "✓" : "✗"}
              </Badge>
            )}
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Meeting title"
              required
              isInvalid={formData.title && !isTitleValid}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="agenda">
          <Form.Label column sm={3}>
            Agenda <span className="text-danger">*</span>
            {formData.agenda && (
              <Badge bg={isAgendaValid ? "success" : "danger"} className="ms-2">
                {isAgendaValid ? "✓" : "✗"}
              </Badge>
            )}
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              as="textarea"
              rows={3}
              name="agenda"
              value={formData.agenda}
              onChange={handleInputChange}
              placeholder="Meeting agenda and objectives"
              required
              isInvalid={formData.agenda && !isAgendaValid}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="date">
          <Form.Label column sm={3}>
            Date <span className="text-danger">*</span>
            {formData.date && (
              <Badge bg={isDateValid ? "success" : "danger"} className="ms-2">
                {isDateValid ? "✓" : "✗"}
              </Badge>
            )}
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              min={minDate}
              required
              isInvalid={formData.date && !isDateValid}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="time">
          <Form.Label column sm={3}>
            Time <span className="text-danger">*</span>
            {formData.time && (
              <Badge bg={isTimeValid ? "success" : "danger"} className="ms-2">
                {isTimeValid ? "✓" : "✗"}
              </Badge>
            )}
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              min={formData.date === minDate ? minTime : null}
              required
              isInvalid={formData.time && !isTimeValid}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="duration">
          <Form.Label column sm={3}>
            Duration <span className="text-danger">*</span>
            {formData.duration && (
              <Badge bg={isDurationValid ? "success" : "danger"} className="ms-2">
                {isDurationValid ? "✓" : "✗"}
              </Badge>
            )}
          </Form.Label>
          <Col sm={9}>
            <Form.Select
              name="duration"
              value={formData.duration}
              onChange={handleDurationChange}
              required
              isInvalid={formData.duration && !isDurationValid}
            >
              <option value="">Select duration</option>
              <option value="30 minutes">30 minutes</option>
              <option value="1 hour">1 hour</option>
              <option value="1.5 hours">1.5 hours</option>
              <option value="2 hours">2 hours</option>
              <option value="3 hours">3 hours</option>
            </Form.Select>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="attendees">
          <Form.Label column sm={3}>
            Attendees <span className="text-danger">*</span>
            {formData.attendees.length > 0 && (
              <Badge bg={hasAttendees ? "success" : "danger"} className="ms-2">
                {hasAttendees ? "✓" : "✗"}
              </Badge>
            )}
          </Form.Label>
          <Col sm={9}>
            <div className="position-relative">
              <Form.Control
                type="text"
                value={attendeeInput}
                onChange={handleAttendeeInput}
                onKeyPress={handleAttendeeKeyPress}
                placeholder="Type email and press enter or select from suggestions"
              />
              {attendeeSuggestions.length > 0 && (
                <ListGroup className="position-absolute w-100" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                  {attendeeSuggestions.map((email, index) => (
                    <ListGroup.Item 
                      key={index} 
                      action 
                      onClick={() => addAttendee(email)}
                      className="py-2"
                    >
                      {email}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>
            
            {formData.attendees.length > 0 && (
              <div className="mt-2">
                {formData.attendees.map((attendee, index) => (
                  <Badge pill bg="primary" className="me-1 mb-1 d-inline-flex align-items-center" key={index}>
                    {attendee}
                    <button 
                      type="button" 
                      className="btn-close btn-close-white ms-1" 
                      aria-label="Remove"
                      onClick={() => removeAttendee(index)}
                      style={{ fontSize: '0.5rem', padding: '0.25rem' }}
                    />
                  </Badge>
                ))}
              </div>
            )}
            <Form.Text className="text-muted">
              Add email addresses of attendees. Press Enter after each email.
            </Form.Text>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-4" controlId="room_name">
          <Form.Label column sm={3}>
            Room <span className="text-danger">*</span>
            {formData.room_name && (
              <Badge bg={isRoomValid ? "success" : "danger"} className="ms-2">
                {isRoomValid ? "✓" : "✗"}
              </Badge>
            )}
          </Form.Label>
          <Col sm={9}>
            <div className="position-relative">
              <Form.Control
                type="text"
                name="room_name"
                value={formData.room_name}
                onChange={handleInputChange}
                placeholder="Enter room name"
                required
                isInvalid={formData.room_name && !isRoomValid}
              />
              {showRoomSuggestions && roomSuggestions.length > 0 && (
                <ListGroup className="position-absolute w-100" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                  {roomSuggestions.map((room, index) => (
                    <ListGroup.Item 
                      key={index} 
                      action 
                      onClick={() => selectRoomSuggestion(room)}
                      className="py-2"
                    >
                      {room}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>
            <Form.Text className="text-muted">
              Type the room name (e.g., "Conference Room A")
            </Form.Text>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mt-4">
          <Col sm={{ span: 9, offset: 3 }}>
            <Button 
              variant="primary" 
              type="submit" 
              className="me-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1"
                  />
                  Booking...
                </>
              ) : (
                'Book Now'
              )}
            </Button>
            <Button variant="outline-secondary" type="button" onClick={() => setFormData({
              title: '',
              agenda: '',
              date: '',
              time: '',
              duration: 'select duration',
              attendees: [],
              room_name: ''
            })}>
              Clear Form
            </Button>
            <Button 
              variant="outline-info" 
              type="button" 
              className="ms-2"
              onClick={() => setDebugMode(!debugMode)}
            >
              {debugMode ? 'Hide Debug' : 'Show Debug'}
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
};

export default BookingForm;