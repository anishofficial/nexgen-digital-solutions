// Automated API and Security Verification Script for NexGen Studio

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const adminEmail = process.env.VERIFY_ADMIN_EMAIL;
const adminPassword = process.env.VERIFY_ADMIN_PASSWORD;

if (!adminEmail || !adminPassword) {
  console.log('⚠️  Notice: Set VERIFY_ADMIN_EMAIL and VERIFY_ADMIN_PASSWORD before running API verification.');
}

async function runTests() {
  console.log('🧪 Starting NexGen Studio API & Security Verification Tests...\n');
  let testsPassed = 0;
  let testsFailed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      testsPassed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      testsFailed++;
    }
  }

  try {
    // 1. Health Probe
    console.log('--- Test 1: GET /health and /api/health ---');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200, 'Health endpoint returns HTTP 200');
    assert(healthData.status === 'ok', 'Health status is ok');

    const apiHealthRes = await fetch(`${BASE_URL}/api/health`);
    const apiHealthData = await apiHealthRes.json();
    assert(apiHealthRes.status === 200, 'API Health endpoint returns HTTP 200');
    assert(apiHealthData.status === 'ok', 'API Health status is ok');

    // 2. Public Inquiry Submission
    console.log('\n--- Test 2: POST /api/inquiries ---');
    const inquiryPayload = {
      name: 'Dr. Marcus Vance',
      email: 'm.vance@stratasystems.io',
      company: 'Strata Systems',
      services: ['Full Stack Web Development', 'Back End Development'],
      budget: '$25,000+',
      timeline: 'Within 4 weeks',
      message: 'We require a scalable web application for geospatial telemetry with real-time WebSocket feeds.',
    };

    const inqRes = await fetch(`${BASE_URL}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryPayload),
    });
    const inqData = await inqRes.json();
    assert(inqRes.status === 201, 'Inquiry submission returns HTTP 201 Created');
    assert(inqData.success === true, 'Inquiry response success is true');
    assert(Boolean(inqData.data?.inquiryId), `Generated Inquiry ID: ${inqData.data?.inquiryId}`);

    const createdInquiryId = inqData.data?.inquiryId;

    // 3. Unauthorized access rejection
    console.log('\n--- Test 3: Unauthenticated Protected Endpoint ---');
    const unauthRes = await fetch(`${BASE_URL}/api/admin/inquiries`);
    const unauthData = await unauthRes.json();
    assert(unauthRes.status === 401, 'GET /api/admin/inquiries without token returns 401 Unauthorized');
    assert(unauthData.success === false, 'Unauthorized response indicates failure');

    // 4. Invalid Token rejection
    console.log('\n--- Test 4: Invalid JWT Bearer Token ---');
    const badTokenRes = await fetch(`${BASE_URL}/api/admin/metrics`, {
      headers: { 'Authorization': 'Bearer fake_invalid_jwt_token_12345' },
    });
    assert(badTokenRes.status === 401, 'GET /api/admin/metrics with invalid token returns 401 Unauthorized');

    // 5. Estimate save
    console.log('\n--- Test 5: POST /api/estimates ---');
    const estRes = await fetch(`${BASE_URL}/api/estimates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productType: 'Full Stack Web App',
        scope: 'Enterprise MVP',
        features: ['UI/UX Design Sprint', 'Custom Backend API'],
        timeline: '4 weeks',
        estimatedCost: '$18,500',
      }),
    });
    const estData = await estRes.json();
    assert(estRes.status === 201, 'Estimate generated with HTTP 201');
    assert(Boolean(estData.data?.referenceCode), `Reference Code: ${estData.data?.referenceCode}`);

    // 6. Newsletter Subscribe
    console.log('\n--- Test 6: POST /api/newsletter/subscribe ---');
    const newsRes = await fetch(`${BASE_URL}/api/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: `subscriber_${Date.now()}@example.com` }),
    });
    const newsData = await newsRes.json();
    assert(newsRes.status === 201, 'Newsletter subscription returns HTTP 201');
    assert(newsData.success === true, 'Newsletter subscription successful');

    // Authenticated Admin Tests
    if (adminEmail && adminPassword) {
      // 7. Admin Login with invalid credentials
      console.log('\n--- Test 7: Admin Login with Wrong Password ---');
      const badLoginRes = await fetch(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: 'wrong_incorrect_password' }),
      });
      assert(badLoginRes.status === 401, 'Login with incorrect password returns 401');

      // 8. Admin Login with valid credentials
      console.log('\n--- Test 8: Admin Login with Environment Credentials ---');
      const goodLoginRes = await fetch(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });
      const goodLoginData = await goodLoginRes.json();
      assert(goodLoginRes.status === 200, 'Login with valid credentials returns 200 OK');
      assert(Boolean(goodLoginData.token), 'JWT Token returned');
      assert(Boolean(goodLoginData.user?.role), 'User profile returned with role');

      const authToken = goodLoginData.token;

      // 9. Get Admin Inquiries with JWT
      console.log('\n--- Test 9: GET /api/admin/inquiries with valid JWT ---');
      const adminInqRes = await fetch(`${BASE_URL}/api/admin/inquiries`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      const adminInqData = await adminInqRes.json();
      assert(adminInqRes.status === 200, 'GET /api/admin/inquiries returns 200 OK');
      assert(Array.isArray(adminInqData.data), `Fetched ${adminInqData.data?.length || 0} inquiries from SQLite`);

      // 10. Update Inquiry Status & Internal Notes
      if (createdInquiryId) {
        console.log('\n--- Test 10: PATCH /api/admin/inquiries/:id ---');
        const updateRes = await fetch(`${BASE_URL}/api/admin/inquiries/${createdInquiryId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            status: 'scoping',
            internal_notes: 'Senior architect reviewed brief. Preparing discovery call agenda.',
          }),
        });
        const updateData = await updateRes.json();
        assert(updateRes.status === 200, 'Update inquiry returns 200 OK');
        assert(updateData.data?.status === 'scoping', 'Inquiry status updated to scoping');
      }

      // 11. Get Dashboard Metrics with JWT
      console.log('\n--- Test 11: GET /api/admin/metrics with valid JWT ---');
      const metricsRes = await fetch(`${BASE_URL}/api/admin/metrics`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      const metricsData = await metricsRes.json();
      assert(metricsRes.status === 200, 'GET /api/admin/metrics returns 200 OK');
      assert(typeof metricsData.data?.totalInquiries === 'number', `Total Inquiries: ${metricsData.data?.totalInquiries}`);
    } else {
      console.log('\nℹ️  Skipping authenticated admin tests (VERIFY_ADMIN_EMAIL and VERIFY_ADMIN_PASSWORD not set).');
    }

    // 12. User Authentication: Registration & Smart Auto-switch Tests
    console.log('\n--- Test 12: User Client Registration & Authentication Flow ---');
    const testUserEmail = `client_${Date.now()}@example.com`;
    const testUserPass = 'ClientSecurePass99!';

    // Step A: Attempt login before account exists -> Should return 404 USER_NOT_FOUND
    const nonExistRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUserEmail, password: testUserPass }),
    });
    const nonExistData = await nonExistRes.json();
    assert(nonExistRes.status === 404, 'Unregistered user login returns 404 Not Found');
    assert(nonExistData.code === 'USER_NOT_FOUND', 'Response code is USER_NOT_FOUND to enable smart UI switch');

    // Step B: Register user
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUserEmail, password: testUserPass, name: 'Test Client' }),
    });
    const regData = await regRes.json();
    assert(regRes.status === 201, 'User registration returns 201 Created');
    assert(regData.success === true, 'User registration returns success = true');
    assert(Boolean(regData.token), 'Registration returns valid JWT token');

    // Step C: Attempt duplicate registration -> Should return 409 Conflict
    const dupRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUserEmail, password: testUserPass }),
    });
    assert(dupRes.status === 409, 'Duplicate user registration returns 409 Conflict');

    // Step D: Login registered user
    const userLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUserEmail, password: testUserPass }),
    });
    const userLoginData = await userLoginRes.json();
    assert(userLoginRes.status === 200, 'Registered user login returns 200 OK');
    assert(userLoginData.user?.email === testUserEmail, 'User email matches profile in response');

    // Step E: Verify /api/auth/me
    const userMeRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${userLoginData.token}` },
    });
    const userMeData = await userMeRes.json();
    assert(userMeRes.status === 200, 'GET /api/auth/me returns 200 OK');
    assert(userMeData.user?.role === 'user', 'Authenticated client role is user');

    console.log('\n=============================================');
    console.log(`🎉 API TESTS COMPLETE!`);
    console.log(`Passed: ${testsPassed} | Failed: ${testsFailed}`);
    console.log('=============================================');

    process.exit(testsFailed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runTests();

