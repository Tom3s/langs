export class Token {
	constructor(public type: string, public value: string) { }
}

export class Lexer {
	private input: string;
	private position: number = 0;
	private currentChar: string | null = null;

	// constructor(input: string) {
	constructor(fileName: string) {
		const fs = require('fs');
		const path = require('path');
		const filePath = path.join(__dirname, fileName);
		const input = fs.readFileSync(filePath, 'utf-8');

		this.input = input.replace(/\r\n/g, '\n');
		this.currentChar = this.input[0];
	}

	private nextChar(): string | null {
		this.position++;
		if (this.position < this.input.length) {
			return this.input[this.position];
		} else {
			return null;
		}
	}

	private skipWhitespace() {
		while (this.currentChar !== null && /\s/.test(this.currentChar) && !/\n/.test(this.currentChar) && !/\r/.test(this.currentChar)) {
			this.currentChar = this.nextChar();
		}
	}

	private isAlpha(char: string) {
		return /[a-zA-Z_]/.test(char);
	}

	private isAlphanumeric(char: string) {
		return /[a-zA-Z0-9_]/.test(char);
	}

	private validIdentifier(value: string) {
		return /^[a-zA-Z0-9]*[a-zA-Z][a-zA-Z0-9]*$/.test(value);
	}

	private getNextToken(): Token | null {
		while (this.currentChar !== null) {
			if (/\n/.test(this.currentChar) || /\r/.test(this.currentChar)) {
				// Handle newline characters (CR, LF, or CRLF)
				this.currentChar = this.nextChar();
				return new Token('NEWLINE', '\n');
			}

			if (/\s/.test(this.currentChar)) {
				this.skipWhitespace();
				continue;
			}

			if (this.isAlpha(this.currentChar)) {
				let value = '';
				while (this.currentChar !== null && this.isAlphanumeric(this.currentChar)) {
					value += this.currentChar;
					this.currentChar = this.nextChar();
				}

				// Check for keywords or identifiers
				if (value === 'var' || value === 'const') {
					return new Token('DECLARATION', value);
				} else if (value === 'int' || value === 'float' || value === 'bool' || value === 'str' || value === 'list') {
					return new Token('TYPE', value);
				} else if (value === 'if' || value === 'else' || value === 'while' || value === 'do' || value === 'for' || value === 'break' || value === 'continue' || value === 'return' || value === 'func' || value === 'in') {
					return new Token('CONTROL', value);
				} else if (value === 'print' || value === 'read' || value === 'readln') {
					return new Token('IO', value);
				} else if (value === 'true' || value === 'false') {
					return new Token('BOOLEAN', value);
				} else if (value === 'pi' || value === 'e' || value === 'null') {
					return new Token('CONSTANT', value);
				} else if (this.validIdentifier(value)) {
					return new Token('IDENTIFIER', value);
				} else {
					throw new Error('Invalid identifier: ' + value);
				}
			}

			if (this.currentChar === '(') {
				this.currentChar = this.nextChar();
				return new Token('OPEN_PAREN', '(');
			} else if (this.currentChar === ')') {
				this.currentChar = this.nextChar();
				return new Token('CLOSE_PAREN', ')');
			} else if (this.currentChar === '{') {
				this.currentChar = this.nextChar();
				return new Token('OPEN_BRACE', '{');
			} else if (this.currentChar === '}') {
				this.currentChar = this.nextChar();
				return new Token('CLOSE_BRACE', '}');
			}

			// Add more conditions for operators, numbers, strings, and other tokens.

			// Example for '+':
			if (this.currentChar === '+') {
				// this.currentChar = this.nextChar();
				// return new Token('ARITHMETIC_OPERATOR', '+');
				if (this.input[this.position + 1] === '+') {
					this.currentChar = this.nextChar();
					this.currentChar = this.nextChar();
					return new Token('INCREMENT', '++');
				} else {
					this.currentChar = this.nextChar();
					return new Token('ARITHMETIC_OPERATOR', '+');
				}
			} else if (this.currentChar === '-') {
				if (this.input[this.position + 1] === '>') {
					this.currentChar = this.nextChar();
					this.currentChar = this.nextChar();
					return new Token('ARROW', '->');
				} else if (this.input[this.position + 1] === '-') {
					this.currentChar = this.nextChar();
					this.currentChar = this.nextChar();
					return new Token('DECREMENT', '--');
				} else {
					this.currentChar = this.nextChar();
					return new Token('ARITHMETIC_OPERATOR', '-');
				}
			} else if (this.currentChar === '*') {
				// this.currentChar = this.nextChar();
				// return new Token('ARITHMETIC_OPERATOR', '*');
				if (this.input[this.position + 1] === '/') {
					this.currentChar = this.nextChar();
					this.currentChar = this.nextChar();
					return new Token('COMMENT_END', '*/');
				} else {
					this.currentChar = this.nextChar();
					return new Token('ARITHMETIC_OPERATOR', '*');
				}
			} else if (this.currentChar === '/') {
				// this.currentChar = this.nextChar();
				// return new Token('ARITHMETIC_OPERATOR', '/');
				if (this.input[this.position + 1] === '/') {
					this.currentChar = this.nextChar();
					this.currentChar = this.nextChar();
					return new Token('COMMENT', '//');
				} else if (this.input[this.position + 1] === '*') {
					this.currentChar = this.nextChar();
					this.currentChar = this.nextChar();
					return new Token('COMMENT_START', '/*');
				} else {
					this.currentChar = this.nextChar();
					return new Token('ARITHMETIC_OPERATOR', '/');
				}
			} else if (this.currentChar === '%') {
				this.currentChar = this.nextChar();
				return new Token('ARITHMETIC_OPERATOR', '%');
			} else if (this.currentChar === '^') {
				this.currentChar = this.nextChar();
				return new Token('ARITHMETIC_OPERATOR', '^');
			} else if (this.currentChar === '=') {
				if (this.input[this.position + 1] === '=') {
					this.currentChar = this.nextChar();
					this.currentChar = this.nextChar();
					return new Token('RELATIONAL_OPERATOR', '==');
				} else {
					this.currentChar = this.nextChar();
					return new Token('ASSIGN', '=');
				}
			} else if (this.currentChar === '>') {
				if (this.input[this.position + 1] === '=') {
					this.currentChar = this.nextChar();
					this.currentChar = this.nextChar();
					return new Token('RELATIONAL_OPERATOR', '>=');
				} else {
					this.currentChar = this.nextChar();
					return new Token('RELATIONAL_OPERATOR', '>');
				}
			} else if (this.currentChar === '<') {
				if (this.input[this.position + 1] === '=') {
					this.currentChar = this.nextChar();
					this.currentChar = this.nextChar();
					return new Token('RELATIONAL_OPERATOR', '<=');
				} else {
					this.currentChar = this.nextChar();
					return new Token('RELATIONAL_OPERATOR', '<');
				}
			} else if (this.currentChar === '!') {
				if (this.input[this.position + 1] === '=') {
					this.currentChar = this.nextChar();
					this.currentChar = this.nextChar();
					return new Token('RELATIONAL_OPERATOR', '!=');
				} else {
					this.currentChar = this.nextChar();
					return new Token('RELATIONAL_OPERATOR', '!');
				}
			} else if (this.currentChar === '&') {
				if (this.input[this.position + 1] === '&') {
					this.currentChar = this.nextChar();
					this.currentChar = this.nextChar();
					return new Token('RELATIONAL_OPERATOR', '&&');
				} else {
					throw new Error('Invalid operator: ' + this.currentChar);
				}
			} else if (this.currentChar === '|') {
				if (this.input[this.position + 1] === '|') {
					this.currentChar = this.nextChar();
					this.currentChar = this.nextChar();
					return new Token('RELATIONAL_OPERATOR', '||');
				} else {
					throw new Error('Invalid operator: ' + this.currentChar);
				}
			}

			// Handle numbers
			if (/[0-9]/.test(this.currentChar)) {
				let value = '';
				while (this.currentChar !== null && /[0-9.]/.test(this.currentChar)) {
					value += this.currentChar;
					this.currentChar = this.nextChar();
				}
				return new Token('NUMBER', value);
			}

			// Handle strings (double-quoted or single-quoted)
			if (this.currentChar === '"' || this.currentChar === "'") {
				const quoteChar = this.currentChar;
				this.currentChar = this.nextChar();
				let value = '';
				while (this.currentChar !== null && this.currentChar !== quoteChar) {
					value += this.currentChar;
					this.currentChar = this.nextChar();
				}
				if (this.currentChar === quoteChar) {
					this.currentChar = this.nextChar();
					return new Token('STRING', quoteChar + value + quoteChar);
				} else {
					throw new Error('Unterminated string');
				}
			}
			// Add more conditions for other operators, numbers, strings, and other tokens.

			if (this.currentChar === ':') {
				this.currentChar = this.nextChar();
				return new Token('COLON', ':');
			} else if (this.currentChar === '.') {
				this.currentChar = this.nextChar();
				return new Token('DOT', '.');
			} else if (this.currentChar === ',') {
				this.currentChar = this.nextChar();
				return new Token('COMMA', ',');
			} else if (this.currentChar === '?') {
				this.currentChar = this.nextChar();
				return new Token('QUESTION', '?');
			}

			throw new Error('Invalid character: ' + this.currentChar);
		}
		return null;
	}

	public tokenize(): Token[] {
		const tokens: Token[] = [];
		let token = this.getNextToken();
		try {
			while (token !== null) {
				tokens.push(token);
				token = this.getNextToken();
			}
			return tokens;
		} catch (error: any) {
			console.log(error?.message);
			this.printError();
			throw error;
		}
	}

	private printError() {
		let line = 0;
		let index = 0;
		let lastLineIndex = 0;
		while (index < this.position) {
			if (this.input[index] === '\n') {
				line++;
				lastLineIndex = index;
			}
			index++;
		}
		const nextNewline = this.input.indexOf('\n', this.position);
		const lineText = this.input.substring(lastLineIndex + 1, nextNewline);
		const lineNumber = line + 1;
		const column = this.position - lastLineIndex;
		console.log('Lexical error at line ' + lineNumber + ' column ' + column + ': ' + lineText);
		console.log(lineText);
		console.log(' '.repeat(column - 1) + '^');
	}
}


