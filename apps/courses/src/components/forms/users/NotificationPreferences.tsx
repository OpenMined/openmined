import React from 'react';
import { BoxProps } from '@chakra-ui/react';
import * as yup from 'yup';
import { useUser, useFirestore, useFirestoreDocData } from 'reactfire';
import { User } from '@openmined/shared/types';

import Form from '../_form';
import { notificationsField } from '../_fields';

import useToast, { toastConfig } from '../../Toast';
import { handleErrors } from '../../../helpers';

interface BasicInformationFormProps extends BoxProps {
  callback?: () => void;
}

export default ({ callback, ...props }: BasicInformationFormProps) => {
  const user: firebase.User = useUser();
  const db = useFirestore();
  const toast = useToast();

  const dbUserRef = db.collection('users').doc(user.uid);
  const dbUser: User = useFirestoreDocData(dbUserRef);

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

    return db
      .collection('users')
      .doc(user.uid)
      .set(data, { merge: true })
      .then(onSuccess)
      .catch((error) => handleErrors(toast, error));
  };

  const schema = yup.object().shape({});

  const fields = [notificationsField(dbUser.notification_preferences)];

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
