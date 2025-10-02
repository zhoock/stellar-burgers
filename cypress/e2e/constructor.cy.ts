/// <reference types="cypress" />

const ING = '**/ingredients';
const AUTH_USER = '**/auth/user';
const ORDERS = '**/orders';

describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', ING, { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
  });

  it('добавление ингредиента в конструктор', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.fixture('ingredients.json').then(({ data }) => {
      const bun = data.find((i: any) => i.type === 'bun')!;
      cy.contains('p', bun.name)
        .parents('li')
        .within(() => {
          cy.contains('button', 'Добавить').click();
        });
      cy.contains(`${bun.name} (верх)`).should('exist');
    });
  });

  it('модалка ингредиента открывается и закрывается', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.fixture('ingredients.json').then(({ data }) => {
      const ing = data[0];

      // открываем карточку
      cy.contains('p', ing.name).click();

      // Ждём либо модал, либо роут /ingredients/:id
      cy.location('pathname', { timeout: 6000 }).should(
        'match',
        /\/(ingredients\/|$)/
      );

      cy.get('body').then(($body) => {
        const hasModal = $body.find('[data-cy="modal"]').length > 0;
        if (hasModal) {
          cy.get('[data-cy="modal"]').should('be.visible');

          // закрываем: клик по overlay (портал/сосед — берём широкий селектор)
          cy.get('body')
            .find('[class*="overlay"], .modal-overlay')
            .first()
            .click('topLeft', { force: true });

          cy.get('[data-cy="modal"]').should('not.exist');
        } else {
          // открыто как отдельная страница — есть имя ингредиента
          cy.contains('h3', ing.name).should('exist');
          cy.go('back');
        }
      });

      // вернулись на главную
      cy.location('pathname').should('eq', '/');
    });
  });

  it('создание заказа: авторизован, бургер собран, показываем номер и очищаем конструктор', () => {
    // авторизация и перехваты ДО визита
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.setCookie('accessToken', 'FAKE_ACCESS');
    cy.intercept('GET', AUTH_USER, { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', ORDERS, { fixture: 'order.json' }).as('createOrder');

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');

    // собираем бургер: булка + 2 начинки
    cy.fixture('ingredients.json').then(({ data }) => {
      const bun = data.find((i: any) => i.type === 'bun')!;
      const mains = data.filter((i: any) => i.type === 'main').slice(0, 2);

      cy.contains('p', bun.name)
        .parents('li')
        .within(() => {
          cy.contains('button', 'Добавить').click();
        });
      mains.forEach((m: any) => {
        cy.contains('p', m.name)
          .parents('li')
          .within(() => {
            cy.contains('button', 'Добавить').click();
          });
      });
    });

    // кликаем оформить
    cy.contains('button', 'Оформить заказ').click();

    // ждём POST /orders и проверяем тело запроса
    cy.wait('@createOrder')
      .its('request.body')
      .then((body: any) => {
        expect(body.ingredients?.length || 0).to.be.greaterThan(0);
      });

    // проверяем номер заказа — либо в модалке, либо просто в DOM (на случай страницы)
    cy.fixture('order.json').then((ord) => {
      const numberText = String(ord.order.number);
      cy.get('body').should('contain', numberText);
    });

    // пытаемся закрыть модалку, если она есть
    cy.get('body').then(($body) => {
      const hasModal = $body.find('[data-cy="modal"]').length > 0;
      if (hasModal) {
        cy.get('body')
          .find('[class*="overlay"], .modal-overlay')
          .first()
          .click('topLeft', { force: true });
        cy.get('[data-cy="modal"]').should('not.exist');
      }
    });

    // конструктор очищен
    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
  });
});
