import express from 'express'
import { and, eq } from 'drizzle-orm'
import { db } from '~/db/connection'
import { meals } from '~/db/schema'

let mealsRouter = express.Router()

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
  let { userId } = req.cookies
  let { name, description, isOnDiet, date } = req.body
  let [meal] = await db
    .insert(meals)
    .values({
      name,
      isOnDiet,
      description,
      userId,
      date,
    })
    .returning()
  return res.status(201).json({ meal })
})

mealsRouter.put('/meals/:id', async (req, res) => {
  let { userId } = req.cookies
  let { id: mealId } = req.params
  let { name, description, isOnDiet, date } = req.body
  let [meal] = await db
    .update(meals)
    .set({
      name,
      description,
      isOnDiet,
      date,
    })
    .where(and(eq(meals.id, Number(mealId)), eq(meals.userId, userId)))
    .returning()
  return res.status(200).json({ meal })
})

mealsRouter.delete('/meals/:id', async (req, res) => {
  let { id: mealId } = req.params
  let { userId } = req.cookies
  await db
    .delete(meals)
    .where(and(eq(meals.id, Number(mealId)), eq(meals.userId, userId)))
  return res.sendStatus(200)
})

export { mealsRouter }
