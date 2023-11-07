import { Expression } from "./Expression";
import { Value } from "../Values/Value";
import { Statement } from "../Statements/Statement";
import SymbolTable from "../ADT/SymbolTable";

export class FunctionBodyExpression implements Expression {
	constructor(
		public statements: Statement[]
	) { }

	evaluate(symbolTable: SymbolTable): Value {
		// Evaluate the statements within the function body
		let result = null;
		for (const statement of this.statements) {
			result = statement.execute(symbolTable);
		}
		return result;
	}

	typeCheck(typeEnvironment: Map<string, Type>): Type {
		// Type-checking for a function body expression, if needed
		// You can implement this based on your language's type system.
	}

	toString(): string {
		return this.statements.map(statement => statement.toString()).join("\n");
	}

	deepCopy(): Expression {
		return new FunctionBodyExpression(this.statements.map(statement => statement.deepCopy()));
	}
}
