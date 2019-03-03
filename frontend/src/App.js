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
        purchaseHistory,
    });

    const setPurchaseName = purchaseName => {
        setState({ ...state, purchaseName });
    };
    const setPurchaseAmount = purchaseAmount => {
        setState({ ...state, purchaseAmount });
    };
    const addNewPurchase = () => {
        if (state.purchaseName !== "" && state.purchaseAmount > 0) {
            const newPurchaseHistory = [
                {
                    date: new Date(),
                    purchaseName: state.purchaseName,
                    purchaseAmount: state.purchaseAmount,
                },
                ...state.purchaseHistory,
            ];
            setPurchaseHistory(newPurchaseHistory);
            setState({
                balance: state.balance - state.purchaseAmount,
                purchaseName: "",
                purchaseAmount: 0,
                purchaseHistory: newPurchaseHistory,
            });
        }
    };
    return [state, setPurchaseName, setPurchaseAmount, addNewPurchase];
}

export default function App() {
    const [
        state,
        setPurchaseName,
        setPurchaseAmount,
        addNewPurchase,
    ] = usePurchases();

    return (
        <div className="app">
            <h2>
                Current Balance:
                <span
                    className={
                        state.balance < 0 ? "negative balance" : "balance"
                    }
                >
                    ${state.balance.toFixed(2)}
                </span>
            </h2>
            <form>
                <h3>Enter a new purchase</h3>
                <input
                    placeholder="Purchase"
                    value={state.purchaseName}
                    large={true}
                    onChange={e => setPurchaseName(e.target.value)}
                />
                <input
                    placeholder="Price"
                    value={state.purchaseAmount.toFixed(2)}
                    large={true}
                    fill={true}
                    leftIcon="dollar"
                    min={0}
                    intent={
                        state.purchaseAmount > state.balance
                            ? "danger"
                            : undefined
                    }
                    onValueChange={value => setPurchaseAmount(value)}
                />
                <button
                    onClick={() =>
                        addNewPurchase(state.purchaseName, state.purchaseAmount)
                    }
                    large={true}
                    intent="primary"
                    text="Save"
                />
            </form>
            <div className="purchase-history">
                <h3>Purchase History</h3>
                <table
                    bordered={true}
                    condensed={true}
                    interactive={true}
                    striped={true}
                >
                    <thead>
                        <tr>
                            <td>Purchase Date</td>
                            <td>Item</td>
                            <td>Price</td>
                        </tr>
                    </thead>
                    <tbody>
                        {state.purchaseHistory.map((item, i) => (
                            <tr key={i}>
                                <td>{item.date.toString()}</td>
                                <td>{item.purchaseName}</td>
                                <td>${item.purchaseAmount.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
