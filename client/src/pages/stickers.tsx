import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Lock, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StickerIcon } from "@/components/sticker-icon";
import { Mascot } from "@/components/mascot";
import { stickers, stickerCategories, type StickerCategory, type UserProgress } from "@shared/schema";

const categoryLabels: Record<StickerCategory, string> = {
  "magical-girls": "魔法",
  "cute-animals": "動物",
  "nature": "自然",
  "achievements": "獎勵",
};

const categoryIcons: Record<StickerCategory, string> = {
  "magical-girls": "sparkles",
  "cute-animals": "heart",
  "nature": "flower",
  "achievements": "trophy",
};

export default function Stickers() {
  const [selectedCategory, setSelectedCategory] = useState<StickerCategory>("magical-girls");
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);

  const { data: progress } = useQuery<UserProgress>({
    queryKey: ["/api/progress"],
  });

  const unlockedStickers = progress?.unlockedStickers || [];
  const totalPoints = progress?.totalPoints || 0;

  const filteredStickers = stickers.filter(s => s.category === selectedCategory);
  
  const nextSticker = stickers
    .filter(s => !unlockedStickers.includes(s.id))
    .sort((a, b) => a.requiredPoints - b.requiredPoints)[0];

  const progressToNext = nextSticker 
    ? Math.min(100, (totalPoints / nextSticker.requiredPoints) * 100)
    : 100;

  const pointsNeeded = nextSticker 
    ? Math.max(0, nextSticker.requiredPoints - totalPoints)
    : 0;

  return (
    <div className="min-h-screen bg-background pb-28 pt-6">
      <div className="px-6 max-w-lg mx-auto">
        <motion.div
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Star className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">我嘅貼紙</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-5 mb-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">下一個貼紙</span>
              </div>
              <span className="text-sm text-muted-foreground" data-testid="text-points-total">
                {totalPoints} 積分
              </span>
            </div>

            {nextSticker ? (
              <>
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-2 bg-card rounded-xl">
                    <StickerIcon sticker={nextSticker} unlocked={false} size="md" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{nextSticker.name}</p>
                    <p className="text-sm text-muted-foreground">
                      仲差 {pointsNeeded} 積分
                    </p>
                  </div>
                </div>
                <Progress value={progressToNext} className="h-3 rounded-full" />
              </>
            ) : (
              <div className="text-center py-4">
                <p className="font-semibold text-foreground">所有貼紙已解鎖！</p>
                <p className="text-sm text-muted-foreground">你係超級巨星！</p>
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs 
            value={selectedCategory} 
            onValueChange={(v) => setSelectedCategory(v as StickerCategory)}
          >
            <TabsList className="w-full grid grid-cols-4 h-12 mb-6">
              {stickerCategories.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="text-xs font-medium rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  data-testid={`tab-${cat}`}
                >
                  {categoryLabels[cat]}
                </TabsTrigger>
              ))}
            </TabsList>

            {stickerCategories.map((cat) => (
              <TabsContent key={cat} value={cat} className="mt-0">
                <div className="grid grid-cols-3 gap-4">
                  <AnimatePresence mode="popLayout">
                    {stickers
                      .filter(s => s.category === cat)
                      .map((sticker, index) => {
                        const isUnlocked = unlockedStickers.includes(sticker.id) || 
                          totalPoints >= sticker.requiredPoints;

                        return (
                          <motion.div
                            key={sticker.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Card
                              className={`p-4 flex flex-col items-center justify-center aspect-square cursor-pointer transition-all ${
                                isUnlocked
                                  ? "bg-card hover-elevate"
                                  : "bg-muted/30"
                              } ${
                                selectedSticker === sticker.id
                                  ? "ring-2 ring-primary"
                                  : ""
                              }`}
                              onClick={() => setSelectedSticker(
                                selectedSticker === sticker.id ? null : sticker.id
                              )}
                              data-testid={`sticker-${sticker.id}`}
                            >
                              <StickerIcon
                                sticker={sticker}
                                unlocked={isUnlocked}
                                size="lg"
                              />
                              <p className={`text-xs font-medium mt-2 text-center ${
                                isUnlocked ? "text-foreground" : "text-muted-foreground/50"
                              }`}>
                                {isUnlocked ? sticker.name : "???"}
                              </p>
                              {!isUnlocked && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Lock className="w-3 h-3 text-muted-foreground/50" />
                                  <span className="text-[10px] text-muted-foreground/50">
                                    {sticker.requiredPoints} 分
                                  </span>
                                </div>
                              )}
                            </Card>
                          </motion.div>
                        );
                      })}
                  </AnimatePresence>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-card">
            <div className="flex items-center gap-4">
              <Mascot 
                mood={unlockedStickers.length >= 5 ? "cheering" : "happy"} 
                size="sm" 
              />
              <div>
                <p className="font-semibold text-foreground">
                  {unlockedStickers.length} / {stickers.length} 個貼紙
                </p>
                <p className="text-sm text-muted-foreground">
                  {unlockedStickers.length === 0
                    ? "完成任務可以獲得貼紙！"
                    : unlockedStickers.length < 5
                    ? "好開始！繼續加油！"
                    : unlockedStickers.length < 10
                    ? "好叻嘅收藏！"
                    : "你係貼紙大師！"}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
