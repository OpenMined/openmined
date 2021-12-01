import React, { useState } from 'react';
import { Avatar, AvatarBadge, Box, Flex, Text } from '@chakra-ui/react';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { useDropzone } from 'react-dropzone';
import { useStorage, useFirestore, useUser, useAuth } from 'reactfire';
import Resizer from 'react-image-file-resizer';

import Icon from './Icon';
import useToast, { toastConfig } from './Toast';

import { handleErrors } from '../helpers';

export default ({ currentAvatar, label, ...props }: any) => {
  const [preview, setPreview] = useState<string | undefined>();
  const storage = useStorage();
  const db = useFirestore();
  const user: firebase.User = useUser();
  const auth = useAuth();
  const toast = useToast();
  const dbRef = db.collection('users').doc(user.uid);

  const filename = 'avatar.png';

  const removeAvatar = () => {
    const storageRef = storage.ref(`/users/${user.uid}/${filename}`);

    storageRef
      .delete()
      .then(() => {
        auth.currentUser.updateProfile({
          photoURL: null,
        });
        dbRef.set({ photoURL: '' }, { merge: true });
      })
      .then(() =>
        toast({
          ...toastConfig,
          title: 'Profile picture removed successfully',
          description: 'Please refresh to see this change live',
          status: 'success',
        })
      )
      .catch((error) => handleErrors(toast, error));
  };

  const onDrop = (files) => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(URL.createObjectURL(files[0]));

    const storageRef = storage.ref(`/users/${user.uid}/${filename}`);
    const file = files[0];

    Resizer.imageFileResizer(
      file,
      400,
      400,
      'png',
      100,
      0,
      (blob) => {
        // @ts-ignore
        const resizedImage = new File([blob], filename, {
          lastModified: file.lastModified,
          type: 'image/png',
        });

        return storageRef
          .put(resizedImage)
          .then(() => {
            storageRef.getDownloadURL().then((photoURL) => {
              auth.currentUser
                .updateProfile({
                  photoURL,
                })
                .then(() =>
                  toast({
                    ...toastConfig,
                    title: 'Profile photo uploaded',
                    description: 'Please refresh to see this change...',
                    status: 'success',
                  })
                )
                .catch((error) => handleErrors(toast, error));

              dbRef.set({ photoURL }, { merge: true });
            });
          })
          .catch((error) => handleErrors(toast, error));
      },
      'blob'
    );
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Box {...props}>
      <Flex direction="row">
        <Text mb={2} fontWeight={700} fontSize="sm" color="gray.700" mr={4}>
          {label}
        </Text>
        {currentAvatar && (
          <Text
            mb={2}
            fontSize="sm"
            color="red.500"
            as="u"
            cursor="pointer"
            onClick={removeAvatar}
          >
            Remove
          </Text>
        )}
      </Flex>
      <Box {...getRootProps()} w="auto">
        <Avatar src={preview || currentAvatar} cursor="pointer" size="2xl">
          <input {...getInputProps()} />
          <AvatarBadge
            bg="gray.800"
            border={0}
            boxSize="0.75em"
            right={2}
            bottom={2}
          >
            <Icon
              icon={faPencilAlt}
              color="white"
              style={{ width: '0.35em' }}
            />
          </AvatarBadge>
        </Avatar>
      </Box>
    </Box>
  );
};
