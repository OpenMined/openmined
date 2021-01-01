import { withBaseUrl } from '../support/app.po';
import {
  getCourseContent,
  getCurrentUser,
  setCourseData,
  TEST_PROGRESS,
  TEST_USER_02,
} from '../support/helpers';

describe('navigation rules', () => {
  before(() => {
    cy.visit('/');
    cy.createUser(TEST_USER_02);
  });

  it('should be able to access the first lesson and concept only', () => {
    const user = getCurrentUser();

    cy.visit(
      '/courses/privacy-and-society/8337874c-20c4-4856-95e3-dcbb4a043b63/215e9c6-8c51-4e56-8f1c-c062c2fee5e6'
    );
    cy.url().should('not.eq', withBaseUrl());
  });

  it('should be able to access the second concept on lesson one', () => {
    const user = getCurrentUser();
    setCourseData(TEST_PROGRESS.NOT_STARTED);
    cy.visit(
      '/courses/privacy-and-society/8337874c-20c4-4856-95e3-dcbb4a043b63/5efb1f64-13d6-453f-bc94-b07970ddb370'
    );
    cy.url().should('not.eq', withBaseUrl());
  });

  it('should be able to access all the first lesson', () => {
    const user = getCurrentUser();
    setCourseData(TEST_PROGRESS.LESSON_1_COMPLETED);
    cy.visit(
      '/courses/privacy-and-society/8337874c-20c4-4856-95e3-dcbb4a043b63/5efb1f64-13d6-453f-bc94-b07970ddb370'
    );
    cy.url().should('not.eq', withBaseUrl());
  });

  it('should be able to access all the first lesson', () => {
    const user = getCurrentUser();
    setCourseData(TEST_PROGRESS.LESSON_1_COMPLETED);
    cy.visit(
      '/courses/privacy-and-society/8337874c-20c4-4856-95e3-dcbb4a043b63/5efb1f64-13d6-453f-bc94-b07970ddb370'
    );
    cy.url().should('not.eq', withBaseUrl());
  });
});
