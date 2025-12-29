import { useState, useEffect } from 'react';

/**
 * Custom hook for data fetching with loading and error states
 * @param {Function} fetchFn - Async function that fetches data
 * @param {Array} deps - Dependencies array for re-fetching
 * @param {*} initialData - Initial data value
 */
export function useApi(fetchFn, deps = [], initialData = null) {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
            try {
                setLoading(true);
                setError(null);
                const result = await fetchFn();
                if (!cancelled) {
                    setData(result);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || 'An error occurred');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchData();

        return () => {
            cancelled = true;
        };
    }, deps);

    const refetch = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchFn();
            setData(result);
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, refetch };
}

/**
 * Hook for lazy loading data (doesn't fetch on mount)
 * @param {Function} fetchFn - Async function that fetches data
 */
export function useLazyApi(fetchFn) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = async (...args) => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchFn(...args);
            setData(result);
            return result;
        } catch (err) {
            setError(err.message || 'An error occurred');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, execute };
}
