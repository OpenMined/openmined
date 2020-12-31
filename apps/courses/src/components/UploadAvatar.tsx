import React, { useState } from 'react';
import { Avatar, AvatarBadge, Box } from '@chakra-ui/react';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { useDropzone } from 'react-dropzone';

import Icon from './Icon';

export default ({ currentAvatar, setAvatarFile, ...props }: any) => {
  const [preview, setPreview] = useState<string | undefined>();

  const onDrop = (files) => {
    setAvatarFile(files[0]);

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(URL.createObjectURL(files[0]));
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
