import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

export let users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  email: text('email').unique(),
})

export let meals = sqliteTable('meals', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  isOnDiet: integer('is_on_diet', { mode: 'boolean' }).notNull(),
  date: integer('date', { mode: 'timestamp' }),
  userId: integer('user_id')
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull(),
})
