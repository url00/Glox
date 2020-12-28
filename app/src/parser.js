import { tokenTypes } from "./tokenTypes";
import { createToken } from "./lexer";

const exprTypes = {
    ROOT: "ROOT",
    BINARY: "BINARY",
    GROUPING: "GROUPING",
    LITERAL: "LITERAL",
    UNARY: "UNARY"
}

function createExpr() {
    return {
        type: null,
        children: []
    }
}

function createBinaryExpr(left, right, op) {
    const x = createExpr();
    x.type = exprTypes.BINARY;
    x.children.push(left);
    x.children.push(right);
    x.children.push(op);
    return x;
}

function createUnaryExpr(target, op) {
    const x = createExpr();
    x.type = exprTypes.UNARY;
    x.children.push(target);
    x.children.push(op);
    return x;
}

function createGroupingExpr(target) {
    const x = createExpr();
    x.type = exprTypes.GROUPING;
    x.children.push(target);
    return x;
}

// Can be number, string, boolean, or nil.
function createLiteralExpr(value) {
    const x = createExpr();
    x.type = exprTypes.LITERAL;
    x.children.push(value);
    return x;
}

function createState(ls) {
  const ps = {
    ls,
    errors: [],
    ast: createExpr(),
    state: "parsing"
  };
  ps.ast.type = exprTypes.ROOT;
}

function generateTestingState() {
  const t1 = createToken();
  t1.type = tokenTypes.NUMBER;
  t1.literalValue = "2";
  const t2 = createToken();
  t2.lexeme = "+";
  t2.type = tokenTypes.PLUS;
  const t3 = createToken();
  t3.type = tokenTypes.NUMBER;
  t3.literalValue = "1";
  const x = createState(null);
  x.ast.children.push(
    createBinaryExpr(
      createLiteralExpr(t1), 
      createLiteralExpr(t3),
      t2,
      ));
  return x;
}

function astPrinter(ps) {
    const parenthesize = (name, expr) => {
        let x = "";
        x += "(" + name;
        for (let ii of expr.children) {
            x += " ";
            if (false) {
            } else if (ii.type === exprTypes.BINARY) {
                x += parenthesize(ii.children[2].lexeme, ii.children[0], ii.children[1]);
            } else if (ii.type === exprTypes.GROUPING) {
                x += parenthesize("group", ii);
            } else if (ii.type === exprTypes.LITERAL) {
                if (ii.children[0].literalValue == null) {
                    x += "nil";
                } else {
                    x += ii.children[0].literalValue;
                }
            } else if (ii.type === exprTypes.UNARY) {
                x += parenthesize(ii.children[1].lexeme, ii.children[0]);
            } else {
                ps.errors.push("unknown expression type: " + a.type);
            }
        }
        x += ")";
        return x;
    }
    return parenthesize(ps.ast);
}

export default {
    astPrinter,
    generateTestingState
}