import React from 'react';
import { mainStyle, text } from './styles'
import getWindows from './getInfo/windows';
const { exec } = require('child_process');
// import './main.css';



export default class App extends React.Component {

  constructor() {
    super()
    this.state = {
      test: ['loading...']
    }
  }

  componentDidMount() {
    getWindows();
  }

  render() {
    return (
      <div style={ mainStyle } >
          <h2>BAB status report:</h2>
          <ul style={ text } >
          { this.state.test.map(
              info => <li key={ info }>{ info }</li> 
            ) }
          </ul>
      </div>
    );
  }
}



// import styled from 'styled-components';
// 
// const Body = styled.div`
//   font-family: sans-serif;
//   font-weight: 600;
//   color: white;
//   text-align: center;
//   background-color: rgb(9, 45, 65);
//   height: 600px;
//   margin: 0;
//   padding: 20px;
// `
// 
// <Body>
//   <h2>Welcome to styled React!</h2>
// </Body>