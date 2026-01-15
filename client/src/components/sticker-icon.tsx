import { motion } from "framer-motion";
import type { Sticker } from "@shared/schema";
import { Sparkles, Lock } from "lucide-react";

import magicalGirlWithWand from "@assets/generated_images/magical_girl_with_wand.png";
import princessMagicalGirl from "@assets/generated_images/princess_magical_girl.png";
import fortuneTellerGirl from "@assets/generated_images/fortune_teller_girl.png";
import fairyMagicalGirl from "@assets/generated_images/fairy_magical_girl.png";
import unicornRiderGirl from "@assets/generated_images/unicorn_rider_girl.png";
import girlWithBunny from "@assets/generated_images/girl_with_bunny.png";
import girlWithKitten from "@assets/generated_images/girl_with_kitten.png";
import girlWithPuppy from "@assets/generated_images/girl_with_puppy.png";
import girlWithBird from "@assets/generated_images/girl_with_bird.png";
import girlWithHamster from "@assets/generated_images/girl_with_hamster.png";
import cherryBlossomGirl from "@assets/generated_images/cherry_blossom_girl.png";
import rainyDayGirl from "@assets/generated_images/rainy_day_girl.png";
import sunflowerGirl from "@assets/generated_images/sunflower_girl.png";
import autumnLeavesGirl from "@assets/generated_images/autumn_leaves_girl.png";
import winterSnowGirl from "@assets/generated_images/winter_snow_girl.png";
import trophyWinnerGirl from "@assets/generated_images/trophy_winner_girl.png";
import medalWinnerGirl from "@assets/generated_images/medal_winner_girl.png";
import graduateGirl from "@assets/generated_images/graduate_girl.png";
import superStarGirl from "@assets/generated_images/super_star_girl.png";
import rainbowHeartGirl from "@assets/generated_images/rainbow_heart_girl.png";

const imageMap: Record<string, string> = {
  magical_girl_with_wand: magicalGirlWithWand,
  princess_magical_girl: princessMagicalGirl,
  fortune_teller_girl: fortuneTellerGirl,
  fairy_magical_girl: fairyMagicalGirl,
  unicorn_rider_girl: unicornRiderGirl,
  girl_with_bunny: girlWithBunny,
  girl_with_kitten: girlWithKitten,
  girl_with_puppy: girlWithPuppy,
  girl_with_bird: girlWithBird,
  girl_with_hamster: girlWithHamster,
  cherry_blossom_girl: cherryBlossomGirl,
  rainy_day_girl: rainyDayGirl,
  sunflower_girl: sunflowerGirl,
  autumn_leaves_girl: autumnLeavesGirl,
  winter_snow_girl: winterSnowGirl,
  trophy_winner_girl: trophyWinnerGirl,
  medal_winner_girl: medalWinnerGirl,
  graduate_girl: graduateGirl,
  super_star_girl: superStarGirl,
  rainbow_heart_girl: rainbowHeartGirl,
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
  const imageSrc = imageMap[sticker.imageSrc];
  
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const lockSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <motion.div
      className={`flex flex-col items-center gap-1 ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
    >
      <div
        className={`${sizeClasses[size]} rounded-2xl flex items-center justify-center transition-all duration-300 overflow-hidden relative ${
          unlocked
            ? "shadow-lg shadow-primary/20"
            : "bg-muted/50"
        }`}
      >
        {unlocked ? (
          <>
            <img
              src={imageSrc}
              alt={sticker.name}
              className="w-full h-full object-cover"
            />
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="absolute top-0 right-0 w-4 h-4 text-yellow-400" />
            </motion.div>
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-muted/30">
            <Lock className={`${lockSizes[size]} text-muted-foreground/40`} />
          </div>
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
