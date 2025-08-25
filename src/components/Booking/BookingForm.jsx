import React, { useState } from 'react';
import { Form, Button, Row, Col, ListGroup, Badge } from 'react-bootstrap';
import '../../App.css';

const BookingForm = ({ formData, setFormData, onSubmit }) => {
  const [attendeeInput, setAttendeeInput] = useState('');
  const [attendeeSuggestions, setAttendeeSuggestions] = useState([]);
  
  // Sample attendee suggestions
  const allAttendees = [
    'john.doe@example.com',
    'jane.smith@example.com',
    'mike.johnson@example.com',
    'sarah.williams@example.com',
    'david.brown@example.com'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
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
    if (!formData.attendees.includes(email)) {
      setFormData({
        ...formData,
        attendees: [...formData.attendees, email]
      });
      setAttendeeInput('');
      setAttendeeSuggestions([]);
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

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group as={Row} className="mb-3" controlId="title">
        <Form.Label column sm={3}>Title</Form.Label>
        <Col sm={9}>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Meeting title"
            required
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="date">
        <Form.Label column sm={3}>Date</Form.Label>
        <Col sm={9}>
          <Form.Control
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="time">
        <Form.Label column sm={3}>Time</Form.Label>
        <Col sm={9}>
          <Form.Control
            type="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            required
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="duration">
        <Form.Label column sm={3}>Duration</Form.Label>
        <Col sm={9}>
          <Form.Select
            name="duration"
            value={formData.duration}
            onChange={handleDurationChange}
            required
          >
            <option value="30 minutes">30 minutes</option>
            <option value="1 hour">1 hour</option>
            <option value="1.5 hours">1.5 hours</option>
            <option value="2 hours">2 hours</option>
            <option value="3 hours">3 hours</option>
          </Form.Select>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="attendees">
        <Form.Label column sm={3}>Attendees</Form.Label>
        <Col sm={9}>
          <div className="position-relative">
            <Form.Control
              type="text"
              value={attendeeInput}
              onChange={handleAttendeeInput}
              placeholder="Search attendees"
            />
            {attendeeSuggestions.length > 0 && (
              <ListGroup className="position-absolute w-100" style={{ zIndex: 1000 }}>
                {attendeeSuggestions.map((email, index) => (
                  <ListGroup.Item 
                    key={index} 
                    action 
                    onClick={() => addAttendee(email)}
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
                <Badge pill bg="primary" className="me-1 mb-1" key={index}>
                  {attendee}
                  <button 
                    type="button" 
                    className="btn-close btn-close-white btn-sm ms-1" 
                    aria-label="Remove"
                    onClick={() => removeAttendee(index)}
                    style={{ fontSize: '0.5rem' }}
                  />
                </Badge>
              ))}
            </div>
          )}
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="room">
        <Form.Label column sm={3}>Room</Form.Label>
        <Col sm={9}>
          <Form.Control
            type="text"
            name="room"
            value={formData.room}
            onChange={handleInputChange}
            placeholder="Select from availability preview"
            readOnly
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Col sm={{ span: 9, offset: 3 }}>
          <Form.Check
            type="checkbox"
            id="recurring"
            label="Recurring meeting"
            name="recurring"
            checked={formData.recurring}
            onChange={handleInputChange}
          />
          <Form.Check
            type="checkbox"
            id="videoConference"
            label="Video conferencing"
            name="videoConference"
            checked={formData.videoConference}
            onChange={handleInputChange}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mt-4">
        <Col sm={{ span: 9, offset: 3 }}>
          <Button variant="primary" type="submit" className="me-2">
            Book Now
          </Button>
          <Button variant="outline-secondary" type="button">
            Cancel
          </Button>
        </Col>
      </Form.Group>
    </Form>
  );
};

export default BookingForm;