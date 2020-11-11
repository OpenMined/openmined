import React from 'react';
import * as yup from 'yup';
import { useAuth } from 'reactfire';
import { BoxProps } from '@chakra-ui/core';

import Form from './_form';
import { validEmail } from './_validation';
import { emailField } from './_fields';

import useToast, { toastConfig } from '../Toast';
import { handleErrors } from '../../helpers';

interface ResetPasswordFormProps extends BoxProps {
  callback?: () => void;
}

export default ({ callback, ...props }: ResetPasswordFormProps) => {
  const auth = useAuth();
  const toast = useToast();

  const onSuccess = (email) => {
    toast({
      ...toastConfig,
      title: 'Password reset successful',
      description: `Password reset issued, check ${email}.`,
      status: 'success',
    });
    if (callback) callback();
  };

  const onSubmit = ({ email }) =>
    auth
      .sendPasswordResetEmail(email)
      .then(() => onSuccess(email))
      .catch((error) => handleErrors(toast, error));

  const schema = yup.object().shape({
    email: validEmail,
  });

  const fields = [emailField];

  return (
    <Form {...props} onSubmit={onSubmit} schema={schema} fields={fields} />
  );
};
