import React, { useState, useEffect } from 'react';

const AddEditRoom = ({ room, onSave, onCancel }) => {
  const equipmentOptions = [
    { key: "mic", label: "Microphone" },
    { key: "projector", label: "Projector" },
    { key: "whiteboard", label: "Whiteboard" },
    { key: "tv", label: "TV Screen" },
    { key: "speakers", label: "Speakers" },
    { key: "videoConf", label: "Video Conferencing" }
  ];

  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    equipment: equipmentOptions.reduce((acc, item) => {
      acc[item.key] = false;
      return acc;
    }, {})
  });

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Populate form if we're editing an existing room
  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name || "",
        capacity: room.capacity || "",
        equipment: {
          ...formData.equipment,
          ...room.equipment
        }
      });
      setIsEditing(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        equipment: {
          ...prev.equipment,
          [name]: checked
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Room name is required";
    }

    if (!formData.capacity || formData.capacity <= 0) {
      newErrors.capacity = "Capacity must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSave({
        ...formData,
        capacity: parseInt(formData.capacity)
      });
    }
  };

  return (
    <div className="add-edit-room">
      <h2>{isEditing ? "Edit Room" : "Add New Room"}</h2>

      <form onSubmit={handleSubmit}>
        {/* Room Name */}
        <div className="form-group">
          <label htmlFor="name">Room Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "error" : ""}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        {/* Capacity */}
        <div className="form-group">
          <label htmlFor="capacity">Capacity</label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            min="1"
            className={errors.capacity ? "error" : ""}
          />
          {errors.capacity && (
            <span className="error-text">{errors.capacity}</span>
          )}
        </div>

        {/* Equipment */}
        <div className="form-group">
          <label>Equipments</label>
          {equipmentOptions.map((item) => (
            <div className="checkbox-group" key={item.key}>
              <label>
                <input
                  type="checkbox"
                  name={item.key}
                  checked={formData.equipment[item.key]}
                  onChange={handleChange}
                />
                {item.label}
              </label>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {isEditing ? "Update Room" : "Add Room"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditRoom;
