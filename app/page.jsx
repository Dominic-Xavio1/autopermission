import React from 'react';
import PassFlowApp from '@/src/components/PassFlowApp.jsx';
import { getPermissionRequests } from '@/src/actions/permissions.js';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const res = await getPermissionRequests();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultRequestDate = tomorrow.toISOString().split('T')[0];

  return (
    <PassFlowApp
      initialRequests={res.success && res.data ? res.data : []}
      defaultRequestDate={defaultRequestDate}
      initialError={res.success ? null : res.error || 'Unable to load requests.'}
    />
  );
}
