/// <reference types="cypress" />

// 👉 СНАЧАЛА — расширяем типы Chainable
declare global {
  namespace Cypress {
    interface Chainable {
      mockAuth(): Chainable<void>;
      clearAuth(): Chainable<void>;
    }
  }
}

// 👉 Делаем файл модулем, чтобы глобальное расширение было валидно
export {};

// 👉 Потом — реальная имплементация команд
Cypress.Commands.add('mockAuth', () => {
  window.localStorage.setItem('refreshToken', 'FAKE_REFRESH');
  cy.setCookie('accessToken', 'FAKE_ACCESS');
});

Cypress.Commands.add('clearAuth', () => {
  window.localStorage.removeItem('refreshToken');
  cy.clearCookie('accessToken');
});
