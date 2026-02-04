import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, ChevronRight, ChevronLeft, Sparkles, Target, MessageSquare, TrendingUp, Award } from "lucide-react";

interface TourStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: string;
}

const tourSteps: TourStep[] = [
  {
    title: "Welcome to Entrepreneur-X! 🚀",
    description: "Your AI-powered entrepreneurship coach. Let's take a quick tour to help you get started on your journey to success.",
    icon: <Sparkles className="h-8 w-8 text-primary" />,
  },
  {
    title: "Business Planning",
    description: "Create comprehensive business plans with AI assistance. Get personalized recommendations based on your goals, budget, and location.",
    icon: <Target className="h-8 w-8 text-secondary" />,
    highlight: "business-planning",
  },
  {
    title: "Communication Skills",
    description: "Improve your speaking and presentation skills. Get real-time feedback on fluency, grammar, and pronunciation.",
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    highlight: "communication",
  },
  {
    title: "Pitch Practice",
    description: "Practice your investor pitches with AI scenarios. Get scored feedback and improve your delivery with each session.",
    icon: <TrendingUp className="h-8 w-8 text-secondary" />,
    highlight: "pitch-practice",
  },
  {
    title: "Track Your Progress",
    description: "Earn achievements, maintain streaks, and level up as you improve. Your dashboard shows your growth journey!",
    icon: <Award className="h-8 w-8 text-primary" />,
    highlight: "gamification",
  },
];

interface OnboardingTourProps {
  onComplete: () => void;
}

export function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem("onboarding-completed", "true");
    setTimeout(onComplete, 300);
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isVisible) return null;

  const step = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-md mx-4 border-primary/20 shadow-2xl animate-scale-in">
        <CardHeader className="relative pb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSkip}
            className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>
          
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 animate-pulse-slow">
              {step.icon}
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Step {currentStep + 1} of {tourSteps.length}
              </p>
              <CardTitle className="text-xl font-display">{step.title}</CardTitle>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            {step.description}
          </p>
          
          {/* Step indicators */}
          <div className="flex justify-center gap-2">
            {tourSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? "w-6 bg-primary" 
                    : index < currentStep 
                      ? "bg-primary/50" 
                      : "bg-muted"
                }`}
              />
            ))}
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex-1 transition-all duration-200 hover:scale-[1.02]"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25"
            >
              {currentStep === tourSteps.length - 1 ? (
                "Get Started"
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
          
          {currentStep === 0 && (
            <button
              onClick={handleSkip}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip tour
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function useOnboarding() {
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem("onboarding-completed");
    if (!completed) {
      // Delay tour start for better UX
      const timer = setTimeout(() => setShowTour(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const resetTour = () => {
    localStorage.removeItem("onboarding-completed");
    setShowTour(true);
  };

  return { showTour, setShowTour, resetTour };
}
