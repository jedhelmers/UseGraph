import { useState } from 'react';
import logo from './logo.svg';
import './App.scss';
import './metadata.scss';
import MetadataDisplay from './mdDisplay';

/**
 * Metadata component that displays an app header with a logo,
 * instructions, and a `MetadataDisplay` component.
 *
 * Manages the state of `itemId` using the `useState` hook.
 * Passes `itemId` and `setItemId` to `MetadataDisplay`.
 *
 * @return {React.Component} The Metadata component
 */
function Metadata() {
  const [itemId, setItemId] = useState('root');

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <MetadataDisplay itemId={itemId} setItemId={setItemId} />
      </header>
    </div>
  );
}

export default Metadata;
