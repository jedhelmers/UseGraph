import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import './metadata.scss'
import MetadataDisplay from './mdDisplay'

function App() {
  const [itemId, setItemId] = useState(1)

  return (
    <div className="App">
      <header className="App-header">
      {/* Vertical collapse line test */}
      <ul class="collapsible">
          <li>Item 1
              <ul>
                  <li>Sub-item 1.1</li>
                  <li>Sub-item 1.2</li>
              </ul>
          </li>
          <li>Item 2
              <ul>
                  <li>Sub-item 2.1</li>
                  <li>Sub-item 2.2</li>
              </ul>
          </li>
      </ul>
      {/* Vertical collapse line test */}

        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <MetadataDisplay itemId={itemId} setItemId={setItemId}/>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
