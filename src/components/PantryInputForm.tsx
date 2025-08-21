import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChefHat, Users, Clock, Flame } from 'lucide-react';
import { UserPreferences } from '@/utils/pantryParser';

interface PantryInputFormProps {
  onSubmit: (data: UserPreferences) => void;
}

const CUISINES = [
  "North Indian", "South Indian", "Bengali", "Gujarati", 
  "Maharashtrian", "Punjabi", "Fusion Indian", "Global"
];

const DIET_TYPES = [
  "Vegetarian", "Non-Vegetarian", "Vegan", "Jain", "Gluten-Free"
];

const TIME_OPTIONS = [
  "30 mins", "45 mins", "1 hour", "1.5 hours", "2+ hours"
];

export const PantryInputForm = ({ onSubmit }: PantryInputFormProps) => {
  const [pantryList, setPantryList] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [familySize, setFamilySize] = useState(4);
  const [spiceLevel, setSpiceLevel] = useState(3);
  const [timeConstraint, setTimeConstraint] = useState('');
  const [dietType, setDietType] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      pantryList,
      cuisine,
      familySize,
      spiceLevel,
      timeConstraint,
      dietType
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-card bg-gradient-warm border-0">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent flex items-center justify-center gap-2">
          <ChefHat className="text-primary" />
          Tell us about your kitchen
        </CardTitle>
        <p className="text-muted-foreground">
          Share your pantry and preferences - we'll create the perfect meal plan!
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pantry List */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              What's in your pantry?
            </label>
            <Textarea
              value={pantryList}
              onChange={(e) => setPantryList(e.target.value)}
              placeholder="e.g., atta 2kg, moong dal 500g, onions, tomatoes, ginger-garlic paste, turmeric, cumin seeds, basmati rice..."
              className="min-h-24 bg-background border-border focus:ring-primary transition-smooth"
              required
            />
            <p className="text-xs text-muted-foreground">
              💡 Include quantities when possible (1kg, 500g, 2 cups)
            </p>
          </div>

          <Separator />

          {/* Preferences Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Cuisine Preference */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full"></span>
                Preferred Cuisine
              </label>
              <Select value={cuisine} onValueChange={setCuisine} required>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Choose cuisine style" />
                </SelectTrigger>
                <SelectContent>
                  {CUISINES.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Diet Type */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                Diet Preference
              </label>
              <Select value={dietType} onValueChange={setDietType} required>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select diet type" />
                </SelectTrigger>
                <SelectContent>
                  {DIET_TYPES.map(d => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Family Size */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Users className="w-3 h-3 text-primary" />
                Family Size
              </label>
              <div className="flex gap-2">
                {[2, 3, 4, 5, 6].map(size => (
                  <Button
                    key={size}
                    type="button"
                    variant={familySize === size ? "hero" : "gentle"}
                    size="sm"
                    onClick={() => setFamilySize(size)}
                    className="flex-1"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Time Constraint */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-3 h-3 text-primary" />
                Cooking Time
              </label>
              <Select value={timeConstraint} onValueChange={setTimeConstraint} required>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Max cooking time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Spice Level */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Flame className="w-3 h-3 text-accent" />
              Spice Level ({spiceLevel}/5)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(level => (
                <Button
                  key={level}
                  type="button"
                  variant={spiceLevel >= level ? "spice" : "gentle"}
                  size="sm"
                  onClick={() => setSpiceLevel(level)}
                  className="flex-1"
                >
                  <Flame className={`w-3 h-3 ${spiceLevel >= level ? 'text-accent-foreground' : 'text-muted-foreground'}`} />
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Submit Button */}
          <Button 
            type="submit" 
            variant="hero"
            size="lg"
            className="w-full text-lg py-6 shadow-glow"
            disabled={!pantryList || !cuisine || !dietType || !timeConstraint}
          >
            Generate My Meal Plan ✨
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};