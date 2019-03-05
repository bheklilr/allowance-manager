/**
 * @typedef {Object} Purchase
 * @property {Date} date
 * @property {string} purchaseName
 * @property {number} purchaseAmount
 */
import React, { useReducer, useEffect } from "react";
import { differenceInMonths, startOfMonth, format } from "date-fns";

import "./App.css";

const getPurchases = async () => {
  let response = await fetch("/api/history");
  let history = await response.json();
  return history.map(purchase => ({
    ...purchase,
    date: new Date(purchase.date)
  }));
};

const postPurchase = async purchase => {
  await fetch("/api/history", {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ ...purchase, date: purchase.date.toISOString() })
  });
};

const updatePurchases = async setPurchases => {
  let purchases = await getPurchases();
  setPurchases(purchases);
};

function reducer(state, action) {
  switch (action.type) {
    case "setPurchases":
      return { ...state, purchases: action.purchases };
    case "setPurchaseName":
      return { ...state, purchaseName: action.purchaseName };
    case "setPurchaseAmount":
      return { ...state, purchaseAmount: action.purchaseAmount };
    default:
      return state;
  }
}

function usePurchases() {
  const startDate = startOfMonth(new Date(2019, 1, 28));
  const today = startOfMonth(new Date());
  const monthStartsSinceStartDate = differenceInMonths(today, startDate);
  const startBalance = 125 * monthStartsSinceStartDate;

  const [state, dispatch] = useReducer(reducer, {
    startBalance,
    purchaseName: "",
    purchaseAmount: "0.00",
    purchases: []
  });
  
  useEffect(() => {
    updatePurchases(setPurchases);
  }, []);

  const setPurchases = purchases => dispatch({ type: 'setPurchases', purchases });
  const setPurchaseName = purchaseName => dispatch({ type: 'setPurchaseName', purchaseName });
  const setPurchaseAmount = purchaseAmount => dispatch({ type: 'setPurchaseAmount', purchaseAmount });

  const addNewPurchase = () => {
    let purchaseAmount = Number.parseFloat(state.purchaseAmount);
    if (Number.isNaN(purchaseAmount)) {
      purchaseAmount = 0;
    }
    if (state.purchaseName !== "" && purchaseAmount > 0) {
      const newPurchase = {
        date: new Date(),
        purchaseName: state.purchaseName,
        purchaseAmount: purchaseAmount
      };
      postPurchase(newPurchase);
      setPurchaseName("");
      setPurchaseAmount("0.00");
      window.setTimeout(() => updatePurchases(setPurchases), 250);
    }
  };
  return [state, setPurchaseName, setPurchaseAmount, addNewPurchase];
}

const Balance = ({ balance }) => (
  <h2>
    Current Balance:
    <span className={balance < 0 ? "negative balance" : "balance"}>
      ${balance.toFixed(2)}
    </span>
  </h2>
);

const Card = (props) => (
  <div className="card">
    {props.children}
  </div>
);

/**
 * 
 * @typedef {Object} PurchasesProps
 * @property {Purchase[]} purchases
 */

/**
 * @param {PurchasesProps} props 
 */
const Purchases = (props) => (
  <div className="purchase-history">
    <h3>Purchase History</h3>
    {props.purchases.length === 0 ? (
      <span className="no-history">You haven't purchased anything yet</span>
    ) : (
      props.purchases.map((item, i) => (
        <Card key={i}>
          <div className="title">{item.purchaseName}</div>
          <span className="price">${item.purchaseAmount.toFixed(2)}</span>
          <span className="date">{format(item.date, "YYYY-MM-DD")}</span>
        </Card>
      ))
    )}
  </div>
);

function getBalance(state) {
  let balance = state.startBalance;
  for (let purchase of state.purchases) {
    balance -= purchase.purchaseAmount;
  }
  return balance;
}

export default function App() {
  const [
    state,
    setPurchaseName,
    setPurchaseAmount,
    addNewPurchase
  ] = usePurchases();
  const balance = getBalance(state);

  return (
    <div className="app">
      <Balance balance={balance} />
      <div className="form">
        <h3>Add a purchase</h3>
        <label>
          <span>Item Name</span>
          <input
            value={state.purchaseName}
            onChange={e => setPurchaseName(e.target.value)}
            className="purchase-name"
          />
        </label>
        <label>
          <span>Item Price</span>
          <input
            type="numeric"
            value={state.purchaseAmount}
            min={0}
            className={
              state.purchaseAmount > balance
                ? "purchase-amount danger"
                : "purchase-amount"
            }
            onChange={e => setPurchaseAmount(e.target.value)}
          />
        </label>
        <button onClick={addNewPurchase} className="add-purchase-button">
          Add
        </button>
      </div>
      <Purchases purchases={state.purchases} />
    </div>
  );
}
