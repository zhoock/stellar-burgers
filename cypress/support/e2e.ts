/// <reference types="cypress" />
import './commands';

Cypress.Commands.add('mockAuth', () => {
  // подставляем фейковые токены
  window.localStorage.setItem('refreshToken', 'FAKE_REFRESH');
  cy.setCookie('accessToken', 'FAKE_ACCESS');
});

Cypress.Commands.add('clearAuth', () => {
  window.localStorage.removeItem('refreshToken');
  cy.clearCookie('accessToken');
});

declare global {
  namespace Cypress {
    interface Chainable {
      mockAuth(): Chainable<void>;
      clearAuth(): Chainable<void>;
    }
  }
}
