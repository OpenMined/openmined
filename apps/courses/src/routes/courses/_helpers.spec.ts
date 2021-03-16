import {
  hasStartedCourse,
  hasCompletedCourse,
  getLessonIndex,
  getLessonNumber,
  doesLessonExist,
  hasStartedLesson,
  hasCompletedLesson,
  getConceptIndex,
  getConceptNumber,
  doesConceptExist,
  hasStartedConcept,
  hasCompletedConcept,
  getProjectPartIndex,
  getProjectPartNumber,
  doesProjectPartExist,
  hasStartedProject,
  hasCompletedProject,
  hasStartedProjectPart,
  hasCompletedProjectPart,
  hasSubmittedProjectPart,
  hasReceivedProjectPartReview,
  hasRemainingProjectPartSubmissions,
  hasReceivedPassingProjectPartReview,
  hasReceivedFailingProjectPartReview,
  getProjectPartStatus,
  getProjectStatus,
  getNextAvailablePage,
  getCourseProgress,
  CourseProgress,
  isAllowedToAccessPage,
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

  describe('course progress', () => {
    it('use completed 1 lesson and 1 concept', () => {
      const user = {
        started_at: Date.now(),
        lessons: {
          'a-lesson': {
            started_at: Date.now(),
            concepts: {
              'a-1-concept': {
                started_at: Date.now(),
                completed_at: Date.now(),
              },
            },
            completed_at: Date.now(),
          },
          'b-lesson': {
            started_at: Date.now(),
          },
        },
      };
      const lessons = [
        { _id: 'a-lesson', concepts: [{ _id: 'a-1-concept' }] },
        { _id: 'b-lesson', concepts: [] },
      ];
      const projectParts = [{ _id: 'a-project-part' }];

      const courseProgress: CourseProgress = getCourseProgress(
        user,
        lessons,
        projectParts
      );
      expect(courseProgress.completedLessons).toBe(1);
      expect(courseProgress.completedConcepts).toBe(1);
      expect(courseProgress.completedProjectParts).toBe(0);
    });

    it('course progress', () => {
      const user = {
        started_at: Date.now(),
        lessons: {
          'a-lesson': {
            started_at: Date.now(),
            completed_at: Date.now(),
          },
          'b-lesson': {
            started_at: Date.now(),
            completed_at: Date.now(),
          },
        },
        project: {
          started_at: Date.now(),
          parts: {
            'a-project-part': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
          },
        },
      };
      const lessons = [
        { _id: 'a-lesson', concepts: [] },
        { _id: 'b-lesson', concepts: [] },
      ];
      const projectParts = [{ _key: 'a-project-part' }];

      const courseProgress: CourseProgress = getCourseProgress(
        user,
        lessons,
        projectParts
      );

      expect(courseProgress.completedProjectParts).toBe(1);
    });
  });
});

