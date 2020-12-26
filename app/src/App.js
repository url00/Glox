import React, { useState, useRef, useEffect } from "react";
import useInterval from "@use-it/interval";
import * as d3 from "d3";
import styled from "styled-components";
import lexer from "./lexer";
import produce from "immer";

const AppContainer = styled.div`
  display: grid;
  grid-template: 1fr / 1fr 2fr;
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

const DisplayContainer = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-auto-rows: 1fr;
  width: 100%;
  height: 100vh;
`;

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
    this.r.current.focus();
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

class Command {
  constructor(c) {
    this.r = c.split(" ");
  }

  pop() {
    return this.r.shift();
  }

  read() {
    return this.r.join(" ");
  }

  is(c) {
    if (this.r.length <= 0) {
      return false;
    }

    return this.r[0] === c;
  }
}

const InputTextArea_ = styled.textarea`
font-family: monospace;
font-size: 8pt;
overflow-y: hidden;
background-color: aliceblue;
width: 100%;
height: 100%;
padding: 0;
resize: none;
border: 0 none;
outline: none;
overflow-x: auto;
`;

const InputTextArea = React.forwardRef((props, ref) => {
  return <InputTextArea_ ref={ref} {...props} wrap="off"/>
});

class SourceInput extends React.Component {
  constructor(props) {
    super(props);
    this.r = React.createRef();
  }

  componentDidMount() {
    this.r.current.addEventListener("change", (e) => console.log(e));
  }

  render() {
    return (
      <InputTextArea ref={this.r} {...this.props} />
    );
  }
}

const JsonDisplay_ = styled.pre`
  margin: 0;
  overflow-x: auto;
`;
const JsonDisplay = ({ thing, ...props }) => {
  return (
    <JsonDisplay_ {...props}>{JSON.stringify(thing, null, 2)}</JsonDisplay_>
  );
};

class App extends React.Component {
  constructor() {
    super();

    const as = getAppState();

    this.state = {
      consoleInput: "",
      consoleOutput: [],
      fileInput: as.input,
      lexerState: lexer.createState(as.input),
      display: null,
    };
  }

  handleConsoleInputOnCommand = (c) => {
    const o = [];
    o.push(c);
    var command = new Command(c);
    if (false) {
    } else if (command.is("d")) {
      command.pop();
      if (false) {
      } else if (command.is("j")) {
        this.setState(
          produce((x) => {
            x.display = <JsonDisplay thing={this.state} />;
          })
        );
      } else {
        o.push(`usage: d <subcommand> [<args>]

subcommand can be one of:

  j      Change display to a raw JSON view of the internal
         state of the system.

  i      Change display to a basic text input for Glox code.

  l      Change display to a graphical overview of the
         lexing process.
  
  help   Print this help text.`);
      }
    } else if (command.is("l")) {
      command.pop();
      if (false) {
      } else if (command.is("reset")) {
        const as = getAppState();
        this.setState(
          produce((x) => {
            x.lexerState = lexer.createState(as.input);
          })
        );
      } else {
        o.push(`usage: l <subcommand> [<args>]

subcommand can be one of:

  reset  Reset the internal state of the lexer.

  step   Advance the lexer one step.

  run    Run the lexer until completion.
  
  help   Print this help text.`);
      }
    } else {
      o.push(`usage: <command> [<args>]

command can be one of:

  l      Work with lexer.

  p      Work with parser.

  d      Alter the display.
  
  help   Print this help text.`);
    }
    this.setState(
      produce((x) => {
        x.consoleOutput = x.consoleOutput.concat(o);
      })
    );
  };

  render() {
    return (
      <AppContainer>
        <ConsoleContainer>
          <ConsoleOutput outputs={this.state.consoleOutput} />
          <ConsoleInput onCommand={this.handleConsoleInputOnCommand} />
        </ConsoleContainer>
        <DisplayContainer>
          <SourceInput />
          {this.state.display}
        </DisplayContainer>
      </AppContainer>
    );
  }
}

export default App;
