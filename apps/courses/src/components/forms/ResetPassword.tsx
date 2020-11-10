import React from 'react';
import * as yup from 'yup';
import { useAuth } from 'reactfire';

import Form from './_form';
import { validEmail } from './_validation';

import useToast, { toastConfig } from '../Toast';
import { handleErrors } from '../../helpers';

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
      .catch((error) => handleErrors(toast, error));

  const schema = yup.object().shape({
    email: validEmail,
  });

  const fields = [
    {
      name: 'email',
      type: 'email',
      placeholder: 'ada.lovelace@openmined.org',
      label: 'Email Address',
    },
  ];

  return <Form onSubmit={onSubmit} schema={schema} fields={fields} />;
};
