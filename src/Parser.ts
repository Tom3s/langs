import { Token } from './Lexer';
import { ArithmeticExpression, ArithmeticOperator } from './Model/Expressions/ArithmeticExpression';
import { Expression } from './Model/Expressions/Expression';
import { FunctionCallExpression } from './Model/Expressions/FunctionCallExpression';
import { MethodCallExpression } from './Model/Expressions/MethodCallExpression';
import { NOPExpression } from './Model/Expressions/NOPExpression';
import { ReadExpression } from './Model/Expressions/ReadExpression';
import { RelationalExpression, RelationalOperator } from './Model/Expressions/RelationalExpression';
import { ValueExpression } from './Model/Expressions/ValueExpression';
import { VariableExpression } from './Model/Expressions/VariableExpression';
import { AssignStatement } from './Model/Statements/AssignStatement';
import { CompoundStatement } from './Model/Statements/CompoundStatement';
import { DeclarationStatement } from './Model/Statements/DeclarationStatement';
import { FunctionDeclarationStatement } from './Model/Statements/FunctionDeclarationStatement';
import { IfStatement } from './Model/Statements/IfStatement';
import { PrintStatement } from './Model/Statements/PrintStatement';
import { ReturnStatement } from './Model/Statements/ReturnStatement';
import { Statement } from './Model/Statements/Statement';
import { WhileStatement } from './Model/Statements/WhileStatement';
import { BooleanType } from './Model/Types/BooleanType';
import { FloatType } from './Model/Types/FloatType';
import { IntegerType } from './Model/Types/IntegerType';
import { StringType } from './Model/Types/StringType';
import { Type } from './Model/Types/Type';
import { BooleanValue } from './Model/Values/BooleanValue';
import { FloatValue } from './Model/Values/FloatValue';
import { IntegerValue } from './Model/Values/IntegerValue';
import { StringValue } from './Model/Values/StringValue';

export class Parser {
	private tokens: Token[];
	private currentTokenIndex: number = 0;
	private statements: Statement[] = [];
	private parentheses: number = 0;
	private commentState: number = 0;

	constructor(tokens: Token[]) {
		this.tokens = tokens;
	}

	getProgram(): CompoundStatement {
		return new CompoundStatement(this.statements);
	}

	parse(): void {
		// const statements: Statement[] = [];

		while (this.currentTokenIndex < this.tokens.length) {
			try {
				const statement = this.parseStatement();
				console.log(statement);
				this.statements.push(statement);
			} catch (error: any) {
				console.log(error?.message);
				this.printError();
				throw error;
			}
		}

	}

	private printError() {
		let line = 0;
		let index = 0;
		while (index < this.currentTokenIndex) {
			if (this.tokens[index].type === 'NEWLINE') {
				line++;
			}
			index++;
		}
		console.log(`Error at line ${line + 1} at token ${this.tokens[this.currentTokenIndex].value}.`);
	}

	private match(tokenType: string) {
		// Check if the current token matches the expected token type.
		return this.currentTokenIndex < this.tokens.length && 
			this.tokens[this.currentTokenIndex].type === tokenType;
	}

	// Example parsing method for statements
	private parseStatement(): Statement {
		// if (this.match('NEWLINE')) {
		// 	this.currentTokenIndex++;
		// 	return this.parseStatement();
		if (this.match('COMMENT') || this.match('COMMENT_START')) {
			this.skipComment();
		}
		while (this.match('NEWLINE')) {
			this.currentTokenIndex++;
		}
		if (this.match('DECLARATION')) {
			return this.parseDeclaration();
		} else if (this.match('IO')) {
			return this.parsePrint();
		} else if (this.match('CONTROL')) {
			return this.parseControl();
		} else if (this.match('IDENTIFIER')) {
			return this.parseIdentifierStatement();
		}
		throw new Error(`Unexpected token ${this.tokens[this.currentTokenIndex].value} at index ${this.currentTokenIndex}.`);
	}

