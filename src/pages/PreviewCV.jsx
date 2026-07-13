import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePortfolioData } from "../hooks/usePortfolioData";
import { Skeleton } from "../components/ui/Skeleton";
import "./PreviewCV.css";

const CvSkeleton = () => (
  <div className="cv__viewer cv__viewer--skeleton">
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Skeleton width="40%" height="2rem" />
      <Skeleton width="60%" height="1rem" />
      <Skeleton width="100%" height="1rem" />
      <Skeleton width="90%" height="1rem" />
      <Skeleton width="100%" height="1rem" />
      <div style={{ marginTop: '1rem' }} />
      <Skeleton width="35%" height="1.5rem" />
      <Skeleton width="100%" height="1rem" />
      <Skeleton width="95%" height="1rem" />
      <Skeleton width="80%" height="1rem" />
      <Skeleton width="100%" height="1rem" />
      <div style={{ marginTop: '1rem' }} />
      <Skeleton width="30%" height="1.5rem" />
      <Skeleton width="100%" height="1rem" />
      <Skeleton width="85%" height="1rem" />
      <Skeleton width="92%" height="1rem" />
    </div>
  </div>
);

const PreviewCV = () => {
  const [language, setLanguage] = useState("id");
  const { settings, loading } = usePortfolioData();
  const navigate = useNavigate();

  const pdfPaths = {
    en: settings.cv_en_url || "",
    id: settings.cv_id_url || "",
  };

  return (
    <div className="cv">
      <header className="cv__header">
        <div className="cv__header-inner">
          <button className="cv__back" onClick={() => navigate("/")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="cv__controls">
            <div className="cv__lang-toggle">
              <button
                className={`cv__lang-btn ${language === "id" ? "cv__lang-btn--active" : ""}`}
                onClick={() => setLanguage("id")}
              >
                ID
              </button>
              <button
                className={`cv__lang-btn ${language === "en" ? "cv__lang-btn--active" : ""}`}
                onClick={() => setLanguage("en")}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="cv__body">
        {loading ? (
          <CvSkeleton />
        ) : pdfPaths[language] ? (
          <div className="cv__viewer">
            <iframe src={pdfPaths[language]} title="Resume" />
          </div>
        ) : (
          <div className="cv__empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <p>No resume uploaded yet.</p>
            <span>Upload via the Admin panel to preview here.</span>
          </div>
        )}
      </main>
    </div>
  );
};

export default PreviewCV;
