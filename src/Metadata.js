import { useState } from 'react';
import MetadataDisplay from './mdDisplay';
import logo from './logo.svg';
import './App.scss';
import './metadata.scss';

/**
 * Metadata component serves as the main entry point for the metadata management feature.
 * It initializes and manages the state for the current item ID and renders the
 * MetadataDisplay component, which is responsible for showing and managing metadata items.
 *
 * @returns {JSX.Element} The rendered Metadata component with a logo, instructions, and MetadataDisplay.
 */
function Metadata() {
  // State to manage the currently selected item ID
  const [itemId, setItemId] = useState('root');

  return (
    <div className="App">
      <header className="App-header">
        {/* Application logo */}
        <img src={logo} className="App-logo" alt="logo" />

        {/* Instructions for editing the application */}
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>

        {/* MetadataDisplay component to manage and display metadata */}
        <MetadataDisplay itemId={itemId} setItemId={setItemId} />
      </header>
    </div>
  );
}

export default Metadata;
