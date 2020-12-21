import React, { useState, useRef, useEffect } from "react";
import useInterval from "@use-it/interval";
import * as d3 from "d3";
import styled from "styled-components";
import { lex } from "./lexer";

function p(x) {
  return JSON.stringify(x, null, 2);
}

const AppContainer = styled.div`
  display: grid;
  grid-template: 1fr / 1fr 3fr;
  width: 100%;
  height: 100%;
`;

/* const Outputs_ = styled.div`
display: grid;
grid-template: repeat(3, minmax(0, 1fr)) auto / 1fr;
width: 100%;
height: 100%;
`; */

/* const LexerTextOutputContainer_ = styled.div`
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
`; */

/* const OutputsControls_ = styled.div`
display: flex;
width: 100%;
`;

const Button_ = styled.div`
margin: 0.5rem;
padding: 0.5rem;
background-color: #aaaaff;
`; */

// class Outputs extends React.Component {
//   constructor() {
//     super();
//     const appS = getAppState();
//     const lexerS = createLexerState();
//     lexerS.source = appS.input;
//     this.state = {
//       lastAppState: appS,
//       lexerOutput: null,
//       lexerState: lexerS
//     };
//   }

//   componentDidMount() {
//     this.setState({
//       ...this.state,
//     });
//   }

//   checkAndUpdateLexerState(s) {
//     const appS = getAppState();
//     if (this.state.lastAppState.input === appS.input) {
//       return;
//     }
//     console.log('new app state detected, invalidating output');
//     const lexerS = createLexerState();
//     lexerS.source = appS.input;
//     s.lastAppState = appS;
//     s.lexerOutput = null;
//     s.lexerState = lexerS;
//   }

//   handleStepLexerClick = () => {
//     console.log("stepping lexer");
//     let s = this.state;
//     this.checkAndUpdateLexerState(s);
//     step(s.lexerState);
//     tryAddToken(s.lexerState);
//     let o = p(s.lexerState);
//     this.setState({
//       ...s,
//       lexerOutput: o,
//     });
//   }

//   handleRunClick = () => {
//     console.log("running");
//     let s = this.state;
//     this.checkAndUpdateLexerState(s);
//     step(s.lexerState);
//     tryAddToken(s.lexerState);
//     let o = p(s.lexerState);
//     this.setState({
//       ...s,
//       lexerOutput: o,
//     });
//   }

//   render() {
//     return (<Outputs_>
//       <LexerTextOutputContainer_>
//         <LexerTextOutput_>{this.state.lexerOutput}</LexerTextOutput_>
//       </LexerTextOutputContainer_>
//       <ColoredRect color='#eeeeee' />
//       <Print text={this.state.lastAppState.input} />
//       <OutputsControls_>
//         <Button_ onClick={this.handleStepLexerClick}>Step Lexer</Button_>
//         <Button_ onClick={this.handleRunClick}>Run</Button_>
//       </OutputsControls_>
//     </Outputs_>)
//   }
// }

const ColoredRect = styled.div`
  background-color: ${(props) => (props.color ? props.color : "#ee0000")};
  width: 100%;
  height: 100%;
`;

const InputTextbox_ = styled.input`
  font-family: monospace;
  font-size: 8pt;
  overflow-y: hidden;
  background-color: ${(p) => (p.color ? p.color : "white")};
  width: 100%;
  height: 100%;
  padding: 0;
  resize: none;
  border: 0 none;
  outline: none;
  overflow-x: auto;
`;

const InputTextbox = React.forwardRef((props, ref) => {
  return <InputTextbox_ wrap="off" ref={ref} {...props} />;
});

const ConsoleOutput_ = styled.div`
  display: flex;
  flex-direction: column;
  font-family: monospace;
  font-size: 8pt;
  overflow-x: auto;
  overflow-y: scroll;
  color: white;
  background-color: black;
  width: 100%;
  height: 100%;
  padding: 0;
`;

/* const InputTextbox = ({storageKey, ...props}) => {
  const is = getAppState()[storageKey];
  const [gs, ss] = useState(is);
  useEffect(() => {
    const ns = {...getAppState()};
    ns[storageKey] = gs;
    setAppState(ns);
  }, [gs]);
  return <InputTextbox_ wrap="off" {...props} value={gs} onChange={x => ss(x.target.value)} />
} */

function getDefaultAppState() {
  return {
    input: "",
  };
}

function getAppState() {
  const a = window.localStorage.getItem("app");
  const b = a ? JSON.parse(a) : getDefaultAppState();
  return b;
}

function setAppState(x) {
  const y = JSON.stringify(x);
  const a = window.localStorage.setItem("app", y);
}

const Print = ({ text }) => {
  return <div style={{ backgroundColor: "tomato" }}>{text}</div>;
};

const ConsoleContainer = styled.div`
  display: grid;
  grid-template: 1fr auto / 1fr;
  width: 100%;
  height: 100vh;
`;

const ConsoleOutputLine = styled.pre`
padding: 0;
margin: 0;
`;

const ConsoleOutput = ({ outputs }) => {
  const r = useRef(null);
  useEffect(() => {
    if (!r) {
      return;
    }
    r.current.scrollTop = r.current.scrollHeight;
  }, [r, outputs]);
  return (
    <ConsoleOutput_ ref={r}>
      {outputs.map((x, i) => (
        <ConsoleOutputLine key={i}>{x}</ConsoleOutputLine>
      ))}
    </ConsoleOutput_>
  );
};

class ConsoleInput extends React.Component {
  constructor(props) {
    super(props);
    this.r = React.createRef();
  }

  componentDidMount() {
    this.r.current.addEventListener("keyup", (e) => {
      if (e.keyCode !== 13) {
        return;
      }
      e.preventDefault();
      const c = this.r.current.value;
      this.props.onCommand(c);
      this.r.current.value = "";
    });
  }

  render() {
    return <InputTextbox ref={this.r} />;
  }
}

class App extends React.Component {
  constructor() {
    super();

    const as = getAppState();

    this.state = {
      consoleInput: "",
      consoleOutput: [],
      fileInput: as.input,
    };
  }

  handleConsoleInputOnCommand = (c) => {
    const o = [...this.state.consoleOutput];
    o.push(c);
    if (false) {
    } else if (c === "help") {
      o.push(`usage: <command> [<args>]

command can be one of:

  lex    Work with lexer.
  
  help   Print this help text.`);
    }
    this.setState({
      ...this.state,
      consoleOutput: o,
    });
  };

  render() {
    return (
      <AppContainer>
        <ConsoleContainer>
          <ConsoleOutput outputs={this.state.consoleOutput} />
          <ConsoleInput onCommand={this.handleConsoleInputOnCommand} />
        </ConsoleContainer>
        <InputTextbox color="aliceblue" />
      </AppContainer>
    );
  }
}

export default App;
