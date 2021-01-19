// IMPORTS
// ------------------------------------------------------------
import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

// Providers
import {ApolloProvider} from '@apollo/client';
import client from './providers/client';

// Presentation Components
import App from './components/App';

// MAIN RENDER
// ------------------------------------------------------------
ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
