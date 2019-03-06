import React from 'react';
import './Balance.css';

export default ({ balance }) => (
    <h2>
        Current Balance:
      <span className={balance < 0 ? "negative balance" : "balance"}>
            ${balance.toFixed(2)}
        </span>
    </h2>
);