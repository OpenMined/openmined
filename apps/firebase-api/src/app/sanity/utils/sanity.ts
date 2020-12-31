import sanityClient from '@sanity/client';

export default () =>
  sanityClient({
    projectId: process.env.NX_SANITY_COURSES_PROJECT_ID,
    dataset: process.env.NX_SANITY_COURSES_DATASET,
    token: process.env.NX_SANITY_API_TOKEN,
    useCdn: process.env.NODE_ENV === 'production',
  });
