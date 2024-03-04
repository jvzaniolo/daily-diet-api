import 'dotenv/config'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { db, sql } from './connection'

migrate(db, { migrationsFolder: './drizzle' })

sql.close()
