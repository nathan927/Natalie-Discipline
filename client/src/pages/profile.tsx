import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  User, 
  Trophy, 
  Flame, 
  Star, 
  Clock, 
  CheckCircle2,
  Moon,
  Sun,
  ChevronRight,
  Bell,
  Palette,
  LogOut
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mascot } from "@/components/mascot";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/hooks/use-auth";
import type { UserProgress } from "@shared/schema";

const statCards = [
  { 
    key: "totalPoints",
    label: "總積分", 
    icon: Trophy, 
    color: "text-yellow-500",
    bg: "bg-yellow-100 dark:bg-yellow-900/30"
  },
  { 
    key: "currentStreak",
    label: "連續日數", 
    icon: Flame, 
    color: "text-orange-500",
    bg: "bg-orange-100 dark:bg-orange-900/30"
  },
  { 
    key: "completedTasks",
    label: "已完成任務", 
    icon: CheckCircle2, 
    color: "text-green-500",
    bg: "bg-green-100 dark:bg-green-900/30"
  },
  { 
    key: "timerSessionsCompleted",
    label: "專注時段", 
    icon: Clock, 
    color: "text-blue-500",
    bg: "bg-blue-100 dark:bg-blue-900/30"
  },
];

export default function Profile() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const { data: progress } = useQuery<UserProgress>({
    queryKey: ["/api/progress"],
  });

  const displayName = user?.firstName || user?.email?.split("@")[0] || "小朋友";
  const initials = displayName.charAt(0).toUpperCase();

  const getProgressValue = (key: string): number => {
    if (!progress) return 0;
    return (progress as any)[key] || 0;
  };

  const getLevel = () => {
    const points = progress?.totalPoints || 0;
    if (points >= 500) return { level: 5, title: "超級巨星", emoji: "crown" };
    if (points >= 200) return { level: 4, title: "冠軍", emoji: "trophy" };
    if (points >= 100) return { level: 3, title: "新星", emoji: "star" };
    if (points >= 50) return { level: 2, title: "小幫手", emoji: "heart" };
    return { level: 1, title: "新手", emoji: "sparkle" };
  };

  const levelInfo = getLevel();

  return (
    <div className="min-h-screen bg-background pb-28 pt-6">
      <div className="px-6 max-w-lg mx-auto">
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <User className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">個人檔案</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 mb-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 border-4 border-primary/20">
                {user?.profileImageUrl && (
                  <AvatarImage src={user.profileImageUrl} alt={displayName} />
                )}
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground" data-testid="text-username">
                  {displayName}
                </h2>
                {user?.email && (
                  <p className="text-sm text-muted-foreground" data-testid="text-email">
                    {user.email}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                    Level {levelInfo.level}
                  </div>
                  <span className="text-muted-foreground text-sm" data-testid="text-level-title">
                    {levelInfo.title}
                  </span>
                </div>
              </div>
              <Mascot mood="happy" size="md" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-semibold text-foreground mb-4">你嘅進度</h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              const value = getProgressValue(stat.key);

              return (
                <motion.div
                  key={stat.key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Card className="p-4 hover-elevate">
                    <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <p className="text-2xl font-bold text-foreground" data-testid={`stat-${stat.key}`}>
                      {value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-semibold text-foreground mb-4">設定</h3>
          <Card className="divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  {theme === "dark" ? (
                    <Moon className="w-5 h-5 text-purple-500" />
                  ) : (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">深色模式</p>
                  <p className="text-sm text-muted-foreground">
                    {theme === "dark" ? "開啟" : "關閉"}
                  </p>
                </div>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
                data-testid="switch-dark-mode"
              />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-pink-500" />
                </div>
                <div>
                  <p className="font-medium text-foreground">通知</p>
                  <p className="text-sm text-muted-foreground">任務提醒</p>
                </div>
              </div>
              <Switch defaultChecked data-testid="switch-notifications" />
            </div>

            <button className="flex items-center justify-between p-4 w-full text-left hover-elevate">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-foreground">主題顏色</p>
                  <p className="text-sm text-muted-foreground">粉紅色</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </Card>
        </motion.div>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 text-center bg-card">
            <Star className="w-12 h-12 text-primary mx-auto mb-3" />
            <h3 className="font-bold text-lg text-foreground mb-1">
              繼續加油！
            </h3>
            <p className="text-sm text-muted-foreground">
              完成更多任務解鎖新貼紙同升級！
            </p>
          </Card>
        </motion.div>

        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="outline"
            className="w-full"
            onClick={() => logout()}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            登出
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
