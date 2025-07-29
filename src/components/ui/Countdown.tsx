import React, { useEffect, useState } from 'react';

interface CountdownProps {
  initialSeconds?: number;
}

const Countdown: React.FC<CountdownProps> = ({ initialSeconds = 120 }) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;
    const interval = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  return (
    <span className="text-4xl font-bold text-blue-700 mb-2 font-mono">
      {seconds}
    </span>
  );
};

export default Countdown;
