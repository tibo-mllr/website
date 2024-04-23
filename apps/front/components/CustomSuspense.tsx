'use client';

import {
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';

type CustomSuspenseProps = {
  children: ReactNode;
  fallback: ReactNode;
  count?: number;
  isLoading: boolean;
};

export function CustomSuspense({
  children,
  fallback,
  count = 1,
  isLoading,
}: CustomSuspenseProps): ReactElement {
  const [showFallback, setShowFallback] = useState(true);
  const [justLoaded, setJustLoaded] = useState(false);
  const isLoadingRef = useRef(isLoading);

  useEffect(() => {
    if (isLoading) {
      setShowFallback(true);
      setJustLoaded(false);
    } else if (!isLoading && isLoadingRef.current) {
      setJustLoaded(true);
      const timer = setTimeout(() => {
        setShowFallback(false);
        setJustLoaded(false);
      }, 250); // 250ms is the duration of the fade-out animation

      // Cleanup function to clear the timeout if the component unmounts
      return () => clearTimeout(timer);
    }

    isLoadingRef.current = isLoading;
  }, [isLoading]);

  if (showFallback)
    return (
      <div className={justLoaded ? 'fade-out' : ''}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i}>{fallback}</div>
        ))}
      </div>
    );

  return <div className="fade-in">{children}</div>;
}
