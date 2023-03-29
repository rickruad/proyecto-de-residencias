import { useState, useEffect } from 'react';

import axios from 'axios';

interface useUpdateUserProps {
  id: number,
  email: string,
  password: string,
  username: string,
  birthdate: string
};

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

export const register = ({ username, birthdate, email, password }: { username: string, birthdate: string, email: string, password: string }) => {
  return axios.post('http://localhost:3001/api/sing-up', { username: username, birthdate: birthdate, email: email, password: password });
}

export const useLogin = ({ email, password }: { email: string, password: string }) => {
  const [status, setStatus] = useState('');

  axios.post('http://localhost:3001/api/sing-in', { email: email, password: password }).then((response) => {
    if (response.data.message) {
      setStatus(response.data.message);
    } else {
      setStatus('Iniciada la sesión con exito')
    }
  })

  return status;
}

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

export const useActualUserInformation = () => {
  const [id, setId] = useState(0);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [status, setStatus] = useState(0);
  const [admin, setAdmin] = useState(0);

  useEffect(() => {
    axios.post('http://localhost:3001/api/user').then((response) => {
      if (response.data.message == 'USER ERROR') {
        setUsername(response.data.message);
        setEmail(response.data.message);
        setPassword(response.data.message);
        setBirthdate(response.data.message);
      } else {
        setId(response.data[0].id);
        setUsername(response.data[0].username);
        setEmail(response.data[0].email);
        setPassword(response.data[0].password);
        setBirthdate(response.data[0].birthdate);
        setStatus(response.data[0].status);
        setAdmin(response.data[0].admin);
      }
    });
  }, []);

  return {
    id,
    username,
    email,
    password,
    birthdate,
    status,
    admin
  }
};

export const useAllUsersInformation = () => {
  const [length, setLength] = useState(0);
  const [ids, setIds] = useState<number[]>([0]);
  const [emails, setEmails] = useState<string[]>(['']);
  const [passwords, setPasswords] = useState<string[]>(['']);
  const [usernames, setUsernames] = useState<string[]>(['']);
  const [birthdates, setBirthdates] = useState<string[]>(['']);
  const [statuses, setStatuses] = useState<number[]>([0]);
  const [admins, setAdmins] = useState<number[]>([0]);

  useEffect(() => {
    axios.post('http://localhost:3001/api/users').then((response) => {
      if (response.data.message) {
        setUsernames(response.data.message);
        setEmails(response.data.message);
        setPasswords(response.data.message);
        setBirthdates(response.data.message);
      } else {
        setLength(response.data.length + 1);
        for (let i = 0; i < response.data.length; i++) {
          setIds(prevIds => [...prevIds, response.data[i].id]);
          setEmails(prevEmails => [...prevEmails, response.data[i].email]);
          setPasswords(prevPasswords => [...prevPasswords, response.data[i].password]);
          setUsernames(prevUsernames => [...prevUsernames, response.data[i].username]);
          setBirthdates(prevBirthdates => [...prevBirthdates, response.data[i].birthdate]);
          setStatuses(prevStatuses => [...prevStatuses, response.data[i].status]);
          setAdmins(prevAdmins => [...prevAdmins, response.data[i].admin])
        }
      }
    })
  }, [])

  return {
    ids,
    length,
    emails,
    passwords,
    usernames,
    birthdates,
    statuses,
    admins
  }
}

export const deleteUser = ({ username }: { username: string }) => {
  return axios.post('http://localhost:3001/api/delete-user', { username: username });
}

export const promoteUser = ({ username }: { username: string }) => {
  return axios.post('http://localhost:3001/api/promote-user', { username: username });
}

export const useUpdateUser = ({ email, password, username, birthdate, id }: useUpdateUserProps) => {
  const [message, setMessage] = useState('');

  axios.post('http://localhost:3001/api/update-user', { email: email, password: password, username: username, birthdate: birthdate, id: id }).then((response) => {
    setMessage(response.data.message);
  })

  return message;
}

const Server = {
  useIsOnline,
  register,
  useLogin,
  logout,
  useLoginAuthenticationInsidePage,
  useLoginAuthenticationOutsidePage,
  useActualUserInformation,
  useAllUsersInformation,
  deleteUser,
  promoteUser,
  useUpdateUser
};

export default Server;