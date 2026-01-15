import { motion } from "framer-motion";
import type { Sticker } from "@shared/schema";
import { 
  Crown, Heart, Star, Flower2, Rainbow, Sun, Moon,
  Cat, Dog, Rabbit, Bird, Trophy, Medal, Shield, Gem,
  Sparkles, Wand2, Bug
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Princess: Crown,
  Fairy: Wand2,
  Heart: Heart,
  Crown: Crown,
  Butterfly: Bug,
  Bunny: Rabbit,
  Kitty: Cat,
  Puppy: Dog,
  Bear: Bird,
  Unicorn: Sparkles,
  Flower: Flower2,
  Rainbow: Rainbow,
  Star: Star,
  Sun: Sun,
  Moon: Moon,
  Medal: Medal,
  Trophy: Trophy,
  Shield: Shield,
  Gem: Gem,
};

const categoryColors: Record<string, { bg: string; fg: string }> = {
  "magical-girls": { bg: "bg-pink-100 dark:bg-pink-900/30", fg: "text-pink-500" },
  "cute-animals": { bg: "bg-amber-100 dark:bg-amber-900/30", fg: "text-amber-500" },
  "nature": { bg: "bg-green-100 dark:bg-green-900/30", fg: "text-green-500" },
  "achievements": { bg: "bg-purple-100 dark:bg-purple-900/30", fg: "text-purple-500" },
};

interface StickerIconProps {
  sticker: Sticker;
  unlocked: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  onClick?: () => void;
}

export function StickerIcon({ 
  sticker, 
  unlocked, 
  size = "md", 
  showLabel = false,
  onClick 
}: StickerIconProps) {
  const Icon = iconMap[sticker.emoji] || Star;
  const colors = categoryColors[sticker.category] || categoryColors["magical-girls"];
  
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-14 h-14",
    lg: "w-20 h-20",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-7 h-7",
    lg: "w-10 h-10",
  };

  return (
    <motion.div
      className={`flex flex-col items-center gap-1 ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
    >
      <div
        className={`${sizeClasses[size]} rounded-2xl flex items-center justify-center transition-all duration-300 ${
          unlocked
            ? `${colors.bg} shadow-lg shadow-primary/10`
            : "bg-muted/50"
        }`}
      >
        <Icon
          className={`${iconSizes[size]} transition-all duration-300 ${
            unlocked ? colors.fg : "text-muted-foreground/30"
          }`}
        />
        {unlocked && (
          <motion.div
            className="absolute"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className={`${iconSizes[size]} text-yellow-400`} />
          </motion.div>
        )}
      </div>
      {showLabel && (
        <span
          className={`text-xs font-medium text-center ${
            unlocked ? "text-foreground" : "text-muted-foreground/50"
          }`}
        >
          {unlocked ? sticker.name : "???"}
        </span>
      )}
    </motion.div>
  );
}
