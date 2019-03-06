import React from 'react';
import { format } from 'date-fns';

import './Purchases.css';

import Card from '../Card/Card';

/**
 * @typedef {Object} Purchase
 * @property {Date} date
 * @property {string} purchaseName
 * @property {number} purchaseAmount
 */

/**
 * 
 * @typedef {Object} PurchasesProps
 * @property {Purchase[]} purchases
 */

/**
 * @param {PurchasesProps} props 
 */
export default (props) => (
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