import { test, expect } from '@playwright/test';

test('trilha orienta sem bloquear o módulo e mostra progresso local', async ({ page }) => {
  await page.goto('/trilhas/');
  await expect(page.getByText('Crie um perfil para acompanhar seu progresso.')).toBeVisible();
  await page.getByRole('link', { name: 'HTTP: requisições e respostas' }).click();
  await expect(page).toHaveURL(/\/biblioteca\/http-essencial\//);
  await page.goto('/perfil/');
  const name = page.getByRole('textbox', { name: 'Nome ou apelido' });
  await expect(name).toBeEnabled(); await name.fill('Ana');
  await page.getByRole('button', { name: 'Salvar perfil' }).click();
  await expect(page.getByText('Perfil salvo neste navegador.', { exact: true })).toBeVisible();
  await page.goto('/biblioteca/http-essencial/');
  await expect(page.getByText('Visita salva no perfil.')).toBeVisible();
  await page.getByRole('button', { name: 'Marcar aula como concluída' }).click();
  await expect(page.getByText('Registro salvo no perfil.')).toBeVisible();
  await page.goto('/trilhas/');
  await expect(page.getByText('Concluída no perfil local')).toBeVisible();
});
