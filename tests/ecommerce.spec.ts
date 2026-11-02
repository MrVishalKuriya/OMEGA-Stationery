import { test, expect } from '@playwright/test';

test.describe('OMEGA Stationery E-Commerce Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
  });

  test('1. Instant Search and Suggestions Flow', async ({ page }) => {
    // Press '/' key or click desktop search input
    const searchInput = page.locator('input[role="searchbox"]').first();
    await searchInput.fill('Counter');

    // Matching products dropdown should display items
    const matchItem = page.locator('text=Matching Products');
    await expect(matchItem).toBeVisible({ timeout: 5000 });
  });

  test('2. Add to Cart and Quantity Stepper Flow', async ({ page }) => {
    // Find the first product card's Add to Cart button
    const firstAddButton = page.locator('button[title="Add to cart"]').first();
    await expect(firstAddButton).toBeVisible();
    await firstAddButton.click();

    // Verify quantity stepper appears (- 1 +)
    const increaseQtyBtn = page.locator('button[aria-label="Increase quantity"]').first();
    await expect(increaseQtyBtn).toBeVisible({ timeout: 3000 });

    // Click plus to increase quantity to 2
    await increaseQtyBtn.click();
    const qtyCount = page.locator('text=2').first();
    await expect(qtyCount).toBeVisible();
  });

  test('3. Open Cart Drawer and WhatsApp Order Dispatch', async ({ page }) => {
    // Open cart drawer via top right pill button
    const cartPill = page.locator('button[aria-label^="Shopping Cart"]').first();
    await cartPill.click();

    // Verify drawer is open
    const drawerTitle = page.locator('text=Shopping Cart');
    await expect(drawerTitle).toBeVisible({ timeout: 4000 });

    // Verify WhatsApp order link exists and targets wa.me with phone number
    const whatsappBtn = page.locator('a:has-text("Send Order on WhatsApp")');
    await expect(whatsappBtn).toBeVisible();
    const href = await whatsappBtn.getAttribute('href');
    expect(href).toContain('https://wa.me/255746268391');
    expect(href).toContain('text=');
  });
});

