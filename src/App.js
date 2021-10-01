import React, { useEffect, useState } from 'react';
import './App.scss';
import CurrencyRow from './CurrencyRow';
import { BsArrowLeftRight } from 'react-icons/bs';

// const BASE_URL = 'https://api.exchangeratesapi.io/latest'
const BASE_URL =
  'http://data.fixer.io/api/latest?access_key=820821d6d11f549a4abbb7986a69dc14&format=1';

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [exchangeRate, setExchangeRate] = useState();
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);

  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
    toAmount = toAmount.toFixed(4);
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
    fromAmount = fromAmount.toFixed(4);
  }
  // console.log(currencyOptions);

  useEffect(() => {
    fetch(BASE_URL)
      .then((res) => res.json())
      .then((data) => {
        const firstCurrency = Object.keys(data.rates)[0];
        setCurrencyOptions([data.base, ...Object.keys(data.rates)]);
        setFromCurrency(data.base);
        setToCurrency(firstCurrency);
        setExchangeRate(data.rates[firstCurrency]);
      });
  }, []);

  // useEffect(() => {
  //   if (fromCurrency != null && toCurrency != null) {
  //     fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         console.log(data.rates);
  //         setExchangeRate(data.rates[toCurrency]);
  //       });
  //   }
  // }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (fromCurrency != null) {
      fetch(BASE_URL)
        .then((res) => res.json())
        .then((data) => {
          let from = data.rates[fromCurrency];
          let to = data.rates[toCurrency];
          let amount = to / from;
          setExchangeRate(amount);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromCurrency]);

  useEffect(() => {
    if (toCurrency != null) {
      fetch(BASE_URL)
        .then((res) => res.json())
        .then((data) => {
          let from = data.rates[fromCurrency];
          let to = data.rates[toCurrency];
          let amount = to / from;
          setExchangeRate(amount);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toCurrency]);

  function handleFromAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(true);
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(false);
  }

  return (
    <>
      <div className="home">
        <div className="home_bg">
          <h1 className="home_heading">Currency Converter</h1>
        </div>
        <div className="container">
          <div className=" convert">
            <p className="convert_text">From</p>
            <CurrencyRow
              currencyOptions={currencyOptions}
              selectedCurrency={fromCurrency}
              onChangeCurrency={(e) => setFromCurrency(e.target.value)}
              onChangeAmount={handleFromAmountChange}
              amount={fromAmount}
            />
            <div className="equals">
              <BsArrowLeftRight />
            </div>
            <p className="convert_text">To</p>
            <CurrencyRow
              currencyOptions={currencyOptions}
              selectedCurrency={toCurrency}
              onChangeCurrency={(e) => setToCurrency(e.target.value)}
              onChangeAmount={handleToAmountChange}
              amount={toAmount}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
