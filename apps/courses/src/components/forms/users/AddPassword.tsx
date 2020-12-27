import React from 'react';
import { BoxProps } from '@chakra-ui/react';
import * as yup from 'yup';
import { useAnalytics, useAuth } from 'reactfire';

import Form from '../_form';
import { validPassword, validMatchingPassword } from '../_validation';
import { passwordField, passwordConfirmField } from '../_fields';

import useToast, { toastConfig } from '../../Toast';
import { handleErrors } from '../../../helpers';

interface AddPasswordFormProps extends BoxProps {
  callback?: () => void;
}

export default ({ callback, ...props }: AddPasswordFormProps) => {
  const auth = useAuth();
  const analytics = useAnalytics();
  const toast = useToast();

  const provider = useAuth.EmailAuthProvider;

  const onSuccess = () => {
    toast({
      ...toastConfig,
      title: 'Password added',
      description: 'We have successfully added your password.',
      status: 'success',
    });
    if (callback) callback();
  };

  const onSubmit = ({ password }) => {
    analytics.logEvent('link_account_by_add_password', {
      original: 'github',
      new: 'email',
    });

    const credential = provider.credential(auth.currentUser.email, password);

    return auth.currentUser
      .linkWithCredential(credential)
      .then(onSuccess)
      .catch((error) => handleErrors(toast, error));
  };

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