	private skipComment() {
		if (this.match('COMMENT')) {
			while (!this.match('NEWLINE')) {
				this.currentTokenIndex++;
			}
			return;
		} else if (this.match('COMMENT_START')) {
			this.commentState++;
			this.currentTokenIndex++;
			while (this.commentState) {
				if (this.match('COMMENT_START')) {
					this.commentState++;
				} else if (this.match('COMMENT_END')) {
					this.commentState--;
				}
				this.currentTokenIndex++;
			}
			return;
		}
		
	}
	private parseIdentifierStatement(): Statement {
		const identifier = this.tokens[this.currentTokenIndex];
		this.currentTokenIndex++;
		if (this.match('ASSIGN')) {
			this.currentTokenIndex++;
			const expression = this.parseExpression();
			return new AssignStatement(
				identifier.value,
				expression
			);
		}
		throw new Error(`Unexpected token ${this.tokens[this.currentTokenIndex].value} at index ${this.currentTokenIndex}.`);
	}

	private parseControl(): Statement {
		const controlType = this.tokens[this.currentTokenIndex].value;
		if (controlType === 'func') {
			return this.parseFunctionDeclaration();
		} else if (controlType === 'while') {
			return this.parseWhile();
		} else if (controlType === 'if') {
			return this.parseIf();
		} else if (controlType === 'return') {
			return this.parseReturn();
		}
		throw new Error(`Invalid control token ${this.tokens[this.currentTokenIndex].value} at index ${this.currentTokenIndex}.`);
	}

	private parseReturn(): Statement {
		this.currentTokenIndex++;
		if (this.match('NEWLINE')) {
			return new ReturnStatement(null);
		}
		const expression = this.parseExpression();
		return new ReturnStatement(expression);
	}

	private parseIf(): Statement {
		this.currentTokenIndex++;
		const condition = this.parseExpression();
		if (!this.match('OPEN_BRACE')) {
			throw new Error(`Expected { at index ${this.currentTokenIndex}.`);
		}
		this.currentTokenIndex++;
		const body: Statement[] = [];
		let brace = 1;
		let closeBraceIndex = this.currentTokenIndex;
		closeBraceIndex++;
		while (brace) {
			if (this.tokens[closeBraceIndex].type === 'CLOSE_BRACE') {
				brace--;
				if (brace === 0) {
					break;
				}
			} else if (this.tokens[closeBraceIndex].type === 'OPEN_BRACE') {
				brace++;
			}
			closeBraceIndex++;
		}

		this.currentTokenIndex++;
		while (this.currentTokenIndex < closeBraceIndex) {
			body.push(this.parseStatement());
		}
		this.currentTokenIndex = closeBraceIndex + 1;

		if (this.tokens[this.currentTokenIndex].value !== 'else') {
			return new IfStatement(
				condition,
				new CompoundStatement(body)
			);
		}

		this.currentTokenIndex++;
		if (!this.match('OPEN_BRACE')) {
			throw new Error(`Expected { at index ${this.currentTokenIndex}.`);
		}
		this.currentTokenIndex++;
		const elseBody: Statement[] = [];
		brace = 1;
		closeBraceIndex = this.currentTokenIndex;
		closeBraceIndex++;
		while (brace) {
			if (this.tokens[closeBraceIndex].type === 'CLOSE_BRACE') {
				brace--;
				if (brace === 0) {
					break;
				}
			} else if (this.tokens[closeBraceIndex].type === 'OPEN_BRACE') {
				brace++;
			}
			closeBraceIndex++;
		}

		this.currentTokenIndex++;
		while (this.currentTokenIndex < closeBraceIndex) {
			elseBody.push(this.parseStatement());
		}

		this.currentTokenIndex = closeBraceIndex + 2;

		return new IfStatement(
			condition,
			new CompoundStatement(body),
			new CompoundStatement(elseBody)
		);
	}

