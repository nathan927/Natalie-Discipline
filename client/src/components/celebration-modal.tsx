import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Sticker } from "@shared/schema";
import { StickerIcon } from "./sticker-icon";

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  sticker?: Sticker;
  message?: string;
  points?: number;
}

const confettiColors = [
  "bg-pink-400",
  "bg-purple-400",
  "bg-yellow-400",
  "bg-green-400",
  "bg-blue-400",
  "bg-rose-400",
];

function Confetti() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-3 h-3 rounded-full ${confettiColors[i % confettiColors.length]}`}
          initial={{
            x: "50vw",
            y: "50vh",
            scale: 0,
            rotate: 0,
          }}
          animate={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            scale: [0, 1, 0.5],
            rotate: Math.random() * 720,
          }}
          transition={{
            duration: 2 + Math.random(),
            ease: "easeOut",
            delay: Math.random() * 0.3,
          }}
        />
      ))}
    </div>
  );
}

export function CelebrationModal({
  isOpen,
  onClose,
  sticker,
  message = "做得好！",
  points,
}: CelebrationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <Confetti />
          <motion.div
            className="relative bg-card rounded-3xl p-8 mx-6 max-w-sm w-full shadow-2xl border border-border"
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 50 }}
            transition={{ type: "spring", damping: 20 }}
            data-testid="celebration-modal"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={onClose}
              data-testid="celebration-close"
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="flex flex-col items-center text-center">
              <motion.div
                className="mb-6"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.2, damping: 10 }}
              >
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
                  {sticker ? (
                    <StickerIcon sticker={sticker} unlocked={true} size="lg" />
                  ) : (
                    <Sparkles className="w-12 h-12 text-primary" />
                  )}
                </div>
              </motion.div>

              <motion.h2
                className="text-2xl font-bold text-foreground mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {message}
              </motion.h2>

              {sticker && (
                <motion.p
                  className="text-muted-foreground mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  你獲得咗 <span className="text-primary font-semibold">{sticker.name}</span> 貼紙！
                </motion.p>
              )}

              {points !== undefined && (
                <motion.div
                  className="bg-primary/10 rounded-full px-6 py-2 mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <span className="text-primary font-bold text-lg">+{points} 積分！</span>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button onClick={onClose} data-testid="celebration-continue">
                  繼續
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
