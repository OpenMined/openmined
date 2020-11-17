import React from 'react';
import { BoxProps } from '@chakra-ui/core';
import * as yup from 'yup';
import { useAuth, useFirestore } from 'reactfire';

import Form from '../_form';
import { requiredString, optionalString, optionalItem } from '../_validation';
import {
  readOnlyEmailField,
  firstNameField,
  lastNameField,
  skillLevelField,
  primaryLanguageField,
  cityField,
  countryField,
  timezoneField,
} from '../_fields';

import useToast, { toastConfig } from '../../Toast';
import { handleErrors } from '../../../helpers';
import { countries, primaryLanguages, skillLevels, timezones } from '../_data';

interface BasicInformationFormProps extends BoxProps {
  callback?: () => void;
}

/*
TODO:
- Default values
- Read-only email field
- Double click bug for radios
- Submit
- Change link
*/

export default ({ callback, ...props }: BasicInformationFormProps) => {
  const auth = useAuth();
  const db = useFirestore();
  const toast = useToast();

  const onSuccess = () => {
    toast({
      ...toastConfig,
      title: 'Sign up successful',
      description: 'Welcome to OpenMined Courses!',
      status: 'success',
    });
    if (callback) callback();
  };

  const onSubmit = ({ email, password, first_name, last_name }) =>
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(() =>
        auth.currentUser
          .sendEmailVerification()
          .then(() =>
            db
              .collection('users')
              .doc(auth.currentUser.uid)
              .set({
                first_name: first_name,
                last_name: last_name,
              })
              .then(onSuccess)
              .catch((error) => handleErrors(toast, error))
          )
          .catch((error) => handleErrors(toast, error))
      )
      .catch((error) => handleErrors(toast, error));

  const schema = yup.object().shape({
    first_name: requiredString,
    last_name: requiredString,
    skill_level: optionalItem(skillLevels),
    primary_language: optionalItem(primaryLanguages.map((d) => d.code)),
    city: optionalString,
    country: optionalItem(countries.map((d) => d.code)),
    timezone: optionalItem(timezones.map((d) => d.offset)),
  });

  const fields = [
    readOnlyEmailField,
    [firstNameField, lastNameField],
    skillLevelField,
    [primaryLanguageField, null],
    [cityField, countryField],
    [timezoneField, null],
  ];

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
