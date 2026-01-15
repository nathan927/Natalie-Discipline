import { motion } from "framer-motion";
import mascotHappy from "@assets/generated_images/black_hair_anime_girl_mascot.png";
import mascotWaving from "@assets/generated_images/black_hair_girl_waving_hello.png";

interface MascotProps {
  mood?: "happy" | "cheering" | "thinking" | "sleeping";
  size?: "sm" | "md" | "lg";
  message?: string;
  testId?: string;
}

export function Mascot({ mood = "happy", size = "md", message, testId }: MascotProps) {
  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-28 h-28",
    lg: "w-40 h-40",
  };

  const getMascotImage = () => {
    if (mood === "cheering" || mood === "happy") {
      return mascotWaving;
    }
    return mascotHappy;
  };

  return (
    <div className="flex flex-col items-center gap-2" data-testid={testId || "mascot"}>
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate={
          mood === "cheering"
            ? { y: [0, -10, 0], rotate: [-3, 3, -3] }
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
        <img 
          src={getMascotImage()} 
          alt="Natalie" 
          className="w-full h-full object-contain rounded-full"
        />

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
