import React, { useState, useEffect } from 'react';

const RoomAvailabilityChecker = () => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [rooms, setRooms] = useState([
    { id: 1, name: "Conference Room A", capacity: 20, features: ["Projector", "Video Conferencing", "Whiteboard"], imageColor: "#6c87b0" },
    { id: 2, name: "Conference Room B", capacity: 12, features: ["TV Display", "Phone System", "Whiteboard"], imageColor: "#8ba5cc" },
    { id: 3, name: "Meeting Room C", capacity: 8, features: ["Monitor", "Speakerphone"], imageColor: "#a4b9db" },
    { id: 4, name: "Boardroom", capacity: 16, features: ["4K Display", "Advanced Audio", "Video Conferencing"], imageColor: "#6c87b0" }
  ]);

  const [bookings, setBookings] = useState([
    { roomId: 1, date: "2023-09-15", startTime: "09:00", endTime: "10:30" },
    { roomId: 2, date: "2023-09-15", startTime: "14:00", endTime: "15:00" },
    { roomId: 4, date: "2023-09-15", startTime: "11:00", endTime: "12:30" },
    { roomId: 3, date: "2023-09-15", startTime: "16:00", endTime: "17:00" }
  ]);

  const [availableRooms, setAvailableRooms] = useState([]);

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setDate(`${yyyy}-${mm}-${dd}`);

    const nextHour = today.getHours() + 1;
    setStartTime(`${nextHour.toString().padStart(2, '0')}:00`);
  }, []);

  const timeToMinutes = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    return h > 12 ? `${h - 12}:${minutes} PM` : `${h}:${minutes} AM`;
  };

  const checkAvailability = () => {
    if (!date || !startTime || !duration) {
      alert('Please fill all fields');
      return;
    }

    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + parseInt(duration);
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;

    const available = rooms.filter(room => {
      const conflict = bookings.some(b => {
        if (b.roomId !== room.id || b.date !== date) return false;
        const bStart = timeToMinutes(b.startTime);
        const bEnd = timeToMinutes(b.endTime);
        const reqStart = timeToMinutes(startTime);
        const reqEnd = timeToMinutes(endTime);
        return reqStart < bEnd && reqEnd > bStart;
      });
      return !conflict;
    });

    setAvailableRooms(available);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    checkAvailability();
  };

  const handleRoomSelect = (id) => {
    setSelectedRoom(id);
    alert(`Room ${rooms.find(r => r.id === id).name} selected!`);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Room Availability Checker</h1>
        <p style={styles.description}>Find available rooms for your meeting or event</p>
      </header>

      {/* Form Section */}
      <section style={styles.searchPanel}>
        <form style={styles.searchForm} onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={styles.input} required />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Start Time</label>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} style={styles.input} required />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Duration</label>
            <select value={duration} onChange={(e) => setDuration(e.target.value)} style={styles.input} required>
              <option value="">Select duration</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
              <option value="180">3 hours</option>
            </select>
          </div>

          <button type="submit" style={styles.button}>Check Availability</button>
        </form>
      </section>

      {/* Results Section */}
      <section style={styles.resultsContainer}>
        <h2 style={styles.resultsCount}>Available Rooms ({availableRooms.length})</h2>
        {availableRooms.length > 0 && (
          <p style={styles.resultsSummary}>
            {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} from {formatTime(startTime)} for {duration} minutes
          </p>
        )}

        {availableRooms.length === 0 ? (
          <div style={styles.noResults}>
            <i className="fas fa-search" style={{ fontSize: '3rem', marginBottom: '15px', color: '#718096' }}></i>
            <p>Enter your desired date and time to see available rooms</p>
          </div>
        ) : (
          <div style={styles.roomsGrid}>
            {availableRooms.map(room => (
              <div key={room.id} style={styles.roomCard}>
                <div style={{ ...styles.roomImage, background: `linear-gradient(45deg, ${room.imageColor}, #a4b9db)` }}>
                  <i className="fas fa-door-open"></i>
                </div>
                <div style={styles.roomDetails}>
                  <h3 style={styles.roomName}>{room.name}</h3>
                  <p><strong>Capacity:</strong> {room.capacity} people</p>
                  <ul style={styles.roomFeatures}>
                    {room.features.map((f, idx) => (
                      <li key={idx}><i className="fas fa-check" style={styles.featureIcon}></i> {f}</li>
                    ))}
                  </ul>
                  <div style={styles.roomAvailability}>
                    <span style={styles.availabilityStatus}>Available</span>
                    <button
                      style={{ ...styles.bookBtn, backgroundColor: selectedRoom === room.id ? '#2f855a' : '#38a169' }}
                      onClick={() => handleRoomSelect(room.id)}
                    >
                      {selectedRoom === room.id ? 'Selected' : 'Select Room'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

// Styles
const styles = {
  container: { width: '100%', maxWidth: 800, margin: '20px auto', borderRadius: 15, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflow: 'hidden' },
  header: { background: '#4a6fa5', color: 'white', padding: '20px', textAlign: 'center' },
  title: { fontSize: '2rem', marginBottom: 10 },
  description: { opacity: 0.9 },
  searchPanel: { padding: 20, background: '#f8f9fa', borderBottom: '1px solid #eaeaea' },
  searchForm: { display: 'flex', flexDirection: 'column', gap: 15 },
  formGroup: { display: 'flex', flexDirection: 'column' },
  label: { fontWeight: 600, marginBottom: 5 },
  input: { padding: '10px 12px', borderRadius: 8, border: '2px solid #e2e8f0', fontSize: '1rem' },
  button: { marginTop: 10, padding: '10px 20px', background: '#4a6fa5', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  resultsContainer: { padding: 20 },
  resultsCount: { fontSize: '1.3rem', fontWeight: 600, marginBottom: 10 },
  resultsSummary: { color: '#4a5568', marginBottom: 15 },
  noResults: { textAlign: 'center', padding: 40, color: '#718096' },
  roomsGrid: { display: 'grid', gridTemplateColumns: '1fr', gap: 20 }, // force single column
  roomCard: { background: 'white', borderRadius: 10, overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' },
  roomImage: { height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem' },
  roomDetails: { padding: 20 },
  roomName: { fontSize: '1.3rem', marginBottom: 10 },
  roomFeatures: { listStyleType: 'none', margin: '10px 0' },
  featureIcon: { color: '#4a6fa5', marginRight: 8 },
  roomAvailability: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, borderTop: '1px solid #eaeaea', paddingTop: 10 },
  availabilityStatus: { fontWeight: 600, color: '#38a169' },
  bookBtn: { border: 'none', color: 'white', padding: '8px 15px', borderRadius: 8, cursor: 'pointer' }
};

export default RoomAvailabilityChecker;
