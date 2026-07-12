import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
import Admin from "./pages/Admin";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [showHero, setShowHero] = useState(false);
  const [userName, setUserName] = useState(() => localStorage.getItem("porto_nickname") || "");
  const [isModalOpen, setIsModalOpen] = useState(() => !localStorage.getItem("porto_nickname"));
  const location = useLocation();
  const isAdmin = location.pathname === "/admin";

  useEffect(() => {
    if (isModalOpen && !isAdmin) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen, isAdmin]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setShowHero(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleNameSubmit = (name) => {
    localStorage.setItem("porto_nickname", name);
    setUserName(name);
    setIsModalOpen(false);
  };

  if (loading && !isAdmin) {
    return <Loader />;
  }

  return (
    <div>
      {!isAdmin && <ScrollProgressBar />}
      {!isAdmin && <Navbar />}
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
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;
