import React, { useRef, useEffect } from 'react';
import { useClipboard, Box, Icon } from '@chakra-ui/react';
import Prism from 'prismjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

import useToast, { toastConfig } from '../../../../components/Toast';
import ChakraIcon from '../../../../components/ChakraIcon';

// Plugins
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

// Languages
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-clojure';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-docker';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-graphql';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-julia';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-objectivec';
import 'prismjs/components/prism-protobuf';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-r';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-wasm';
import 'prismjs/components/prism-yaml';

// Theme
import 'prismjs/themes/prism.css';
import 'prismjs/themes/prism-tomorrow.css';

export default ({ code, language, spacing }: any) => {
  const ref = useRef();
  const { onCopy } = useClipboard(code);
  const toast = useToast();

  useEffect(() => {
    if (ref && ref.current) {
      Prism.highlightElement(ref.current);
    }
  }, []);

  return (
    <Box position="relative" my={spacing}>
      {/* SEE TODO (#3) */}
      <ChakraIcon
        icon={faCopy}
        size="lg"
        color="whiteAlpha.500"
        _hover={{ color: 'white' }}
        transitionProperty="color"
        transitionDuration="slow"
        transitionTimingFunction="ease-in-out"
        position="absolute"
        top={4}
        right={4}
        zIndex={1}
        cursor="pointer"
        onClick={() => {
          onCopy();

          toast({
            ...toastConfig,
            title: 'Code copied',
            description: 'Put that code to good use!',
            status: 'success',
          });
        }}
      />
      <pre className="line-numbers show-language">
        <code ref={ref} className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </Box>
  );
};
