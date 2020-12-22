import * as firebase from 'firebase/app';

export namespace OpenMined {
  export type CoursePageWhich =
    | 'search'
    | 'overview'
    | 'courseComplete'
    | 'project'
    | 'projectSubmission'
    | 'projectComplete'
    | 'lesson'
    | 'lessonComplete'
    | 'concept';

  export type CoursePagesProp = {
    // query parameters
    concept: string;
    course: string;
    lesson: string;
    part: string;
    attempt: string;

    page: any;
    which: CoursePageWhich;
    user: firebase.User;
    progress: Course;
    ts: firebase.firestore.FieldValue;
  };

  export interface User {
    first_name: string;
    last_name: string;
    photo_url?: string;
    description?: string;
    website?: string;
    github?: string;
    twitter?: string;
    skill_level?: string;
    primary_language?: string;
    city?: string;
    country?: string;
    timezone?: string;
    is_mentor?: boolean;
  }

  export interface UserPrivate {
    github_access_token: string;
  }

  export type Course = {
    started_at?: firebase.firestore.Timestamp;
    completed_at?: firebase.firestore.Timestamp;
    project?: Project;
    lessons?: Lessons;
  };

  export type Lessons = {
    [lessonId: string]: Lesson;
  };

  export type Lesson = {
    started_at: firebase.firestore.Timestamp;
    completed_at?: firebase.firestore.Timestamp;
    concepts?: LessonConcepts;
  };

  export type LessonConcepts = {
    [conceptId: string]: LessonConcept;
  };

  export type LessonConcept = {
    started_at?: firebase.firestore.Timestamp;
    completed_at?: firebase.firestore.Timestamp;
    quizzes?: LessonConceptQuiz[];
  };

  export type LessonConceptQuiz = {
    correct: number;
    percentage: number;
    total: number;
  };

  export type Project = {
    started_at: firebase.firestore.Timestamp;
    completed_at?: firebase.firestore.Timestamp;
    status?: string;
    parts?: ProjectParts;
  };

  export type ProjectParts = {
    [partId: string]: ProjectPart;
  };

  export type ProjectPart = {
    started_at?: firebase.firestore.Timestamp;
    completed_at?: firebase.firestore.Timestamp;
    submissions: ProjectPartSubmission[];
  };

  export type ProjectPartSubmission = {
    id: string;
    course: string;
    part: string;
    attempt: number;
    student: firebase.firestore.DocumentReference;
    submitted_at: firebase.firestore.Timestamp;
    submission_content: string;
    mentor: firebase.firestore.DocumentReference | null;
    status: string | null;
    review_content: string | null;
    review_started_at: firebase.firestore.Timestamp | null;
    review_ended_at: firebase.firestore.Timestamp | null;
  };

  export type ProjectAttempt = {
    submitted_at: firebase.firestore.Timestamp;
    submission: firebase.firestore.DocumentReference;
    reviewed_at?: firebase.firestore.Timestamp;
    status?: string;
  };
}
