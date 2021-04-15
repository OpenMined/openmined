# OpenMined Courses

## Support

If you're looking for support about the courses, please go the [Courses Discussion Board](https://github.com/OpenMined/courses/discussions). If you've found a bug, or have a suggestion for an improvement to the Courses site, or any of our websites, [please file an issue here](https://github.com/OpenMined/openmined/issues).

## Contributing

### Local Setup

#### Courses

#### Firebase API

Firebase is the primary backend for all of OpenMined's websites. If you want to test any functions or security rules before pushing them live, [you may do so using the emulator suite](https://firebase.google.com/docs/emulator-suite).

- `yarn test firebase-api` - Runs all the tests for the our Firebase backend

#### Sanity CMS

Sanity is the primary CMS for all of OpenMined's websites. You must have a user account to change any actual values, however, if you want to run it on your machine, you have access to the following commands:

- `yarn start sanity-api` - Runs the Sanity CMS with hot reloading for development purposes.

- `yarn lint sanity-api` - Runs the linter for the Sanity CMS

- `yarn test sanity-api` - Runs the test suite for the Sanity CMS

- `yarn build sanity-api` - Builds the Sanity CMS

- `yarn build sanity-api --prod` - Builds a production version of the Sanity CMS

- `yarn analyze sanity-api` - Analyzes the file sizes and distribution of a built version of the Sanity CMS
