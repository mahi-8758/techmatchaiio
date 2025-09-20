import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Target, Shield, Zap, Sparkles, Users, TrendingUp, Globe, ChevronRight, Check, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Matching",
      description: "Advanced algorithms evaluate candidates based on practical skills and real-world performance."
    },
    {
      icon: Target,
      title: "Skill-Based Assessments",
      description: "Comprehensive evaluations that test actual capabilities, not just theoretical knowledge."
    },
    {
      icon: Shield,
      title: "Bias-Free Hiring",
      description: "Eliminate unconscious bias with objective, data-driven candidate evaluations."
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description: "Forecast candidate success and team fit using advanced machine learning models."
    },
    {
      icon: Users,
      title: "Team Compatibility",
      description: "Analyze cultural fit and team dynamics to ensure seamless integration."
    },
    {
      icon: Globe,
      title: "Global Talent Pool",
      description: "Access diverse candidates worldwide with our comprehensive talent network."
    }
  ];

  const stats = [
    { value: "10,000+", label: "Successful Matches" },
    { value: "95%", label: "Accuracy Rate" },
    { value: "60%", label: "Faster Hiring" },
    { value: "500+", label: "Partner Companies" }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "VP of Engineering",
      company: "TechCorp",
      content: "TalentMatch AI transformed our hiring process. We're finding better candidates faster than ever before.",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "Head of Talent",
      company: "StartupXYZ",
      content: "The skill-based assessments revealed candidates we would have missed with traditional screening.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0">
        {/* Main animated gradient background */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'var(--gradient-animated)',
            backgroundSize: '400% 400%',
            animation: 'gradient-shift 8s ease-in-out infinite'
          }}
        />
        
        {/* Floating gradient orbs */}
        <div 
          className="absolute top-20 left-20 w-96 h-96 rounded-full animate-float-slow"
          style={{
            background: 'var(--gradient-orb-1)',
            filter: 'blur(40px)'
          }}
        />
        <div 
          className="absolute bottom-20 right-20 w-80 h-80 rounded-full animate-float-medium"
          style={{
            background: 'var(--gradient-orb-2)',
            filter: 'blur(35px)'
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full animate-pulse-glow"
          style={{
            background: 'var(--gradient-orb-3)',
            filter: 'blur(30px)'
          }}
        />
      </div>

      {/* Content with higher z-index */}
      <div className="relative z-10">
        {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">TechMatch AI</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Reviews</a>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link>
            </div>

            <div className="flex items-center space-x-3">
              <Link to="/auth">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Get Started
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Revolutionary AI-Powered Hiring
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Find Talent Based on{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Real Skills
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Skip the resume guesswork. Our AI evaluates candidates through practical assessments 
              and matches them to roles where they'll excel from day one.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 py-4 bg-primary hover:bg-primary/90 shadow-xl">
                  Start Hiring Better
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-border hover:bg-muted">
                  Take Assessment
                </Button>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose TechMatch AI?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced AI technology that revolutionizes how companies discover and hire top talent.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border bg-card">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Three simple steps to better hiring decisions</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Define Requirements",
                description: "Tell us about the role, required skills, and team culture. Our AI understands complex job requirements."
              },
              {
                step: "02",
                title: "AI Assessment",
                description: "Candidates complete practical, role-specific assessments that evaluate real-world capabilities."
              },
              {
                step: "03",
                title: "Smart Matching",
                description: "Get ranked candidates with detailed insights on skills, cultural fit, and success probability."
              }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold text-white">{step.step}</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-xl text-muted-foreground">Trusted by leading companies worldwide</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border bg-card">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <blockquote className="text-lg mb-6 leading-relaxed">"{testimonial.content}"</blockquote>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Hiring?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of companies using AI-powered assessments to build exceptional teams.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth">
                  <Button size="lg" className="text-lg px-8 py-4 bg-primary hover:bg-primary/90 shadow-xl">
                    Start Free Trial
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-border hover:bg-muted">
                  Schedule Demo
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-success" />
                  <span>Free 14-day trial</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-success" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-success" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">TechMatch AI</span>
              </div>
              <p className="text-muted-foreground">
                Revolutionizing hiring with AI-powered skill assessments and intelligent candidate matching.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Enterprise</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><Link to="/documentation" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground">
            <p>&copy; 2025 TechMatch AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default Index;