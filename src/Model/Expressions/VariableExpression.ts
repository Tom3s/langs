import SymbolTable from "../ADT/SymbolTable";
import { Type } from "../Types/Type";
import { Value } from "../Values/Value";
import { Expression } from "./Expression";

export class VariableExpression implements Expression {
	constructor (
		public identifier: string,
	) { }

	evaluate(symbolTable: SymbolTable): Value {
		// return symbolTable.get(this.identifier);
		const value = symbolTable.get(this.identifier);
		if (value === undefined) {
			throw new Error(`Variable ${this.identifier} not defined`);
		}
		return value;
	}

	typeCheck(typeEnvironment: Map<string, Type>): Type {
		const value = typeEnvironment.get(this.identifier);
		if (value === undefined) {
			throw new Error(`Variable ${this.identifier} not defined`);
		}
		return value;
	}

	toString(): string {
		return this.identifier;
	}

	deepCopy(): Expression {
		return new VariableExpression(this.identifier);
	}
}