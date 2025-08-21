import { PantryItem, UserPreferences, parsePantryList, hasIngredient, getIngredientQuantity } from './pantryParser';
import { aiService, AIGeneratedMealPlan } from './aiService';

export interface Meal {
  name: string;
  time: string;
  spice: number;
  ingredients: string[];
  steps: string[];
}

export interface DayMeals {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
}

export interface ShoppingItem {
  name: string;
  quantity: string;
  category: string;
  estimatedCost: string;
}

export interface ShoppingCategory {
  category: string;
  items: string[];
  cost: string;
}

export interface MealPlan {
  weeklyPlan: Record<string, DayMeals>;
  featuredRecipe: Meal & { servings: number };
  shoppingList: ShoppingCategory[];
  totalCost: string;
  pantryUtilization: number;
  aiInsights?: {
    nutritionalBalance: string;
    varietyScore: number;
    suggestions: string[];
  };
  aiPowered?: boolean;
}

// Recipe database based on common Indian pantry ingredients
const RECIPE_TEMPLATES = {
  // Grain-based recipes
  basicRoti: {
    name: "Fresh Roti",
    baseIngredients: ['wheat flour', 'salt'],
    time: "20 mins",
    spice: 1,
    steps: [
      "Mix wheat flour with a pinch of salt",
      "Add water gradually to make soft dough",
      "Knead well and let rest for 15 minutes",
      "Roll into circles and cook on hot tawa",
      "Serve hot with any curry or dal"
    ]
  },
  
  alooParatha: {
    name: "Aloo Paratha",
    baseIngredients: ['wheat flour', 'potato', 'green chili', 'salt'],
    time: "35 mins", 
    spice: 2,
    steps: [
      "Boil and mash potatoes with green chili and salt",
      "Make dough with wheat flour and water",
      "Roll dough, add potato filling, seal and roll again",
      "Cook on tawa with a little oil/ghee",
      "Serve hot with curd or pickle"
    ]
  },

  alooSabzi: {
    name: "Simple Aloo Sabzi", 
    baseIngredients: ['potato', 'onion', 'turmeric', 'salt'],
    time: "25 mins",
    spice: 2,
    steps: [
      "Cut potatoes into cubes and onions into slices",
      "Heat oil, add cumin seeds if available",
      "Add onions and cook until golden",
      "Add potatoes, turmeric, salt and mix well",
      "Cover and cook until potatoes are tender"
    ]
  },

  jeeraRice: {
    name: "Jeera Rice",
    baseIngredients: ['rice', 'cumin seeds', 'salt'],
    time: "20 mins",
    spice: 1,
    steps: [
      "Wash and soak rice for 15 minutes",
      "Heat ghee/oil, add cumin seeds",
      "Add rice and water (1:2 ratio)",
      "Add salt and bring to boil",
      "Simmer covered until rice is cooked"
    ]
  },

  basicDal: {
    name: "Simple Dal",
    baseIngredients: ['toor dal', 'turmeric', 'salt'],
    time: "30 mins", 
    spice: 2,
    steps: [
      "Wash dal and pressure cook with turmeric and salt",
      "Heat oil/ghee in pan, add cumin seeds if available",
      "Add cooked dal and simmer",
      "Adjust consistency with water",
      "Garnish with coriander if available"
    ]
  },

  onionSabzi: {
    name: "Pyaz ki Sabzi",
    baseIngredients: ['onion', 'turmeric', 'red chili powder', 'salt'],
    time: "15 mins",
    spice: 3,
    steps: [
      "Slice onions thinly",
      "Heat oil, add mustard seeds if available", 
      "Add onions and cook until golden",
      "Add turmeric, red chili powder, salt",
      "Cook until onions are caramelized"
    ]
  },

  // Enhanced recipes that showcase AI capabilities
  tadkaDal: {
    name: "Tadka Dal",
    baseIngredients: ['toor dal', 'turmeric', 'cumin seeds', 'mustard seeds', 'onion', 'tomato'],
    time: "35 mins",
    spice: 3,
    steps: [
      "Pressure cook dal with turmeric and salt",
      "Heat oil, add cumin and mustard seeds",
      "Add chopped onions, cook until golden",
      "Add tomatoes and cook until soft",
      "Pour cooked dal and simmer",
      "Garnish with coriander"
    ]
  },

  mixVegCurry: {
    name: "Mixed Vegetable Curry",
    baseIngredients: ['potato', 'onion', 'tomato', 'turmeric', 'coriander seeds'],
    time: "30 mins",
    spice: 3,
    steps: [
      "Chop all vegetables into equal pieces",
      "Heat oil, add cumin seeds",
      "Add onions and cook until translucent",
      "Add tomatoes and spices",
      "Add vegetables and water",
      "Simmer until tender"
    ]
  },

  khichdi: {
    name: "Nutritious Khichdi",
    baseIngredients: ['rice', 'moong dal', 'turmeric', 'cumin seeds'],
    time: "25 mins",
    spice: 1,
    steps: [
      "Wash rice and dal together",
      "Heat ghee, add cumin seeds",
      "Add rice-dal mixture with turmeric",
      "Add water (1:3 ratio) and salt",
      "Pressure cook until soft and mushy"
    ]
  }
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function generateMealForSlot(
  pantryItems: PantryItem[], 
  mealType: 'breakfast' | 'lunch' | 'dinner',
  preferences: UserPreferences,
  usedIngredients: Set<string>
): Meal {
  const availableRecipes = Object.entries(RECIPE_TEMPLATES).filter(([_, recipe]) => {
    return recipe.baseIngredients.every(ingredient => hasIngredient(pantryItems, ingredient));
  });

  if (availableRecipes.length === 0) {
    // Fallback to basic roti if we have wheat flour
    if (hasIngredient(pantryItems, 'wheat flour')) {
      return {
        name: "Basic Roti",
        time: "15 mins",
        spice: 1,
        ingredients: ["Wheat flour", "Salt", "Water"],
        steps: [
          "Mix wheat flour with salt and water to make dough",
          "Knead well and rest for 10 minutes", 
          "Roll and cook on hot tawa",
          "Serve hot"
        ]
      };
    }
    
    // Ultimate fallback
    return {
      name: "Simple Meal",
      time: "10 mins", 
      spice: 1,
      ingredients: ["Available pantry items"],
      steps: ["Prepare with available ingredients"]
    };
  }

  // Select appropriate recipe for meal type
  let selectedRecipe;
  if (mealType === 'breakfast') {
    // Prefer parathas or simple dishes for breakfast
    selectedRecipe = availableRecipes.find(([key]) => key.includes('Paratha')) || 
                   availableRecipes.find(([key]) => key.includes('Roti')) ||
                   availableRecipes[0];
  } else if (mealType === 'lunch') {
    // Prefer rice + dal combinations for lunch  
    selectedRecipe = availableRecipes.find(([key]) => key.includes('Rice')) ||
                   availableRecipes.find(([key]) => key.includes('Dal')) ||
                   availableRecipes[0];
  } else {
    // Dinner - prefer sabzi + roti
    selectedRecipe = availableRecipes.find(([key]) => key.includes('Sabzi')) ||
                   availableRecipes.find(([key]) => key.includes('Roti')) ||
                   availableRecipes[0];
  }

  const [_, recipe] = selectedRecipe;
  
  // Mark ingredients as used
  recipe.baseIngredients.forEach(ing => usedIngredients.add(ing));
  
  return {
    name: recipe.name,
    time: recipe.time,
    spice: Math.min(recipe.spice, preferences.spiceLevel),
    ingredients: recipe.baseIngredients.map(ing => {
      const quantity = getIngredientQuantity(pantryItems, ing);
      return quantity ? `${ing} (${quantity.quantity}${quantity.unit})` : ing;
    }),
    steps: recipe.steps
  };
}

function generateShoppingList(
  pantryItems: PantryItem[],
  usedIngredients: Set<string>,
  preferences: UserPreferences
): ShoppingCategory[] {
  const missingItems: ShoppingItem[] = [];
  
  // Essential items for Indian cooking that might be missing
  const essentials = [
    { name: 'toor dal', category: 'Pulses', cost: 80 },
    { name: 'rice', category: 'Grains', cost: 60 },
    { name: 'onions', category: 'Vegetables', cost: 40 },
    { name: 'tomatoes', category: 'Vegetables', cost: 50 },
    { name: 'curd', category: 'Dairy', cost: 30 },
    { name: 'cooking oil', category: 'Oil & Ghee', cost: 100 },
    { name: 'green coriander', category: 'Vegetables', cost: 20 }
  ];

  // Add items that are commonly needed but missing from pantry
  essentials.forEach(item => {
    if (!hasIngredient(pantryItems, item.name)) {
      missingItems.push({
        name: item.name,
        quantity: '500g',
        category: item.category,
        estimatedCost: `₹${item.cost}`
      });
    }
  });

  // Group by category
  const categories = new Map<string, { items: string[], totalCost: number }>();
  
  missingItems.forEach(item => {
    if (!categories.has(item.category)) {
      categories.set(item.category, { items: [], totalCost: 0 });
    }
    categories.get(item.category)!.items.push(`${item.name} (${item.quantity})`);
    categories.get(item.category)!.totalCost += parseInt(item.estimatedCost.replace('₹', ''));
  });

  return Array.from(categories.entries()).map(([category, data]) => ({
    category,
    items: data.items,
    cost: `₹${data.totalCost}`
  }));
}

export async function generateMealPlan(preferences: UserPreferences): Promise<MealPlan> {
  // Try AI-powered generation first
  try {
    const aiResult = await aiService.generateMealPlan(preferences);
    if (aiResult) {
      console.log('✅ Generated meal plan using AI:', aiService.getServiceStatus());
      return {
        ...aiResult,
        aiPowered: true
      };
    }
  } catch (error) {
    console.warn('AI generation failed, falling back to rule-based:', error);
  }

  // Fallback to rule-based generation
  console.log('📋 Using rule-based meal plan generation');
  return generateRuleBasedMealPlan(preferences);
}

function generateRuleBasedMealPlan(preferences: UserPreferences): MealPlan {
  const pantryItems = parsePantryList(preferences.pantryList);
  const usedIngredients = new Set<string>();
  
  // Generate weekly plan
  const weeklyPlan: Record<string, DayMeals> = {};
  
  DAYS.forEach(day => {
    weeklyPlan[day] = {
      breakfast: generateMealForSlot(pantryItems, 'breakfast', preferences, usedIngredients),
      lunch: generateMealForSlot(pantryItems, 'lunch', preferences, usedIngredients), 
      dinner: generateMealForSlot(pantryItems, 'dinner', preferences, usedIngredients)
    };
  });

  // Featured recipe - pick the most complex one from the week
  const allMeals = Object.values(weeklyPlan).flatMap(day => [day.breakfast, day.lunch, day.dinner]);
  const featuredRecipe = allMeals.reduce((best, current) => 
    current.steps.length > best.steps.length ? current : best
  );

  // Generate shopping list
  const shoppingList = generateShoppingList(pantryItems, usedIngredients, preferences);
  
  // Calculate totals
  const totalCost = shoppingList.reduce((sum, category) => 
    sum + parseInt(category.cost.replace('₹', '')), 0
  );

  // Calculate pantry utilization (how many pantry items were used)
  const pantryUtilization = Math.round((usedIngredients.size / Math.max(pantryItems.length, 1)) * 100);

  return {
    weeklyPlan,
    featuredRecipe: {
      ...featuredRecipe,
      servings: preferences.familySize
    },
    shoppingList,
    totalCost: `₹${totalCost}`,
    pantryUtilization,
    aiPowered: false
  };
}