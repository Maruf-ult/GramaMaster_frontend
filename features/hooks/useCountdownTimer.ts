import { useEffect, useRef, useState, useCallback } from "react";

interface UseCountdownTimerOptions {
  durationMinutes: number;
  onExpire: () => void;
}

interface UseCountdownTimerReturn {
  secondsLeft: number;
  formatted: string;
  isExpired: boolean;
  reset: () => void;
}

export function useCountdownTimer({
  durationMinutes,
  onExpire,
}: UseCountdownTimerOptions): UseCountdownTimerReturn {
  const totalSeconds = durationMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const onExpireRef = useRef(onExpire);
  const hasExpiredRef = useRef(false);


  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!hasExpiredRef.current) {
            hasExpiredRef.current = true;
            setTimeout(() => onExpireRef.current(), 0);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const reset = useCallback(() => {
    hasExpiredRef.current = false;
    setSecondsLeft(totalSeconds);
  }, [totalSeconds]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return {
    secondsLeft,
    formatted,
    isExpired: secondsLeft === 0,
    reset,
  };
}