import { useState, useEffect } from 'react';
import { Link as RRDLink } from 'react-router-dom';
import { useAuth } from 'reactfire';

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

export const useGithubAuthProvider = () => {
  const githubProvider = new useAuth.GithubAuthProvider();

  githubProvider.addScope('public_repo');
  githubProvider.addScope('read:user');
  githubProvider.addScope('user.email');

  return githubProvider;
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
