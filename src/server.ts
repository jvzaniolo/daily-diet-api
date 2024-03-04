import 'dotenv/config'
import express from 'express'
import { db } from './db/connection'
import { users } from './db/schema'

let app = express()

app.use(express.json())

app.post('/users', async (req, res) => {
  let { email } = req.body
  let user = await db
    .insert(users)
    .values({
      email,
    })
    .returning()

  return res.status(201).json({ user: user[0] })
})

app.get('/users', async (_, res) => {
  let allUsers = await db.select().from(users)
  return res.status(200).json({ users: allUsers })
})

app.listen(3333, () => {
  console.log('Server is listening on port 3333')
})
