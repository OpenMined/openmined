/* eslint-disable cypress/no-unnecessary-waiting */
import {
  getHeading,
  getCookies,
  getNextButton,
  getButton,
} from '../support/app.po';
import {
  TEST_USER_02 as ALAN_TURING,
  TEST_COURSE,
} from '../support/helpers';

/* eslint-disable cypress/no-unnecessary-waiting */

describe('courses', () => {
  beforeEach(() => cy.visit('/'));
  it('should display the main course series', () => {
    getHeading().contains('The Private AI Series');
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

describe('course content', () => {
  before(() => {
    cy.createUser(ALAN_TURING);
  });

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
    cy.wait(1000);
    cy.get('div').contains('Privacy and Society').click();

    // Checking redirect
    cy.url().should('include', '/courses/privacy-and-society');
    cy.get('h1').should('have.text', 'Privacy and Society');
  });

  it('should accept the cookies', () => {
    getCookies().contains('Accept all cookies').click();
  });

  it('should start the course', () => {
    // Starting the course
    cy.get('a.chakra-button').first().contains('Start Course').click();
    cy.wait(1000);
    cy.get('h1').should('have.text', 'Awareness');
  });

  it('should take the first lesson', () => {
    cy.get('button.chakra-button').contains('Begin Lesson').click();

    cy.get('span.chakra-heading')
      .first()
      .should('have.text', 'Lesson 1: Awareness');
  });

  it('should block from skipping the lesson without doing quizzes', () => {
    cy.url().then((url) => {
      const nextLessonButton = getNextButton();

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
    getNextButton().should('not.be.disabled');
  });

  it('should take to the next lesson', () => {
    cy.url()
      .then((url) => {
        getNextButton().click();
        cy.url().should('not.eq', url);
      })
      .then(() => {
        cy.wait(3500);
        getNextButton().click();
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
    cy.wait(750);
    cy.get('span.chakra-heading')
      .first()
      .should('have.text', 'Lesson 2: Information flows are everywhere');

    // Answer First Quiz
    cy.answerQuiz('Is this awesome?', 'Okay then', true);

    getNextButton().click();
    cy.wait(1000);

    cy.get('span.chakra-heading')
      .first()
      .should('have.text', 'Lesson 2: What is an information flow?');

    // Second Concept Quiz 01
    cy.answerQuiz('What is the right answer?', 'One');
    cy.answerQuiz("Here's my other question?", 'Yes', true);

    // Second Concept Quiz 2
    cy.answerQuiz('One more question?', 'Definitely', true);

    getNextButton().click();
    cy.wait(1000);
  });
});

describe('take a course', () => {
  before(() => {
    cy.visit('/');
    cy.acceptCookies();
    cy.saveLocalStorageCache();
    cy.createUser(ALAN_TURING);
  });

  after(() => {
    cy.deleteAccount();
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it('start and finish a course - primary flow', () => {
    const { title: courseTitle, slug: courseSlug } = TEST_COURSE;

    cy.wait(5000);

    // Navigates to the courses page using the navbar
    cy.get('nav > div').contains('Courses').click();

    cy.wait(1000);

    // Selects the test course on the catalog
    cy.get('div').contains(courseTitle).click();

    // wait for redirect
    cy.url().should('include', `/courses/${courseSlug}`);
    cy.wait(1000);

    cy.get('h1').should('have.text', courseTitle);

    // Starting the course
    cy.get('a.chakra-button').first().contains('Start Course').click();
    cy.wait(2500);

    // First Lesson Overview
    cy.get('h1').should('have.text', 'Awareness');

    // Starting first lesson
    getButton().contains('Begin Lesson').click();
    cy.wait(2500);

    cy.get('span.chakra-heading')
      .first()
      .should('have.text', 'Lesson 1: Awareness');

    cy.url().then((url) => {
      const nextLessonButton = getNextButton();

      nextLessonButton.should('be.disabled');
      nextLessonButton.click({ force: true });
      cy.url().should('eq', url);
    });

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

    // Go to the Next Concept
    cy.url()
      .then((url) => {
        getNextButton().click();
        cy.url().should('not.eq', url);
      })
      .then(() => {
        cy.wait(3500);
        getNextButton().click();
      });

    // First lesson completed
    cy.get('p.chakra-heading')
      .contains('Congratulations!')
      .parent()
      .within(() => {
        cy.get('svg').should('have.class', 'fa-check-circle');
      });

    // Continue to Lesson 2
    getButton().contains('Continue').click();

    // Second Lesson Overview Page
    cy.get('h1').should('have.text', 'Society runs on information flows');
    getButton().contains('Begin Lesson').click();

    // Start Second Lesson
    cy.wait(750);
    cy.get('span.chakra-heading')
      .first()
      .should('have.text', 'Lesson 2: Information flows are everywhere');

    // Answer First Quiz
    cy.answerQuiz('Is this awesome?', 'Okay then', true);

    getNextButton().click();
    cy.wait(1000);

    cy.get('span.chakra-heading')
      .first()
      .should('have.text', 'Lesson 2: What is an information flow?');

    // Second Concept Quiz 01
    cy.answerQuiz('What is the right answer?', 'One');
    cy.answerQuiz("Here's my other question?", 'Yes', true);

    // Second Concept Quiz 02
    cy.answerQuiz('One more question?', 'Definitely', true);

    getNextButton().click();
    cy.wait(1000);

    // Third concept
    cy.scrollTo('bottom');
    getNextButton().click();
    cy.wait(1000);

    // Last Concept
    cy.scrollTo('bottom');
    getNextButton().click();
    cy.wait(1000);

    // Second lesson completed
    cy.get('p.chakra-heading')
      .contains('Congratulations!')
      .parent()
      .within(() => {
        cy.get('svg').should('have.class', 'fa-check-circle');
      });

    // Continue to the final lesson
    getButton().contains('Continue').click();

    // Begin the final lesson
    getButton().contains('Begin Lesson').click();

    cy.wait(750);
    cy.get('span.chakra-heading')
      .first()
      .should('have.text', 'Lesson 3: Just some other concept');

    cy.scrollTo('bottom');
    getNextButton().click();
    cy.wait(1000);

    // Answer the last quiz
    cy.answerQuiz('Last quiz question?', 'I think so!', true);
    cy.scrollTo('bottom');
    getNextButton().click();
    cy.wait(1000);

    // Continue to the final project
    getButton().contains('Continue').click();

    // Navigate Between project Tabs
    getButton().contains('Begin').click();
    getButton().contains('2. Rubric').click();
    getButton().contains('3. Submission').click();

    // Submit the project
    getButton().contains('Submit').click();

    // Await for the 'approve' sign and be happy...
  });

  it('pause a course in a lesson and resume', () => {
    const { title: courseTitle, slug: courseSlug } = TEST_COURSE;

    cy.wait(5000);

    // Navigates to the courses page using the navbar
    cy.get('nav > div').contains('Courses').click();

    cy.wait(1000);

    // Selects the test course on the catalog
    cy.get('div').contains(courseTitle).click();

    // wait for redirect
    cy.url().should('include', `/courses/${courseSlug}`);
    cy.wait(1000);

    cy.get('h1').should('have.text', courseTitle);

    // Starting the course
    cy.get('a.chakra-button').first().contains('Start Course').click();
    cy.wait(1000);

    // First Lesson Overview
    cy.get('h1').should('have.text', 'Awareness');

    // Starting first lesson
    getButton().contains('Begin Lesson').click();
    cy.wait(5000);

    cy.get('span.chakra-heading')
      .first()
      .should('have.text', 'Lesson 1: Awareness');

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

    // Pause and continue the same concept
    cy.url().then((url) => {
      getNextButton().click();
      cy.url().should('not.eq', url);

      cy.url().then((url) => {
        cy.visit('/');
        cy.visit('/courses/');

        cy.url().should('include', `/courses/${courseSlug}`);
        cy.wait(1000);

        cy.get('h1').should('have.text', courseTitle);
        cy.get('a.chakra-button').first().contains('Start Course').click();
        cy.wait(1000);
        cy.url().should('eq', url);
      });
    });
  });
});
