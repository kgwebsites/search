import React from 'react';
import Home from './pages/Home';
import { hot } from 'react-hot-loader';
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
    body {
        margin: 0;
      }
`;

function App() {
  return (
    <>
      <GlobalStyles />
      <Home />
    </>
  );
}

export default hot(module)(App);
