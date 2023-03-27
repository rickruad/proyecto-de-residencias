import { useState, useEffect } from 'react';

import Axios from 'axios';

export const ItsOnline = () => {
  const [serverStatus, setServerStatus] = useState(null)

  Axios.post('http://localhost:3001/api/server-status')
  .then((response) => {
    setServerStatus(response.data.message);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      Axios.post('http://localhost:3001/api/server-status')
        .then((response) => {
          setServerStatus(response.data.message);
        });
    }, 1000);
    return () => clearInterval(interval);
  }, [serverStatus]);

  return serverStatus
}

const ServerStatus = {
  ItsOnline
};

export default ServerStatus;