	private parseWhile(): Statement {
		this.currentTokenIndex++;
		const condition = this.parseExpression();
		if (!this.match('OPEN_BRACE')) {
			throw new Error(`Expected { at index ${this.currentTokenIndex}.`);
		}
		this.currentTokenIndex++;
		const body: Statement[] = [];
		let brace = 1;
		let closeBraceIndex = this.currentTokenIndex;
		closeBraceIndex++;
		while (brace) {
			if (this.tokens[closeBraceIndex].type === 'CLOSE_BRACE') {
				brace--;
				if (brace === 0) {
					break;
				}
			} else if (this.tokens[closeBraceIndex].type === 'OPEN_BRACE') {
				brace++;
			}
			closeBraceIndex++;
		}
		this.currentTokenIndex++;
		while (this.currentTokenIndex < closeBraceIndex) {
			body.push(this.parseStatement());
		}
		this.currentTokenIndex = closeBraceIndex + 2;
		return new WhileStatement(
			condition,
			new CompoundStatement(body)
		);
	}

	private parseFunctionDeclaration(): FunctionDeclarationStatement {
		this.currentTokenIndex++;
		if (this.tokens[this.currentTokenIndex].type !== 'IDENTIFIER') {
			throw new Error(`Expected function identifier at index ${this.currentTokenIndex}, got ${this.tokens[this.currentTokenIndex].value} instead.`)
		}
		const functionIdentifier = this.tokens[this.currentTokenIndex].value;
		this.currentTokenIndex++;
		const parameters: DeclarationStatement[] = [];
		if (this.tokens[this.currentTokenIndex].value !== '(') {
			throw new Error(`Expected ( at index ${this.currentTokenIndex}, got ${this.tokens[this.currentTokenIndex].value} instead.`)
		}
		this.currentTokenIndex++;
		while (true) {
			if (this.tokens[this.currentTokenIndex].type !== 'IDENTIFIER') {
				throw new Error(`Expected parameter identifier at index ${this.currentTokenIndex}, got ${this.tokens[this.currentTokenIndex].value} instead.`)
			}

			const parameterIdentifier = this.tokens[this.currentTokenIndex].value;
			this.currentTokenIndex++;

			if (this.tokens[this.currentTokenIndex].value !== ':') {
				throw new Error(`Expected : at index ${this.currentTokenIndex}, got ${this.tokens[this.currentTokenIndex].value} instead.`)
			}
			this.currentTokenIndex++;

			if (this.tokens[this.currentTokenIndex].type !== 'TYPE') {
				throw new Error(`Expected type at index ${this.currentTokenIndex}, got ${this.tokens[this.currentTokenIndex].value} instead.`)
			}
			const parameterType = this.typeObjectFromString(this.tokens[this.currentTokenIndex].value);

			parameters.push(
				new DeclarationStatement(parameterIdentifier, parameterType, false)
			);
			this.currentTokenIndex++;

			if (this.tokens[this.currentTokenIndex].value === ')') {
				break;
			} else if (this.tokens[this.currentTokenIndex].value !== ',') {
				throw new Error(`Expected , at index ${this.currentTokenIndex}, got ${this.tokens[this.currentTokenIndex].value} instead.`)
			}
			this.currentTokenIndex++;
		}

		this.currentTokenIndex++;

		if (this.tokens[this.currentTokenIndex].type !== 'ARROW') {
			throw new Error(`Expected -> at index ${this.currentTokenIndex}, got ${this.tokens[this.currentTokenIndex].value} instead.`)
		}
		this.currentTokenIndex++;

		if (this.tokens[this.currentTokenIndex].type !== 'TYPE') {
			throw new Error(`Expected return type at index ${this.currentTokenIndex}, got ${this.tokens[this.currentTokenIndex].value} instead.`)
		}
		const returnType = this.typeObjectFromString(this.tokens[this.currentTokenIndex].value);

		this.currentTokenIndex++;

		if (this.tokens[this.currentTokenIndex].type !== 'OPEN_BRACE') {
			throw new Error(`Expected { at index ${this.currentTokenIndex}, got ${this.tokens[this.currentTokenIndex].value} instead.`)
		}

		// TODO: Implement body parsing
		const body: Statement[] = [];

		let brace = 1;
		let closeBraceIndex = this.currentTokenIndex;
		closeBraceIndex++;
		while (brace) {
			if (this.tokens[closeBraceIndex].type === 'CLOSE_BRACE') {
				brace--;
				if (brace === 0) {
					break;
				}
			} else if (this.tokens[closeBraceIndex].type === 'OPEN_BRACE') {
				brace++;
			}
			closeBraceIndex++;
		}
		// closeBraceIndex++;
		this.currentTokenIndex++;
		while (this.currentTokenIndex < closeBraceIndex) {
			body.push(this.parseStatement());
		}

		this.currentTokenIndex = closeBraceIndex + 2;


		return new FunctionDeclarationStatement(
			functionIdentifier,
			parameters,
			returnType,
			new CompoundStatement(body)
		)
	}

