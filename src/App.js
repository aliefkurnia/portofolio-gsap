import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Overview from "./components/Overview";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import ScrollProgressBar from "./components/ScrollProgressBar";
import NameInputModal from "./components/NameInputModal";
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
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
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
      <div className={`hero-wrapper ${showHero ? "open-curtain" : ""}`}>
        <Hero showHero={showHero} setUserName={setUserName} />
      </div>

      {isModalOpen && <NameInputModal onSubmit={handleNameSubmit} />}

      <Overview userName={userName} />
      <Footer />
    </div>
  );
}

export default App;
