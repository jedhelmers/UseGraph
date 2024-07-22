import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import Metadata from './Metadata';

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
