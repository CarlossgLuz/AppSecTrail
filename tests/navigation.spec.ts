import { test, expect } from '@playwright/test';

test('navega para biblioteca e mantém o conteúdo acessível na tela', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.getByRole('link', { name: 'Explorar a biblioteca' }).click();
  await expect(page).toHaveURL(/\/biblioteca\/$/);
  await expect(page.getByRole('searchbox', { name: 'Buscar por assunto' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'HTTP: requisições e respostas' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('cria, preserva após recarregar e edita perfil local', async ({ page }) => {
  await page.goto('/perfil/');
  const name = page.getByRole('textbox', { name: 'Nome ou apelido' });
  await expect(name).toBeEnabled();
  await name.fill('Ana');
  await page.getByRole('button', { name: 'Salvar perfil' }).click();
  await expect(page.getByText('Perfil salvo neste navegador.', { exact: true })).toBeVisible();
  await page.reload();
  await expect(name).toHaveValue('Ana');
  await name.fill('Lia');
  await page.getByRole('button', { name: 'Salvar perfil' }).click();
  await expect(page.getByText('Perfil salvo neste navegador.', { exact: true })).toBeVisible();
  await page.reload();
  await expect(name).toHaveValue('Lia');
});
