
export enum Type {
	Integer = 'Integer',
	Float = 'Float',
	Boolean = 'Boolean',
	Char = 'Char',
	String = 'String',
}

export const Types = {
	'int': Type.Integer,
	'float': Type.Float,
	'bool': Type.Boolean,
	'char': Type.Char,
	'string': Type.String,
} as any;

export const CompoundTypes = [
	'list',
	'dict',
]

export class Lexer {
	// private tokenList: Array<Token> = [];
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

		this.analyzeTokens(tokensWithJoinedStrings);

		this.printToFile("./lab1/p1.tokens", tokensWithJoinedStrings);
	}

	printToFile(outFile: string, wordList: Array<string>) {
		const fs = require('fs');
		fs.writeFileSync(outFile, wordList.map((token: string) => token === "\n" ? "\\n" : token).join("\n"));
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

	analyzeTokens(tokens: Array<string>) {
		let index = 0;
		while (index < tokens.length) {
			let token = tokens[index];
			if (token === "var" || token === "const") {
				index = this.validateDeclaration(token === "const", tokens, index);
			} else {
				index++;
			}
		}
	}

	validateDeclaration(constant: boolean, tokens: Array<string>, index: number): number {
		let token;// = tokens[index];
		index++;
		const identifier = tokens[index];
		this.validateIdentifier(identifier);
		index++;
		if (tokens[index] !== ":") {
			throw new Error("Expected ':'");
		}			
		index++;
		let type: Type = this.getType(tokens[index])
		console.log("Found new declaration:", identifier, type, constant ? "Constant" : "Variable");
		return ++index;
	}

	validateIdentifier(token: string) {
		if (!token.match(/^[a-zA-Z0-9]*[a-zA-Z][a-zA-Z0-9]*$/)) {
			throw new Error("Invalid identifier: " + token);
		}
	}

	getType(token: string): Type {
		if (Types[token] === null) {
			throw new Error("Invalid type: " + token);
		}
		return Types[token];
	}
}