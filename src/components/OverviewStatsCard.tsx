
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface OverviewStatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  colorClass?: string;
  delay?: number;
}

const useCountUp = (target: number, duration: number = 700, delay: number = 0) => {
  const [count, setCount] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    let start: number | null = null;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start - delay) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        raf.current = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    if (delay > 0) {
      const t = setTimeout(() => {
        raf.current = requestAnimationFrame(animate);
      }, delay);
      return () => {
        clearTimeout(t);
        if (raf.current) cancelAnimationFrame(raf.current);
      };
    } else {
      raf.current = requestAnimationFrame(animate);
      return () => raf.current && cancelAnimationFrame(raf.current);
    }
  }, [target, duration, delay]);

  return count;
};

const OverviewStatsCard: React.FC<OverviewStatsCardProps> = ({
  icon,
  title,
  value,
  colorClass = "",
  delay = 0,
}) => {
  const count = useCountUp(value, 800, delay);

  return (
    <div
      className={cn(
        "rounded-lg shadow flex flex-col items-center p-4 min-h-[115px] bg-gradient-to-tr from-muted via-card to-muted border border-border scale-95 opacity-0 animate-enter",
        colorClass
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <span className="text-3xl font-bold text-primary animate-fade-in">{count}</span>
      <span className="text-muted-foreground text-[14px] text-center animate-fade-in">{title}</span>
    </div>
  );
};

export default OverviewStatsCard;