	private parseDeclaration(): Statement {
		const constant = this.tokens[this.currentTokenIndex].value !== 'var';
		this.currentTokenIndex++;
		const identifier = this.tokens[this.currentTokenIndex];
		if (!this.match('IDENTIFIER')) {
			throw new Error(`Expected identifier at index ${this.currentTokenIndex}.`);
		}
		this.currentTokenIndex++;
		if (!this.match('COLON')) {
			throw new Error(`Expected : at index ${this.currentTokenIndex}.`);
		}
		this.currentTokenIndex++;
		const type = this.tokens[this.currentTokenIndex];
		this.currentTokenIndex++;
		if (!this.match('ASSIGN')) {
			return new DeclarationStatement(identifier.value, this.typeObjectFromString(type.value), constant);
		}
		this.currentTokenIndex++;
		const expression = this.parseExpression();
		return new DeclarationStatement(identifier.value, this.typeObjectFromString(type.value), constant, expression);
	}

	private parsePrint(): Statement {
		if (this.tokens[this.currentTokenIndex].value === 'print') {
			this.currentTokenIndex++;
			if (!this.match('OPEN_PAREN')) {
				throw new Error(`Expected ( at index ${this.currentTokenIndex}.`);
			}
			// let paren = 1;
			const expressionParentheses = this.parentheses;
			this.parentheses++;
			this.currentTokenIndex++;
			const expressionList = [];
			while (this.parentheses > expressionParentheses) {
				expressionList.push(this.parseExpression());
				if (this.match('COMMA')) {
					this.currentTokenIndex++;
				}
				if (this.match('CLOSE_PAREN')) {
					this.parentheses--;
					this.currentTokenIndex++;
				} else if (this.match('OPEN_PAREN')) {
					this.parentheses++;
					this.currentTokenIndex++;
				}
			}
			this.currentTokenIndex++;
			return new PrintStatement(
				expressionList
			);
		}
		throw new Error(`Expected print at index ${this.currentTokenIndex}.`);
	}

