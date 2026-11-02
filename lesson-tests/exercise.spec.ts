import { expect, test } from '@playwright/test';

test('aluno acessa a aula e recebe dica e feedback para cada tentativa', async ({ page }) => {
  await page.goto('/biblioteca/');
  await page.getByRole('link', { name: 'HTTP: requisições e respostas' }).click();
  await expect(page.getByRole('heading', { name: 'HTTP: requisições e respostas' })).toBeVisible();
  await page.getByRole('button', { name: 'Mostrar ou ocultar dica' }).click();
  await expect(page.getByText('Pense em quem responde depois de receber um pedido.')).toBeVisible();
  await page.getByLabel('A mensagem enviada pelo navegador para pedir a página.').check();
  await page.getByRole('button', { name: 'Verificar resposta' }).click();
  await expect(page.getByRole('status').first()).toContainText('Essa é a requisição');
  await expect(page.getByText('Sem perfil local: tentativa não salva.')).toBeVisible();
  await page.getByLabel('O endereço digitado pelo usuário.').check();
  await page.getByRole('button', { name: 'Verificar resposta' }).click();
  await expect(page.getByRole('status').first()).toContainText('O endereço identifica um recurso');
  await expect(page.getByText('Sem perfil local: tentativa não salva.')).toBeVisible();
  const correct = page.getByLabel('A mensagem enviada pelo servidor em retorno à requisição.');
  await correct.focus();
  await page.keyboard.press('Space');
  await expect(correct).toBeChecked();
  await page.getByRole('button', { name: 'Verificar resposta' }).click();
  await expect(page.getByRole('status').first()).toContainText('Correto.');
});

test('salva tentativa no perfil e mantém histórico após recarregar', async ({ page }) => {
  await page.goto('/perfil/');
  const name = page.getByRole('textbox', { name: 'Nome ou apelido' });
  await expect(name).toBeEnabled();
  await name.fill('Ana');
  await page.getByRole('button', { name: 'Salvar perfil' }).click();
  await expect(page.getByRole('status')).toHaveText('Perfil salvo neste navegador.');
  await page.goto('/biblioteca/http-essencial/');
  await page.getByLabel('A mensagem enviada pelo servidor em retorno à requisição.').check();
  await page.getByRole('button', { name: 'Verificar resposta' }).click();
  await expect(page.getByText('Tentativa salva no perfil local.')).toBeVisible();
  await page.goto('/perfil/');
  await expect(page.getByText(/http-essencial — acertou/)).toBeVisible();
  await page.reload();
  await expect(page.getByText(/http-essencial — acertou/)).toBeVisible();
});
