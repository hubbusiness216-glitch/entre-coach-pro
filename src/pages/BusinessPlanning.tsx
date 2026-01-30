import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Rocket,
  Brain,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Lightbulb,
  DollarSign,
  MapPin,
  Target,
  CheckCircle,
  Sparkles,
} from "lucide-react";

interface Recommendation {
  businessIdea: string;
  startupCost: string;
  roadmap: string[];
  resources: string[];
}

// Simulated AI recommendation logic
const generateRecommendation = (
  interest: string,
  budget: string,
  location: string,
  goals: string
): Recommendation => {
  const businessIdeas: Record<string, string[]> = {
    technology: ["Mobile App Development Agency", "IT Consulting Services", "E-commerce Platform", "SaaS Product Development"],
    food: ["Cloud Kitchen / Food Delivery", "Specialty Café", "Catering Services", "Food Truck Business"],
    retail: ["Online Boutique Store", "Subscription Box Service", "Dropshipping Business", "Local Artisan Marketplace"],
    services: ["Digital Marketing Agency", "Freelance Consulting", "Home Services Platform", "Virtual Assistant Agency"],
    education: ["Online Tutoring Platform", "Skill Development Academy", "Educational Content Creation", "Corporate Training Services"],
    health: ["Fitness Coaching Business", "Wellness Center", "Health Tech App", "Nutrition Consulting"],
  };

  const budgetRanges: Record<string, { min: string; max: string }> = {
    low: { min: "₹50,000", max: "₹2,00,000" },
    medium: { min: "₹2,00,000", max: "₹10,00,000" },
    high: { min: "₹10,00,000", max: "₹50,00,000" },
  };

  const category = interest.toLowerCase();
  const ideas = businessIdeas[category] || businessIdeas.services;
  const budgetRange = budgetRanges[budget] || budgetRanges.medium;

  const selectedIdea = ideas[Math.floor(Math.random() * ideas.length)];

  return {
    businessIdea: selectedIdea,
    startupCost: `Estimated ${budgetRange.min} - ${budgetRange.max}`,
    roadmap: [
      "Week 1-2: Market research and validation",
      "Week 3-4: Business plan development",
      "Week 5-6: Legal registration and setup",
      "Week 7-8: Build MVP / Initial setup",
      "Week 9-10: Marketing strategy execution",
      "Week 11-12: Soft launch and feedback collection",
      "Month 4+: Scale and optimize operations",
    ],
    resources: [
      "Business registration portals (MCA, GST)",
      "Accounting software (Zoho, Tally)",
      "Project management tools (Trello, Notion)",
      "Marketing platforms (Google Ads, Meta)",
      "Legal consultation services",
      "Banking and payment gateways",
    ],
  };
};

