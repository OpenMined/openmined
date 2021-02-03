// TODO: This file can be deleted and the webpackConfig variable for the courses build script in workspace.json
// can be reset when the following is addressed:
// Issue: https://github.com/nrwl/nx/issues/4420
// PR: https://github.com/nrwl/nx/pull/4421

const fs = require('fs');
const webpack = require('webpack');
const nrwlConfig = require('@nrwl/react/plugins/webpack');
const dotenv = require('dotenv-flow');

function getClientEnvironment(variables, mode) {
  const NX_APP = /^NX_/i;
  const raw = Object.keys(process.env)
    .filter((key) => NX_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        NODE_ENV: mode,
      }
    );

  Object.keys(variables)
    .filter((key) => NX_APP.test(key))
    .forEach((variable) => {
      raw[variable] = variables[variable];
    });

  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  return { stringified };
}

module.exports = (config, context) => {
  let mode = 'development';

  if (context.configuration && context.configuration === 'production') {
    mode = 'production';
  }

  const options = context.options ? context.options : context.buildOptions;

  const appRoot = options.sourceRoot.substring(
    0,
    options.sourceRoot.indexOf('/src')
  );

  const rootEnv = options.root + '/.env';
  const appEnv = options.root + '/' + appRoot + '/.env';
  const rootLocalEnv = options.root + '/.local.env';
  const appLocalEnv = options.root + '/' + appRoot + '/.local.env';

  const envs = [];

  try {
    if (fs.existsSync(rootEnv)) envs.push(rootEnv);
    if (fs.existsSync(appEnv)) envs.push(appEnv);

    if (mode === 'development') {
      if (fs.existsSync(rootLocalEnv)) envs.push(rootLocalEnv);
      if (fs.existsSync(appLocalEnv)) envs.push(appLocalEnv);
    }

    const variables = dotenv.parse(envs);

    nrwlConfig(config);

    return {
      ...config,
      plugins: [
        new webpack.DefinePlugin(
          getClientEnvironment(variables, mode).stringified
        ),
        ...config.plugins,
      ],
    };
  } catch (error) {
    console.error(error);
  }
};
