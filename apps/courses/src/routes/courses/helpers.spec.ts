import {
  hasStartedCourse,
  hasCompletedCourse,
  hasStartedLesson,
  hasCompletedLesson,
  getLessonIndex,
  getLessonNumber,
  doesLessonExist,
  getConceptIndex,
  getConceptNumber,
  hasStartedConcept,
  hasCompletedConcept,
  doesConceptExist,
  getNextAvailablePage,
} from './_helpers';

describe('course helpers', () => {
  it('empty user has not started or completed course', () => {
    const user = {};

    expect(hasStartedCourse(user)).toBeFalsy();
    expect(hasCompletedCourse(user)).toBeFalsy();
  });

  it('user has started course', () => {
    const user = {
      started_at: Date.now(),
    };

    expect(hasStartedCourse(user)).toBeTruthy();
    expect(hasCompletedCourse(user)).toBeFalsy();
  });

  it('user has completed course', () => {
    const user = {
      started_at: Date.now(),
      completed_at: Date.now(),
    };

    expect(hasStartedCourse(user)).toBeTruthy();
    expect(hasCompletedCourse(user)).toBeTruthy();
  });
});

describe('lesson helpers', () => {
  it('can get correct lesson index', () => {
    const lesson = '2nd-lesson';
    const lessons = [
      { _id: '1st-lesson' },
      { _id: lesson },
      { _id: '3rd-lesson' },
    ];

    expect(getLessonIndex(lessons, lesson)).toBe(1);
  });

  it('can get correct lesson number', () => {
    const lesson = '2nd-lesson';
    const lessons = [
      { _id: '1st-lesson' },
      { _id: lesson },
      { _id: '3rd-lesson' },
    ];

    expect(getLessonNumber(lessons, lesson)).toBe(2);
  });

  it('empty user has not started or completed lesson', () => {
    const lesson = 'privacy-and-security';
    const user = {};

    expect(hasStartedLesson(user, lesson)).toBeFalsy();
    expect(hasCompletedLesson(user, lesson)).toBeFalsy();
  });

  it('user has started lesson', () => {
    const lesson = 'privacy-and-security';
    const user = {
      started_at: Date.now(),
      lessons: {
        [lesson]: {
          started_at: Date.now(),
        },
      },
    };

    expect(hasStartedLesson(user, lesson)).toBeTruthy();
    expect(hasCompletedLesson(user, lesson)).toBeFalsy();
  });

  it('user has completed lesson', () => {
    const lesson = 'privacy-and-security';
    const user = {
      started_at: Date.now(),
      lessons: {
        [lesson]: {
          started_at: Date.now(),
          completed_at: Date.now(),
        },
      },
    };

    expect(hasStartedLesson(user, lesson)).toBeTruthy();
    expect(hasCompletedLesson(user, lesson)).toBeTruthy();
  });

  it('user can only access lessons that exist', () => {
    const lessons = [
      { _id: '1st-lesson' },
      { _id: '2nd-lesson' },
      { _id: '3rd-lesson' },
    ];

    expect(doesLessonExist(lessons, '1st-lesson')).toBeTruthy();
    expect(doesLessonExist(lessons, '2nd-lesson')).toBeTruthy();
    expect(doesLessonExist(lessons, '3rd-lesson')).toBeTruthy();
    expect(doesLessonExist(lessons, '4th-lesson')).toBeFalsy();
  });
});

