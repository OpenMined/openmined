## Note about the Firebase data model

The following is the theoretical, and incomplete, data structure for the user's model in Firestore as it pertains to submissions and reviews:

### Student

- C: courses
  - D: [course]
    - C: submissions
      - D: [submission]
        - course
        - part
        - attempt
        - content (submission content)
        - submitted_at
        - REF: student
    - started_at
    - completed_at
    - project
      - started_at
      - completed_at
      - status
      - parts
        - [part]
          - started_at
          - completed_at
          - status
          - submissions (array)
            - submitted_at
            - REF: submission
          - reviews (array)
            - reviewed_at
            - status
            - REF: review

### Reviewer

- C: courses
  - D: [course]
    - C: reviews
      - D: [review]
        - course
        - part
        - status
        - content (review content)
        - submitted_at (submission creation time)
        - started_at (review started time)
        - ended_at (review ended time)
        - REF: student
        - REF: submission
