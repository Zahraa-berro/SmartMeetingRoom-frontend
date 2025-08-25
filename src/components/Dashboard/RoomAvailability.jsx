import React from 'react';

const RoomAvailability = () => {
  const rooms = [
    { name: 'Conference A', status: 'available' },
    { name: 'Meeting Room 1', status: 'booked' },
    { name: 'Meeting Room 2', status: 'available' },
    { name: 'Board Room', status: 'booked' },
    { name: 'Conference B', status: 'available' },
    { name: 'Zoom Room', status: 'available' }
  ];

  return (
    <div className="room-availability">
      <h3>Room Availability</h3>
      <div className="room-grid">
        {rooms.map((room, index) => (
          <div key={index} className="room-card">
            <div className="room-name">{room.name}</div>
            <div className={`room-status status-${room.status}`}>
              {room.status === 'available' ? 'Available' : 'Booked'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomAvailability;