import { useEffect, useRef } from 'react';

// Inspired by https://dev.to/rbreahna/javascript-timer-with-react-hooks-560m
const useTimer = ({ periodMs, paused, elapsedTimeCb }) => {
  const initialTimeRef = useRef();

  useEffect(() => {
    if (!paused) {
      if (!initialTimeRef.current) {
        initialTimeRef.current = new Date().getTime() - elapsedTimeCb();
      }

      const id = setInterval(() => {
        const currentTime = new Date().getTime();
        const delay = currentTime - initialTimeRef.current;

        elapsedTimeCb(delay);
      }, periodMs);

      return () => {
        clearInterval(id);
        elapsedTimeCb(new Date().getTime() - initialTimeRef.current);
        initialTimeRef.current = undefined;
      };
    }
  }, [periodMs, paused]);
};

export default useTimer;
