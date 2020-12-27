import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import dayjs from 'dayjs';
import { Text } from '@chakra-ui/react';

type TimerRef = {
  started?: number;
  lastInterval?: number;
  timeLeft?: number;
  timeToCount?: number;
  requestId?: number;
};

const useCountdown = (timeToCount = 60 * 1000, interval = 1000) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const timer = useRef({} as TimerRef);

  const run = (ts) => {
    if (!timer.current.started) {
      timer.current.started = ts;
      timer.current.lastInterval = ts;
    }

    const localInterval = Math.min(
      interval,
      timer.current.timeLeft || Infinity
    );
    if (ts - timer.current.lastInterval >= localInterval) {
      timer.current.lastInterval += localInterval;
      setTimeLeft((timeLeft) => {
        timer.current.timeLeft = timeLeft - localInterval;
        return timer.current.timeLeft;
      });
    }

    if (ts - timer.current.started < timer.current.timeToCount) {
      timer.current.requestId = window.requestAnimationFrame(run);
    }
  };

  const start = useCallback((ttc = null) => {
    window.cancelAnimationFrame(timer.current.requestId);

    const newTimeToCount = ttc || timeToCount;
    timer.current.started = null;
    timer.current.lastInterval = null;
    timer.current.timeToCount = newTimeToCount;
    timer.current.requestId = window.requestAnimationFrame(run);

    setTimeLeft(newTimeToCount);
  }, []);

  const pause = useCallback(() => {
    window.cancelAnimationFrame(timer.current.requestId);
    timer.current.started = null;
    timer.current.lastInterval = null;
    timer.current.timeToCount = timer.current.timeLeft;
  }, []);

  const resume = useCallback(() => {
    if (!timer.current.started && timer.current.timeLeft > 0) {
      window.cancelAnimationFrame(timer.current.requestId);
      timer.current.requestId = window.requestAnimationFrame(run);
    }
  }, []);

  const reset = useCallback(() => {
    if (timer.current.timeLeft) {
      window.cancelAnimationFrame(timer.current.requestId);
      timer.current = {};
      setTimeLeft(0);
    }
  }, []);

  const actions = useMemo(() => ({ start, pause, resume, reset }), []);

  useEffect(() => reset, []);

  return { timeLeft, actions };
};

export default ({ time }) => {
  const interval = 1000;
  const diff = (time.unix() - dayjs().unix()) * interval;
  const { timeLeft, actions } = useCountdown(diff, interval);

  useEffect(() => {
    actions.start();
  }, [actions]);

  const timestamp = timeLeft / interval;

  if (timestamp <= 0) return <Text as="span">Times up!</Text>;

  const hours = Math.floor(timestamp / 60 / 60);
  const minutes = Math.floor(timestamp / 60) - hours * 60;
  const seconds = timestamp % 60;

  const timeString = [];

  if (hours !== 0) {
    timeString.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  }
  if (minutes !== 0) {
    timeString.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  }
  if (seconds !== 0) {
    timeString.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`);
  }

  return <Text as="span">{timeString.join(', ')}</Text>;
};
