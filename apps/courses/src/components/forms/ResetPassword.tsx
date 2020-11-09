import React from 'react';
import * as yup from 'yup';
import { useAuth } from 'reactfire';

import Form from './_form';
import { validEmail } from './_validation';

import useToast, { toastConfig } from '../Toast';

export default () => {
  const auth = useAuth();
  const toast = useToast();
  const onSubmit = ({ email }) =>
    auth
      .sendPasswordResetEmail(email)
      .then(() =>
        toast({
          ...toastConfig,
          title: 'Password reset successful',
          description: `Password reset issued, check ${email}.`,
          status: 'success',
        })
      )
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
  });

  const fields = [
    {
      name: 'email',
      type: 'email',
      placeholder: 'Email address',
    },
  ];

  return <Form onSubmit={onSubmit} schema={schema} fields={fields} />;
};
