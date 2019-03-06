import React from "react";

import "./App.css";

import Balance from './Balance';
import Purchases from './purchases';

import { usePurchases } from './App.behavior';


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