	private parseExpression(): Expression {

		

		const expressionParentheses = this.parentheses;
		const nextNewLine = this.tokens.find((token, index) =>
			(token.type === 'NEWLINE' || token.type === 'OPEN_BRACE')
			&& index > this.currentTokenIndex
		)
		if (nextNewLine === undefined) {
			throw new Error('Expected newline.');
		}
		const newLineIndex = this.tokens.indexOf(nextNewLine);
		const parseExpTokens = this.tokens.slice(this.currentTokenIndex, newLineIndex);

		const expressions: Expression[] = [];

		// let this.currentTokenIndex = 0;
		while (this.currentTokenIndex < newLineIndex) {
			if (this.match('COMMENT') || this.match('COMMENT_START')) {
				this.skipComment();
			}
			if (this.match('IDENTIFIER')) {
				expressions.push(
					new VariableExpression(
						this.tokens[this.currentTokenIndex].value
					)
				);
				this.currentTokenIndex++;
			} else if (this.match('IO')) {
				if (this.tokens[this.currentTokenIndex].value !== 'read') {
					throw new Error(`Expected read at index ${this.currentTokenIndex}.`);
				}

				this.currentTokenIndex++;
				if (this.tokens[this.currentTokenIndex].type !== 'OPEN_PAREN') {
					throw new Error(`Expected ( at index ${this.currentTokenIndex}.`);
				}
				this.parentheses++;

				this.currentTokenIndex++;
				if (this.tokens[this.currentTokenIndex].type !== 'CLOSE_PAREN') {
					throw new Error(`Expected ) at index ${this.currentTokenIndex}.`);
				}
				this.parentheses--;

				expressions.push(
					new ReadExpression()
				);
				this.currentTokenIndex++;
			} else if (this.match('NUMBER')) {
				const value = this.tokens[this.currentTokenIndex].value;
				if (value.indexOf('.') !== -1) {
					expressions.push(
						new ValueExpression(
							new FloatValue(parseFloat(value))
						)
					);
				} else {
					expressions.push(
						new ValueExpression(
							new IntegerValue(parseInt(value))
						)
					);
				}
				this.currentTokenIndex++;
			} else if (this.match('DOT')) {
				this.currentTokenIndex++;
				if (this.tokens[this.currentTokenIndex].type !== 'IDENTIFIER') {
					throw new Error(`Expected identifier at index ${this.currentTokenIndex}.`);
				}

				const methodIdentifier = this.tokens[this.currentTokenIndex];
				this.currentTokenIndex++;
				if (this.tokens[this.currentTokenIndex].type !== 'OPEN_PAREN') {
					throw new Error(`Expected ( at index ${this.currentTokenIndex}.`);
				}
				const localParentheses = this.parentheses;
				this.parentheses++;
				this.currentTokenIndex++;
				// let paren = 1;
				const expressionList = [];
				while (this.parentheses > localParentheses) {
					if (this.match('CLOSE_PAREN')) {
						this.parentheses--;
						if (this.parentheses === localParentheses) {
							break;
						}
					} else if (this.match('OPEN_PAREN')) {
						this.parentheses++;
					}
					this.currentTokenIndex++;
					expressionList.push(this.parseExpression());
					if (this.match('COMMA')) {
						this.currentTokenIndex++;
					}
				}
				const methodObject = expressions.pop();
				if (methodObject === undefined) {
					throw new Error('Expected method object.');
				}
				expressions.push(
					new MethodCallExpression(
						methodObject,
						methodIdentifier.value,
						expressionList.filter(expression => !(expression instanceof NOPExpression))
					)
				);
				this.currentTokenIndex++;

			} else if (this.match('OPEN_PAREN')) {
				const localParentheses = this.parentheses;
				this.currentTokenIndex++;
				this.parentheses++;
				// let paren = 1;
				const expressionList = [];
				while (this.parentheses > localParentheses) {
					if (this.match('CLOSE_PAREN')) {
						this.parentheses--;
						this.currentTokenIndex++;
						if (this.parentheses === localParentheses) {
							break;
						}
					} else if (this.match('OPEN_PAREN')) {
						this.parentheses++;
						this.currentTokenIndex++;
					}
					expressionList.push(this.parseExpression());
					if (this.match('COMMA')) {
						this.currentTokenIndex++;
					}
				}
				const identifier = expressions.pop();
				if (identifier === undefined) {
					throw new Error('Expected identifier.');
				}
				expressions.push(
					new FunctionCallExpression(
						(identifier as VariableExpression).identifier,
						expressionList.filter(expression => !(expression instanceof NOPExpression))
					)
				);
				this.currentTokenIndex++;

			} else if (this.match('CLOSE_PAREN')) {
				this.parentheses--;
				this.currentTokenIndex++;
				if (expressionParentheses === this.parentheses) {
					if (expressions.length === 0) {
						return new NOPExpression();
					}
					return expressions[0];
				}
			} else if (this.match('RELATIONAL_OPERATOR')) {
				const operator = this.tokens[this.currentTokenIndex].value;
				this.currentTokenIndex++;
				const left = expressions.pop();
				if (left === undefined) {
					throw new Error('Expected left operand.');
				}
				const right = this.parseExpression();
				expressions.push(
					new RelationalExpression(
						left,
						right,
						operator as RelationalOperator
					)
				);
			} else if (this.match('ARITHMETIC_OPERATOR')) {
				const operator = this.tokens[this.currentTokenIndex].value;
				this.currentTokenIndex++;
				const left = expressions.pop();
				if (left === undefined) {
					throw new Error('Expected left operand.');
				}
				const right = this.parseExpression();
				expressions.push(
					new ArithmeticExpression(
						left,
						right,
						operator as ArithmeticOperator
					)
				);
			} else if (this.match('STRING')) {
				const value: string = this.tokens[this.currentTokenIndex].value as string;
				expressions.push(
					new ValueExpression(
						new StringValue(
							value.substring(1, value.length - 1)
						)
					)
				);
				this.currentTokenIndex++;
			} else if (this.match('BOOLEAN')) {
				const value: string = this.tokens[this.currentTokenIndex].value as string;
				expressions.push(
					new ValueExpression(
						new BooleanValue(
							value === 'true'
						)
					)
				);
				this.currentTokenIndex++;
			} else if (this.match('COMMA')) {
				this.currentTokenIndex++;
				return expressions[0];
			} else {
				throw new Error(`Unexpected token ${this.tokens[this.currentTokenIndex].value} at index ${this.currentTokenIndex}.`);
			}
		}
		this.currentTokenIndex = newLineIndex + 1;

		if (this.tokens[newLineIndex].type === 'OPEN_BRACE') {
			this.currentTokenIndex = newLineIndex;
		}

		if (expressions.length === 0) {
			return new NOPExpression();
		}

		return expressions[0];

		throw new Error(`Unexpected token ${this.tokens[this.currentTokenIndex].value} at index ${this.currentTokenIndex}.`);
	}

