import React from 'react';
import styled from 'styled-components';
// import './main.css';

const Body = styled.div`
  font-family: sans-serif;
  font-weight: 600;
  color: white;
  text-align: center;
  background-color: rgb(9, 45, 65);
  height: 600px;
  margin: 0;
  padding: 20px;
`


export default class App extends React.Component {
  render() {
    return (
      <Body>
        <h2>Welcome to styled React!</h2>
      </Body>
    );
  }
}

// <div style={ mainStyle } >
//   <h2>Welcome to React!</h2>
// </div>