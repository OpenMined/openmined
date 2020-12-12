import {
  getGreeting,
  getCookies,
  getNextLessonButton,
} from '../support/app.po';

describe('courses', () => {
  beforeEach(() => cy.visit('/'));

  it('should display the main course series', () => {
    getGreeting().contains('The Private AI Series');
  });
});

describe('cookies', () => {
  beforeEach(() => {
    cy.visit('/');
    getCookies();
  });

  it('should display the cookies alert box', () => {
    cy.get('@cookies').should('be.visible');
  });

  it('should display the cookies title', () => {
    cy.get('@cookies').contains("Let's talk about cookies...");
  });

  it('should accept all cookies', () => {
    cy.get('@cookies').contains('Accept all cookies').click();
  });
});

describe('take a course', () => {
  beforeEach(() => {
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it('should browse the courses', () => {
    cy.get('nav > div').contains('Courses').click();
  });

  it('should navigate to the course overview page', () => {
    cy.get('div').contains('Privacy and Society').click();

    // Debug purposes only
    cy.visit('/courses/privacy-and-society');

    // Checking redirect
    cy.url().should('include', '/courses/privacy-and-society');
    cy.get('h1').should('have.text', 'Privacy and Society');
  });

  it('should accept the cookies', () => {
    cy.wait(1000);
    getCookies().contains('Accept all cookies').click();
  });

  it('should start the course', () => {
    // Starting the course
    cy.get('a.chakra-button').first().contains('Start Course').click();

    // Debug purposes only
    cy.visit(
      '/courses/privacy-and-society/8337874c-20c4-4856-95e3-dcbb4a043b63/0215e9c6-8c51-4e56-8f1c-c062c2fee5e6'
    );

    cy.wait(750);
    cy.get('span.chakra-heading')
      .first()
      .should('have.text', 'Lesson 1: Welcome to Privacy & Society');
  });

  it('should block from skipping the lesson without doing quizzes', () => {
    cy.url().then((url) => {
      const nextLessonButton = getNextLessonButton();

      nextLessonButton.should('be.disabled');
      nextLessonButton.click({ force: true });
      cy.url().should('eq', url);
    });
  });

  it('should answer and complete a quiz', () => {
    cy.answerQuiz('What is your favorite color?', 'Orange');
    cy.answerQuiz(
      'What is the airspeed velocity of a swallow?',
      'African or European?',
      true
    );

    cy.wait(250);
    cy.get('p.chakra-heading')
      .contains('Great work')
      .parent()
      .within(() => {
        cy.get('h2.chakra-heading').each(($el) =>
          cy.wrap($el).should('have.text', '2')
        );
      });
  });

  it('should have the next button available after quiz completion', () => {
    getNextLessonButton().should('not.be.disabled');
  });

  it('should take to the next lesson', () => {
    cy.url()
      .then((url) => {
        getNextLessonButton().click();
        cy.url().should('not.eq', url);
      })
      .then(() => {
        cy.wait(3500);
        getNextLessonButton().click();
      });
  });

  it('should have first lesson completed', () => {
    cy.get('p.chakra-heading')
      .contains('Congratulations!')
      .parent()
      .within(() => {
        cy.get('svg').should('have.class', 'fa-check-circle');
      });
  });

  it('should continue to the next lesson', () => {
    cy.get('button.chakra-button').contains('Continue').click();
  });

  it('should redirect to the lesson 2 page and begin the lesson', () => {
    cy.get('h1').should('have.text', 'What is an information flow?');
    cy.get('button.chakra-button').contains('Begin Lesson').click();
  });

  it('should take the second lesson', () => {
    // Debug purposes only
    cy.visit(
      '/courses/privacy-and-society/1f34d3a8-2fa1-4a1e-9ef1-eaaf9dddd617/291067ab-b2e7-469f-8644-4dc821b1029c'
    );

    cy.wait(750);
    cy.get('span.chakra-heading')
      .first()
      .should('have.text', 'Lesson 2: Information flows are everywhere');

    // Answer First Quiz
    cy.answerQuiz('Is this awesome?', 'Okay then', true);

    getNextLessonButton().click();
    cy.wait(1000)

    cy.get('span.chakra-heading')
      .first()
      .should('have.text', 'Lesson 2: What is an information flow?');

    // Second Concept Quiz 01
    cy.answerQuiz('What is the right answer?', 'One');
    cy.answerQuiz("Here's my other question?", 'Yes', true);

    // Second Concept Quiz 2
    cy.answerQuiz('One more question?', 'Definitely', true);

    getNextLessonButton().click();
    cy.wait(1000)
  });
});
