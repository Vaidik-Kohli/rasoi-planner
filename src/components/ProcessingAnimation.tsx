import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Bot, Database, ChefHat, ShoppingCart, Calendar } from 'lucide-react';

interface ProcessingAnimationProps {
  onComplete: () => void;
}

const PROCESSING_STEPS = [
  {
    icon: Database,
    title: "Parsing your pantry",
    description: "Converting ingredients to structured format",
    duration: 2000
  },
  {
    icon: Bot,
    title: "Matching recipes",
    description: "Finding perfect recipes for your ingredients",
    duration: 2500
  },
  {
    icon: ChefHat,
    title: "Adapting cooking steps",
    description: "Customizing for your preferences and appliances",
    duration: 2000
  },
  {
    icon: Calendar,
    title: "Building meal schedule",
    description: "Creating balanced 7-day plan",
    duration: 1500
  },
  {
    icon: ShoppingCart,
    title: "Generating shopping list",
    description: "Smart recommendations with cost estimates",
    duration: 1000
  }
];

export const ProcessingAnimation = ({ onComplete }: ProcessingAnimationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let stepTimer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    const runStep = (stepIndex: number) => {
      if (stepIndex >= PROCESSING_STEPS.length) {
        setProgress(100);
        setTimeout(onComplete, 500);
        return;
      }

      const step = PROCESSING_STEPS[stepIndex];
      setCurrentStep(stepIndex);

      // Animate progress for this step
      const progressIncrement = 100 / PROCESSING_STEPS.length;
      const startProgress = stepIndex * progressIncrement;
      const endProgress = (stepIndex + 1) * progressIncrement;
      
      let currentProgress = startProgress;
      progressTimer = setInterval(() => {
        currentProgress += 2;
        if (currentProgress >= endProgress) {
          clearInterval(progressTimer);
          currentProgress = endProgress;
        }
        setProgress(currentProgress);
      }, step.duration / ((endProgress - startProgress) / 2));

      stepTimer = setTimeout(() => {
        runStep(stepIndex + 1);
      }, step.duration);
    };

    runStep(0);

    return () => {
      if (stepTimer) clearTimeout(stepTimer);
      if (progressTimer) clearInterval(progressTimer);
    };
  }, [onComplete]);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-glow bg-gradient-warm border-0">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            AI Kitchen at Work
          </h2>
          <p className="text-muted-foreground">
            Creating your perfect meal plan...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress 
            value={progress} 
            className="h-3 bg-muted"
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Processing</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Processing Steps */}
        <div className="space-y-4">
          {PROCESSING_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-500 ${
                  isActive 
                    ? 'bg-gradient-primary/10 border border-primary/20 shadow-warm' 
                    : isCompleted 
                    ? 'bg-secondary/10 border border-secondary/20' 
                    : 'bg-muted/30 opacity-50'
                }`}
              >
                <div className={`p-2 rounded-full transition-colors ${
                  isActive 
                    ? 'bg-primary text-primary-foreground animate-pulse-glow' 
                    : isCompleted 
                    ? 'bg-secondary text-secondary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold ${isActive ? 'text-primary' : ''}`}>
                      {step.title}
                    </h3>
                    {isActive && (
                      <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                        Processing
                      </Badge>
                    )}
                    {isCompleted && (
                      <Badge variant="secondary" className="text-xs">
                        ✓ Done
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fun Facts */}
        <div className="mt-8 p-4 bg-gradient-spice/5 rounded-lg border border-accent/20">
          <p className="text-sm text-center text-accent font-medium">
            💡 Did you know? Our AI considers over 500+ traditional Indian recipes and adapts them to your exact pantry!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};