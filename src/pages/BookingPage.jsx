import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import BookingForm from '../components/Booking/BookingForm';
import RoomAvailabilityPreview from '../components/Booking/RoomAvailabilityPreview';
import '../App.css';

const BookingPage = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    title: '',
    agenda: '',
    date: '',
    time: '',
    duration: '1 hour',
    attendees: [],
    room_name: '', 
    recurring: false,
    videoConference: false
  });

  
  useEffect(() => {
    if (location.state) {
      const { selectedRoom, formData: passedFormData } = location.state;
      
      setFormData(prev => ({
        ...prev,
        date: passedFormData.date || '',
        time: passedFormData.time || '',
        duration: passedFormData.duration || '1 hour',
        room_name: selectedRoom?.name || passedFormData.room_name || '' 
      }));
    }
  }, [location.state]);

  
  const rooms = [
    { id: 'room1', name: 'Conference Room A' },
    { id: 'room2', name: 'Conference Room B' },
    { id: 'room3', name: 'Small Meeting Room' },
  ];

  const handleSubmit = (responseData) => {
    console.log('Booking submitted successfully:', responseData);
  };

  return (
    <Container className="booking-container">
      <Row className="mb-4">
        <Col>
          <h2>Book a Meeting Room</h2>
          {formData.room_name && (
            <div className="alert alert-info">
              <strong>Selected Room:</strong> {formData.room_name}
            </div>
          )}
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
                bookings={[]} 
                selectedRoom={formData.room_name}
                onRoomSelect={(roomId) => {
                  const selected = rooms.find(r => r.id === roomId);
                  setFormData({...formData, room_name: selected?.name || ''});
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingPage;