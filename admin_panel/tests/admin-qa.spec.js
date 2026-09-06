import { test, expect } from '@playwright/test';
import { createCsv, collectPages } from '../src/utils/csv.js';

const admin = { id: 1, name: 'QA Administrator', email: 'admin@example.com', role: 'admin', status: 'active' };
const booking = (id) => ({ id, customer_name: `Customer ${id}`, customer_email: `customer${id}@example.com`, customer_phone: '0771234567', pickup_location: 'Colombo', drop_location: 'Kandy', vehicle_type: 'Toyota Prius', pickup_date: '2026-09-10', return_date: '2026-09-11', passengers: 2, amount: 150, status: 'confirmed' });
const review = (id, rating) => ({ id, review_code: `REV-${id}`, customer_name: `Reviewer ${id}`, customer_email: `reviewer${id}@example.com`, tour_name: 'Kandy', rating, comment: 'A good trip', status: 'published', booking_id: id, created_at: '2026-09-01', images: [] });

async function mockApi(page, overrides = {}) {
  const calls = [];
  await page.route((url) => url.pathname.startsWith('/api/'), async (route) => {
    const url = new URL(route.request().url());
    const key = url.pathname.replace(/^.*\/api/, '');
    calls.push({ key, params: Object.fromEntries(url.searchParams) });
    if (overrides[key]) return overrides[key](route, url);
    const data = {
      '/profile': { user: admin },
      '/TodayBookings': { today_bookings: 2 },
      '/PaymentStats': { stats: {} },
      '/GetBookings': { bookings: [booking(1)], pagination: { total: 1, last_page: 1 } },
      '/GetVehicles': { vehicles: [] },
      '/GetTours': { tours: [] },
      '/GetCustomers': { customers: [] },
      '/GetPayments': { payments: [], pagination: { total: 0, last_page: 1 } },
      '/GetReviews': { reviews: [review(1, 5), review(2, 3)] },
      '/GetReviewBookingOptions': { bookings: [] },
      '/admin/blogPosts': { blogPosts: [] },
      '/blogPostCategories': { categories: [] },
      '/logout': { status: 'success' },
    }[key] || {};
    await route.fulfill({ json: data });
  });
  return calls;
}

async function signIn(page) {
  await page.addInitScript(() => localStorage.setItem('token', 'qa-token'));
}

test('CSV escapes quotes, newlines, formula prefixes and exports every page', async () => {
  const csv = createCsv(['Name'], [['=1+1'], [' \t@SUM(1)'], ['a,"b"\nline'], [42], [null]]);
  expect(csv).toContain('"\'=1+1"');
  expect(csv).toContain('"\' \t@SUM(1)"');
  expect(csv).toContain('"a,""b""\nline"');
  expect(csv).toContain('"42"');
  const pages = [];
  const rows = await collectPages(async (page) => { pages.push(page); return { data: { rows: [page], pagination: { last_page: 3 } } }; }, 'rows');
  expect(rows).toEqual([1, 2, 3]);
  expect(pages).toEqual([1, 2, 3]);
});

test('login shows API errors without redirecting and supports password visibility', async ({ page }) => {
  await mockApi(page, { '/login': (route) => route.fulfill({ status: 401, json: { message: 'Invalid credentials' } }) });
  await page.goto('/login');
  await page.getByLabel('Email', { exact: true }).fill('admin@example.com');
  await page.getByLabel('Password', { exact: true }).fill('wrong-password');
  await page.getByRole('button', { name: 'Show password' }).click();
  await expect(page.getByLabel('Password', { exact: true })).toHaveAttribute('type', 'text');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Invalid credentials');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('button', { name: 'Sign In', exact: true })).toBeEnabled();
});

for (const [path, heading] of [['/tours', 'Tour Management'], ['/vehicles', 'Vehicle Management'], ['/bookings', 'Bookings Management'], ['/customers', 'Customers Management'], ['/payments', 'Payment Management'], ['/blogs', 'Blog Post Management'], ['/reviews', 'Reviews Management']]) {
  test(`${path} removes obsolete actions and refreshes data`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const calls = await mockApi(page);
    await signIn(page);
    await page.goto(path);
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
    for (const name of ['Print All', 'Email All', 'Help', 'Settings', 'More filters', 'Toggle theme', 'Notifications', 'Messages']) {
      await expect(page.getByRole('button', { name, exact: true })).toHaveCount(0);
    }
    await expect(page.locator('a[href^="/settings"]')).toHaveCount(0);
    const refresh = page.getByRole('button', { name: 'Refresh', exact: true });
    await expect(refresh).toBeEnabled();
    const before = calls.length;
    await refresh.click();
    await expect.poll(() => calls.length).toBeGreaterThan(before);
    await expect(refresh).toBeEnabled();
    expect(errors).toEqual([]);
    if (path === '/vehicles') expect(calls.filter((call) => call.key === '/GetBookings')).toHaveLength(0);
  });
}

test('booking export includes all filtered pages and refresh retains filters', async ({ page }) => {
  const calls = await mockApi(page, { '/GetBookings': (route, url) => route.fulfill({ json: { bookings: [booking(Number(url.searchParams.get('page')) || 1)], pagination: { total: 2, last_page: 2 } } }) });
  await signIn(page);
  await page.goto('/bookings');
  await page.getByPlaceholder('Search by customer, email, phone, location, vehicle...').fill('Colombo');
  await expect.poll(() => calls.filter((call) => call.key === '/GetBookings').at(-1)?.params.search).toBe('Colombo');
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe('bookings.csv');
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  const csv = Buffer.concat(chunks).toString('utf8');
  expect(csv).toContain('Customer 1');
  expect(csv).toContain('Customer 2');
  const exportCalls = calls.filter((call) => call.key === '/GetBookings' && call.params.per_page === '50');
  expect(exportCalls.map((call) => call.params.search)).toEqual(['Colombo', 'Colombo']);
  await page.getByRole('button', { name: 'Refresh', exact: true }).click();
  await expect(page.getByPlaceholder('Search by customer, email, phone, location, vehicle...')).toHaveValue('Colombo');
});

test('review filtering and sorting preserve records and export current matches', async ({ page }) => {
  await mockApi(page);
  await signIn(page);
  await page.goto('/reviews');
  await expect(page.getByText('Reviewer 2', { exact: true })).toBeVisible();
  const search = page.getByPlaceholder('Search reviews...');
  await search.fill('Reviewer 1');
  await page.getByRole('button', { name: 'Rating', exact: true }).click();
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  expect((await downloadEvent).suggestedFilename()).toBe('reviews.csv');
  await search.fill('');
  await expect(page.getByText('Reviewer 2', { exact: true })).toBeVisible();
});

test('blog editor remains readable with OS dark mode and sanitizes unsafe HTML', async ({ page }) => {
  await mockApi(page);
  await signIn(page);
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/blogs/add');
  const editor = page.getByRole('textbox', { name: 'Blog content' });
  await editor.fill('Visible blog content');
  await expect(editor).toHaveCSS('color', 'rgb(31, 41, 55)');
  await expect(editor).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.getByRole('button', { name: 'Save Draft', exact: true })).toBeVisible();
  const safe = await page.evaluate(async () => {
    const { sanitizeHtml } = await import('/src/utils/sanitizeHtml.js');
    return sanitizeHtml('<p>Safe text</p><img src=x onerror="alert(1)"><a href="javascript:alert(1)">bad link</a><script>alert(1)</script><div style="position:fixed">overlay</div>');
  });
  expect(safe).toContain('<p>Safe text</p>');
  expect(safe).not.toMatch(/onerror|javascript:|<script|style=/);
  await page.screenshot({ path: 'test-results/blog-editor.png', fullPage: true });
});

test('profile displays real details and logout clears the local token', async ({ page }) => {
  await mockApi(page);
  await signIn(page);
  await page.goto('/bookings');
  await page.getByRole('button', { name: 'Open account menu' }).click();
  await expect(page.getByRole('menuitem', { name: 'Account Settings' })).toHaveCount(0);
  await page.getByRole('menuitem', { name: 'My Profile' }).click();
  await expect(page.getByRole('dialog')).toContainText('admin@example.com');
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.getByRole('button', { name: 'Open account menu' }).click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();
  await expect(page).toHaveURL(/\/login$/);
  expect(await page.evaluate(() => localStorage.getItem('token'))).toBeNull();
});

test('booking filters wrap on mobile and vehicle options remain visible', async ({ page }) => {
  await mockApi(page, { '/GetVehicles': (route) => route.fulfill({ json: { vehicles: [{ id: 1, name: 'Toyota Prius', category: 'Sedan Car' }] } }) });
  await signIn(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/bookings');
  await expect(page.getByRole('heading', { name: 'Bookings Management' })).toBeVisible();
  await page.getByRole('combobox').first().click();
  await expect(page.getByRole('option', { name: 'Toyota Prius' })).toBeVisible();
  await page.getByRole('option', { name: 'Toyota Prius' }).click();
  for (const status of ['All Status', 'Confirmed', 'Pending', 'Cancelled', 'Completed']) {
    const chip = page.getByRole('button', { name: status, exact: true }).first();
    await expect(chip).toBeVisible();
    const box = await chip.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(390);
  }
  await page.screenshot({ path: 'test-results/bookings-mobile.png', fullPage: true });
});

test('review refresh exposes failures and allows a successful retry', async ({ page }) => {
  let fail = true;
  await mockApi(page, { '/GetReviews': (route) => fail ? route.fulfill({ status: 500, json: { message: 'Failed' } }) : route.fulfill({ json: { reviews: [review(1, 5)] } }) });
  await signIn(page);
  await page.goto('/reviews');
  await expect(page.getByRole('alert')).toContainText('Unable to load reviews');
  fail = false;
  await page.getByRole('button', { name: 'Refresh', exact: true }).click();
  await expect(page.getByText('Reviewer 1', { exact: true })).toBeVisible();
});
