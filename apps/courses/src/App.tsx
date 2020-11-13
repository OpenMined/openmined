import React, { Suspense, useEffect, useState, useLayoutEffect } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { useAnalytics } from 'reactfire';

import Routes from './routes';

import Header from './components/Header';
import Loading from './components/Loading';
import Cookies from './components/Cookies';

const Analytics = ({ location }) => {
  const analytics = useAnalytics();

  useEffect(() => {
    analytics.logEvent('page-view', { path_name: location.pathname });
  }, [location.pathname, analytics]);

  return null;
};

const history = createBrowserHistory();

const App = () => {
  const [cookiePrefs, setCookiePrefs] = useState(
    window.localStorage.getItem('@openmined/cookie-preferences') || null
  );
  const [action, setAction] = useState(history.action);
  const [location, setLocation] = useState(history.location);

  useLayoutEffect(() => {
    history.listen(({ location, action }) => {
      setLocation(location);
      setAction(action);
    });
  }, []);

  const storeCookiePrefs = (preference) => {
    window.localStorage.setItem('@openmined/cookie-preferences', preference);
    setCookiePrefs(preference);
  };

  return (
    <Router action={action} location={location} navigator={history}>
      <Suspense fallback={<Loading />}>
        {cookiePrefs === 'all' && <Analytics location={location} />}
        <Header />
        <Routes />
        {!cookiePrefs && <Cookies callback={storeCookiePrefs} />}
      </Suspense>
    </Router>
  );
};

export default App;
