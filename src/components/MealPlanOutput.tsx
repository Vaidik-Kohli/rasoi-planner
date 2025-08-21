import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Clock, Users, Flame, ChefHat, ShoppingCart, Calendar, Utensils } from 'lucide-react';
import { generateMealPlan } from '@/utils/mealPlanGenerator';
import { UserPreferences } from '@/utils/pantryParser';
import { useMemo } from 'react';

interface MealPlanOutputProps {
  preferences: UserPreferences;
  onNewPlan: () => void;
}

export const MealPlanOutput = ({ preferences, onNewPlan }: MealPlanOutputProps) => {
  // Generate meal plan based on actual user preferences
  const mealPlan = useMemo(() => generateMealPlan(preferences), [preferences]);
  const renderSpiceLevel = (level: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Flame 
        key={i} 
        className={`w-3 h-3 ${i < level ? 'text-accent fill-current' : 'text-muted-foreground'}`} 
      />
    ));
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-primary text-primary-foreground border-0 shadow-glow">
        <CardContent className="p-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Your Perfect Meal Plan ✨</h1>
            <p className="text-primary-foreground/90 mb-4">
              7 days of delicious {preferences.cuisine} meals tailored to your pantry ({mealPlan.pantryUtilization}% utilization)
            </p>
            <div className="flex justify-center gap-4 text-sm flex-wrap">
              <Badge variant="secondary" className="text-primary">
                <Users className="w-3 h-3 mr-1" />
                Family of {preferences.familySize}
              </Badge>
              <Badge variant="secondary" className="text-primary">
                <ChefHat className="w-3 h-3 mr-1" />
                {preferences.cuisine}
              </Badge>
              <Badge variant="secondary" className="text-primary">
                <Clock className="w-3 h-3 mr-1" />
                Max {preferences.timeConstraint}
              </Badge>
              <Badge variant="secondary" className="text-primary">
                <Flame className="w-3 h-3 mr-1" />
                Spice Level {preferences.spiceLevel}/5
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Weekly Plan
          </TabsTrigger>
          <TabsTrigger value="recipes" className="flex items-center gap-2">
            <ChefHat className="w-4 h-4" />
            Featured Recipe
          </TabsTrigger>
          <TabsTrigger value="shopping" className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Shopping List
          </TabsTrigger>
        </TabsList>

        {/* Weekly Calendar */}
        <TabsContent value="calendar">
          <div className="grid gap-4">
            {Object.entries(mealPlan.weeklyPlan).map(([day, meals]) => (
              <Card key={day} className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-primary">{day}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {Object.entries(meals).map(([mealType, meal]) => (
                      <div key={mealType} className="space-y-2">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          {mealType}
                        </h4>
                        <div className="p-3 bg-gradient-warm rounded-lg border border-border">
                          <h5 className="font-semibold text-foreground mb-2">{meal.name}</h5>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {meal.time}
                            </div>
                            <div className="flex items-center gap-1">
                              {renderSpiceLevel(meal.spice)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Featured Recipe */}
        <TabsContent value="recipes">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-2xl text-primary flex items-center gap-2">
                <Utensils className="w-6 h-6" />
                {mealPlan.featuredRecipe.name}
              </CardTitle>
              <div className="flex gap-4 text-sm flex-wrap">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {mealPlan.featuredRecipe.time}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {mealPlan.featuredRecipe.servings} servings
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  {renderSpiceLevel(mealPlan.featuredRecipe.spice)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Ingredients */}
              <div>
                <h3 className="font-semibold text-lg mb-3 text-foreground">Ingredients</h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {mealPlan.featuredRecipe.ingredients.map((ingredient, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span className="text-sm">{ingredient}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Instructions */}
              <div>
                <h3 className="font-semibold text-lg mb-3 text-foreground">Cooking Instructions</h3>
                <div className="space-y-3">
                  {mealPlan.featuredRecipe.steps.map((step, i) => (
                    <div key={i} className="flex gap-3 p-3 bg-gradient-warm rounded-lg">
                      <Badge variant="hero" className="rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">
                        {i + 1}
                      </Badge>
                      <p className="text-sm text-foreground">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shopping List */}
        <TabsContent value="shopping">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-2xl text-primary flex items-center gap-2">
                <ShoppingCart className="w-6 h-6" />
                Smart Shopping List
              </CardTitle>
              <p className="text-muted-foreground">
                Items you need to complete this week's meal plan based on your current pantry
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mealPlan.shoppingList.length > 0 ? (
                  <>
                    {mealPlan.shoppingList.map((category, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg text-foreground">{category.category}</h3>
                          <Badge variant="spice">{category.cost}</Badge>
                        </div>
                        <div className="grid md:grid-cols-2 gap-2">
                          {category.items.map((item, j) => (
                            <div key={j} className="flex items-center gap-2 p-2 bg-gradient-warm rounded border border-border">
                              <input type="checkbox" className="rounded border-border" />
                              <span className="text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between p-4 bg-gradient-spice/10 rounded-lg border border-accent/20">
                      <span className="font-semibold text-lg">Total Estimated Cost:</span>
                      <Badge variant="hero" className="text-lg py-2 px-4">{mealPlan.totalCost}</Badge>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-xl font-semibold text-primary mb-2">Perfect Pantry!</h3>
                    <p className="text-muted-foreground">
                      You have everything needed for this week's meal plan. No shopping required!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={onNewPlan} size="lg">
          Create New Plan
        </Button>
        <Button variant="hero" size="lg" className="shadow-glow">
          Save & Export Plan
        </Button>
      </div>
    </div>
  );
};