import { useEffect, useState } from "react";

const useLiveUsers = () => {
  const [count, setCount] = useState(18);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, +1
        let next = prev + change;

        if (next < 12) next = 12;
        if (next > 32) next = 32;

        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return count;
};

export default useLiveUsers;