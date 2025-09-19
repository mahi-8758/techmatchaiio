import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Brain, Target, Shield, Zap, Sparkles, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Matching",
      description: "Our advanced AI evaluates candidates based on practical skills, not just credentials."
    },
    {
      icon: Target,
      title: "Practical Assessments", 
      description: "Real-world challenges that reveal true capabilities and problem-solving skills."
    },
    {
      icon: Shield,
      title: "Bias-Free Hiring",
      description: "Eliminate unconscious bias with objective, skill-based evaluations."
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get immediate insights and matches to accelerate your hiring process."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="backdrop-blur-lg bg-background/95 border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">TalentMatch AI</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center space-x-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="text-muted-foreground">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 text-center">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Talent Matching</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Match Talent Based on{" "}
              <span 
                className="bg-clip-text text-transparent"
                style={{ 
                  backgroundImage: 'var(--gradient-skills)'
                }}
              >
                Real Skills
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Skip the resume screening. Our AI evaluates candidates through 
              practical assessments and matches them to roles where they'll actually excel.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg">
                Start Hiring Smarter
              </Button>
            </Link>
            <Link to="/auth">
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-3 border-border bg-background/50 hover:bg-muted/50 flex items-center gap-2"
              >
                <PlayCircle className="h-5 w-5" />
                Take Assessment
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-success">94%</div>
              <div className="text-sm text-muted-foreground">More Accurate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent">60%</div>
              <div className="text-sm text-muted-foreground">Faster Process</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">10k+</div>
              <div className="text-sm text-muted-foreground">Successful Matches</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose TalentMatch AI?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Revolutionary hiring that focuses on what truly matters - skills and potential.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border-border bg-card/50 backdrop-blur-sm">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <Card className="p-8 lg:p-12 text-center bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 backdrop-blur-sm">
          <CardContent className="p-0 space-y-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-card-foreground">
                Ready to Transform Your Hiring?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of companies already using AI-powered skill assessment 
                to build better teams.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg">
                  Start Free Trial
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-3 border-border bg-background/50 hover:bg-muted/50 flex items-center gap-2"
              >
                <PlayCircle className="h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-foreground">TalentMatch AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 TalentMatch AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;