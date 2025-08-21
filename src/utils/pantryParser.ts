export interface PantryItem {
  name: string;
  quantity: number;
  unit: string;
  category: 'grain' | 'vegetable' | 'spice' | 'dairy' | 'protein' | 'oil' | 'other';
}

export interface UserPreferences {
  pantryList: string;
  cuisine: string;
  familySize: number;
  spiceLevel: number;
  timeConstraint: string;
  dietType: string;
}

// Common Indian ingredient mappings
const INGREDIENT_MAPPINGS: Record<string, { category: PantryItem['category'], standardName: string }> = {
  // Grains & Flours
  'atta': { category: 'grain', standardName: 'wheat flour' },
  'wheat flour': { category: 'grain', standardName: 'wheat flour' },
  'rice': { category: 'grain', standardName: 'rice' },
  'basmati rice': { category: 'grain', standardName: 'basmati rice' },
  'jeera rice': { category: 'grain', standardName: 'rice' },
  'besan': { category: 'grain', standardName: 'gram flour' },
  'rava': { category: 'grain', standardName: 'semolina' },
  'sooji': { category: 'grain', standardName: 'semolina' },
  
  // Vegetables
  'aloo': { category: 'vegetable', standardName: 'potato' },
  'potato': { category: 'vegetable', standardName: 'potato' },
  'onion': { category: 'vegetable', standardName: 'onion' },
  'pyaz': { category: 'vegetable', standardName: 'onion' },
  'tomato': { category: 'vegetable', standardName: 'tomato' },
  'tamatar': { category: 'vegetable', standardName: 'tomato' },
  'palak': { category: 'vegetable', standardName: 'spinach' },
  'spinach': { category: 'vegetable', standardName: 'spinach' },
  'bhindi': { category: 'vegetable', standardName: 'okra' },
  'okra': { category: 'vegetable', standardName: 'okra' },
  'gobhi': { category: 'vegetable', standardName: 'cauliflower' },
  'cauliflower': { category: 'vegetable', standardName: 'cauliflower' },
  'green chili': { category: 'vegetable', standardName: 'green chili' },
  'hari mirch': { category: 'vegetable', standardName: 'green chili' },
  'ginger': { category: 'vegetable', standardName: 'ginger' },
  'adrak': { category: 'vegetable', standardName: 'ginger' },
  'garlic': { category: 'vegetable', standardName: 'garlic' },
  'lehsun': { category: 'vegetable', standardName: 'garlic' },
  
  // Proteins/Pulses
  'moong dal': { category: 'protein', standardName: 'moong dal' },
  'toor dal': { category: 'protein', standardName: 'toor dal' },
  'arhar dal': { category: 'protein', standardName: 'toor dal' },
  'chana dal': { category: 'protein', standardName: 'chana dal' },
  'masoor dal': { category: 'protein', standardName: 'masoor dal' },
  'urad dal': { category: 'protein', standardName: 'urad dal' },
  'rajma': { category: 'protein', standardName: 'kidney beans' },
  'chole': { category: 'protein', standardName: 'chickpeas' },
  'paneer': { category: 'protein', standardName: 'paneer' },
  
  // Dairy
  'curd': { category: 'dairy', standardName: 'curd' },
  'dahi': { category: 'dairy', standardName: 'curd' },
  'milk': { category: 'dairy', standardName: 'milk' },
  'doodh': { category: 'dairy', standardName: 'milk' },
  'ghee': { category: 'dairy', standardName: 'ghee' },
  
  // Oils
  'oil': { category: 'oil', standardName: 'cooking oil' },
  'mustard oil': { category: 'oil', standardName: 'mustard oil' },
  'coconut oil': { category: 'oil', standardName: 'coconut oil' },
  
  // Spices (basic spices covers many)
  'basic spices': { category: 'spice', standardName: 'basic spices' },
  'turmeric': { category: 'spice', standardName: 'turmeric' },
  'haldi': { category: 'spice', standardName: 'turmeric' },
  'cumin': { category: 'spice', standardName: 'cumin seeds' },
  'jeera': { category: 'spice', standardName: 'cumin seeds' },
  'coriander': { category: 'spice', standardName: 'coriander seeds' },
  'dhania': { category: 'spice', standardName: 'coriander seeds' },
  'mustard seeds': { category: 'spice', standardName: 'mustard seeds' },
  'rai': { category: 'spice', standardName: 'mustard seeds' },
  'red chili powder': { category: 'spice', standardName: 'red chili powder' },
  'garam masala': { category: 'spice', standardName: 'garam masala' },
  'salt': { category: 'spice', standardName: 'salt' },
  'namak': { category: 'spice', standardName: 'salt' }
};

export function parsePantryList(pantryText: string): PantryItem[] {
  const items: PantryItem[] = [];
  
  // Split by commas and clean up
  const rawItems = pantryText.toLowerCase()
    .split(/[,\n]/)
    .map(item => item.trim())
    .filter(item => item.length > 0);
  
  for (const rawItem of rawItems) {
    // Try to extract quantity and unit
    const quantityMatch = rawItem.match(/(\d+(?:\.\d+)?)\s*(kg|g|l|ml|cup|cups|tbsp|tsp|piece|pieces)?\s*(.*)/);
    
    let quantity = 1;
    let unit = 'piece';
    let ingredientName = rawItem;
    
    if (quantityMatch) {
      quantity = parseFloat(quantityMatch[1]);
      unit = quantityMatch[2] || 'piece';
      ingredientName = quantityMatch[3].trim();
    }
    
    // Handle "basic spices" specially - it represents common spices
    if (ingredientName.includes('basic spices') || ingredientName.includes('spices')) {
      // Add individual basic spices
      const basicSpices = ['turmeric', 'cumin seeds', 'coriander seeds', 'red chili powder', 'salt'];
      basicSpices.forEach(spice => {
        const mapping = INGREDIENT_MAPPINGS[spice];
        if (mapping) {
          items.push({
            name: mapping.standardName,
            quantity: 1,
            unit: 'tsp',
            category: mapping.category
          });
        }
      });
      continue;
    }
    
    // Find ingredient mapping
    const mapping = INGREDIENT_MAPPINGS[ingredientName];
    if (mapping) {
      items.push({
        name: mapping.standardName,
        quantity,
        unit,
        category: mapping.category
      });
    } else {
      // If no mapping found, try to guess category
      let category: PantryItem['category'] = 'other';
      if (ingredientName.includes('dal') || ingredientName.includes('bean')) {
        category = 'protein';
      } else if (ingredientName.includes('flour') || ingredientName.includes('rice')) {
        category = 'grain';
      }
      
      items.push({
        name: ingredientName,
        quantity,
        unit,
        category
      });
    }
  }
  
  return items;
}

export function getAvailableIngredients(pantryItems: PantryItem[]): string[] {
  return pantryItems.map(item => item.name);
}

export function hasIngredient(pantryItems: PantryItem[], ingredientName: string): boolean {
  return pantryItems.some(item => 
    item.name.toLowerCase().includes(ingredientName.toLowerCase()) ||
    ingredientName.toLowerCase().includes(item.name.toLowerCase())
  );
}

export function getIngredientQuantity(pantryItems: PantryItem[], ingredientName: string): { quantity: number, unit: string } | null {
  const item = pantryItems.find(item => 
    item.name.toLowerCase().includes(ingredientName.toLowerCase()) ||
    ingredientName.toLowerCase().includes(item.name.toLowerCase())
  );
  return item ? { quantity: item.quantity, unit: item.unit } : null;
}