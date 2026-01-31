import { useEffect, useState } from "react";
import { Trophy, Star, Flame, Target, Medal, Award, Zap, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AchievementNotificationProps {
  achievement: {
    type: string;
    title: string;
    description: string;
    xp: number;
  } | null;
  onClose: () => void;
}

const achievementIcons: Record<string, typeof Trophy> = {
  first_plan: Target,
  first_evaluation: Star,
  streak_3: Flame,
  streak_7: Flame,
  streak_30: Crown,
  communication_master: Award,
  listener_pro: Medal,
  pitch_perfect: Zap,
  goal_achiever: Trophy,
  report_generator: Star,
  consistency_king: Crown,
};

export const AchievementNotification = ({ achievement, onClose }: AchievementNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  const Icon = achievementIcons[achievement.type] || Trophy;

  return (
    <div
      className={cn(
        "fixed top-24 right-6 z-50 max-w-sm transition-all duration-300 transform",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      <div className="card-elevated p-6 border-primary/50 glow-gold">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-gold-light flex items-center justify-center animate-pulse-slow">
            <Icon className="w-7 h-7 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Achievement Unlocked!
              </span>
            </div>
            <h4 className="font-display text-lg font-bold mb-1">{achievement.title}</h4>
            <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-primary">+{achievement.xp} XP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const achievementData: Record<string, { title: string; description: string; xp: number }> = {
  first_plan: {
    title: "Business Starter",
    description: "Created your first business plan",
    xp: 100,
  },
  first_evaluation: {
    title: "Communication Beginner",
    description: "Completed your first communication evaluation",
    xp: 100,
  },
  streak_3: {
    title: "On Fire!",
    description: "3-day activity streak",
    xp: 150,
  },
  streak_7: {
    title: "Week Warrior",
    description: "7-day activity streak",
    xp: 300,
  },
  streak_30: {
    title: "Monthly Champion",
    description: "30-day activity streak",
    xp: 1000,
  },
  communication_master: {
    title: "Communication Master",
    description: "Scored 90+ in all communication areas",
    xp: 500,
  },
  listener_pro: {
    title: "Listener Pro",
    description: "Completed 10 listening exercises",
    xp: 200,
  },
  pitch_perfect: {
    title: "Pitch Perfect",
    description: "Scored 85+ in pitch practice",
    xp: 400,
  },
  goal_achiever: {
    title: "Goal Achiever",
    description: "Completed all weekly goals",
    xp: 250,
  },
  report_generator: {
    title: "Report Generator",
    description: "Generated 5 reports",
    xp: 150,
  },
  consistency_king: {
    title: "Consistency King",
    description: "Maintained 90%+ completion rate",
    xp: 350,
  },
};