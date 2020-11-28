import React from 'react';
import { Box, Heading } from '@chakra-ui/core';
import { useParams } from 'react-router-dom';
import Page from '@openmined/shared/util-page';
import { useSanity } from '@openmined/shared/data-access-sanity';

import { coursesProjection } from '../../../helpers';
import GridContainer from '../../../components/GridContainer';
import waveform from '../../../assets/waveform/waveform-top-left-cool.png';

export default () => {
  const { slug } = useParams();
  const { data, loading } = useSanity(
    `*[_type == "course" && slug.current == "${slug}"] ${coursesProjection}[0]`
  );

  if (loading) return null;

  return (
    <Page title={data.title} description={data.description}>
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
          display: ['none', null, null, 'block'],
        }}
      />
      <GridContainer isInitial pt={[8, null, null, 16]} pb={16}>
        <Heading as="h1" size="3xl">
          {data.title}
        </Heading>
      </GridContainer>
    </Page>
  );
};
