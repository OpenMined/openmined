import React from 'react';
import {
  Button,
  Divider,
  Flex,
  Icon,
  Text,
  Link,
  useDisclosure,
} from '@chakra-ui/core';
import { Link as RRDLink } from 'react-router-dom';
import * as yup from 'yup';
import { useAuth } from 'reactfire';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

import Form from './_form';
import { validEmail, validPassword } from './_validation';

import useToast, { toastConfig } from '../Toast';
import { handleErrors } from '../../helpers';
import Modal from '../Modal';
import ResetPassword from './ResetPassword';

interface SignInFormProps {
  callback?: () => void;
}

// TODO: Patrick, remove onResetPassword and just hardwire the modal into the signin form

export default ({ callback }: SignInFormProps) => {
  const auth = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const provider = new useAuth.GithubAuthProvider();

  provider.addScope('repo');
  provider.addScope('read:user');
  provider.addScope('user.email');

  const onSuccess = () => {
    toast({
      ...toastConfig,
      title: 'Sign in successful',
      description: 'Welcome back!',
      status: 'success',
    });
    if (callback) callback();
  };

  const onSubmit = ({ email, password }) =>
    auth
      .signInWithEmailAndPassword(email, password)
      .then(onSuccess)
      .catch((error) => handleErrors(toast, error));

  const onGithubSubmit = async () => {
    const authUser = await auth
      .signInWithPopup(provider)
      .catch((error) => handleErrors(toast, error));

    if (authUser) onSuccess();
  };

  const schema = yup.object().shape({
    email: validEmail,
    password: validPassword,
  });

  const fields = [
    {
      name: 'email',
      type: 'email',
      placeholder: 'ada.lovelace@openmined.org',
      label: 'Email Address',
    },
    {
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      label: 'Password',
    },
  ];

  return (
    <>
      <Form
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
                Sign In
              </Button>
              <Button
                mt={2}
                onClick={onGithubSubmit}
                colorScheme="black"
                isLoading={isSubmitting}
              >
                {/* TODO: Icons are kinda ugly like this, do something about it when we import OMUI to the monorepo */}
                Sign In with Github{' '}
                <Icon
                  as={FontAwesomeIcon}
                  icon={faGithub}
                  ml={2}
                  boxSize={4}
                  color="white"
                />
              </Button>
            </Flex>
            <Link onClick={onOpen} mt={4} display="block">
              Reset your password
            </Link>
            <Divider my={6} />
            <Text fontSize="sm" color="gray.700">
              By signing in you agree to our{' '}
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
      <Modal isOpen={isOpen} onClose={onClose} title="Reset Password">
        <ResetPassword />
      </Modal>
    </>
  );
};
