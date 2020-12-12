// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    login(email: string, password: string): void;
    saveLocalStorageCache(): void;
    restoreLocalStorageCache(): void;
    answerQuiz(question: string, answer: string, finish?: boolean): void;
  }
}
//
// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
  console.log('Custom command example: Login', email, password);
});
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('isNotActionable', (element, done) => {
  element.click({ force: true });
  cy.once('fail', (err) => {
    expect(err.message).to.include('cy.click() failed because this element');
    expect(err.message).to.include('is being covered by another element');
    done();
  });
  done(
    new Error('Expected element NOT to be clickable, but click() succeeded')
  );
});

let LOCAL_STORAGE_MEMORY = {};

Cypress.Commands.add('saveLocalStorageCache', () => {
  Object.keys(localStorage).forEach((key) => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});

Cypress.Commands.add('restoreLocalStorageCache', () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});

Cypress.Commands.add('answerQuiz', (question, answer, finish = false) => {
  cy.get('p')
    .contains(question)
    .parent('div')
    .within(() => {
      cy.get('div').contains(answer).click();
      cy.wait(500);
      cy.get('svg')
        .parent()
        .contains(finish ? 'Finish' : 'Next')
        .click();
    });
});
