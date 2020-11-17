import React from 'react';
import { BoxProps } from '@chakra-ui/core';
import * as yup from 'yup';
import { useUser, useFirestore, useFirestoreDocData } from 'reactfire';

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
- Move UserDB type to its own library just for interfaces
- Handle issues with github provider, email provider, and multi-provider
- Double click bug for radios
- Submit
- Change link
*/

interface UserDB {
  first_name: string;
  last_name: string;
  skill_level?: string;
  primary_language?: string;
  city?: string;
  country?: string;
  timezone?: string;
}

export default ({ callback, ...props }: BasicInformationFormProps) => {
  const user = useUser();
  const db = useFirestore();
  const toast = useToast();

  // @ts-ignore
  const dbUserRef = db.collection('users').doc(user.uid);
  const dbUser: UserDB = useFirestoreDocData(dbUserRef);

  const onSuccess = () => {
    toast({
      ...toastConfig,
      title: 'Sign up successful',
      description: 'Welcome to OpenMined Courses!',
      status: 'success',
    });
    if (callback) callback();
  };

  const onSubmit = (data) => {
    console.log(data);

    onSuccess();
  };

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
    // @ts-ignore
    readOnlyEmailField(user.email),
    [firstNameField(dbUser.first_name), lastNameField(dbUser.last_name)],
    skillLevelField(dbUser.skill_level),
    [primaryLanguageField(dbUser.primary_language), null],
    [cityField(dbUser.city), countryField(dbUser.country)],
    [timezoneField(dbUser.timezone), null],
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
