import React, { Fragment } from 'react';

import useTimer from '../hooks/useTimer';

const parseTimeMs = (timeMs) => {
  const secs = Math.round(timeMs / 1000);
  const h = Math.floor(secs / (60 * 60));
  const divisor_for_minutes = secs % (60 * 60);
  const m = Math.floor(divisor_for_minutes / 60);
  const divisor_for_seconds = divisor_for_minutes % 60;
  const s = Math.ceil(divisor_for_seconds);

  return { h, m, s };
};

const Timer = ({ paused = false, elapsedTimeCb }) => {
  useTimer({ periodMs: 1000, paused, elapsedTimeCb });

  const { h, m, s } = parseTimeMs(elapsedTimeCb());

  return (
    <Fragment>
      <span className="timer">
        {h}:{('0' + m).slice(-2)}:{('0' + s).slice(-2)}
      </span>
      <style jsx>{`
        .timer {
          font-size: 0.75rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </Fragment>
  );
};

export default Timer;
