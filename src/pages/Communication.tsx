import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  MessageSquare,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Mic,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Volume2,
  FileText,
} from "lucide-react";

interface EvaluationResult {
  fluencyScore: number;
  grammarScore: number;
  pronunciationScore: number;
  listeningScore: number;
  overallScore: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

// Simulated NLP evaluation logic
const evaluateText = (text: string): EvaluationResult => {
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const wordCount = words.length;
  
  // Simulated scoring based on text analysis
  const avgWordsPerSentence = sentences.length > 0 ? wordCount / sentences.length : 0;
  
  // Fluency based on word count and sentence structure
  let fluencyScore = Math.min(100, Math.max(40, 60 + (wordCount / 5) + (avgWordsPerSentence > 8 ? 15 : 0)));
  
  // Grammar based on punctuation and capitalization
  const hasPunctuation = /[.!?,;:]/.test(text);
  const hasCapitalization = /[A-Z]/.test(text);
  let grammarScore = 50 + (hasPunctuation ? 20 : 0) + (hasCapitalization ? 15 : 0) + Math.random() * 15;
  
  // Pronunciation (simulated - would need speech input in real app)
  let pronunciationScore = 60 + Math.random() * 30;
  
  // Listening (simulated)
  let listeningScore = 55 + Math.random() * 35;
  
  // Add variance
  fluencyScore = Math.round(Math.min(100, fluencyScore + (Math.random() * 10 - 5)));
  grammarScore = Math.round(Math.min(100, grammarScore));
  pronunciationScore = Math.round(pronunciationScore);
  listeningScore = Math.round(listeningScore);
  
  const overallScore = Math.round((fluencyScore + grammarScore + pronunciationScore + listeningScore) / 4);
  
  // Generate feedback
  const strengths: string[] = [];
  const improvements: string[] = [];
  
  if (fluencyScore >= 70) strengths.push("Good sentence flow and coherence");
  else improvements.push("Practice constructing longer, flowing sentences");
  
  if (grammarScore >= 70) strengths.push("Proper use of punctuation and grammar");
  else improvements.push("Focus on punctuation and sentence capitalization");
  
  if (wordCount >= 50) strengths.push("Detailed and comprehensive expression");
  else improvements.push("Try to elaborate more on your ideas");
  
  if (avgWordsPerSentence >= 8) strengths.push("Well-structured sentences");
  else improvements.push("Develop more complex sentence structures");
  
  const feedbackOptions = [
    `Your communication shows ${overallScore >= 70 ? "good" : "developing"} skills with an overall score of ${overallScore}%. ${strengths.length > 0 ? "Key strengths include " + strengths[0].toLowerCase() + "." : ""} ${improvements.length > 0 ? "Consider working on " + improvements[0].toLowerCase() + "." : ""}`,
    `Analysis complete. Your text demonstrates ${overallScore >= 75 ? "strong" : overallScore >= 60 ? "moderate" : "developing"} communication abilities. ${improvements.length > 0 ? "Focus area: " + improvements[0] : "Keep up the good work!"}`,
  ];
  
  return {
    fluencyScore,
    grammarScore,
    pronunciationScore,
    listeningScore,
    overallScore,
    feedback: feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)],
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
  };
};

