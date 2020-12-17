import * as firebase from 'firebase/app';

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
}

export namespace Course {
  export type ProjectSubmission = {
    attempt: number;
    content: string;
    course: string;
    part: string;
    student: firebase.firestore.DocumentReference;
    submitted_at: firebase.firestore.Timestamp;
  };

  export type ProjectAttempt = {
    submitted_at: firebase.firestore.Timestamp;
    submission: firebase.firestore.DocumentReference;
    content: any;
  };
}
