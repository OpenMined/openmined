# Note about the Firebase data model

The following is the theoretical, and incomplete, data structure for the user's model in Firestore as it pertains to submissions and reviews:

- C: users
  - D: [user]
    - C: courses
      - D: [course]
        - C: submissions
          - D: [submission]
            - course
            - part
            - attempt
            - submission_content
            - submitted_at
            - REF: student
            <!-- Start added by mentor -->
            - REF: mentor
            - status
            - review_content (review content)
            - review_started_at (review started time)
            - review_ended_at (review ended time)
            <!-- End added by mentor -->
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
                <!-- Start added by mentor -->
                - reviewed_at
                - status
                - REF: submission
                <!-- End added by mentor -->
