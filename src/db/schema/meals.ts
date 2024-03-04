import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'
import { users } from './users'

export let meals = sqliteTable('meals', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  isOnDiet: integer('is_on_diet', { mode: 'boolean' }).notNull(),
  date: integer('date', { mode: 'timestamp_ms' }).notNull(),
  userId: integer('user_id')
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull(),
})
