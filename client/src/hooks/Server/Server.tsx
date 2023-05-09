import { useState, useEffect } from 'react';

import axios from 'axios';
import localConfig from '../../../../local-config';

const { SVIP, SVPORT } = localConfig.connectionServer();

const baseURL = `http://${SVIP}:${SVPORT}/`;

export const useIsOnline = () => {
  const [serverStatus, setServerStatus] = useState(null)

  axios.post(`${baseURL}api/server-status`)
    .then((response) => {
      setServerStatus(response.data.message);
    });

  useEffect(() => {
    const interval = setInterval(() => {
      axios.post(`${baseURL}api/server-status`)
        .then((response) => {
          setServerStatus(response.data.message);
        });
    }, 1000);
    return () => clearInterval(interval);
  }, [serverStatus]);

  return serverStatus
}

export const register = ({ formData }: { formData: FormData }) => {
  return axios.post(`${baseURL}api/sing-up`, formData);
}

export const useLogin = ({ email, password }: { email: string, password: string }) => {
  const [status, setStatus] = useState('');

  axios.post(`api/sing-in`, { email: email, password: password }).then((response) => {
    if (response.data.message) {
      setStatus(response.data.message);
    } else {
      setStatus('Iniciada la sesión con exito')
    }
  })

  return status;
}

export const Logout = async () => {
  const response = await axios.post(`${baseURL}api/sing-out`);
  if (response.data.message === 'SUCCESS') {
    if (typeof window !== 'undefined') {
      window.location.href = '../../';
    }
  }
}

export const LoginAuthenticator = async () => {
  const response = await axios.post(`${baseURL}api/user-status`);
  if (response.data.message !== 1) {
    if (typeof window !== 'undefined') {
      window.location.href = '../../';
    }
  }
}

