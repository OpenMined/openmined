# TODOS

## Launch

We need to have the following items FINISHED BY LAUNCH on December 31st, 2020.

### Danny

- TODO (HARD): Add a ton of security rules (make sure to reference the \_helpers.ts file!!!)
- TODO (HARD): Write tests for all security rules (make sure to use the emulator!)
- Downgrade to React 17... make sure that we handle `<Suspense>` (which will now be unavailable) gracefully and show the loader. Also double check that the Slate editor is fixed when we downgrade. Also try to revert Thiago's PR related to Radios and Checkboxes if downgrading to React 17 fixes the problem: https://github.com/OpenMined/openmined/pull/31
- TODO: When using our RichTextEditor, if you type then eventually your cursor gets out of place
- Add a ton of Cypress tests
- We have a ton of problems with network requests and race conditions. For instance, signing up will redirect to the profile page where your name is empty. If you refresh the page, your name shows up. This type of behavior is present on basically every single page and is why we use window.location.href in a lot of places. It would be better to rely on client-side navigation if we could ensure that all rendering logic properly waited for the appropriate network requests to load. Can we implement this?

### SLZ

- TODO (#3): Create a custom `<Icon />` component that automates the `as` prop and also prefers the sizing of the Chakra theme using `boxSize` instead of the `size` props provided by React-FontAwesome. Convert all icons to use this custom component and then swap out their `size` for the appropriate `boxSize` in Chakra.
- TODO (#2): Add the support for links to the rich text editor, [basically just do this](https://www.slatejs.org/examples/links)
- TODO: After adding the ability to upload an avatar, make sure that it's deleted in cloud storage using the delete extension
- TODO (#17): Add the ability to upload an avatar to the `<BasicInformation />` page. Pretty straightforward. Perhaps also [use this Firebase extension to enable the resizing of avatars on the server-side... do 400x400](https://firebase.google.com/products/extensions/storage-resize-images)

### Patrick

- Finish doing a final design overview for the following pages: course overview, lesson, concept, lesson-complete, project, project-submissions, project-complete, and course-complete... after this, everything visual for the site will be "finished"
- Make sure a mentor cannot report a review after the time is up
- Figure out how to reassign a review after 4 hour time limit is reached
- Research ways to tighten security for Sanity API, ensuring that users cannot use it to cheat or view unreleased course material
- Redo the permissions gate to allow for projects and project parts with or without attempts. We probably need a "configuration" based strategy for this. Might be good to write some tests!!
- Refactor all of the "complete" pages to share a bunch of logic, because they all basically look the same
- Wrap up all TS errors if they exist
- TODO: [Use the following Firebase extension](https://firebase.google.com/products/extensions/firestore-send-email) to send a variety of emails, including, but not limited to: sign up confirmation, welcome to the course, and when you receive a project review. Maybe work with Patrick on this.
- TODO: In relation to the last one, make sure to include some of these emails as "opt-out"-able from a page we need to make on the [Account Settings page called "Notification Preferences"](https://www.figma.com/file/qravzmnQ0ESokNMhMVU9Zk/Wireframes?node-id=937%3A415). Maybe work with Patrick on this.

### Available issues (general)

- TODO (HARD): [Use the following Firebase extension](https://firebase.google.com/products/extensions/firestore-counter) to count a variety of metrics to a `metrics` collection at the top-level. Make sure to block this collection from being written to by anyone else except the function. This should include a variety of useful information, such as, but not limited to: number of user signups (through Github, through email, and total), number of user deletions, number of courses started, number of lessons started, number of concepts started, number of courses completed, number of lessons completed, number of concepts completed, number of projects started, number of projects passed, number of projects failed, etc. Maybe work with Patrick on this.

### Available issues (specific)

- TODO (#13 HARD): We need to get SSR working for the homepage and profile pages at minimum. I can't remember how to best do this with Firebase Functions, nor can I remember how to make it conditional for SOME of the pages. We'll also want to implement some sort of caching strategy for this. [I know that Firebase has some solutions around this already](https://www.youtube.com/watch?v=82tZAPMHfT4).
- TODO (#16): We need to store the "number" of user that a user is in Firebase using a cloud function. All users have a hash-based index, which is fine, but we need to know when the number of users reaches a certain threshold since we only have space for a certain number of users. We should store this information on the User's Firestore document. Also - this has to work RETROACTIVELY for all existing users.

## Pre-Launch Checklist

We need to have the following items FINISHED BY LAUNCH on December 31st, 2020. These items will be done by Patrick the days before we launch.

- Get real terms of service and privacy policy copy
- Do an overview of the entire website to see how many calls we're making on each page
- Take down Discourse and integate Spectrum with Slack (https://spectrum.chat/openmined/settings) and then invite the entire Slack community - make sure to replace all the https://discussion.openmined.org links with the Spectrum link
- Make sure to test the site on dev deployment
- Make sure all functions and rules are deployed to production
- Make sure to search for any configurations, Firebase extensions, or anything that needs to be enabled on the production account first (to make it identical to the dev Firebase)
- Make an "intro to the CMS" video to give to Mat, Andrew, and Emma (and make sure to explain that filling in EVERY field is critical - if they can't fill in some, tell them to ask Patrick what to do)
- Go back through the designs and make sure things are as accurate as possible, get final approval from Kyoko
- Do a complete sweep of all content and make sure Mat and Andrew have signoff
- Get Yemi and Sourav to populate the Discourse forum with a channel structure
- Make sure all mentors are students and put all their ID's in the mentors collection

## Post-Launch

We can do the following items after the launch of the first course on December 31st, 2020.

- Change all links to use colorScheme instead of color once this issue is fixed: https://github.com/chakra-ui/chakra-ui/issues/2870
- TODO (#8 HARD): Write the course helpers functions in the order in which they need to appear (per the flow of the course, not grouped by topic). That will make those rules much more readable. Secondly, you should ensure that the tests build on each other (i.e. testing completion of a lesson means testing the completion of all previous lessons and their respective concepts). You may need to modify the tests for this significantly.
- TODO (#9 HARD): Because the tests for the helpers are so long, perhaps write a few functions in the test logic to generate the users, courses, lessons, etc. It should save a lot on the number of lines of code in the file and make it much more readable.
- TODO (#10): Try to share a lot of logic between the courses' header and the main header. They share a LOT of logic and it would be good to make these reusable or combine them somehow.
- TODO (#11 HARD): We absolutely should be using the useFirestoreDocData (the one with snapshot listeners that always gets new data, rather than the one that gets it once: useFirestoreDocDataOnce) function instead on the main `<CoursePage />` page. However, if we do this, we'll need to add a "check" to the concept page to make sure to check if the DB has been updated for concepts though so that we don't write to the DB 2,000 times a minute! After we do this, we can switch all instances of "window.location.href = " and "window.location.reload()" to use instead "smooth scroll" to the top of the page and use the "useNavigate()" hook in react-router... this would look way better when navigating through the course, but I've had problems with the permissions working when using this because the update from Firebase arrives AFTER the following page load, thus tripping the permissions gate. Anyhow, this is a fairly tough race condition problem I haven't figured out... please make sure that if you do this (and if we do it at all) to update ALL instances around the codebase to not use window.location.
- TODO (#12): I'd love for us to skin the video player. [Similar to what's being done here](https://plyr.io/). But that library, and all others, are HUGE and we can't afford to add them to our bundle size. Is there some lightweight way to do some basic YouTube video styling without a massive library?
- TODO (#14): Find some sort of way of getting cloud functions working locally and deployable without main field in package.json
- TODO (#15): Find some sort of way to serve Firebase functions and [run them in the shell locally](https://medium.com/mean-fire/nx-nrwl-firebase-functions-98f96f514055)
