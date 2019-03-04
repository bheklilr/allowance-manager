import React, { useState } from "react";
import { differenceInMonths, startOfMonth } from "date-fns";

import "./App.css";

function usePurchases() {
  const startDate = startOfMonth(new Date(2019, 1, 28));
  const today = startOfMonth(new Date());
  const monthStartsSinceStartDate = differenceInMonths(today, startDate);
  const startBalance = 125 * monthStartsSinceStartDate;

  const [purchaseHistory, setPurchaseHistory] = useState([]);

  let currentExpenses = 0;
  for (let item of purchaseHistory) {
    currentExpenses += item.purchaseAmount || 0;
  }
  const balance = startBalance - currentExpenses;

  const [state, setState] = useState({
    startDate,
    balance,
    purchaseName: "",
    purchaseAmount: 0.0,
    purchaseHistory
  });

  const setPurchaseName = purchaseName => {
    setState({ ...state, purchaseName });
  };
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
      const newPurchaseHistory = [
        {
          date: new Date(),
          purchaseName: state.purchaseName,
          purchaseAmount: state.purchaseAmount
        },
        ...state.purchaseHistory
      ];
      setPurchaseHistory(newPurchaseHistory);
      setState({
        balance: state.balance - state.purchaseAmount,
        purchaseName: "",
        purchaseAmount: 0,
        purchaseHistory: newPurchaseHistory
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
            <td>Purchase Date</td>
            <td>Item</td>
            <td>Price</td>
          </tr>
        </thead>
        <tbody>
          {purchaseHistory.map((item, i) => (
            <tr key={i}>
              <td>{item.date.toString()}</td>
              <td>{item.purchaseName}</td>
              <td>${item.purchaseAmount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default function App() {
  const [
    state,
    setPurchaseName,
    setPurchaseAmount,
    addNewPurchase
  ] = usePurchases();

  return (
    <div className="app">
      <Balance balance={state.balance} />
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
              state.purchaseAmount > state.balance
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
