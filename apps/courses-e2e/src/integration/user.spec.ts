/* eslint-disable cypress/no-unnecessary-waiting */
import {
  getButton,
  getInput,
  getLink,
  getHeading,
  withBaseUrl,
} from '../support/app.po';

import {
  TEST_USER_01 as ADA_LOVELACE,
  TEST_USER_02 as ALAN_TURING,
  ALERT_MSG,
  getCurrentUser,
  getCourseContent,
  COURSE_SLUG,
  COURSE_TITLE,
} from '../support/helpers';
describe('user not logged in', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('signin page should be available', () => {
    cy.visit('/signin');
    cy.url().should('eq', withBaseUrl('signin'));
  });

  it('signup page should be available', () => {
    cy.visit('/signup');
    cy.url().should('eq', withBaseUrl('signup'));
  });

  it('/users route should be unavailable', () => {
    cy.visit('/users');
    cy.url().should('not.eq', withBaseUrl('users'));
    cy.url().should('eq', withBaseUrl());
  });

  it.skip('profile page should be unavailable', () => {
    // cy.visit(`users/${TEST_USER.uid}`);
    // Maybe 'Unauthorized Page'
    cy.url().should('eq', withBaseUrl());
  });

  it('account settings page should be unavailable', () => {
    cy.visit('/users/settings');
    cy.url().should('not.eq', withBaseUrl('users/settings'));
    // Maybe 'Unauthorized Page'
    cy.url().should('eq', withBaseUrl());
  });

  it('should be able to access a course overview page', () => {
    cy.visit(`courses/${COURSE_SLUG}`);
    cy.url().should('eq', withBaseUrl(`courses/${COURSE_SLUG}`));
    cy.wait(1000);
    getHeading().should('have.text', COURSE_TITLE);
  });

  it('should redirect if user tries to start a course', () => {
    // First 'Start Course' button
    cy.visit(`courses/${COURSE_SLUG}`);
    cy.wait(1000);
    cy.get('a.chakra-button').contains('Start Course').first().click();
    cy.url().should('eq', withBaseUrl());

    // Second 'Start Course' button
    cy.visit(`courses/${COURSE_SLUG}`);
    cy.wait(1000);
    cy.get('a.chakra-button').contains('Start Course').last().click();
    cy.url().should('eq', withBaseUrl());
  });

  it('should redirect if user tries to access a course lesson via url', (done) => {
    getCourseContent(COURSE_SLUG).then((course) => {
      const firstLessonRef = course.lessons[0]._ref;

      cy.goToLesson(COURSE_SLUG, firstLessonRef);

      cy.visit(`/courses/${COURSE_SLUG}/${firstLessonRef}`);
      cy.url()
        .should('eq', withBaseUrl())
        .then(() => done());
    });
  });

  it('should redirect if user tries to access a course project via url', () => {
    const projectPageUrl = `courses/${COURSE_SLUG}/project`;

    cy.visit(projectPageUrl);
    cy.url().should('not.eq', withBaseUrl(projectPageUrl));
    // Maybe 'Unauthorized Page'
    cy.url().should('eq', withBaseUrl());
  });

  it('should redirect if user tries to access a course lesson via url', (done) => {
    getCourseContent(COURSE_SLUG).then((course) => {
      const firstLessonRef = course.lessons[0]._ref;
      cy.goToLesson(COURSE_SLUG, firstLessonRef);
      cy.visit(`/courses/${COURSE_SLUG}/${firstLessonRef}`);
      cy.url()
        .should('eq', withBaseUrl())
        .then(() => done());
    });
  });
});

