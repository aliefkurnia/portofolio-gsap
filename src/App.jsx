import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollProgress from './components/layout/ScrollProgress';
import Loader from './components/ui/Loader';
import GameNudge from './components/ui/GameNudge';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import TechStack from './components/sections/TechStack';
import Experience from './components/sections/Experience';
import Projects from './components/sections/Projects';
import Contact from './components/sections/Contact';
import Admin from './pages/Admin';
import PreviewCV from './pages/PreviewCV';
import Play from './pages/Play';

function App() {
  const hasLoaded = sessionStorage.getItem('hasLoaded');
  const [loading, setLoading] = useState(!hasLoaded);

  const handleLoaderComplete = () => {
    sessionStorage.setItem('hasLoaded', 'true');
    setLoading(false);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          loading ? (
            <Loader onComplete={handleLoaderComplete} />
          ) : (
            <>
              <ScrollProgress />
              <Navbar />
              <main>
                <Hero />
                <About />
                <TechStack />
                <Experience />
                <Projects />
                <Contact />
              </main>
              <Footer />
              <GameNudge />
            </>
          )
        }
      />
      <Route path="/PreviewCV" element={<PreviewCV />} />
      <Route path="/play" element={<Play />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
