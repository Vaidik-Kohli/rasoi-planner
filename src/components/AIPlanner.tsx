import React, { useState } from 'react'
import { generateMealPlan } from '../lib/ai'
import type { MealPlan } from '../types/meal-plan'

export default function AIPlanner() {
  const [ingredientsText, setIngredientsText] = useState('')
  const [dietaryText, setDietaryText] = useState('')
  const [days, setDays] = useState(7)
  const [mealsPerDay, setMealsPerDay] = useState(3)
  const [calories, setCalories] = useState<number | ''>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [plan, setPlan] = useState<MealPlan | null>(null)

  const onGenerate = async () => {
    setError(null)
    setPlan(null)
    setLoading(true)
    try {
      const ingredients = ingredientsText.split('\n').map(s => s.trim()).filter(Boolean)
      const dietary = dietaryText.split(',').map(s => s.trim()).filter(Boolean)
      const result = await generateMealPlan({
        ingredients,
        dietary,
        days,
        mealsPerDay,
        calories: calories === '' ? undefined : Number(calories)
      })
      setPlan(result)
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to generate plan'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">AI Meal Planner</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="font-medium">Ingredients on hand (one per line)</label>
          <textarea
            className="w-full h-40 rounded border p-3"
            value={ingredientsText}
            onChange={e => setIngredientsText(e.target.value)}
            placeholder={`rice\ntomatoes\nonions\npaneer\nchicken`}
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium">Dietary preferences (comma-separated)</label>
          <input
            className="w-full rounded border p-3"
            value={dietaryText}
            onChange={e => setDietaryText(e.target.value)}
            placeholder="vegetarian, high protein, no nuts"
          />
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-medium">Days</label>
              <input
                type="number"
                min={1}
                max={14}
                className="w-full rounded border p-2"
                value={days}
                onChange={e => setDays(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium">Meals/day</label>
              <input
                type="number"
                min={1}
                max={6}
                className="w-full rounded border p-2"
                value={mealsPerDay}
                onChange={e => setMealsPerDay(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium">Calories/day (optional)</label>
              <input
                type="number"
                className="w-full rounded border p-2"
                value={calories}
                onChange={e => setCalories(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
          </div>

          <button
            className="mt-3 inline-flex items-center rounded bg-black text-white px-4 py-2 disabled:opacity-50"
            disabled={loading}
            onClick={onGenerate}
          >
            {loading ? 'Planning…' : 'Generate plan'}
          </button>

          {error && (
            <p className="text-red-600 mt-2">{error}</p>
          )}
        </div>
      </div>

      {plan && <PlanResult plan={plan} />}
    </div>
  )
}

function PlanResult({ plan }: { plan: MealPlan }) {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-semibold">Plan</h2>
        <div className="mt-3 space-y-4">
          {plan.days.map((d, i) => (
            <div key={i} className="rounded border p-4">
              <h3 className="font-semibold">{d.day}</h3>
              <div className="mt-2 space-y-3">
                {d.meals.map((m, j) => (
                  <div key={j} className="rounded bg-gray-50 p-3">
                    <div className="font-medium">{m.name}</div>
                    <div className="text-sm text-gray-700">{m.recipe}</div>
                    <div className="mt-2">
                      <div className="text-sm font-medium">Ingredients</div>
                      <ul className="list-disc ml-6 text-sm">
                        {m.ingredients.map((ing, k) => <li key={k}>{ing}</li>)}
                      </ul>
                    </div>
                    <div className="mt-2">
                      <div className="text-sm font-medium">Instructions</div>
                      <ol className="list-decimal ml-6 text-sm space-y-1">
                        {m.instructions.map((step, k) => <li key={k}>{step}</li>)}
                      </ol>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Grocery list</h2>
        <ul className="mt-2 list-disc ml-6">
          {plan.grocery_list.map((g, i) => (
            <li key={i}>
              {g.item}
              {g.quantity ? ` — ${g.quantity}` : ''}{g.unit ? ` ${g.unit}` : ''}
              {g.alternatives?.length ? ` (alternatives: ${g.alternatives.join(', ')})` : ''}
              {g.aisle ? ` — ${g.aisle}` : ''}
            </li>
          ))}
        </ul>
      </section>

      {plan.nutrition_summary?.daily && (
        <section>
          <h2 className="text-xl font-semibold">Nutrition summary</h2>
          <div className="mt-2 grid gap-3 md:grid-cols-2">
            {plan.nutrition_summary.daily.map((n, i) => (
              <div key={i} className="rounded border p-3 text-sm">
                <div className="font-medium">{n.day}</div>
                <div>Calories: {n.calories ?? '—'}</div>
                <div>Protein: {n.protein_g ?? '—'} g</div>
                <div>Carbs: {n.carbs_g ?? '—'} g</div>
                <div>Fat: {n.fat_g ?? '—'} g</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}