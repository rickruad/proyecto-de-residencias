import { useState, useEffect } from 'react';

import axios from 'axios';

export const IsOnline = () => {
  const [serverStatus, setServerStatus] = useState(null)

  axios.post('http://localhost:3001/api/server-status')
  .then((response) => {
    setServerStatus(response.data.message);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      axios.post('http://localhost:3001/api/server-status')
        .then((response) => {
          setServerStatus(response.data.message);
        });
    }, 1000);
    return () => clearInterval(interval);
  }, [serverStatus]);

  return serverStatus
}

export const LoginAuthenticationInsidePage = () => {
  return (
    axios.post('http://localhost:3001/api/user-status').then((response) => {
      if (typeof window !== 'undefined') {
        if (response.data.message == 0) {
          window.location.href = './sing-in/';
        };
      }
    })
  );
}

export const LoginAuthenticationOutsidePage = () => {
  return (
    axios.post('http://localhost:3001/api/user-status').then((response) => {
      if (typeof window !== 'undefined') {
        if (response.data.message == 1) {
          window.location.href = './';
        };
      }
    })
  );
}

const Server = {
  IsOnline,
  LoginAuthenticationInsidePage,
  LoginAuthenticationOutsidePage
};

export default Server;