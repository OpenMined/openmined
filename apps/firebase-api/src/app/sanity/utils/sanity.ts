import sanityClient from '@sanity/client';

export default (env) => {
  const dataset = env === 'production' ? 'production' : 'development';

  const config = {
    projectId: 'rzeg7i8f',
    dataset,
    token: process.env.NX_SANITY_API_TOKEN,
    useCdn: dataset === 'production',
  };

  const client = sanityClient(config);
  return client;
};
