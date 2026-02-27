/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import * as garminAPI from '../services/garminService';

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
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState(() => loadJSON(WORKOUTS_KEY));
  const [plans, setPlans] = useState(() => loadJSON(PLANS_KEY));
  const [garminStatus, setGarminStatus] = useState({ connected: false, displayName: null, loading: true });

  // Persist on change
  useEffect(() => { saveJSON(WORKOUTS_KEY, workouts); }, [workouts]);
  useEffect(() => { saveJSON(PLANS_KEY, plans); }, [plans]);

  // Check Garmin connection status on mount
  useEffect(() => {
    if (!user?.id) {
      setGarminStatus({ connected: false, displayName: null, loading: false });
      return;
    }
    garminAPI.checkGarminStatus(user.id)
      .then(data => setGarminStatus({ connected: data.connected, displayName: data.displayName || null, loading: false }))
      .catch(() => setGarminStatus({ connected: false, displayName: null, loading: false }));
  }, [user?.id]);

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

  // ── Garmin Integration ─────────────────────────────────────

  const connectGarmin = useCallback(async (garminEmail, garminPassword) => {
    if (!user?.id) throw new Error('Must be logged in');
    const result = await garminAPI.connectGarmin(user.id, garminEmail, garminPassword);
    setGarminStatus({ connected: true, displayName: result.displayName, loading: false });
    return result;
  }, [user?.id]);

  const disconnectGarmin = useCallback(async () => {
    if (!user?.id) return;
    await garminAPI.disconnectGarmin(user.id);
    setGarminStatus({ connected: false, displayName: null, loading: false });
  }, [user?.id]);

  const sendToGarmin = useCallback(async (workout) => {
    if (!user?.id) throw new Error('Must be logged in');
    const result = await garminAPI.sendWorkoutToGarmin(user.id, workout);
    return result;
  }, [user?.id]);

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
      garminStatus,
      connectGarmin,
      disconnectGarmin,
      sendToGarmin,
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
