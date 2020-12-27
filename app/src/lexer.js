import { tokenTypes } from "./tokenTypes";
import { copy } from "./util";

function createToken() {
  return {
    type: null,
    lexeme: null,
    literalValue: null,
    line: null,
    startPos: null,
    endPos: null,
  };
}

function charAt(s, pos) {
  if (pos < 0) {
    return "";
  }

  if (pos < s.length) {
    return s.charAt(pos);
  }

  return "";
}

function substr(s, start, end) {
  start = Math.min(Math.max(0, start), s.length);
  end = Math.max(Math.min(s.length, end), 0);
  return s.substr(start, end);
}

function createState(source) {
  const ls = {
    source,
    errors: [],
    wipToken: createToken(),
    tokens: [],
    startPos: 0,
    currentPos: 0,
    lineNum: 1,
    currentChar: null,
    state: "scanning"
  };
  ls.wipToken.startPos = 0;
  refresh(ls);
  return ls;
}

function step(ls) {
  if (false) {
  } else if (ls.state === "scanning") {
    if (false){
    } else if (ls.currentChar === "(") {
      ls.wipToken.type = tokenTypes.LEFT_PAREN;
      ls.state = "token found";
    } else if (ls.currentChar === ")") {
      ls.wipToken.type = tokenTypes.RIGHT_PAREN;
      ls.state = "token found";
    } else if (ls.currentChar === "{") {
      ls.wipToken.type = tokenTypes.LEFT_BRACE;
      ls.state = "token found";
    } else if (ls.currentChar === "}") {
      ls.wipToken.type = tokenTypes.RIGHT_BRACE;
      ls.state = "token found";
    } else if (ls.currentChar === ",") {
      ls.wipToken.type = tokenTypes.COMMA;
      ls.state = "token found";
    } else if (ls.currentChar === ".") {
      ls.wipToken.type = tokenTypes.DOT;
      ls.state = "token found";
    } else if (ls.currentChar === "-") {
      ls.wipToken.type = tokenTypes.MINUS;
      ls.state = "token found";
    } else if (ls.currentChar === "+") {
      ls.wipToken.type = tokenTypes.PLUS;
      ls.state = "token found";
    } else if (ls.currentChar === ";") {
      ls.wipToken.type = tokenTypes.SEMICOLON;
      ls.state = "token found";
    } else if (ls.currentChar === "*") {
      ls.wipToken.type = tokenTypes.STAR;
      ls.state = "token found";
    } else if(ls.currentChar === "!") {
      ls.wipToken.lexeme = ls.currentChar;
      ls.wipToken.type = tokenTypes.BANG;
      ls.state = "possible multichar token found";
    } else if(ls.currentChar === "/") {
      ls.wipToken.lexeme = ls.currentChar;
      ls.wipToken.type = tokenTypes.SLASH;
      ls.state = "possible multichar token found";
    } else {
    }
    ls.currentPos++;
    refresh(ls);
  } else if (ls.state === "token found") {
    ls.wipToken.endPos = ls.currentPos - 1;
    ls.tokens.push(ls.wipToken);
    ls.startPos = ls.currentPos;
    ls.wipToken = createToken();
    ls.wipToken.startPos = ls.startPos;
    ls.state = "scanning";
  } else if (ls.state == "possible multichar token found") {
    if(false) {
    } else if (ls.wipToken.type === tokenTypes.BANG) {
      if (ls.currentChar === "=") {
        ls.currentPos++;
        refresh(ls);
        ls.state = "token found";
        ls.wipToken.type = tokenTypes.BANG_EQUAL;
        ls.wipToken.lexeme = "!=";
      } else {
        ls.state = "token found";
      }
    } else if (ls.wipToken.type === tokenTypes.SLASH) {
      if (ls.currentChar === "/") {
        ls.currentPos++;
        refresh(ls);
        ls.state = "comment";
        ls.wipToken = null;
      } else {
        ls.state = "token found";
      }
    }
  } else if (ls.state == "comment") {
    ls.currentPos++;
    refresh(ls);
    if (ls.currentChar == "\n") {
      ls.wipToken = createToken();
      ls.startPos = ls.currentPos;
      ls.wipToken.startPos = ls.startPos;
      ls.state = "scanning";
    }
  }
}

function refresh(ls) {
  ls.currentChar = charAt(ls.source, ls.currentPos);
}

function scan(ls) {
  while (ls.currentPos < ls.source.length) {
    step(ls);
  }
}

export default {
  createToken,
  createState,
  step,
  scan
};
