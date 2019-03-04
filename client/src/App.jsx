import React, { useState, useEffect } from "react";
import { differenceInMonths, startOfMonth } from "date-fns";

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
    body: JSON.stringify(purchase)
  });
};

const updatePurchaseHistory = async setPurchaseHistory => {
  let newHistory = await getPurchases();
  setPurchaseHistory(newHistory);
};

function usePurchases() {
  const startDate = startOfMonth(new Date(2019, 1, 28));
  const today = startOfMonth(new Date());
  const monthStartsSinceStartDate = differenceInMonths(today, startDate);
  const startBalance = 125 * monthStartsSinceStartDate;

  const [state, setState] = useState({
    startBalance,
    purchaseName: "",
    purchaseAmount: 0.0,
    purchaseHistory: []
  });

  useEffect(() => {
    updatePurchaseHistory(setPurchaseHistory);
  }, []);

  const setPurchaseHistory = purchaseHistory =>
    setState({ ...state, purchaseHistory });
  const setPurchaseName = purchaseName => setState({ ...state, purchaseName });
  const setPurchaseAmount = purchaseAmount => {
    const value = Number.parseFloat(purchaseAmount);
    if (Number.isNaN(value)) {
      setState({ ...state, purchaseAmount });
    } else {
      setState({ ...state, purchaseAmount: value });
    }
  };

  const addNewPurchase = () => {
    if (state.purchaseName !== "" && state.purchaseAmount > 0) {
      const newPurchase = {
        date: new Date(),
        purchaseName: state.purchaseName,
        purchaseAmount: state.purchaseAmount
      };
      postPurchase(newPurchase);
      setState({
        purchaseName: "",
        purchaseAmount: 0,
      });
      updatePurchaseHistory(setPurchaseHistory);
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

const PurchaseHistory = ({ purchaseHistory }) => (
  <div className="purchase-history">
    <h3>Purchase History</h3>
    {purchaseHistory.length === 0 ? (
      <span className="no-history">You haven't purchased anything yet</span>
    ) : (
      <table>
        <thead>
          <tr>
            <th>Purchase Date</th>
            <th>Item</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {purchaseHistory.map((item, i) => (
            <tr key={i}>
              <td>{item.date.toISOString()}</td>
              <td>{item.purchaseName}</td>
              <td>${item.purchaseAmount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

function getBalance(state) {
  let balance = state.startBalance;
  for (let purchase of state.purchaseHistory) {
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
        <button
          onClick={addNewPurchase}
          className="add-purchase-button"
        >
          Add
        </button>
      </div>
      <PurchaseHistory purchaseHistory={state.purchaseHistory} />
    </div>
  );
}
