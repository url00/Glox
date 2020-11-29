import React, { useState, useRef, useEffect } from "react";
import useInterval from '@use-it/interval';
import * as d3 from "d3";
import styled from 'styled-components';

const generateDataset = () => (
  Array(100).fill(0).map(() => ([
    Math.random() * (100 - 24) + 12,
    Math.random() * (100 - 24) + 12,
  ]))
)

const Circles = () => {
  const [dataset, setDataset] = useState(
    generateDataset()
  )
  const ref = useRef()
  useEffect(() => {
    const svgElement = d3.select(ref.current)
    svgElement.selectAll("circle")
      .data(dataset)
      .join("circle")
        .attr("cx", d => d[0])
        .attr("cy", d => d[1])
        .attr("r",  3)
  }, [dataset])
  useInterval(() => {
    const newDataset = generateDataset()
    setDataset(newDataset)
  }, 500)
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      ref={ref}
      style={{width: '100px', height: '100px', position: 'relative'}}
    />
  )
}


const AppContainer = styled.div`
display: grid;
grid-template: 1fr / 1fr 1fr;
width: 100%;
height: 100%;
`

const Outputs_ = styled.div`
display: grid;
grid-template: 1fr 1fr 1fr / 1fr;
width: 100%;
height: 100%;
`;

const Outputs = () => {
  const [gs, ss] = useState(
    <>
      <ColoredRect color='Chocolate' />
      <ColoredRect color='CornflowerBlue' />
      <Print text={getAppState().input} />
    </>
  );
  const lastState = getAppState().input;
  useInterval(() => {
    if (lastState === getAppState().input) {
      return;
    }
    console.log('input diff detected, rerendering');
    ss(
      <>
        <div id="tree-container"></div>
        <ColoredRect color='#eeeeee' />
        <Print text={getAppState().input} />
      </>);
  }, 500);
  return <Outputs_>
    {gs}
  </Outputs_>
}

const ColoredRect = styled.div`
position: relative;
background-color: ${props => props.color ? props.color : '#ee0000'};
width: 100%;
height: 100%;
z-index: 1;
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
    input: ''
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
