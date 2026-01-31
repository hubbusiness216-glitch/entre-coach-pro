import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Target, CheckCircle2, Circle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface Goal {
  id: string;
  goal_type: string;
  target_value: number;
  current_value: number;
  completed: boolean;
}

const goalLabels: Record<string, string> = {
  business_plans: "Create Business Plans",
  evaluations: "Complete Evaluations",
  pitch_sessions: "Practice Pitches",
  listening_exercises: "Listening Exercises",
  reports_generated: "Generate Reports",
};

export const WeeklyGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const weekStart = getWeekStart();
      
      const { data, error } = await supabase
        .from("weekly_goals")
        .select("*")
        .eq("user_id", user.id)
        .eq("week_start", weekStart);

      if (error) throw error;

      if (data && data.length > 0) {
        setGoals(data);
      } else {
        // Create default goals for new week
        await createDefaultGoals(user.id, weekStart);
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
    } finally {
      setLoading(false);
    }
  };

  const getWeekStart = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    return monday.toISOString().split("T")[0];
  };

  const createDefaultGoals = async (userId: string, weekStart: string) => {
    const defaultGoals = [
      { goal_type: "business_plans", target_value: 2 },
      { goal_type: "evaluations", target_value: 3 },
      { goal_type: "pitch_sessions", target_value: 2 },
      { goal_type: "listening_exercises", target_value: 5 },
    ];

    const goalsToInsert = defaultGoals.map(g => ({
      user_id: userId,
      goal_type: g.goal_type,
      target_value: g.target_value,
      current_value: 0,
      week_start: weekStart,
      completed: false,
    }));

    const { data, error } = await supabase
      .from("weekly_goals")
      .insert(goalsToInsert)
      .select();

    if (!error && data) {
      setGoals(data);
    }
  };

  const completedCount = goals.filter(g => g.completed).length;
  const totalProgress = goals.length > 0 
    ? (goals.reduce((acc, g) => acc + Math.min(g.current_value / g.target_value, 1), 0) / goals.length) * 100
    : 0;

  if (loading) {
    return (
      <div className="card-elevated p-6 animate-pulse">
        <div className="h-32 bg-muted rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h3 className="font-display font-bold">Weekly Goals</h3>
            <p className="text-xs text-muted-foreground">
              {completedCount}/{goals.length} completed
            </p>
          </div>
        </div>
        <span className="text-sm font-bold text-secondary">{Math.round(totalProgress)}%</span>
      </div>

      <Progress value={totalProgress} className="h-2 mb-6" />

      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = (goal.current_value / goal.target_value) * 100;
          return (
            <div key={goal.id} className="flex items-center gap-3">
              {goal.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium truncate">
                    {goalLabels[goal.goal_type] || goal.goal_type}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {goal.current_value}/{goal.target_value}
                  </span>
                </div>
                <Progress value={Math.min(progress, 100)} className="h-1" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};