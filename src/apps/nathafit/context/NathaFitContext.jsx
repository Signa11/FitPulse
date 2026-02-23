/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const NathaFitContext = createContext(null);

export function NathaFitProvider({ children }) {
  const [completedWorkouts, setCompletedWorkouts] = useState(() => {
    try {
      const s = localStorage.getItem('nathafit-completed');
      return s ? new Set(JSON.parse(s)) : new Set();
    } catch { return new Set(); }
  });
  const [completedHistory, setCompletedHistory] = useState(() => {
    try {
      const s = localStorage.getItem('nathafit-history');
      return s ? JSON.parse(s) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('nathafit-completed', JSON.stringify([...completedWorkouts]));
  }, [completedWorkouts]);

  useEffect(() => {
    localStorage.setItem('nathafit-history', JSON.stringify(completedHistory));
  }, [completedHistory]);

  const markComplete = (workout, startTime) => {
    setCompletedWorkouts(prev => new Set([...prev, workout.id]));
    setCompletedHistory(prev => [...prev, {
      id: workout.id,
      date: new Date().toISOString().split('T')[0],
      duration: startTime ? Math.floor((Date.now() - startTime) / 1000) : 28 * 60,
    }]);
  };

  const resetProgress = () => {
    setCompletedWorkouts(new Set());
    setCompletedHistory([]);
  };

  return (
    <NathaFitContext.Provider value={{
      completedWorkouts,
      completedHistory,
      markComplete,
      resetProgress,
    }}>
      {children}
    </NathaFitContext.Provider>
  );
}

export function useNathaFit() {
  const context = useContext(NathaFitContext);
  if (!context) throw new Error('useNathaFit must be used within NathaFitProvider');
  return context;
}
