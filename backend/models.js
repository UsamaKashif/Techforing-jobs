import { integer, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

export const User = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  email: varchar("email", { length: 255 }),
  password: varchar("password", { length: 255 }),
});

export const Job = pgTable("jobs", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }),
  description: varchar("description", { length: 1000 }),
  userId: integer("userId").references(() => User.id),
  category: varchar("category", { length: 255 }),
  job_type: varchar("job_type", { length: 255 }),
  location: varchar("location", { length: 255 }),
  salary: varchar("salary", { length: 255 }),
  createdAt: timestamp().defaultNow(),
});
