import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Rocket,
  Mic,
  MicOff,
  Play,
  Target,
  Users,
  Briefcase,
  DollarSign,
  ArrowLeft,
  Star,
  CheckCircle2,
  Lightbulb,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: typeof Rocket;
  prompt: string;
  tips: string[];
  sampleResponse: string;
  duration: string;
}

const scenarios: Scenario[] = [
  {
    id: "investor_pitch",
    title: "Investor Pitch",
    description: "Pitch your business idea to potential investors",
    icon: DollarSign,
    prompt: "You have 60 seconds to pitch your business idea to a group of angel investors. They want to know: What problem do you solve? What's your solution? What's your revenue model?",
    tips: [
      "Start with a compelling hook or problem statement",
      "Clearly articulate your unique value proposition",
      "Mention your target market size and traction",
      "End with a clear ask (funding amount, next steps)",
    ],
    sampleResponse: "Good morning investors. Did you know that 70% of small business owners waste 10+ hours weekly on manual scheduling? I'm here to change that. My company, ScheduleX, is an AI-powered scheduling assistant that automates appointment booking, reducing admin time by 80%. We charge $29/month per business and already have 500 paying customers with 15% month-over-month growth. We're raising $500,000 to expand our sales team and integrate with 10 more platforms. Let's revolutionize how businesses manage their time.",
    duration: "60 seconds",
  },
  {
    id: "client_meeting",
    title: "Client Meeting",
    description: "Present your services to a potential client",
    icon: Users,
    prompt: "A potential client wants to understand how your product/service can help their business. Explain your offering and how it addresses their specific needs.",
    tips: [
      "Ask clarifying questions to understand their pain points",
      "Relate features to their specific business challenges",
      "Use concrete examples and case studies",
      "Provide clear next steps and timeline",
    ],
    sampleResponse: "Thank you for meeting with me today. Based on our initial conversation, I understand you're struggling with inventory management and losing sales due to stockouts. Our inventory management system uses predictive analytics to forecast demand and automate reordering. Similar businesses in your industry have reduced stockouts by 45% within the first quarter. I'd like to propose a 30-day pilot where we integrate with your existing POS system. Would next Tuesday work for a deeper discovery session?",
    duration: "90 seconds",
  },
  {
    id: "partnership",
    title: "Partnership Proposal",
    description: "Propose a strategic business partnership",
    icon: Briefcase,
    prompt: "You're meeting with a potential business partner. Present a mutually beneficial partnership opportunity and outline how both parties can succeed together.",
    tips: [
      "Highlight synergies between both businesses",
      "Propose specific collaboration mechanisms",
      "Address potential concerns proactively",
      "Suggest measurable success metrics",
    ],
    sampleResponse: "I've been following your company's growth in the e-commerce space, and I believe there's a powerful synergy between our businesses. Your platform serves 50,000 online retailers, and our payment processing solution offers the lowest transaction fees in the market. By integrating our API into your platform, your merchants could save an average of 1.5% per transaction, while we gain access to your established customer base. I propose a revenue-sharing model where you receive 20% of all transaction fees from referred merchants. Let's discuss how we can structure this for mutual success.",
    duration: "90 seconds",
  },
  {
    id: "elevator_pitch",
    title: "Elevator Pitch",
    description: "Quick 30-second business introduction",
    icon: Target,
    prompt: "You're in an elevator with a potential customer or investor. You have 30 seconds to explain what you do and why they should care.",
    tips: [
      "Lead with the problem you solve",
      "Keep it simple and jargon-free",
      "Include a memorable fact or statistic",
      "End with a call to action",
    ],
    sampleResponse: "Hi, I'm building the future of restaurant marketing. Did you know restaurants spend $50,000 yearly on marketing with only 2% response rates? Our AI platform analyzes customer data to send personalized offers at the perfect moment, achieving 15% response rates. We've helped 200 restaurants double their repeat customer visits. If you know any restaurant owners struggling with customer retention, I'd love to connect.",
    duration: "30 seconds",
  },
];

