import { useState } from "react";
import { PantryInputForm } from "@/components/PantryInputForm";
import { ProcessingAnimation } from "@/components/ProcessingAnimation";
import { MealPlanOutput } from "@/components/MealPlanOutput";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Sparkles, Clock, Users } from "lucide-react";
import heroImage from "@/assets/hero-indian-meal.jpg";
import { UserPreferences } from "@/utils/pantryParser";

type AppState = 'input' | 'processing' | 'output';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('input');
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);

  const handleFormSubmit = (data: UserPreferences) => {
    console.log('Form data:', data);
    setUserPreferences(data);
    setAppState('processing');
  };

  const handleProcessingComplete = () => {
    setAppState('output');
  };

  const handleNewPlan = () => {
    setAppState('input');
    setUserPreferences(null);
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-primary/80" />
        
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <Badge variant="secondary" className="text-lg py-2 px-6 bg-white/20 text-white border-white/30">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Meal Planning
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Rasoi Planner
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              From pantry to plate in seconds. India's smartest meal planner that creates 
              <span className="text-primary-glow font-semibold"> personalized weekly menus </span>
              with what you already have.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12 text-white/80">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5" />
                <span>500+ Indian Recipes</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>Smart Time Planning</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Family-Sized Portions</span>
              </div>
            </div>

            {appState === 'input' && (
              <Button 
                variant="secondary"
                size="lg" 
                className="text-xl py-6 px-8 shadow-glow bg-white text-primary hover:bg-white/90"
                onClick={() => document.getElementById('input-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start Planning Now →
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section id="input-section" className="container mx-auto px-4 py-16">
        {appState === 'input' && (
          <div className="animate-in slide-in-from-bottom-10 duration-500">
            <PantryInputForm onSubmit={handleFormSubmit} />
          </div>
        )}
        
        {appState === 'processing' && (
          <div className="animate-in slide-in-from-bottom-10 duration-500">
            <ProcessingAnimation onComplete={handleProcessingComplete} />
          </div>
        )}
        
        {appState === 'output' && userPreferences && (
          <div className="animate-in slide-in-from-bottom-10 duration-500">
            <MealPlanOutput preferences={userPreferences} onNewPlan={handleNewPlan} />
          </div>
        )}
      </section>

      {/* Features Section - Only show on input state */}
      {appState === 'input' && (
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Why Indian Families Love Rasoi Planner
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Designed specifically for Indian kitchens with authentic recipes and smart adaptations
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: "🥘",
                  title: "Authentic Indian Recipes", 
                  description: "From North Indian classics to South Indian favorites - all adapted to your pantry and spice preferences"
                },
                {
                  icon: "🛒", 
                  title: "Smart Shopping Lists",
                  description: "Automatically generated with cost estimates and organized by grocery store sections"
                },
                {
                  icon: "⏰",
                  title: "Time-Optimized Planning", 
                  description: "Batch cooking suggestions and prep-ahead tips to save hours in the kitchen"
                }
              ].map((feature, i) => (
                <Card key={i} className="text-center shadow-card hover:shadow-warm transition-all duration-300 border-0 bg-white/80">
                  <CardContent className="p-8">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default Index;
