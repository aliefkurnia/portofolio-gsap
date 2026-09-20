import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePortfolioData } from "../hooks/usePortfolioData";
import { Skeleton } from "../components/ui/Skeleton";
import PixelIcon from "../components/ui/PixelIcon";
import CvDocument from "./CvDocument";
import "./PreviewCV.css";

/**
 * CV viewer.
 *
 * Like the game shell, this is a single fixed screen — the header is pinned
 * at the top and the document gets the rest of the viewport, so the page
 * itself never scrolls. Scrolling happens inside whichever view is showing.
 *
 * Two views, because they answer different questions. `card` renders the CV
 * from the live payload and is the one that looks like the rest of the site;
 * `pdf` shows the file that was actually authored and uploaded, which is the
 * one that is complete and correct to send to an employer. Neither is a
 * fallback for the other, so both stay one click apart.
 */

const VIEWS = [
  { key: "card", label: "Card" },
  { key: "pdf", label: "PDF" },
];

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
  const [view, setView] = useState("card");
  const { settings, experiences, technologies, loading } = usePortfolioData();
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
            <div className="cv__seg" role="group" aria-label="View">
              {VIEWS.map((v) => (
                <button
                  key={v.key}
                  className={`cv__seg-btn ${view === v.key ? "cv__seg-btn--active" : ""}`}
                  onClick={() => setView(v.key)}
                  aria-pressed={view === v.key}
                >
                  {v.label}
                </button>
              ))}
            </div>

            {/* The language switch picks between two uploaded files, so it
                has nothing to do in the rendered view. */}
            {view === "pdf" && (
              <div className="cv__seg" role="group" aria-label="Language">
                {["id", "en"].map((code) => (
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
            )}
          </div>
        </div>
      </header>

      <main className="cv__body">
        {loading ? (
          <CvSkeleton />
        ) : view === "card" ? (
          <div className="cv__paper">
            <CvDocument
              settings={settings}
              experiences={experiences}
              technologies={technologies}
            />
          </div>
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
