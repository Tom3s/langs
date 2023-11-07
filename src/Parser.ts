import { Token } from './Lexer';
import { Expression } from './Model/Expressions/Expression';
import { DeclarationStatement } from './Model/Statements/DeclarationStatement';
import { Statement } from './Model/Statements/Statement';
import { BooleanType } from './Model/Types/BooleanType';
import { FloatType } from './Model/Types/FloatType';
import { IntegerType } from './Model/Types/IntegerType';
import { StringType } from './Model/Types/StringType';
import { Type } from './Model/Types/Type';

export class Parser {
	private tokens: Token[];
	private currentTokenIndex: number = 0;

	constructor(tokens: Token[]) {
		this.tokens = tokens;
	}

	parse(): void {
		const statements: Statement[] = [];
	
		while (this.currentTokenIndex < this.tokens.length) {
			const statement = this.parseStatement();
			console.log(statement);
			statements.push(statement);
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
		}
		throw new Error(`Unexpected token ${this.tokens[this.currentTokenIndex].value} at index ${this.currentTokenIndex}.`);
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
		if (!this.match('EQUALS')) {
			return new DeclarationStatement(identifier.value, this.typeObjectFromString(type.value), constant);
		}
		this.currentTokenIndex++;
		const expression = this.parseExpression();
		return new DeclarationStatement(identifier.value, this.typeObjectFromString(type.value), constant, expression);
	}

	private parseExpression(): Expression {
		throw new Error('Not implemented.');
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
