import { test, expect } from '@playwright/test';
test('diagnóstico piloto preserva reavaliações após reload', async ({ page }) => {
  await page.goto('/perfil/');
  const name = page.getByRole('textbox', { name: 'Nome ou apelido' });
  await expect(name).toBeEnabled();
  await name.fill('Ana');
  await page.getByRole('button', { name: 'Salvar perfil' }).click();
  await expect(page.getByText('Perfil salvo neste navegador.', { exact: true })).toBeVisible();
  await page.goto('/diagnostico/');
  await page.getByLabel('O servidor').check();
  await page.getByLabel('GET', { exact: true }).check();
  await page.getByRole('button', { name: 'Finalizar avaliação' }).click();
  await expect(page.getByText('Avaliação salva no perfil.')).toBeVisible();
  await expect(page.getByText('Competência F04.05: 2/2 acertos (100%).')).toBeVisible();
  await page.reload();
  await expect(page.getByText(/HTTP v1: 2\/2/)).toBeVisible();
});
