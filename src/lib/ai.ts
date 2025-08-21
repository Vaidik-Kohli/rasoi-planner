import type { MealPlan, PlanRequest } from '../types/meal-plan'

export async function generateMealPlan(req: PlanRequest): Promise<MealPlan> {
  const res = await fetch('/api/ai/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({} as any))
    throw new Error(err?.error || 'Failed to generate plan')
  }
  return res.json()
}