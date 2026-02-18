const Database = require('better-sqlite3')
const db = new Database('dev.db')

// Enable foreign keys
db.pragma('foreign_keys = ON')

// Create User
const userId = 'user_test_id'
const email = 'test@example.com'
const name = 'Test User'
const password = 'password' // Plain text per auth.ts
const now = new Date().toISOString()

// Upsert User
const insertUser = db.prepare(`
    INSERT OR REPLACE INTO User (id, email, name, password, createdAt, updatedAt) 
    VALUES (?, ?, ?, ?, ?, ?)
`)

insertUser.run(userId, email, name, password, now, now)

// Create Course
const courseId = 'course_cs101_id'
const courseCode = 'CS101'
const title = 'Intro to CS'

const insertCourse = db.prepare(`
    INSERT OR REPLACE INTO Course (id, courseCode, title, userId, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
`)

insertCourse.run(courseId, courseCode, title, userId, now, now)

// Create Section
const sectionId = 'section_a_id'
const sectionNumber = 'A'
const days = 'Mon,Wed,Fri'
const startTime = '09:00'
const endTime = '10:00'

const insertSection = db.prepare(`
    INSERT OR REPLACE INTO Section (id, sectionNumber, days, startTime, endTime, courseId)
    VALUES (?, ?, ?, ?, ?, ?)
`)

insertSection.run(sectionId, sectionNumber, days, startTime, endTime, courseId)

console.log('Database seeded successfully via direct SQLite!')
db.close()
