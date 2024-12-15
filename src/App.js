import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom"; // Hanya impor Routes dan Route
import {
  Navbar,
  Hero,
  Overview,
  Footer,
  Loader,
  ScrollProgressBar,
  NameInputModal,
  Works,
  Projects,
  Contact,
  Technologies,
  PreviewCV,
} from "./components";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [showHero, setShowHero] = useState(false);
  const [userName, setUserName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setShowHero(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleNameSubmit = (name) => {
    setUserName(name);
    setIsModalOpen(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <ScrollProgressBar />
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <div className={`hero-wrapper ${showHero ? "open-curtain" : ""}`}>
                <Hero showHero={showHero} setUserName={setUserName} />
              </div>

              {isModalOpen && <NameInputModal onSubmit={handleNameSubmit} />}

              <Overview userName={userName} />
              <Technologies />
              <Works />
              <Projects />
              <Contact userName={userName} />
              <Footer />
            </div>
          }
        />
        <Route path="/PreviewCV" element={<PreviewCV />} />
      </Routes>
    </div>
  );
}

export default App;
