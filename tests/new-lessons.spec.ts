import { expect, test } from '@playwright/test';

test('aulas revisadas aparecem na biblioteca e seus exercícios respondem', async ({ page }) => {
  const lessons = [
    { title: 'Cookies de sessão: atributos e limites', wrong: 'Ele só é enviado por HTTPS, mesmo sem o atributo Secure.', feedback: 'Essa restrição é a função de Secure', correct: 'JavaScript não consegue lê-lo por document.cookie, mas o navegador ainda pode enviá-lo em requisições aplicáveis.' },
    { title: 'Autorização: quem pode acessar qual recurso?', wrong: 'Apenas se Ana está autenticada.', feedback: 'Uma sessão válida não concede', correct: 'Se Ana pode ler o relatório 42 naquele contexto.' },
  ];
  for (const lesson of lessons) {
    await page.goto('/biblioteca/');
    await page.getByRole('link', { name: lesson.title }).click();
    await expect(page.getByRole('heading', { name: lesson.title })).toBeVisible();
    await expect(page.getByText('Práticas orientadas, sem pontuação automática.')).toBeVisible();
    await page.getByLabel(lesson.wrong).check();
    await page.getByRole('button', { name: 'Verificar resposta' }).click();
    await expect(page.getByRole('status').first()).toContainText(lesson.feedback);
    await page.getByLabel(lesson.correct).check();
    await page.getByRole('button', { name: 'Verificar resposta' }).click();
    await expect(page.getByRole('status').first()).toContainText('Correto.');
  }
});
