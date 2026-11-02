import { test, expect } from '@playwright/test';

test('navega para biblioteca e mantém o conteúdo acessível na tela', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.getByRole('link', { name: 'Explorar a biblioteca' }).click();
  await expect(page).toHaveURL(/\/biblioteca\/$/);
  await expect(page.getByRole('searchbox', { name: 'Buscar por assunto' })).toBeVisible();
  await expect(page.getByText('Ainda não há módulos publicados.')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
