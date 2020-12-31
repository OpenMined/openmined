# TODOS

## Launch

We need to have the following items FINISHED BY LAUNCH on December 31st, 2020.

### Danny

- When I move from concept to concept, if I’ve completed a quiz on the previous page, the next page will have that quiz as completed... this is a bug. If you refresh, it’s fine. See Lesson 2, Concept 1, going into Lesson 2, Concept 2
- Also, I sometimes cannot see the previous submissions or feedback if it was done by a different mentor
- (This issue will likely be fixed by fixing #2) When on the submissions page as a mentor, I can go back to previous submissions and all the feedback is editable. It should not be.
- TODO (#21 HARD): Migrate all Sanity calls to be done via a Express.js-driven Firebase cloud HTTP (not callable) function. Make sure that Sanity is configured to only accept a connection via this endpoint, and NOT the website itself. This will ensure that students are not able to retrieve CMS data that they should not be allowed to see. Make sure to also implement caching on this data and set content freshness to be about 5 minutes.

### SLZ

- TODO (#17): Add the ability to upload an avatar to the `<BasicInformation />` page. Pretty straightforward. Perhaps also [use this Firebase extension to enable the resizing of avatars on the server-side... do 400x400](https://firebase.google.com/products/extensions/storage-resize-images)
- TODO: After adding the ability to upload an avatar, make sure that it's deleted in cloud storage using the delete extension

### Hericles

- Add a ton of Cypress tests

### Patrick

- When I move from concept to concept, if I've completed a quiz on the previous page, the next page will have that quiz as completed... this is a bug. If you refresh, it's fine. See Lesson 2, Concept 1, going into Lesson 2, Concept 2
- When on the submissions page as a mentor, I can go back to previous submissions and all the feedback is editable. It should not be.
- Also, I sometimes cannot see the previous submissions or feedback if it was done by a different mentor

## Pre-Launch Checklist

We need to have the following items FINISHED BY LAUNCH on December 31st, 2020. These items will be done by Patrick the days before we launch.

- Make sure to test the site on dev deployment
- Make sure all composite and single-field indexes have been properly created
- Make sure all functions and rules are deployed to production
- Make sure to search for any configurations, Firebase extensions, or anything that needs to be enabled on the production account first (to make it identical to the dev Firebase)
- Make sure all mentors are students and put all their ID's in the mentors collection

## Post-Launch

We can do the following items after the launch of the first course on December 31st, 2020.

- Create a README that's somewhat friendly to contributors
- Review PR: https://github.com/OpenMined/openmined/pull/42
- Get the rich text editor toolbar to scroll with you as you type down the page and the editor increases in size
- TODO (#16): We need to store the "number" of user that a user is in Firebase using a cloud function. All users have a hash-based index, which is fine, but we need to know when the number of users reaches a certain threshold since we only have space for a certain number of users. We should store this information on the User's Firestore document. Also - this has to work RETROACTIVELY for all existing users.
- TODO (#13 HARD): We need to get SSR working for the homepage and profile pages at minimum. I can't remember how to best do this with Firebase Functions, nor can I remember how to make it conditional for SOME of the pages. We'll also want to implement some sort of caching strategy for this. [I know that Firebase has some solutions around this already](https://www.youtube.com/watch?v=82tZAPMHfT4).
- TODO (#18): Redo the permissions gate to allow for projects and project parts with or without attempts. We probably need a "configuration" based strategy for this. Might be good to write some tests!!
- Change all links to use colorScheme instead of color once this issue is fixed: https://github.com/chakra-ui/chakra-ui/issues/2870
- TODO: Add tests for remaining helpers functions
- TODO (#19): Refactor the project accordion
- TODO (#20): Prevent mentors from being reassigned to the same review they just resigned from
- TODO (#24): Add pagination to My Activity on Mentor dashboard
- TODO (#22 HARD): Keep a running tally of the number of project submissions in the queue
- TODO (#23 HARD): Keep a running tally of the number of reviewed submissions and resigned submissions
- TODO (#8 HARD): Write the course helpers functions in the order in which they need to appear (per the flow of the course, not grouped by topic). That will make those rules much more readable. Secondly, you should ensure that the tests build on each other (i.e. testing completion of a lesson means testing the completion of all previous lessons and their respective concepts). You may need to modify the tests for this significantly.
- TODO (#9 HARD): Because the tests for the helpers are so long, perhaps write a few functions in the test logic to generate the users, courses, lessons, etc. It should save a lot on the number of lines of code in the file and make it much more readable.
- TODO (#10): Try to share a lot of logic between the courses' header and the main header. They share a LOT of logic and it would be good to make these reusable or combine them somehow.
- TODO (#12): I'd love for us to skin the video player. [Similar to what's being done here](https://plyr.io/). But that library, and all others, are HUGE and we can't afford to add them to our bundle size. Is there some lightweight way to do some basic YouTube video styling without a massive library?
- TODO (#14): Find some sort of way of getting cloud functions working locally and deployable without main field in package.json
- TODO (#15): Find some sort of way to serve Firebase functions and [run them in the shell locally](https://medium.com/mean-fire/nx-nrwl-firebase-functions-98f96f514055)