const BusinessPlanning = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  // Form state
  const [businessInterest, setBusinessInterest] = useState("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [goals, setGoals] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedLocation = location.trim();
    const trimmedGoals = goals.trim();

    if (!businessInterest || !budget || !trimmedLocation || !trimmedGoals) {
      toast.error("Please fill in all fields");
      return;
    }

    // Validate length constraints (matching database constraints)
    if (trimmedLocation.length > 200) {
      toast.error("Location must be 200 characters or less");
      return;
    }

    if (trimmedGoals.length > 5000) {
      toast.error("Goals must be 5000 characters or less");
      return;
    }

    setLoading(true);

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate recommendation
    const rec = generateRecommendation(businessInterest, budget, location, goals);
    setRecommendation(rec);

    // Save to database
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("business_inputs").insert({
        user_id: user.id,
        business_interest: businessInterest,
        budget,
        location: location.trim(),
        goals: goals.trim(),
      });
    }

    setLoading(false);
    setStep(2);
    toast.success("AI recommendation generated!");
  };

  const resetForm = () => {
    setStep(1);
    setRecommendation(null);
    setBusinessInterest("");
    setBudget("");
    setLocation("");
    setGoals("");
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
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">Business Planning</span>
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
                  Plan Your <span className="text-gradient-gold">Business Launch</span>
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Tell us about your interests, budget, and goals. Our simulated AI will 
                  generate personalized business recommendations for you.
                </p>
              </div>

              <div className="card-elevated p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="interest">
                        <div className="flex items-center gap-2 mb-1">
                          <Lightbulb className="w-4 h-4 text-primary" />
                          Business Interest Area
                        </div>
                      </Label>
                      <Select value={businessInterest} onValueChange={setBusinessInterest}>
                        <SelectTrigger className="h-12 bg-muted/50">
                          <SelectValue placeholder="Select your area of interest" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology & IT</SelectItem>
                          <SelectItem value="food">Food & Beverages</SelectItem>
                          <SelectItem value="retail">Retail & E-commerce</SelectItem>
                          <SelectItem value="services">Professional Services</SelectItem>
                          <SelectItem value="education">Education & Training</SelectItem>
                          <SelectItem value="health">Health & Wellness</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="w-4 h-4 text-primary" />
                          Available Budget
                        </div>
                      </Label>
                      <Select value={budget} onValueChange={setBudget}>
                        <SelectTrigger className="h-12 bg-muted/50">
                          <SelectValue placeholder="Select your budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low (₹50K - ₹2L)</SelectItem>
                          <SelectItem value="medium">Medium (₹2L - ₹10L)</SelectItem>
                          <SelectItem value="high">High (₹10L - ₹50L)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-primary" />
                        Target Location / Market
                      </div>
                    </Label>
                    <Input
                      id="location"
                      placeholder="e.g., Mumbai, Online, Pan-India"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="h-12 bg-muted/50"
                      maxLength={200}
                    />
                    <p className="text-xs text-muted-foreground text-right">{location.length}/200</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goals">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="w-4 h-4 text-primary" />
                        Entrepreneurial Goals
                      </div>
                    </Label>
                    <Textarea
                      id="goals"
                      placeholder="Describe your business goals, what you want to achieve, and any specific requirements..."
                      value={goals}
                      onChange={(e) => setGoals(e.target.value)}
                      className="min-h-[120px] bg-muted/50"
                      maxLength={5000}
                    />
                    <p className="text-xs text-muted-foreground text-right">{goals.length}/5000</p>
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating AI Recommendations...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate Business Plan
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>

                <p className="text-xs text-center text-muted-foreground mt-6">
                  AI-generated recommendations (prototype simulation)
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Recommendation Results */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-4">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">AI Recommendation Generated</span>
                </div>
                <h1 className="font-display text-4xl font-bold mb-4">
                  Your <span className="text-gradient-gold">Business Plan</span>
                </h1>
              </div>

              {recommendation && (
                <div className="space-y-6">
                  {/* Business Idea */}
                  <div className="card-elevated p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Lightbulb className="w-6 h-6 text-primary" />
                      </div>
                      <h2 className="font-display text-2xl font-bold">Suggested Business Idea</h2>
                    </div>
                    <p className="text-2xl font-semibold text-gradient-gold">
                      {recommendation.businessIdea}
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Based on your interest in {businessInterest} and {location} market
                    </p>
                  </div>

                  {/* Startup Cost */}
                  <div className="card-elevated p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-secondary" />
                      </div>
                      <h2 className="font-display text-2xl font-bold">Estimated Startup Cost</h2>
                    </div>
                    <p className="text-2xl font-semibold text-gradient-teal">
                      {recommendation.startupCost}
                    </p>
                    <p className="text-muted-foreground mt-2">
                      This includes initial setup, marketing, and 3-month operational buffer
                    </p>
                  </div>

                  {/* Roadmap */}
                  <div className="card-elevated p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                        <Target className="w-6 h-6 text-accent" />
                      </div>
                      <h2 className="font-display text-2xl font-bold">Startup Roadmap</h2>
                    </div>
                    <div className="space-y-4">
                      {recommendation.roadmap.map((step, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-sm font-bold text-primary">{index + 1}</span>
                          </div>
                          <p className="text-foreground">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resources */}
                  <div className="card-elevated p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Rocket className="w-6 h-6 text-primary" />
                      </div>
                      <h2 className="font-display text-2xl font-bold">Recommended Resources</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      {recommendation.resources.map((resource, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                          <span className="text-sm">{resource}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="hero" className="flex-1" asChild>
                      <Link to="/reports">View All Reports</Link>
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={resetForm}>
                      Create Another Plan
                    </Button>
                  </div>

                  <p className="text-xs text-center text-muted-foreground">
                    AI-generated recommendations (prototype simulation for academic demonstration)
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

export default BusinessPlanning;
