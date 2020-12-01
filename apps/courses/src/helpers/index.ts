import { useState, useEffect } from 'react';
import { toastConfig } from '../components/Toast';

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export const handleErrors = (toast, error) =>
  toast({
    ...toastConfig,
    title: 'Error',
    description: error.message,
    status: 'error',
  });

export const coursesProjection = (lessons = false, concepts = false) => `
{
  ...,
  "slug": slug.current,
  visual {
    "default": default.asset -> url,
    "full": full.asset -> url
  },
  learnFrom[] -> {
    ...,
    "image": image.asset -> url
  },
  ${
    lessons &&
    `lessons[] -> {
      ...,
      ${concepts ? `concepts[] ->` : ''}
    }`
  }
}
`;

export const SIDEBAR_WIDTH = 280;
