import React, { useState } from "react";
import "./PreviewCV.css";

const PreviewCV = () => {
  const [language, setLanguage] = useState("id");

  const pdfPaths = {
    en: require("./Assets/Muchammad Alief Kurnia Wijaya-resume-en.pdf"),
    id: require("./Assets/Muchammad Alief Kurnia Wijaya-resume-id.pdf"),
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <div className="preview-cv-container">
      <div className="header-container">
        <button className="back-button" onClick={handleBackClick}>
          Back
        </button>
        <div className="dropdown-container">
          <label htmlFor="language-select">Select Language :</label>
          <select
            id="language-select"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="id">ID</option>
            <option value="en">EN</option>
          </select>
        </div>
      </div>

      <div className="pdf-viewer">
        <iframe src={pdfPaths[language]} title="Preview CV" />
      </div>
    </div>
  );
};

export default PreviewCV;
