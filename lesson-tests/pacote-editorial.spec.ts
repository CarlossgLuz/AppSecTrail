import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('rascunhos do pacote renderizam e respondem no ambiente isolado', async ({ page }) => {
  const lessons = [
    { title: 'Computador, software e sistema: onde tudo acontece', wrong: 'O conjunto de arquivos do aplicativo, mesmo quando não está em execução.', correct: 'Uma instância em execução com memória e contexto próprios.', feedback: 'Isso descreve o programa armazenado' },
    { title: 'Programação do zero: variáveis, condições e decisões seguras', wrong: 'pedido["id"] > 0', correct: 'pedido["dono_id"] == usuario_id', feedback: 'Isso confirma apenas um formato parcial' },
    { title: 'Redes para AppSec: DNS, IP, portas e TLS sem mistério', wrong: 'Elimina falhas de implementação na API.', correct: 'Ajuda a proteger o transporte, mas não substitui autorização por objeto.', feedback: 'A camada TLS não corrige' },
  ];
  for (const lesson of lessons) {
    await page.goto('/biblioteca/');
    await page.getByRole('link', { name: lesson.title }).click();
    await expect(page.getByRole('heading', { name: lesson.title })).toBeVisible();
    await page.getByLabel(lesson.wrong).check();
    await page.getByRole('button', { name: 'Verificar resposta' }).click();
    await expect(page.getByRole('status').first()).toContainText(lesson.feedback);
    const answer = page.getByLabel(lesson.correct);
    await answer.focus(); await page.keyboard.press('Space');
    await expect(answer).toBeChecked();
    await page.getByRole('button', { name: 'Verificar resposta' }).click();
    await expect(page.getByRole('status').first()).toContainText('Correto');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  }
});
