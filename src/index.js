import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Metadata from './Metadata';
import reportWebVitals from './reportWebVitals';

/**
 * The entry point for the React application.
 *
 * Renders the `Metadata` component into the root DOM element.
 * Wrapped in `React.StrictMode` to activate additional checks and warnings for the component tree.
 *
 * @return {void}
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Metadata />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
