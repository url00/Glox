import { tokenTypes } from "./tokenTypes";
import { copy } from "./util";

function createToken(type, lexeme, literalValue, line, startPos, endPos) {
  return {
    type,
    lexeme,
    literalValue,
    line,
    startPos,
    endPos,
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

function createState(source) {
  const ls = {
    source,
    errors: [],
    lastToken: null,
    tokens: [],
    startPos: 0,
    currentPos: 0,
    lineNum: 1,
    currentChar0: null,
    currentChar1: null,
    segment: null,
  };
  ls.currentChar0 = charAt(ls.source, ls.currentPos);
  ls.currentChar1 = charAt(ls.source, ls.currentPos + 1);
  ls.segment = "" + ls.currentChar0;
  return ls;
}

function step(state) {
  checkForToken(state);
  advance(state);
  return state;
}

function addNewToken(ls, tokenType, tokenValue = null) {
    ls.startPos = ls.currentPos;
    ls.lastToken = createToken(tokenType, ls.segment, tokenValue, ls.lineNum, ls.startPos, ls.currentPos);
    ls.tokens.push(ls.lastToken);
    ls.segment = "";
}

function checkForToken(ls) {
  if (false){
  } else if (ls.segment === null) {
    ls.errors.push({m: "attempted to check for token in a null segment", s: copy(ls)});
  } else if (ls.segment === "(") {
    addNewToken(ls, tokenTypes.LEFT_PAREN);
  } else if (ls.segment === ")") {
    addNewToken(ls, tokenTypes.RIGHT_PAREN);
  } else if (ls.segment === "{") {
    addNewToken(ls, tokenTypes.LEFT_BRACE);
  } else if (ls.segment === "}") {
    addNewToken(ls, tokenTypes.RIGHT_BRACE);
  } else if (ls.segment === ",") {
    addNewToken(ls, tokenTypes.COMMA);
  } else if (ls.segment === ".") {
    addNewToken(ls, tokenTypes.DOT);
  } else if (ls.segment === "-") {
    addNewToken(ls, tokenTypes.MINUS);
  } else if (ls.segment === "+") {
    addNewToken(ls, tokenTypes.PLUS);
  } else if (ls.segment === ";") {
    addNewToken(ls, tokenTypes.SEMICOLON);
  } else if (ls.segment === "*") {
    addNewToken(ls, tokenTypes.STAR);
  } else if(ls.segment === "!") {
    if (ls.currentChar1 === "=") {
      addNewToken(ls, tokenTypes.BANG_EQUAL);
    } else {
      addNewToken(ls, tokenTypes.BANG);
    }
  }
}

function advance(ls) {
  ls.currentPos++;
  ls.currentChar0 = charAt(ls.source, ls.currentPos);
  ls.currentChar1 = charAt(ls.source, ls.currentPos + 1);
  ls.segment = "" + ls.currentChar0;
}

function scan(ls) {
}

export default {
  createToken,
  createState,
  step,
  scan
};
