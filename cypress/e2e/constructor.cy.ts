/// <reference types="cypress" />

/** ===== Типы фикстур ===== */
type IngredientType = 'bun' | 'main' | 'sauce';

interface Ingredient {
  _id: string;
  name: string;
  type: IngredientType;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
}

interface IngredientsFixture {
  data: Ingredient[];
}

interface OrderFixture {
  order: { number: number };
}

/** ===== Маршруты ===== */
const ING = '**/ingredients';
const AUTH_USER = '**/auth/user';
const ORDERS = '**/orders';

describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', ING, { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
  });

  afterEach(() => {
    // подчистим токены и хранилище
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('добавление ингредиента в конструктор', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.fixture<IngredientsFixture>('ingredients.json').then(({ data }) => {
      const bun = data.find((i) => i.type === 'bun');
      if (!bun) throw new Error('В фикстуре нет булки');

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

    cy.fixture<IngredientsFixture>('ingredients.json').then(({ data }) => {
      const ing: Ingredient = data[0];
      cy.contains('p', ing.name).click();

      // явно убеждаемся, что открыт именно этот ингредиент
      cy.location('pathname', { timeout: 6000 }).should(
        'include',
        `/ingredients/${ing._id}`
      );
      cy.contains('h3', ing.name).should('exist');

      // закрываем: если модалка открыта — клик по оверлею, иначе это отдельная страница → назад
      cy.get('body').then(($body) => {
        const hasOverlay =
          $body.find('[class*="overlay"], .modal-overlay').length > 0;
        if (hasOverlay) {
          cy.get('[class*="overlay"], .modal-overlay')
            .first()
            .click('topLeft', { force: true });
        } else {
          cy.go('back');
        }
      });

      cy.location('pathname').should('eq', '/');
    });
  });

  it('создание заказа: авторизован, бургер собран, показываем номер и очищаем конструктор', () => {
    cy.intercept('GET', AUTH_USER, { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', ORDERS, { fixture: 'order.json' }).as('createOrder');

    // Подставляем токены ДО инициализации приложения
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('refreshToken', 'FAKE_REFRESH');
        win.document.cookie = 'accessToken=FAKE_ACCESS';
      }
    });

    cy.wait('@getIngredients');
    cy.wait('@getUser');

    cy.fixture<IngredientsFixture>('ingredients.json').then(({ data }) => {
      const bun = data.find((i) => i.type === 'bun');
      if (!bun) throw new Error('В фикстуре нет булки');

      const mains: Ingredient[] = data
        .filter((i) => i.type === 'main')
        .slice(0, 2);

      cy.contains('p', bun.name)
        .parents('li')
        .within(() => {
          cy.contains('button', 'Добавить').click();
        });

      mains.forEach((m) => {
        cy.contains('p', m.name)
          .parents('li')
          .within(() => {
            cy.contains('button', 'Добавить').click();
          });
      });

      // перед оформлением проверяем содержимое конструктора
      cy.contains('button', 'Оформить заказ')
        .parents('section')
        .first()
        .within(() => {
          cy.contains(`${bun.name} (верх)`).should('exist');
          mains.forEach((m) => cy.contains(m.name).should('exist'));
          cy.contains(`${bun.name} (низ)`).should('exist');
        });
    });

    cy.contains('button', 'Оформить заказ').click();

    // проверяем тело запроса без any
    cy.wait('@createOrder')
      .its('request.body')
      .then((body: { ingredients?: string[] }) => {
        expect((body.ingredients ?? []).length).to.be.greaterThan(0);
      });

    cy.fixture<OrderFixture>('order.json').then((ord) => {
      cy.contains(String(ord.order.number)).should('exist');
    });

    // закрыть модалку (если открыта)
    cy.get('body').then(($body) => {
      const hasOverlay =
        $body.find('[class*="overlay"], .modal-overlay').length > 0;
      if (hasOverlay) {
        cy.get('[class*="overlay"], .modal-overlay')
          .first()
          .click('topLeft', { force: true });
        cy.get('[class*="overlay"], .modal-overlay').should('not.exist');
      }
    });

    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
  });
});
