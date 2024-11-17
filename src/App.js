import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Overview from "./components/Overview";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import ScrollProgressBar from "./components/ScrollProgressBar";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [showHero, setShowHero] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setShowHero(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <ScrollProgressBar />
      <Navbar />
      <div className={`hero-wrapper ${showHero ? "open-curtain" : ""}`}>
        <Hero showHero={showHero} />
      </div>
      <Overview />
      <Footer />
    </div>
  );
}

export default App;
