import { useLocation, Link } from "wouter";
import { Home, Calendar, Timer, Star, User } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { path: "/", label: "主頁", icon: Home },
  { path: "/schedule", label: "日程", icon: Calendar },
  { path: "/timer", label: "計時", icon: Timer },
  { path: "/stickers", label: "貼紙", icon: Star },
  { path: "/profile", label: "檔案", icon: User },
];

export function BottomNavigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50 safe-area-pb">
      <div className="flex items-center justify-around h-20 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;

          return (
            <Link key={item.path} href={item.path}>
              <motion.div
                className={`flex flex-col items-center justify-center py-2 px-4 rounded-2xl cursor-pointer transition-colors min-w-[64px] ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                whileTap={{ scale: 0.95 }}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -2 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <Icon
                    className={`w-6 h-6 ${isActive ? "stroke-[2.5px]" : "stroke-2"}`}
                  />
                </motion.div>
                <span
                  className={`text-xs mt-1 font-medium ${
                    isActive ? "text-primary" : ""
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-0 w-8 h-1 bg-primary rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
