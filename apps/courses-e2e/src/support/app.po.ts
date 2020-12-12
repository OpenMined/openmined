export const getGreeting = () => cy.get('h1');

export const getCookies = () => cy.get('div#cookies').as('cookies');

export const getNavbar = () => cy.get('nav');

export const getNextLessonButton = () => cy.get('button.chakra-button').contains('Next')
