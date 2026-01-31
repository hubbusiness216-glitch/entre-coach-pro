import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Star, Flame, Target, Medal, Award, Zap, Crown, Lock } from "lucide-react";
import { achievementData } from "./AchievementNotification";
import { cn } from "@/lib/utils";

interface Achievement {
  achievement_type: string;
  earned_at: string;
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

const allAchievements = Object.keys(achievementData);

export const AchievementGallery = () => {
  const [earnedAchievements, setEarnedAchievements] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_achievements")
        .select("achievement_type")
        .eq("user_id", user.id);

      if (error) throw error;

      if (data) {
        setEarnedAchievements(new Set(data.map(a => a.achievement_type)));
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card-elevated p-6 animate-pulse">
        <div className="h-48 bg-muted rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-bold">Achievements</h3>
          <p className="text-xs text-muted-foreground">
            {earnedAchievements.size}/{allAchievements.length} unlocked
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {allAchievements.map((type) => {
          const isEarned = earnedAchievements.has(type);
          const Icon = achievementIcons[type] || Trophy;
          const data = achievementData[type];

          return (
            <div
              key={type}
              className={cn(
                "relative group p-3 rounded-xl text-center transition-all duration-300",
                isEarned
                  ? "bg-primary/10 border border-primary/30 hover:bg-primary/20"
                  : "bg-muted/30 border border-transparent opacity-50"
              )}
              title={isEarned ? `${data.title}: ${data.description}` : "Locked"}
            >
              <div
                className={cn(
                  "w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-2",
                  isEarned ? "bg-gradient-to-br from-primary to-gold-light" : "bg-muted"
                )}
              >
                {isEarned ? (
                  <Icon className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <p className="text-xs font-medium truncate">{data.title}</p>
              {isEarned && (
                <p className="text-[10px] text-primary">+{data.xp} XP</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};