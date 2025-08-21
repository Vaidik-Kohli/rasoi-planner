import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { z } from 'zod'
import OpenAI from 'openai'

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const PlanRequestSchema = z.object({
  ingredients: z.array(z.string()).min(1, 'Provide at least one ingredient'),
  dietary: z.array(z.string()).optional(),
  calories: z.number().int().positive().optional(),
  days: z.number().int().min(1).max(14),
  mealsPerDay: z.number().int().min(1).max(6)
})

const MealSchema = z.object({
  name: z.string(),
  recipe: z.string(),
  ingredients: z.array(z.string()).nonempty(),
  instructions: z.array(z.string()).nonempty()
})

const DayPlanSchema = z.object({
  day: z.string(),
  meals: z.array(MealSchema).nonempty()
})

const MealPlanSchema = z.object({
  days: z.array(DayPlanSchema).nonempty(),
  grocery_list: z.array(z.object({
    item: z.string(),
    quantity: z.number().optional(),
    unit: z.string().optional(),
    alternatives: z.array(z.string()).optional(),
    aisle: z.string().optional()
  })),
  nutrition_summary: z.object({
    daily: z.array(z.object({
      day: z.string(),
      calories: z.number().optional(),
      protein_g: z.number().optional(),
      carbs_g: z.number().optional(),
      fat_g: z.number().optional()
    })).optional()
  }).optional()
})

app.post('/api/ai/plan', async (req, res) => {
  const parse = PlanRequestSchema.safeParse(req.body)
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid request', details: parse.error.flatten() })
  }
  const { ingredients, dietary = [], calories, days, mealsPerDay } = parse.data

  const system = [
    'You are an expert Indian and global cuisine meal planning assistant.',
    'Generate diverse, practical, and flavorful meal plans with grocery lists.',
    'Respect dietary restrictions and ingredient availability.',
    'Avoid repetition across days unless it improves practicality.',
    'Output strictly valid JSON matching the provided schema.',
    'Prefer easy-to-find ingredients in Indian markets. Include vegetarian options if dietary says so.'
  ].join(' ')

  const userInstruction = `
You must produce ONLY a JSON object with this structure:
{
  "days": [
    {
      "day": "Monday",
      "meals": [
        {
          "name": "Dish name",
          "recipe": "Short description",
          "ingredients": ["item 1", "item 2"],
          "instructions": ["Step 1", "Step 2"]
        }
      ]
    }
  ],
  "grocery_list": [
    {"item": "Tomatoes", "quantity": 6, "unit": "pcs", "alternatives": ["Cherry tomatoes"], "aisle": "Produce"}
  ],
  "nutrition_summary": {
    "daily": [
      {"day": "Monday", "calories": 2100, "protein_g": 110, "carbs_g": 220, "fat_g": 70}
    ]
  }
}

Constraints:
- Use the provided ingredients primarily and fill gaps sensibly.
- Dietary restrictions: ${dietary.join(', ') || 'none'}.
- Target calories per day: ${calories ?? 'flexible'}.
- Number of days: ${days}.
- Meals per day: ${mealsPerDay}.
- Cuisine balance: Indian favorites + variety; keep prep practical.
- Use metric or common kitchen units; be consistent.

Available ingredients: ${ingredients.join(', ')}.
  `.trim()

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userInstruction }
      ]
    })

    const content = completion.choices?.[0]?.message?.content
    if (!content) {
      return res.status(502).json({ error: 'No content from model' })
    }

    let json: unknown
    try {
      json = JSON.parse(content)
    } catch {
      return res.status(502).json({ error: 'Model did not return valid JSON' })
    }

    const validated = MealPlanSchema.safeParse(json)
    if (!validated.success) {
      return res.status(502).json({ error: 'Model output failed validation', details: validated.error.flatten() })
    }

    return res.json(validated.data)
  } catch (err: unknown) {
    console.error(err)
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return res.status(500).json({ error: 'AI service error', details: errorMessage })
  }
})

const PORT = Number(process.env.PORT || 8787)
app.listen(PORT, () => {
  console.log(`AI server listening on http://localhost:${PORT}`)
})