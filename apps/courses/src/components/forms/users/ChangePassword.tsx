import React from 'react';
import { BoxProps } from '@chakra-ui/react';
import * as yup from 'yup';
import { useAuth } from 'reactfire';

import Form from '../_form';
import { validPassword, validMatchingPassword } from '../_validation';
import { passwordField, passwordConfirmField } from '../_fields';

import useToast, { toastConfig } from '../../Toast';
import { handleErrors } from '../../../helpers';

interface ChangePasswordFormProps extends BoxProps {
  callback?: () => void;
}

export default ({ callback, ...props }: ChangePasswordFormProps) => {
  const auth = useAuth();
  const toast = useToast();

  const onSuccess = () => {
    toast({
      ...toastConfig,
      title: 'Password changed',
      description: 'We have successfully changed your password.',
      status: 'success',
    });
    if (callback) callback();
  };

  const onSubmit = ({ password }) =>
    auth.currentUser
      .updatePassword(password)
      .then(onSuccess)
      .catch((error) => handleErrors(toast, error));

  const schema = yup.object().shape({
    password: validPassword,
    password_confirm: validMatchingPassword('password'),
  });

  const fields = [[passwordField(), passwordConfirmField()]];

  return (
    <Form
      {...props}
      onSubmit={onSubmit}
      schema={schema}
      fields={fields}
      submit="Save Changes"
      isBreathable
    />
  );
};
