/**
 * Run with: node test-crud.js
 * Make sure the server is running first: npm start
 */
const BASE = 'http://localhost:3000';

const exampleData = {
  id: "1",
  masjidName: "Baitul Mukarram Mosque",
  area: "Dhaka",
  areaDetail: "Paltan, near GPO",
  date: "2026-03-15",
  items: ["kacchibiriyani"],
  phone: "+8801712345678",
  mapLink: "https://www.google.com/maps?q=23.7315,90.4113",
  createdBy: "user1",
  createdByEmail: "user1@example.com",
  roleAtCreation: "user",
  likes: ["user1@example.com", "user2@example.com"],
  status: "approved"
};

async function request(method, url, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data };
}

async function run() {
  console.log('--- CRUD test (server must be running on port 3000) ---\n');

  // 1. GET all
  let r = await request('GET', `${BASE}/ifterspot`);
  console.log('GET /ifterspot (all):', r.status, r.status === 200 ? 'OK' : r.data);
  if (r.status !== 200) {
    console.log('Start server with: npm start');
    return;
  }
  const existing = Array.isArray(r.data) ? r.data : [];

  // 2. POST create
  r = await request('POST', `${BASE}/ifterspot`, exampleData);
  console.log('POST /ifterspot (create):', r.status, r.status === 200 ? 'OK' : r.data);
  if (r.status !== 200) {
    console.log('Create failed:', r.data);
    return;
  }
  const insertedId = r.data?.insertedId?.toString();
  if (!insertedId) {
    console.log('No insertedId in response');
    return;
  }
  console.log('Created _id:', insertedId, '\n');

  // 3. GET one
  r = await request('GET', `${BASE}/ifterspot/${insertedId}`);
  console.log('GET /ifterspot/:id:', r.status, r.status === 200 ? 'OK' : r.data);
  if (r.status === 200) console.log('  masjidName:', r.data?.masjidName);

  // 4. PATCH update
  r = await request('PATCH', `${BASE}/ifterspot/${insertedId}`, { status: 'approved', area: 'Dhaka North' });
  console.log('PATCH /ifterspot/:id:', r.status, r.status === 200 ? 'OK' : r.data);

  // 5. GET after update
  r = await request('GET', `${BASE}/ifterspot/${insertedId}`);
  console.log('GET after PATCH - area:', r.data?.area);

  // 6. DELETE
  r = await request('DELETE', `${BASE}/ifterspot/${insertedId}`);
  console.log('DELETE /ifterspot/:id:', r.status, r.status === 200 ? 'OK' : r.data);

  // 7. GET deleted (should 404)
  r = await request('GET', `${BASE}/ifterspot/${insertedId}`);
  console.log('GET after DELETE (expect 404):', r.status);

  console.log('\n--- Done. CRUD is working.');

  // If you have existing doc, test with your _id
  const yourId = '699b0df01b5aa00304c48884';
  r = await request('GET', `${BASE}/ifterspot/${yourId}`);
  console.log('\nGET your example _id:', yourId, '->', r.status, r.status === 200 ? 'Found' : r.data?.error || r.data);
}

run().catch((e) => console.error('Error:', e.message));
