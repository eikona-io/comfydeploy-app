"use client";
import { useState } from "react";
import { useEffect } from "react";

interface CountdownTimerProps {
  seconds: number;
}
export const CountdownTimer: React.FC<CountdownTimerProps> = ({ seconds }) => {
  const graceTime = 10; // 10 seconds grace time
  const [timeLeft, setTimeLeft] = useState(seconds + graceTime);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  return (
    <div>
      {timeLeft <= graceTime ? (
        <span>Taking a little while... {timeLeft}</span>
      ) : timeLeft > 0 ? (
        <span>{timeLeft - graceTime}</span>
      ) : (
        <span>timeout</span>
      )}
    </div>
  );
};

interface TimerProps {
  start: number;
  relative?: boolean;
}

const formatTime = (time: number) => {
  const days = Math.floor(time / (24 * 3600));
  const hours = Math.floor((time % (24 * 3600)) / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  if (days > 0) {
    return `${days}d ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  } else if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  } else {
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
};

export const Timer: React.FC<TimerProps> = ({ start, relative }) => {
  const [time, setTime] = useState(
    relative ? Math.floor((new Date().getTime() - start) / 1000) : start,
  );

  useEffect(() => {
    const timerId = setInterval(
      () => {
        if (relative) {
          setTime(Math.floor((new Date().getTime() - start) / 1000));
        } else {
          setTime((prevTime) => prevTime + 1);
        }
      },
      relative ? 200 : 1000,
    );

    return () => clearInterval(timerId);
  }, []);

  return (
    <div>
      <span>
        {formatTime(
          relative ? Math.floor((new Date().getTime() - start) / 1000) : time,
        )}
      </span>
    </div>
  );
};
