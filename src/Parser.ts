import { Token } from './Lexer';
import { Expression } from './Model/Expressions/Expression';
import { MethodCallExpression } from './Model/Expressions/MethodCallExpression';
import { ReadExpression } from './Model/Expressions/ReadExpression';
import { ValueExpression } from './Model/Expressions/ValueExpression';
import { VariableExpression } from './Model/Expressions/VariableExpression';
import { CompoundStatement } from './Model/Statements/CompoundStatement';
import { DeclarationStatement } from './Model/Statements/DeclarationStatement';
import { FunctionDeclarationStatement } from './Model/Statements/FunctionDeclarationStatement';
import { PrintStatement } from './Model/Statements/PrintStatement';
import { Statement } from './Model/Statements/Statement';
import { BooleanType } from './Model/Types/BooleanType';
import { FloatType } from './Model/Types/FloatType';
import { IntegerType } from './Model/Types/IntegerType';
import { StringType } from './Model/Types/StringType';
import { Type } from './Model/Types/Type';
import { FloatValue } from './Model/Values/FloatValue';
import { IntegerValue } from './Model/Values/IntegerValue';

export class Parser {
	private tokens: Token[];
	private currentTokenIndex: number = 0;
	private statements: Statement[] = [];

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
		if (this.match('NEWLINE')) {
			this.currentTokenIndex++;
			return this.parseStatement();
		} else if (this.match('DECLARATION')) {
			return this.parseDeclaration();
		} else if (this.match('IO')) {
			return this.parsePrint();
		} else if (this.match('CONTROL')) {
			return this.parseControl();
		}
		throw new Error(`Unexpected token ${this.tokens[this.currentTokenIndex].value} at index ${this.currentTokenIndex}.`);
	}

	private parseControl(): Statement {
		const controlType = this.tokens[this.currentTokenIndex].value;
		if (controlType === 'func') {
			return this.parseFunctionDeclaration();
		}
		throw new Error(`Invalid control token ${this.tokens[this.currentTokenIndex].value} at index ${this.currentTokenIndex}.`);
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

		const body: Statement[] = [];

		// TODO: Implement body parsing

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
			let paren = 1;
			this.currentTokenIndex++;
			const expressionList = [];
			while (paren) {
				expressionList.push(this.parseExpression());
				if (this.match('COMMA')) {
					this.currentTokenIndex++;
				}
				if (this.match('CLOSE_PAREN')) {
					paren--;
				} else if (this.match('OPEN_PAREN')) {
					paren++;
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
			token.type === 'NEWLINE' && index > this.currentTokenIndex
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

				expressionIndex++;
				if (expressionTokens[expressionIndex].type !== 'CLOSE_PAREN') {
					throw new Error(`Expected ) at index ${this.currentTokenIndex}.`);
				}

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
				expressionIndex++;
				let paren = 1;
				const expressionList = [];
				while (paren) {
					if (expressionTokens[expressionIndex].type === 'CLOSE_PAREN') {
						paren--;
						if (paren === 0) {
							break;
						}
					} else if (expressionTokens[expressionIndex].type === 'OPEN_PAREN') {
						paren++;
					}
					expressionList.push(this.parsePartialExpression(expressionTokens, expressionIndex));
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
						expressionList
					)
				);
				expressionIndex++;
			}
		}
		this.currentTokenIndex = newLineIndex + 1;

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
	// 	let paren = 1;
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
