'use server';

import { db } from '../db/index.js';
import { permissionRequests, users } from '../db/schema.js';
import { desc, eq, and, or, ilike } from 'drizzle-orm';
import { emitRealtimeEvent } from '../lib/events.js';

async function safeRevalidate() {
  if (!process.env.NEXT_RUNTIME) return;
  try {
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/');
  } catch {
    // Revalidation context is only active inside Next.js server requests
  }
}

export async function getPermissionRequests(filters) {
  try {
    const conditions = [];

    if (filters?.status && filters.status !== 'all') {
      conditions.push(eq(permissionRequests.status, filters.status));
    }

    if (filters?.department && filters.department !== 'all') {
      conditions.push(eq(permissionRequests.department, filters.department));
    }

    if (filters?.search && filters.search.trim().length > 0) {
      const term = `%${filters.search.trim()}%`;
      conditions.push(
        or(
          ilike(permissionRequests.teacherName, term),
          ilike(permissionRequests.department, term),
          ilike(permissionRequests.reason, term),
          ilike(permissionRequests.category, term)
        )
      );
    }

    const query = db.select().from(permissionRequests);

    const results =
      conditions.length > 0
        ? await query.where(and(...conditions)).orderBy(desc(permissionRequests.createdAt))
        : await query.orderBy(desc(permissionRequests.createdAt));

    return { success: true, data: results };
  } catch (error) {
    console.error('Failed to fetch permission requests:', error);
    return {
      success: false,
      error: 'Unable to retrieve permission requests. Please try again later.',
    };
  }
}

export async function getMyRequests(teacherEmail) {
  try {
    if (!teacherEmail) {
      return { success: false, error: 'Teacher email is required.' };
    }

    const results = await db
      .select()
      .from(permissionRequests)
      .where(eq(permissionRequests.teacherEmail, teacherEmail))
      .orderBy(desc(permissionRequests.createdAt));

    return { success: true, data: results };
  } catch (error) {
    console.error('Failed to fetch teacher requests:', error);
    return {
      success: false,
      error: 'Failed to load your permission requests.',
    };
  }
}

export async function getDashboardStats() {
  try {
    const all = await db.select().from(permissionRequests);
    const stats = {
      total: all.length,
      pending: all.filter((r) => r.status === 'pending').length,
      approved: all.filter((r) => r.status === 'approved').length,
      rejected: all.filter((r) => r.status === 'rejected').length,
    };
    return { success: true, data: stats };
  } catch (error) {
    console.error('Failed to get dashboard stats:', error);
    return {
      success: false,
      error: 'Failed to calculate analytics statistics.',
    };
  }
}

export async function createPermissionRequest(input) {
  try {
    if (
      !input.teacherName ||
      !input.teacherEmail ||
      !input.department ||
      !input.requestDate ||
      !input.duration ||
      !input.reason
    ) {
      return { success: false, error: 'All required fields must be completed.' };
    }

    const [created] = await db
      .insert(permissionRequests)
      .values({
        teacherName: input.teacherName.trim(),
        teacherEmail: input.teacherEmail.trim().toLowerCase(),
        department: input.department.trim(),
        requestDate: input.requestDate,
        duration: input.duration,
        category: input.category || 'Official Duty',
        reason: input.reason.trim(),
        status: 'pending',
      })
      .returning();

    emitRealtimeEvent('NEW_REQUEST', created);

    await safeRevalidate();
    return { success: true, data: created };
  } catch (error) {
    console.error('Failed to create permission request:', error);
    return {
      success: false,
      error: 'Failed to submit permission request. Please check your data and try again.',
    };
  }
}

export async function updateRequestStatus(id, status, reviewerName, reviewerRole, reviewerNote) {
  try {
    const [updated] = await db
      .update(permissionRequests)
      .set({
        status,
        reviewerName,
        reviewerRole,
        reviewerNote:
          reviewerNote?.trim() ||
          (status === 'approved' ? 'Approved by administration.' : 'Declined by administration.'),
        reviewedAt: new Date(),
      })
      .where(eq(permissionRequests.id, id))
      .returning();

    if (!updated) {
      return { success: false, error: 'Permission request not found.' };
    }

    emitRealtimeEvent('STATUS_CHANGED', updated);

    await safeRevalidate();
    return { success: true, data: updated };
  } catch (error) {
    console.error('Failed to update request status:', error);
    return {
      success: false,
      error: 'Failed to update request decision.',
    };
  }
}

export async function deletePermissionRequest(id) {
  try {
    await db.delete(permissionRequests).where(eq(permissionRequests.id, id));
    emitRealtimeEvent('REQUEST_DELETED', { id });
    await safeRevalidate();
    return { success: true, data: true };
  } catch (error) {
    console.error('Failed to delete permission request:', error);
    return { success: false, error: 'Failed to remove permission request.' };
  }
}

export async function getUsers() {
  try {
    const list = await db.select().from(users);
    return { success: true, data: list };
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return { success: false, error: 'Failed to load school staff list.' };
  }
}
