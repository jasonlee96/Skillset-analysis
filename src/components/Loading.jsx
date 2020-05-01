import React, { useState, useEffect } from 'react';
import "../styles/Loading.css";

const Loading = () => {
    useEffect(() => {

    });
    return (
        <div className="loading-container">
            <div className="spinner"></div>
            <div className="loading-text">
                Loading...
            </div>
        </div>
    );
};

export default Loading;