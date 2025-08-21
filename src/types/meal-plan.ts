export type Meal = {
  name: string
  recipe: string
  ingredients: string[]
  instructions: string[]
}

export type DayPlan = {
  day: string
  meals: Meal[]
}

export type NutritionDaily = {
  day: string
  calories?: number
  protein_g?: number
  carbs_g?: number
  fat_g?: number
}

export type MealPlan = {
  days: DayPlan[]
  grocery_list: {
    item: string
    quantity?: number
    unit?: string
    alternatives?: string[]
    aisle?: string
  }[]
  nutrition_summary?: {
    daily?: NutritionDaily[]
  }
}

export type PlanRequest = {
  ingredients: string[]
  dietary?: string[]
  calories?: number
  days: number
  mealsPerDay: number
}