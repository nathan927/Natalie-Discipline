import { motion } from "framer-motion";

interface MascotProps {
  mood?: "happy" | "cheering" | "thinking" | "sleeping";
  size?: "sm" | "md" | "lg";
  message?: string;
  testId?: string;
}

export function Mascot({ mood = "happy", size = "md", message, testId }: MascotProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const faceExpressions = {
    happy: { eyes: "^", mouth: "◡" },
    cheering: { eyes: "★", mouth: "◡" },
    thinking: { eyes: "•", mouth: "~" },
    sleeping: { eyes: "—", mouth: "◡" },
  };

  const expression = faceExpressions[mood];

  return (
    <div className="flex flex-col items-center gap-2" data-testid={testId || "mascot"}>
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate={
          mood === "cheering"
            ? { y: [0, -10, 0], rotate: [-5, 5, -5] }
            : mood === "sleeping"
            ? { y: [0, 2, 0] }
            : { y: [0, -5, 0] }
        }
        transition={{
          duration: mood === "sleeping" ? 3 : 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-300 to-pink-400 dark:from-pink-500 dark:to-pink-600 shadow-lg flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30 rounded-full" />
          
          <div className="flex gap-2 mb-1 relative z-10">
            <motion.span 
              className="text-lg font-bold text-pink-700 dark:text-pink-200"
              animate={mood === "sleeping" ? { opacity: [1, 0.5, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {expression.eyes}
            </motion.span>
            <motion.span 
              className="text-lg font-bold text-pink-700 dark:text-pink-200"
              animate={mood === "sleeping" ? { opacity: [1, 0.5, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {expression.eyes}
            </motion.span>
          </div>
          
          <span className="text-xl text-pink-600 dark:text-pink-200 relative z-10">
            {expression.mouth}
          </span>

          <motion.div
            className="absolute -top-2 left-1/2 transform -translate-x-1/2"
            animate={{ rotate: mood === "cheering" ? [0, -10, 10, 0] : 0 }}
            transition={{ duration: 0.5, repeat: mood === "cheering" ? Infinity : 0 }}
          >
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-yellow-400" />
          </motion.div>

          <div className="absolute -left-1 top-1/3 w-3 h-4 rounded-full bg-pink-400 dark:bg-pink-500" />
          <div className="absolute -right-1 top-1/3 w-3 h-4 rounded-full bg-pink-400 dark:bg-pink-500" />
        </div>

        {mood === "cheering" && (
          <>
            <motion.div
              className="absolute -top-4 -left-2"
              animate={{ rotate: [0, 20, 0], y: [0, -5, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <span className="text-2xl">✨</span>
            </motion.div>
            <motion.div
              className="absolute -top-4 -right-2"
              animate={{ rotate: [0, -20, 0], y: [0, -5, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: 0.25 }}
            >
              <span className="text-2xl">✨</span>
            </motion.div>
          </>
        )}

        {mood === "sleeping" && (
          <motion.div
            className="absolute -top-6 right-0"
            animate={{ opacity: [0, 1, 0], y: [0, -10] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-lg">💤</span>
          </motion.div>
        )}
      </motion.div>

      {message && (
        <motion.div
          className="bg-card px-4 py-2 rounded-2xl shadow-sm border border-border max-w-[200px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm text-center text-foreground">{message}</p>
        </motion.div>
      )}
    </div>
  );
}
