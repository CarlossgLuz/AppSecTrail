import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

test('gera capturas de homologação', async ({ page }, testInfo) => {
  const dir = join('test-results', 'homologacao', testInfo.project.name);
  await mkdir(dir, { recursive: true });
  async function capture(name: string) { await page.screenshot({ path: join(dir, `${name}.png`), fullPage: true }); }
  await page.goto('/'); await expect(page.locator('h1')).toBeVisible(); await capture('inicio');
  await page.goto('/biblioteca/'); await expect(page.locator('h1')).toBeVisible(); await capture('biblioteca');
  await page.goto('/perfil/');
  const name = page.getByRole('textbox', { name: 'Nome ou apelido' }); await expect(name).toBeEnabled(); await name.fill('Ana');
  await page.getByRole('button', { name: 'Salvar perfil' }).click(); await expect(page.getByText('Perfil salvo neste navegador.', { exact: true })).toBeVisible(); await capture('perfil');
  await page.goto('/biblioteca/http-essencial/'); await expect(page.getByText('Visita salva no perfil.')).toBeVisible();
  await page.getByLabel('A mensagem enviada pelo navegador para pedir a página.').check();
  await page.getByRole('button', { name: 'Verificar resposta' }).click(); await expect(page.getByText('Tentativa salva no perfil local.')).toBeVisible(); await capture('aula-feedback');
  await page.goto('/diagnostico/'); await page.getByRole('button', { name: 'Finalizar avaliação' }).click();
  await expect(page.getByText(/Responda todas as questões/)).toBeVisible(); await capture('diagnostico-erro');
  await page.getByLabel('O servidor').check(); await page.getByLabel('GET', { exact: true }).check();
  await page.getByRole('button', { name: 'Finalizar avaliação' }).click(); await expect(page.getByText('Avaliação salva no perfil.')).toBeVisible(); await capture('diagnostico-resultado');
});
