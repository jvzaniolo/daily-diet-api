import { pgTable, serial, text } from 'drizzle-orm/pg-core'

export let users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique(),
})
