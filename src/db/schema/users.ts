import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

export let users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  email: text('email').unique(),
})
