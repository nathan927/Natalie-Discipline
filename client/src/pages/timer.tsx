import { useState, useEffect, useCallback, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Timer as TimerIcon, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mascot } from "@/components/mascot";
import { CelebrationModal } from "@/components/celebration-modal";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { stickers } from "@shared/schema";

const presetTimes = [
  { label: "5 min", minutes: 5 },
  { label: "15 min", minutes: 15 },
  { label: "30 min", minutes: 30 },
  { label: "60 min", minutes: 60 },
];

export default function Timer() {
  const [selectedMinutes, setSelectedMinutes] = useState(15);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const completeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/timer/complete", { durationMinutes: selectedMinutes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      setShowCelebration(true);
    },
  });

  const playAlarm = useCallback(() => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const playTone = (frequency: number, startTime: number, duration: number) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = "sine";
      
      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const now = audioContext.currentTime;
    playTone(523.25, now, 0.2);
    playTone(659.25, now + 0.2, 0.2);
    playTone(783.99, now + 0.4, 0.4);
  }, [soundEnabled]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playAlarm();
            completeMutation.mutate();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, playAlarm, completeMutation]);

  const handlePresetSelect = (minutes: number) => {
    if (isRunning) return;
    setSelectedMinutes(minutes);
    setTimeLeft(minutes * 60);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(selectedMinutes * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = 1 - timeLeft / (selectedMinutes * 60);
  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference * (1 - progress);

  const getMascotMood = () => {
    if (timeLeft === 0) return "cheering";
    if (isRunning) return "happy";
    return "thinking";
  };

  const getMascotMessage = () => {
    if (timeLeft === 0) return "Amazing! You did it!";
    if (isRunning) return "Keep going! You're doing great!";
    return "Ready to focus?";
  };

  return (
    <div className="min-h-screen bg-background pb-28 pt-6">
      <div className="px-6 max-w-lg mx-auto">
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <TimerIcon className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Focus Timer</h1>
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
            data-testid="button-toggle-sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5 text-muted-foreground" />
            )}
          </Button>
        </motion.div>

        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative w-80 h-80">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="160"
                cy="160"
                r="140"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-muted"
              />
              <motion.circle
                cx="160"
                cy="160"
                r="140"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                className="text-primary"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                initial={false}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className="text-6xl font-bold text-foreground tabular-nums"
                key={timeLeft}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 0.3 }}
                data-testid="text-timer-display"
              >
                {formatTime(timeLeft)}
              </motion.span>
              <span className="text-muted-foreground mt-2">
                {isRunning ? "Focus time" : "Press play to start"}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant="secondary"
              size="icon"
              className="w-14 h-14 rounded-full"
              onClick={resetTimer}
              disabled={timeLeft === selectedMinutes * 60 && !isRunning}
              data-testid="button-reset"
            >
              <RotateCcw className="w-6 h-6" />
            </Button>

            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                size="icon"
                className="w-20 h-20 rounded-full shadow-lg"
                onClick={toggleTimer}
                disabled={timeLeft === 0}
                data-testid="button-play-pause"
              >
                <AnimatePresence mode="wait">
                  {isRunning ? (
                    <motion.div
                      key="pause"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Pause className="w-8 h-8" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="play"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Play className="w-8 h-8 ml-1" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>

            <div className="w-14 h-14" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4">
            <h3 className="font-medium text-foreground mb-3 text-center">Quick Timer</h3>
            <div className="grid grid-cols-4 gap-2">
              {presetTimes.map((preset) => (
                <Button
                  key={preset.minutes}
                  variant={selectedMinutes === preset.minutes ? "default" : "secondary"}
                  className="h-12 rounded-xl font-semibold"
                  onClick={() => handlePresetSelect(preset.minutes)}
                  disabled={isRunning}
                  data-testid={`preset-${preset.minutes}`}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Mascot
            mood={getMascotMood()}
            size="md"
            message={getMascotMessage()}
          />
        </motion.div>
      </div>

      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => {
          setShowCelebration(false);
          resetTimer();
        }}
        sticker={stickers[Math.floor(Math.random() * 5)]}
        points={selectedMinutes}
        message="Focus session complete!"
      />
    </div>
  );
}
