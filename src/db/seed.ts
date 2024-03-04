import { db, sql } from './connection'
import { users, meals } from './schema'

async function seed() {
  try {
    console.log('Seeding database...')
    await Promise.all([db.delete(users), db.delete(meals)])

    await db.insert(users).values([
      {
        id: 1,
        email: 'john.doe@example.com',
      },
      {
        id: 2,
        email: 'jane.doe@example.com',
      },
    ])

    await db.insert(meals).values([
      {
        id: 1,
        date: new Date('2024-02-01:00:00'),
        name: 'Beef tacos',
        description: 'I ate beef tacos for lunch',
        isOnDiet: false,
        userId: 1,
      },
      {
        id: 2,
        date: new Date('2024-02-02:00:00'),
        name: 'Veggie burger',
        description: 'This one was a little odd',
        isOnDiet: true,
        userId: 1,
      },
      {
        id: 3,
        date: new Date('2024-02-03:00:00'),
        name: 'Chicken salad',
        description: 'I had a chicken salad for lunch',
        isOnDiet: true,
        userId: 2,
      },
      {
        id: 4,
        date: new Date('2024-02-04:00:00'),
        name: 'Pasta',
        description: 'I had a pasta for dinner',
        isOnDiet: false,
        userId: 2,
      },
    ])
    console.log('Database seeded')
  } catch (error) {
    console.log(error)
  }
}

seed().then(() => {
  sql.close()
})
