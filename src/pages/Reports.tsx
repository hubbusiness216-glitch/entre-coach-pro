import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  ArrowLeft,
  Brain,
  MessageSquare,
  TrendingUp,
  Calendar,
  Target,
  Sparkles,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

interface BusinessInput {
  id: string;
  business_interest: string;
  budget: string;
  location: string;
  goals: string;
  created_at: string;
}

interface CommunicationEval {
  id: string;
  fluency_score: number;
  grammar_score: number;
  pronunciation_score: number;
  listening_score: number;
  feedback: string | null;
  created_at: string;
}

const Reports = () => {
  const navigate = useNavigate();
  const [businessInputs, setBusinessInputs] = useState<BusinessInput[]>([]);
  const [communicationEvals, setCommunicationEvals] = useState<CommunicationEval[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }

      // Fetch business inputs
      const { data: businessData } = await supabase
        .from("business_inputs")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      // Fetch communication evaluations
      const { data: commData } = await supabase
        .from("communication_evaluation")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      setBusinessInputs(businessData || []);
      setCommunicationEvals(commData || []);
      setLoading(false);
    };

    fetchData();
  }, [navigate]);

  // Calculate averages
  const avgCommunication = communicationEvals.length > 0
    ? Math.round(
        communicationEvals.reduce(
          (acc, e) => acc + (e.fluency_score + e.grammar_score + e.pronunciation_score + e.listening_score) / 4,
          0
        ) / communicationEvals.length
      )
    : 0;

  // Prepare chart data
  const radarData = communicationEvals.length > 0
    ? [
        {
          subject: "Fluency",
          score: Math.round(communicationEvals.reduce((a, e) => a + e.fluency_score, 0) / communicationEvals.length),
        },
        {
          subject: "Grammar",
          score: Math.round(communicationEvals.reduce((a, e) => a + e.grammar_score, 0) / communicationEvals.length),
        },
        {
          subject: "Pronunciation",
          score: Math.round(communicationEvals.reduce((a, e) => a + e.pronunciation_score, 0) / communicationEvals.length),
        },
        {
          subject: "Listening",
          score: Math.round(communicationEvals.reduce((a, e) => a + e.listening_score, 0) / communicationEvals.length),
        },
      ]
    : [];

  const progressData = communicationEvals
    .slice(0, 10)
    .reverse()
    .map((e, index) => ({
      name: `Test ${index + 1}`,
      score: Math.round((e.fluency_score + e.grammar_score + e.pronunciation_score + e.listening_score) / 4),
    }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-purple-400 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="font-display text-xl font-bold">Reports & Analytics</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl font-bold mb-4">
              Your <span className="text-gradient-gold">Progress Dashboard</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Track your business planning activities and communication skill improvements over time.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="card-elevated p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Business Plans</span>
              </div>
              <p className="text-3xl font-display font-bold">{businessInputs.length}</p>
            </div>

            <div className="card-elevated p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-secondary" />
                </div>
                <span className="text-sm text-muted-foreground">Skill Tests</span>
              </div>
              <p className="text-3xl font-display font-bold">{communicationEvals.length}</p>
            </div>

            <div className="card-elevated p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <span className="text-sm text-muted-foreground">Avg. Score</span>
              </div>
              <p className="text-3xl font-display font-bold">{avgCommunication}%</p>
            </div>

            <div className="card-elevated p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-500" />
                </div>
                <span className="text-sm text-muted-foreground">Readiness</span>
              </div>
              <p className="text-3xl font-display font-bold">
                {businessInputs.length > 0 && avgCommunication >= 60 ? "Ready" : "Building"}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {/* Progress Chart */}
            <div className="card-elevated p-6">
              <h3 className="font-display text-lg font-semibold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Communication Progress
              </h3>
              {progressData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={progressData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                    <XAxis dataKey="name" stroke="hsl(215, 20%, 65%)" fontSize={12} />
                    <YAxis stroke="hsl(215, 20%, 65%)" fontSize={12} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(222, 47%, 9%)",
                        border: "1px solid hsl(222, 30%, 18%)",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(38, 92%, 50%)"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorScore)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  No data yet. Complete communication assessments to see progress.
                </div>
              )}
            </div>

            {/* Radar Chart */}
            <div className="card-elevated p-6">
              <h3 className="font-display text-lg font-semibold mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary" />
                Skill Distribution
              </h3>
              {radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(222, 30%, 18%)" />
                    <PolarAngleAxis dataKey="subject" stroke="hsl(215, 20%, 65%)" fontSize={12} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="hsl(215, 20%, 65%)" fontSize={10} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="hsl(173, 80%, 40%)"
                      fill="hsl(173, 80%, 40%)"
                      fillOpacity={0.3}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(222, 47%, 9%)",
                        border: "1px solid hsl(222, 30%, 18%)",
                        borderRadius: "8px",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  No data yet. Complete communication assessments to see skill distribution.
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Recent Business Plans */}
            <div className="card-elevated p-6">
              <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Recent Business Plans
              </h3>
              {businessInputs.length > 0 ? (
                <div className="space-y-4">
                  {businessInputs.slice(0, 5).map((item) => (
                    <div key={item.id} className="p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize">{item.business_interest}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Budget: {item.budget} • Location: {item.location}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No business plans yet.{" "}
                  <Link to="/business-planning" className="text-primary hover:underline">
                    Create one
                  </Link>
                </p>
              )}
            </div>

            {/* Recent Evaluations */}
            <div className="card-elevated p-6">
              <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-secondary" />
                Recent Evaluations
              </h3>
              {communicationEvals.length > 0 ? (
                <div className="space-y-4">
                  {communicationEvals.slice(0, 5).map((item) => (
                    <div key={item.id} className="p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">
                          Score:{" "}
                          {Math.round(
                            (item.fluency_score +
                              item.grammar_score +
                              item.pronunciation_score +
                              item.listening_score) /
                              4
                          )}
                          %
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                        <span>F: {item.fluency_score}%</span>
                        <span>G: {item.grammar_score}%</span>
                        <span>P: {item.pronunciation_score}%</span>
                        <span>L: {item.listening_score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No evaluations yet.{" "}
                  <Link to="/communication" className="text-secondary hover:underline">
                    Take an assessment
                  </Link>
                </p>
              )}
            </div>
          </div>

          {/* Academic Note */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              ENTREPRENEUR-X Reports • Data visualization for academic prototype demonstration
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;
