import React from 'react';
import { BoxProps } from '@chakra-ui/react';
import * as yup from 'yup';
import { useFirestore } from 'reactfire';
import { User } from '@openmined/shared/types';

import Form from '../_form';
import { notificationsField } from '../_fields';

import useToast, { toastConfig } from '../../Toast';
import { handleErrors } from '../../../helpers';
import { useCourseUser } from '../../../hooks/useCourseUser';

interface BasicInformationFormProps extends BoxProps {
  callback?: () => void;
}

export default ({ callback, ...props }: BasicInformationFormProps) => {
  const db = useFirestore();
  const { user, update } = useCourseUser();
  const toast = useToast();

  const onSuccess = () => {
    toast({
      ...toastConfig,
      title: 'Account updated',
      description:
        'We have successfully changed your notification preferences.',
      status: 'success',
    });
    if (callback) callback();
  };

  const onSubmit = (data: User) => {
    if (typeof data.notification_preferences === 'boolean') {
      data.notification_preferences = [];
    } else if (typeof data.notification_preferences === 'string') {
      data.notification_preferences = [data.notification_preferences];
    }

    return update(data)
      .then(onSuccess)
      .catch((error) => handleErrors(toast, error));
  };

  const schema = yup.object().shape({});

  const fields = [notificationsField(user.notification_preferences)];

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
