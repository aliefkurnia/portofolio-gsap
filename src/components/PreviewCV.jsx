import React, { useState } from "react";
import "./PreviewCV.css";
import { useNavigate } from "react-router-dom";
import { usePortfolioData } from "../hooks/usePortfolioData";

const PreviewCV = () => {
  const [language, setLanguage] = useState("id");
  const { settings } = usePortfolioData();

  const pdfPaths = {
    en: settings.cv_en_url || require("./Assets/Muchammad Alief Kurnia Wijaya-resume-en.pdf"),
    id: settings.cv_id_url || require("./Assets/Muchammad Alief Kurnia Wijaya-resume-id.pdf"),
  };
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate("/");
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
