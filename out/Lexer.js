"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = exports.keywords = exports.Keyword = exports.separators = exports.Separator = exports.operators = exports.Operator = exports.TokenType = void 0;
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Identifier"] = 0] = "Identifier";
    TokenType[TokenType["Operator"] = 1] = "Operator";
    TokenType[TokenType["Separator"] = 2] = "Separator";
    TokenType[TokenType["Keyword"] = 3] = "Keyword";
    TokenType[TokenType["Integer"] = 4] = "Integer";
    TokenType[TokenType["Float"] = 5] = "Float";
    TokenType[TokenType["Boolean"] = 6] = "Boolean";
    TokenType[TokenType["Character"] = 7] = "Character";
    TokenType[TokenType["String"] = 8] = "String";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
// + - * / ^ = < <= == >= && || != !
var Operator;
(function (Operator) {
    Operator[Operator["Plus"] = 0] = "Plus";
    Operator[Operator["Minus"] = 1] = "Minus";
    Operator[Operator["Multiply"] = 2] = "Multiply";
    Operator[Operator["Divide"] = 3] = "Divide";
    Operator[Operator["Power"] = 4] = "Power";
    Operator[Operator["Assign"] = 5] = "Assign";
    Operator[Operator["LessThan"] = 6] = "LessThan";
    Operator[Operator["LessThanOrEqual"] = 7] = "LessThanOrEqual";
    Operator[Operator["Equal"] = 8] = "Equal";
    Operator[Operator["GreaterThanOrEqual"] = 9] = "GreaterThanOrEqual";
    Operator[Operator["GreaterThan"] = 10] = "GreaterThan";
    Operator[Operator["And"] = 11] = "And";
    Operator[Operator["Or"] = 12] = "Or";
    Operator[Operator["NotEqual"] = 13] = "NotEqual";
    Operator[Operator["No"] = 14] = "No";
})(Operator = exports.Operator || (exports.Operator = {}));
exports.operators = {
    '+': Operator.Plus,
    '-': Operator.Minus,
    '*': Operator.Multiply,
    '/': Operator.Divide,
    '^': Operator.Power,
    '=': Operator.Assign,
    '<': Operator.LessThan,
    '<=': Operator.LessThanOrEqual,
    '==': Operator.Equal,
    '>=': Operator.GreaterThanOrEqual,
    '>': Operator.GreaterThan,
    '&&': Operator.And,
    '||': Operator.Or,
    '!=': Operator.NotEqual,
    '!': Operator.No
};
// [ ] { } ( ) : ; space newline
var Separator;
(function (Separator) {
    Separator[Separator["LeftBracket"] = 0] = "LeftBracket";
    Separator[Separator["RightBracket"] = 1] = "RightBracket";
    Separator[Separator["LeftBrace"] = 2] = "LeftBrace";
    Separator[Separator["RightBrace"] = 3] = "RightBrace";
    Separator[Separator["LeftParenthesis"] = 4] = "LeftParenthesis";
    Separator[Separator["RightParenthesis"] = 5] = "RightParenthesis";
    Separator[Separator["Colon"] = 6] = "Colon";
    Separator[Separator["Semicolon"] = 7] = "Semicolon";
    Separator[Separator["Dot"] = 8] = "Dot";
    Separator[Separator["Quote"] = 9] = "Quote";
    Separator[Separator["DoubleQuote"] = 10] = "DoubleQuote";
    Separator[Separator["Space"] = 11] = "Space";
    Separator[Separator["Newline"] = 12] = "Newline";
    Separator[Separator["Tab"] = 13] = "Tab";
})(Separator = exports.Separator || (exports.Separator = {}));
exports.separators = {
    '[': Separator.LeftBracket,
    ']': Separator.RightBracket,
    '{': Separator.LeftBrace,
    '}': Separator.RightBrace,
    '(': Separator.LeftParenthesis,
    ')': Separator.RightParenthesis,
    ':': Separator.Colon,
    ';': Separator.Semicolon,
    '.': Separator.Dot,
    '\'': Separator.Quote,
    '\"': Separator.DoubleQuote,
    ' ': Separator.Space,
    '\n': Separator.Newline,
    '\t': Separator.Tab,
};
// var
// const
// int
// float
// bool
// char
// str
// list
// dict
// if
// else
// while
// do
// for
// in
// break
// continue
// return
// func
// true
// false
// pi
// e
// null
var Keyword;
(function (Keyword) {
    Keyword[Keyword["Variable"] = 0] = "Variable";
    Keyword[Keyword["Constant"] = 1] = "Constant";
    Keyword[Keyword["Integer"] = 2] = "Integer";
    Keyword[Keyword["Float"] = 3] = "Float";
    Keyword[Keyword["Boolean"] = 4] = "Boolean";
    Keyword[Keyword["Character"] = 5] = "Character";
    Keyword[Keyword["String"] = 6] = "String";
    Keyword[Keyword["List"] = 7] = "List";
    Keyword[Keyword["Dictionary"] = 8] = "Dictionary";
    Keyword[Keyword["If"] = 9] = "If";
    Keyword[Keyword["Else"] = 10] = "Else";
    Keyword[Keyword["While"] = 11] = "While";
    Keyword[Keyword["Do"] = 12] = "Do";
    Keyword[Keyword["For"] = 13] = "For";
    Keyword[Keyword["In"] = 14] = "In";
    Keyword[Keyword["Break"] = 15] = "Break";
    Keyword[Keyword["Continue"] = 16] = "Continue";
    Keyword[Keyword["Return"] = 17] = "Return";
    Keyword[Keyword["Function"] = 18] = "Function";
    Keyword[Keyword["True"] = 19] = "True";
    Keyword[Keyword["False"] = 20] = "False";
    Keyword[Keyword["Pi"] = 21] = "Pi";
    Keyword[Keyword["E"] = 22] = "E";
    Keyword[Keyword["Null"] = 23] = "Null";
})(Keyword = exports.Keyword || (exports.Keyword = {}));
exports.keywords = {
    'var': Keyword.Variable,
    'const': Keyword.Constant,
    'int': Keyword.Integer,
    'float': Keyword.Float,
    'bool': Keyword.Boolean,
    'char': Keyword.Character,
    'str': Keyword.String,
    'list': Keyword.List,
    'dict': Keyword.Dictionary,
    'if': Keyword.If,
    'else': Keyword.Else,
    'while': Keyword.While,
    'do': Keyword.Do,
    'for': Keyword.For,
    'in': Keyword.In,
    'break': Keyword.Break,
    'continue': Keyword.Continue,
    'return': Keyword.Return,
    'func': Keyword.Function,
    'true': Keyword.True,
    'false': Keyword.False,
    'pi': Keyword.Pi,
    'e': Keyword.E,
    'null': Keyword.Null,
};
class Lexer {
    constructor(fileName) {
        this.fileName = fileName;
        this.tokenList = [];
        const fs = require('fs');
        const contents = fs.readFileSync(fileName, 'utf8');
        this.tokenize(contents);
    }
    tokenize(contents) {
        let position = 0;
        const tokens = [];
        while (position < contents.length) {
            let token;
            [token, position] = this.getNextToken(position, contents);
            if (token) {
                tokens.push(token);
            }
        }
        this.tokenList = tokens;
        // console.log(this.tokenList);
        for (let token of this.tokenList) {
            console.log("Type: ", token.type, " - Value: ", token.value);
        }
    }
    getNextToken(position, contents) {
        let token = null;
        let newPosition = position;
        const nextSeparatorPosition = Math.min(...Object.keys(exports.separators).map((separator) => {
            const separatorPosition = contents.indexOf(separator, position);
            if (separatorPosition === -1) {
                return Infinity;
            }
            else {
                return separatorPosition;
            }
        }));
        const unclassifiedToken = contents.substring(position, nextSeparatorPosition);
        newPosition = nextSeparatorPosition + 1;
        token = this.classifyToken(unclassifiedToken);
        return [token, newPosition];
    }
    classifyToken(unclassifiedToken) {
        let type = null;
        let value = null;
        if (unclassifiedToken in exports.operators) {
            type = TokenType.Operator;
            value = exports.operators[unclassifiedToken];
        }
        else if (unclassifiedToken in exports.separators) {
            type = TokenType.Separator;
            value = exports.separators[unclassifiedToken];
        }
        else if (unclassifiedToken in exports.keywords) {
            type = TokenType.Keyword;
            value = exports.keywords[unclassifiedToken];
        }
        else if (unclassifiedToken.match(/^[0-9]+$/)) {
            type = TokenType.Integer;
            value = parseInt(unclassifiedToken);
        }
        else if (unclassifiedToken.match(/^[0-9]*\.[0-9]+$/)) {
            type = TokenType.Float;
            value = parseFloat(unclassifiedToken);
        }
        else if (unclassifiedToken.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
            type = TokenType.Identifier;
            value = unclassifiedToken;
        }
        else if (unclassifiedToken.match(/^'.'$/)) {
            type = TokenType.Character;
            value = unclassifiedToken;
        }
        else if (unclassifiedToken.match(/^"(.*)"$/)) {
            type = TokenType.String;
            value = unclassifiedToken;
        }
        else {
            console.log(`Unrecognized token: ${unclassifiedToken}`);
        }
        if (type && value) {
            return {
                type,
                value
            };
        }
        else {
            return null;
        }
    }
}
exports.Lexer = Lexer;
