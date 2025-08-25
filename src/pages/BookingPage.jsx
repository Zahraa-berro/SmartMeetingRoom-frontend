import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import BookingForm from '../components/Booking/BookingForm';
import RoomAvailabilityPreview from '../components/Booking/RoomAvailabilityPreview';
import '../App.css';

const BookingPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    duration: '1 hour',
    attendees: [],
    room: '',
    recurring: false,
    videoConference: false
  });

  // Sample room data
  const rooms = [
    { id: 'room1', name: 'Conference Room A' },
    { id: 'room2', name: 'Conference Room B' },
    { id: 'room3', name: 'Small Meeting Room' },
  ];

  // Sample booking data
  const bookings = {
    room1: [
      { startTime: `${formData.date} 10:00`, endTime: `${formData.date} 12:00` }
    ],
    room2: [
      { startTime: `${formData.date} 14:00`, endTime: `${formData.date} 15:00` }
    ]
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Booking logic here
    console.log('Booking submitted:', formData);
  };

  return (
    <Container className="booking-container">
      <Row className="mb-4">
        <Col>
          <h2>Book a Meeting Room</h2>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <BookingForm 
                formData={formData} 
                setFormData={setFormData} 
                onSubmit={handleSubmit}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <RoomAvailabilityPreview 
                rooms={rooms}
                selectedDate={formData.date ? `${formData.date}T${formData.time}` : ''}
                selectedDuration={formData.duration}
                bookings={bookings}
                selectedRoom={formData.room}
                onRoomSelect={(roomId) => setFormData({...formData, room: roomId})}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingPage;