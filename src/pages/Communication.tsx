import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import {
  MessageSquare,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Mic,
  MicOff,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Volume2,
  VolumeX,
  FileText,
  Headphones,
  Play,
  Square,
  Lightbulb,
  Target,
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
  sampleResponse: string;
  listeningTips: string[];
  speakingTips: string[];
}

// Sample professional responses for different scenarios
const sampleResponses = [
  "Good morning. Thank you for the opportunity to present our business proposal. Our innovative solution addresses a significant market gap in the technology sector. With a clear go-to-market strategy and proven team expertise, we are confident in achieving sustainable growth and delivering value to our stakeholders.",
  "I am pleased to introduce our startup concept. We have identified a compelling opportunity in the emerging market. Our unique value proposition combines cutting-edge technology with exceptional customer service. Our financial projections indicate strong returns within the first three years of operation.",
  "Thank you for your time today. Our business model focuses on solving real customer pain points through innovative solutions. We have conducted extensive market research and developed a robust implementation plan. Our competitive advantages include proprietary technology and strategic partnerships.",
];

// Listening practice exercises
const listeningExercises = [
  {
    title: "Business Pitch Introduction",
    text: "Welcome investors. Today I will present our revolutionary platform that connects entrepreneurs with mentors. Our market research shows a 40% gap in mentorship accessibility. With your investment, we can scale to reach 100,000 users within two years.",
    duration: "30 seconds",
  },
  {
    title: "Professional Meeting Opening",
    text: "Good afternoon, everyone. I appreciate you joining this strategic planning session. Our agenda includes reviewing quarterly targets, discussing market expansion opportunities, and finalizing the budget allocation for the upcoming fiscal year.",
    duration: "25 seconds",
  },
  {
    title: "Client Presentation",
    text: "Thank you for considering our proposal. Our solution offers three key advantages: cost reduction of up to 30 percent, improved operational efficiency, and enhanced customer satisfaction scores. We have successfully implemented similar solutions for industry leaders.",
    duration: "35 seconds",
  },
];

// Simulated NLP evaluation logic
const evaluateText = (text: string): EvaluationResult => {
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const wordCount = words.length;
  
  const avgWordsPerSentence = sentences.length > 0 ? wordCount / sentences.length : 0;
  
  let fluencyScore = Math.min(100, Math.max(40, 60 + (wordCount / 5) + (avgWordsPerSentence > 8 ? 15 : 0)));
  
  const hasPunctuation = /[.!?,;:]/.test(text);
  const hasCapitalization = /[A-Z]/.test(text);
  let grammarScore = 50 + (hasPunctuation ? 20 : 0) + (hasCapitalization ? 15 : 0) + Math.random() * 15;
  
  let pronunciationScore = 60 + Math.random() * 30;
  let listeningScore = 55 + Math.random() * 35;
  
  fluencyScore = Math.round(Math.min(100, fluencyScore + (Math.random() * 10 - 5)));
  grammarScore = Math.round(Math.min(100, grammarScore));
  pronunciationScore = Math.round(pronunciationScore);
  listeningScore = Math.round(listeningScore);
  
  const overallScore = Math.round((fluencyScore + grammarScore + pronunciationScore + listeningScore) / 4);
  
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

  // Speaking improvement tips
  const speakingTips = [
    "Practice speaking slowly and clearly, focusing on enunciation",
    "Use pauses effectively to emphasize key points",
    "Vary your tone to maintain listener engagement",
    "Record yourself and listen back to identify areas for improvement",
    "Practice with a mirror to improve body language awareness",
  ];

  // Listening improvement tips
  const listeningTips = [
    "Focus on the speaker without planning your response",
    "Take brief notes to reinforce key points",
    "Practice active listening by summarizing what you hear",
    "Reduce distractions and maintain eye contact",
    "Ask clarifying questions to ensure understanding",
  ];
  
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
    sampleResponse: sampleResponses[Math.floor(Math.random() * sampleResponses.length)],
    listeningTips: listeningTips.slice(0, 3),
    speakingTips: speakingTips.slice(0, 3),
  };
};

