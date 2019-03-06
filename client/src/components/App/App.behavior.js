import { useEffect, useReducer } from 'react';
import { differenceInMonths, startOfMonth } from 'date-fns';
import { updatePurchases, postPurchase } from "../../api/purchases";

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

export function usePurchases() {
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