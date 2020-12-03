import {
  hasStartedCourse,
  hasCompletedCourse,
  hasStartedLesson,
  hasCompletedLesson,
  getLessonIndex,
  getLessonNumber,
  doesLessonExist,
  isLessonAvailable,
  getLastCompletedLesson,
  getConceptIndex,
  getConceptNumber,
  hasStartedConcept,
  hasCompletedConcept,
  doesConceptExist,
  isConceptAvailable,
  getLastCompletedConcept,
} from './index';

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

  it('user can only access available lessons', () => {
    const lessons = [
      { _id: '1st-lesson' },
      { _id: '2nd-lesson' },
      { _id: '3rd-lesson' },
    ];
    const user = {
      started_at: Date.now(),
      lessons: {
        '1st-lesson': {
          started_at: Date.now(),
          completed_at: Date.now(),
        },
        '2nd-lesson': {
          started_at: Date.now(),
        },
      },
    };

    expect(isLessonAvailable(user, lessons, '1st-lesson')).toBeTruthy();
    expect(isLessonAvailable(user, lessons, '2nd-lesson')).toBeTruthy();
    expect(isLessonAvailable(user, lessons, '3rd-lesson')).toBeFalsy();

    // Lesson doesn't even exist
    expect(isLessonAvailable(user, lessons, '4th-lesson')).toBeFalsy();
  });

  it('empty user will be directed to the first lesson', () => {
    const lessons = [
      { _id: '1st-lesson' },
      { _id: '2nd-lesson' },
      { _id: '3rd-lesson' },
    ];
    const user = {};

    expect(getLastCompletedLesson(user, lessons).lesson).toBe('1st-lesson');
    expect(getLastCompletedLesson(user, lessons).lesson).not.toBe('2nd-lesson');
    expect(getLastCompletedLesson(user, lessons).lesson).not.toBe('3rd-lesson');

    // Lesson doesn't even exist
    expect(getLastCompletedLesson(user, lessons).lesson).not.toBe('4th-lesson');
  });

  it('user can get their last completed lesson', () => {
    const lessons = [
      { _id: '1st-lesson' },
      { _id: '2nd-lesson' },
      { _id: '3rd-lesson' },
    ];
    const user = {
      started_at: Date.now(),
      lessons: {
        '1st-lesson': {
          started_at: Date.now(),
          completed_at: Date.now(),
        },
        '2nd-lesson': {
          started_at: Date.now(),
          completed_at: Date.now(),
        },
        '3rd-lesson': {
          started_at: Date.now(),
        },
      },
    };

    expect(getLastCompletedLesson(user, lessons).lesson).not.toBe('1st-lesson');
    expect(getLastCompletedLesson(user, lessons).lesson).toBe('2nd-lesson');
    expect(getLastCompletedLesson(user, lessons).lesson).not.toBe('3rd-lesson');

    // Lesson doesn't even exist
    expect(getLastCompletedLesson(user, lessons).lesson).not.toBe('4th-lesson');
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

  it('user can only access available concepts', () => {
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

    expect(
      isConceptAvailable(user, lessons, '1st-lesson', '1st-concept')
    ).toBeTruthy();
    expect(
      isConceptAvailable(user, lessons, '1st-lesson', '2nd-concept')
    ).toBeTruthy();
    expect(
      isConceptAvailable(user, lessons, '1st-lesson', '3rd-concept')
    ).toBeTruthy();

    // Concept doesn't even exist
    expect(
      isConceptAvailable(user, lessons, '1st-lesson', '4th-concept')
    ).toBeFalsy();

    expect(
      isConceptAvailable(user, lessons, '2nd-lesson', '1st-concept')
    ).toBeTruthy();
    expect(
      isConceptAvailable(user, lessons, '2nd-lesson', '2nd-concept')
    ).toBeTruthy();
    expect(
      isConceptAvailable(user, lessons, '2nd-lesson', '3rd-concept')
    ).toBeFalsy();

    // Concept doesn't even exist
    expect(
      isConceptAvailable(user, lessons, '2nd-lesson', '4th-concept')
    ).toBeFalsy();

    expect(
      isConceptAvailable(user, lessons, '3rd-lesson', '1st-concept')
    ).toBeFalsy();
    expect(
      isConceptAvailable(user, lessons, '3rd-lesson', '2nd-concept')
    ).toBeFalsy();
    expect(
      isConceptAvailable(user, lessons, '3rd-lesson', '3rd-concept')
    ).toBeFalsy();

    // Concept doesn't even exist
    expect(
      isConceptAvailable(user, lessons, '3rd-lesson', '4th-concept')
    ).toBeFalsy();

    // Lesson doesn't even exist
    expect(
      isConceptAvailable(user, lessons, '4th-lesson', '1st-concept')
    ).toBeFalsy();
    expect(
      isConceptAvailable(user, lessons, '4th-lesson', '2nd-concept')
    ).toBeFalsy();
    expect(
      isConceptAvailable(user, lessons, '4th-lesson', '3rd-concept')
    ).toBeFalsy();
    expect(
      isConceptAvailable(user, lessons, '4th-lesson', '4th-concept')
    ).toBeFalsy();
  });

  it('empty user will be directed to the first lesson and first concept', () => {
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

    const result = getLastCompletedConcept(user, lessons);

    expect(result).toEqual({ lesson: '1st-lesson', concept: '1st-concept' });
    expect(result).not.toEqual({
      lesson: '1st-lesson',
      concept: '2nd-concept',
    });
    expect(result).not.toEqual({
      lesson: '1st-lesson',
      concept: '3rd-concept',
    });
    expect(result).not.toEqual({
      lesson: '1st-lesson',
      concept: '4th-concept',
    });

    expect(result).not.toEqual({
      lesson: '2nd-lesson',
      concept: '1st-concept',
    });
    expect(result).not.toEqual({
      lesson: '2nd-lesson',
      concept: '2nd-concept',
    });
    expect(result).not.toEqual({
      lesson: '2nd-lesson',
      concept: '3rd-concept',
    });
    expect(result).not.toEqual({
      lesson: '2nd-lesson',
      concept: '4th-concept',
    });

    expect(result).not.toEqual({
      lesson: '3rd-lesson',
      concept: '1st-concept',
    });
    expect(result).not.toEqual({
      lesson: '3rd-lesson',
      concept: '2nd-concept',
    });
    expect(result).not.toEqual({
      lesson: '3rd-lesson',
      concept: '3rd-concept',
    });
    expect(result).not.toEqual({
      lesson: '3rd-lesson',
      concept: '4th-concept',
    });

    expect(result).not.toEqual({
      lesson: '4th-lesson',
      concept: '1st-concept',
    });
    expect(result).not.toEqual({
      lesson: '4th-lesson',
      concept: '2nd-concept',
    });
    expect(result).not.toEqual({
      lesson: '4th-lesson',
      concept: '3rd-concept',
    });
    expect(result).not.toEqual({
      lesson: '4th-lesson',
      concept: '4th-concept',
    });
  });

  it('user can get their last completed concept', () => {
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

    const result = getLastCompletedConcept(user, lessons);

    expect(result).not.toEqual({
      lesson: '1st-lesson',
      concept: '1st-concept',
    });
    expect(result).not.toEqual({
      lesson: '1st-lesson',
      concept: '2nd-concept',
    });
    expect(result).not.toEqual({
      lesson: '1st-lesson',
      concept: '3rd-concept',
    });

    // Concept doesn't even exist
    expect(result).not.toEqual({
      lesson: '1st-lesson',
      concept: '4th-concept',
    });

    // THIS IS THE ONE
    expect(result).toEqual({
      lesson: '2nd-lesson',
      concept: '1st-concept',
    });

    expect(result).not.toEqual({
      lesson: '2nd-lesson',
      concept: '2nd-concept',
    });
    expect(result).not.toEqual({
      lesson: '2nd-lesson',
      concept: '3rd-concept',
    });

    // Concept doesn't even exist
    expect(result).not.toEqual({
      lesson: '2nd-lesson',
      concept: '4th-concept',
    });

    expect(result).not.toEqual({
      lesson: '3rd-lesson',
      concept: '1st-concept',
    });
    expect(result).not.toEqual({
      lesson: '3rd-lesson',
      concept: '2nd-concept',
    });
    expect(result).not.toEqual({
      lesson: '3rd-lesson',
      concept: '3rd-concept',
    });

    // Concept doesn't even exist
    expect(result).not.toEqual({
      lesson: '3rd-lesson',
      concept: '4th-concept',
    });

    // Lesson doesn't even exist
    expect(result).not.toEqual({
      lesson: '4th-lesson',
      concept: '1st-concept',
    });
    expect(result).not.toEqual({
      lesson: '4th-lesson',
      concept: '2nd-concept',
    });
    expect(result).not.toEqual({
      lesson: '4th-lesson',
      concept: '3rd-concept',
    });
    expect(result).not.toEqual({
      lesson: '4th-lesson',
      concept: '4th-concept',
    });
  });
});
