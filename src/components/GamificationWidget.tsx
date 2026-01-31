import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Flame, Star, Zap, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalXp: number;
  level: number;
  achievementCount: number;
}

const levelThresholds = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500];

export const GamificationWidget = () => {
  const [stats, setStats] = useState<UserStats>({
    currentStreak: 0,
    longestStreak: 0,
    totalXp: 0,
    level: 1,
    achievementCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch streak data
      const { data: streakData } = await supabase
        .from("user_streaks")
        .select("*")
        .eq("user_id", user.id)
        .single();

      // Fetch achievement count
      const { count: achievementCount } = await supabase
        .from("user_achievements")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (streakData) {
        setStats({
          currentStreak: streakData.current_streak,
          longestStreak: streakData.longest_streak,
          totalXp: streakData.total_xp,
          level: streakData.level,
          achievementCount: achievementCount || 0,
        });
      } else {
        setStats(prev => ({ ...prev, achievementCount: achievementCount || 0 }));
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentLevelXp = levelThresholds[stats.level - 1] || 0;
  const nextLevelXp = levelThresholds[stats.level] || levelThresholds[levelThresholds.length - 1];
  const progressToNextLevel = ((stats.totalXp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;

  if (loading) {
    return (
      <div className="card-elevated p-6 animate-pulse">
        <div className="h-20 bg-muted rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-bold">Your Progress</h3>
          <p className="text-xs text-muted-foreground">Keep up the momentum!</p>
        </div>
      </div>

      {/* Level Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Level {stats.level}</span>
          <span className="text-xs text-muted-foreground">{stats.totalXp} XP</span>
        </div>
        <Progress value={Math.min(progressToNextLevel, 100)} className="h-2" />
        <p className="text-xs text-muted-foreground mt-1">
          {nextLevelXp - stats.totalXp} XP to Level {stats.level + 1}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/50 rounded-xl p-4 text-center">
          <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
          <p className="font-display text-2xl font-bold">{stats.currentStreak}</p>
          <p className="text-xs text-muted-foreground">Day Streak</p>
        </div>
        <div className="bg-muted/50 rounded-xl p-4 text-center">
          <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="font-display text-2xl font-bold">{stats.achievementCount}</p>
          <p className="text-xs text-muted-foreground">Achievements</p>
        </div>
        <div className="bg-muted/50 rounded-xl p-4 text-center">
          <Star className="w-6 h-6 text-secondary mx-auto mb-2" />
          <p className="font-display text-2xl font-bold">{stats.longestStreak}</p>
          <p className="text-xs text-muted-foreground">Best Streak</p>
        </div>
        <div className="bg-muted/50 rounded-xl p-4 text-center">
          <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <p className="font-display text-2xl font-bold">Lv.{stats.level}</p>
          <p className="text-xs text-muted-foreground">Current Level</p>
        </div>
      </div>
    </div>
  );
};