import { createContext, useState, useCallback } from 'react';

export const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = useCallback(() => {
    setIsLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    setIsLoading(false);
  }, []);

  const withLoader = useCallback(async (asyncFunction) => {
    showLoader();
    try {
      const result = await asyncFunction();
      return result;
    } finally {
      // Add a small delay for smooth transition
      setTimeout(() => hideLoader(), 500);
    }
  }, [showLoader, hideLoader]);

  return (
    <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader, withLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};
