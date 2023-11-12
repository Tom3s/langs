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
import { FloatValue } from './Model/Values/FloatValue';
import { IntegerValue } from './Model/Values/IntegerValue';
import { StringValue } from './Model/Values/StringValue';

export class Parser {
	private tokens: Token[];
	private currentTokenIndex: number = 0;
	private statements: Statement[] = [];
	private parentheses: number = 0;

	constructor(tokens: Token[]) {
		this.tokens = tokens;
	}

	parse(): void {
		// const statements: Statement[] = [];

		while (this.currentTokenIndex < this.tokens.length) {
			const statement = this.parseStatement();
			console.log(statement);
			this.statements.push(statement);
		}

	}

	private match(tokenType: string) {
		// Check if the current token matches the expected token type.
		return this.tokens[this.currentTokenIndex].type === tokenType;
	}

	// Example parsing method for statements
	private parseStatement(): Statement {
		// if (this.match('NEWLINE')) {
		// 	this.currentTokenIndex++;
		// 	return this.parseStatement();
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
			this.parentheses++;
			this.currentTokenIndex++;
			const expressionList = [];
			while (this.parentheses) {
				expressionList.push(this.parseExpression());
				if (this.match('COMMA')) {
					this.currentTokenIndex++;
				}
				if (this.match('CLOSE_PAREN')) {
					this.parentheses--;
				} else if (this.match('OPEN_PAREN')) {
					this.parentheses++;
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
		const nextNewLine = this.tokens.find((token, index) =>
			(token.type === 'NEWLINE' || token.type === 'OPEN_BRACE')
			&& index > this.currentTokenIndex
		)
		if (nextNewLine === undefined) {
			throw new Error('Expected newline.');
		}
		const newLineIndex = this.tokens.indexOf(nextNewLine);
		const expressionTokens = this.tokens.slice(this.currentTokenIndex, newLineIndex);

		const expressions: Expression[] = [];
		let expressionIndex = 0;
		while (expressionIndex < expressionTokens.length) {
			if (expressionTokens[expressionIndex].type === 'IDENTIFIER') {
				expressions.push(
					new VariableExpression(
						expressionTokens[expressionIndex].value
					)
				);
				expressionIndex++;
			} else if (expressionTokens[expressionIndex].type === 'IO') {
				if (expressionTokens[expressionIndex].value !== 'read') {
					throw new Error(`Expected read at index ${this.currentTokenIndex}.`);
				}

				expressionIndex++;
				if (expressionTokens[expressionIndex].type !== 'OPEN_PAREN') {
					throw new Error(`Expected ( at index ${this.currentTokenIndex}.`);
				}
				this.parentheses++;

				expressionIndex++;
				if (expressionTokens[expressionIndex].type !== 'CLOSE_PAREN') {
					throw new Error(`Expected ) at index ${this.currentTokenIndex}.`);
				}
				this.parentheses--;

				expressions.push(
					new ReadExpression()
				);
				expressionIndex++;
			} else if (expressionTokens[expressionIndex].type === 'NUMBER') {
				const value = expressionTokens[expressionIndex].value;
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
			} else if (expressionTokens[expressionIndex].type === 'DOT') {
				expressionIndex++;
				if (expressionTokens[expressionIndex].type !== 'IDENTIFIER') {
					throw new Error(`Expected identifier at index ${this.currentTokenIndex}.`);
				}

				const methodIdentifier = expressionTokens[expressionIndex];
				expressionIndex++;
				if (expressionTokens[expressionIndex].type !== 'OPEN_PAREN') {
					throw new Error(`Expected ( at index ${this.currentTokenIndex}.`);
				}
				this.parentheses++;
				expressionIndex++;
				// let paren = 1;
				const expressionList = [];
				while (this.parentheses) {
					if (expressionTokens[expressionIndex].type === 'CLOSE_PAREN') {
						this.parentheses--;
						if (this.parentheses === 0) {
							break;
						}
					} else if (expressionTokens[expressionIndex].type === 'OPEN_PAREN') {
						this.parentheses++;
					}
					this.currentTokenIndex += expressionIndex;
					expressionList.push(this.parseExpression());
					if (expressionTokens[expressionIndex].type === 'COMMA') {
						expressionIndex++;
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
						expressionList.filter(expression => expression instanceof NOPExpression)
					)
				);
				expressionIndex++;

			} else if (expressionTokens[expressionIndex].type === 'OPEN_PAREN') {
				expressionIndex++;
				this.parentheses++;
				// let paren = 1;
				const expressionList = [];
				while (this.parentheses) {
					if (expressionTokens[expressionIndex].type === 'CLOSE_PAREN') {
						this.parentheses--;
						if (this.parentheses === 0) {
							break;
						}
					} else if (expressionTokens[expressionIndex].type === 'OPEN_PAREN') {
						this.parentheses++;
					}
					this.currentTokenIndex += expressionIndex + 1;
					expressionList.push(this.parseExpression());
					if (expressionTokens[expressionIndex].type === 'COMMA') {
						expressionIndex++;
					}
				}
				const identifier = expressions.pop();
				if (identifier === undefined) {
					throw new Error('Expected identifier.');
				}
				expressions.push(
					new FunctionCallExpression(
						(identifier as VariableExpression).identifier,
						expressionList.filter(expression => expression instanceof NOPExpression)
					)
				);
				expressionIndex++;

			} else if (expressionTokens[expressionIndex].type === 'CLOSE_PAREN') {
				this.parentheses--;
				expressionIndex++;
			} else if (expressionTokens[expressionIndex].type === 'RELATIONAL_OPERATOR') {
				const operator = expressionTokens[expressionIndex].value;
				expressionIndex++;
				const left = expressions.pop();
				if (left === undefined) {
					throw new Error('Expected left operand.');
				}
				this.currentTokenIndex += expressionIndex;
				const right = this.parseExpression();
				expressions.push(
					new RelationalExpression(
						left,
						right,
						operator as RelationalOperator
					)
				);
			} else if (expressionTokens[expressionIndex].type === 'ARITHMETIC_OPERATOR') {
				const operator = expressionTokens[expressionIndex].value;
				expressionIndex++;
				const left = expressions.pop();
				if (left === undefined) {
					throw new Error('Expected left operand.');
				}
				this.currentTokenIndex += expressionIndex;
				const right = this.parseExpression();
				expressions.push(
					new ArithmeticExpression(
						left,
						right,
						operator as ArithmeticOperator
					)
				);
			} else if (expressionTokens[expressionIndex].type === 'STRING') {
				const value: string = expressionTokens[expressionIndex].value as string;
				expressions.push(
					new ValueExpression(
						new StringValue(
							value.substring(1, value.length - 1)
						)
					)
				);
				expressionIndex++;
			} else if (expressionTokens[expressionIndex].type === 'COMMA') {
				this.currentTokenIndex += expressionIndex;
				return expressions[0];
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

	private parsePartialExpression(expressionTokens: Token[], expressionIndex: number): Expression {
		throw new Error('Not implemented.');
	}

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
