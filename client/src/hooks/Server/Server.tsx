import { useState, useEffect } from 'react';

import axios from 'axios';

export const useIsOnline = () => {
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

export const useLoginAuthenticationInsidePage = () => {
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

export const useLoginAuthenticationOutsidePage = () => {
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

export const useUserInformation = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [status, setStatus] = useState(0);
  const [admin, setAdmin] = useState(0);

  axios.post('http://localhost:3001/api/user').then((response) => {
    if (response.data.message == 'USER ERROR') {
      setUsername(response.data.message);
      setEmail(response.data.message);
      setPassword(response.data.message);
      setBirthdate(response.data.message);
    } else {
      setUsername(response.data[0].username);
      setEmail(response.data[0].email);
      setPassword(response.data[0].password);
      setBirthdate(response.data[0].birthdate);
      setStatus(response.data[0].status);
      setAdmin(response.data[0].admin);
    }
  })

  return {
    username,
    email,
    password,
    birthdate,
    status,
    admin
  }
};

export const logout = () => {
  return (
    axios.post('http://localhost:3001/api/sing-out').then((response) => {
      if (response.data.message == 'Success') {
        if (typeof window !== 'undefined') {
          window.location.href = './sing-in/';
        }
      }
    })
  )
}

const Server = {
  useIsOnline,
  useLoginAuthenticationInsidePage,
  useLoginAuthenticationOutsidePage,
  useUserInformation,
  logout
};

export default Server;