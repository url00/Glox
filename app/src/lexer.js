import { tokenTypes } from "./tokenTypes";
import { copy } from "./util";

const keywords = new Map();
keywords.set("and", tokenTypes.AND);
keywords.set("class", tokenTypes.CLASS);
keywords.set("else", tokenTypes.ELSE);
keywords.set("false", tokenTypes.FALSE);
keywords.set("for", tokenTypes.FOR);
keywords.set("fun", tokenTypes.FUN);
keywords.set("if", tokenTypes.IF);
keywords.set("nil", tokenTypes.NIL);
keywords.set("or", tokenTypes.OR);
keywords.set("print", tokenTypes.PRINT);
keywords.set("return", tokenTypes.RETURN);
keywords.set("super", tokenTypes.SUPER);
keywords.set("this", tokenTypes.THIS);
keywords.set("true", tokenTypes.TRUE);
keywords.set("var", tokenTypes.VAR);
keywords.set("while", tokenTypes.WHILE);

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

function isDigit(c) {
  const x = c.charCodeAt();
  const a = "0".charCodeAt();
  const b = "9".charCodeAt();
  return x >= a && x <= b;
}

function isAlpha(c) {
  const x = c.charCodeAt();
  return (
    (x >= "a".charCodeAt() && x <= "z".charCodeAt()) ||
    (x >= "A".charCodeAt() && x <= "Z".charCodeAt()) ||
    c === "_"
  );
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
      ls.wipToken.lexeme = ls.currentChar;
      ls.wipToken.type = tokenTypes.DOT;
      ls.state = "token found";
    } else if (ls.currentChar === "-") {
      ls.wipToken.lexeme = ls.currentChar;
      ls.wipToken.type = tokenTypes.MINUS;
      ls.state = "token found";
    } else if (ls.currentChar === "+") {
      ls.wipToken.lexeme = ls.currentChar;
      ls.wipToken.type = tokenTypes.PLUS;
      ls.state = "token found";
    } else if (ls.currentChar === ";") {
      ls.wipToken.type = tokenTypes.SEMICOLON;
      ls.state = "token found";
    } else if (ls.currentChar === "*") {
      ls.wipToken.lexeme = ls.currentChar;
      ls.wipToken.type = tokenTypes.STAR;
      ls.state = "token found";
    } else if(ls.currentChar === "!") {
      ls.wipToken.lexeme = ls.currentChar;
      ls.wipToken.type = tokenTypes.BANG;
      ls.state = "possible multichar token found";
    } else if(ls.currentChar === "=") {
      ls.wipToken.lexeme = ls.currentChar;
      ls.wipToken.type = tokenTypes.EQUAL;
      ls.state = "possible multichar token found";
    } else if(ls.currentChar === "<") {
      ls.wipToken.lexeme = ls.currentChar;
      ls.wipToken.type = tokenTypes.LESS;
      ls.state = "possible multichar token found";
    } else if(ls.currentChar === ">") {
      ls.wipToken.lexeme = ls.currentChar;
      ls.wipToken.type = tokenTypes.GREATER;
      ls.state = "possible multichar token found";
    } else if(ls.currentChar === "/") {
      ls.wipToken.lexeme = ls.currentChar;
      ls.wipToken.type = tokenTypes.SLASH;
      ls.state = "possible multichar token found";
    } else if(isAlpha(ls.currentChar)) {
      ls.wipToken.lexeme = ls.currentChar;
      ls.wipToken.type = tokenTypes.IDENTIFIER;
      ls.state = "identifier found";
    } else if(ls.currentChar === "\"") {
      ls.wipToken.type = tokenTypes.STRING;
      ls.wipToken.literalValue = "";
      ls.state = "string found";
    } else if(isDigit(ls.currentChar)) {
      ls.wipToken.type = tokenTypes.NUMBER;
      ls.wipToken.literalValue = ls.currentChar;
      ls.state = "number found";
    } else if (ls.currentChar === " " || ls.currentChar === "\t") {
      // whitespace
    } else if (ls.currentChar === "") {
      // eof
    } else if (ls.currentChar === "\n") {
      ls.lineNum++;
    } else {
      ls.errors.push("unexpected character: \"" + ls.currentChar + `" (${ls.currentChar.charCodeAt()})`);
    }
    ls.currentPos++;
    refresh(ls);
  } else if (ls.state === "token found") {
    ls.wipToken.endPos = ls.currentPos - 1;
    ls.wipToken.line = ls.lineNum;
    ls.tokens.push(ls.wipToken);
    ls.startPos = ls.currentPos;
    ls.wipToken = createToken();
    ls.wipToken.startPos = ls.startPos;
    ls.state = "scanning";
  } else if (ls.state === "possible multichar token found") {
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
    } else if (ls.wipToken.type === tokenTypes.EQUAL) {
      if (ls.currentChar === "=") {
        ls.currentPos++;
        refresh(ls);
        ls.state = "token found";
        ls.wipToken.type = tokenTypes.EQUAL_EQUAL;
        ls.wipToken.lexeme = "==";
      } else {
        ls.state = "token found";
      }
    } else if (ls.wipToken.type === tokenTypes.LESS) {
      if (ls.currentChar === "=") {
        ls.currentPos++;
        refresh(ls);
        ls.state = "token found";
        ls.wipToken.type = tokenTypes.LESS_EQUAL;
        ls.wipToken.lexeme = "<=";
      } else {
        ls.state = "token found";
      }
    } else if (ls.wipToken.type === tokenTypes.GREATER) {
      if (ls.currentChar === "=") {
        ls.currentPos++;
        refresh(ls);
        ls.state = "token found";
        ls.wipToken.type = tokenTypes.GREATER_EQUAL;
        ls.wipToken.lexeme = ">=";
      } else {
        ls.state = "token found";
      }
    } else if (ls.wipToken.type === tokenTypes.SLASH) {
      if (ls.currentChar === "/") {
        ls.currentPos++;
        refresh(ls);
        ls.state = "comment found";
        ls.wipToken = null;
      } else {
        ls.state = "token found";
      }
    }
  } else if (ls.state === "comment found") {
    ls.currentPos++;
    refresh(ls);
    if (ls.currentChar === "\n") {
      ls.wipToken = createToken();
      ls.startPos = ls.currentPos;
      ls.wipToken.startPos = ls.startPos;
      ls.state = "scanning";
    }
  } else if (ls.state === "string found") {
    if (ls.currentChar === "\"") {
      ls.state = "token found";
      ls.currentPos++;
      refresh(ls);
    } else {
      ls.wipToken.literalValue += ls.currentChar;
      ls.currentPos++;
      refresh(ls);
    }
  } else if (ls.state === "number found") {
    if (isDigit(ls.currentChar) === false && ls.currentChar !== ".") {
      ls.state = "token found";
    } else {
      ls.wipToken.literalValue += ls.currentChar;
      ls.currentPos++;
      refresh(ls);
    }
  } else if (ls.state === "identifier found") {
    if (isAlpha(ls.currentChar) === false) {
      if (keywords.has(ls.wipToken.lexeme)) {
        ls.wipToken.type = keywords.get(ls.wipToken.lexeme);
      }
      ls.state = "token found";
    } else {
      ls.wipToken.lexeme += ls.currentChar;
      ls.currentPos++;
      refresh(ls);
    }
  }
}

function refresh(ls) {
  ls.currentChar = charAt(ls.source, ls.currentPos);
}

function scan(ls) {
  while (ls.currentPos - 1 < ls.source.length) {
    step(ls);
  }
}

const exports = {
  createToken,
  createState,
  step,
  scan
};
export default exports;