	// private parsePartialExpression(this.tokens: Token[], this.currentTokenIndex: number): Expression {
	// 	throw new Error('Not implemented.');
	// }

	// private parseMethodCall(): Expression {
	// 	this.currentTokenIndex++;
	// 	const methodIdentifier = this.tokens[this.currentTokenIndex];
	// 	if (!this.match('OPEN_PAREN')) {
	// 		throw new Error(`Expected ( at index ${this.currentTokenIndex}.`);
	// 	}
	// 	// let paren = 1;
	// 	this.currentTokenIndex++;
	// 	const expressionList = [];
	// 	while (paren) {
	// 		expressionList.push(this.parseExpression());
	// 		if (this.match('COMMA')) {
	// 			this.currentTokenIndex++;
	// 		}
	// 		if (this.match('CLOSE_PAREN')) {
	// 			paren--;
	// 		} else if (this.match('OPEN_PAREN')) {
	// 			paren++;
	// 		}
	// 	}
	// 	this.currentTokenIndex++;
	// 	return new MethodCallExpression(
	// 		methodIdentifier.value,
	// 		expressionList
	// 	);
	// }

	private parseIO(): Expression {
		if (this.tokens[this.currentTokenIndex].value === 'read') {
			this.currentTokenIndex++;
			if (!this.match('OPEN_PAREN')) {
				throw new Error(`Expected ( at index ${this.currentTokenIndex}.`);
			}
			this.currentTokenIndex++;
			if (!this.match('CLOSE_PAREN')) {
				throw new Error(`Expected ) at index ${this.currentTokenIndex}.`);
			}
			this.currentTokenIndex++;
			return new ReadExpression();
		}
		throw new Error(`Expected read at index ${this.currentTokenIndex}.`);
	}

	typeObjectFromString(type: string): Type {
		switch (type) {
			case 'bool':
				return new BooleanType();
			case 'int':
				return new IntegerType();
			case 'float':
				return new FloatType();
			case 'str':
				return new StringType();
			case 'list':
				throw new Error('List type not implemented.');
			case 'void':
				throw new Error('Cannot declare a variable of type void.');
			default:
				throw new Error(`Unknown type ${type}.`);
		}
	}
}
