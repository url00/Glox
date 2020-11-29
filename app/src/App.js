import React, { useState, useRef, useEffect } from "react";
import useInterval from '@use-it/interval';
import * as d3 from "d3";
import styled from 'styled-components';
import { lex } from "./lexer";


function p(x) {
  return JSON.stringify(x, null, 2);
}



const AppContainer = styled.div`
display: grid;
grid-template: 1fr / 1fr 1fr;
width: 100%;
height: 100%;
`

const Outputs_ = styled.div`
display: grid;
grid-template: repeat(3, minmax(0, 1fr)) / 1fr;
width: 100%;
height: 100%;
`;


const LexerTextOutputContainer_ = styled.div`
height: 100%;
width: 100%;
background-color: wheat;
overflow-y: scroll;
min-height: 0;
`;
const LexerTextOutput_ = styled.pre`
background-color: transparent;
height: 0;
margin: 0;
padding: 0;
`;

const generateNewOutputState = (s) => {
  let lexOutput = null;
  try {
    lexOutput = lex(s.input);
  } catch (error) {
    lexOutput = "error lexing: " + error;
  }

  return (<>
    <LexerTextOutputContainer_>
      <LexerTextOutput_>{p(lexOutput)}</LexerTextOutput_>
    </LexerTextOutputContainer_>
    <ColoredRect color='#eeeeee' />
    <Print text={s.input} />
  </>)
}

const Outputs = () => {
  const lastS = getAppState();
  const [gs, ss] = useState(generateNewOutputState(lastS));
  useInterval(() => {
    const s = getAppState();
    if (lastS.input === s.input) {
      return;
    }
    console.log('input diff detected, rerendering');
    ss(generateNewOutputState(s));
  }, 500);
  return <Outputs_>
    {gs}
  </Outputs_>
}

const ColoredRect = styled.div`
background-color: ${props => props.color ? props.color : '#ee0000'};
width: 100%;
height: 100%;
`;

const InputTextbox_ = styled.textarea`
font-family: monospace;
font-size: 30pt;
overflow-y: hidden;
background-color: aliceblue;
width: 100%;
height: 100%;
padding: 0;
resize: none;
border: 0 none;
outline: none;
overflow-x: auto;
`

const InputTextbox = () => {
  const [gs, ss] = useState(getAppState().input);
  useEffect(() => {
    setAppState({...getAppState(), input: gs});
  }, [gs]);
  return <InputTextbox_ wrap="off" value={gs} onChange={x => ss(x.target.value)} />
}

function getDefaultAppState() {
  return {
    input: '',
    tokens: [],
    errors: [],
  };
}

function getAppState() {
  const a = window.localStorage.getItem('app');
  const b = a ? JSON.parse(a) : getDefaultAppState();
  return b;
}

function setAppState(x) {
  const y = JSON.stringify(x);
  const a = window.localStorage.setItem('app', y);
}

const Print = ({ text }) => {
  return <div style={{backgroundColor: 'tomato'}}>{text}</div>
}

function App() {
  return (
    <>
      <AppContainer>
        <InputTextbox />
        <Outputs />
      </AppContainer>
    </>
  );
}

export default App;
