import React, { useState } from 'react';
import { Avatar, AvatarBadge, Box } from '@chakra-ui/react';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { useDropzone } from 'react-dropzone';
import { useStorage, useFirestore, useUser } from 'reactfire';

import Icon from './Icon';
import useToast, { toastConfig } from './Toast';

export default ({ currentAvatar, ...props }: any) => {
  const [preview, setPreview] = useState<string | undefined>();
  const storage = useStorage();
  const user = useUser();
  const db = useFirestore();
  const toast = useToast();

  const onDrop = (files) => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(URL.createObjectURL(files[0]));

    const storageRef = storage.ref(`/users/${user.uid}`);
    const file = files[0];

    return storageRef
      .put(file)
      .then(() =>
        storageRef.getDownloadURL().then((photo_url) =>
          db
            .collection('users')
            .doc(user.uid)
            .set({ photo_url }, { merge: true })
            .then(() =>
              toast({
                ...toastConfig,
                title: 'Profile photo uploaded',
                description: 'Please refresh to see this change live...',
                status: 'success',
              })
            )
        )
      )
      .catch(({ message }) =>
        toast({
          ...toastConfig,
          title: 'Error',
          description: message,
          status: 'error',
        })
      );
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Box {...getRootProps()} {...props} w="auto">
      <Avatar src={preview || currentAvatar} cursor="pointer" size="2xl">
        <input {...getInputProps()} />
        <AvatarBadge
          bg="gray.800"
          border={0}
          boxSize="0.75em"
          right={2}
          bottom={2}
        >
          <Icon icon={faPencilAlt} color="white" style={{ width: '0.35em' }} />
        </AvatarBadge>
      </Avatar>
    </Box>
  );
};
