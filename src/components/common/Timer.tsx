import React, { useState, useEffect, useMemo } from "react";

type TimerProps = {
  minutes?: number;
  running: boolean;
  resetKey: number;
  onTimeUp: () => void;
};

const Timer: React.FC<TimerProps> = ({
  minutes = 30,
  running,
  resetKey,
  onTimeUp,
}) => {
  const totalSeconds = useMemo(() => minutes * 60, [minutes]);
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [fired, setFired] = useState(false);

  useEffect(() => {
    setTimeLeft(totalSeconds);
    setFired(false);
  }, [resetKey, totalSeconds]);

  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) return;

    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [running, timeLeft]);

  useEffect(() => {
    if (!running) return;
    if (timeLeft > 0) return;
    if (fired) return;

    setFired(true);
    onTimeUp();
  }, [running, timeLeft, fired, onTimeUp]);

  const mm = Math.floor(timeLeft / 60);
  const ss = timeLeft % 60;

  return (
    <div className="fixed top-4 right-5 bg-slate-900 text-white px-3.5 py-2 rounded-xl font-bold z-50">
      {mm}:{ss.toString().padStart(2, "0")}
    </div>
  );
};

export default Timer;
