import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollProgress from './components/layout/ScrollProgress';
import Loader from './components/ui/Loader';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Experience from './components/sections/Experience';
import Projects from './components/sections/Projects';
import TechStack from './components/sections/TechStack';
import Achievements from './components/sections/Achievements';
import Contact from './components/sections/Contact';
import Admin from './pages/Admin';
import PreviewCV from './pages/PreviewCV';

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
                <Experience />
                <Projects />
                <TechStack />
                <Achievements />
                <Contact />
              </main>
              <Footer />
            </>
          )
        }
      />
      <Route path="/PreviewCV" element={<PreviewCV />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
