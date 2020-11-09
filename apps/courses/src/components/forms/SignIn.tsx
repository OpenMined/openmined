import React from 'react';
import * as yup from 'yup';
import { Link } from '@chakra-ui/core';
import { useAuth } from 'reactfire';

import Form from './_form';
import { validEmail, validPassword } from './_validation';

import useToast, { toastConfig } from '../Toast';

export default ({ callback, onResetPassword }) => {
  const auth = useAuth();
  const toast = useToast();
  const onSubmit = ({ email, password }) =>
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() =>
        toast({
          ...toastConfig,
          title: 'Sign in successful',
          description: 'Welcome back!',
          status: 'success',
        })
      )
      .then(() => !!callback && callback())
      .catch(({ message }) =>
        toast({
          ...toastConfig,
          title: 'Error',
          description: message,
          status: 'error',
        })
      );

  const schema = yup.object().shape({
    email: validEmail,
    password: validPassword,
  });

  const fields = [
    {
      name: 'email',
      type: 'email',
      placeholder: 'Email address',
    },
    {
      name: 'password',
      type: 'password',
      placeholder: 'Password',
    },
  ];

  return (
    <>
      <Form onSubmit={onSubmit} schema={schema} fields={fields} />
      <Link onClick={() => !!onResetPassword && onResetPassword()}>
        Reset your password
      </Link>
    </>
  );
};
