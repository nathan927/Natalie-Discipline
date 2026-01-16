import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, Heart, Sparkles } from "lucide-react";
import { Mascot } from "@/components/mascot";

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-pink-50 dark:from-pink-950 dark:to-background flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-sm mx-auto"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <Mascot size="lg" mood="happy" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-foreground mb-2"
        >
          Natalie
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-primary font-medium mb-2"
        >
          自律小幫手
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground mb-8"
        >
          培養好習慣，收集可愛貼紙！
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4 justify-center mb-8"
        >
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>任務計劃</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Heart className="w-4 h-4 text-pink-500" />
            <span>貼紙獎勵</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>專注計時</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Button
            size="lg"
            className="w-full text-lg py-6"
            onClick={() => window.location.href = "/api/login"}
            data-testid="button-login"
          >
            登入開始
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs text-muted-foreground mt-6"
        >
          使用 Google 帳戶登入
        </motion.p>
      </motion.div>
    </div>
  );
}
