import { MdShoppingBag } from "react-icons/md";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";

import Link from "next/link";

import * as Server from "@/hooks/Server";
import * as AuxiliarFunctions from "@/hooks/AuxiliarFunctions";

import styles from "./styles/styles.module.css";

export default function Buy() {
  const { username } = Server.GetCurrentUserInformation();
  const {
    idCart,
    usernameCart,
    dateAddedCart,
    productCart,
    priceSelectedCart,
    quantityCart,
  } = Server.GetAllCart();

  const [dateMin, setDateMin] = useState<string>("");
  const [dateAdded, setDateAdded] = useState<string>("");
  const [dateAddedMili, setDateAddedMili] = useState<string>("");

  const [totalPrice, setTotalPrice] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<number>(0);
  const [currentUsername, setCurrentUsername] = useState<string>("");
  const [allProductsCart, setAllProductsCart] = useState<string>("");

  const [cardTypeValue, setCardTypeValue] = useState<string>("visa");
  const [nameCardValue, setNameCardValue] = useState<string>("");
  const [numberCardValue, setNumberCardValue] = useState<string>("");
  const [dateExpireCardValue, setDateExpireCardValue] = useState<string>("");
  const [codeCardValue, setCodeCardValue] = useState<string>("");
  const [fullNameValue, setFullNameValue] = useState<string>("");
  const [countryValue, setCountryValue] = useState<string>("");
  const [locateValue, setLocateValue] = useState<string>("");
  const [firstDirectionValue, setFirstDirectionValue] = useState<string>("");
  const [secondDirectionValue, setSecondDirectionValue] = useState<string>("");
  const [postalCodeValue, setPostalCodeValue] = useState<string>("");
  const [numberPhoneValue, setNumberPhoneValue] = useState<string>("");
  const [saveCardInfo, setSaveCardInfo] = useState<boolean>(false);

  useEffect(() => {
    setCurrentUsername(username);
  }, [username]);

  useEffect(() => {
    const date = new Date();
    const dateToMili = date.getTime();
    setCurrentDate(dateToMili);
  }, []);

  const filterAllCart = usernameCart
    .map((username, index) => {
      return {
        id: idCart[index],
        username: username,
        dateAdded: dateAddedCart[index],
        product: productCart[index],
        price: priceSelectedCart[index],
        quantity: quantityCart[index],
      };
    })
    .filter((username, index, self) => {
      return (
        index ===
        self.findIndex((a) => {
          return a.id === username.id && a.username === currentUsername;
        })
      );
    });

  filterAllCart.sort(
    (a, b) => b.dateAdded - currentDate - (a.dateAdded - currentDate)
  );

  useEffect(() => {
    var totalPrice = 0;
    var allProducts = [];
    if (filterAllCart) {
      for (let i = 0; i < filterAllCart.length; i++) {
        totalPrice =
          totalPrice + filterAllCart[i].price * filterAllCart[i].quantity;
        allProducts.push(filterAllCart[i].product);
      }
    }

    setTotalPrice(totalPrice.toString());
    setAllProductsCart(allProducts.join(", "));
  }, [filterAllCart, filterAllCart.length]);

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDay();
    const mili = date.getTime();

    setDateAddedMili(mili.toString());
    setDateMin(`${year}-${month > 9 ? month : `0${month}`}`);
    setDateAdded(
      `${year}-${month > 9 ? month : `0${month}`}-${day > 9 ? day : `0${day}`}`
    );
  }, []);

  useEffect(() => {
    const firstNumber = numberCardValue.slice(0, 1);
    if (Number(firstNumber) === 4) {
      setCardTypeValue("visa");
    } else if (Number(firstNumber) === 5) {
      setCardTypeValue("mastercard");
    } else if (numberCardValue.length === 0) {
      setCardTypeValue("");
    } else {
      setCardTypeValue("tarjeta invalida");
    }
  }, [numberCardValue]);

  const handleNameCard = (event: ChangeEvent<HTMLInputElement>) => {
    setNameCardValue(event.target.value);
  };

  const handleNumberCard = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length < 20) {
      var inputVal = event.target.value;
      inputVal = inputVal.replace(/[^0-9]/g, "");

      if (inputVal.length > 4 && inputVal.length <= 8) {
        inputVal = inputVal.slice(0, 4) + "-" + inputVal.slice(4);
      } else if (inputVal.length > 8 && inputVal.length <= 12) {
        inputVal =
          inputVal.slice(0, 4) +
          "-" +
          inputVal.slice(4, 8) +
          "-" +
          inputVal.slice(8);
      } else if (inputVal.length > 12) {
        inputVal =
          inputVal.slice(0, 4) +
          "-" +
          inputVal.slice(4, 8) +
          "-" +
          inputVal.slice(8, 12) +
          "-" +
          inputVal.slice(12);
      }

      setNumberCardValue(inputVal);
    }
  };

  const handleDateExpireCard = (event: ChangeEvent<HTMLInputElement>) => {
    setDateExpireCardValue(event.target.value);
  };

  const handleCodeCard = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length <= 4) {
      setCodeCardValue(event.target.value);
    }
  };

  const handleFullName = (event: ChangeEvent<HTMLInputElement>) => {
    setFullNameValue(event.target.value);
  };

  const handleCountry = (event: ChangeEvent<HTMLInputElement>) => {
    setCountryValue(event.target.value);
  };

  const handleLocate = (event: ChangeEvent<HTMLInputElement>) => {
    setLocateValue(event.target.value);
  };

  const handleFirstDirection = (event: ChangeEvent<HTMLInputElement>) => {
    setFirstDirectionValue(event.target.value);
  };

  const handleSecondDirection = (event: ChangeEvent<HTMLInputElement>) => {
    setSecondDirectionValue(event.target.value);
  };

  const handlePostalCode = (event: ChangeEvent<HTMLInputElement>) => {
    setPostalCodeValue(event.target.value);
  };

  const handleNumberPhone = (event: ChangeEvent<HTMLInputElement>) => {
    const number = event.target.value;
    const phoneNumber = number.replace(/\D/g, "");
    let formattedNumber = "";

    for (let i = 0; i < phoneNumber.length; i++) {
      if (i === 0) {
        formattedNumber += `+${phoneNumber[i]}`;
      } else if (i === 2) {
        formattedNumber += ` ${phoneNumber[i]}`;
      } else if (i === 5) {
        formattedNumber += ` ${phoneNumber[i]}`;
      } else if (i === 8) {
        formattedNumber += `-${phoneNumber[i]}`;
      } else if (i >= 12) {
        formattedNumber += "";
      } else {
        formattedNumber += phoneNumber[i];
      }
    }

    setNumberPhoneValue(formattedNumber);
  };

  const handleSaveCardInfo = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      setSaveCardInfo(!saveCardInfo);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (cardTypeValue !== "tarjeta invalida") {
      var secondDirection = "";

      if (secondDirectionValue) {
        secondDirection = secondDirectionValue;
      } else {
        secondDirection = "none";
      }

      Server.saveBuy({
        username: username,
        products: allProductsCart,
        date: dateAdded,
        dateadded: dateAddedMili,
        totalprice: totalPrice,
        type: cardTypeValue,
        namecard: nameCardValue,
        numbercard: numberCardValue,
        expirationdatecard: dateExpireCardValue,
        securitycodecard: codeCardValue,
        fullname: fullNameValue,
        country: countryValue,
        locality: locateValue,
        firstdirection: firstDirectionValue,
        seconddirection: secondDirection,
        postalcode: postalCodeValue,
        phonenumber: numberPhoneValue,
        save: saveCardInfo,
      });
    } else {
      console.log("ERROR");
    }
  };

  return (
    <>
      <section className={styles.buySection}>
        <div className={styles.title}>
          <MdShoppingBag className={styles.icon} />
          <h2>{"Comprar"}</h2>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.cardInfo}>
            <h3>Ingrese los datos de su tarjeta</h3>
            <div className={styles.typeNameCard}>
              <div className={styles.labelOptions}>
                <label>Tipo de tarjeta</label>
                <h3>
                  {AuxiliarFunctions.wordsToCapitalLetter({
                    text: cardTypeValue,
                  })}
                </h3>
              </div>
              <div className={styles.labelInput}>
                <label>Nombre a cargo de la tarjeta</label>
                <input
                  type="text"
                  pattern="[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+"
                  required={true}
                  value={nameCardValue}
                  onChange={handleNameCard}
                />
              </div>
            </div>
            <div className={styles.numberDateCodeCard}>
              <div className={styles.labelNumberCard}>
                <label>Número de la tarjeta</label>
                <input
                  type="text"
                  pattern="[0-9\-]*"
                  required={true}
                  value={numberCardValue}
                  onChange={handleNumberCard}
                />
              </div>
              <div className={styles.labelMonthCard}>
                <label>Fecha de caducidad</label>
                <input
                  type="month"
                  min={dateMin}
                  required={true}
                  value={dateExpireCardValue}
                  onChange={handleDateExpireCard}
                />
              </div>
              <div className={styles.labelCodeCard}>
                <label>Código de seguridad</label>
                <input
                  type="number"
                  required={true}
                  value={codeCardValue}
                  onChange={handleCodeCard}
                />
              </div>
            </div>
          </div>
          <div className={styles.personalInfo}>
            <h3>Ingrese sus datos personales</h3>
            <div className={styles.labelInputContainer}>
              <div className={styles.labelInput}>
                <label>Nombre completo</label>
                <input
                  type="text"
                  pattern="[A-Za-zñÑáéíóúÁÉÍÓÚ\s]+"
                  required={true}
                  value={fullNameValue}
                  onChange={handleFullName}
                />
              </div>
              <div className={styles.labelInput}>
                <label>País</label>
                <input
                  type="text"
                  pattern="[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+"
                  required={true}
                  value={countryValue}
                  onChange={handleCountry}
                />
              </div>
              <div className={styles.labelInput}>
                <label>Localidad</label>
                <input
                  type="text"
                  pattern="[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+"
                  required={true}
                  value={locateValue}
                  onChange={handleLocate}
                />
              </div>
              <div className={styles.labelInput}>
                <label>1ra Dirección de facturación</label>
                <input
                  type="text"
                  pattern="[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s]+"
                  required={true}
                  value={firstDirectionValue}
                  onChange={handleFirstDirection}
                />
              </div>
              <div className={styles.labelInput}>
                <label>2da Dirección de facturación</label>
                <input
                  type="text"
                  pattern="[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s]+"
                  value={secondDirectionValue}
                  onChange={handleSecondDirection}
                />
              </div>
              <div className={styles.labelInput}>
                <label>Código postal</label>
                <input
                  type="text"
                  pattern="[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s]+"
                  required={true}
                  value={postalCodeValue}
                  onChange={handlePostalCode}
                />
              </div>
              <div className={styles.labelInput}>
                <label>Número de telefono</label>
                <input
                  type="tel"
                  pattern="[0-9+\-\s]*"
                  required={true}
                  value={numberPhoneValue}
                  onChange={handleNumberPhone}
                />
              </div>
            </div>
          </div>
          <div className={styles.checkBox}>
            <input type="checkbox" onChange={handleSaveCardInfo} />
            <h4>Guardar esta información para una próxima compra</h4>
          </div>
          <div className={styles.buttons}>
            <Link className={styles.back} href={{ pathname: "../../" }}>
              Regresar
            </Link>
            <button className={styles.confirm} type="submit">
              Confirmar
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
