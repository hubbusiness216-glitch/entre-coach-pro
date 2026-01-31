-- Create achievements enum
CREATE TYPE public.achievement_type AS ENUM (
  'first_plan', 'first_evaluation', 'streak_3', 'streak_7', 'streak_30',
  'communication_master', 'listener_pro', 'pitch_perfect', 'goal_achiever',
  'report_generator', 'consistency_king'
);

-- Create user achievements table
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_type achievement_type NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_type)
);

-- Create user streaks table
CREATE TABLE public.user_streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  total_xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pitch practice sessions table
CREATE TABLE public.pitch_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  scenario_type TEXT NOT NULL CHECK (length(scenario_type) <= 50),
  user_response TEXT CHECK (length(user_response) <= 10000),
  ai_feedback TEXT CHECK (length(ai_feedback) <= 5000),
  score INTEGER CHECK (score >= 0 AND score <= 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create weekly goals table
CREATE TABLE public.weekly_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  goal_type TEXT NOT NULL CHECK (length(goal_type) <= 50),
  target_value INTEGER NOT NULL DEFAULT 1,
  current_value INTEGER NOT NULL DEFAULT 0,
  week_start DATE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, goal_type, week_start)
);

-- Enable RLS on all tables
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pitch_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_goals ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_achievements
CREATE POLICY "Users can view their own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for user_streaks
CREATE POLICY "Users can view their own streaks" ON public.user_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own streaks" ON public.user_streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own streaks" ON public.user_streaks FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for pitch_sessions
CREATE POLICY "Users can view their own pitch sessions" ON public.pitch_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own pitch sessions" ON public.pitch_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for weekly_goals
CREATE POLICY "Users can view their own weekly goals" ON public.weekly_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own weekly goals" ON public.weekly_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own weekly goals" ON public.weekly_goals FOR UPDATE USING (auth.uid() = user_id);

-- Trigger for updated_at on user_streaks
CREATE TRIGGER update_user_streaks_updated_at
BEFORE UPDATE ON public.user_streaks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();