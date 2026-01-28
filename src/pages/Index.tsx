import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Rocket, 
  Brain, 
  MessageSquare, 
  Target, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Lightbulb,
  BarChart3
} from "lucide-react";

const Index = () => {
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
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
            <a href="#mission" className="text-muted-foreground hover:text-foreground transition-colors">Mission</a>
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#challenges" className="text-muted-foreground hover:text-foreground transition-colors">Challenges</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center max-w-5xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">AI-Driven Business Launch Platform</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Launch Your Business with
            <span className="text-gradient-gold"> AI-Powered</span> Guidance
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            ENTREPRENEUR-X empowers first-time entrepreneurs with intelligent business planning, 
            personalized recommendations, and communication skill enhancement tools.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button variant="hero" size="xl" asChild>
              <Link to="/register">
                Start Your Journey
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a href="#about">Learn More</a>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-gradient-gold">AI</div>
              <div className="text-sm text-muted-foreground mt-1">Powered Analysis</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-gradient-teal">360°</div>
              <div className="text-sm text-muted-foreground mt-1">Skill Assessment</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground mt-1">Personalized</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h2 className="font-display text-4xl font-bold mb-6">
                About <span className="text-gradient-gold">ENTREPRENEUR-X</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                ENTREPRENEUR-X is a web-based AI-driven system designed specifically for first-time 
                entrepreneurs. Our platform combines intelligent business planning tools with 
                communication skill assessment to provide comprehensive support for your entrepreneurial journey.
              </p>
              <p className="text-muted-foreground mb-8">
                <em className="text-sm opacity-80">
                  This is a prototype system designed for academic demonstration. AI outputs are 
                  simulated using rule-based logic for evaluation purposes.
                </em>
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="card-elevated p-4">
                  <Brain className="w-8 h-8 text-primary mb-3" />
                  <h4 className="font-semibold mb-1">Smart Planning</h4>
                  <p className="text-sm text-muted-foreground">AI-assisted business recommendations</p>
                </div>
                <div className="card-elevated p-4">
                  <MessageSquare className="w-8 h-8 text-secondary mb-3" />
                  <h4 className="font-semibold mb-1">Skill Assessment</h4>
                  <p className="text-sm text-muted-foreground">Communication evaluation tools</p>
                </div>
              </div>
            </div>
            <div className="animate-slide-in-right">
              <div className="card-elevated p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/10 rounded-full blur-2xl"></div>
                <div className="relative space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Goal-Oriented Planning</h4>
                      <p className="text-sm text-muted-foreground">Tailored to your business vision</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Progress Tracking</h4>
                      <p className="text-sm text-muted-foreground">Monitor your growth journey</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Detailed Reports</h4>
                      <p className="text-sm text-muted-foreground">Comprehensive analytics dashboard</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display text-4xl font-bold mb-6">
            Our <span className="text-gradient-teal">Mission</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            To democratize entrepreneurship by providing accessible, AI-powered tools that help 
            first-time business owners make informed decisions and develop essential skills for success.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card-elevated p-6 text-center hover:glow-gold transition-shadow duration-500">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">Inspire Ideas</h3>
              <p className="text-sm text-muted-foreground">
                Generate tailored business ideas based on your interests and resources
              </p>
            </div>
            <div className="card-elevated p-6 text-center hover:glow-teal transition-shadow duration-500">
              <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">Build Confidence</h3>
              <p className="text-sm text-muted-foreground">
                Enhance communication skills crucial for business success
              </p>
            </div>
            <div className="card-elevated p-6 text-center hover:shadow-[0_0_40px_hsl(263,70%,50%,0.3)] transition-shadow duration-500">
              <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">Enable Launch</h3>
              <p className="text-sm text-muted-foreground">
                Provide actionable roadmaps to turn ideas into reality
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How AI Can Help Section */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">
              How <span className="text-gradient-gold">AI Can Help</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our simulated AI modules provide intelligent recommendations and assessments 
              designed to support your entrepreneurial journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Business Planning Module */}
            <div className="card-elevated p-8 group hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-gold-light flex items-center justify-center glow-gold">
                  <Brain className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">Business Planning Module</h3>
                  <span className="text-xs text-muted-foreground">(Simulated AI)</span>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Personalized business idea suggestions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Estimated startup cost calculations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Step-by-step startup roadmap</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Resource and tool recommendations</span>
                </li>
              </ul>
            </div>

            {/* Communication Module */}
            <div className="card-elevated p-8 group hover:border-secondary/50 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-teal-light flex items-center justify-center glow-teal">
                  <MessageSquare className="w-7 h-7 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">Communication Evaluation</h3>
                  <span className="text-xs text-muted-foreground">(Simulated NLP)</span>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Speaking fluency assessment</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Grammar analysis and feedback</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Pronunciation scoring (simulated)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Listening comprehension evaluation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section id="challenges" className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">
              Challenges Faced by <span className="text-gradient-teal">First-Time Entrepreneurs</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Understanding these challenges is the first step to overcoming them. 
              ENTREPRENEUR-X is designed to address each of these pain points.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-elevated p-6 flex items-start gap-4 group hover:border-destructive/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Lack of Business Knowledge</h4>
                <p className="text-sm text-muted-foreground">
                  Many first-time entrepreneurs lack formal business education, making it difficult 
                  to navigate market research, financial planning, and strategy development.
                </p>
              </div>
            </div>
            
            <div className="card-elevated p-6 flex items-start gap-4 group hover:border-destructive/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Financial Literacy Gaps</h4>
                <p className="text-sm text-muted-foreground">
                  Understanding startup costs, budgeting, and financial projections remains 
                  a significant barrier for aspiring business owners.
                </p>
              </div>
            </div>
            
            <div className="card-elevated p-6 flex items-start gap-4 group hover:border-destructive/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Communication Barriers</h4>
                <p className="text-sm text-muted-foreground">
                  Effective communication is crucial for pitching ideas, negotiating deals, 
                  and building relationships with stakeholders.
                </p>
              </div>
            </div>
            
            <div className="card-elevated p-6 flex items-start gap-4 group hover:border-destructive/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Decision Paralysis</h4>
                <p className="text-sm text-muted-foreground">
                  Without proper guidance, entrepreneurs often struggle to make critical 
                  decisions about their business direction and priorities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="card-elevated p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10"></div>
            <div className="relative">
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                Ready to <span className="text-gradient-gold">Launch</span>?
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Join ENTREPRENEUR-X today and take the first step towards building your dream business 
                with AI-powered guidance and skill development tools.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/register">
                    Create Free Account
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="heroOutline" size="lg" asChild>
                  <Link to="/login">Already have an account?</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-gold-light flex items-center justify-center">
                <Rocket className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold">ENTREPRENEUR-X</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              A BCA Final Year Project Prototype • AI outputs are simulated for academic demonstration
            </p>
            <div className="text-sm text-muted-foreground">
              © 2024 ENTREPRENEUR-X
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
