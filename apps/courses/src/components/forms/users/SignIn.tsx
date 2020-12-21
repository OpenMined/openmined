import React from 'react';
import {
  Button,
  Divider,
  Flex,
  Text,
  Link,
  useDisclosure,
  BoxProps,
} from '@chakra-ui/react';
import { Link as RRDLink } from 'react-router-dom';
import * as yup from 'yup';
import { useAuth } from 'reactfire';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

import ResetPassword from './ResetPassword';
import Form from '../_form';
import { validEmail, validPassword } from '../_validation';
import { emailField, passwordField } from '../_fields';

import useToast, { toastConfig } from '../../Toast';
import Modal from '../../Modal';
import { handleErrors } from '../../../helpers';
import Icon from '../../Icon';

interface SignInFormProps extends BoxProps {
  callback?: () => void;
}

export default ({ callback, ...props }: SignInFormProps) => {
  const auth = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // SEE TODO (#5)
  const githubProvider = new useAuth.GithubAuthProvider();

  githubProvider.addScope('public_repo');
  githubProvider.addScope('read:user');
  githubProvider.addScope('user.email');

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
      .signInWithPopup(githubProvider)
      .catch((error) => handleErrors(toast, error));

    if (authUser) onSuccess();
  };

  const schema = yup.object().shape({
    email: validEmail,
    password: validPassword,
  });

  const fields = [emailField(), passwordField()];

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
                Sign In with Github{' '}
                <Icon
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
