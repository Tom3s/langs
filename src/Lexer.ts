
export enum TokenType {
	Identifier,
	Operator,
	Separator,
	Keyword,
	Integer,
	Float,
	Boolean,
	Character,
	String
}

// + - * / ^ = < <= == >= && || != !
export enum Operator {
	Plus,
	Minus,
	Multiply,
	Divide,
	Power,
	Assign,
	LessThan,
	LessThanOrEqual,
	Equal,
	GreaterThanOrEqual,
	GreaterThan,
	And,
	Or,
	NotEqual,
	No,
}


export const operators = {
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
} as any;

// [ ] { } ( ) : ; space newline
export enum Separator {
	LeftBracket,
	RightBracket,
	LeftBrace,
	RightBrace,
	LeftParenthesis,
	RightParenthesis,
	Colon,
	Semicolon,
	Dot,
	Quote,
	DoubleQuote,
	Space,
	Newline,
	Tab,
}

export const separators = {
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
} as any;

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
export enum Keyword {
	Variable,
	Constant,
	Integer,
	Float,
	Boolean,
	Character,
	String,
	List,
	Dictionary,
	If,
	Else,
	While,
	Do,
	For,
	In,
	Break,
	Continue,
	Return,
	Function,
	True,
	False,
	Pi,
	E,
	Null
}

export const keywords = {
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
} as any;


export type Token = {
	type: TokenType;
	value: string | number | null;
}



export class Lexer {
	private tokenList: Array<Token> = [];
	constructor(
		private fileName: string,
	) {
		const fs = require('fs');
		const contents = fs.readFileSync(fileName, 'utf8');

		this.tokenize(contents);
	}

	tokenize(contents: string) {
		let position = 0;
		// const tokens = []; 

		const ignoredCommentsContent = contents.replace(/\/\/.*(\r\n|\r|\n)/g, "$1");
		console.log(ignoredCommentsContent);

		const tokens = ignoredCommentsContent.split(/([ \n\t\r.\":()\[\]{}])/).filter((token: string) => {
			return token !== "" /*&& token !== " "*/ && token !== "\t" && token !== "\r";
		})

		// const ignoredComments = this.ignoreComments(tokens);
		const tokensWithJoinedStrings = this.joinStrings(tokens);

		console.log(tokensWithJoinedStrings);
		const fs = require('fs');
		fs.writeFileSync('./lab1/p1.tokens', tokensWithJoinedStrings.map((token: string) => token === "\n" ? "\\n" : token).join("\n"));
	}

	joinStrings(tokens: Array<string>) {
		let joinedTokens: Array<string> = [];
		let stringStartIndex = -1;
		let stringEndIndex = -1;
		let lastIndex = 0;
		let string = "";

		for (let i = 0; i < tokens.length; i++) {
			const token = tokens[i];
			if (token === "\"") {
				lastIndex = i;
				if (stringStartIndex === -1) {
					stringStartIndex = i + 1;
				} else {
					stringEndIndex = i - 1;
				}
			}

			if (stringStartIndex !== -1 && stringEndIndex !== -1) {
				string = tokens.slice(stringStartIndex, stringEndIndex + 1).join("");
				joinedTokens = joinedTokens.concat(tokens.slice(0, stringStartIndex));
				joinedTokens.push(string);
				// joinedTokens = joinedTokens.concat(tokens.slice(stringEndIndex + 1));
				i = stringEndIndex + 1;
				stringStartIndex = -1;
				stringEndIndex = -1;
				string = "";
			}
		}

		joinedTokens = joinedTokens.concat(tokens.indexOf("\"", lastIndex) === -1 ? tokens : tokens.slice(tokens.indexOf("\"", lastIndex)));

		return joinedTokens.filter((token: string) => token !== " ");
	}
	
}