const Database = require('better-sqlite3')
const path = require('path')
const bcrypt = require('bcryptjs')

const dbPath = path.join(__dirname, 'prisma', 'dev.db')
console.log(`Connecting to database at: ${dbPath}`)
const db = new Database(dbPath)

// Enable foreign keys
db.pragma('foreign_keys = ON')

// DDL: Create Tables matching schema.prisma
db.exec(`
  CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  );
  
  CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

  CREATE TABLE IF NOT EXISTS "Assignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" DATETIME NOT NULL,
    "weight" INTEGER NOT NULL,
    "estimatedHours" REAL NOT NULL,
    "priorityScore" REAL,
    "courseId" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS "Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "color" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS "Section" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sectionNumber" TEXT NOT NULL,
    "days" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "professor" TEXT,
    "location" TEXT,
    "courseId" TEXT NOT NULL,
    FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS "UserPreference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "avoidEarlyClasses" BOOLEAN NOT NULL DEFAULT false,
    "avoidLateClasses" BOOLEAN NOT NULL DEFAULT false,
    "maxDailyHours" INTEGER NOT NULL DEFAULT 8,
    "preferredDaysOff" TEXT,
    "userId" TEXT NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  );

  CREATE UNIQUE INDEX IF NOT EXISTS "UserPreference_userId_key" ON "UserPreference"("userId");
`)

console.log('Tables created or verified.')

// Seed Data

// Create User with hashed password
const userId = 'user_test_id'
const email = 'test@example.com'
const name = 'Test User'
const password = bcrypt.hashSync('password', 10)
const now = new Date().toISOString()

const insertUser = db.prepare(`
    INSERT OR REPLACE INTO User (id, email, name, password, createdAt, updatedAt) 
    VALUES (?, ?, ?, ?, ?, ?)
`)

insertUser.run(userId, email, name, password, now, now)

// Create Course
const courseId = 'course_cs101_id'
const courseCode = 'CS101'
const title = 'Intro to Computer Science'

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
