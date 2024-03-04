import express from 'express'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '~/db/connection'
import { users, meals } from '~/db/schema'

let usersRouter = express.Router()

usersRouter.get('/users', async (_, res) => {
  let allUsers = await db.select().from(users)
  return res.status(200).json({ users: allUsers })
})

usersRouter.post('/users', async (req, res) => {
  let userSchema = z.object({
    email: z.string().email(),
  })

  try {
    let { email } = userSchema.parse(req.body)
    let [user] = await db.insert(users).values({ email }).returning()

    res.cookie('userId', user.id, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week in milliseconds
    })

    return res.status(201).json({ user })
  } catch (error) {
    if (error instanceof z.ZodError) {
      let flatten = error.flatten()
      return res.status(400).json({ error: flatten.fieldErrors })
    }

    return res.status(500).json({ error })
  }
})

usersRouter.get('/users/metrics', async (req, res) => {
  let cookieSchema = z.object({
    userId: z.coerce.number(),
  })

  try {
    let { userId } = cookieSchema.parse(req.cookies)

    let userMeals = await db
      .select({ isOnDiet: meals.isOnDiet })
      .from(meals)
      .where(eq(meals.userId, userId))

    if (!userMeals.length) throw `There are no meals for user ${userId}`

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
  } catch (error) {
    if (error instanceof z.ZodError) {
      let flatten = error.flatten()
      return res.status(400).json({ error: flatten.fieldErrors })
    }

    return res.status(500).json({ error })
  }
})

export { usersRouter }
