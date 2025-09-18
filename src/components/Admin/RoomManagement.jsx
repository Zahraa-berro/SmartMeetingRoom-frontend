import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RoomManager = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Make sure to include your authentication token if required
      const token = localStorage.getItem('auth_token'); // or your token storage method
      
      const response = await axios.get('/api/rooms', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.data.success) {
        setRooms(response.data.data.rooms);
      } else {
        setError('Failed to fetch rooms');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching rooms');
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error: {error}</p>
        <button
          onClick={fetchRooms}
          className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Room Manager</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{room.name}</h2>
              
              <div className="mb-4">
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Capacity:</span> {room.capacity} people
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Location:</span> {room.location}
                </p>
                {room.floor && (
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Floor:</span> {room.floor}
                  </p>
                )}
                {room.room_number && (
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Room Number:</span> {room.room_number}
                  </p>
                )}
              </div>

              {room.features && room.features.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Features:</h3>
                  <div className="flex flex-wrap gap-2">
                    {room.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mt-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  room.status === 'available' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {room.status || 'unknown'}
                </span>
                
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
                  Book Room
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {rooms.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No rooms available</p>
        </div>
      )}
    </div>
  );
};

export default RoomManager;