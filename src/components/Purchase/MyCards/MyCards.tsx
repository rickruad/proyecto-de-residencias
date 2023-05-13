import { RiVisaLine, RiMastercardFill } from "react-icons/ri";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { MdCreditCard, MdOutlineCreditCardOff } from "react-icons/md";

import * as Server from "@/hooks/Server";
import * as AuxiliarFunctions from "@/hooks/AuxiliarFunctions";

import styles from "./styles/styles.module.css";

export default function MyCards({ username }: { username: string }) {
  const cards = Server.GetCards({ username });
  const {
    idCart,
    usernameCart,
    dateAddedCart,
    productCart,
    priceSelectedCart,
    quantityCart,
  } = Server.GetAllCart();

  const [dateAdded, setDateAdded] = useState<string>("");
  const [dateAddedMili, setDateAddedMili] = useState<string>("");

  const [totalPrice, setTotalPrice] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<number>(0);
  const [currentUsername, setCurrentUsername] = useState<string>("");
  const [allProductsCart, setAllProductsCart] = useState<string>("");
  const [secureCode, setSecureCode] = useState<number>(0);

  const [errorMessage, setErrorMessage] = useState<boolean>(false);

  const [purchaseMessageStatus, setPurchaseMessageStatus] =
    useState<boolean>(false);
  const [codeCardValue, setCodeCardValue] = useState<string>("");
  const [cardType, setCardType] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");

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
    setDateAdded(
      `${year}-${month > 9 ? month : `0${month}`}-${day > 9 ? day : `0${day}`}`
    );
  }, []);

  const handleCodeCard = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length <= 4) {
      setCodeCardValue(event.target.value);
    }
  };

  const handleHidePurchase = () => {
    setPurchaseMessageStatus(false);
    setCardType("");
    setCardNumber("");
    setCodeCardValue("");
    setSecureCode(0);
    setErrorMessage(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (secureCode.toString() === codeCardValue) {
      Server.saveBuy({
        username: username,
        products: allProductsCart,
        date: dateAdded,
        dateadded: dateAddedMili,
        totalprice: totalPrice,
        save: false,
      });
    } else {
      setErrorMessage(true);
    }
  };

  const showCards = cards.map((card) => {
    const handleDeleteCard = () => {
      Server.DeleteCard({ id: card.id });
    };

    const handleShowPurchase = () => {
      setPurchaseMessageStatus(true);
      setCardType(AuxiliarFunctions.wordsToCapitalLetter({ text: card.type }));
      setCardNumber(card.number.slice(-4));
      setSecureCode(card.securityCode);
    };

    return (
      <button
        key={card.id}
        onClick={handleShowPurchase}
        className={styles.card}
      >
        <MdOutlineCreditCardOff
          onClick={handleDeleteCard}
          className={styles.delete}
        />
        {card.type === "visa" ? (
          <RiVisaLine className={styles.icon} />
        ) : (
          <RiMastercardFill className={styles.icon} />
        )}

        <div className={styles.info}>
          <h2>{`**** **** **** ${card.number.slice(-4)}`}</h2>
          <h3>{card.name.toUpperCase()}</h3>
        </div>
      </button>
    );
  });

  return (
    <>
      {purchaseMessageStatus ? (
        <section className={styles.messagePurchase}>
          <div className={styles.background} />
          <form onSubmit={handleSubmit} className={styles.cartel}>
            <h3>{"Confirmar compra"}</h3>
            <h4>{`Método de pago: ${cardType} que termina en ${cardNumber}`}</h4>
            <div className={styles.labelInput}>
              <div className={styles.labelError}>
                <label>{"Código de seguridad"}</label>
                {errorMessage ? (
                  <>
                    <label>{" - "}</label>
                    <label className={styles.error}>{"Código incorrecto"}</label>
                  </>
                ) : null}
              </div>
              <input
                type="text"
                required={true}
                pattern="[0-9]*"
                minLength={3}
                value={codeCardValue}
                onChange={handleCodeCard}
              />
            </div>
            <div className={styles.buttons}>
              <button type="button" onClick={handleHidePurchase}>
                {"Cancelar"}
              </button>
              <button type="submit">{"Confirmar"}</button>
            </div>
          </form>
        </section>
      ) : null}

      <section className={styles.cardsSection}>
        <div className={styles.title}>
          <MdCreditCard className={styles.icon} />
          <h2>{"Mis tarjetas"}</h2>
        </div>
        {showCards.length > 0 ? (
          <div className={styles.cardsContainer}>{showCards}</div>
        ) : (
          <div className={styles.noCards}>
            <h2>{"No hay tarjetas guardadas"}</h2>
          </div>
        )}
      </section>
    </>
  );
}
