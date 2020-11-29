export const tokenTypes = {
    // Single-character tokens.
    LEFT_PAREN: 0, RIGHT_PAREN: 10, LEFT_BRACE: 20, RIGHT_BRACE: 30,
    COMMA: 40, DOT: 50, MINUS: 60, PLUS: 70, SEMICOLON: 80, SLASH: 90, STAR: 100,

    // One or two character tokens.
    BANG: 110, BANG_EQUAL: 120,
    EQUAL: 130, EQUAL_EQUAL: 140,
    GREATER: 150, GREATER_EQUAL: 160,
    LESS: 170, LESS_EQUAL: 180,

    // Literals.
    IDENTIFIER: 190, STRING: 200, NUMBER: 210,

    // Keywords.
    AND: 220, CLASS: 230, ELSE: 240, FALSE: 250, FUN: 260, FOR: 270, IF: 280, NIL: 290, OR: 300,
    PRINT: 310, RETURN: 320, SUPER: 330, THIS: 340, TRUE: 350, VAR: 360, WHILE: 370,

    EOF: 380
}