const PitchPractice = () => {
  const navigate = useNavigate();
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [userResponse, setUserResponse] = useState("");
  const [feedback, setFeedback] = useState<{ score: number; feedback: string } | null>(null);
  const [showSample, setShowSample] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isListening, transcript, startListening, stopListening, isSupported } = useSpeechRecognition();
  const { speak, isPlaying } = useTextToSpeech();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (transcript) {
      setUserResponse(prev => prev + " " + transcript);
    }
  }, [transcript]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const analyzePitch = (text: string): { score: number; feedback: string } => {
    // Simulated NLP analysis for academic prototype
    let score = 50;
    const feedbackPoints: string[] = [];

    // Word count analysis
    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount >= 50) {
      score += 10;
      feedbackPoints.push("✓ Good length and detail in your response");
    } else {
      feedbackPoints.push("△ Consider adding more detail to your pitch");
    }

    // Key business terms check
    const businessTerms = ["problem", "solution", "market", "revenue", "customer", "growth", "value", "opportunity"];
    const foundTerms = businessTerms.filter(term => text.toLowerCase().includes(term));
    score += foundTerms.length * 5;
    if (foundTerms.length >= 3) {
      feedbackPoints.push(`✓ Strong use of business terminology (${foundTerms.join(", ")})`);
    } else {
      feedbackPoints.push("△ Include more business-focused language");
    }

    // Number/statistics check
    const hasNumbers = /\d+/.test(text);
    if (hasNumbers) {
      score += 10;
      feedbackPoints.push("✓ Good use of specific numbers and data");
    } else {
      feedbackPoints.push("△ Add specific numbers to strengthen credibility");
    }

    // Question engagement
    if (text.includes("?")) {
      score += 5;
      feedbackPoints.push("✓ Engaging the audience with questions");
    }

    // Call to action
    const ctaTerms = ["let's", "would you", "shall we", "next step", "contact", "schedule"];
    if (ctaTerms.some(term => text.toLowerCase().includes(term))) {
      score += 10;
      feedbackPoints.push("✓ Clear call to action");
    } else {
      feedbackPoints.push("△ End with a stronger call to action");
    }

    score = Math.min(100, Math.max(0, score));

    return {
      score,
      feedback: feedbackPoints.join("\n"),
    };
  };

  const handleSubmit = async () => {
    if (!selectedScenario || !userResponse.trim()) {
      toast.error("Please provide your pitch response");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const analysis = analyzePitch(userResponse);
      setFeedback(analysis);

      // Save pitch session
      await supabase.from("pitch_sessions").insert({
        user_id: user.id,
        scenario_type: selectedScenario.id,
        user_response: userResponse.substring(0, 10000),
        ai_feedback: analysis.feedback.substring(0, 5000),
        score: analysis.score,
      });

      // Update weekly goals
      const weekStart = getWeekStart();
      const { data: goalData } = await supabase
        .from("weekly_goals")
        .select("*")
        .eq("user_id", user.id)
        .eq("goal_type", "pitch_sessions")
        .eq("week_start", weekStart)
        .single();

      if (goalData) {
        const newValue = goalData.current_value + 1;
        await supabase
          .from("weekly_goals")
          .update({
            current_value: newValue,
            completed: newValue >= goalData.target_value,
          })
          .eq("id", goalData.id);
      }

      toast.success(`Pitch analyzed! Score: ${analysis.score}/100`);
    } catch (error) {
      console.error("Error submitting pitch:", error);
      toast.error("Failed to submit pitch");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWeekStart = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    return monday.toISOString().split("T")[0];
  };

  const resetPractice = () => {
    setSelectedScenario(null);
    setUserResponse("");
    setFeedback(null);
    setShowSample(false);
  };

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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-gold-light flex items-center justify-center">
                <Rocket className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">Pitch Practice</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-16 px-6">
        <div className="container mx-auto max-w-5xl">
          {!selectedScenario ? (
            <>
              <div className="text-center mb-12">
                <h1 className="font-display text-4xl font-bold mb-4">
                  <span className="text-gradient-gold">Scenario Practice</span> Mode
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Practice real-world business scenarios and receive instant feedback on your communication skills.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {scenarios.map((scenario) => {
                  const Icon = scenario.icon;
                  return (
                    <Card
                      key={scenario.id}
                      className="card-elevated cursor-pointer hover:border-primary/50 transition-all duration-300 group"
                      onClick={() => setSelectedScenario(scenario)}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-gold-light flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Icon className="w-7 h-7 text-primary-foreground" />
                          </div>
                          <div>
                            <CardTitle className="font-display">{scenario.title}</CardTitle>
                            <CardDescription>{scenario.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="secondary">{scenario.duration}</Badge>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="space-y-8">
              {/* Scenario Header */}
              <Card className="card-elevated">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-gold-light flex items-center justify-center">
                        <selectedScenario.icon className="w-7 h-7 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="font-display text-2xl">{selectedScenario.title}</CardTitle>
                        <Badge variant="secondary">{selectedScenario.duration}</Badge>
                      </div>
                    </div>
                    <Button variant="outline" onClick={resetPractice}>
                      Change Scenario
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-xl p-6 mb-6">
                    <h4 className="font-display font-bold mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Scenario Prompt
                    </h4>
                    <p className="text-muted-foreground">{selectedScenario.prompt}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-display font-bold mb-3 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-secondary" />
                        Tips for Success
                      </h4>
                      <ul className="space-y-2">
                        {selectedScenario.tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-display font-bold flex items-center gap-2">
                          <Star className="w-5 h-5 text-primary" />
                          Sample Response
                        </h4>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowSample(!showSample)}
                          >
                            {showSample ? "Hide" : "Show"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => speak(selectedScenario.sampleResponse)}
                            disabled={isPlaying}
                          >
                            <Volume2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {showSample && (
                        <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-4">
                          {selectedScenario.sampleResponse}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Response Input */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="font-display">Your Response</CardTitle>
                  <CardDescription>
                    Type your pitch or use voice input to practice speaking
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Textarea
                      value={userResponse}
                      onChange={(e) => setUserResponse(e.target.value)}
                      placeholder="Start your pitch here..."
                      className="min-h-[200px] resize-none pr-20"
                      maxLength={10000}
                    />
                    <div className="absolute bottom-4 right-4 flex items-center gap-2">
                      {isSupported && (
                        <Button
                          variant={isListening ? "destructive" : "secondary"}
                          size="icon"
                          onClick={handleVoiceToggle}
                        >
                          {isListening ? (
                            <MicOff className="w-4 h-4" />
                          ) : (
                            <Mic className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {userResponse.length}/10000 characters
                    </span>
                    {isListening && (
                      <Badge variant="destructive" className="animate-pulse">
                        Recording...
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="hero"
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !userResponse.trim()}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        Analyze My Pitch
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Feedback */}
              {feedback && (
                <Card className="card-elevated border-primary/50">
                  <CardHeader>
                    <CardTitle className="font-display flex items-center gap-3">
                      <Star className="w-6 h-6 text-primary" />
                      Your Score: {feedback.score}/100
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Progress value={feedback.score} className="h-3" />
                    <div className="bg-muted/50 rounded-xl p-6">
                      <h4 className="font-display font-bold mb-4">Feedback & Analysis</h4>
                      <div className="space-y-2 text-sm whitespace-pre-line">
                        {feedback.feedback}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      * This is a simulated NLP analysis for academic demonstration purposes.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Academic Note */}
          <div className="mt-12 text-center">
            <p className="text-xs text-muted-foreground">
              ENTREPRENEUR-X Pitch Practice - Simulated scenario-based learning for academic demonstration.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PitchPractice;