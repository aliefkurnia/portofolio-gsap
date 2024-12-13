import React, { useState, useRef, useEffect } from "react";
import "./NameInputModal.css";

const NameInputModal = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    const allFocusableElements = document.querySelectorAll(
      'button, input, select, textarea, a, [tabindex]:not([tabindex="-1"])'
    );
    
    const modalFocusableElements = modalRef.current.querySelectorAll(
      'button, input, select, textarea'
    );

    allFocusableElements.forEach((el) => {
      el.setAttribute("tabindex", "-1");
    });

    modalFocusableElements.forEach((el) => {
      el.setAttribute("tabindex", "0");
    });

    return () => {
      allFocusableElements.forEach((el) => {
        el.removeAttribute("tabindex");
      });

      modalFocusableElements.forEach((el) => {
        el.removeAttribute("tabindex");
      });
    };
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
      <div className="modal-content" ref={modalRef}>
        <h2>What's your Nickname?</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="example: agus"
            value={name}
            onChange={handleChange}
            ref={inputRef}
          />
          {error && <p className="error-messageModal">{error}</p>}
          <button type="submit" disabled={!name.trim() || name.length > 10}>
            Let's Go
          </button>
        </form>
      </div>
    </div>
  );
};

export default NameInputModal;
