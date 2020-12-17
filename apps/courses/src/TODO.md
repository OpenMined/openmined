# TODOS

## Launch

We need to have the following items FINISHED BY LAUNCH on December 31st, 2020.

### Danny

- Make sure all Firebase calls (which you can find by project searching for "db.") have appropriate error handling, only some of the original logic I wrote does... not all calls will properly toast the error
- Add error boundaries to React app to catch errors, handle them gracefully, and report them to the appropriate service (see last todo item above)
- Go through each page and test them for responsiveness, fixing any issues along the way. We KNOW that there will be problems on the following pages: project, project-complete, course-complete
- Let's get the deployment working on the dev branch again... because of Typescript errors this hasn't been working in a while because our CI/CD won't pass
- Make the feedback a subcollection under the course, not at the same level as "courses".

### Bren

- TODO (#1): We need to write a test for when to show the `<Header />` and `<Footer />` on the homepage. It might be a good candidate for a small refactor where we define what pages receive this header or footer, and which don't.
- TODO (#2): Add the support for links to the rich text editor, [basically just do this](https://www.slatejs.org/examples/links)
- TODO (#3): The way we're doing the `<Icon />` throughout the site is kinda ugly and repetitive. I suggest we write a reusable component to automate the "as" prop.
- TODO (#4): All radios and checkboxes require a double click for some reason... have no idea what's going on here, but Chakra doesn't natively have this problem. It's something we're doing wrong here.
- TODO (#5): Centralize Github provider logic - currently, every time we need to do something with Github as a sign in/up provider, we have to define it as a provider AND list the scope. If the scope is changed in one file, and not another... this could have very bad consequences. Centralize this logic somehow and use it throughout.
- TODO (#18): Resizing the window on any page with the main `<Header />` causes a call stack overflow to happen which crashes the page. It looks like this is related to the `<Avatar />` being reloaded multiple times? This also will probably happen on the Course Header.
- TODO (#19): Click on any one of the "Get Help" items in the Course `<Footer />` will trigger an infinite update logic (same as #18, but in a different place).
- TODO (#20): Clicking on the lessons in the Drawer from the Project page doesn't work
- Go through each page and test them for responsiveness, fixing any issues along the way. We KNOW that there will be problems on the following pages: project, project-complete, course-complete
- TODO (#13 HARD): We need to get SSR working for the homepage and profile pages at minimum. I can't remember how to best do this with Firebase Functions, nor can I remember how to make it conditional for SOME of the pages. We'll also want to implement some sort of caching strategy for this. [I know that Firebase has some solutions around this already](https://www.youtube.com/watch?v=82tZAPMHfT4).

### Hericles

- Add a ton of Cypress tests

### Patrick

- Remember to revisit the header title and such once you get the CMS plugged in
- Add the submission alert dialogs to the project page
- Fuzzy find search on Search page isn't working
- Build the My Courses page (maybe don't even worry about the existing PR) and rename it Dashboard everywhere
- Build the notifications drawer and mentorship dashboard toggle
- Build the mentorship dashboard
- Go back to relevant pages and add in functionality retroactively for course project, lesson completion, overview, profile, my courses, and search pages
- Refactor all of the "complete" pages to share a bunch of logic, because they all basically look the same
- Make sure that the OpenMined emails work on dev and production so that everything is coming from the @openmined.org domain name and NOT Firebase.

### Available issues (general)

- TODO (HARD): Add a ton of security rules
- TODO (HARD): Write tests for all security rules (make sure to use the emulator!)
- TODO (HARD): Make the current Privacy & Society course on Sanity API to be the "dummy" course that doesn't change over time and is just used for testing. You'll want to immediately rename this course (since it's the name of the actual first course). Then, you'll then need to actually create the real "Privacy & Society" course to be filled in by the writing team days before launch. PLEASE make sure that when you do this that there's a way to designate a course as being "for testing purposes only" in the backend, and DO NOT show these courses in the production site. Lastly, also make another toggle for courses that marks a course as being "ready to be taken". Do not allow users to take a course that doesn't have content yet (but we will still need to have the top-level course content so we can display it as "coming soon" on the site).
- TODO: Research ways to tighten security for Sanity API, ensuring that users cannot use it to cheat or view unreleased course materials
- TODO: Place all Firebase calls related to courses in the same file and then use them throughout the various pages... this will make this logic more testable in conjunction with the helpers file
- TODO (HARD): Build Typescript interfaces for the course and use them throughout the various Firebase API calls file (see above), helpers file, and various views
- TODO: We need to set up better Firebase performance logging to see what calls and page loads are taking the most time
- TODO (HARD): [Use the following Firebase extension](https://firebase.google.com/products/extensions/firestore-counter) to count a variety of metrics to a `metrics` collection at the top-level. Make sure to block this collection from being written to by anyone else except the function. This should include a variety of useful information, such as, but not limited to: number of user signups (through Github, through email, and total), number of user deletions, number of courses started, number of lessons started, number of concepts started, number of courses completed, number of lessons completed, number of concepts completed, number of projects started, number of projects passed, number of projects failed, etc. Maybe work with Patrick on this.
- TODO: [Use the following Firebase extension](https://firebase.google.com/products/extensions/firestore-send-email) to send a variety of emails, including, but not limited to: sign up confirmation, welcome to the course, and when you receive a project review. Maybe work with Patrick on this.
- TODO: In relation to the last one, make sure to include some of these emails as "opt-out"-able from a page we need to make on the [Account Settings page called "Notification Preferences"](https://www.figma.com/file/qravzmnQ0ESokNMhMVU9Zk/Wireframes?node-id=937%3A415). Maybe work with Patrick on this.

### Available issues (specific)

- TODO (#6 HARD): Ensure that deleting a user's account also deletes all their subcollections and THEN deletes their auth account with Firebase. Might be good to do this in a Firebase function. Likewise, [this existing Firebase solution might be a good one](https://firebase.google.com/products/extensions/delete-user-data).
- TODO (#7): Find a way to change the background color of a page. We know that the following code works: `` <Page body={{ style: `background: ${gray50};` }} /> ``, but that's really bad. Ideally we don't set the background color on the body element at all and we can remove this from the `<Page /> component entirely. It might be better to just set on the top most element for that page instead.
- TODO (#16): We need to store the "number" of user that a user is in Firebase using a cloud function. All users have a hash-based index, which is fine, but we need to know when the number of users reaches a certain threshold since we only have space for a certain number of users. We should store this information on the User's Firestore document. Also - this has to work RETROACTIVELY for all existing users.
- TODO (#17): Add the ability to upload an avatar to the `<BasicInformation />` page. Pretty straightforward. Perhaps also [use this Firebase extension to enable the resizing of avatars on the server-side... do 400x400](https://firebase.google.com/products/extensions/storage-resize-images)
- TODO (#21): Disable the submit on the project submission page until they've actually started their submission

## Pre-Launch Checklist

We need to have the following items FINISHED BY LAUNCH on December 31st, 2020. These items will be done by Patrick the days before we launch.

- Make sure to test the site on dev deployment
- Make sure to search for any configurations, Firebase extensions, or anything that needs to be enabled on the production account first (to make it identical to the dev Firebase)
- Make an "intro to the CMS" video to give to Mat, Andrew, and Emma (and make sure to explain that filling in EVERY field is critical - if they can't fill in some, tell them to ask Patrick what to do)
- Go back through the designs and make sure things are as accurate as possible, get final approval from Kyoko
- Do a complete sweep of all content and make sure Mat and Andrew have signoff

## Post-Launch

We can do the following items after the launch of the first course on December 31st, 2020.

- TODO (#8 HARD): Write the course helpers functions in the order in which they need to appear (per the flow of the course, not grouped by topic). That will make those rules much more readable. Secondly, you should ensure that the tests build on each other (i.e. testing completion of a lesson means testing the completion of all previous lessons and their respective concepts). You may need to modify the tests for this significantly.
- TODO (#9 HARD): Because the tests for the helpers are so long, perhaps write a few functions in the test logic to generate the users, courses, lessons, etc. It should save a lot on the number of lines of code in the file and make it much more readable.
- TODO (#10): Try to share a lot of logic between the courses' header and the main header. They share a LOT of logic and it would be good to make these reusable or combine them somehow.
- TODO (#11 HARD): We absolutely should be using the useFirestoreDocData (the one with snapshot listeners that always gets new data, rather than the one that gets it once: useFirestoreDocDataOnce) function instead on the main `<CoursePage />` page. However, if we do this, we'll need to add a "check" to the concept page to make sure to check if the DB has been updated for concepts though so that we don't write to the DB 2,000 times a minute! After we do this, we can switch all instances of "window.location.href = " and "window.location.reload()" to use instead "smooth scroll" to the top of the page and use the "useNavigate()" hook in react-router... this would look way better when navigating through the course, but I've had problems with the permissions working when using this because the update from Firebase arrives AFTER the following page load, thus tripping the permissions gate. Anyhow, this is a fairly tough race condition problem I haven't figured out... please make sure that if you do this (and if we do it at all) to update ALL instances around the codebase to not use window.location.
- TODO (#12): I'd love for us to skin the video player. [Similar to what's being done here](https://plyr.io/). But that library, and all others, are HUGE and we can't afford to add them to our bundle size. Is there some lightweight way to do some basic YouTube video styling without a massive library?
- TODO (#14): Find some sort of way of getting cloud functions working locally and deployable without main field in package.json
- TODO (#15): Find some sort of way to serve Firebase functions and [run them in the shell locally](https://medium.com/mean-fire/nx-nrwl-firebase-functions-98f96f514055)
