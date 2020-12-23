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
  Box,
} from '@chakra-ui/react';
import { Link as RRDLink } from 'react-router-dom';
import * as yup from 'yup';
import { useAuth } from 'reactfire';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

import ResetPassword from './ResetPassword';
import Form from '../_form';
import { validEmail, validPassword } from '../_validation';
import { emailField, passwordField } from '../_fields';

import useToast, { toastConfig } from '../../Toast';
import Modal from '../../Modal';
import { handleErrors, useGithubAuthProvider } from '../../../helpers';

interface SignInFormProps extends BoxProps {
  callback?: () => void;
}

export default ({ callback, ...props }: SignInFormProps) => {
  const auth = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const githubProvider = useGithubAuthProvider();

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
                {/* SEE TODO (#3) */}
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
            <Flex
              direction={['column', null, 'row']}
              justify="center"
              align={['flex-start', null, 'center']}
              mt={4}
            >
              <Link onClick={onOpen} display="block" variant="flat">
                Forgot your password?
              </Link>
              <Divider
                orientation="vertical"
                height={6}
                mx={4}
                display={['none', null, 'block']}
              />
              <Text fontWeight="bold">
                Don't have an account?{' '}
                <Link
                  as={RRDLink}
                  to="/signup"
                  fontWeight="normal"
                  variant="flat"
                >
                  Sign up for free!
                </Link>
              </Text>
            </Flex>
            <Divider my={6} maxWidth={540} mx="auto" />
            <Text fontSize="sm" color="gray.700">
              By signing in you agree to our{' '}
              <Link as={RRDLink} to="/terms" variant="flat">
                Terms of Use
              </Link>{' '}
              and{' '}
              <Link as={RRDLink} to="/policy" variant="flat">
                Privacy Policy
              </Link>
              .
            </Text>
          </>
        )}
      />
      <Modal isOpen={isOpen} onClose={onClose} title="Reset Password">
        <Box p={8}>
          <ResetPassword />
        </Box>
      </Modal>
    </>
  );
};
