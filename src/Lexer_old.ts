import SymbolTable from "./SymbolTable";

export enum Type {
	Integer = 'Integer',
	Float = 'Float',
	Boolean = 'Boolean',
	Char = 'Char',
	String = 'String',
	Void = 'Void',
}

export const Types = {
	'int': Type.Integer,
	'float': Type.Float,
	'bool': Type.Boolean,
	'char': Type.Char,
	'string': Type.String,
	'void': Type.Void,
} as any;

export const CompoundTypes = [
	'list',
	'dict',
]

export class Lexer {
	// private tokenList: Array<Token> = [];
	constructor(
		private fileName: string,
		private symbolTable: SymbolTable,
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

		const tokens = ignoredCommentsContent.split(/([ \n\t\r.\":()\[\]{},])/).filter((token: string) => {
			return token !== "" /*&& token !== " "*/ && token !== "\t" && token !== "\r";
		})

		// const ignoredComments = this.ignoreComments(tokens);
		const tokensWithJoinedStrings = this.joinStrings(tokens);

		try {
			this.analyzeTokens(tokensWithJoinedStrings);
		} catch (error: any) {
			console.log(error?.message);
		}

		this.printToFile(this.fileName + ".tokens", tokensWithJoinedStrings);
	}

	printToFile(outFile: string, wordList: Array<string>) {
		const fs = require('fs');
		fs.writeFileSync(outFile, wordList.map((token: string) => token === "\n" ? "\\n" : token).join("\n"));
	}

	// joinStrings(tokens: Array<string>) {
	// 	let joinedTokens: Array<string> = [];
	// 	let stringStartIndex = -1;
	// 	let stringEndIndex = -1;
	// 	let lastIndex = 0;
	// 	let string = "";

	// 	for (let i = 0; i < tokens.length; i++) {
	// 		const token = tokens[i];
	// 		if (token === "\"") {
	// 			lastIndex = i;
	// 			if (stringStartIndex === -1) {
	// 				stringStartIndex = i + 1;
	// 			} else {
	// 				stringEndIndex = i - 1;
	// 			}
	// 		}

	// 		if (stringStartIndex !== -1 && stringEndIndex !== -1) {
	// 			string = tokens.slice(stringStartIndex, stringEndIndex + 1).join("");
	// 			joinedTokens = joinedTokens.concat(tokens.slice(0, stringStartIndex));
	// 			joinedTokens.push(string);
	// 			// joinedTokens = joinedTokens.concat(tokens.slice(stringEndIndex + 1));
	// 			i = stringEndIndex + 1;
	// 			stringStartIndex = -1;
	// 			stringEndIndex = -1;
	// 			string = "";
	// 		}
	// 	}

	// 	joinedTokens = joinedTokens.concat(tokens.indexOf("\"", lastIndex) === -1 ? tokens : tokens.slice(tokens.indexOf("\"", lastIndex)));

	// 	return joinedTokens.filter((token: string) => token !== " ");
	// }
	joinStrings(tokens: Array<string>) {
		let joinedTokens: Array<string> = [];
		let insideString = false;
		let currentString = "";
	
		for (let i = 0; i < tokens.length; i++) {
			const token = tokens[i];
	
			if (token === "\"") {
				if (insideString) {
					insideString = false;
					joinedTokens.push('"')
					joinedTokens.push(currentString);
					joinedTokens.push('"')
					currentString = "";
				} else {
					insideString = true;
				}
			} else {
				if (insideString) {
					currentString += token;
				} else {
					joinedTokens.push(token);
				}
			}
		}
	
		return joinedTokens.filter((token: string) => token !== " ");
	}
	

	analyzeTokens(tokens: Array<string>) {
		let index = 0;
		while (index < tokens.length) {
			let token = tokens[index];
			if (token === "var" || token === "const") {
				index = this.validateDeclaration(token === "const", tokens, index);
			} else if (token === "=") {
				index = this.validateAssignment(tokens, index);
			} else if (token === "func") {
				index = this.validateFunction(tokens, index);
			} else if (token === "for") {
				index = this.validateFor(tokens, index);
			} else if (token === "while") {
				index = this.validateWhile(tokens, index);
			} else {
				index++;
			}
		}
		this.symbolTable.printAll();
	}

	validateFunction(tokens: Array<string>, index: number): number {
		// func gcd(a: int, b: int) -> int {
		index++;
		const identifier = tokens[index];
		this.validateIdentifier(identifier);
		index++;
		if (tokens[index] !== "(") {
			throw new Error("Expected '('");
		}
		index++;
		const closingParenthesisIndex = tokens.indexOf(")", index);
		const parameters = tokens.slice(index, closingParenthesisIndex);
		const parameterList = this.validateParameters(parameters);
		index = closingParenthesisIndex + 1;
		if (tokens[index] !== "->") {
			throw new Error("Expected '->' for return type");
		}
		index++;
		const returnType = this.getType(tokens[index], true);
		index++;
		if (tokens[index] !== "{") {
			throw new Error("Expected '{' for function body");
		}

		console.log("Found new function:", identifier, parameterList, "->", returnType);

		this.symbolTable.add(identifier, -1);

		return index;
	}

	validateFor(tokens: Array<string>, index: number): number {
		// for variable in list { code } - for loop
		// for variable in variable { code } - for effectivly range(number)
		// for (init) (stop) (post) { code } - for loop
		index++;
		if (tokens[index] === "(") {
			// for (init) (stop) (post) { code } - for loop
			index++;
			index = this.validateParenthesisExpression(tokens, index);
			if (tokens[index] !== "(") {
				throw new Error("Expected '(' for stop condition");
			}
			index++;
			index = this.validateParenthesisExpression(tokens, index);
			// console.log("Stop condition:", tokens.slice(index, tokens.indexOf(")", index)));
			if (tokens[index] !== "(") {
				throw new Error("Expected '(' for post condition");
			}
			index++;
			index = this.validateParenthesisExpression(tokens, index);
			if (tokens[index] !== "{") {
				throw new Error("Expected '{' for for loop body");
			}
			index++;
			index = this.validateBracketsExpression(tokens, index);

			return index;

		} else if (this.symbolTable.get(tokens[index]) !== undefined) {
			throw new Error("For loop variable already declared");
		} else {
			index++;
			if (tokens[index] !== "in") {
				throw new Error("Expected keyword 'in'");
			}
			index++;
			if (this.symbolTable.get(tokens[index]) === undefined) {
				throw new Error("Iterable variable not declared");
			} else {
				// TODO: check if iterable
			}
			index++;
			if (tokens[index] !== "{") {
				throw new Error("Expected '{' for for loop body");
			}
			index = this.validateBracketsExpression(tokens, index);

			return index;
		}
	}

	validateWhile(tokens: Array<string>, index: number): number {
		// while condition { code }
		index++;
		index = this.validateConditionExpression(tokens, index);
		if (tokens[index] !== "{") {
			throw new Error("Expected '{' for while loop body");
		}
		index++;
		index = this.validateBracketsExpression(tokens, index);

		return index;
	
	}

	validateParameters(tokens: Array<string>) {
		let index = 0;
		const parameters = [];
		while (index < tokens.length) {
			const argumentName = tokens[index];
			this.validateIdentifier(argumentName);
			index++;
			if (tokens[index] !== ":") {
				throw new Error("Expected ':' type in function parameter declaration");
			}
			index++;
			const type = this.getType(tokens[index]);
			index++;
			if (index < tokens.length && tokens[index] !== ",") {
				throw new Error("Expected ','");
			}
			parameters.push({ name: argumentName, type });
			index++;
		}
		return parameters;
	}


	validateAssignment(tokens: Array<string>, index: number): number {
		let identifier = tokens[index - 1];
		if (Types[identifier] !== undefined) {
			identifier = tokens[index - 3];
		}
		this.symbolTable.get(identifier);
		return this.validateExpression(tokens, index + 1);
	}

	validateExpression(tokens: Array<string>, index: number): number {
		const expressionEndIndex = tokens.indexOf("\n", index);
		console.log("Expression:", tokens.slice(index, expressionEndIndex));
		return expressionEndIndex + 1;
	}
	
	validateConditionExpression(tokens: Array<string>, index: number): number {
		const expressionEndIndex = tokens.indexOf("{", index);
		console.log("Condition expression:", tokens.slice(index, expressionEndIndex));
		// TODO: verify if bool
		return expressionEndIndex;
	}

	validateParenthesisExpression(tokens: Array<string>, index: number): number {
		const nextOpeningParenthesisIndex = tokens.indexOf("(", index + 1);
		const originalIndex = index;
		let expressionEndIndex = tokens.indexOf(")", index);
		if (nextOpeningParenthesisIndex !== -1 && nextOpeningParenthesisIndex < expressionEndIndex) {
			index = this.validateParenthesisExpression(tokens, nextOpeningParenthesisIndex + 1);
			expressionEndIndex = tokens.indexOf(")", index);
		}
		console.log("Parenthesis Expression:", tokens.slice(originalIndex, expressionEndIndex));
		return expressionEndIndex + 1;
	}

	validateBracketsExpression(tokens: Array<string>, index: number): number {
		const nextOpeningBracketIndex = tokens.indexOf("{", index + 1);
		const originalIndex = index;
		let expressionEndIndex = tokens.indexOf("}", index);
		if (nextOpeningBracketIndex !== -1 && nextOpeningBracketIndex < expressionEndIndex) {
			index = this.validateBracketsExpression(tokens, nextOpeningBracketIndex + 1);
			expressionEndIndex = tokens.indexOf("}", index);
		}
		console.log("Brackets Expression:", tokens.slice(originalIndex, expressionEndIndex));
		return expressionEndIndex + 1;
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
		this.symbolTable.add(identifier, 0);
		console.log("Found new declaration:", identifier, type, constant ? "Constant" : "Variable");
		return ++index;
	}

	validateIdentifier(token: string) {
		if (!token.match(/^[a-zA-Z0-9]*[a-zA-Z][a-zA-Z0-9]*$/)) {
			throw new Error("Invalid identifier: " + token);
		}
	}

	getType(token: string, voidable: boolean = false): Type {
		if (token === "void") {
			if (!voidable) {
				throw new Error("Void only allowed in return type");
			}
		} else if (Types[token] === null) {
			throw new Error("Invalid type: " + token);
		}
		return Types[token];
	}
}