describe('project helpers', () => {
  it('can get correct project part index', () => {
    const part = '2nd-project-part';
    const projects = [
      { _key: '1st-project-part' },
      { _key: part },
      { _key: '3rd-project-part' },
    ];

    expect(getProjectPartIndex(projects, part)).toBe(1);
  });

  it('can get correct project part number', () => {
    const part = '2nd-project-part';
    const projects = [
      { _key: '1st-project-part' },
      { _key: part },
      { _key: '3rd-project-part' },
    ];

    expect(getProjectPartNumber(projects, part)).toBe(2);
  });

  it('user can only access project parts that exist', () => {
    const projects = [
      { _key: '1st-project-part' },
      { _key: '2nd-project-part' },
      { _key: '3rd-project-part' },
    ];

    expect(doesProjectPartExist(projects, '1st-project-part')).toBeTruthy();
    expect(doesProjectPartExist(projects, '2nd-project-part')).toBeTruthy();
    expect(doesProjectPartExist(projects, '3rd-project-part')).toBeTruthy();
    expect(doesProjectPartExist(projects, '4th-project-part')).toBeFalsy();
  });

  it('empty user has not started or completed project', () => {
    const user = {};

    expect(hasStartedProject(user)).toBeFalsy();
    expect(hasCompletedProject(user)).toBeFalsy();
  });

  it('user has started project', () => {
    const user = {
      started_at: Date.now(),
      project: {
        started_at: Date.now(),
      },
    };

    expect(hasStartedProject(user)).toBeTruthy();
    expect(hasCompletedProject(user)).toBeFalsy();
  });

  it('user has completed project', () => {
    const user = {
      started_at: Date.now(),
      project: {
        started_at: Date.now(),
        completed_at: Date.now(),
      },
    };

    expect(hasStartedProject(user)).toBeTruthy();
    expect(hasCompletedProject(user)).toBeTruthy();
  });

  it('empty user has not started or completed project part', () => {
    const part = '1st-project-part';
    const user = {};

    expect(hasStartedProjectPart(user, part)).toBeFalsy();
    expect(hasCompletedProjectPart(user, part)).toBeFalsy();
  });

  it('user has started project part', () => {
    const part = '1st-project-part';
    const user = {
      started_at: Date.now(),
      project: {
        started_at: Date.now(),
        parts: {
          [part]: {
            started_at: Date.now(),
          },
        },
      },
    };

    expect(hasStartedProjectPart(user, part)).toBeTruthy();
    expect(hasCompletedProjectPart(user, part)).toBeFalsy();
  });

  it('user has completed project part', () => {
    const part = '1st-project-part';
    const user = {
      started_at: Date.now(),
      project: {
        started_at: Date.now(),
        parts: {
          [part]: {
            started_at: Date.now(),
            submissions: [
              {
                submitted_at: Date.now(),
                status: 'failed',
                reviewed_at: Date.now(),
              },
              {
                submitted_at: Date.now(),
                status: 'passed',
                reviewed_at: Date.now(),
              },
            ],
            completed_at: Date.now(),
          },
        },
      },
    };

    expect(hasStartedProjectPart(user, part)).toBeTruthy();
    expect(hasCompletedProjectPart(user, part)).toBeTruthy();
  });

  it('user has submitted project part', () => {
    const part = '1st-project-part';
    const user = {
      started_at: Date.now(),
      project: {
        started_at: Date.now(),
        parts: {
          [part]: {
            started_at: Date.now(),
            submissions: [{ submitted_at: Date.now() }],
          },
        },
      },
    };

    expect(hasSubmittedProjectPart(user, part)).toBeTruthy();
  });

  it('user has received project part review', () => {
    const part = '1st-project-part';
    const user = {
      started_at: Date.now(),
      project: {
        started_at: Date.now(),
        parts: {
          [part]: {
            started_at: Date.now(),
            submissions: [
              {
                submitted_at: Date.now(),
                status: 'failed',
                reviewed_at: Date.now(),
              },
            ],
          },
        },
      },
    };

    expect(hasReceivedProjectPartReview(user, part)).toBeTruthy();
    expect(hasReceivedProjectPartReview(user, '2nd-project-part')).toBeFalsy();
  });

  it('user has remaining project part submissions', () => {
    const firstPart = '1st-project-part';
    const secondPart = '2nd-project-part';
    const user = {
      started_at: Date.now(),
      project: {
        started_at: Date.now(),
        parts: {
          [firstPart]: {
            started_at: Date.now(),
            submissions: [
              {
                submitted_at: Date.now(),
                status: 'passed',
                reviewed_at: Date.now(),
              },
            ],
          },
          [secondPart]: {
            started_at: Date.now(),
            submissions: [
              {
                submitted_at: Date.now(),
                status: 'failed',
                reviewed_at: Date.now(),
              },
              {
                submitted_at: Date.now(),
                status: 'failed',
                reviewed_at: Date.now(),
              },
              {
                submitted_at: Date.now(),
                status: 'failed',
                reviewed_at: Date.now(),
              },
            ],
          },
        },
      },
    };

    expect(hasRemainingProjectPartSubmissions(user, firstPart)).toBeTruthy();
    expect(hasRemainingProjectPartSubmissions(user, secondPart)).toBeFalsy();
  });

  it('user has received passing project part review', () => {
    const part = '1st-project-part';
    const user = {
      started_at: Date.now(),
      project: {
        started_at: Date.now(),
        parts: {
          [part]: {
            started_at: Date.now(),
            submissions: [
              {
                submitted_at: Date.now(),
                status: 'failed',
                reviewed_at: Date.now(),
              },
              {
                submitted_at: Date.now(),
                status: 'passed',
                reviewed_at: Date.now(),
              },
            ],
          },
        },
      },
    };

    expect(hasReceivedPassingProjectPartReview(user, part)).toBeTruthy();
    expect(
      hasReceivedPassingProjectPartReview(user, '2nd-project-part')
    ).toBeFalsy();
  });

  it('user has received failing project part review', () => {
    const part = '1st-project-part';
    const user = {
      started_at: Date.now(),
      project: {
        started_at: Date.now(),
        parts: {
          [part]: {
            started_at: Date.now(),
            submissions: [
              {
                submitted_at: Date.now(),
                status: 'failed',
                reviewed_at: Date.now(),
              },
              {
                submitted_at: Date.now(),
                status: 'passed',
                reviewed_at: Date.now(),
              },
            ],
          },
        },
      },
    };

    expect(hasReceivedFailingProjectPartReview(user, part)).toBeTruthy();
    expect(
      hasReceivedFailingProjectPartReview(user, '2nd-project-part')
    ).toBeFalsy();
  });

  it('user has not started the project part', () => {
    const user = {
      started_at: Date.now(),
      project: {
        started_at: Date.now(),
        parts: {
          '1st-project-part': {
            started_at: Date.now(),
            completed_at: Date.now(),
          },
        },
      },
    };

    expect(getProjectPartStatus(user, '2nd-project-part')).toBe('not-started');
  });

  it('user has an in-progress project part', () => {
    const part = '1st-project-part';
    const user = {
      started_at: Date.now(),
      project: {
        started_at: Date.now(),
        parts: {
          [part]: {
            started_at: Date.now(),
          },
        },
      },
    };

    expect(getProjectPartStatus(user, part)).toBe('in-progress');
  });

  it('user has submitted a project part', () => {
    const part = '1st-project-part';
    const user = {
      started_at: Date.now(),
      project: {
        started_at: Date.now(),
        parts: {
          [part]: {
            started_at: Date.now(),
            submissions: [{ submitted_at: Date.now() }],
          },
        },
      },
    };

    expect(getProjectPartStatus(user, part)).toBe('submitted');
  });

  it('user has failed a project part', () => {
    const part = '1st-project-part';
    const user = {
      started_at: Date.now(),
      project: {
        started_at: Date.now(),
        parts: {
          [part]: {
            started_at: Date.now(),
            submissions: [
              {
                submitted_at: Date.now(),
                status: 'failed',
                reviewed_at: Date.now(),
              },
              {
                submitted_at: Date.now(),
                status: 'failed',
                reviewed_at: Date.now(),
              },
              {
                submitted_at: Date.now(),
                status: 'failed',
                reviewed_at: Date.now(),
              },
            ],
          },
        },
      },
    };

    expect(getProjectPartStatus(user, part)).toBe('failed');
  });

  it('user has failed a project part, but has more submissions', () => {
    const part = '1st-project-part';
    const user = {
      started_at: Date.now(),
      project: {
        started_at: Date.now(),
        parts: {
          [part]: {
            started_at: Date.now(),
            submissions: [
              {
                submitted_at: Date.now(),
                status: 'failed',
                reviewed_at: Date.now(),
              },
              {
                submitted_at: Date.now(),
                status: 'failed',
                reviewed_at: Date.now(),
              },
            ],
          },
        },
      },
    };

    expect(getProjectPartStatus(user, part)).toBe('failed-but-pending');
  });

  it('user has passed a project part', () => {
    const part = '1st-project-part';
    const user = {
      started_at: Date.now(),
      project: {
        started_at: Date.now(),
        parts: {
          [part]: {
            started_at: Date.now(),
            submissions: [
              {
                submitted_at: Date.now(),
                status: 'failed',
                reviewed_at: Date.now(),
              },
              {
                submitted_at: Date.now(),
                status: 'passed',
                reviewed_at: Date.now(),
              },
            ],
          },
        },
      },
    };

    expect(getProjectPartStatus(user, part)).toBe('passed');
  });

  it('user has not started a project', () => {
    const parts = [
      { _key: '1st-project-part' },
      { _key: '2nd-project-part' },
      { _key: '3rd-project-part' },
    ];
    const user = {
      started_at: Date.now(),
    };

    expect(getProjectStatus(user, parts)).toBe('not-started');
  });

  it('user has an in progress a project', () => {
    const parts = [
      { _key: '1st-project-part' },
      { _key: '2nd-project-part' },
      { _key: '3rd-project-part' },
    ];
    const user1 = {
      started_at: Date.now(),
      project: {
        started_at: Date.now(),
        parts: {
          '1st-project-part': {
            started_at: Date.now(),
            completed_at: Date.now(),
            submissions: [
              {
                submitted_at: Date.now(),
                status: 'passed',
                reviewed_at: Date.now(),
              },
            ],
          },
          '2nd-project-part': {
            started_at: Date.now(),
          },
        },
      },
    };
    const user2 = {
      started_at: Date.now(),
      project: {
        started_at: Date.now(),
        parts: {
          '1st-project-part': {
            started_at: Date.now(),
            completed_at: Date.now(),
            submissions: [
              {
                submitted_at: Date.now(),
                status: 'passed',
                reviewed_at: Date.now(),
              },
            ],
          },
          '2nd-project-part': {
            started_at: Date.now(),
            submissions: [
              {
                submitted_at: Date.now(),
                status: 'failed',
                reviewed_at: Date.now(),
              },
              {
                submitted_at: Date.now(),
                status: 'failed',
                reviewed_at: Date.now(),
              },
            ],
          },
        },
      },
    };
    const user3 = {
      started_at: Date.now(),
      project: {
        started_at: Date.now(),
        parts: {
          '1st-project-part': {
            started_at: Date.now(),
            completed_at: Date.now(),
            submissions: [
              {
                submitted_at: Date.now(),
                status: 'passed',
                reviewed_at: Date.now(),
              },
            ],
          },
          '2nd-project-part': {
            started_at: Date.now(),
            completed_at: Date.now(),
            submissions: [
              {
                submitted_at: Date.now(),
                status: 'failed',
                reviewed_at: Date.now(),
              },
              {
                submitted_at: Date.now(),
                status: 'passed',
                reviewed_at: Date.now(),
              },
            ],
          },
        },
      },
    };

    expect(getProjectStatus(user1, parts)).toBe('in-progress');
    expect(getProjectStatus(user2, parts)).toBe('in-progress');
    expect(getProjectStatus(user3, parts)).toBe('in-progress');
  });

  it('user has a passed a project', () => {
    const parts = [
      { _key: '1st-project-part' },
      { _key: '2nd-project-part' },
      { _key: '3rd-project-part' },
    ];
    const user = {
      started_at: Date.now(),
      project: {
        started_at: Date.now(),
        parts: {
          '1st-project-part': {
            started_at: Date.now(),
            completed_at: Date.now(),
            submissions: [
              {
                submitted_at: Date.now(),
                status: 'passed',
                reviewed_at: Date.now(),
              },
            ],
          },
          '2nd-project-part': {
            started_at: Date.now(),
            completed_at: Date.now(),
            submissions: [
              {
                submitted_at: Date.now(),
                status: 'failed',
                reviewed_at: Date.now(),
              },
              {
                submitted_at: Date.now(),
                status: 'passed',
                reviewed_at: Date.now(),
              },
            ],
          },
          '3rd-project-part': {
            started_at: Date.now(),
            completed_at: Date.now(),
            submissions: [
              {
                submitted_at: Date.now(),
                status: 'failed',
                reviewed_at: Date.now(),
              },
              {
                submitted_at: Date.now(),
                status: 'failed',
                reviewed_at: Date.now(),
              },
              {
                submitted_at: Date.now(),
                status: 'passed',
                reviewed_at: Date.now(),
              },
            ],
          },
        },
      },
    };

    expect(getProjectStatus(user, parts)).toBe('passed');
  });

  it('user has a failed a project', () => {
    const parts = [
      { _key: '1st-project-part' },
      { _key: '2nd-project-part' },
      { _key: '3rd-project-part' },
    ];
    const user = {
      started_at: Date.now(),
      project: {
        started_at: Date.now(),
        parts: {
          '1st-project-part': {
            started_at: Date.now(),
            completed_at: Date.now(),
            submissions: [
              {
                submitted_at: Date.now(),
                status: 'passed',
                reviewed_at: Date.now(),
              },
            ],
          },
          '2nd-project-part': {
            started_at: Date.now(),
            submissions: [
              {
                submitted_at: Date.now(),
                status: 'failed',
                reviewed_at: Date.now(),
              },
              {
                submitted_at: Date.now(),
                status: 'failed',
                reviewed_at: Date.now(),
              },
              {
                submitted_at: Date.now(),
                status: 'failed',
                reviewed_at: Date.now(),
              },
            ],
          },
        },
      },
    };

    expect(getProjectStatus(user, parts)).toBe('failed');
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

  it('user will be appropriately directed to the final lesson completion page', () => {
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
    expect(result.concept).toBe('complete');
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

describe('isAllowedToAccessPage', () => {
  it('when course is completed, it can access all pages', () => {
    const user = {
      started_at: Date.now(),
      completed_at: Date.now(),
      lessons: {
        'a-lesson': {
          started_at: Date.now(),
          completed_at: Date.now(),
          concepts: {
            'a-1-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
            'a-2-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
          },
        },
      },
      project: {
        started_at: Date.now(),
        completed_at: Date.now(),
        parts: {
          '1-project-part': {
            started_at: Date.now(),
            completed_at: Date.now(),
          },
        },
      },
    };
    const lessons = [
      {
        _id: 'a-lesson',
        concepts: [{ _id: 'a-1-concept' }, { _id: 'a-2-concept' }],
      },
    ];
    const course = 'demo-course';
    const suggestedPage = getNextAvailablePage(user, lessons);

    // courseComplete
    expect(
      isAllowedToAccessPage(
        'courseComplete',
        user,
        lessons,
        course,
        null,
        null,
        suggestedPage
      )
    ).toBe(true);

    // project
    expect(
      isAllowedToAccessPage(
        'project',
        user,
        lessons,
        course,
        'project',
        null,
        suggestedPage
      )
    ).toBe(true);

    // lessonComplete
    expect(
      isAllowedToAccessPage(
        'lessonComplete',
        user,
        lessons,
        course,
        'a-lesson',
        'a-1-concept',
        suggestedPage
      )
    ).toBe(true);

    // cannot access non existing lesson, should be false
    expect(
      isAllowedToAccessPage(
        'lesson',
        user,
        lessons,
        course,
        'non-existing-lesson',
        null,
        suggestedPage
      )
    ).toBe(false);

    // can access concept page
    expect(
      isAllowedToAccessPage(
        'concept',
        user,
        lessons,
        course,
        'a-lesson',
        'a-1-concept',
        suggestedPage
      )
    ).toBe(true);

    // false on non existing concept
    expect(
      isAllowedToAccessPage(
        'concept',
        user,
        lessons,
        course,
        'a-lesson',
        'does not exist',
        suggestedPage
      )
    ).toBe(false);
  });

  it('when all lessons are completed', () => {
    const user = {
      started_at: Date.now(),
      completed_at: Date.now(),
      lessons: {
        'a-lesson': {
          started_at: Date.now(),
          completed_at: Date.now(),
          concepts: {
            'a-1-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
            'a-2-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
          },
        },
      },
      project: {
        started_at: Date.now(),
        parts: {
          '1-project-part': {
            started_at: Date.now(),
          },
        },
      },
    };
    const lessons = [
      {
        _id: 'a-lesson',
        concepts: [{ _id: 'a-1-concept' }, { _id: 'a-2-concept' }],
      },
    ];
    const course = 'demo-course';
    const suggestedPage = getNextAvailablePage(user, lessons);

    // cannot access courseComplete
    expect(
      isAllowedToAccessPage(
        'courseComplete',
        user,
        lessons,
        course,
        null,
        null,
        suggestedPage
      )
    ).toBe(false);

    // can access project
    expect(
      isAllowedToAccessPage(
        'project',
        user,
        lessons,
        course,
        'project',
        null,
        suggestedPage
      )
    ).toBe(true);
    
    // can access projectSubmission
    expect(
      isAllowedToAccessPage(
        'projectSubmission',
        user,
        lessons,
        course,
        'project',
        '1-project-part',
        suggestedPage
      )
    ).toBe(true);

    // cannot access projectCompleted
    expect(
      isAllowedToAccessPage(
        'projectComplete',
        user,
        lessons,
        course,
        'project',
        'complete',
        suggestedPage
      )
    ).toBe(false);

    // can access lessonComplete
    expect(
      isAllowedToAccessPage(
        'lessonComplete',
        user,
        lessons,
        course,
        'a-lesson',
        'complete',
        suggestedPage
      )
    ).toBe(true);

    // cannot access non existing lesson, should be false
    expect(
      isAllowedToAccessPage(
        'lesson',
        user,
        lessons,
        course,
        'non-existing-lesson',
        null,
        suggestedPage
      )
    ).toBe(false);

    // can access concept page
    expect(
      isAllowedToAccessPage(
        'concept',
        user,
        lessons,
        course,
        'a-lesson',
        'a-1-concept',
        suggestedPage
      )
    ).toBe(true);

    // false on non existing concept
    expect(
      isAllowedToAccessPage(
        'concept',
        user,
        lessons,
        course,
        'a-lesson',
        'does not exist',
        suggestedPage
      )
    ).toBe(false);
  });

  it('when lessons and concepts are partially completed', () => {
    const user = {
      started_at: Date.now(),
      completed_at: Date.now(),
      lessons: {
        'a-lesson': {
          started_at: Date.now(),
          completed_at: Date.now(),
          concepts: {
            'a-1-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
            'a-2-concept': {
              started_at: Date.now(),
              completed_at: Date.now(),
            },
          },
        },
        'b-lesson': {
          started_at: Date.now(),
          concepts: {
            'b-1-concept': {
              started_at: Date.now(),
            },
          },
        },
      },
      project: {
        started_at: Date.now(),
        parts: {
          '1-project-part': {
            started_at: Date.now(),
          },
        },
      },
    };
    const lessons = [
      {
        _id: 'a-lesson',
        concepts: [{ _id: 'a-1-concept' }, { _id: 'a-2-concept' }],
      },
      {
        _id: 'b-lesson',
        concepts: [{ _id: 'b-1-concept' }, { _id: 'b-2-concept' }],
      },
    ];
    const course = 'demo-course';
    const suggestedPage = getNextAvailablePage(user, lessons);

    // cannot access courseComplete
    expect(
      isAllowedToAccessPage(
        'courseComplete',
        user,
        lessons,
        course,
        null,
        null,
        suggestedPage
      )
    ).toBe(false);

    // cannot access project
    expect(
      isAllowedToAccessPage(
        'project',
        user,
        lessons,
        course,
        'project',
        null,
        suggestedPage
      )
    ).toBe(false);
    
    // cannot access projectSubmission
    expect(
      isAllowedToAccessPage(
        'projectSubmission',
        user,
        lessons,
        course,
        'project',
        '1-project-part',
        suggestedPage
      )
    ).toBe(false);

    // cannot access projectCompleted
    expect(
      isAllowedToAccessPage(
        'projectComplete',
        user,
        lessons,
        course,
        'project',
        'complete',
        suggestedPage
      )
    ).toBe(false);

    // can access lessonComplete for lessons completed
    expect(
      isAllowedToAccessPage(
        'lessonComplete',
        user,
        lessons,
        course,
        'a-lesson',
        'complete',
        suggestedPage
      )
    ).toBe(true);

    // cannot access non existing lesson, should be false
    expect(
      isAllowedToAccessPage(
        'lesson',
        user,
        lessons,
        course,
        'non-existing-lesson',
        null,
        suggestedPage
      )
    ).toBe(false);

    // can access concept page
    expect(
      isAllowedToAccessPage(
        'concept',
        user,
        lessons,
        course,
        'a-lesson',
        'a-1-concept',
        suggestedPage
      )
    ).toBe(true);

    // false on non existing concept
    expect(
      isAllowedToAccessPage(
        'concept',
        user,
        lessons,
        course,
        'a-lesson',
        'does not exist',
        suggestedPage
      )
    ).toBe(false);

    // false on lesson that is not completed
    expect(
      isAllowedToAccessPage(
        'lessonComplete',
        user,
        lessons,
        course,
        'b-lesson',
        'complete',
        suggestedPage
      )
    ).toBe(false);

    // false on concept that is not completed
    expect(
      isAllowedToAccessPage(
        'concept',
        user,
        lessons,
        course,
        'b-lesson',
        'b-2-concept',
        suggestedPage
      )
    ).toBe(false);

    // true on concept that should be started just before
    expect(
      isAllowedToAccessPage(
        'concept',
        user,
        lessons,
        course,
        'b-lesson',
        'b-1-concept',
        suggestedPage
      )
    ).toBe(true);
  });
});
