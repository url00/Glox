import { tokenTypes } from "./tokenTypes";
import { copy } from "./util";

function createToken(type, lexeme, literal, line) {
  return {
    type,
    lexeme,
    literal,
    line,
  };
}

function createState(source) {
  if (source && source.length > 0) {
    const ls = {
      source,
      errors: [],
      lastToken: null,
      tokens: [],
      startPos: 0,
      currentPos: 0,
      lineNum: 1,
      currentChar: null,
      nextChar: null,
      segment: null,
    };
    ls.currentChar = ls.source.charAt(ls.currentPos);
    ls.segment = "" + ls.currentChar;
    return ls;
  } else {
    const ls = {
      source: "",
      errors: [],
      lastToken: null,
      tokens: [],
      startPos: 0,
      currentPos: 0,
      lineNum: 1,
      currentChar: "",
      nextChar: null,
      segment: "",
    };
    return ls;
  }
}

function step(state) {
  checkForToken(state);
  advance(state);
  return state;
}

function checkForToken(ls) {
  if (false){
  } else if (ls.segment === null) {
    ls.errors.push({m: "attempted to check for token in a null segment", s: copy(ls)});
  } else if (ls.segment === "(") {
    ls.lastToken = tokenTypes.LEFT_PAREN;
    ls.tokens.push(ls.lastToken);
  } else if (ls.segment === ")") {
    ls.lastToken = tokenTypes.RIGHT_PAREN;
    ls.tokens.push(ls.lastToken);
  } else if (ls.segment === "{") {
    ls.lastToken = tokenTypes.LEFT_BRACE;
    ls.tokens.push(ls.lastToken);
  }
}

function advance(ls) {
  ls.currentPos++;
  ls.currentChar = ls.source.charAt(ls.currentPos);
  if (ls.segment) {
    ls.segment += ls.currentChar;
  } else {
    ls.segment = "" + ls.currentChar;
  }
}

function scan(ls) {
  let i = 0;
  do {
    i++;
    if (i > 1_000_000_000) {
      throw new Error("timeout scanning for tokens");
    }

    if (ls.currentPos >= ls.source.length) {
      console.log("currentPos character is the final, breaking out of scanner");
      break;
    }

    advance(ls);
    let text = ls.source.substring(ls.startPosPos, ls.currentPos);
    if (false) {
    } else if (ls.currentChar === "(") {
      ls.tokens.push(createToken(tokenTypes.LEFT_PAREN, text, ls.currentChar, ls.lineNum));
    } else {
      throw new Error("failed to reconize token: " + ls.currentChar);
    }
  } while (true);

  ls.tokens.push(createToken(tokenTypes.EOF, "", null, ls.lineNum));
}

export default {
  createToken,
  createState,
  step,
  scan
};
