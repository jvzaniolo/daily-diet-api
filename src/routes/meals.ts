import express, { type RequestHandler } from 'express'
import { z } from 'zod'
import { and, eq } from 'drizzle-orm'
import { db } from '~/db/connection'
import { meals } from '~/db/schema'

let mealsRouter = express.Router()

const validateUserId: RequestHandler = (req, res, next) => {
  let cookieSchema = z.object({
    userId: z.coerce.number(),
  })

  try {
    let { userId } = cookieSchema.parse(req.cookies)
    req.cookies.userId = userId
  } catch (error) {
    if (error instanceof z.ZodError) {
      let flatten = error.flatten()
      return res.status(401).json({ error: flatten.fieldErrors })
    }
    return res.sendStatus(500)
  }

  next()
}

mealsRouter.use(validateUserId)

mealsRouter.get('/meals/:id', async (req, res) => {
  let { userId } = req.cookies
  let { id: mealsId } = req.params

  let [meal] = await db
    .select()
    .from(meals)
    .where(and(eq(meals.userId, userId), eq(meals.id, Number(mealsId))))

  return res.status(200).json({ meal })
})

mealsRouter.get('/meals', async (req, res) => {
  let { userId } = req.cookies

  let allMeals = await db.select().from(meals).where(eq(meals.userId, userId))

  return res.status(200).json({ meals: allMeals })
})

mealsRouter.post('/meals', async (req, res) => {
  let createMealSchema = z.object({
    name: z.string(),
    isOnDiet: z.boolean(),
    description: z.string(),
    date: z.coerce.date(),
  })

  try {
    let { userId } = req.cookies
    let body = createMealSchema.parse(req.body)

    let [meal] = await db
      .insert(meals)
      .values({ userId, ...body })
      .returning()

    return res.status(201).json({ meal })
  } catch (error) {
    if (error instanceof z.ZodError) {
      let flatten = error.flatten()
      return res.status(400).json({ error: flatten.fieldErrors })
    }

    return res.sendStatus(500)
  }
})

mealsRouter.put('/meals/:id', async (req, res) => {
  let updateMealSchema = z.object({
    name: z.string().optional(),
    isOnDiet: z.boolean().optional(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
  })

  try {
    let { userId } = req.cookies
    let { id: mealId } = req.params
    let body = updateMealSchema.parse(req.body)

    let [meal] = await db
      .update(meals)
      .set(body)
      .where(and(eq(meals.id, Number(mealId)), eq(meals.userId, userId)))
      .returning()

    return res.status(200).json({ meal })
  } catch (error) {
    if (error instanceof z.ZodError) {
      let flatten = error.flatten()
      return res.status(400).json({ error: flatten.fieldErrors })
    }

    return res.sendStatus(500)
  }
})

mealsRouter.delete('/meals/:id', async (req, res) => {
  let { userId } = req.cookies
  let { id: mealId } = req.params

  await db
    .delete(meals)
    .where(and(eq(meals.id, Number(mealId)), eq(meals.userId, userId)))

  return res.sendStatus(200)
})

export { mealsRouter }
