import { afterAllTests, loadFirebaseRules } from './utils';

beforeAll(async () => {
  await loadFirebaseRules();
});

afterAll(async () => {
  await afterAllTests();
});
