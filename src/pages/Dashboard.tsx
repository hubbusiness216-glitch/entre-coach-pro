import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Rocket, 
  Brain, 
  MessageSquare, 
  BarChart3, 
  LogOut, 
  User,
  ArrowRight,
  TrendingUp,
  Target,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          navigate("/login");
        } else {
          setUser(session.user);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Entrepreneur";

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-gold-light flex items-center justify-center">
              <Rocket className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">ENTREPRENEUR-X</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{userName}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-28 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="font-display text-4xl font-bold mb-3">
              Welcome back, <span className="text-gradient-gold">{userName}</span>!
            </h1>
            <p className="text-muted-foreground text-lg">
              Continue building your entrepreneurial skills and plan your business launch.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="card-elevated p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-2xl font-display font-bold">Business Plans</h3>
              <p className="text-sm text-muted-foreground">Track your planning progress</p>
            </div>
            
            <div className="card-elevated p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-secondary" />
                </div>
                <Sparkles className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="text-2xl font-display font-bold">Communication</h3>
              <p className="text-sm text-muted-foreground">Skill assessments completed</p>
            </div>
            
            <div className="card-elevated p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-accent" />
                </div>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-bold">Progress</h3>
              <p className="text-sm text-muted-foreground">View detailed reports</p>
            </div>
          </div>

          {/* Modules Grid */}
          <h2 className="font-display text-2xl font-bold mb-6">Your Modules</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Business Planning Module */}
            <div className="card-elevated p-8 group hover:border-primary/50 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-gold-light flex items-center justify-center glow-gold group-hover:scale-110 transition-transform">
                  <Brain className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold">Business Planning</h3>
                  <span className="text-sm text-muted-foreground">AI-Powered Recommendations</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">
                Get personalized business ideas, startup cost estimates, and step-by-step 
                roadmaps tailored to your interests and resources.
              </p>
              <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                <li>• Business idea suggestions</li>
                <li>• Budget analysis</li>
                <li>• Resource recommendations</li>
              </ul>
              <Button variant="hero" className="w-full" asChild>
                <Link to="/business-planning">
                  Start Planning
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>

            {/* Communication Evaluation Module */}
            <div className="card-elevated p-8 group hover:border-secondary/50 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-teal-light flex items-center justify-center glow-teal group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-8 h-8 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold">Communication Skills</h3>
                  <span className="text-sm text-muted-foreground">NLP-Based Evaluation</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">
                Assess and improve your communication skills crucial for business success 
                with our simulated NLP evaluation system.
              </p>
              <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                <li>• Fluency assessment</li>
                <li>• Grammar analysis</li>
                <li>• Personalized feedback</li>
              </ul>
              <Button variant="teal" className="w-full" asChild>
                <Link to="/communication">
                  Evaluate Skills
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Reports Section */}
          <div className="mt-12">
            <div className="card-elevated p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center">
                    <BarChart3 className="w-7 h-7 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold">Reports & Analytics</h3>
                    <p className="text-sm text-muted-foreground">Track your progress over time</p>
                  </div>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/reports">
                    View All Reports
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
              <p className="text-muted-foreground">
                Access comprehensive reports showing your business readiness summary, 
                communication skill scores, and improvement feedback with visual analytics.
              </p>
            </div>
          </div>

          {/* Academic Note */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              ENTREPRENEUR-X is a prototype system. AI outputs are simulated for academic demonstration purposes.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
