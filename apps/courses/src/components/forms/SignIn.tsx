import React from 'react';
import {
  Button,
  Divider,
  Flex,
  Icon,
  Text,
  Link,
  useDisclosure,
  BoxProps,
} from '@chakra-ui/core';
import { Link as RRDLink } from 'react-router-dom';
import * as yup from 'yup';
import { useAuth } from 'reactfire';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

import Form from './_form';
import ResetPassword from './ResetPassword';
import { validEmail, validPassword } from './_validation';
import { emailField, passwordField } from './_fields';

import useToast, { toastConfig } from '../Toast';
import Modal from '../Modal';
import { handleErrors } from '../../helpers';

interface SignInFormProps extends BoxProps {
  callback?: () => void;
}

export default ({ callback, ...props }: SignInFormProps) => {
  const auth = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // TODO: Patrick, find a way to centralize this logic since it's done twice in the codebase
  const provider = new useAuth.GithubAuthProvider();

  provider.addScope('public_repo');
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

  const fields = [emailField, passwordField];

  return (
    <>
      <Form
        {...props}
        onSubmit={onSubmit}
        schema={schema}
        fields={fields}
        submit={(isDisabled, isSubmitting) => (
          <>
            <Flex
              align="center"
              justify={{ base: 'flex-start', md: 'center' }}
              wrap="wrap"
              mt={6}
            >
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
            {/* TODO: Patrick, uncomment these when these pages exist */}
            {/* <Divider my={6} />
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
            </Text> */}
          </>
        )}
      />
      <Modal isOpen={isOpen} onClose={onClose} title="Reset Password">
        <ResetPassword />
      </Modal>
    </>
  );
};
