import { eq } from 'drizzle-orm'
import express from 'express'
import { db } from '~/db/connection'
import { meals, users } from '~/db/schema'

let usersRouter = express.Router()

usersRouter.get('/users', async (_, res) => {
  let allUsers = await db.select().from(users)
  return res.status(200).json({ users: allUsers })
})

usersRouter.post('/users', async (req, res) => {
  let { email } = req.body
  let [user] = await db
    .insert(users)
    .values({
      email,
    })
    .returning()

  res.cookie('userId', user.id)

  return res.status(201).json({ user })
})

usersRouter.get('/users/metrics', async (req, res) => {
  let { userId } = req.cookies

  let userMeals = await db
    .select({ isOnDiet: meals.isOnDiet })
    .from(meals)
    .where(eq(meals.userId, Number(userId)))

  let userMealsOnDiet = userMeals.filter(({ isOnDiet }) => Boolean(isOnDiet))

  function findBestSequence(arr: typeof userMeals) {
    let currentSequence = 0
    let maxSequence = 0

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].isOnDiet === true) {
        currentSequence++
        if (currentSequence > maxSequence) {
          maxSequence = currentSequence
        }
      } else {
        currentSequence = 0
      }
    }

    return maxSequence
  }

  let metrics = {
    totalMeals: userMeals.length,
    totalMealsOnDiet: userMealsOnDiet.length,
    totalMealsOffDiet: userMeals.length - userMealsOnDiet.length,
    bestSequenceMealsOnDiet: findBestSequence(userMeals),
  }

  return res.status(200).json({ metrics })
})

export { usersRouter }
