import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { users } from './schema/users'
import { meals } from './schema/meals'

export let sql = new Database('sqlite.db')
export let db = drizzle(sql, { schema: { users, meals } })
