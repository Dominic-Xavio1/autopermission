import {
  getPermissionRequests,
  createPermissionRequest,
  updateRequestStatus,
  deletePermissionRequest,
  getDashboardStats,
  getMyRequests,
} from '../src/actions/permissions.js';

async function runRegressionTests() {
  console.log('Starting ASYV PassFlow Regressional Test Suite (Pure JavaScript)...');

  // 1. Test Initial Fetch
  console.log('Test 1: Fetching all permission requests from PostgreSQL...');
  const initialFetch = await getPermissionRequests();
  if (!initialFetch.success || !initialFetch.data) {
    throw new Error(`Test 1 Failed: ${initialFetch.error}`);
  }
  console.log(`Test 1 Passed: Retrieved ${initialFetch.data.length} records from PostgreSQL.`);

  // 2. Test Dashboard Stats
  console.log('Test 2: Calculating analytics counters...');
  const stats = await getDashboardStats();
  if (!stats.success || !stats.data) {
    throw new Error(`Test 2 Failed: ${stats.error}`);
  }
  console.log(
    `Test 2 Passed: Stats => Total: ${stats.data.total}, Pending: ${stats.data.pending}, Approved: ${stats.data.approved}, Rejected: ${stats.data.rejected}`
  );

  // 3. Test Create Request (Teacher Flow)
  console.log('Test 3: Creating a test permission request for Jean-Paul Mugabo...');
  const createRes = await createPermissionRequest({
    teacherName: 'Jean-Paul Mugabo',
    teacherEmail: 'jp.mugabo@asyv.ac.rw',
    department: 'STEM & Sciences',
    requestDate: '2026-11-25',
    duration: 'Full Day (1 Day)',
    category: 'Academic Field Trip',
    reason: 'Regression Test: Escorting 12 students to Kigali Tech Innovation Summit.',
  });

  if (!createRes.success || !createRes.data) {
    throw new Error(`Test 3 Failed: ${createRes.error}`);
  }
  const testId = createRes.data.id;
  console.log(`Test 3 Passed: Successfully inserted request #${testId} with status="${createRes.data.status}".`);

  // 4. Test Teacher Specific Fetch
  console.log('Test 4: Verifying teacher specific filtering for jp.mugabo@asyv.ac.rw...');
  const teacherFetch = await getMyRequests('jp.mugabo@asyv.ac.rw');
  if (!teacherFetch.success || !teacherFetch.data) {
    throw new Error(`Test 4 Failed: ${teacherFetch.error}`);
  }
  const hasInserted = teacherFetch.data.some((r) => r.id === testId);
  if (!hasInserted) {
    throw new Error('Test 4 Failed: Newly inserted request not found in teacher requests.');
  }
  console.log(`Test 4 Passed: Found test request #${testId} in teacher inbox.`);

  // 5. Test Approval (Admin Flow)
  console.log(`Test 5: Testing Admin Approval flow on request #${testId}...`);
  const approveRes = await updateRequestStatus(
    testId,
    'approved',
    'Innocent Nkurunziza',
    'Principal',
    'Regression Test: Approved with campus clearance.'
  );
  if (!approveRes.success || !approveRes.data || approveRes.data.status !== 'approved') {
    throw new Error(`Test 5 Failed: ${approveRes.error}`);
  }
  console.log(`Test 5 Passed: Request status successfully updated to 'approved' by ${approveRes.data.reviewerName}.`);

  // 6. Test Search and Filter
  console.log('Test 6: Testing dynamic search query ("Kigali Tech")...');
  const searchRes = await getPermissionRequests({ search: 'Kigali Tech' });
  if (!searchRes.success || !searchRes.data || !searchRes.data.some((r) => r.id === testId)) {
    throw new Error('Test 6 Failed: Search query did not match inserted request.');
  }
  console.log(`Test 6 Passed: Dynamic search returned ${searchRes.data.length} match(es).`);

  // 7. Cleanup Test Record
  console.log(`Test 7: Cleaning up test record #${testId}...`);
  const deleteRes = await deletePermissionRequest(testId);
  if (!deleteRes.success) {
    throw new Error(`Test 7 Failed: ${deleteRes.error}`);
  }
  console.log(`Test 7 Passed: Test record #${testId} successfully cleaned up.`);

  console.log('\nALL REGRESSION TESTS PASSED! Application is production ready.');
  process.exit(0);
}

runRegressionTests().catch((err) => {
  console.error('Regression test failure:', err);
  process.exit(1);
});
