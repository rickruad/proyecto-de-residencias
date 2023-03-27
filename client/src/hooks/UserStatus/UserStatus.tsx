import axios from 'axios';

export const InsidePage = () => {
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

export const OutsidePage = () => {
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

const UserStatus = {
  InsidePage,
  OutsidePage
};

export default UserStatus;