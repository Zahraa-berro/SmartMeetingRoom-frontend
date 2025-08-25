import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import AddEditRoom from '../components/Admin/AddEditRoom';
import '../App.css';

const AdminPage = () => {
  const [rooms, setRooms] = useState([
    { id: 1, name: 'Conference A', capacity: 10, equipment: ['Projector', 'Mic'], status: 'Available' },
    { id: 2, name: 'Meeting Room 3', capacity: 6, equipment: ['TV'], status: 'Booked' },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const handleEdit = (room) => {
    setEditingRoom(room);
    setShowAddForm(true);
  };

  const handleSave = (room) => {
    if (room.id) {
      // Update existing room
      setRooms(rooms.map(r => r.id === room.id ? room : r));
    } else {
      // Add new room
      const newRoom = { ...room, id: rooms.length + 1 };
      setRooms([...rooms, newRoom]);
    }
    setShowAddForm(false);
    setEditingRoom(null);
  };

  return (
    <Container className="admin-container">
      <Row className="mb-4">
        <Col>
          <h2>Room Management</h2>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => setShowAddForm(true)}>
            Add New Room
          </Button>
        </Col>
      </Row>

      {showAddForm && (
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Body>
                <AddEditRoom 
                  room={editingRoom} 
                  onSave={handleSave} 
                  onCancel={() => {
                    setShowAddForm(false);
                    setEditingRoom(null);
                  }} 
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Room Name</th>
                    <th>Capacity</th>
                    <th>Equipment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map(room => (
                    <tr key={room.id}>
                      <td>{room.name}</td>
                      <td>{room.capacity}</td>
                      <td>{room.equipment.join(', ')}</td>
                      <td>{room.status}</td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => handleEdit(room)}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPage;