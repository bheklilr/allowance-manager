import React, { useState, useEffect } from "react";
import { differenceInMonths, startOfMonth } from "date-fns";

import "./App.css";

function usePurchaseHistory(setPurchaseHistory) {
  useEffect(() => {
    const timer = window.setInterval(() => {
      fetch("/api/history").then(response => {
        response.json().then(history => {
          setPurchaseHistory(
            history.map(purchase => ({
              ...purchase,
              date: new Date(purchase.date)
            }))
          );
        });
      });
    }, 1000);
    return () => {
      window.clearInterval(timer);
    };
  });
  const postPurchase = purchase => {
    fetch("/api/history", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(purchase)
    });
  };
  return [postPurchase];
}

function usePurchases() {
  const startDate = startOfMonth(new Date(2019, 1, 28));
  const today = startOfMonth(new Date());
  const monthStartsSinceStartDate = differenceInMonths(today, startDate);
  const startBalance = 125 * monthStartsSinceStartDate;

  const [state, setState] = useState({
    startDate,
    startBalance,
    purchaseName: "",
    purchaseAmount: 0.0,
    purchaseHistory: []
  });

  const setPurchaseHistory = purchaseHistory =>
    setState({ ...state, purchaseHistory });

  const [postPurchase] = usePurchaseHistory(setPurchaseHistory);

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
        purchaseHistory: state.purchaseHistory
      });
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
      <form>
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
          onClick={() =>
            addNewPurchase(state.purchaseName, state.purchaseAmount)
          }
          className="add-purchase-button"
        >
          Add
        </button>
      </form>
      <PurchaseHistory purchaseHistory={state.purchaseHistory} />
    </div>
  );
}
