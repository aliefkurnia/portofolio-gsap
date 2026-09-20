import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loader from './components/ui/Loader';
import Game from './components/game/Game';
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
      {/* The portfolio is a single fixed-viewport game shell: a title screen
          and one stage at a time. Nothing on this route scrolls the page. */}
      <Route
        path="/"
        element={
          loading ? <Loader onComplete={handleLoaderComplete} /> : <Game />
        }
      />
      <Route path="/PreviewCV" element={<PreviewCV />} />
      <Route path="/play" element={<Play />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
