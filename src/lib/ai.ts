import type { MealPlan, PlanRequest } from '../types/meal-plan'

export async function generateMealPlan(req: PlanRequest): Promise<MealPlan> {
  const res = await fetch('/api/ai/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string })?.error || 'Failed to generate plan')
  }
  return res.json()
}