describe('user logged in', () => {
  before(() => {
    cy.acceptCookies();
    cy.createUser(ADA_LOVELACE);
    cy.saveLocalStorageCache();
  });

  beforeEach(() => {
    cy.visit('/');
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it('should be able to start a course', () => {
    // First 'Start Course' button
    cy.visit(`courses/${COURSE_SLUG}`);
    cy.wait(1000);
    cy.get('a.chakra-button').contains('Start Course').first().click();
    cy.url().should('not.eq', withBaseUrl());

    // Second 'Start Course' button
    cy.visit(`courses/${COURSE_SLUG}`);
    cy.wait(1000);
    cy.get('a.chakra-button').contains('Start Course').last().click();
    cy.url().should('not.eq', withBaseUrl());
  });

  it.skip('signin page should not be available', () => {
    cy.visit('/signin');
    cy.url().should('not.eq', withBaseUrl('/signin'));
    cy.url().should('eq', withBaseUrl());
  });

  it.skip('signup page should not be available', () => {
    cy.visit('/signup');
    cy.url().should('not.eq', withBaseUrl('/signup'));
    cy.url().should('eq', withBaseUrl());
  });

  it('/users route should be unavailable', () => {
    cy.visit('/users');
    cy.url().should('not.eq', withBaseUrl('users'));
    cy.url().should('eq', withBaseUrl());
  });

  it.skip('profile page should be available', () => {
    // cy.visit(`users/${TEST_USER.uid}`);
    // cy.url().should('eq', `users/${TEST_USER.uid}`);
    cy.url().should('not.eq', withBaseUrl());
  });

  it('account settings page should be available', () => {
    cy.visit('/users/settings');
    cy.url().should('eq', withBaseUrl('users/settings'));
    cy.url().should('not.eq', withBaseUrl());
  });
});

describe('user authentication', () => {
  before(() => {
    cy.visit('/');
    cy.acceptCookies();
    cy.saveLocalStorageCache();
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it('creates a new user', () => {
    cy.createUser(ADA_LOVELACE);
  });

  it('log out from the website', () => {
    cy.logout();
    cy.checkAlert(ALERT_MSG.LOGOUT_SUCCESS);
  });

  it('sign in to the platform', () => {
    cy.visit('/signin');
    cy.get("input[name='email']").type(ADA_LOVELACE.email);
    cy.get("input[name='password']").type(ADA_LOVELACE.password);
    cy.get('form').submit();
    cy.checkAlert(ALERT_MSG.SIGNIN_SUCCESS);
    cy.wait(2500);
  });

  it('delete the logged user account', () => {
    cy.deleteAccount();

    // Confirm account deletion
    cy.checkAlert(ALERT_MSG.ACCOUNT_DELETED);

    cy.wait(1000);

    // Expect error
    cy.visit('/signin');
    cy.get("input[name='email']").type(ADA_LOVELACE.email);
    cy.get("input[name='password']").type(ADA_LOVELACE.password);
    cy.get('form').submit();
    cy.checkAlert(ALERT_MSG.INVALID_MAIL);
  });
});

describe('user settings', () => {
  before(() => {
    cy.visit('/');
    cy.acceptCookies();
    cy.createUser(ALAN_TURING);
    cy.saveLocalStorageCache();
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
    cy.login(ALAN_TURING.email, ALAN_TURING.password);
    cy.visit('/users/settings');
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it('should be able to ask verification email', () => {
    getLink().contains('Resend Verification Email');
    cy.checkAlert(ALERT_MSG.MAIL_VERIFICATION);
  });

  it('should be able to ask verification email', () => {
    getLink().contains('Resend Verification Email');
    cy.checkAlert(ALERT_MSG.MAIL_VERIFICATION);
  });

  it('should be able to change the name', () => {
    getInput('first_name').type('Turing');
    getInput('last_name').type('Alan');
    cy.checkAlert(ALERT_MSG.ACCOUNT_UPDATED);
  });

  it('should be able to change the about section', () => {
    getInput('description').type('The CS Father');
    cy.checkAlert(ALERT_MSG.ACCOUNT_UPDATED);
  });

  it('should be able to change the website', () => {
    getInput('website').type('https://turing.io');
    cy.checkAlert(ALERT_MSG.ACCOUNT_UPDATED);
  });

  it('should be able to change the twitter username', () => {
    getInput('twitter').type('alanturing');
    cy.checkAlert(ALERT_MSG.ACCOUNT_UPDATED);
  });

  it('should be able to change the password', () => {
    getButton().contains('Change Password').click();
    getInput('password').type('notrandom123');
    getInput('confirm').type('notrandom123');
    getButton().contains('Save changes').click();
    cy.checkAlert(ALERT_MSG.PASSWORD_CHANGED);
  });

  it('should be able to change the email address', () => {
    getButton().contains('Manage Account').click();
    getInput('email').type('god.turing@openmined.org');
    getButton().contains('Save changes').click();
    cy.checkAlert(ALERT_MSG.EMAIL_UPDATED);
  });
});