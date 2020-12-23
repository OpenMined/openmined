import React, { useState } from 'react';
import {
  Button,
  Divider,
  Flex,
  Icon,
  Text,
  Link,
  BoxProps,
  useDisclosure,
  Input,
} from '@chakra-ui/react';
import { Link as RRDLink } from 'react-router-dom';
import * as yup from 'yup';
import { useAuth, useFirestore } from 'reactfire';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

import Form from '../_form';
import {
  validEmail,
  validPassword,
  validMatchingPassword,
  requiredString,
} from '../_validation';
import {
  firstNameField,
  lastNameField,
  emailField,
  passwordField,
  passwordConfirmField,
} from '../_fields';

import useToast, { toastConfig } from '../../Toast';
import { handleErrors } from '../../../helpers';
import Modal from '../../Modal';

interface SignUpFormProps extends BoxProps {
  callback?: () => void;
}

interface CredentialProps {
  credential?: any;
  email?: string;
  password?: string;
}

export default ({ callback, ...props }: SignUpFormProps) => {
  const auth = useAuth();
  const db = useFirestore();
  const toast = useToast();

  // In the event that we already have an account created by email and we try to sign up using Github
  // We need to ask the user for the password to their account and store these credentials somewhere
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tempCredentials, setTempCredentials] = useState<CredentialProps>({});

  const emailProvider = useAuth.EmailAuthProvider;

  // SEE TODO (#5)
  const githubProvider = new useAuth.GithubAuthProvider();

  githubProvider.addScope('public_repo');
  githubProvider.addScope('read:user');
  githubProvider.addScope('user.email');

  // When we successfully create an account
  const onSuccess = () => {
    toast({
      ...toastConfig,
      title: 'Sign up successful',
      description: 'Welcome to OpenMined Courses!',
      status: 'success',
    });
    if (callback) callback();
  };

  // When we successfully link a provider to an existing account
  const onLinkedAccountSuccess = () => {
    toast({
      ...toastConfig,
      title: 'Accounting link successful',
      description: 'You can now sign in with either provider.',
      status: 'success',
    });
    if (callback) callback();
  };

  // Assuming the account already exists, handle merging them with the other provider
  const handleAccountAlreadyExists = ({
    credential = null,
    email = '',
    password = '',
  }: CredentialProps) => {
    // If we aren't given a credential, but are given an email and password, create on using the Firebase EmailAuthProvider
    if (!credential) credential = emailProvider.credential(email, password);

    // See what sign in methods exist
    auth.fetchSignInMethodsForEmail(email).then((methods) => {
      // What's the primary method of signing in?
      const primaryMethod = methods[0];

      // When finished signing in (below), link the user with their new credential
      const linkAccount = (user) =>
        user
          .linkWithCredential(credential)
          .then(onLinkedAccountSuccess)
          .catch((error) => handleErrors(toast, error));

      if (primaryMethod === 'password') {
        // If the user already has an email account, sign them in and link the account
        auth
          .signInWithEmailAndPassword(email, password)
          .then(({ user }) => linkAccount(user))
          .catch((error) => handleErrors(toast, error));
      } else if (primaryMethod === 'github.com') {
        // If the user already has a Github account, sign them in and link the account
        auth
          .signInWithPopup(githubProvider)
          .then(({ user }) => linkAccount(user))
          .catch((error) => handleErrors(toast, error));
      }

      return;
    });
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
      .catch((error) => {
        // In the event that an account with this email already exists (because they signed up with Github)
        // Give their account a password and link the Github provider to the new email provider
        // Otherwise... handleErrors()
        if (error.code === 'auth/email-already-in-use') {
          handleAccountAlreadyExists({ email, password });
        } else {
          handleErrors(toast, error);
        }
      });

  const onGithubSubmit = async () => {
    const authUser = await auth
      .signInWithPopup(githubProvider)
      .catch((error) => {
        // In the event that an account with this email already exists (because they signed up with email)
        // Store the existing credential and email conflict, and then ask the user to input the password for their email account
        // Otherwise... handleErrors()
        if (error.code === 'auth/account-exists-with-different-credential') {
          // Store the pending Github credential and conflicting email
          setTempCredentials({
            credential: error.credential,
            email: error.email,
            password: null,
          });

          // Open the modal to ask for a password
          onOpen();
        } else {
          handleErrors(toast, error);
        }
      });

    // If we're creating an account for the first time, we need to store some information about the user
    if (authUser) {
      const splitName = authUser.user.displayName.split(' ');
      const firstName =
        splitName.length >= 1 ? splitName[0] : authUser.user.displayName;
      const lastName =
        splitName.length >= 2 ? splitName.slice(1).join(' ') : '';

      const batch = db.batch();
      const userDoc = db.collection('users').doc(auth.currentUser.uid);
      const userPrivateDoc = userDoc
        .collection('private')
        .doc(auth.currentUser.uid);

      batch.set(userDoc, {
        first_name: firstName,
        last_name: lastName,
        photo_url: authUser.user.photoURL,
        description: (authUser.additionalUserInfo.profile as any).bio,
        github: (authUser.additionalUserInfo.profile as any).login,
        twitter: (authUser.additionalUserInfo.profile as any).twitter_username,
        website: (authUser.additionalUserInfo.profile as any).blog,
      });

      batch.set(userPrivateDoc, {
        github_access_token: (authUser.credential as any).accessToken,
      });

      batch
        .commit()
        .then(() => onSuccess())
        .catch((error) => handleErrors(toast, error));
    }
  };

  const schema = yup.object().shape({
    first_name: requiredString,
    last_name: requiredString,
    email: validEmail,
    password: validPassword,
    passwordConfirm: validMatchingPassword('password'),
  });

  const fields = [
    [firstNameField(), lastNameField()],
    emailField(),
    [passwordField(), passwordConfirmField()],
  ];

  return (
    <>
      <Form
        {...props}
        onSubmit={onSubmit}
        schema={schema}
        fields={fields}
        submit={(isDisabled, isSubmitting) => (
          <>
            <Flex align="center" wrap="wrap" mt={6}>
              <Button
                mr={4}
                mt={2}
                colorScheme="black"
                type="submit"
                disabled={isDisabled}
                isLoading={isSubmitting}
              >
                Sign Up
              </Button>
              <Button
                mt={2}
                onClick={onGithubSubmit}
                colorScheme="black"
                isLoading={isSubmitting}
              >
                {/* SEE TODO (#3) */}
                Sign Up with Github{' '}
                <Icon
                  as={FontAwesomeIcon}
                  icon={faGithub}
                  ml={2}
                  boxSize={4}
                  color="white"
                />
              </Button>
            </Flex>
            <Divider my={6} />
            <Text fontSize="sm" color="gray.700">
              By signing up you agree to our{' '}
              <Link as={RRDLink} to="/terms">
                Terms of Use
              </Link>{' '}
              and{' '}
              <Link as={RRDLink} to="/policy">
                Privacy Policy
              </Link>
              .
            </Text>
          </>
        )}
      />
      <Modal isOpen={isOpen} onClose={onClose} title="Sign In">
        <Text mb={4}>
          Apprently you have already created an account with this email address.
          To continue with linking your Github account, please enter the
          password for your OpenMined account.
        </Text>
        <Input
          type="password"
          placeholder="Type your password..."
          mb={2}
          onChange={({ target }) =>
            setTempCredentials({ ...tempCredentials, password: target.value })
          }
        />
        <Button
          onClick={() => handleAccountAlreadyExists(tempCredentials)}
          type="submit"
          colorScheme="cyan"
        >
          Submit
        </Button>
      </Modal>
    </>
  );
};
