import React from 'react';
import { BoxProps, Flex, Link } from '@chakra-ui/react';
import * as yup from 'yup';
import { useUser, useFirestore, useFirestoreDocData, useAuth } from 'reactfire';
import { User } from '@openmined/shared/types';

import Form from '../_form';
import {
  requiredString,
  optionalString,
  optionalItem,
  optionalUrl,
} from '../_validation';
import {
  readOnlyEmailField,
  firstNameField,
  lastNameField,
  skillLevelField,
  primaryLanguageField,
  cityField,
  countryField,
  timezoneField,
  descriptionField,
  websiteField,
  readOnlyGithubField,
  twitterField,
} from '../_fields';

import useToast, { toastConfig } from '../../Toast';
import { handleErrors } from '../../../helpers';
import { countries, primaryLanguages, skillLevels, timezones } from '../_data';

import UploadAvatar from '../../UploadAvatar';

interface BasicInformationFormProps extends BoxProps {
  callback?: () => void;
  onChangeEmailOrGithub: () => void;
  onAddPassword: () => void;
}

export default ({
  callback,
  onChangeEmailOrGithub,
  onAddPassword,
  ...props
}: BasicInformationFormProps) => {
  const user: firebase.User = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const toast = useToast();

  const dbUserRef = db.collection('users').doc(user.uid);
  const dbUser: User = useFirestoreDocData(dbUserRef);

  const onSuccess = () => {
    toast({
      ...toastConfig,
      title: 'Account updated',
      description: 'We have successfully changed your account information.',
      status: 'success',
    });
    if (callback) callback();
  };

  const onReverifySuccess = () => {
    toast({
      ...toastConfig,
      title: 'Email verification sent',
      description: 'We have sent you an email to verify your account.',
      status: 'success',
    });
    if (callback) callback();
  };

  const onSubmit = (data: User) => {
    if (
      (data.first_name && data.first_name !== '') ||
      (data.last_name && data.last_name !== '')
    ) {
      auth.currentUser.updateProfile({
        displayName: `${data.first_name} ${data.last_name}`,
      });
    }

    return db
      .collection('users')
      .doc(user.uid)
      .set(data, { merge: true })
      .then(onSuccess)
      .catch((error) => handleErrors(toast, error));
  };

  const onReverifyEmail = (data) =>
    auth.currentUser
      .sendEmailVerification()
      .then(onReverifySuccess)
      .catch((error) => handleErrors(toast, error));

  const schema = yup.object().shape({
    first_name: requiredString,
    last_name: requiredString,
    description: optionalString.max(160),
    website: optionalUrl,
    twitter: optionalString,
    skill_level: optionalItem(skillLevels),
    primary_language: optionalItem(primaryLanguages.map((d) => d.code)),
    city: optionalString,
    country: optionalItem(countries.map((d) => d.code)),
    timezone: optionalItem(timezones.map((d) => d.name)),
  });

  const hasPasswordAccount = !!user.providerData.filter(
    (p) => p.providerId === 'password'
  ).length;

  const hasGithubAccount = !!user.providerData.filter(
    (p) => p.providerId === 'github.com'
  ).length;

  const fields = [
    readOnlyEmailField(user.email, (props) => (
      <Flex {...props}>
        {hasPasswordAccount && (
          <Link onClick={onChangeEmailOrGithub}>Change</Link>
        )}
        {!hasPasswordAccount && (
          <Link onClick={onAddPassword}>Add Password</Link>
        )}
        {!user.emailVerified && (
          <Link color="red.500" ml={4} onClick={onReverifyEmail}>
            Resend Verification Email
          </Link>
        )}
      </Flex>
    )),
    [firstNameField(dbUser.first_name), lastNameField(dbUser.last_name)],
    descriptionField(dbUser.description),
    [websiteField(dbUser.website), null],
    [
      readOnlyGithubField(dbUser.github || 'No Github Linked', (props) =>
        hasGithubAccount ? null : (
          <Link {...props} onClick={onChangeEmailOrGithub}>
            Link Github
          </Link>
        )
      ),
      twitterField(dbUser.twitter),
    ],
    skillLevelField(dbUser.skill_level),
    [primaryLanguageField(dbUser.primary_language), null],
    [cityField(dbUser.city), countryField(dbUser.country)],
    [timezoneField(dbUser.timezone), null],
  ];

  return (
    <>
      <UploadAvatar
        currentAvatar={user.photoURL || null}
        label="Profile Picture"
        mb={8}
      />
      <Form
        {...props}
        onSubmit={onSubmit}
        schema={schema}
        fields={fields}
        submit="Save changes"
        isBreathable
      />
    </>
  );
};
