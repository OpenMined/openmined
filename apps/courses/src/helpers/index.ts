import { useState, useEffect, useCallback } from 'react';
import { toastConfig } from '../components/Toast';
import { Link as RRDLink, useSearchParams } from 'react-router-dom';

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

export const useQueryState = (keys) => {
  const [params, setParams] = useSearchParams();

  const existing = {};
  keys.forEach((key) => (existing[key] = params.get(key) || null));

  const [value, setValue] = useState(existing);

  const onSetValue = useCallback(
    (newVal) => {
      setValue(newVal);

      Object.keys(newVal).forEach(
        (key) => newVal[key] === null && delete newVal[key]
      );

      setParams(newVal);
    },
    [setParams]
  );

  return [value, onSetValue];
};

export const handleErrors = (toast, error) =>
  toast({
    ...toastConfig,
    title: 'Error',
    description: error.message,
    status: 'error',
  });

export const SIDEBAR_WIDTH = 280;

export const getLinkPropsFromLink = (link: string) => {
  const isExternal = /^https?:\/\//.test(link);

  const linkProps = isExternal
    ? {
        as: 'a',
        href: link,
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {
        as: RRDLink,
        to: link,
      };

  return linkProps as any;
};
