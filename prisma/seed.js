const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

async function main() {
  const email = 'test@example.com'
  const password = 'password' // Plain text for prototype as per auth.ts logic

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'Test User',
      password,
      courses: {
        create: [
            {
                courseCode: "CS101",
                title: "Intro to CS",
                sections: {
                    create: [
                        { sectionNumber: "A", days: "Mon,Wed,Fri", startTime: "09:00", endTime: "10:00" }
                    ]
                }
            }
        ]
      }
    },
  })
  
  console.log({ user })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
