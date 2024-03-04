import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import { usersRouter } from './routes/users'
import { mealsRouter } from './routes/meals'

let app = express()

app.use(express.json())
app.use(cookieParser())

app.use([usersRouter, mealsRouter])

app.listen(3333, () => {
  console.log('🚀 Server is listening on port 3333')
})