const Communication = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [activeTab, setActiveTab] = useState<'speak' | 'listen'>('speak');
  const [selectedExercise, setSelectedExercise] = useState(0);

  const { isListening, transcript, isSupported: speechSupported, startListening, stopListening, resetTranscript } = useSpeechRecognition();
  const { isPlaying, isSupported: ttsSupported, speak, stop } = useTextToSpeech();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      }
    });
  }, [navigate]);

  useEffect(() => {
    if (transcript) {
      setInputText(prev => prev + transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedText = inputText.trim();

    if (trimmedText.length < 20) {
      toast.error("Please enter at least 20 characters for accurate evaluation");
      return;
    }

    if (trimmedText.length > 10000) {
      toast.error("Text must be 10,000 characters or less");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const evaluation = evaluateText(inputText);
    setResult(evaluation);

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
    resetTranscript();
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

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
      toast.info("Listening... Speak clearly into your microphone");
    }
  };

  const handlePlayExercise = () => {
    if (isPlaying) {
      stop();
    } else {
      speak(listeningExercises[selectedExercise].text);
      toast.info("Playing audio... Listen carefully");
    }
  };

  const handlePlaySampleResponse = () => {
    if (result?.sampleResponse) {
      if (isPlaying) {
        stop();
      } else {
        speak(result.sampleResponse);
      }
    }
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-teal-400 flex items-center justify-center">
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
                  Practice speaking and listening skills with our interactive assessment tools.
                </p>
              </div>

              {/* Tab Selection */}
              <div className="flex gap-2 mb-6">
                <Button
                  variant={activeTab === 'speak' ? 'teal' : 'outline'}
                  className="flex-1"
                  onClick={() => setActiveTab('speak')}
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Speaking Practice
                </Button>
                <Button
                  variant={activeTab === 'listen' ? 'teal' : 'outline'}
                  className="flex-1"
                  onClick={() => setActiveTab('listen')}
                >
                  <Headphones className="w-4 h-4 mr-2" />
                  Listening Practice
                </Button>
              </div>

              {activeTab === 'speak' ? (
                <div className="card-elevated p-8">
                  {/* Info Cards */}
                  <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-muted/50 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Mic className="w-5 h-5 text-secondary" />
                        <span className="font-medium text-sm">Fluency</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Flow and coherence</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-5 h-5 text-secondary" />
                        <span className="font-medium text-sm">Grammar</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Sentence structure</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Volume2 className="w-5 h-5 text-secondary" />
                        <span className="font-medium text-sm">Pronunciation</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Word articulation</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Headphones className="w-5 h-5 text-secondary" />
                        <span className="font-medium text-sm">Listening</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Comprehension</p>
                    </div>
                  </div>

                  {/* Voice Recording Button */}
                  {speechSupported && (
                    <div className="mb-6 text-center">
                      <Button
                        type="button"
                        variant={isListening ? "destructive" : "outline"}
                        size="lg"
                        onClick={handleMicToggle}
                        className={`w-24 h-24 rounded-full ${isListening ? 'animate-pulse' : ''}`}
                      >
                        {isListening ? (
                          <MicOff className="w-10 h-10" />
                        ) : (
                          <Mic className="w-10 h-10" />
                        )}
                      </Button>
                      <p className="text-sm text-muted-foreground mt-3">
                        {isListening ? "Tap to stop recording" : "Tap to start speaking"}
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="inputText">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="w-4 h-4 text-secondary" />
                          Your Text Sample {speechSupported && "(or speak above)"}
                        </div>
                      </Label>
                      <Textarea
                        id="inputText"
                        placeholder="Enter your text here or use the microphone above. Write as if you were speaking - describe your business idea, introduce yourself, or practice a pitch. Minimum 20 characters required..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="min-h-[200px] bg-muted/50"
                        maxLength={10000}
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        {inputText.length}/10,000 characters
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
              ) : (
                <div className="card-elevated p-8">
                  <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
                    <Headphones className="w-6 h-6 text-secondary" />
                    Listening Exercises
                  </h2>

                  {/* Exercise Selection */}
                  <div className="grid gap-4 mb-8">
                    {listeningExercises.map((exercise, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedExercise === index
                            ? 'bg-secondary/20 border-secondary'
                            : 'bg-muted/50 border-border hover:border-secondary/50'
                        }`}
                        onClick={() => setSelectedExercise(index)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{exercise.title}</h3>
                            <p className="text-xs text-muted-foreground">Duration: {exercise.duration}</p>
                          </div>
                          <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center">
                            {selectedExercise === index && (
                              <div className="w-3 h-3 rounded-full bg-secondary" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Play Button */}
                  {ttsSupported && (
                    <div className="text-center mb-8">
                      <Button
                        type="button"
                        variant={isPlaying ? "destructive" : "teal"}
                        size="lg"
                        onClick={handlePlayExercise}
                        className="w-32 h-32 rounded-full"
                      >
                        {isPlaying ? (
                          <Square className="w-12 h-12" />
                        ) : (
                          <Play className="w-12 h-12 ml-2" />
                        )}
                      </Button>
                      <p className="text-sm text-muted-foreground mt-4">
                        {isPlaying ? "Playing... Listen carefully" : "Tap to play audio exercise"}
                      </p>
                    </div>
                  )}

                  {/* Exercise Transcript (hidden during playback) */}
                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-secondary" />
                      <span className="font-medium text-sm">Exercise Transcript</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {listeningExercises[selectedExercise].text}
                    </p>
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-secondary/10 border border-secondary/30">
                    <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-secondary" />
                      Listening Tips
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Focus completely on the speaker without planning your response
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Take brief notes to reinforce key points
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Summarize what you hear to improve retention
                      </li>
                    </ul>
                  </div>

                  <p className="text-xs text-center text-muted-foreground mt-6">
                    Audio is generated using browser text-to-speech for demonstration
                  </p>
                </div>
              )}
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
                        { label: "Listening", score: result.listeningScore, icon: Headphones },
                      ].map((item) => (
                        <div key={item.label} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <item.icon className="w-4 h-4 text-secondary" />
                              <span className="font-medium">{item.label}</span>
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

                  {/* Sample Professional Response */}
                  <div className="card-elevated p-8">
                    <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Sample Professional Response
                    </h2>
                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 mb-4">
                      <p className="text-sm">{result.sampleResponse}</p>
                    </div>
                    {ttsSupported && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePlaySampleResponse}
                        className="w-full"
                      >
                        {isPlaying ? (
                          <>
                            <VolumeX className="w-4 h-4 mr-2" />
                            Stop Audio
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-4 h-4 mr-2" />
                            Listen to Sample Response
                          </>
                        )}
                      </Button>
                    )}
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

                  {/* Speaking & Listening Tips */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="card-elevated p-6">
                      <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                        <Mic className="w-5 h-5 text-secondary" />
                        Speaking Improvement Tips
                      </h3>
                      <ul className="space-y-2">
                        {result.speakingTips.map((tip, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="card-elevated p-6">
                      <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                        <Headphones className="w-5 h-5 text-secondary" />
                        Listening Improvement Tips
                      </h3>
                      <ul className="space-y-2">
                        {result.listeningTips.map((tip, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="teal" className="flex-1" asChild>
                      <Link to="/reports">View All Reports & Download PDF</Link>
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
