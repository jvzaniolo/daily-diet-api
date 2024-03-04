import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'

export let sql = new Database('sqlite.db')
export let db = drizzle(sql, { schema })
