import { UserPreferences } from './pantryParser';

export interface AIGeneratedMeal {
  name: string;
  time: string;
  spice: number;
  ingredients: string[];
  steps: string[];
  nutrition?: {
    calories?: number;
    protein?: string;
    carbs?: string;
    fats?: string;
  };
  tips?: string[];
}

export interface AIGeneratedMealPlan {
  weeklyPlan: Record<string, {
    breakfast: AIGeneratedMeal;
    lunch: AIGeneratedMeal;
    dinner: AIGeneratedMeal;
  }>;
  featuredRecipe: AIGeneratedMeal & { servings: number };
  shoppingList: Array<{
    category: string;
    items: string[];
    cost: string;
  }>;
  totalCost: string;
  pantryUtilization: number;
  aiInsights?: {
    nutritionalBalance: string;
    varietyScore: number;
    suggestions: string[];
  };
}

export class AIService {
  private openaiKey: string;
  private anthropicKey: string;
  private selectedService: string;

  constructor() {
    this.openaiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
    this.selectedService = import.meta.env.VITE_AI_SERVICE || 'fallback';
  }

  async generateMealPlan(preferences: UserPreferences): Promise<AIGeneratedMealPlan | null> {
    try {
      // Check if we have valid API keys
      if (this.selectedService === 'openai' && this.openaiKey) {
        return await this.generateWithOpenAI(preferences);
      } else if (this.selectedService === 'anthropic' && this.anthropicKey) {
        return await this.generateWithAnthropic(preferences);
      } else {
        console.log('No AI service configured, using fallback logic');
        return null; // Will use fallback
      }
    } catch (error) {
      console.error('AI service error:', error);
      return null; // Will use fallback
    }
  }

  private async generateWithOpenAI(preferences: UserPreferences): Promise<AIGeneratedMealPlan | null> {
    const prompt = this.createMealPlanPrompt(preferences);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert Indian chef and nutritionist who creates personalized meal plans. You understand regional Indian cuisines, traditional cooking methods, and nutritional balance. Always respond with valid JSON only, no additional text.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 3000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content.trim();
      
      // Parse JSON response
      return JSON.parse(content);
    } catch (error) {
      console.error('OpenAI API error:', error);
      return null;
    }
  }

  private async generateWithAnthropic(preferences: UserPreferences): Promise<AIGeneratedMealPlan | null> {
    const prompt = this.createMealPlanPrompt(preferences);
    
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.anthropicKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 3000,
          messages: [
            {
              role: 'user',
              content: `You are an expert Indian chef and nutritionist. ${prompt}`
            }
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.content[0].text.trim();
      
      // Parse JSON response
      return JSON.parse(content);
    } catch (error) {
      console.error('Anthropic API error:', error);
      return null;
    }
  }

  private createMealPlanPrompt(preferences: UserPreferences): string {
    return `Create a personalized 7-day Indian meal plan based on these preferences:

Pantry Items: ${preferences.pantryList}
Cuisine: ${preferences.cuisine}
Family Size: ${preferences.familySize}
Spice Level: ${preferences.spiceLevel}/5
Time Constraint: ${preferences.timeConstraint}
Diet Type: ${preferences.dietType}

Requirements:
1. Use available pantry ingredients as much as possible
2. Generate authentic ${preferences.cuisine} recipes
3. Consider family size for portions
4. Match spice level preference (1=mild, 5=very spicy)
5. Respect time constraints (${preferences.timeConstraint})
6. Follow ${preferences.dietType} dietary requirements
7. Ensure nutritional balance throughout the week
8. Include cooking tips and nutritional info

Return ONLY valid JSON in this exact format:
{
  "weeklyPlan": {
    "Monday": {
      "breakfast": {
        "name": "Recipe Name",
        "time": "X mins",
        "spice": 1-5,
        "ingredients": ["ingredient1", "ingredient2"],
        "steps": ["step1", "step2"],
        "nutrition": {"calories": 300, "protein": "15g", "carbs": "45g", "fats": "10g"},
        "tips": ["cooking tip"]
      },
      "lunch": {...},
      "dinner": {...}
    },
    "Tuesday": {...},
    ... (all 7 days)
  },
  "featuredRecipe": {
    "name": "Most complex recipe name",
    "time": "X mins",
    "spice": 1-5,
    "ingredients": ["ingredient1"],
    "steps": ["step1"],
    "nutrition": {...},
    "tips": ["tip"],
    "servings": ${preferences.familySize}
  },
  "shoppingList": [
    {
      "category": "Vegetables",
      "items": ["item1 (quantity)", "item2"],
      "cost": "₹XXX"
    }
  ],
  "totalCost": "₹XXX",
  "pantryUtilization": 85,
  "aiInsights": {
    "nutritionalBalance": "Analysis of nutritional balance",
    "varietyScore": 4.5,
    "suggestions": ["suggestion1", "suggestion2"]
  }
}`;
  }

  isConfigured(): boolean {
    return (this.selectedService === 'openai' && !!this.openaiKey) ||
           (this.selectedService === 'anthropic' && !!this.anthropicKey);
  }

  getServiceStatus(): string {
    if (this.selectedService === 'fallback') {
      return 'Using rule-based meal planning';
    }
    if (this.isConfigured()) {
      return `Using ${this.selectedService.toUpperCase()} AI service`;
    }
    return 'AI service configured but API key missing';
  }
}

export const aiService = new AIService();