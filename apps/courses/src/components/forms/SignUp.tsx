import React from 'react';
import { Button, Icon } from '@chakra-ui/core';
import * as yup from 'yup';
import { useAuth } from 'reactfire';

import Form from './_form';
import {
  validEmail,
  validPassword,
  validMatchingPassword,
  requiredString,
} from './_validation';

import useToast, { toastConfig } from '../Toast';
import { GithubIcon } from '../../content/homepage';

interface SignUpFormProps {
  callback?: () => void;
}

export default ({ callback }: SignUpFormProps) => {
  const auth = useAuth();
  const toast = useToast();

  const GithubAuthProvider = useAuth.GithubAuthProvider;

  const onSuccess = () => {
    toast({
      ...toastConfig,
      title: 'Sign up successful',
      description: 'Welcome to OpenMined Courses!',
      status: 'success',
    });
    if (callback) callback();
  };

  const onSubmit = async ({ email, password, first_name, last_name }) => {
    // TODO: Remove this if possible and remove the @typescript-eslint/ban-ts-comment rule in the root .eslintrc.json
    // @ts-ignore
    const { user } = await auth
      .createUserWithEmailAndPassword(email, password)
      .catch(({ message }) =>
        toast({
          ...toastConfig,
          title: 'Error',
          description: message,
          status: 'error',
        })
      );

    await user
      .updateProfile({
        displayName: `${first_name} ${last_name}`,
      })
      .catch(({ message }) =>
        toast({
          ...toastConfig,
          title: 'Error',
          description: message,
          status: 'error',
        })
      );

    await user.sendEmailVerification().catch(({ message }) =>
      toast({
        ...toastConfig,
        title: 'Error',
        description: message,
        status: 'error',
      })
    );

    onSuccess();
  };

  const onGithubSubmit = async () => {
    const provider = new GithubAuthProvider();

    provider.addScope('repo');
    provider.addScope('read:user');
    provider.addScope('user.email');

    const createUser = await auth
      .signInWithPopup(provider)
      .catch(({ message }) =>
        toast({
          ...toastConfig,
          title: 'Error',
          description: message,
          status: 'error',
        })
      );

    if (createUser) onSuccess();
  };

  const schema = yup.object().shape({
    first_name: requiredString,
    last_name: requiredString,
    email: validEmail,
    password: validPassword,
    passwordConfirm: validMatchingPassword('password'),
  });

  const fields = [
    [
      {
        name: 'first_name',
        type: 'text',
        placeholder: 'Ada',
        label: 'First Name',
      },
      {
        name: 'last_name',
        type: 'text',
        placeholder: 'Lovelace',
        label: 'Last Name',
      },
    ],
    {
      name: 'email',
      type: 'email',
      placeholder: 'ada.lovelace@openmined.org',
      label: 'Email Address',
    },
    [
      {
        name: 'password',
        type: 'password',
        placeholder: 'Password',
        label: 'Password',
      },
      {
        name: 'passwordConfirm',
        type: 'password',
        placeholder: 'Password confirmation',
      },
    ],
  ];

  return (
    <Form
      onSubmit={onSubmit}
      schema={schema}
      fields={fields}
      submit={
        <Button mt={8} mr={4} colorScheme="black">
          Sign Up
        </Button>
      }
      nextToSubmit={
        <Button mt={8} onClick={onGithubSubmit} colorScheme="black">
          Sign Up with Github{' '}
          <Icon as={GithubIcon} ml={2} boxSize={4} color="white" />
        </Button>
      }
    />
  );
};
