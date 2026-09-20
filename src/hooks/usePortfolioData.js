import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const EMPTY = {
  technologies: [],
  aiTools: [],
  experiences: [],
  projects: [],
  settings: {},
  loading: true,
};

/* Module-level cache.
   Five components consume this hook. In the game shell screens mount and
   unmount constantly, so without a cache every stage entry would re-run all
   five queries and flash its skeletons again. One fetch per page load,
   shared by everyone who asks. */
let cache = null;
let inflight = null;

async function fetchPortfolio() {
  const [techRes, aiRes, expRes, projRes, settingsRes] = await Promise.all([
    supabase.from('technologies').select('*').order('sort_order'),
    supabase.from('ai_tools').select('*').order('sort_order'),
    supabase.from('experiences').select('*').order('sort_order'),
    supabase.from('projects').select('*').order('sort_order'),
    supabase.from('site_settings').select('*'),
  ]);

  const settings = {};
  (settingsRes.data || []).forEach((row) => {
    settings[row.key] = row.value;
  });

  return {
    technologies: techRes.data || [],
    aiTools: aiRes.data || [],
    experiences: expRes.data || [],
    projects: projRes.data || [],
    settings,
    loading: false,
  };
}

export function usePortfolioData() {
  const [data, setData] = useState(cache ?? EMPTY);

  useEffect(() => {
    if (cache) {
      setData(cache);
      return undefined;
    }

    let cancelled = false;
    if (!inflight) inflight = fetchPortfolio();

    inflight
      .then((result) => {
        cache = result;
        if (!cancelled) setData(result);
      })
      .catch(() => {
        // Show the sections' own empty/fallback states rather than leaving
        // every visitor stuck on a skeleton forever.
        inflight = null;
        if (!cancelled) setData({ ...EMPTY, loading: false });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}

export default usePortfolioData;
