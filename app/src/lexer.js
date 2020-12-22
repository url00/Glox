import { tokenTypes } from "./tokenTypes";

function createToken(type, lexeme, literal, line) {
  return {
    type,
    lexeme,
    literal,
    line,
  };
}

function createState(source) {
  const ls = {
    source,
    tokens: [],
    startPos: 0,
    currentPos: 0,
    lineNum: 1,
    currentChar: null,
    nextChar: null,
  };
  ls.currentChar = ls.source.charAt(ls.currentPos);
  return ls;
}

function advance(ls) {
  ls.currentPos++;
  ls.currentChar = ls.source.charAt(ls.currentPos);
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
  scan
};