const Communication = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<EvaluationResult | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (inputText.trim().length < 20) {
      toast.error("Please enter at least 20 characters for accurate evaluation");
      return;
    }

    setLoading(true);

    // Simulate NLP processing delay
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Generate evaluation
    const evaluation = evaluateText(inputText);
    setResult(evaluation);

    // Save to database
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("communication_evaluation").insert({
        user_id: user.id,
        fluency_score: evaluation.fluencyScore,
        grammar_score: evaluation.grammarScore,
        pronunciation_score: evaluation.pronunciationScore,
        listening_score: evaluation.listeningScore,
        feedback: evaluation.feedback,
        input_text: inputText.trim(),
      });
    }

    setLoading(false);
    setStep(2);
    toast.success("Evaluation complete!");
  };

  const resetForm = () => {
    setStep(1);
    setResult(null);
    setInputText("");
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-primary";
    return "text-orange-400";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-primary";
    return "bg-orange-500";
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-teal-light flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-secondary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">Communication Skills</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          {step === 1 ? (
            <>
              {/* Input Form */}
              <div className="text-center mb-10">
                <h1 className="font-display text-4xl font-bold mb-4">
                  Evaluate Your <span className="text-gradient-teal">Communication Skills</span>
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Submit a text sample simulating your speech. Our NLP system will analyze 
                  fluency, grammar, and provide personalized feedback.
                </p>
              </div>

              <div className="card-elevated p-8">
                {/* Info Cards */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Mic className="w-5 h-5 text-secondary" />
                      <span className="font-medium text-sm">Fluency</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Flow and coherence of speech</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-5 h-5 text-secondary" />
                      <span className="font-medium text-sm">Grammar</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Sentence structure accuracy</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Volume2 className="w-5 h-5 text-secondary" />
                      <span className="font-medium text-sm">Pronunciation</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Word articulation (simulated)</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="inputText">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-secondary" />
                        Your Text Sample
                      </div>
                    </Label>
                    <Textarea
                      id="inputText"
                      placeholder="Enter your text here. This simulates speech-to-text input. Write as if you were speaking - describe your business idea, introduce yourself, or practice a pitch. Minimum 20 characters required for accurate analysis..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="min-h-[200px] bg-muted/50"
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {inputText.length} characters
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/30">
                    <p className="text-sm text-muted-foreground">
                      <strong>Tip:</strong> For best results, write at least 50-100 words. 
                      Include proper punctuation and express complete thoughts as you would 
                      in a business conversation or pitch.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    variant="teal"
                    size="lg"
                    className="w-full"
                    disabled={loading || inputText.trim().length < 20}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing with NLP...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Evaluate Communication
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>

                <p className="text-xs text-center text-muted-foreground mt-6">
                  NLP results are simulated for academic demonstration
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Results */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 mb-4">
                  <Sparkles className="w-4 h-4 text-secondary" />
                  <span className="text-sm font-medium">Evaluation Complete</span>
                </div>
                <h1 className="font-display text-4xl font-bold mb-4">
                  Your <span className="text-gradient-teal">Communication Report</span>
                </h1>
              </div>

              {result && (
                <div className="space-y-6">
                  {/* Overall Score */}
                  <div className="card-elevated p-8 text-center">
                    <h2 className="font-display text-xl font-semibold mb-4">Overall Score</h2>
                    <div className={`text-6xl font-display font-bold ${getScoreColor(result.overallScore)}`}>
                      {result.overallScore}%
                    </div>
                    <p className="text-muted-foreground mt-2">
                      {result.overallScore >= 80 ? "Excellent" : result.overallScore >= 60 ? "Good" : "Developing"}
                    </p>
                  </div>

                  {/* Score Breakdown */}
                  <div className="card-elevated p-8">
                    <h2 className="font-display text-xl font-semibold mb-6">Score Breakdown</h2>
                    <div className="space-y-6">
                      {[
                        { label: "Fluency", score: result.fluencyScore, icon: Mic },
                        { label: "Grammar", score: result.grammarScore, icon: BookOpen },
                        { label: "Pronunciation", score: result.pronunciationScore, icon: Volume2 },
                        { label: "Listening", score: result.listeningScore, icon: MessageSquare },
                      ].map((item) => (
                        <div key={item.label} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <item.icon className="w-4 h-4 text-secondary" />
                              <span className="font-medium">{item.label}</span>
                              <span className="text-xs text-muted-foreground">(simulated)</span>
                            </div>
                            <span className={`font-bold ${getScoreColor(item.score)}`}>
                              {item.score}%
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getProgressColor(item.score)} transition-all duration-500`}
                              style={{ width: `${item.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Feedback */}
                  <div className="card-elevated p-8">
                    <h2 className="font-display text-xl font-semibold mb-4">AI Feedback</h2>
                    <p className="text-muted-foreground">{result.feedback}</p>
                  </div>

                  {/* Strengths & Improvements */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="card-elevated p-6">
                      <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        Strengths
                      </h3>
                      {result.strengths.length > 0 ? (
                        <ul className="space-y-2">
                          {result.strengths.map((s, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">Keep practicing to identify strengths!</p>
                      )}
                    </div>

                    <div className="card-elevated p-6">
                      <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-orange-400" />
                        Areas to Improve
                      </h3>
                      {result.improvements.length > 0 ? (
                        <ul className="space-y-2">
                          {result.improvements.map((s, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">Excellent! No major improvements needed.</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="teal" className="flex-1" asChild>
                      <Link to="/reports">View All Reports</Link>
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={resetForm}>
                      Take Another Assessment
                    </Button>
                  </div>

                  <p className="text-xs text-center text-muted-foreground">
                    NLP results are simulated for academic demonstration purposes
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Communication;
