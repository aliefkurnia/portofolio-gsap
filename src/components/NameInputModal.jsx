import React, { useState, useRef, useEffect } from "react";
import "./NameInputModal.css";

const NameInputModal = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null); 

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && name.length <= 10) {
      onSubmit(name);
    } else {
      setError("Name must be less than 10 characters.");
    }
  };

  const handleChange = (e) => {
    const inputName = e.target.value;
    if (inputName.length <= 10) {
      setName(inputName);
      setError(""); 
    } else {
      setError("Name must be less than 10 characters.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>What's your Nickname?</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="example: mulyono"
            value={name}
            onChange={handleChange}
            ref={inputRef} 
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" disabled={!name.trim() || name.length > 10}>
            Lets Go
          </button>
        </form>
      </div>
    </div>
  );
};

export default NameInputModal;
