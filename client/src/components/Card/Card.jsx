import React from 'react';
import './Card.css';

export default (props) => (
    <div className="card">
        {props.children}
    </div>
);