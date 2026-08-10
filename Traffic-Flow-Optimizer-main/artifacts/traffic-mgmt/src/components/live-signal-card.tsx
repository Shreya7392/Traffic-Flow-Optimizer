import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

type SignalState = "green" | "yellow" | "red";

interface LiveSignalCardProps {
  signal: {
    id: number;
    roadName: string;
    direction: string;
    carCount: number;
    state: SignalState;
    greenDuration: number;
    redDuration: number;
    intersectionId: number;
  };
  onClick?: () => void;
}

export function LiveSignalCard({ signal, onClick }: LiveSignalCardProps) {
  const [currentState, setCurrentState] = useState<SignalState>(signal.state);
  const [timeLeft, setTimeLeft] = useState(0);

  // Calculate dynamic timing: 1 car = 1s, 2 cars = 0.5s, 3 cars = 0.25s, etc.
  const calculateDuration = (carCount: number, baseDuration: number) => {
    if (carCount === 0) return baseDuration;
    const factor = 1 / carCount;
    return Math.max(0.1, baseDuration * factor);
  };

  const greenTime = calculateDuration(signal.carCount, signal.greenDuration);
  const redTime = calculateDuration(signal.carCount, signal.redDuration);
  const yellowTime = 3;

  useEffect(() => {
    setCurrentState(signal.state);
    if (signal.state === "green") setTimeLeft(greenTime);
    else if (signal.state === "yellow") setTimeLeft(yellowTime);
    else setTimeLeft(redTime);
  }, [signal.state, signal.carCount]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          setCurrentState((state) => {
            if (state === "green") {
              setTimeout(() => setTimeLeft(yellowTime), 0);
              return "yellow";
            }
            if (state === "yellow") {
              setTimeout(() => setTimeLeft(redTime), 0);
              return "red";
            }
            setTimeout(() => setTimeLeft(greenTime), 0);
            return "green";
          });
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [greenTime, redTime, yellowTime]);

  const bgColor = {
    green: "bg-emerald-950/40 border-emerald-500/30",
    yellow: "bg-yellow-950/40 border-yellow-500/30",
    red: "bg-red-950/40 border-red-500/30",
  }[currentState];

  const glowColor = {
    green: "shadow-[0_0_20px_rgba(16,185,129,0.3)]",
    yellow: "shadow-[0_0_20px_rgba(234,179,8,0.3)]",
    red: "shadow-[0_0_20px_rgba(239,68,68,0.3)]",
  }[currentState];

  return (
    <motion.div
      onClick={onClick}
      className={`relative overflow-hidden rounded-lg border-2 transition-all duration-500 cursor-pointer ${bgColor} ${glowColor}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
      
      <div className="relative p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-bold text-sm truncate flex-1">{signal.roadName}</div>
          <Badge variant="outline" className="font-mono bg-background/50 ml-2 shrink-0 text-[10px]">
            {signal.direction}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1 bg-zinc-900/80 p-2 rounded border border-zinc-700">
              <motion.div
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  currentState === "red" ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)]" : "bg-red-950"
                }`}
                animate={currentState === "red" ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.div
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  currentState === "yellow" ? "bg-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.9)]" : "bg-yellow-950"
                }`}
                animate={currentState === "yellow" ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              <motion.div
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  currentState === "green" ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.9)]" : "bg-emerald-950"
                }`}
                animate={currentState === "green" ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>

            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">
                <span className="font-mono text-foreground font-bold">{signal.carCount}</span> cars
              </div>
              <div className="font-mono text-2xl font-black tabular-nums">
                {timeLeft.toFixed(1)}
                <span className="text-xs text-muted-foreground ml-0.5">s</span>
              </div>
            </div>
          </div>

          <div className="font-mono text-[10px] flex flex-col gap-1 text-right">
            <span className="text-emerald-400">G: {greenTime.toFixed(1)}s</span>
            <span className="text-yellow-400">Y: {yellowTime}s</span>
            <span className="text-red-400">R: {redTime.toFixed(1)}s</span>
          </div>
        </div>

        <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${
              currentState === "green"
                ? "bg-emerald-500"
                : currentState === "yellow"
                ? "bg-yellow-400"
                : "bg-red-500"
            }`}
            animate={{
              width: `${
                (timeLeft /
                  (currentState === "green" ? greenTime : currentState === "yellow" ? yellowTime : redTime)) *
                100
              }%`,
            }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
