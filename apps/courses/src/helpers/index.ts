import { useState, useEffect, useRef } from 'react';
import { Link as RRDLink } from 'react-router-dom';
import { useAuth, useFirestore, useUser } from 'reactfire';

import { toastConfig } from '../components/Toast';
import { User } from '@openmined/shared/types';

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

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
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

export const analytics = {
  logEvent: (label, props = null) => {
    // @ts-ignore
    const plausible = window.plausible;

    if (props) plausible(label, { props });
    else plausible(label);
  },
};

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

export const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export const useDbUser = () => {
  const user: firebase.User = useUser();
  const db = useFirestore();
  const [dbUser, setDbUser] = useState<User>(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user: User = (await dbUserRef.get()).data() as User;
        setDbUser(user);
      } catch (err) {
        // pass
      }
    };
    const dbUserRef = user ? db.collection('users').doc(user.uid) : null;
    dbUserRef && fetchUser();
  }, [user]);

  return dbUser;
};
