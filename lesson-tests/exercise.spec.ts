import { expect, test } from '@playwright/test';

test('aluno acessa a aula e recebe dica e feedback para cada tentativa', async ({ page }) => {
  await page.goto('/biblioteca/');
  await page.getByRole('link', { name: 'HTTP: requisições e respostas' }).click();
  await expect(page.getByRole('heading', { name: 'HTTP: requisições e respostas' })).toBeVisible();
  await page.getByRole('button', { name: 'Mostrar ou ocultar dica' }).click();
  await expect(page.getByText('Pense em quem responde depois de receber um pedido.')).toBeVisible();
  await page.getByLabel('A mensagem enviada pelo navegador para pedir a página.').check();
  await page.getByRole('button', { name: 'Verificar resposta' }).click();
  await expect(page.getByRole('status')).toContainText('Essa é a requisição');
  await page.getByLabel('O endereço digitado pelo usuário.').check();
  await page.getByRole('button', { name: 'Verificar resposta' }).click();
  await expect(page.getByRole('status')).toContainText('O endereço identifica um recurso');
  const correct = page.getByLabel('A mensagem enviada pelo servidor em retorno à requisição.');
  await correct.focus();
  await page.keyboard.press('Space');
  await expect(correct).toBeChecked();
  await page.getByRole('button', { name: 'Verificar resposta' }).click();
  await expect(page.getByRole('status')).toContainText('Correto.');
});
