// hooks/useTranslation.js
import { useState, useCallback } from 'react';

export const useTranslation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const translateImage = useCallback(async (imageData) => {
    if (!imageData || !imageData.binaryData) {
      setError('No image data provided');
      return null;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Send binary data directly with proper headers
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': imageData.type,
          'Content-Length': imageData.size.toString(),
          'X-File-Name': imageData.name
        },
        body: imageData.binaryData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (data.success) {
        setResult(data.data);
        return data.data;
      } else {
        throw new Error(data.error || 'Translation failed');
      }
    } catch (err) {
      console.error('Translation error:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setResult(null);
    setIsLoading(false);
  }, []);

  return {
    translateImage,
    isLoading,
    error,
    result,
    reset
  };
};