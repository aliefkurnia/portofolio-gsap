import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function usePortfolioData() {
  const [technologies, setTechnologies] = useState([]);
  const [aiTools, setAiTools] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [techRes, aiRes, expRes, projRes, settingsRes] = await Promise.all([
        supabase.from('technologies').select('*').order('sort_order'),
        supabase.from('ai_tools').select('*').order('sort_order'),
        supabase.from('experiences').select('*').order('sort_order'),
        supabase.from('projects').select('*').order('sort_order'),
        supabase.from('site_settings').select('*'),
      ]);

      if (techRes.data) setTechnologies(techRes.data);
      if (aiRes.data) setAiTools(aiRes.data);
      if (expRes.data) setExperiences(expRes.data);
      if (projRes.data) setProjects(projRes.data);
      if (settingsRes.data) {
        const map = {};
        settingsRes.data.forEach((row) => {
          map[row.key] = row.value;
        });
        setSettings(map);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  return { technologies, aiTools, experiences, projects, settings, loading };
}
