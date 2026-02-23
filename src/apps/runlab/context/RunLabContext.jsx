/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const RunLabContext = createContext(null);

const WORKOUTS_KEY = 'movelab_runlab_workouts';
const PLANS_KEY = 'movelab_runlab_plans';

function loadJSON(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`RunLab: failed to persist ${key}`, err);
  }
}

export function RunLabProvider({ children }) {
  const [workouts, setWorkouts] = useState(() => loadJSON(WORKOUTS_KEY));
  const [plans, setPlans] = useState(() => loadJSON(PLANS_KEY));

  // Persist on change
  useEffect(() => { saveJSON(WORKOUTS_KEY, workouts); }, [workouts]);
  useEffect(() => { saveJSON(PLANS_KEY, plans); }, [plans]);

  // ── Workout CRUD ───────────────────────────────────────────

  const addWorkout = useCallback((workout) => {
    setWorkouts(prev => [workout, ...prev]);
  }, []);

  const updateWorkout = useCallback((updated) => {
    setWorkouts(prev =>
      prev.map(w => w.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : w)
    );
  }, []);

  const deleteWorkout = useCallback((id) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
  }, []);

  const getWorkout = useCallback((id) => {
    return workouts.find(w => w.id === id) || null;
  }, [workouts]);

  // ── Plan CRUD ──────────────────────────────────────────────

  const addPlan = useCallback((plan) => {
    setPlans(prev => [plan, ...prev]);
  }, []);

  const updatePlan = useCallback((updated) => {
    setPlans(prev =>
      prev.map(p => p.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : p)
    );
  }, []);

  const deletePlan = useCallback((id) => {
    setPlans(prev => prev.filter(p => p.id !== id));
  }, []);

  const getPlan = useCallback((id) => {
    return plans.find(p => p.id === id) || null;
  }, [plans]);

  return (
    <RunLabContext.Provider value={{
      workouts,
      plans,
      addWorkout,
      updateWorkout,
      deleteWorkout,
      getWorkout,
      addPlan,
      updatePlan,
      deletePlan,
      getPlan,
    }}>
      {children}
    </RunLabContext.Provider>
  );
}

export function useRunLab() {
  const ctx = useContext(RunLabContext);
  if (!ctx) throw new Error('useRunLab must be used within RunLabProvider');
  return ctx;
}