export const GetCurrentUserInformation = () => {
  const [id, setId] = useState(0);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [status, setStatus] = useState(0);
  const [admin, setAdmin] = useState(0);

  useEffect(() => {
    axios.post(`${baseURL}api/user`).then((response) => {
      if (response.data.message === 'USER ERROR') {
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
        setProfilePicture(response.data[0].profilePicture)
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
    profilePicture,
    status,
    admin
  }
};

export const GetAllUsersInformation = () => {
  const [ids, setIds] = useState<number[]>([]);
  const [emails, setEmails] = useState<string[]>([]);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [usernames, setUsernames] = useState<string[]>([]);
  const [birthdates, setBirthdates] = useState<string[]>([]);
  const [profilePictures, setProfilePictures] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<number[]>([]);
  const [admins, setAdmins] = useState<number[]>([]);

  useEffect(() => {
    axios.post(`${baseURL}api/users`).then((response) => {
      if (response.data.message) {
        setUsernames(response.data.message);
        setEmails(response.data.message);
        setPasswords(response.data.message);
        setBirthdates(response.data.message);
      } else {
        for (let i = 0; i < response.data.length; i++) {
          setIds(prevIds => [...prevIds, response.data[i].id]);
          setEmails(prevEmails => [...prevEmails, response.data[i].email]);
          setPasswords(prevPasswords => [...prevPasswords, response.data[i].password]);
          setUsernames(prevUsernames => [...prevUsernames, response.data[i].username]);
          setBirthdates(prevBirthdates => [...prevBirthdates, response.data[i].birthdate]);
          setProfilePictures(prevProfilePictures => [...prevProfilePictures, response.data[i].profilePicture]);
          setStatuses(prevStatuses => [...prevStatuses, response.data[i].status]);
          setAdmins(prevAdmins => [...prevAdmins, response.data[i].admin])
        }
      }
    })
  }, [])

  return {
    ids,
    emails,
    passwords,
    usernames,
    birthdates,
    profilePictures,
    statuses,
    admins
  }
}

export const deleteUser = ({ id }: { id: number }) => {
  return axios.post(`${baseURL}api/delete-user`, { id: id });
}

export const promoteUser = ({ id }: { id: number }) => {
  return axios.post(`${baseURL}api/promote-user`, { id: id });
}

export const deleteUserCart = ({ username }: { username: string }) => {
  axios.post(`${baseURL}api/delete-user-cart`, { username: username });
}

export const GetAllProducts = () => {
  const [ids, setIds] = useState<number[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [datesAdded, setDatesAdded] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [prices, setPrices] = useState<string[]>([]);
  const [cashbacks, setCashbacks] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);

  useEffect(() => {
    axios.post(`${baseURL}api/get-products`).then((response) => {
      if (response.data.message) {
        setProducts(response.data.message);
        setDescriptions(response.data.message);
        setCategories(response.data.message);
        setTypes(response.data.message);
      } else {
        for (let i = 0; i < response.data.length; i++) {
          setIds(prevIds => [...prevIds, response.data[i].id]);
          setProducts(prevProducts => [...prevProducts, response.data[i].product]);
          setDatesAdded(prevDatesAdded => [...prevDatesAdded, response.data[i].dateadded])
          setImages(prevImages => [...prevImages, response.data[i].image]);
          setDescriptions(prevDescriptions => [...prevDescriptions, response.data[i].description]);
          setPrices(prevPrices => [...prevPrices, response.data[i].price]);
          setCashbacks(prevCashback => [...prevCashback, response.data[i].cashback]);
          setCategories(prevCategories => [...prevCategories, response.data[i].category]);
          setTypes(prevTypes => [...prevTypes, response.data[i].type]);
        }
      }
    })
  }, []);

  return {
    ids,
    products,
    datesAdded,
    images,
    descriptions,
    prices,
    cashbacks,
    categories,
    types
  }
}

export const addProduct = ({ formData }: { formData: FormData }) => {
  return axios.post(`${baseURL}api/add-product`, formData);
}

interface addProductToCartProps {
  username: string,
  dateAdded: string,
  product: string,
  priceselected: string,
  cashback: string,
  quantity: string
}

export const addProductToCart = ({ username, dateAdded, product, priceselected, cashback, quantity }: addProductToCartProps) => {
  return axios.post(`${baseURL}api/users-cart`, {
    username: username,
    dateAdded: dateAdded,
    product: product,
    priceselected: priceselected,
    cashback: cashback,
    quantity: quantity
  });
}

export const GetAllCart = () => {
  const [idCart, setIdCart] = useState<number[]>([]);
  const [usernameCart, setUsernameCart] = useState<string[]>([]);
  const [dateAddedCart, setDateAddedCart] = useState<number[]>([]);
  const [productCart, setProductCart] = useState<string[]>([]);
  const [priceSelectedCart, setPriceSelectedCart] = useState<number[]>([]);
  const [cashbacks, setCashbacks] = useState<number[]>([]);
  const [quantityCart, setQuantityCart] = useState<number[]>([]);

  useEffect(() => {
    axios.post(`${baseURL}api/get-cart`).then((response) => {
      if (response.data.message) {
        console.log(response.data.message);
      } else {
        for (let i = 0; i < response.data.length; i++) {
          setIdCart(prevId => [...prevId, response.data[i].id]);
          setUsernameCart(prevUsername => [...prevUsername, response.data[i].username]);
          setDateAddedCart(prevDateAdded => [...prevDateAdded, response.data[i].dateadded]);
          setProductCart(prevProduct => [...prevProduct, response.data[i].product]);
          setPriceSelectedCart(prevPriceSelected => [...prevPriceSelected, response.data[i].priceselected]);
          setCashbacks(prevCashback => [...prevCashback, response.data[i].cashback]);
          setQuantityCart(prevQuantity => [...prevQuantity, response.data[i].quantity]);
        }
      }
    });
  }, [])

  return {
    idCart,
    usernameCart,
    dateAddedCart,
    productCart,
    priceSelectedCart,
    cashbacks,
    quantityCart
  }
}

export const removeProductToCart = async ({ id, pathname, query }: { id: number, pathname: string, query: string }) => {
  const response = await axios.post(`${baseURL}api/remove-product-cart`, { id: id });
  if (response.data.message === 'SUCCESS') {
    if (typeof window !== 'undefined') {
      window.location.href = `../..${pathname}${query.length > 0 ? `?category=${query}` : ''}`;
    }
  }
}

interface saveBuyProps {
  username: string,
  products: string,
  date: string,
  dateadded: string,
  totalprice: string,
  type?: string,
  namecard?: string,
  numbercard?: string,
  expirationdatecard?: string,
  securitycodecard?: string,
  fullname?: string,
  country?: string,
  locality?: string,
  firstdirection?: string,
  seconddirection?: string,
  postalcode?: string,
  phonenumber?: string,
  save: boolean
}

export const saveBuy = ({ username, products, date, dateadded, totalprice, type, namecard, numbercard, expirationdatecard, securitycodecard, fullname, country, locality, firstdirection, seconddirection, postalcode, phonenumber, save }: saveBuyProps) => {
  if (save) {
    axios.post(`${baseURL}api/save-info-buy`, { username, type, namecard, numbercard, expirationdatecard, securitycodecard, fullname, country, locality, firstdirection, seconddirection, postalcode, phonenumber }).then((response) => {
      axios.post(`${baseURL}api/buy-product`, { username, products, date, dateadded, totalprice }).then((response) => {
        if (response.data.message === 'SUCCESSFULLY DELETED') {
          if (typeof window !== 'undefined') {
            window.location.href = '../../purchase-history';
          }
        }
      })
    })
  } else {
    axios.post(`${baseURL}api/buy-product`, { username, products, date, dateadded, totalprice }).then((response) => {
      if (response.data.message === 'SUCCESSFULLY DELETED') {
        if (typeof window !== 'undefined') {
          window.location.href = '../../purchase-history';
        }
      }
    })
  }
}

export const GetPurchaseHistory = () => {
  const [IDs, setIDs] = useState<number[]>([]);
  const [usernames, setUsernames] = useState<string[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [datesAdded, setDatesAdded] = useState<string[]>([]);
  const [datesAddedMili, setDatesAddedMili] = useState<number[]>([]);
  const [totalPrices, setTotalPrices] = useState<number[]>([]);
  
  useEffect(() => {
    axios.post(`${baseURL}api/get-purchase-history`).then((response) => {
      if (response.data.message === 'ERROR') {
        console.log('ERROR');
      } else {
        for (let i = 0; i < response.data.length; i++) {
          setIDs(prevID => [...prevID, response.data[i].id]);
          setUsernames(prevUsername => [...prevUsername, response.data[i].username]);
          setProducts(prevProduct => [...prevProduct, response.data[i].product]);
          setDatesAdded(prevDateAdded => [...prevDateAdded, response.data[i].date]);
          setDatesAddedMili(prevDateAddedMili => [...prevDateAddedMili, response.data[i].dateadded]);
          setTotalPrices(prevTotalPrice => [...prevTotalPrice, response.data[i].totalprice]);
        }
      }
    })
  }, [])

  return {
    IDs,
    usernames,
    products,
    datesAdded,
    datesAddedMili,
    totalPrices
  }
}

type CardProps = {
  id: number,
  type: string,
  name: string,
  number: string,
  expirationDate: string,
  securityCode: number
}

export const GetCards = ({ username }: { username: string }) => {
  const [cards, setCards] = useState<CardProps[]>([]);

  useEffect(() => {
    axios.post(`${baseURL}api/get-cards`, { username }).then((response) => {
      if (response) {
        const cardMap = response.data.map((card : any) => {
          return {
            id: card.id,
            type: card.type,
            name: card.namecard,
            number: card.numbercard,
            expirationDate: card.expirationdatecard,
            securityCode: card.securitycodecard,
          }
        })

        setCards(cardMap);
      }
    })
  }, [username])

  return cards;
}

export const DeleteCard = ({ id }: { id: number }) => {
  axios.post(`${baseURL}api/delete-card`, { id }).then((response) => {
    if (response.data.message === 'SUCCESS') {
      if (typeof window !== 'undefined') {
        window.location.href = '../../purchase';
      }
    }
  }) 
}

export const DeleteHistory = ({ id }: { id: number }) => {
  axios.post(`${baseURL}api/delete-history`, { id }).then((response) => {
    if (response.data.message === 'SUCCESS' && typeof window !== 'undefined') {
      window.location.href = '../../account';
    }
  })
}