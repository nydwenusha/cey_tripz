import { useState, useCallback } from 'react';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((url, options = {}) => {
    return makeRequest(url, { ...options, method: 'GET' });
  }, [makeRequest]);

  const post = useCallback((url, data, options = {}) => {
    return makeRequest(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }, [makeRequest]);

  const put = useCallback((url, data, options = {}) => {
    return makeRequest(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }, [makeRequest]);

  const del = useCallback((url, options = {}) => {
    return makeRequest(url, { ...options, method: 'DELETE' });
  }, [makeRequest]);

  return {
    loading,
    error,
    get,
    post,
    put,
    delete: del,
  };
};