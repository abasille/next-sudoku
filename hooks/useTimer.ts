import { useEffect, useRef } from 'react';

export type ElapsedTimeCb = (elapsedTime?: number) => number;

// Inspired by https://dev.to/rbreahna/javascript-timer-with-react-hooks-560m
const useTimer = ({
  periodMs,
  paused,
  elapsedTimeCb,
}: {
  periodMs: number;
  paused: boolean;
  elapsedTimeCb: ElapsedTimeCb;
}) => {
  const initialTimeRef = useRef<number>(null);

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
        initialTimeRef.current = null;
      };
    }
  }, [periodMs, paused]);
};

export default useTimer;
