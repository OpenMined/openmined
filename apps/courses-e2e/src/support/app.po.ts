export const getHeading = () => cy.get('h1');

export const getCookies = () => cy.get('div#cookies').as('cookies');

export const getNavbar = () => cy.get('nav');

export const getLink = () => cy.get('a.chakra-link');

export const getButton = () => cy.get('button.chakra-button');

export const getInput = (name: string) => cy.get(`input[name='${name}']`);

export const getNextButton = () =>
  cy.get('button.chakra-button').contains('Next');

export const withBaseUrl = (path?) =>
  Cypress.config().baseUrl + (path ? path : '');
