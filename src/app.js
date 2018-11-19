import React from 'react';
import { mainStyle } from './styles'
// import './main.css';



export default class App extends React.Component {

  constructor() {
    super()
    this.state = {
      test: 0
    }
  }

  test() {
    this.setState({
      test: this.state.test + 1
    })
  }

  render() {
    return (
      <div style={ mainStyle } >
          <h2>Welcome to React!</h2>
          <button onClick={ this.test.bind(this) } >test</button>
          <p>{ this.state.test }</p>
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