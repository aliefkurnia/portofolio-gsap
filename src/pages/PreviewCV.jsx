import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePortfolioData } from "../hooks/usePortfolioData";
import { Skeleton } from "../components/ui/Skeleton";
import PixelIcon from "../components/ui/PixelIcon";
import "./PreviewCV.css";

/**
 * CV viewer.
 *
 * Like the game shell, this is a single fixed screen — the header is pinned
 * at the top and the document gets the rest of the viewport, so the page
 * itself never scrolls. Scrolling happens inside the embedded PDF.
 *
 * It shows the resume file that was actually authored and uploaded — the one
 * that is complete and correct to send to an employer. Two files are kept one
 * switch apart (Indonesian / English).
 */

const LANGS = ["id", "en"];

const CvSkeleton = () => (
  <div className="cv__viewer cv__viewer--skeleton px-panel">
    <div className="cv__skeleton-body">
      <Skeleton width="40%" height="2rem" />
      <Skeleton width="60%" height="1rem" />
      <Skeleton width="100%" height="1rem" />
      <Skeleton width="90%" height="1rem" />
      <Skeleton width="100%" height="1rem" />
      <div className="cv__skeleton-gap" />
      <Skeleton width="35%" height="1.5rem" />
      <Skeleton width="100%" height="1rem" />
      <Skeleton width="95%" height="1rem" />
      <Skeleton width="80%" height="1rem" />
      <Skeleton width="100%" height="1rem" />
      <div className="cv__skeleton-gap" />
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
            <PixelIcon name="arrowLeft" size={16} />
            back
          </button>

          <span className="cv__title">Resume</span>

          <div className="cv__controls">
            <div className="cv__seg" role="group" aria-label="Language">
              {LANGS.map((code) => (
                <button
                  key={code}
                  className={`cv__seg-btn ${language === code ? "cv__seg-btn--active" : ""}`}
                  onClick={() => setLanguage(code)}
                  aria-pressed={language === code}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="cv__body">
        {loading ? (
          <CvSkeleton />
        ) : pdfPaths[language] ? (
          <div className="cv__viewer px-panel">
            <iframe src={pdfPaths[language]} title="Resume" />
          </div>
        ) : (
          <div className="cv__empty px-panel">
            <PixelIcon name="file" size={56} />
            <p>No resume uploaded yet.</p>
            <span>Upload via the Admin panel to preview here.</span>
          </div>
        )}
      </main>
    </div>
  );
};

export default PreviewCV;
