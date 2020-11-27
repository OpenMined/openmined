import React from 'react';
import {
  Avatar,
  AvatarBadge,
  Box,
  Heading,
  Icon,
  useToken,
} from '@chakra-ui/core';
import Page from '@openmined/shared/util-page';
import { useParams, Link } from 'react-router-dom';
import { User } from '@openmined/shared/types';
import { useUser, useFirestoreDocDataOnce, useFirestore } from 'reactfire';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import GridContainer from '../../components/GridContainer';
import waveform from '../../assets/waveform/waveform-top-left-cool.png';

export default () => {
  const gray50 = useToken('colors', 'gray.50');
  const user = useUser();
  const db = useFirestore();
  const { uid } = useParams();

  const dbUserRef = db.collection('users').doc(uid);
  const dbUser: User = useFirestoreDocDataOnce(dbUserRef);

  const isSameUser = user && uid === user.uid;
  const name = `${dbUser.first_name} ${dbUser.last_name}`;

  return (
    <Page title={name} body={{ style: `background: ${gray50};` }}>
      <Box
        position="relative"
        _before={{
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '478px',
          height: '309px',
          zIndex: -1,
          backgroundImage: `url(${waveform})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '0% 0%',
          backgroundSize: 'contain',
        }}
      >
        <GridContainer isInitial pt={8} pb={16}>
          <Avatar src={dbUser.photo_url} size="2xl">
            {isSameUser && (
              <Link to="/settings">
                <AvatarBadge
                  bg="gray.800"
                  border={0}
                  boxSize="0.75em"
                  right={2}
                  bottom={2}
                >
                  <Icon
                    as={FontAwesomeIcon}
                    icon={faPencilAlt}
                    color="white"
                    style={{ width: '0.35em' }}
                  />
                </AvatarBadge>
              </Link>
            )}
          </Avatar>
          <Heading as="h1" size="lg" mt={4}>
            {name}
          </Heading>
        </GridContainer>
      </Box>
    </Page>
  );
};