describe('concept helpers', () => {
  it('can get correct concept index', () => {
    const lesson = '2nd-lesson';
    const concept = '2nd-concept';
    const lessons = [
      {
        _id: '1st-lesson',
        concepts: [
          { _id: '1st-concept' },
          { _id: '2nd-concept' },
          { _id: '3rd-concept' },
        ],
      },
      {
        _id: lesson,
        concepts: [
          { _id: '1st-concept' },
          { _id: '2nd-concept' },
          { _id: '3rd-concept' },
        ],
      },
      {
        _id: '3rd-lesson',
        concepts: [
          { _id: '1st-concept' },
          { _id: '2nd-concept' },
          { _id: '3rd-concept' },
        ],
      },
    ];

    expect(getConceptIndex(lessons, lesson, concept)).toBe(1);
  });

  it('can get correct concept number', () => {
    const lesson = '2nd-lesson';
    const concept = '2nd-concept';
    const lessons = [
      {
        _id: '1st-lesson',
        concepts: [
          { _id: '1st-concept' },
          { _id: '2nd-concept' },
          { _id: '3rd-concept' },
        ],
      },
      {
        _id: lesson,
        concepts: [
          { _id: '1st-concept' },
          { _id: '2nd-concept' },
          { _id: '3rd-concept' },
        ],
      },
      {
        _id: '3rd-lesson',
        concepts: [
          { _id: '1st-concept' },
          { _id: '2nd-concept' },
          { _id: '3rd-concept' },
        ],
      },
    ];

    expect(getConceptNumber(lessons, lesson, concept)).toBe(2);
  });

  it('empty user has not started or completed concept', () => {
    const lesson = 'privacy-and-security';
    const concept = 'some-concept';
    const user = {};

    expect(hasStartedConcept(user, lesson, concept)).toBeFalsy();
    expect(hasCompletedConcept(user, lesson, concept)).toBeFalsy();
  });

  it('user has started concept', () => {
    const lesson = 'privacy-and-security';
    const concept = 'some-concept';
    const user = {
      started_at: Date.now(),
      lessons: {
        [lesson]: {
          started_at: Date.now(),
          concepts: {
            [concept]: {
              started_at: Date.now(),
            },
          },
        },
      },
    };

    expect(hasStartedConcept(user, lesson, concept)).toBeTruthy();
    expect(hasCompletedConcept(user, lesson, concept)).toBeFalsy();
  });

  it('user has completed concept', () => {
    const lesson = 'privacy-and-security';
    const concept = 'some-concept';
    const user = {
      started_at: Date.now(),
      lessons: {
        [lesson]: {
          started_at: Date.now(),
          concepts: {
            [concept]: {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
          },
        },
      },
    };

    expect(hasStartedConcept(user, lesson, concept)).toBeTruthy();
    expect(hasCompletedConcept(user, lesson, concept)).toBeTruthy();
  });

  it('user can only access lessons that exist', () => {
    const lessons = [
      {
        _id: '1st-lesson',
        concepts: [
          { _id: '1st-concept' },
          { _id: '2nd-concept' },
          { _id: '3rd-concept' },
        ],
      },
      {
        _id: '2nd-lesson',
        concepts: [
          { _id: '1st-concept' },
          { _id: '2nd-concept' },
          { _id: '3rd-concept' },
        ],
      },
      {
        _id: '3rd-lesson',
        concepts: [
          { _id: '1st-concept' },
          { _id: '2nd-concept' },
          { _id: '3rd-concept' },
        ],
      },
    ];

    expect(doesConceptExist(lessons, '1st-lesson', '1st-concept')).toBeTruthy();
    expect(doesConceptExist(lessons, '1st-lesson', '2nd-concept')).toBeTruthy();
    expect(doesConceptExist(lessons, '1st-lesson', '3rd-concept')).toBeTruthy();
    expect(doesConceptExist(lessons, '1st-lesson', '4th-concept')).toBeFalsy();

    expect(doesConceptExist(lessons, '2nd-lesson', '1st-concept')).toBeTruthy();
    expect(doesConceptExist(lessons, '2nd-lesson', '2nd-concept')).toBeTruthy();
    expect(doesConceptExist(lessons, '2nd-lesson', '3rd-concept')).toBeTruthy();
    expect(doesConceptExist(lessons, '2nd-lesson', '4th-concept')).toBeFalsy();

    expect(doesConceptExist(lessons, '3rd-lesson', '1st-concept')).toBeTruthy();
    expect(doesConceptExist(lessons, '3rd-lesson', '2nd-concept')).toBeTruthy();
    expect(doesConceptExist(lessons, '3rd-lesson', '3rd-concept')).toBeTruthy();
    expect(doesConceptExist(lessons, '3rd-lesson', '4th-concept')).toBeFalsy();

    expect(doesConceptExist(lessons, '4th-lesson', '1st-concept')).toBeFalsy();
    expect(doesConceptExist(lessons, '4th-lesson', '2nd-concept')).toBeFalsy();
    expect(doesConceptExist(lessons, '4th-lesson', '3rd-concept')).toBeFalsy();
    expect(doesConceptExist(lessons, '4th-lesson', '4th-concept')).toBeFalsy();
  });
});

describe('page helpers', () => {
  it('empty user will be appropriately directed to the lesson initiation page', () => {
    const lessons = [
      {
        _id: '1st-lesson',
        concepts: [
          { _id: '1st-concept' },
          { _id: '2nd-concept' },
          { _id: '3rd-concept' },
        ],
      },
      {
        _id: '2nd-lesson',
        concepts: [
          { _id: '1st-concept' },
          { _id: '2nd-concept' },
          { _id: '3rd-concept' },
        ],
      },
      {
        _id: '3rd-lesson',
        concepts: [
          { _id: '1st-concept' },
          { _id: '2nd-concept' },
          { _id: '3rd-concept' },
        ],
      },
    ];
    const user = {};

    const result = getNextAvailablePage(user, lessons);

    expect(result.lesson).toBe('1st-lesson');
    expect(result.concept).toBe(null);
  });

  it('user will be appropriately directed to the first available concept', () => {
    const lessons = [
      {
        _id: '1st-lesson',
        concepts: [
          { _id: '1st-concept' },
          { _id: '2nd-concept' },
          { _id: '3rd-concept' },
        ],
      },
      {
        _id: '2nd-lesson',
        concepts: [
          { _id: '1st-concept' },
          { _id: '2nd-concept' },
          { _id: '3rd-concept' },
        ],
      },
      {
        _id: '3rd-lesson',
        concepts: [
          { _id: '1st-concept' },
          { _id: '2nd-concept' },
          { _id: '3rd-concept' },
        ],
      },
    ];
    const user = {
      started_at: Date.now(),
      lessons: {
        '1st-lesson': {
          started_at: Date.now(),
          completed_at: Date.now(),
          concepts: {
            '1st-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
            '2nd-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
            '3rd-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
          },
        },
        '2nd-lesson': {
          started_at: Date.now(),
          concepts: {
            '1st-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
            '2nd-concept': {
              started_at: Date.now(),
            },
          },
        },
      },
    };

    const result = getNextAvailablePage(user, lessons);

    expect(result.lesson).toBe('2nd-lesson');
    expect(result.concept).toBe('2nd-concept');
  });

  it('user will be appropriately directed to the lesson completion page', () => {
    const lessons = [
      {
        _id: '1st-lesson',
        concepts: [
          { _id: '1st-concept' },
          { _id: '2nd-concept' },
          { _id: '3rd-concept' },
        ],
      },
      {
        _id: '2nd-lesson',
        concepts: [
          { _id: '1st-concept' },
          { _id: '2nd-concept' },
          { _id: '3rd-concept' },
        ],
      },
      {
        _id: '3rd-lesson',
        concepts: [
          { _id: '1st-concept' },
          { _id: '2nd-concept' },
          { _id: '3rd-concept' },
        ],
      },
    ];
    const user = {
      started_at: Date.now(),
      lessons: {
        '1st-lesson': {
          started_at: Date.now(),
          completed_at: Date.now(),
          concepts: {
            '1st-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
            '2nd-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
            '3rd-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
          },
        },
        '2nd-lesson': {
          started_at: Date.now(),
          concepts: {
            '1st-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
            '2nd-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
            '3rd-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
          },
        },
      },
    };

    const result = getNextAvailablePage(user, lessons);

    expect(result.lesson).toBe('2nd-lesson');
    expect(result.concept).toBe('complete');
  });

  it('user will be appropriately directed to the lesson initiation page', () => {
    const lessons = [
      {
        _id: '1st-lesson',
        concepts: [
          { _id: '1st-concept' },
          { _id: '2nd-concept' },
          { _id: '3rd-concept' },
        ],
      },
      {
        _id: '2nd-lesson',
        concepts: [
          { _id: '1st-concept' },
          { _id: '2nd-concept' },
          { _id: '3rd-concept' },
        ],
      },
      {
        _id: '3rd-lesson',
        concepts: [
          { _id: '1st-concept' },
          { _id: '2nd-concept' },
          { _id: '3rd-concept' },
        ],
      },
    ];
    const user = {
      started_at: Date.now(),
      lessons: {
        '1st-lesson': {
          started_at: Date.now(),
          completed_at: Date.now(),
          concepts: {
            '1st-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
            '2nd-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
            '3rd-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
          },
        },
        '2nd-lesson': {
          started_at: Date.now(),
          completed_at: Date.now(),
          concepts: {
            '1st-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
            '2nd-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
            '3rd-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
          },
        },
      },
    };

    const result = getNextAvailablePage(user, lessons);

    expect(result.lesson).toBe('3rd-lesson');
    expect(result.concept).toBe(null);
  });

  it('user will be appropriately directed to the project page', () => {
    const lessons = [
      {
        _id: '1st-lesson',
        concepts: [
          { _id: '1st-concept' },
          { _id: '2nd-concept' },
          { _id: '3rd-concept' },
        ],
      },
      {
        _id: '2nd-lesson',
        concepts: [
          { _id: '1st-concept' },
          { _id: '2nd-concept' },
          { _id: '3rd-concept' },
        ],
      },
      {
        _id: '3rd-lesson',
        concepts: [
          { _id: '1st-concept' },
          { _id: '2nd-concept' },
          { _id: '3rd-concept' },
        ],
      },
    ];
    const user = {
      started_at: Date.now(),
      lessons: {
        '1st-lesson': {
          started_at: Date.now(),
          completed_at: Date.now(),
          concepts: {
            '1st-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
            '2nd-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
            '3rd-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
          },
        },
        '2nd-lesson': {
          started_at: Date.now(),
          completed_at: Date.now(),
          concepts: {
            '1st-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
            '2nd-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
            '3rd-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
          },
        },
        '3rd-lesson': {
          started_at: Date.now(),
          completed_at: Date.now(),
          concepts: {
            '1st-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
            '2nd-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
            '3rd-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
          },
        },
      },
    };

    const result = getNextAvailablePage(user, lessons);

    expect(result.lesson).toBe('project');
    expect(result.concept).toBe(null);
  });
});
