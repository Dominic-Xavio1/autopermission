import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role').notNull(),
  department: text('department').notNull(),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const permissionRequests = pgTable('permission_requests', {
  id: serial('id').primaryKey(),
  teacherName: text('teacher_name').notNull(),
  teacherEmail: text('teacher_email').notNull(),
  department: text('department').notNull(),
  requestDate: text('request_date').notNull(),
  duration: text('duration').notNull(),
  category: text('category').notNull().default('Official Duty'),
  reason: text('reason').notNull(),
  status: text('status').notNull().default('pending'),
  reviewerName: text('reviewer_name'),
  reviewerRole: text('reviewer_role'),
  reviewerNote: text('reviewer_note'),
  reviewedAt: timestamp('reviewed_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  requests: many(permissionRequests),
}));

export const permissionRequestsRelations = relations(permissionRequests, ({ one }) => ({
  teacher: one(users, {
    fields: [permissionRequests.teacherEmail],
    references: [users.email],
  }),
}));
